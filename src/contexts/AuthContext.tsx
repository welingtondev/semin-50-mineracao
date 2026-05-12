import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";

// ── Types ──
export interface UserProfile {
  id: string;
  email?: string;
  full_name?: string;
  nickname: string;
  phone?: string;
  max_score: number;
  max_score_month?: string;
  consent_lgpd: boolean;
}

interface AuthContextType {
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<string | null>;
  register: (data: RegisterData) => Promise<string | null>;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  setProfile: (p: UserProfile | null) => void;
}

interface RegisterData {
  full_name: string;
  email: string;
  password: string;
  nickname: string;
  phone: string;
  consent_lgpd: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// ── Hook ──
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside <AuthProvider>");
  return ctx;
}

// Helper: race a promise against a timeout
function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`Timeout: ${label} (${ms}ms)`)), ms)
    ),
  ]);
}

// ── Provider ──
export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Track if login/register is handling profile load to avoid duplicate work
  const manualAuthInProgress = useRef(false);

  // ── Load profile from Supabase ──
  const loadProfile = useCallback(async (userId: string): Promise<UserProfile | null> => {
    try {
      console.log("[AUTH] loadProfile for:", userId);
      const { data, error } = await withTimeout(
        supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
        10000,
        "loadProfile"
      );

      if (error) {
        console.error("[AUTH] loadProfile error:", error);
      }

      if (data) {
        console.log("[AUTH] Profile loaded:", data.nickname);
        setProfile(data as UserProfile);
        return data as UserProfile;
      } else {
        // Self-heal: If profile row is missing, generate a fallback one
        console.warn("[AUTH] Profile not found, generating fallback...");
        const { data: sessionData } = await supabase.auth.getSession();
        const user = sessionData?.session?.user;
        const nickname = user?.email?.split("@")[0] || "usuario";

        const fallbackProfile: UserProfile = {
          id: userId,
          email: user?.email,
          full_name: user?.user_metadata?.full_name || nickname,
          nickname: user?.user_metadata?.nickname || nickname,
          phone: "",
          consent_lgpd: true,
          max_score: 0,
        };

        // Attempt to insert it to fix future sessions
        const { error: insertError } = await supabase
          .from("profiles")
          .upsert(fallbackProfile, { onConflict: "id" });
        if (insertError) {
          console.warn("[AUTH] Could not insert fallback profile:", insertError.message);
        }
        setProfile(fallbackProfile);
        return fallbackProfile;
      }
    } catch (e: any) {
      console.error("[AUTH] Critical error in loadProfile:", e?.message || e);
      return null;
    }
  }, []);

  // ── Listen to auth state changes ──
  useEffect(() => {
    let mounted = true;

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, s) => {
        if (!mounted) return;
        // Skip if login/register is handling it directly
        if (manualAuthInProgress.current) return;

        setSession(s);

        if (s?.user) {
          await loadProfile(s.user.id);
        } else {
          setProfile(null);
        }

        if (mounted) setLoading(false);
      }
    );

    // Explicit getSession as fallback
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      if (!mounted || manualAuthInProgress.current) return;
      setSession(s);
      if (s?.user) {
        loadProfile(s.user.id).finally(() => {
          if (mounted) setLoading(false);
        });
      } else {
        setLoading(false);
      }
    }).catch(err => {
      console.error("[AUTH] getSession error:", err);
      if (mounted) setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [loadProfile]);

  // ── Login ──
  const login = useCallback(async (email: string, password: string): Promise<string | null> => {
    try {
      if (!email || !password) return "Email e senha são obrigatórios.";

      const cleanEmail = email.toLowerCase().trim();
      console.log("[AUTH] login() for:", cleanEmail);

      manualAuthInProgress.current = true;

      const { data, error } = await withTimeout(
        supabase.auth.signInWithPassword({ email: cleanEmail, password }),
        15000,
        "signInWithPassword"
      );

      if (error) {
        manualAuthInProgress.current = false;
        console.error("[AUTH] signIn error:", error.message);
        const msg = error.message || "";
        if (msg === "Invalid login credentials" || msg.includes("not found")) {
          return "Senha incorreta ou e-mail não cadastrado.";
        }
        if (msg.includes("Email not confirmed")) {
          return "E-mail não confirmado. Verifique sua caixa de entrada.";
        }
        return msg;
      }

      if (!data.session) {
        manualAuthInProgress.current = false;
        return "E-mail não confirmado. Verifique sua caixa de entrada.";
      }

      console.log("[AUTH] signIn success, loading profile...");
      setSession(data.session);
      await loadProfile(data.session.user.id);

      manualAuthInProgress.current = false;
      setLoading(false);
      console.log("[AUTH] Login complete");
      return null;
    } catch (err: any) {
      manualAuthInProgress.current = false;
      console.error("[AUTH] Login error:", err?.message || err);
      return err?.message || "Erro inesperado ao fazer login.";
    }
  }, [loadProfile]);

  // ── Register ──
  const register = useCallback(async (regData: RegisterData): Promise<string | null> => {
    try {
      const { full_name, email, password, nickname, phone, consent_lgpd } = regData;
      console.log("[AUTH] register() called:", { full_name, email, nickname, consent_lgpd: !!consent_lgpd });

      if (!email || !nickname || !full_name) return "Nome, Email e nickname são obrigatórios.";

      const cleanEmail = email.toLowerCase().trim();
      const cleanNick = nickname.toLowerCase().trim();
      const cleanFullName = full_name.trim();

      // Validations
      if (!consent_lgpd) {
        console.log("[AUTH] LGPD not accepted");
        return "Você deve aceitar os termos da LGPD para se cadastrar.";
      }
      if (!phone || phone.length < 8) return "Por favor, insira um número de telefone válido.";
      if (cleanNick.length < 3 || cleanNick.length > 20 || !/^[a-zA-Z0-9_-]+$/.test(cleanNick)) {
        return "Nickname deve ter 3-20 caracteres (letras, números, _ ou -).";
      }

      // Check nickname uniqueness (with timeout)
      console.log("[AUTH] Checking nickname:", cleanNick);
      let nickResult;
      try {
        nickResult = await withTimeout(
          supabase.from("profiles").select("id").eq("nickname", cleanNick).maybeSingle(),
          10000,
          "nickname check"
        );
      } catch (timeoutErr: any) {
        console.error("[AUTH] Nickname check failed:", timeoutErr.message);
        return "Erro ao verificar nickname. Tente novamente.";
      }
      console.log("[AUTH] Nickname check done:", { exists: !!nickResult.data, error: nickResult.error?.message });

      if (nickResult.error) {
        return "Erro ao verificar nickname. Tente novamente.";
      }
      if (nickResult.data) return "Esse nickname já está em uso.";

      // Signal manual auth
      manualAuthInProgress.current = true;

      // Create auth user
      console.log("[AUTH] Calling signUp...");
      const { data, error } = await withTimeout(
        supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: { data: { nickname: cleanNick, full_name: cleanFullName } },
        }),
        15000,
        "signUp"
      );
      console.log("[AUTH] signUp result:", { hasSession: !!data?.session, hasUser: !!data?.user, error: error?.message });

      if (error) {
        manualAuthInProgress.current = false;
        if (error.message?.includes("already registered")) {
          return "Esse e-mail já está cadastrado.";
        }
        return error.message;
      }

      if (data.user) {
        // Create profile row
        console.log("[AUTH] Creating profile...");
        const { error: profileError } = await withTimeout(
          supabase.from("profiles").upsert({
            id: data.user.id,
            email: cleanEmail,
            full_name: cleanFullName,
            nickname: cleanNick,
            phone,
            consent_lgpd: true,
            max_score: 0,
          }, { onConflict: "id" }),
          10000,
          "profile upsert"
        );

        if (profileError) {
          manualAuthInProgress.current = false;
          console.error("[AUTH] Profile creation error:", profileError);
          return "Erro ao criar perfil: " + profileError.message;
        }
        console.log("[AUTH] Profile created");

        if (data.session) {
          console.log("[AUTH] Auto-confirmed, loading profile...");
          setSession(data.session);
          await loadProfile(data.user.id);
          manualAuthInProgress.current = false;
          setLoading(false);
          console.log("[AUTH] Register complete - logged in");
          return null;
        } else {
          manualAuthInProgress.current = false;
          console.log("[AUTH] Email confirmation required");
          return "CONFIRM_EMAIL";
        }
      }

      manualAuthInProgress.current = false;
      return null;
    } catch (err: any) {
      manualAuthInProgress.current = false;
      console.error("[AUTH] Register error:", err?.message || err);
      return err?.message || "Erro inesperado ao criar conta.";
    }
  }, [loadProfile]);

  // ── Logout ──
  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.error("Logout error:", e);
    }
    setSession(null);
    setProfile(null);
  }, []);

  // ── Delete account (LGPD) ──
  const deleteAccount = useCallback(async () => {
    const { data: { session: s } } = await supabase.auth.getSession();
    if (!s) return;
    await supabase.from("profiles").delete().eq("id", s.user.id);
    await supabase.auth.signOut();
    setSession(null);
    setProfile(null);
  }, []);

  // ── Refresh profile ──
  const refreshProfile = useCallback(async () => {
    if (session?.user) {
      await loadProfile(session.user.id);
    }
  }, [session, loadProfile]);

  return (
    <AuthContext.Provider value={{
      session, profile, loading,
      login, register, logout, deleteAccount, refreshProfile, setProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Trata o preflight request do CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { name, email, cpf, phone, value, billingType } = await req.json();
    const donationValue = parseFloat(value);
    
    // Captura o IP real do usuário para enviar ao Asaas (ajuda muito no antifraude para cartão de crédito)
    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || req.headers.get("x-real-ip") || "";

    // Limpeza de campos (Asaas exige apenas números para CPF/CNPJ e Telefone)
    const sanitizedCpfCnpj = cpf.replace(/\D/g, "");
    const sanitizedPhone = phone.replace(/\D/g, "");

    // Validação de valor mínimo
    if (donationValue < 5.00) {
      throw new Error("O valor mínimo para doação é de R$ 5,00.");
    }

    const ASAAS_API_KEY = Deno.env.get("ASAAS_API_KEY");
    const ASAAS_API_URL = "https://www.asaas.com/api/v3";

    if (!ASAAS_API_KEY) {
      throw new Error("ASAAS_API_KEY não configurada no Supabase.");
    }

    const headers = {
      "access_token": ASAAS_API_KEY,
      "Content-Type": "application/json",
    };

    // 1. Buscar se o cliente já existe pelo CPF/CNPJ
    const searchReq = await fetch(`${ASAAS_API_URL}/customers?cpfCnpj=${sanitizedCpfCnpj}`, {
      method: "GET",
      headers
    });
    const searchRes = await searchReq.json();
    
    let customerId = null;

    if (searchRes.data && searchRes.data.length > 0) {
      // Cliente já existe
      customerId = searchRes.data[0].id;
      console.log("Cliente já existente encontrado:", customerId);
    } else {
      // 2. Criar novo cliente
      const customerReq = await fetch(`${ASAAS_API_URL}/customers`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          name,
          email,
          cpfCnpj: sanitizedCpfCnpj,
          mobilePhone: sanitizedPhone,
        }),
      });

      const customerRes = await customerReq.json();

      if (!customerReq.ok) {
        console.error("Erro ao criar cliente Asaas:", customerRes);
        throw new Error(customerRes.errors?.[0]?.description || "Erro ao cadastrar doador.");
      }
      customerId = customerRes.id;
      console.log("Novo cliente criado:", customerId);
    }

    // 2. Criar a cobrança (Payment)
    const dueDate = new Date(Date.now() + 86400000).toISOString().split("T")[0]; // +1 dia

    const paymentReq = await fetch(`${ASAAS_API_URL}/payments`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        customer: customerId,
        billingType: billingType,
        value: donationValue,
        dueDate: dueDate,
        remoteIp: clientIp || undefined,
        description: "Apoio Oficial: Jubileu de Ouro (50 Anos) da Engenharia de Minas UFBA. Sua contribuição viabiliza este evento histórico!",
      }),
    });

    const paymentRes = await paymentReq.json();

    if (!paymentReq.ok) {
      console.error("Erro ao criar doação Asaas:", paymentRes);
      throw new Error(paymentRes.errors?.[0]?.description || "Erro ao gerar doação.");
    }

    const paymentId = paymentRes.id;
    let pixData = null;

    // 3. Se for PIX, buscar o QR Code
    if (billingType === "PIX") {
      const pixReq = await fetch(`${ASAAS_API_URL}/payments/${paymentId}/pixQrCode`, {
        method: "GET",
        headers,
      });
      pixData = await pixReq.json();
    }

    return new Response(
      JSON.stringify({
        success: true,
        paymentId: paymentId,
        status: paymentRes.status,
        invoiceUrl: paymentRes.invoiceUrl,
        pixData: pixData,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  }
});

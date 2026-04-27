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

    const ASAAS_API_KEY = Deno.env.get("ASAAS_API_KEY");
    
    // O Asaas possui ambientes diferentes para Teste (Sandbox) e Produção.
    // Usaremos a URL de Produção conforme a chave fornecida.
    const ASAAS_API_URL = "https://www.asaas.com/api/v3";

    if (!ASAAS_API_KEY) {
      throw new Error("ASAAS_API_KEY não configurada no Supabase.");
    }

    const headers = {
      "access_token": ASAAS_API_KEY,
      "Content-Type": "application/json",
    };

    // 1. Criar ou buscar o cliente (Customer)
    const customerReq = await fetch(`${ASAAS_API_URL}/customers`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        name,
        email,
        cpfCnpj: cpf,
        mobilePhone: phone,
      }),
    });

    const customerRes = await customerReq.json();

    if (!customerReq.ok) {
      console.error("Erro ao criar cliente Asaas:", customerRes);
      throw new Error(customerRes.errors?.[0]?.description || "Erro ao cadastrar cliente.");
    }

    const customerId = customerRes.id;

    // 2. Criar a cobrança (Payment)
    const dueDate = new Date(Date.now() + 86400000).toISOString().split("T")[0]; // +1 dia

    const paymentReq = await fetch(`${ASAAS_API_URL}/payments`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        customer: customerId,
        billingType: billingType,
        value: parseFloat(value),
        dueDate: dueDate,
        description: "Apoio Jubileu 50 Anos Engenharia de Minas UFBA",
      }),
    });

    const paymentRes = await paymentReq.json();

    if (!paymentReq.ok) {
      console.error("Erro ao criar pagamento Asaas:", paymentRes);
      throw new Error(paymentRes.errors?.[0]?.description || "Erro ao gerar cobrança.");
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
        status: 400,
      }
    );
  }
});

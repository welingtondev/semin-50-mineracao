import axios from 'axios';

const ASAAS_API_KEY = process.env.ASAAS_API_KEY;
const ASAAS_API_URL = process.env.ASAAS_API_URL;

const asaasClient = axios.create({
  baseURL: ASAAS_API_URL,
  headers: {
    access_token: ASAAS_API_KEY,
    'Content-Type': 'application/json',
  },
});

export const createCustomer = async (data) => {
  try {
    const response = await asaasClient.post('/customers', {
      name: data.name,
      email: data.email,
      cpfCnpj: data.cpf,
      mobilePhone: data.phone,
    });
    return response.data;
  } catch (error) {
    console.error('Error creating Asaas customer:', error.response?.data || error.message);
    throw new Error(error.response?.data?.errors?.[0]?.description || 'Erro ao cadastrar cliente no Asaas.');
  }
};

export const createPayment = async (data) => {
  try {
    const response = await asaasClient.post('/payments', {
      customer: data.customerId,
      billingType: data.billingType, // PIX, CREDIT_CARD, BOLETO
      value: data.value,
      dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // 1 day from now
      description: 'Apoio Jubileu 50 Anos Engenharia de Minas UFBA',
      creditCard: data.creditCard, // Only if billingType is CREDIT_CARD
      creditCardHolderInfo: data.creditCardHolderInfo,
      remoteIp: data.remoteIp,
    });
    return response.data;
  } catch (error) {
    console.error('Error creating Asaas payment:', error.response?.data || error.message);
    throw new Error(error.response?.data?.errors?.[0]?.description || 'Erro ao processar pagamento no Asaas.');
  }
};

export const getPixQrCode = async (paymentId) => {
  try {
    const response = await asaasClient.get(`/payments/${paymentId}/pixQrCode`);
    return response.data;
  } catch (error) {
    console.error('Error getting Pix QR Code:', error.response?.data || error.message);
    throw new Error('Erro ao gerar QR Code do PIX.');
  }
};

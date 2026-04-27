import express from 'express';
import { createCustomer, createPayment, getPixQrCode } from '../services/asaas.js';

const router = express.Router();

router.post('/checkout', async (req, res) => {
  try {
    const { 
      name, 
      email, 
      cpf, 
      phone, 
      value, 
      billingType, 
      creditCard, 
      creditCardHolderInfo 
    } = req.body;

    // 1. Create or Find Customer (For simplicity, we create one for each donation)
    // In a real scenario, you might want to search by CPF first.
    const customer = await createCustomer({ name, email, cpf, phone });

    // 2. Create Payment
    const payment = await createPayment({
      customerId: customer.id,
      billingType,
      value,
      creditCard,
      creditCardHolderInfo,
      remoteIp: req.ip
    });

    // 3. If PIX, get QR Code
    let pixData = null;
    if (billingType === 'PIX') {
      pixData = await getPixQrCode(payment.id);
    }

    res.json({
      success: true,
      paymentId: payment.id,
      status: payment.status,
      invoiceUrl: payment.invoiceUrl,
      pixData
    });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;

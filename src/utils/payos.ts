import PayOS from '@payos/node';
require('dotenv').config(); 
const payOSClientId = process.env.PAYOS_CLIENT_ID || '';
const payOSApiKey = process.env.PAYOS_API_KEY || '';
const payOSChecksumKey = process.env.PAYOS_CHECKSUM_KEY || '';

if (!payOSClientId || !payOSApiKey || !payOSChecksumKey) {
  throw new Error("Missing PayOS configuration. Please check .env file.");
}

const payOS = new PayOS(payOSClientId, payOSApiKey, payOSChecksumKey);

export const createPaymentLink = async (paymentData: any) => {
  try {
    const paymentLink = await payOS.createPaymentLink(paymentData);
    return paymentLink;
  } catch (error) {
    console.error("Error creating payment link:", error);
    throw error;
  }
};

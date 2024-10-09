import PayOS from '@payos/node';
import Transaction from '../models/Transaction';
import User from '../models/User';

const payOS = new PayOS(
  process.env.PAYOS_CLIENT_ID || '',
  process.env.PAYOS_API_KEY || '',
  process.env.PAYOS_CHECKSUM_KEY || ''
);





const YOUR_DOMAIN = process.env.YOUR_DOMAIN || 'http://localhost:8080';

export const createPaymentLink = async (userId: string, amount: number) => {
  try {
    const body = {
      orderCode: Number(String(Date.now()).slice(-6)),
      amount,
      description: "Thanh toán đơn hàng",
      returnUrl: `${YOUR_DOMAIN}/payment-success.html`,
      cancelUrl: `${YOUR_DOMAIN}/payment-cancel.html`,
    };

    console.log('Request body to PayOS:', body);

    const paymentLinkResponse = await payOS.createPaymentLink(body);

    console.log('Response from PayOS:', paymentLinkResponse);

    const { paymentLinkId, checkoutUrl } = paymentLinkResponse;

    const transaction = new Transaction({
      userId,
      amount,
      status: 'pending',
      transactionId: paymentLinkId,
    });

    await transaction.save();

    return checkoutUrl;
  } catch (error) {
    console.error('Error in createPaymentLink:', error);
    throw error;
  }
};



export const handlePaymentWebhook = async (transactionId: string, status: string) => {
  const transaction = await Transaction.findOne({ transactionId });

  if (!transaction) {
    throw new Error('Transaction not found');
  }

  if (status === 'completed') {
    transaction.status = 'completed';

    const user = await User.findById(transaction.userId);
    if (user) {
      user.role = 'member_premium';

      const premiumEndDate = new Date();
      premiumEndDate.setDate(premiumEndDate.getDate() + 30);
      user.permissions = ['premium-access'];
      await user.save();
    }
  } else {
    transaction.status = 'failed';
  }

  await transaction.save();
};

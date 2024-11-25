// src/config/config.ts
export const config = {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 8080,
    mongoUri: process.env.MONGO_URI,
    jwtSecret: process.env.JWT_SECRET,
    
    // PayOS config
    payos: {
      clientId: process.env.PAYOS_CLIENT_ID,
      apiKey: process.env.PAYOS_API_KEY,
      checksumKey: process.env.PAYOS_CHECKSUM_KEY,
      webhookUrl: process.env.PAYOS_WEBHOOK_URL || `${process.env.BE_URL}/api/payment/webhook`
    },
  
    // URL config
    urls: {
      backend: process.env.BE_URL,
      frontend: process.env.FE_URL
    },
  
    // Payment config
    payment: {
      premiumPrice: Number(process.env.PREMIUM_UPGRADE_PRICE) || 2000
    }
  };
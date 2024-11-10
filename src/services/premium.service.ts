// src/services/premium.service.ts
import cron from 'node-cron';
import moment from 'moment';
import { EmailService } from './email.service';
import User from '../models/User';

export class PremiumService {
 // Chạy mỗi ngày lúc 9:00 sáng
 static initExpirationReminders() {
   cron.schedule('0 9 * * *', async () => {
     try {
       // Tính ngày 7 ngày tới
       const sevenDaysFromNow = new Date();
       sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

       // Tìm các user premium sắp hết hạn trong 7 ngày
       const users = await User.find({
         role: 'member_premium',
         premiumEndDate: {
           $gte: new Date(),
           $lte: sevenDaysFromNow
         }
       });

       console.log(`Found ${users.length} users with expiring premium`);

       // Gửi email nhắc nhở cho từng user
       for (const user of users) {
         if (user.email) {
           const daysLeft = Math.ceil(
             user.premiumEndDate ? (user.premiumEndDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24) : 0
           );

           // Gửi email nhắc nhở
           await EmailService.sendPremiumExpirationReminder(user.email, {
             userName: user.name || 'Học viên',
             endDate: user.premiumEndDate,
             daysLeft: daysLeft
           });

           console.log(`Sent reminder email to ${user.email}`);
         }
       }
     } catch (error) {
       console.error('Premium expiration reminder error:', error);
     }
   });

   // Chạy mỗi ngày lúc 00:00 để check và reset role user hết hạn premium
   cron.schedule('0 0 * * *', async () => {
     try {
       // Tìm các user premium đã hết hạn
       const expiredUsers = await User.find({
         role: 'member_premium',
         premiumEndDate: {
           $lt: new Date() // Thời gian hết hạn nhỏ hơn hiện tại
         }
       });

       console.log(`Found ${expiredUsers.length} expired premium users`);

       // Reset role về member cho các user hết hạn
       for (const user of expiredUsers) {
         await User.findByIdAndUpdate(user.id, {
           role: 'member',
           premiumEndDate: null,
           premiumStartDate: null
         });

         // Gửi email thông báo hết hạn
         if (user.email) {
           await EmailService.sendPremiumExpiredEmail(user.email, {
             userName: user.name || 'Học viên',
             expiredDate: user.premiumEndDate
           });

           console.log(`Reset role and sent expired email to ${user.email}`);
         }
       }
     } catch (error) {
       console.error('Premium expiration check error:', error);
     }
   });
 }

 // Email nhắc nhở trước khi hết hạn
 static async sendPremiumExpiredEmail(userEmail: string, data: {
   userName: string;
   expiredDate: Date;
 }) {
   const mailOptions = {
     from: process.env.EMAIL_USER,
     to: userEmail,
     subject: 'Thông báo hết hạn gói Premium - LearnUp',
     html: `
       <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
         <div style="text-align: center; margin-bottom: 20px;">
           <h1 style="color: #2563eb;">LearnUp</h1>
         </div>

         <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px;">
           <h2 style="color: #dc2626;">Thông báo hết hạn Premium</h2>
           
           <p>Xin chào ${data.userName},</p>
           <p>Gói Premium của bạn đã hết hạn vào ngày <strong>${moment(data.expiredDate).format('DD/MM/YYYY')}</strong>.</p>

           <div style="background-color: #fee2e2; padding: 15px; border-radius: 8px; margin: 20px 0;">
             <p style="color: #991b1b; margin: 0;">
               Để tiếp tục sử dụng các tính năng Premium, vui lòng gia hạn gói ngay hôm nay.
             </p>
           </div>

           <div style="text-align: center; margin: 30px 0;">
             <a href="${process.env.FE_URL}/premium" 
                style="background-color: #2563eb; color: white; padding: 12px 24px; 
                       text-decoration: none; border-radius: 6px;">
               Gia hạn Premium
             </a>
           </div>

           <p>Nếu cần hỗ trợ, vui lòng liên hệ:</p>
           <ul style="list-style: none; padding: 0;">
             <li>📧 Email: support@learnup.work</li>
             <li>📞 Hotline: 0938982776</li>
           </ul>

           <p style="text-align: center; color: #6b7280;">
             Trân trọng,<br>
             <strong>LearnUp Team</strong>
           </p>
         </div>
       </div>
     `
   };

   try {
     await EmailService.sendMail(mailOptions);
     console.log('Premium expired email sent');
   } catch (error) {
     console.error('Send premium expired email error:', error);
   }
 }
}
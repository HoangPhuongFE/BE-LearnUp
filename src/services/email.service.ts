// src/services/email.service.ts
import nodemailer from 'nodemailer';
import moment from 'moment-timezone';

export class EmailService {
  static sendMail(mailOptions: { from: string | undefined; to: string; subject: string; html: string; }) {
      throw new Error('Method not implemented.');
  }
  static sendPremiumExpirationReminder(email: string, arg1: { userName: string; endDate: Date | undefined; daysLeft: number; }) {
      throw new Error('Method not implemented.');
  }
  static sendPremiumExpiredEmail(email: string, arg1: { userName: string; expiredDate: Date | undefined; }) {
      throw new Error('Method not implemented.');
  }
  private static transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  private static formatDate(date: Date): string {
    return moment(date)
      .tz('Asia/Ho_Chi_Minh')
      .format('HH:mm - DD/MM/YYYY');
  }

  static async sendPaymentSuccessEmail(userEmail: string, data: {
    orderCode: string;
    amount: number;
    paymentMethod?: string;
    startDate: Date;
    endDate: Date;
    userName: string;
  }) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: 'Thanh toán thành công - LearnUp',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #2563eb;">LearnUp</h1>
          </div>

          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px;">
            <h2 style="color: #059669;">Xác nhận thanh toán thành công</h2>
            
            <p>Xin chào ${data.userName},</p>
            <p>Cảm ơn bạn đã tin tưởng và nâng cấp tài khoản Premium tại LearnUp!</p>
            
            <div style="background-color: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #4b5563;">Chi tiết đơn hàng</h3>
              <ul style="list-style: none; padding: 0;">
                <li>🔹 Mã đơn hàng: <strong>#${data.orderCode}</strong></li>
                <li>🔹 Số tiền: <strong>${data.amount.toLocaleString('vi-VN')} VNĐ</strong></li>
                ${data.paymentMethod ? `<li>🔹 Phương thức: <strong>${data.paymentMethod}</strong></li>` : ''}
              </ul>
            </div>

            <div style="background-color: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #4b5563;">Thông tin gói Premium</h3>
              <ul style="list-style: none; padding: 0;">
                <li>📅 Thời gian bắt đầu: <strong>${this.formatDate(data.startDate)}</strong></li>
                <li>📅 Thời gian kết thúc: <strong>${this.formatDate(data.endDate)}</strong></li>
                <li>⏳ Thời hạn: <strong>30 ngày</strong></li>
              </ul>
            </div>

            <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h4 style="color: #92400e; margin-top: 0;">Đặc quyền Premium của bạn:</h4>
              <ul style="color: #92400e;">
                <li>✨ Truy cập không giới hạn tất cả khóa học</li>
                <li>✨ Xem video offline</li>
                <li>✨ Tải tài liệu học tập</li>
                <li>✨ Hỗ trợ ưu tiên</li>
                <li>✨ Cập nhật nội dung mới nhất</li>
              </ul>
            </div>

            <div style="background-color: #fee2e2; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="color: #991b1b; margin: 0;">
                <strong>Lưu ý quan trọng:</strong><br>
                • Gói Premium sẽ hết hạn vào: <strong>${this.formatDate(data.endDate)}</strong><br>
                • Chúng tôi sẽ gửi email nhắc nhở trước khi hết hạn 7 ngày<br>
                • Bạn có thể gia hạn gói Premium trước khi hết hạn
              </p>
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
      await this.transporter.sendMail(mailOptions);
      console.log('Payment success email sent');
    } catch (error) {
      console.error('Send payment success email error:', error);
    }
  }

  static async sendPaymentFailedEmail(userEmail: string, data: {
    orderCode: string;
    reason: string;
    userName: string;
    cancelTime: Date;
  }) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: 'Thông báo thanh toán không thành công - LearnUp',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #2563eb;">LearnUp</h1>
          </div>

          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px;">
            <h2 style="color: #dc2626;">Thông báo thanh toán không thành công</h2>
            
            <p>Xin chào ${data.userName},</p>

            <div style="background-color: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #4b5563;">Chi tiết đơn hàng</h3>
              <ul style="list-style: none; padding: 0;">
                <li>🔹 Mã đơn hàng: <strong>#${data.orderCode}</strong></li>
                <li>🔹 Thời gian: <strong>${this.formatDate(data.cancelTime)}</strong></li>
                <li>🔹 Lý do: <strong>${data.reason}</strong></li>
              </ul>
            </div>

            <div style="background-color: #fee2e2; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="color: #991b1b; margin: 0;">
                Bạn có thể thử thanh toán lại bằng cách:
                <ol style="margin-top: 10px;">
                  <li>Đăng nhập vào LearnUp</li>
                  <li>Vào phần nâng cấp Premium</li>
                  <li>Thực hiện thanh toán mới</li>
                </ol>
              </p>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FE_URL}/premium" 
                 style="background-color: #2563eb; color: white; padding: 12px 24px; 
                        text-decoration: none; border-radius: 6px;">
                Nâng cấp Premium
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
      await this.transporter.sendMail(mailOptions);
      console.log('Payment failed email sent');
    } catch (error) {
      console.error('Send payment failed email error:', error);
    }
  }
}
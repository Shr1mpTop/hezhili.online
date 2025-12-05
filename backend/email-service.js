/**
 * 阿里云邮件发送服务
 * 用于发送用户反馈邮件
 */

const Dm20151123 = require('@alicloud/dm20151123');
const OpenApi = require('@alicloud/openapi-client');
const Util = require('@alicloud/tea-util');

class EmailService {
  constructor() {
    const config = new OpenApi.Config({
      accessKeyId: process.env.ALIYUN_AK_ID,
      accessKeySecret: process.env.ALIYUN_AK_SECRET,
    });
    config.endpoint = 'dm.aliyuncs.com';
    this.client = new Dm20151123.default(config);
  }

  /**
   * 发送单封邮件
   * @param {string} toAddress - 收件人邮箱
   * @param {string} subject - 邮件主题
   * @param {string} htmlBody - HTML邮件内容
   */
  async sendEmail(toAddress, subject, htmlBody) {
    const sendMailRequest = new Dm20151123.SingleSendMailRequest({
      accountName: 'bufftracker@mail.hezhili.online',
      addressType: 1,
      replyToAddress: true,
      toAddress: toAddress,
      subject: subject,
      htmlBody: htmlBody,
    });

    const runtime = new Util.RuntimeOptions({});
    const response = await this.client.singleSendMailWithOptions(sendMailRequest, runtime);
    return response;
  }

  /**
   * 发送用户反馈到作者邮箱
   * @param {string} feedback - 反馈内容
   * @param {string} userEmail - 用户邮箱（可选）
   */
  async sendFeedbackToAuthor(feedback, userEmail = '匿名用户') {
    const authorEmail = 'HEZH0014@e.ntu.edu.sg';
    const subject = `[网站反馈] 来自 ${userEmail} 的新反馈`;
    
    const htmlBody = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, sans-serif; background: #1a1a2e; color: #eee; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: #16213e; border-radius: 10px; padding: 30px; }
          .header { color: #00ff88; font-size: 24px; margin-bottom: 20px; border-bottom: 2px solid #00ff88; padding-bottom: 10px; }
          .info { background: #0f3460; padding: 15px; border-radius: 8px; margin: 15px 0; }
          .label { color: #00ff88; font-weight: bold; }
          .content { background: #1a1a2e; padding: 20px; border-radius: 8px; margin-top: 15px; white-space: pre-wrap; line-height: 1.6; }
          .footer { margin-top: 20px; padding-top: 15px; border-top: 1px solid #333; color: #888; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">📬 新的网站反馈</div>
          <div class="info">
            <p><span class="label">发送者：</span>${userEmail}</p>
            <p><span class="label">时间：</span>${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}</p>
          </div>
          <div class="label">反馈内容：</div>
          <div class="content">${feedback.replace(/\n/g, '<br>')}</div>
          <div class="footer">
            此邮件由 hezhili.online 自动发送
          </div>
        </div>
      </body>
      </html>
    `;

    return await this.sendEmail(authorEmail, subject, htmlBody);
  }

  /**
   * 发送确认邮件给用户
   * @param {string} userEmail - 用户邮箱
   * @param {string} feedbackPreview - 反馈内容预览
   */
  async sendConfirmationToUser(userEmail, feedbackPreview) {
    const subject = '感谢您的反馈 - hezhili.online';
    
    const htmlBody = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, sans-serif; background: #1a1a2e; color: #eee; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: #16213e; border-radius: 10px; padding: 30px; }
          .header { color: #00ff88; font-size: 24px; margin-bottom: 20px; }
          .content { line-height: 1.8; }
          .highlight { background: #0f3460; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #00ff88; }
          .preview { color: #aaa; font-style: italic; }
          .footer { margin-top: 30px; padding-top: 15px; border-top: 1px solid #333; color: #888; font-size: 12px; }
          a { color: #00ff88; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">✅ 反馈已收到</div>
          <div class="content">
            <p>您好！</p>
            <p>感谢您花时间向我提供反馈，您的意见对我非常重要。</p>
            
            <div class="highlight">
              <p><strong>您的反馈摘要：</strong></p>
              <p class="preview">${feedbackPreview.substring(0, 200)}${feedbackPreview.length > 200 ? '...' : ''}</p>
            </div>
            
            <p>我会认真阅读您的反馈，如有需要会尽快回复您。</p>
            <p>再次感谢！</p>
            <p style="margin-top: 20px;">— Zhili He</p>
          </div>
          <div class="footer">
            <p>此邮件由 <a href="https://hezhili.online">hezhili.online</a> 自动发送，请勿直接回复。</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return await this.sendEmail(userEmail, subject, htmlBody);
  }
}

module.exports = EmailService;

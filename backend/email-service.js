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
    const subject = `📬 新反馈 | 来自 ${userEmail}`;
    const timestamp = new Date().toLocaleString('zh-CN', { 
      timeZone: 'Asia/Shanghai',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    
    const htmlBody = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500&display=swap');
          body { 
            font-family: 'Fira Code', 'Consolas', monospace; 
            background: #0a0a0a; 
            color: #00ff88; 
            padding: 0; 
            margin: 0;
          }
          .terminal {
            max-width: 700px;
            margin: 20px auto;
            background: #0d0d0d;
            border: 1px solid #00ff88;
            border-radius: 8px;
            box-shadow: 0 0 30px rgba(0, 255, 136, 0.15), inset 0 0 60px rgba(0, 0, 0, 0.5);
          }
          .terminal-header {
            background: linear-gradient(180deg, #1a1a1a 0%, #0d0d0d 100%);
            padding: 12px 15px;
            border-bottom: 1px solid #333;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .terminal-btn {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            display: inline-block;
          }
          .btn-red { background: #ff5f56; }
          .btn-yellow { background: #ffbd2e; }
          .btn-green { background: #27ca40; }
          .terminal-title {
            color: #666;
            font-size: 12px;
            margin-left: 10px;
          }
          .terminal-body {
            padding: 20px;
            line-height: 1.8;
          }
          .prompt { color: #00ff88; }
          .cmd { color: #fff; }
          .output { color: #888; margin-left: 0; }
          .highlight { color: #00ff88; text-shadow: 0 0 10px rgba(0, 255, 136, 0.5); }
          .warn { color: #ffbd2e; }
          .info-block {
            background: rgba(0, 255, 136, 0.05);
            border-left: 3px solid #00ff88;
            padding: 15px;
            margin: 15px 0;
            font-size: 14px;
          }
          .info-block p {
            margin: 8px 0;
          }
          .message-block {
            background: #111;
            border: 1px solid #333;
            border-radius: 4px;
            padding: 20px;
            margin: 15px 0;
            white-space: pre-wrap;
            word-wrap: break-word;
            color: #e0e0e0;
            font-size: 14px;
            line-height: 1.8;
          }
          .section-title {
            color: #00ff88;
            font-size: 14px;
            margin: 20px 0 10px 0;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .section-title::before {
            content: "▸";
          }
          .cursor {
            display: inline-block;
            width: 10px;
            height: 18px;
            background: #00ff88;
            animation: blink 1s infinite;
            vertical-align: middle;
            margin-left: 5px;
          }
          @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
          }
          .footer {
            border-top: 1px solid #222;
            padding: 15px 20px;
            color: #555;
            font-size: 12px;
            text-align: center;
          }
          .status-badge {
            display: inline-block;
            background: rgba(0, 255, 136, 0.15);
            color: #00ff88;
            padding: 4px 12px;
            border-radius: 4px;
            font-size: 12px;
            margin-top: 15px;
          }
        </style>
      </head>
      <body>
        <div class="terminal">
          <div class="terminal-header">
            <span class="terminal-btn btn-red"></span>
            <span class="terminal-btn btn-yellow"></span>
            <span class="terminal-btn btn-green"></span>
            <span class="terminal-title">hezhili.online — 用户反馈通知</span>
          </div>
          <div class="terminal-body">
            <p style="font-size: 16px; color: #00ff88; margin-bottom: 5px;">📨 收到新的用户反馈</p>
            <p class="output">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</p>
            
            <div class="info-block">
              <p><span class="warn">📧 发送者：</span> ${userEmail}</p>
              <p><span class="warn">🕐 时间：</span> ${timestamp}</p>
              <p><span class="warn">📋 类型：</span> 用户反馈</p>
            </div>
            
            <p class="section-title">反馈内容</p>
            <div class="message-block">${feedback.replace(/\n/g, '<br>')}</div>
            
            <span class="status-badge">✓ 已成功接收</span>
          </div>
          <div class="footer">
            <p>此邮件由 hezhili.online 反馈系统自动发送</p>
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
    const subject = '✅ 反馈已收到 — hezhili.online';
    
    const htmlBody = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500&display=swap');
          body { 
            font-family: 'Fira Code', 'Consolas', monospace; 
            background: #0a0a0a; 
            color: #00ff88; 
            padding: 0; 
            margin: 0;
          }
          .terminal {
            max-width: 700px;
            margin: 20px auto;
            background: #0d0d0d;
            border: 1px solid #00ff88;
            border-radius: 8px;
            box-shadow: 0 0 30px rgba(0, 255, 136, 0.15), inset 0 0 60px rgba(0, 0, 0, 0.5);
          }
          .terminal-header {
            background: linear-gradient(180deg, #1a1a1a 0%, #0d0d0d 100%);
            padding: 12px 15px;
            border-bottom: 1px solid #333;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .terminal-btn {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            display: inline-block;
          }
          .btn-red { background: #ff5f56; }
          .btn-yellow { background: #ffbd2e; }
          .btn-green { background: #27ca40; }
          .terminal-title {
            color: #666;
            font-size: 12px;
            margin-left: 10px;
          }
          .terminal-body {
            padding: 25px;
            line-height: 1.8;
          }
          .success-header {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 20px;
          }
          .success-icon {
            font-size: 28px;
          }
          .success-text {
            color: #27ca40;
            font-size: 18px;
            font-weight: 500;
          }
          .output { color: #888; }
          .highlight { color: #00ff88; text-shadow: 0 0 10px rgba(0, 255, 136, 0.5); }
          .info-block {
            background: rgba(39, 202, 64, 0.08);
            border-left: 3px solid #27ca40;
            padding: 18px;
            margin: 20px 0;
            border-radius: 0 4px 4px 0;
          }
          .info-block p {
            margin: 5px 0;
            color: #e0e0e0;
            font-size: 14px;
          }
          .quote-block {
            background: #111;
            border: 1px solid #333;
            border-radius: 4px;
            padding: 18px;
            margin: 20px 0;
            color: #999;
            font-size: 13px;
            line-height: 1.6;
          }
          .quote-label {
            color: #666;
            font-size: 12px;
            margin-bottom: 10px;
          }
          .next-steps {
            margin: 25px 0;
          }
          .step-item {
            display: flex;
            align-items: flex-start;
            gap: 10px;
            margin: 12px 0;
            color: #ccc;
            font-size: 14px;
          }
          .step-icon {
            color: #00ff88;
          }
          .signature {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px dashed #333;
          }
          .signature p {
            margin: 6px 0;
            color: #666;
            font-size: 13px;
          }
          .signature a { 
            color: #00ff88; 
            text-decoration: none; 
          }
          .signature a:hover { 
            text-decoration: underline; 
          }
          .footer {
            border-top: 1px solid #222;
            padding: 15px 20px;
            color: #555;
            font-size: 12px;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="terminal">
          <div class="terminal-header">
            <span class="terminal-btn btn-red"></span>
            <span class="terminal-btn btn-yellow"></span>
            <span class="terminal-btn btn-green"></span>
            <span class="terminal-title">hezhili.online — 反馈确认</span>
          </div>
          <div class="terminal-body">
            <div class="success-header">
              <span class="success-icon">✅</span>
              <span class="success-text">反馈发送成功！</span>
            </div>
            
            <div class="info-block">
              <p>您好！感谢您的反馈，您的消息已成功发送至 <span class="highlight">hezhili.online</span></p>
            </div>
            
            <div class="quote-block">
              <p class="quote-label">📝 您发送的内容：</p>
              <p>"${feedbackPreview.substring(0, 200).replace(/"/g, '\\"')}${feedbackPreview.length > 200 ? '...' : ''}"</p>
            </div>
            
            <div class="next-steps">
              <p style="color: #00ff88; margin-bottom: 15px;">接下来：</p>
              <div class="step-item">
                <span class="step-icon">→</span>
                <span>您的反馈将会被认真阅读</span>
              </div>
              <div class="step-item">
                <span class="step-icon">→</span>
                <span>如有需要，作者会尽快回复您</span>
              </div>
              <div class="step-item">
                <span class="step-icon">→</span>
                <span>感谢您帮助改进这个网站 🙏</span>
              </div>
            </div>
            
            <div class="signature">
              <p>—— Zhili He</p>
              <p><a href="https://hezhili.online">https://hezhili.online</a></p>
            </div>
          </div>
          <div class="footer">
            <p>此邮件由系统自动发送，无需回复</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return await this.sendEmail(userEmail, subject, htmlBody);
  }
}

module.exports = EmailService;

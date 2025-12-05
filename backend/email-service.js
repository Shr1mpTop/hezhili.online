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
    const subject = `[INCOMING_TRANSMISSION] ${userEmail}`;
    const timestamp = new Date().toISOString();
    
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
            font-size: 13px;
          }
          .message-block {
            background: #111;
            border: 1px solid #222;
            padding: 20px;
            margin: 15px 0;
            white-space: pre-wrap;
            word-wrap: break-word;
            color: #ccc;
            font-size: 14px;
            line-height: 1.6;
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
            color: #444;
            font-size: 11px;
          }
          .ascii-art {
            color: #00ff88;
            font-size: 10px;
            line-height: 1.2;
            opacity: 0.7;
          }
        </style>
      </head>
      <body>
        <div class="terminal">
          <div class="terminal-header">
            <span class="terminal-btn btn-red"></span>
            <span class="terminal-btn btn-yellow"></span>
            <span class="terminal-btn btn-green"></span>
            <span class="terminal-title">hezhili.online — feedback_receiver.sh</span>
          </div>
          <div class="terminal-body">
            <p><span class="prompt">root@hezhili:~$</span> <span class="cmd">./receive_feedback.sh</span></p>
            <p class="output">[<span class="highlight">INCOMING TRANSMISSION</span>]</p>
            <p class="output">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</p>
            
            <div class="info-block">
              <p><span class="warn">FROM:</span> ${userEmail}</p>
              <p><span class="warn">TIME:</span> ${timestamp}</p>
              <p><span class="warn">TYPE:</span> USER_FEEDBACK</p>
            </div>
            
            <p><span class="prompt">root@hezhili:~$</span> <span class="cmd">cat message.txt</span></p>
            <div class="message-block">${feedback.replace(/\n/g, '<br>')}</div>
            
            <p><span class="prompt">root@hezhili:~$</span> <span class="cmd">echo $STATUS</span></p>
            <p class="output"><span class="highlight">TRANSMISSION_COMPLETE</span></p>
            <p><span class="prompt">root@hezhili:~$</span><span class="cursor"></span></p>
          </div>
          <div class="footer">
            <pre class="ascii-art">
 _   _      _______ _     _ _      _   ____        _ _            
| | | |    |__   __| |   (_) |    (_) |  _ \\      | (_)           
| |_| | ___   | |  | |__  _| |     _  | |_) |_ __ | |_ _ __   ___ 
|  _  |/ _ \\  | |  | '_ \\| | |    | | |  _ <| '_ \\| | | '_ \\ / _ \\
| | | |  __/  | |  | | | | | |____| | | |_) | | | | | | | | |  __/
|_| |_|\\___|  |_|  |_| |_|_|______|_| |____/|_| |_|_|_|_| |_|\\___|
            </pre>
            AUTO_GENERATED BY hezhili.online FEEDBACK SYSTEM
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
    const subject = '[ACK] Transmission Received — hezhili.online';
    
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
          .output { color: #888; }
          .highlight { color: #00ff88; text-shadow: 0 0 10px rgba(0, 255, 136, 0.5); }
          .success { color: #27ca40; }
          .info-block {
            background: rgba(0, 255, 136, 0.05);
            border-left: 3px solid #00ff88;
            padding: 15px;
            margin: 15px 0;
          }
          .quote-block {
            background: #111;
            border: 1px solid #222;
            padding: 15px;
            margin: 15px 0;
            color: #666;
            font-style: italic;
            font-size: 13px;
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
          .matrix-line {
            color: #00ff88;
            opacity: 0.3;
            font-size: 10px;
            overflow: hidden;
            white-space: nowrap;
          }
          .footer {
            border-top: 1px solid #222;
            padding: 15px 20px;
            color: #444;
            font-size: 11px;
          }
          a { color: #00ff88; text-decoration: none; }
          a:hover { text-decoration: underline; }
          .signature {
            margin-top: 20px;
            padding-top: 15px;
            border-top: 1px dashed #333;
            color: #00ff88;
          }
        </style>
      </head>
      <body>
        <div class="terminal">
          <div class="terminal-header">
            <span class="terminal-btn btn-red"></span>
            <span class="terminal-btn btn-yellow"></span>
            <span class="terminal-btn btn-green"></span>
            <span class="terminal-title">hezhili.online — ack_response.sh</span>
          </div>
          <div class="terminal-body">
            <p class="matrix-line">01001000 01100101 01101100 01101100 01101111 00100000 01010111 01101111 01110010 01101100 01100100</p>
            
            <p><span class="prompt">visitor@hezhili:~$</span> <span class="cmd">./check_status.sh</span></p>
            <p class="output">[<span class="success">✓ ACK</span>] TRANSMISSION RECEIVED SUCCESSFULLY</p>
            <p class="output">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</p>
            
            <div class="info-block">
              <p>感谢您的反馈传输！</p>
              <p>您的信息已成功抵达 <span class="highlight">hezhili.online</span> 服务器。</p>
            </div>
            
            <p><span class="prompt">visitor@hezhili:~$</span> <span class="cmd">cat your_message.log | head -3</span></p>
            <div class="quote-block">"${feedbackPreview.substring(0, 150).replace(/"/g, '\\"')}${feedbackPreview.length > 150 ? '...' : ''}"</div>
            
            <p><span class="prompt">visitor@hezhili:~$</span> <span class="cmd">echo "NEXT_STEPS"</span></p>
            <p class="output">→ 您的反馈将被认真阅读</p>
            <p class="output">→ 如有需要，作者会尽快回复</p>
            <p class="output">→ 感谢您帮助改进这个网站</p>
            
            <div class="signature">
              <p>// Zhili He</p>
              <p>// <a href="https://hezhili.online">https://hezhili.online</a></p>
              <p>// "Audentes fortuna iuvat"</p>
            </div>
            
            <p><span class="prompt">visitor@hezhili:~$</span> <span class="cmd">exit</span></p>
            <p class="output">logout</p>
            <p class="output">Connection to hezhili.online closed.</p>
          </div>
          <div class="footer">
            <p class="matrix-line">10101010 01010101 10101010 01010101 10101010 01010101 10101010 01010101</p>
            <p style="margin-top: 10px;">此邮件由 hezhili.online 自动发送 | DO_NOT_REPLY</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return await this.sendEmail(userEmail, subject, htmlBody);
  }
}

module.exports = EmailService;

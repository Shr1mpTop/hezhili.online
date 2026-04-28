import aiosmtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from typing import Optional

class EmailService:
    def __init__(self):
        self.smtp_server = os.getenv("SMTP_SERVER", "smtp.aliyun.com")
        self.smtp_port = int(os.getenv("SMTP_PORT", "465"))
        self.username = os.getenv("SMTP_USERNAME")
        self.password = os.getenv("SMTP_PASSWORD")
        self.from_email = os.getenv("FROM_EMAIL", "bufftracker@mail.hezhili.online")

    async def send_email(self, to_email: str, subject: str, html_body: str):
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = self.from_email
        msg["To"] = to_email

        html_part = MIMEText(html_body, "html")
        msg.attach(html_part)

        await aiosmtplib.send(
            msg,
            hostname=self.smtp_server,
            port=self.smtp_port,
            username=self.username,
            password=self.password,
            use_tls=True,
        )

    async def send_feedback_to_author(self, feedback: str, user_email: str = "匿名用户"):
        author_email = os.getenv("AUTHOR_EMAIL", "HEZH0014@e.ntu.edu.sg")
        subject = f"📬 新反馈 | 来自 {user_email}"
        timestamp = "2024-01-01 00:00:00"  # Use datetime.now() in real implementation

        html_body = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body {{
                    font-family: 'Fira Code', 'Consolas', monospace;
                    background: #0a0a0a;
                    color: #00ff88;
                    padding: 20px;
                }}
                .terminal {{
                    max-width: 700px;
                    margin: 20px auto;
                    background: #0d0d0d;
                    border: 1px solid #00ff88;
                    border-radius: 8px;
                    padding: 20px;
                }}
            </style>
        </head>
        <body>
            <div class="terminal">
                <h2>🔔 新用户反馈</h2>
                <p><strong>时间:</strong> {timestamp}</p>
                <p><strong>用户:</strong> {user_email}</p>
                <p><strong>反馈内容:</strong></p>
                <pre>{feedback}</pre>
            </div>
        </body>
        </html>
        """

        await self.send_email(author_email, subject, html_body)

    async def send_confirmation_to_user(self, user_email: str, feedback: str):
        subject = "感谢您的反馈 - HeZhili"
        html_body = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
        </head>
        <body>
            <h1>感谢您的反馈！</h1>
            <p>我们已收到您的反馈：</p>
            <blockquote>{feedback[:200]}...</blockquote>
            <p>我们会尽快处理您的建议。</p>
        </body>
        </html>
        """

        await self.send_email(user_email, subject, html_body)
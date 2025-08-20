import os

class Config:
    # Flask配置
    FLASK_ENV = os.getenv('FLASK_ENV', 'production')
    DEBUG = False
    PORT = 5000
    HOST = '0.0.0.0'

    # API配置
    API_BASE_URL = "https://ark.cn-beijing.volces.com/api/v3"
    API_KEY = os.environ.get("ARK_API_KEY")

    # CORS配置
    ALLOWED_ORIGINS = ["https://www.hezhili.online"]
    
    # 证书路径
    CERT_PATH = "../certs/hezhili.online.pem"
    KEY_PATH = "../certs/hezhili.online.key"

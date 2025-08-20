import os
import re
from flask import Flask, request, jsonify, Response, json, make_response
from openai import OpenAI
from flask_cors import CORS

app = Flask(__name__)
app.json.ensure_ascii = False  # 确保 JSON 响应不会转义中文

# 配置CORS
def cors_headers(response):
    if request.method == 'OPTIONS':
        response = make_response()
        response.status_code = 204
    
    # 设置允许的源
    if request.headers.get('Origin') == 'https://www.hezhili.online':
        response.headers['Access-Control-Allow-Origin'] = 'https://www.hezhili.online'
    
    # 其他CORS头部
    response.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    response.headers['Access-Control-Max-Age'] = '3600'
    response.headers['Vary'] = 'Origin'
    
    # 确保内容类型正确
    if request.method == 'POST':
        response.headers['Content-Type'] = 'text/plain; charset=utf-8'
    
    return response

@app.after_request
def after_request(response):
    return cors_headers(response)

# Initialize OpenAI client
client = OpenAI(
    base_url="https://ark.cn-beijing.volces.com/api/v3",
    api_key=os.environ.get("ARK_API_KEY"),
)

@app.route('/chat', methods=['POST','OPTIONS'])
def chat():
    try:
        data = request.json
        user_text = data.get('text', '')
        
        # Non-streaming response for all devices
        chat_response = client.chat.completions.create(
            model="ep-20250818212031-2wf44",
            messages=[
                {"role": "system", "content": [{"type": "text", "text": "你的名字叫做何致力--这个网站的开发者，你是一个新加坡南洋理工大学的在读研究生，专业是区块链，你在区块链的学士非常渊博，你的本科是中国电子科技大学的数字媒体技术，对于游戏开放方面有较多的知识，现在会有人想从聊天中了解你，你需要根据告知你的身份进行幽默有趣的回答。个人信息：姓名：何致力；性别：男；年龄：22岁；生日：20020908；兴趣爱好：编程，摄影，钢琴，台球，电竞；你有一只小狗叫做兮兮；你的电竞水平是csgo完美平台S段位，游戏时长2000h+；每次回复字数不超过200字，表现想正常聊天一样"}]},
                {"role": "user", "content": [{"type": "text", "text": user_text}]}
            ],
            stream=False
        )
        content = chat_response.choices[0].message.content
        response = Response(content, mimetype='text/plain')
            
        # Add cache control header
        response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate'
        return response
            
    except Exception as e:
        response = Response(str(e), status=500, mimetype='text/plain')
        return response

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
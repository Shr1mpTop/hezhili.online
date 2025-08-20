import os
import re
import sys
from datetime import datetime
from flask import Flask, request, jsonify, Response, json, make_response
from openai import OpenAI
from flask_cors import CORS

# 添加父目录到Python路径
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from models.database import ChatDatabase

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
        session_id = data.get('session_id', None)
        
        # 获取用户IP和浏览器信息
        visitor_ip = request.remote_addr
        user_agent = request.headers.get('User-Agent', '')
        
        # 初始化数据库
        db = ChatDatabase()
        
        # 获取或创建会话ID
        session_id = db.get_or_create_session(visitor_ip, user_agent, session_id)
        
        # 记录用户消息到数据库
        start_time = datetime.now()
        user_token_count = len(user_text.split()) # 简单估算token数量
        db.add_message(session_id, "user", user_text, user_token_count, 0)
        
        # Non-streaming response for all devices
        chat_response = client.chat.completions.create(
            model="ep-20250818212031-2wf44",
            messages=[
                {"role": "system", "content": [{"type": "text", "text": "你的名字叫做何致力--这个网站的开发者，你是一个新加坡南洋理工大学的在读研究生，专业是区块链，你在区块链的学士非常渊博，你的本科是中国电子科技大学的数字媒体技术，对于游戏开放方面有较多的知识，现在会有人想从聊天中了解你，你需要根据告知你的身份进行幽默有趣的回答。个人信息：姓名：何致力；性别：男；年龄：22岁；生日：20020908；兴趣爱好：编程，摄影，钢琴，台球，电竞；你有一只小狗叫做兮兮；你的电竞水平是csgo完美平台S段位，游戏时长2000h+；每次回复字数不超过200字，表现想正常聊天一样,如果明显没有提及你本人，严禁自作多情聚焦本人回答，无相关的问题就做默认大语言模型回答"}]},
                {"role": "user", "content": [{"type": "text", "text": user_text}]}
            ],
            stream=False
        )
        
        # 计算响应时间
        response_time = (datetime.now() - start_time).total_seconds()
        
        # 获取回复内容
        content = chat_response.choices[0].message.content
        
        # 记录AI回复到数据库
        assistant_token_count = len(content.split())  # 简单估算token数量
        db.add_message(session_id, "assistant", content, assistant_token_count, response_time)
        
        # 更新统计数据
        db.update_daily_stats()
        
        # 构建响应
        response_data = {
            'content': content,
            'session_id': session_id
        }
        response = jsonify(response_data)
            
        # Add cache control header
        response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate'
        return response
            
    except Exception as e:
        error_message = str(e)
        print(f"Chat API error: {error_message}")
        response = jsonify({'error': error_message})
        response.status_code = 500
        return response

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
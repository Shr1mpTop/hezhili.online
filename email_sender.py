import sys
import os
from typing import List
from dotenv import load_dotenv

from alibabacloud_dm20151123.client import Client as Dm20151123Client
from alibabacloud_tea_openapi import models as open_api_models
from alibabacloud_dm20151123 import models as dm_20151123_models
from alibabacloud_tea_util import models as util_models

# Load environment variables from .env file
load_dotenv()

def send_aliyun_email():
    # 1. 初始化配置
    ak_id = os.getenv('AK_ID')
    ak_secret = os.getenv('AK_SECRET')   
    config = open_api_models.Config(
        access_key_id=ak_id,
        access_key_secret=ak_secret
    )
    config.endpoint = 'dm.aliyuncs.com'
    client = Dm20151123Client(config)
    send_mail_request = dm_20151123_models.SingleSendMailRequest(
        account_name='bufftracker@mail.hezhili.online', 
        address_type=1,                            # 1 代表随机账号（为了防垃圾），0 代表发信地址本身
        reply_to_address=True, 
        to_address='HEZH0014@e.ntu.edu.sg', 
        subject='你妈卖批', 
        html_body='<h1>你晚上好</h1><p>当你看见这封邮件的时候，说明老子又要搞妖蛾子了</p>' 
    )

    try:
        # 运行时选项，默认即可
        runtime = util_models.RuntimeOptions()
        resp = client.single_send_mail_with_options(send_mail_request, runtime)
        
        print("发送成功！")
        print(f"Request ID: {resp.body.request_id}")
        
    except Exception as error:
        print("发送失败，错误信息如下：")
        print(error)

if __name__ == '__main__':
    send_aliyun_email()
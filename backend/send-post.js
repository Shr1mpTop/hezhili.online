const http = require('http');

const postData = {
  title: "哈基米加密器：有趣的文字加密工具",
  content: "## 项目背景\n\n哈基米加密器是一个充满创意的文字加密工具，由开发者Warma10032创建。这个项目源于一个有趣的想法：将普通的文字转换为只有\"哈\"、\"基\"、\"米\"三个字的\"曼波语\"。\n\n项目地址：[GitHub - hajimi-encoder](https://github.com/Warma10032/hajimi-encoder)\n\n在线体验：[app.xiaobaozi.cn](https://app.xiaobaozi.cn/)\n\n## 技术实现\n\n### 核心加密算法\n\n哈基米加密器采用了多层加密技术，结合了凯撒密码、三进制编码和随机化处理：\n\n```javascript\n// 字符到三进制字符串的转换\nfunction charToTrinaryString(char) {\n    let unicode_val = char.charCodeAt(0);\n    let trinary_str = \"\";\n    while (unicode_val > 0) {\n        let remainder = unicode_val % 3;\n        trinary_str = remainder + trinary_str;\n        unicode_val = Math.floor(unicode_val / 3);\n    }\n    return trinary_str;\n}\n```\n\n### 三进制映射\n\n项目使用三进制系统作为基础，将数字0、1、2映射为\"哈\"、\"基\"、\"米\"：\n\n```javascript\nconst mapping = {\n    \"0\": \"哈\",\n    \"1\": \"基\", \n    \"2\": \"米\"\n};\n```\n\n### 凯撒加密与随机偏移\n\n每个字符在加密时都会应用凯撒加密，并添加随机偏移量：\n\n```javascript\nfunction caesarEncrypt(unicode_val, shift) {\n    return unicode_val + shift;\n}\n\nfunction generateRandomShift() {\n    return Math.floor(Math.random() * 9); // 0-8随机偏移\n}\n```\n\n### 私钥系统\n\n支持自定义私钥，进一步增强加密安全性：\n\n```javascript\nfunction parsePrivateKey(privateKey) {\n    let shiftArray = [];\n    for (let i = 0; i < privateKey.length; i++) {\n        let unicodeValue = privateKey.charCodeAt(i);\n        let decimalValueArray = unicodeValue.toString().split(\"\").map(Number);\n        shiftArray.push(...decimalValueArray);\n    }\n    return shiftArray;\n}\n```\n\n## 技术栈\n\n- **前端框架**：原生JavaScript + HTML5 + CSS3\n- **UI组件**：Font Awesome图标库\n- **工具提示**：Tippy.js\n- **部署**：静态网站，可部署到任意Web服务器\n\n## 使用方法\n\n### 基本使用\n\n1. 在\"人言\"输入框中输入要加密的文字\n2. 点击\"加密\"按钮\n3. 在\"曼波语\"输出框中获得加密后的哈基米编码\n4. 可以使用\"解密\"按钮还原原文\n\n### 高级功能\n\n- **自定义编码字符**：可以设置三个不同的字符替代默认的哈基米\n- **私钥加密**：输入私钥字符串，增强加密强度\n- **一键复制**：支持复制输入和输出内容\n\n## 应用场景\n\n### 娱乐用途\n\n- **朋友间的信息传递**：用曼波语发送神秘消息\n- **游戏道具**：在游戏中作为特殊文字编码\n- **学习工具**：理解编码和加密的基本原理\n\n### 教育价值\n\n- **编程教育**：展示实际的加密算法实现\n- **数学教育**：介绍三进制系统和凯撒密码\n- **开源学习**：完整的Web应用开发示例\n\n## 项目特色\n\n### 创新性\n\n哈基米加密器最大的特色在于其娱乐性和教育性。它不像传统的加密工具那样严肃刻板，而是以一种轻松有趣的方式展示了加密技术的魅力。\n\n### 用户体验\n\n- **直观的界面**：简洁明了的输入输出设计\n- **实时反馈**：即时显示加密解密结果\n- **错误处理**：友好的错误提示信息\n- **响应式设计**：支持移动端使用\n\n### 开源精神\n\n项目完全开源，代码清晰易读，为学习者提供了优秀的学习材料。开发者还提供了详细的算法注释，帮助理解复杂的加密逻辑。\n\n## 技术亮点\n\n### 算法复杂度\n\n哈基米加密器结合了多种加密技术：\n\n1. **凯撒密码**：基础的字符偏移\n2. **三进制编码**：独特的进制转换\n3. **随机化处理**：每个字符的随机偏移\n4. **私钥系统**：基于用户输入的额外加密层\n5. **长度自适应**：根据字符Unicode值动态调整编码长度\n\n### 安全性分析\n\n虽然这不是一个用于严肃加密的工具，但它的安全性相当不错：\n\n- **多层加密**：结合多种算法，增加破解难度\n- **随机因子**：每次加密结果都不同\n- **私钥支持**：用户可以自定义加密强度\n- **Unicode支持**：支持所有Unicode字符\n\n## 开发历程\n\n项目从一个简单的想法开始：\"能不能把文字变成只有哈基米三个字的句子？\" 通过不断优化算法，最终发展成了一个功能完整的加密工具。\n\n开发者在实现过程中解决了诸多技术挑战：\n\n- **进制转换算法**：实现Unicode到三进制的准确转换\n- **随机化处理**：确保每次加密结果的唯一性\n- **解密算法**：设计可逆的解密流程\n- **用户界面**：创建直观易用的Web界面\n\n## 社区影响\n\n作为GitHub上的开源项目，哈基米加密器获得了39个star和4个fork，说明它在开发者社区中获得了认可。这个项目不仅展示了技术实力，更体现了将复杂技术以有趣方式呈现的能力。\n\n## 总结\n\n哈基米加密器是一个技术与娱乐完美结合的项目。它用创新的方式展示了加密技术的魅力，既适合作为学习材料，也适合作为娱乐工具。\n\n在这个严肃的技术世界中，这样的项目让我们记住：编程也可以很有趣！\n\n如果你对加密技术感兴趣，或者只是想体验一下把文字变成\"曼波语\"的乐趣，不妨试试哈基米加密器吧！",
  excerpt: "介绍一个有趣的文字加密工具哈基米加密器，它可以将普通文字转换为哈基米三进制编码，结合多种加密技术，适合学习和娱乐使用。",
  tags: ["加密工具", "JavaScript", "开源项目", "算法", "前端开发"]
};

const data = JSON.stringify(postData);

const options = {
  hostname: 'localhost',
  port: 3002,
  path: '/api/posts',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(data, 'utf8')
  }
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers:`, res.headers);

  res.setEncoding('utf8');
  let body = '';
  res.on('data', (chunk) => {
    body += chunk;
  });
  res.on('end', () => {
    console.log('Response:', body);
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

req.write(data);
req.end();
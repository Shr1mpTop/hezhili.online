// 示例：点击侧边栏菜单高亮
const sidebarItems = document.querySelectorAll('.sidebar ul li');
sidebarItems.forEach(item => {
    item.addEventListener('click', function (e) {
        // 如果点击的是链接，不阻止默认行为
        if (e.target.tagName !== 'A') {
            sidebarItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
        }
    });
});

const chatForm = document.querySelector('.chat-form');
const chatInput = document.querySelector('.chat-input');
const chatMessages = document.querySelector('.chat-messages');

// 加载历史聊天记录
async function loadChatHistory() {
    const sessionId = localStorage.getItem('chatSessionId');
    if (!sessionId) return;

    try {
        // 构建API URL - 支持本地开发和生产环境
        const apiUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
            ? `http://localhost:5000/chat/history?session_id=${sessionId}&limit=20`
            : `https://www.hezhili.online/chat/history?session_id=${sessionId}&limit=20`;

        const response = await fetch(apiUrl);

        if (!response.ok) {
            console.error('Failed to load chat history');
            return;
        }

        const data = await response.json();

        if (data.messages && data.messages.length > 0) {
            // 清空已有消息
            chatMessages.innerHTML = '';

            // 显示历史消息
            data.messages.forEach(msg => {
                const msgDiv = document.createElement('div');

                if (msg.type === 'user') {
                    msgDiv.className = 'message user-message';
                    msgDiv.innerHTML = `<span class="message-sender">您</span>${msg.content}`;
                } else {
                    msgDiv.className = 'message assistant-message';
                    msgDiv.innerHTML = `<span class="message-sender">致力</span>${msg.content}`;
                }

                chatMessages.appendChild(msgDiv);
            });

            // 滚动到底部
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    } catch (err) {
        console.error('Error loading chat history:', err);
    }
}

// 美金钞票雨动画
window.addEventListener('DOMContentLoaded', function () {
    console.log('DOMContentLoaded event fired');

    // 加载历史聊天记录
    loadChatHistory();

    // 清除聊天记录功能
    const clearChatBtn = document.getElementById('clear-chat');
    if (clearChatBtn) {
        clearChatBtn.addEventListener('click', function () {
            if (confirm('确定要清除聊天记录吗？这将开始一个新的会话。')) {
                // 清除localStorage中的会话ID
                localStorage.removeItem('chatSessionId');

                // 清空聊天消息区域
                chatMessages.innerHTML = '';

                // 显示提示
                const noticeDiv = document.createElement('div');
                noticeDiv.textContent = '系统：聊天记录已清除';
                noticeDiv.style.textAlign = 'center';
                noticeDiv.style.margin = '10px 0';
                noticeDiv.style.color = '#888';
                noticeDiv.style.fontStyle = 'italic';
                chatMessages.appendChild(noticeDiv);
            }
        });
    }

    const moneyRainContainer = document.getElementById('money-rain');
    const rainControlBtn = document.getElementById('rain-control');
    console.log('Money rain container:', moneyRainContainer);

    if (!moneyRainContainer) {
        console.error('Money rain container not found!');
        return;
    }

    // 设置容器样式
    moneyRainContainer.style.position = 'fixed';
    moneyRainContainer.style.top = '0';
    moneyRainContainer.style.left = '0';
    moneyRainContainer.style.width = '100%';
    moneyRainContainer.style.height = '100%';
    moneyRainContainer.style.pointerEvents = 'none';
    moneyRainContainer.style.zIndex = '10';
    console.log('Container styles set');

    const billImages = [];
    const billCount = 20;
    let isAnimating = true;
    let isGeneratingNew = true; // 控制是否生成新钞票
    let animationId = null;

    for (let i = 0; i < billCount; i++) {
        const bill = document.createElement('div');
        bill.textContent = '💵'; // 使用emoji美金符号
        bill.style.position = 'absolute';
        bill.style.top = '-100px';
        bill.style.left = Math.random() * window.innerWidth + 'px';
        bill.style.fontSize = '24px';
        bill.style.opacity = '0.8';
        bill.style.pointerEvents = 'none';
        bill.style.transform = 'rotate(' + (Math.random() * 360) + 'deg)';
        bill.style.zIndex = '11';

        moneyRainContainer.appendChild(bill);
        billImages.push({
            el: bill,
            speed: 2 + Math.random() * 3,
            x: parseFloat(bill.style.left),
            rotation: Math.random() * 5 - 2.5
        });
    }

    console.log('Created', billCount, 'bills');

    function animateBills() {
        if (!isAnimating) return;

        billImages.forEach(bill => {
            let top = parseFloat(bill.el.style.top);
            top += bill.speed;

            // 添加旋转效果
            let currentRotation = parseFloat(bill.el.style.transform.replace(/[^\d.-]/g, '')) || 0;
            currentRotation += bill.rotation;
            bill.el.style.transform = 'rotate(' + currentRotation + 'deg)';

            // 只有在生成新钞票模式下，钞票才会从顶部重新开始
            if (top > window.innerHeight) {
                if (isGeneratingNew) {
                    top = -100;
                    bill.x = Math.random() * window.innerWidth;
                    bill.el.style.left = bill.x + 'px';
                } else {
                    // 暂停生成新钞票时，让钞票继续下落直到消失
                    bill.el.style.display = 'none';
                }
            }
            bill.el.style.top = top + 'px';
        });
        animationId = requestAnimationFrame(animateBills);
    }

    // 控制按钮功能
    if (rainControlBtn) {
        // 设置初始图标（暂停图标，因为动画正在播放）
        rainControlBtn.innerHTML = '<img src="../src/assets/pause.svg" style="width: 20px; height: 20px;" alt="暂停">';
        rainControlBtn.title = '暂停钞票雨';

        rainControlBtn.addEventListener('click', function () {
            if (isGeneratingNew) {
                // 暂停生成新钞票，但动画继续
                isGeneratingNew = false;
                rainControlBtn.innerHTML = '<img src="../src/assets/start.svg" style="width: 20px; height: 20px;" alt="开始">';
                rainControlBtn.title = '开始钞票雨';
                console.log('停止生成新钞票，现有钞票继续下落');
            } else {
                // 开始生成新钞票，重新显示所有钞票
                isGeneratingNew = true;
                // 重新显示所有钞票并重置位置
                billImages.forEach(bill => {
                    bill.el.style.display = 'block';
                    if (parseFloat(bill.el.style.top) > window.innerHeight) {
                        bill.el.style.top = '-100px';
                        bill.x = Math.random() * window.innerWidth;
                        bill.el.style.left = bill.x + 'px';
                    }
                });
                rainControlBtn.innerHTML = '<img src="../src/assets/pause.svg" style="width: 20px; height: 20px;" alt="暂停">';
                rainControlBtn.title = '暂停钞票雨';
                console.log('开始生成新钞票');
            }
        });

        // 添加悬停效果
        rainControlBtn.addEventListener('mouseenter', function () {
            this.style.transform = 'scale(1.1)';
            this.style.background = 'rgba(255,255,255,1)';
        });

        rainControlBtn.addEventListener('mouseleave', function () {
            this.style.transform = 'scale(1)';
            this.style.background = 'rgba(255,255,255,0.9)';
        });
    }

    console.log('Money rain animation started');
    animateBills();

    // 主页按钮功能
    const homeBtn = document.getElementById('home-btn');
    if (homeBtn) {
        homeBtn.addEventListener('click', function (e) {
            e.preventDefault(); // 阻止默认跳转

            // 创建弹出提示元素
            const tooltip = document.createElement('div');
            tooltip.textContent = '这里就是主页！！';
            tooltip.style.cssText = `
                position: fixed;
                left: ${e.clientX}px;
                top: ${e.clientY}px;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 8px 12px;
                border-radius: 4px;
                font-size: 14px;
                z-index: 1000;
                pointer-events: none;
                animation: floatUp 2s ease-out forwards;
                white-space: nowrap;
            `;

            document.body.appendChild(tooltip);

            // 2秒后移除元素
            setTimeout(() => {
                if (tooltip.parentNode) {
                    tooltip.parentNode.removeChild(tooltip);
                }
            }, 2000);
        });
    }
});
// ...existing code...
if (chatForm) {
    chatForm.addEventListener('submit', async function (e) {
        e.preventDefault(); // 阻止页面刷新
        const msg = chatInput.value.trim();
        if (msg) {
            // 显示用户消息
            const userDiv = document.createElement('div');
            userDiv.className = 'message user-message';
            userDiv.innerHTML = `<span class="message-sender">您</span>${msg}`;
            chatMessages.appendChild(userDiv);
            chatInput.value = '';
            chatMessages.scrollTop = chatMessages.scrollHeight;

            // 显示AI回复等待提示
            const aiDiv = document.createElement('div');
            aiDiv.className = 'message assistant-message';
            aiDiv.innerHTML = `<span class="message-sender">致力</span><span class="typing-indicator">思考中</span>`;
            chatMessages.appendChild(aiDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;

            // 请求后端API（非流式）
            try {
                // 从localStorage获取会话ID
                const sessionId = localStorage.getItem('chatSessionId');

                // 构建API URL - 支持本地开发和生产环境
                const apiUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
                    ? 'http://localhost:5000/chat'
                    : 'https://www.hezhili.online/chat';

                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        text: msg,
                        session_id: sessionId
                    })
                });

                if (!response.ok) {
                    aiDiv.textContent = '致力：我晕倒了';
                    return;
                }

                const data = await response.json();

                // 保存会话ID到localStorage
                if (data.session_id) {
                    localStorage.setItem('chatSessionId', data.session_id);
                }

                // 显示AI回复
                aiDiv.innerHTML = `<span class="message-sender">致力</span>${data.content}`;
                chatMessages.scrollTop = chatMessages.scrollHeight;
            } catch (err) {
                aiDiv.textContent = '致力：脑壳进水了，检查中';
                console.error('API Error:', err);
            }
        }
    });
}


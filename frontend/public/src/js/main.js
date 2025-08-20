// 示例：点击侧边栏菜单高亮
const sidebarItems = document.querySelectorAll('.sidebar ul li');
sidebarItems.forEach(item => {
    item.addEventListener('click', function () {
        sidebarItems.forEach(i => i.classList.remove('active'));
        this.classList.add('active');
    });
});

const chatForm = document.querySelector('.chat-form');
const chatInput = document.querySelector('.chat-input');
const chatMessages = document.querySelector('.chat-messages');

// 美金钞票雨动画
window.addEventListener('DOMContentLoaded', function () {
    console.log('DOMContentLoaded event fired');
    const moneyRainContainer = document.getElementById('money-rain');
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
    moneyRainContainer.style.backgroundColor = 'rgba(255,0,0,0.1)'; // 临时添加红色背景用于调试
    console.log('Container styles set');

    const billImages = [];
    const billCount = 20;

    for (let i = 0; i < billCount; i++) {
        const bill = document.createElement('div');
        bill.textContent = '💵'; // 使用emoji美金符号
        bill.style.position = 'absolute';
        bill.style.top = '-100px';
        bill.style.left = Math.random() * window.innerWidth + 'px';
        bill.style.fontSize = '40px';
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
        billImages.forEach(bill => {
            let top = parseFloat(bill.el.style.top);
            top += bill.speed;

            // 添加旋转效果
            let currentRotation = parseFloat(bill.el.style.transform.replace(/[^\d.-]/g, '')) || 0;
            currentRotation += bill.rotation;
            bill.el.style.transform = 'rotate(' + currentRotation + 'deg)';

            if (top > window.innerHeight) {
                top = -100;
                bill.x = Math.random() * window.innerWidth;
                bill.el.style.left = bill.x + 'px';
            }
            bill.el.style.top = top + 'px';
        });
        requestAnimationFrame(animateBills);
    }

    console.log('Money rain animation started');
    animateBills();
});
// ...existing code...
if (chatForm) {
    chatForm.addEventListener('submit', async function (e) {
        e.preventDefault(); // 阻止页面刷新
        const msg = chatInput.value.trim();
        if (msg) {
            // 显示用户消息
            const userDiv = document.createElement('div');
            userDiv.textContent = '您：' + msg;
            userDiv.style.textAlign = 'right';
            userDiv.style.margin = '6px 0';
            userDiv.style.color = '#075004';
            chatMessages.appendChild(userDiv);
            chatInput.value = '';
            chatMessages.scrollTop = chatMessages.scrollHeight;

            // 显示AI回复等待提示
            const aiDiv = document.createElement('div');
            aiDiv.textContent = '致力：让我想想...';
            aiDiv.style.textAlign = 'left';
            aiDiv.style.margin = '6px 0';
            aiDiv.style.color = '#888';
            chatMessages.appendChild(aiDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;

            // 请求后端API（非流式）
            try {
                const response = await fetch('/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text: msg })
                });

                if (!response.ok) {
                    aiDiv.textContent = '致力：我晕倒了';
                    return;
                }

                const data = await response.text();
                aiDiv.textContent = '致力：' + data;
                chatMessages.scrollTop = chatMessages.scrollHeight;
            } catch (err) {
                aiDiv.textContent = '致力：脑壳进水了，检查中';
                console.error('API Error:', err);
            }
        }
    });
}


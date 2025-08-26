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
            ? `http://localhost:5001/chat/history?session_id=${sessionId}&limit=20`
            : `${window.location.protocol}//${window.location.host}/chat/history?session_id=${sessionId}&limit=20`;

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

    // 移动端聊天框切换功能
    const mobileChatToggle = document.getElementById('mobile-chat-toggle');
    const chatbox = document.querySelector('.chatbox');

    if (mobileChatToggle && chatbox) {
        let isChatVisible = false;

        // 初始化移动端聊天框状态
        function initMobileChatState() {
            if (window.innerWidth <= 768) {
                chatbox.classList.add('mobile-hidden');
                chatbox.classList.remove('mobile-visible');
                isChatVisible = false;
                mobileChatToggle.textContent = '💬';
                mobileChatToggle.classList.remove('active');
            } else {
                chatbox.classList.remove('mobile-hidden', 'mobile-visible');
            }
        }

        // 切换聊天框显示/隐藏
        mobileChatToggle.addEventListener('click', function () {
            if (window.innerWidth <= 768) {
                isChatVisible = !isChatVisible;

                if (isChatVisible) {
                    chatbox.classList.remove('mobile-hidden');
                    chatbox.classList.add('mobile-visible');
                    mobileChatToggle.textContent = '✕';
                    mobileChatToggle.classList.add('active');
                    // 聚焦到输入框
                    setTimeout(() => {
                        const chatInput = chatbox.querySelector('.chat-input');
                        if (chatInput) chatInput.focus();
                    }, 300);
                } else {
                    chatbox.classList.remove('mobile-visible');
                    chatbox.classList.add('mobile-hidden');
                    mobileChatToggle.textContent = '💬';
                    mobileChatToggle.classList.remove('active');
                }
            }
        });

        // 初始化状态
        initMobileChatState();

        // 监听窗口大小变化
        window.addEventListener('resize', initMobileChatState);

        // 点击聊天框外部时在移动端隐藏聊天框
        document.addEventListener('click', function (e) {
            if (window.innerWidth <= 768 && isChatVisible) {
                if (!chatbox.contains(e.target) && e.target !== mobileChatToggle) {
                    isChatVisible = false;
                    chatbox.classList.remove('mobile-visible');
                    chatbox.classList.add('mobile-hidden');
                    mobileChatToggle.textContent = '💬';
                    mobileChatToggle.classList.remove('active');
                }
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

    // --- Sidebar collapse/expand control ---
    const sidebarEl = document.querySelector('.sidebar');
    if (sidebarEl) {
        // create toggle button
        const toggle = document.createElement('button');
        toggle.className = 'sidebar-toggle';
        toggle.title = '切换侧边栏';
        // use a refined SVG icon (hamburger -> chevrons) and a tooltip via data attribute
        toggle.setAttribute('data-tooltip', '切换侧边栏');
        toggle.setAttribute('aria-label', '切换侧边栏');
        toggle.innerHTML = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M4.5 12l6-6 1.41 1.41L7.33 12l4.58 4.59L10.5 18 4.5 12zm15 0l-6 6-1.41-1.41L16.67 12l-4.58-4.59L13.5 6l6 6z" fill="currentColor"/></svg>';
        toggle.style.position = 'absolute';
        toggle.style.top = '8px';
        toggle.style.right = '-28px';
        toggle.style.width = '28px';
        toggle.style.height = '28px';
        toggle.style.borderRadius = '6px';
        toggle.style.border = 'none';
        toggle.style.background = 'rgba(255,255,255,0.06)';
        toggle.style.color = '#fff';
        toggle.style.cursor = 'pointer';
        toggle.style.zIndex = '50';
        sidebarEl.appendChild(toggle);

        // initialize state from localStorage
        const collapsedKey = 'sidebarCollapsedV2';
        const stored = localStorage.getItem(collapsedKey);
        if (stored === 'true') sidebarEl.classList.add('collapsed');

        toggle.addEventListener('click', function (e) {
            e.preventDefault();
            sidebarEl.classList.toggle('collapsed');
            const isCollapsed = sidebarEl.classList.contains('collapsed');
            localStorage.setItem(collapsedKey, isCollapsed ? 'true' : 'false');
            // trigger a resize event to allow other responsive code to adapt
            window.dispatchEvent(new Event('resize'));
        });
    }

    // Add icons to sidebar items (non-destructive, only if not present)
    document.querySelectorAll('.sidebar ul li').forEach((li, idx) => {
        const a = li.querySelector('a');
        if (!a) return;
        // if icon already exists skip
        if (!a.querySelector('.nav-icon')) {
            const icon = document.createElement('span');
            icon.className = 'nav-icon';
            // simple SVG placeholder (circle for home, square for others alternately)
            if (idx === 0) {
                icon.innerHTML = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 3l9 8h-3v7h-12v-7h-3l9-8z" fill="currentColor"/></svg>';
            } else {
                icon.innerHTML = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" fill="currentColor"/></svg>';
            }
            const text = document.createElement('span');
            text.className = 'nav-text';
            // move existing text into nav-text
            text.innerHTML = a.innerHTML;
            a.innerHTML = '';
            a.appendChild(icon);
            a.appendChild(text);
        }
    });

    // Replace chat send button content with an SVG icon and ensure circular appearance
    const sendBtn = document.querySelector('.chat-form button');
    if (sendBtn) {
        // avoid replacing if already SVG
        if (!sendBtn.querySelector('svg')) {
            sendBtn.innerHTML = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M2 21l21-9L2 3v7l15 2-15 2v7z" fill="currentColor"/></svg>';
            sendBtn.setAttribute('aria-label', '发送消息');
        }
    }

    // Mini chat overlay behavior used to live here (sidebar-bound). Disabled because chat is now
    // implemented as a floating, draggable widget independent from the sidebar.
    (function miniChatOverlay() {
        return; // disabled
    })();

    // --- Floating draggable chat widget (new behavior) ---
    (function floatingChatWidget() {
        const chatbox = document.querySelector('.chatbox');
        if (!chatbox) return;

        // Create toggle button under the rain control button
        const rainBtn = document.getElementById('rain-control');
        const floatToggle = document.createElement('button');
        floatToggle.id = 'floating-chat-toggle';
        floatToggle.title = '打开/关闭聊天';
        floatToggle.className = 'floating-chat-toggle';
        floatToggle.innerHTML = '<img class="chat-icon" src="../src/assets/chat.svg" alt="chat">';

        if (rainBtn && rainBtn.parentNode) {
            rainBtn.parentNode.insertBefore(floatToggle, rainBtn.nextSibling);
        } else {
            document.body.appendChild(floatToggle);
        }

        // Build floating container and move chatbox inside it
        const container = document.createElement('div');
        container.className = 'floating-chat-container';
        container.setAttribute('aria-hidden', 'true');
        // move chatbox into container (detach from sidebar)
        const originalParent = chatbox.parentNode;
        container.appendChild(chatbox);
        document.body.appendChild(container);

        // ensure chatbox is interactive
        chatbox.style.pointerEvents = 'auto';

        // add explicit close control in header
        const header = chatbox.querySelector('.chat-header');
        const closeBtn = document.createElement('button');
        closeBtn.className = 'floating-chat-close';
        closeBtn.title = '关闭';
        closeBtn.innerHTML = '\u2715';
        if (header) header.appendChild(closeBtn);

        // toggle visibility
        function openChat() {
            container.classList.add('open');
            container.setAttribute('aria-hidden', 'false');
            // focus input after open
            setTimeout(() => { const input = container.querySelector('.chat-input'); if (input) input.focus(); }, 200);
        }
        function closeChat() {
            container.classList.remove('open');
            container.setAttribute('aria-hidden', 'true');
        }

        floatToggle.addEventListener('click', function (e) {
            if (container.classList.contains('open')) closeChat(); else openChat();
        });

        closeBtn.addEventListener('click', closeChat);

        // Dragging
        let dragging = false; let dragOffsetX = 0; let dragOffsetY = 0;

        function onPointerDown(e) {
            // ignore clicks on buttons inside header
            if (e.target.closest('button')) return;
            dragging = true;
            const rect = container.getBoundingClientRect();
            const clientX = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0] && e.touches[0].clientX);
            const clientY = e.clientY !== undefined ? e.clientY : (e.touches && e.touches[0] && e.touches[0].clientY);
            dragOffsetX = clientX - rect.left;
            dragOffsetY = clientY - rect.top;
            container.classList.add('dragging');
            document.addEventListener('pointermove', onPointerMove);
            document.addEventListener('pointerup', onPointerUp);
            e.preventDefault();
        }

        function onPointerMove(e) {
            if (!dragging) return;
            const clientX = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0] && e.touches[0].clientX);
            const clientY = e.clientY !== undefined ? e.clientY : (e.touches && e.touches[0] && e.touches[0].clientY);
            let left = clientX - dragOffsetX;
            let top = clientY - dragOffsetY;
            // clamp to viewport
            const maxLeft = window.innerWidth - container.offsetWidth - 8;
            const maxTop = window.innerHeight - container.offsetHeight - 8;
            left = Math.max(8, Math.min(maxLeft, left));
            top = Math.max(8, Math.min(maxTop, top));
            container.style.left = left + 'px';
            container.style.top = top + 'px';
            container.style.right = 'auto';
            container.style.bottom = 'auto';
        }

        function onPointerUp() {
            dragging = false;
            container.classList.remove('dragging');
            document.removeEventListener('pointermove', onPointerMove);
            document.removeEventListener('pointerup', onPointerUp);
        }

        // Use header as drag handle if present, else whole container
        const dragHandle = header || container;
        dragHandle.style.touchAction = 'none';
        dragHandle.addEventListener('pointerdown', onPointerDown);

        // close on ESC
        document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape') closeChat(); });

        // ensure initial position is bottom-right
        container.style.right = '20px';
        container.style.bottom = '80px';

        // make sure chatbox styles adapt when moved out of sidebar
        container.classList.add('floating-chat-container-init');
    })();

    // --- Robust background tile fallback (DOM-based) ---
    // Some browsers or setups may not render pseudo-element tiled backgrounds or
    // `background-repeat: space` consistently. Inject two fixed divs with
    // repeatable SVG tiles (data-URI) and offset the second by half a tile to
    // produce a checkerboard-like interleaved grid with guaranteed gaps.
    (function ensurePatternTiles() {
        // remove existing to avoid duplicates on HMR / reload
        const existing = document.getElementById('pattern-tiles');
        if (existing) existing.parentNode.removeChild(existing);

        const tileWrap = document.createElement('div');
        tileWrap.id = 'pattern-tiles';
        tileWrap.style.position = 'fixed';
        tileWrap.style.inset = '0';
        tileWrap.style.pointerEvents = 'none';
        tileWrap.style.zIndex = '-5';

        function makeTileDiv(imgDataUri, offsetPx) {
            const d = document.createElement('div');
            d.style.position = 'absolute';
            d.style.inset = '0';
            d.style.pointerEvents = 'none';
            d.style.backgroundImage = `url("${imgDataUri}")`;
            d.style.backgroundRepeat = 'repeat';
            const tileSize = (window.innerWidth < 900) ? 160 : 240;
            d.style.backgroundSize = tileSize + 'px ' + tileSize + 'px';
            if (offsetPx) d.style.backgroundPosition = offsetPx + 'px ' + offsetPx + 'px';
            return d;
        }

        const bitcoinData = '../src/assets/bitcoin.svg';
        // use external asset path for etherum tile (browser will request this file)
        const etherData = '../src/assets/etherum.svg';

        const tileSizeNow = (window.innerWidth < 900) ? 160 : 240;
        const half = Math.round(tileSizeNow / 2);

        const bDiv = makeTileDiv(bitcoinData, 0);
        const eDiv = makeTileDiv(etherData, half);

        // add a subtle security texture overlay (thin-line guilloche-like) above tiles
        const secDiv = document.createElement('div');
        secDiv.style.position = 'absolute';
        secDiv.style.inset = '0';
        secDiv.style.pointerEvents = 'none';
        secDiv.style.backgroundImage = `url('../src/assets/security.svg')`;
        secDiv.style.backgroundRepeat = 'repeat';
        secDiv.style.opacity = '0.22';
        secDiv.style.zIndex = '2';
        secDiv.style.backgroundSize = tileSizeNow + 'px ' + tileSizeNow + 'px';

        tileWrap.appendChild(bDiv);
        tileWrap.appendChild(eDiv);
        tileWrap.appendChild(secDiv);
        document.body.insertBefore(tileWrap, document.body.firstChild);

        // update on resize to keep offset correct for responsive breakpoints
        window.addEventListener('resize', function () {
            const ts = (window.innerWidth < 900) ? 160 : 240;
            const h = Math.round(ts / 2);
            bDiv.style.backgroundSize = ts + 'px ' + ts + 'px';
            eDiv.style.backgroundSize = ts + 'px ' + ts + 'px';
            eDiv.style.backgroundPosition = h + 'px ' + h + 'px';
        });
    })();

    const billImages = [];
    // reduce DOM nodes to improve performance on low-end devices
    const billCount = 24;
    // various currency symbols to display (mix of fiat and crypto symbols)
    const currencySymbols = ['$', '€', '¥', '£', '₹', '₽', '₩', '฿', '₿', '₺', '₫', '₪', '₦', '₲', '₵', '¢', '₡', '₴'];
    let isAnimating = true;
    let isGeneratingNew = true; // 控制是否生成新钞票
    let animationId = null;

    // batch insertion via document fragment
    const frag = document.createDocumentFragment();
    for (let i = 0; i < billCount; i++) {
        const bill = document.createElement('div');
        // pick a random currency symbol to vary appearance
        const sym = currencySymbols[Math.floor(Math.random() * currencySymbols.length)];
        bill.textContent = sym;
        bill.className = 'money-bill';
        bill.style.position = 'absolute';
        // keep style.top unused for layout; control vertical position via transform and JS y
        bill.style.top = '0px';
        bill.style.left = Math.random() * window.innerWidth + 'px';
        bill.style.fontSize = '42px';
        bill.style.opacity = '0.85';
        bill.style.pointerEvents = 'none';
        bill.style.transform = 'translate3d(0,0,0) rotate(' + (Math.random() * 360) + 'deg)';
        bill.style.zIndex = '11';

        // initial vertical position fixed at -20px above top
        const initialY = -20;
        const initialRot = Math.random() * 360;
        // set initial transform to place bill above viewport
        bill.style.transform = `translate3d(0, ${initialY}px, 0) rotate(${initialRot}deg)`;
        // store initial dataset rotation so animation accumulates from this angle
        bill.dataset.rotation = String(initialRot);

        frag.appendChild(bill);
        billImages.push({
            el: bill,
            // slightly faster but variable speeds for natural feel
            speed: 0.8 + Math.random() * 1.2,
            x: parseFloat(bill.style.left),
            // fixed initial y at -20
            y: initialY,
            // per-frame rotation delta
            rotation: Math.random() * 2 - 1
        });
    }
    moneyRainContainer.appendChild(frag);

    console.log('Created', billCount, 'bills');
    // bill animation state
    let billAnimId = null;
    let lastBillTime = performance.now();
    // ensure each bill has an angle accumulator
    billImages.forEach(b => {
        b.angle = b.el.dataset && b.el.dataset.rotation ? parseFloat(b.el.dataset.rotation) : 0;
        // convert earlier arbitrary speed to pixels/sec baseline
        b.speedPx = (b.speed || 1) * 80; // ~64-160 px/s
    });

    function animateBills() {
        // always animate bill movement; generation/respawn is controlled by isGeneratingNew
        const now = performance.now();
        const dt = Math.max(0.001, (now - lastBillTime) / 1000);
        lastBillTime = now;

        const recycleMargin = 50;

        billImages.forEach(b => {
            // advance vertical position
            b.y += b.speedPx * dt;

            // accumulate rotation
            b.angle = (b.angle || 0) + (b.rotation || 0) * 60 * dt;

            // update transform: keep rotation around Z for bills
            b.el.style.transform = `translate3d(0, ${Math.round(b.y)}px, 0) rotate(${b.angle}deg)`;

            // recycle if below viewport
            if (b.y > window.innerHeight + recycleMargin) {
                if (isGeneratingNew) {
                    b.y = -20 - Math.random() * 120; // respawn above view
                    b.el.style.display = 'block';
                    b.el.style.left = Math.random() * window.innerWidth + 'px';
                    b.x = parseFloat(b.el.style.left);
                    b.angle = Math.random() * 360;
                    b.el.style.transform = `translate3d(0, ${Math.round(b.y)}px, 0) rotate(${b.angle}deg)`;
                } else {
                    // hide this bill instead of respawning when generation/respawn paused
                    b.el.style.display = 'none';
                    b.inactive = true;
                }
            }
        });

        billAnimId = requestAnimationFrame(animateBills);
    }
    /* --- Glass curtain + deep-moving giant dollar signs (behind content) --- */
    // create stage if not present
    let glassStage = document.getElementById('glass-stage');
    if (!glassStage) {
        glassStage = document.createElement('div');
        glassStage.id = 'glass-stage';
        // insert as first child of body so it's behind content but still in DOM
        document.body.insertBefore(glassStage, document.body.firstChild);
        const glassLayer = document.createElement('div');
        glassLayer.className = 'glass-layer';
        glassStage.appendChild(glassLayer);
        const dollarLayer = document.createElement('div');
        dollarLayer.className = 'dollar-layer';
        glassStage.appendChild(dollarLayer);
    }

    // back-dollar animation parameters
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isSmallScreen = window.innerWidth < 900;
    // even if user prefers reduced motion, still create a few background dollars but slow them
    const backCount = (isSmallScreen ? 3 : 7);
    const motionScale = reducedMotion ? 0.25 : 1;
    // fade duration in seconds: start fade-out this many seconds before recycle
    const fadeDuration = 0.8;
    // backColumns: each column is a "train" of segments moving together
    const backColumns = [];

    function createBackDollars() {
        const layer = glassStage.querySelector('.dollar-layer');
        // compute responsive vertical bounds inside the fixed glass stage (stage coords)
        const stageHeight = glassStage.clientHeight || Math.max(400, window.innerHeight);
        const topY = Math.max(0, Math.round(stageHeight * 0.02));
        const delta = Math.min(Math.max(Math.round(stageHeight * 0.25), 50), 400);
        const bottomY = topY + delta;

        // compute spacing and fixed font size to avoid overlap
        const spacing = Math.floor(window.innerWidth / Math.max(1, backCount));
        const desiredDesktop = 360;
        const desiredMobile = 220;
        const fontSize = Math.max(60, Math.min(isSmallScreen ? desiredMobile : desiredDesktop, Math.floor(spacing * 0.9)));

        // number of segments per column (train length) - set to 1 to enforce a single symbol per column
        const segmentsPerColumn = 1;
        // choose a per-column gap based on the column's scale to avoid vertical overlap
        // we'll compute a scaleBase per column below and derive a safe gap there

        for (let i = 0; i < backCount; i++) {
            const leftPx = Math.round((i + 0.5) * spacing - fontSize / 2);
            const dir = (i % 2 === 0) ? 1 : -1;
            const initialY = (i % 2 === 0) ? topY : bottomY;
            const distance = Math.abs(bottomY - topY) || 200;
            const speed = Math.max(30, distance / (4 + Math.random() * 6));
            const baseOpacity = 0.45;
            const scaleBase = 1.05 + Math.random() * 0.4;

            // vertical spacing between segments: ensure it's at least the height of the
            // largest scaled glyph so segments cannot visually overlap. add small padding.
            const segmentGap = Math.ceil(fontSize * scaleBase * 1.05);

            // compute respawn for leader segment inside stage coordinates
            const spawnOffset = Math.max(60, Math.round(stageHeight * 0.08)) + Math.round(fontSize * 0.3);
            const stageBottom = stageHeight;
            const respawnY = (dir === 1)
                ? (topY - spawnOffset - Math.round(fontSize * 0.5))
                : (stageBottom + spawnOffset);

            // single segment per column (simplified, no train)
            const el = document.createElement('div');
            el.className = 'back-dollar';
            el.style.fontSize = fontSize + 'px';
            el.style.left = Math.max(0, leftPx) + 'px';
            el.style.opacity = '0';
            el.textContent = '$';
            el.setAttribute('data-symbol', '$');
            const segScale = scaleBase; // single glyph uses base scale
            const phase = Math.random() * Math.PI * 2;
            const swayFreq = 0.6 + Math.random() * 0.8;
            const swayAmp = Math.round(fontSize * 0.07);
            el.style.transform = `translate3d(0, ${Math.round(respawnY)}px, 0) scale(${segScale})`;
            layer.appendChild(el);

            const seg = { el, y: respawnY, segIndex: 0, segScale, phase, swayFreq, swayAmp, curOpacity: 0 };

            backColumns.push({ seg, xPx: leftPx, dir, speed, baseOpacity, respawnY, topY, bottomY, segmentGap, scaleBase });
        }
    }

    createBackDollars();

    let backAnimId = null;
    // animate with time delta so speed is viewport-independent
    let lastBackTime = performance.now();
    function animateBackDollars() {
        const now = performance.now();
        const dt = Math.max(0.001, (now - lastBackTime) / 1000);
        lastBackTime = now;

        const stageHeightNow = glassStage.clientHeight || Math.max(400, window.innerHeight);
        const stageBottomNow = stageHeightNow;
        const recycleMargin = Math.round(Math.max(100, stageHeightNow * 0.05));

        backColumns.forEach((col, colIdx) => {
            // single segment per column
            const delta = col.dir * col.speed * motionScale * dt;
            const seg = col.seg;
            seg.y += delta;

            // render and apply per-seg independent fade logic and motion
            const tNow = now / 1000;
            const vis = Math.max(0, Math.min(1, (seg.curOpacity !== undefined ? seg.curOpacity : 1)));
            // reduce motion amplitude as segment fades to avoid chaotic movement during fade-out
            const ampScale = 0.4 + 0.6 * vis;
            const sway = Math.sin(tNow * seg.swayFreq + seg.phase) * seg.swayAmp * ampScale;
            const rot = Math.sin(tNow * (seg.swayFreq * 0.7) + seg.phase) * 3 * ampScale; // small deg
            const scaleJitter = 1 + Math.sin(tNow * (seg.swayFreq * 0.9) + seg.phase) * 0.01 * ampScale;
            seg.el.style.transform = `translate3d(${sway.toFixed(2)}px, ${seg.y.toFixed(2)}px, 0) rotate(${rot.toFixed(2)}deg) scale(${(seg.segScale * scaleJitter).toFixed(3)})`;

            // compute desired opacity based on this segment's vertical position and glyph extent
            let targetOp = 0;
            const bottomEdge = stageBottomNow;
            const bottomEnterMargin = Math.max(40, Math.round(stageHeightNow * 0.06));
            const topEnterMargin = Math.max(20, Math.round(stageHeightNow * 0.03));
            const fontPx = parseFloat(seg.el.style.fontSize || '100');
            const glyphHalf = (fontPx * (seg.segScale || 1)) * 0.5;
            const intersectsBand = (seg.y + glyphHalf) >= col.topY && (seg.y - glyphHalf) <= col.bottomY;

            if (intersectsBand) {
                const bandCenter = (col.topY + col.bottomY) / 2;
                const dist = Math.abs(seg.y - bandCenter);
                const maxDist = (col.bottomY - col.topY) / 2;
                const t = Math.max(0, 1 - (dist / Math.max(1, maxDist)));
                targetOp = col.baseOpacity * (0.35 + 0.65 * t);
            }

            if (col.dir === 1) {
                if ((seg.y - glyphHalf) >= (bottomEdge)) targetOp = 0;
            } else {
                if ((seg.y - glyphHalf) <= bottomEdge && (seg.y - glyphHalf) >= (bottomEdge - bottomEnterMargin)) {
                    const entered = bottomEdge - (seg.y - glyphHalf);
                    const tt = Math.max(0, Math.min(1, entered / bottomEnterMargin));
                    targetOp = Math.max(targetOp, col.baseOpacity * (0.25 + 0.75 * tt));
                }
                if ((seg.y + glyphHalf) <= 0) targetOp = 0;
            }

            const lerpSpeed = 6;
            seg.curOpacity = seg.curOpacity + (targetOp - seg.curOpacity) * Math.min(1, lerpSpeed * dt);
            seg.el.style.opacity = seg.curOpacity.toFixed(3);

            // recycle when leader goes out of view
            const leader = seg;
            if (col.dir === 1 && leader.y > stageBottomNow + recycleMargin) {
                if (isGeneratingNew) {
                    leader.y = col.respawnY;
                    leader.el.style.left = (col.xPx || 0) + 'px';
                    leader.el.style.opacity = '0';
                    //console.log('back-column recycled idx=', colIdx, 'set leader y=', col.respawnY);
                } else {
                    leader.el.style.opacity = '0';
                }
            } else if (col.dir === -1 && leader.y < -recycleMargin) {
                if (isGeneratingNew) {
                    leader.y = col.respawnY;
                    leader.el.style.left = (col.xPx || 0) + 'px';
                    leader.el.style.opacity = '0';
                    //console.log('back-column recycled idx=', colIdx, 'set leader y=', col.respawnY);
                } else {
                    leader.el.style.opacity = '0';
                }
            }
        });

        backAnimId = requestAnimationFrame(animateBackDollars);
    }

    // responsive recompute on resize: update topY/bottomY and adjust targets proportionally
    function recomputeBackBounds() {
        const stageHeight = glassStage.clientHeight || Math.max(400, window.innerHeight);
        const topY = Math.max(0, Math.round(stageHeight * 0.02));
        const delta = Math.min(Math.max(Math.round(stageHeight * 0.25), 50), 400);
        const bottomY = topY + delta;
        backColumns.forEach((col, idx) => {
            const spacing = Math.floor(window.innerWidth / Math.max(1, backCount));
            const fontSize = parseInt(col.seg.el.style.fontSize || '100', 10);
            col.xPx = Math.round((idx + 0.5) * spacing - fontSize / 2);
            col.seg.segScale = col.seg.segScale || 1;
            col.topY = topY;
            col.bottomY = bottomY;
            const stageBottom = stageHeight;
            col.respawnY = (col.dir === 1) ? (col.topY - Math.max(150, Math.round(stageHeight * 0.12)) - fontSize) : (stageBottom + Math.max(150, Math.round(stageHeight * 0.12)) + fontSize);
            // reset to respawn positions to avoid jump
            const gap = col.segmentGap || Math.round(fontSize * 0.6);
            col.seg.y = col.respawnY;
            col.seg.el.style.left = col.xPx + 'px';
            col.seg.el.style.transform = `translate3d(0, ${col.seg.y.toFixed(2)}px, 0) scale(${col.seg.segScale})`;
            col.seg.curOpacity = 0;
            col.seg.el.style.opacity = '0';
            col.appeared = false;
            col.fading = false;
        });
    }

    window.addEventListener('resize', recomputeBackBounds);

    if (backColumns.length > 0) {
        lastBackTime = performance.now();
        animateBackDollars();
    }

    // 控制按钮功能
    if (rainControlBtn) {
        // 设置初始图标（暂停图标，因为动画正在播放）
        rainControlBtn.innerHTML = '<img src="../src/assets/pause.svg" style="width: 20px; height: 20px;" alt="暂停">';
        rainControlBtn.title = '暂停钞票雨';

        rainControlBtn.addEventListener('click', function () {
            // Toggle generation/respawn of new bills
            if (isGeneratingNew) {
                isGeneratingNew = false;
                rainControlBtn.innerHTML = '<img src="../src/assets/start.svg" style="width: 20px; height: 20px;" alt="开始">';
                rainControlBtn.title = '开始钞票雨生成/回收';
                console.log('停止生成/回收新钞票（已有钞票继续下落或隐藏）');
            } else {
                isGeneratingNew = true;
                // when resuming generation, bring back hidden bills
                billImages.forEach(bill => { if (bill.inactive) { bill.el.style.display = 'block'; bill.inactive = false; } });
                rainControlBtn.innerHTML = '<img src="../src/assets/pause.svg" style="width: 20px; height: 20px;" alt="暂停">';
                rainControlBtn.title = '暂停钞票雨';
                console.log('恢复生成/回收新钞票');
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

    // ---- Hero title animation & theme wiring ----
    (function initHeroAnimation() {
        // ensure animate.css is loaded (pages/index.html preloads it)
        const title = document.querySelector('.hero-title');
        const subtitle = document.querySelector('.hero-subtitle');
        if (!title || !subtitle) return;

        // Use fade-in for title and slide+typewriter for subtitle
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        function applyFadeIn(el, delay = 0) {
            if (prefersReduced) { el.style.opacity = '1'; return; }
            el.classList.add('animate__animated', 'animate__fadeIn');
            // slower, more elegant fade
            el.style.setProperty('--animate-duration', '1600ms');
            // allow repeated click to replay
            function handler() { el.classList.remove('animate__animated', 'animate__fadeIn'); el.removeEventListener('animationend', handler); }
            el.addEventListener('animationend', handler);
        }

        // typewriter: show slide-in then reveal text char by char
        async function typeWriter(el, text, speed = 40) {
            if (prefersReduced) { el.textContent = text; return; }
            el.classList.add('slide-in-from-left');
            // force reflow so transition will run
            void el.offsetWidth;
            el.classList.add('visible');
            // small delay for slide
            await new Promise(r => setTimeout(r, 260));

            el.textContent = '';
            for (let i = 0; i < text.length; i++) {
                el.textContent += text[i];
                await new Promise(r => setTimeout(r, speed + Math.floor(Math.random() * 30)));
            }
            // append caret element
            const caret = document.createElement('span');
            caret.className = 'typewriter-caret';
            el.appendChild(caret);
        }

        // apply fade-in to title and run typewriter on subtitle
        setTimeout(() => applyFadeIn(title), 200);
        setTimeout(() => typeWriter(subtitle, subtitle.getAttribute('data-full') || subtitle.textContent, 36), 520);

        // Make subtitle's original content stored for typewriter replays
        if (!subtitle.getAttribute('data-full')) subtitle.setAttribute('data-full', subtitle.textContent.trim());

        // allow clicking title to replay fade-in, clicking subtitle to replay typing
        title.addEventListener('click', () => applyFadeIn(title));
        subtitle.addEventListener('click', () => {
            const txt = subtitle.getAttribute('data-full') || subtitle.textContent;
            // remove existing caret and restart
            subtitle.textContent = '';
            typeWriter(subtitle, txt, 36);
        });

        // theme adaption: pick light/dark based on background color luminance
        function setHeroTheme() {
            // sample body background via getComputedStyle
            const bg = window.getComputedStyle(document.body).backgroundColor || 'rgb(232,247,232)';
            // parse rgb(a)
            const m = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
            let r = 232, g = 247, b = 232;
            if (m) { r = +m[1]; g = +m[2]; b = +m[3]; }
            // luminance perceived
            const lum = 0.2126 * (r / 255) + 0.7152 * (g / 255) + 0.0722 * (b / 255);
            const root = document.documentElement.style;
            if (lum < 0.45) {
                // dark background -> bright hero
                root.setProperty('--hero-color', '#f7fff7');
                root.setProperty('--hero-accent', '#7ef3a3');
                root.setProperty('--hero-shadow', '0 12px 40px rgba(0,0,0,0.6)');
                root.setProperty('--hero-subcolor', 'rgba(230, 255, 230, 0.92)');
            } else {
                // light background -> dark hero
                root.setProperty('--hero-color', '#072a00');
                root.setProperty('--hero-accent', '#0b8a2e');
                root.setProperty('--hero-shadow', '0 8px 30px rgba(2, 44, 8, 0.18)');
                root.setProperty('--hero-subcolor', 'rgba(7,42,0,0.88)');
            }

            // pick a font weight/scale variation based on viewport
            const vw = Math.max(window.innerWidth, 360);
            const baseSize = vw < 900 ? 64 : 128; // match larger CSS defaults (mobile 64, desktop 128)
            root.setProperty('--hero-size', baseSize + 'px');
            // subtitle should be significantly smaller than title; clamp between 16 and 24
            const subSize = Math.min(24, Math.max(16, Math.round(baseSize / 5)));
            root.setProperty('--subtitle-size', subSize + 'px');
        }

        setHeroTheme();
        window.addEventListener('resize', setHeroTheme);
    })();

    /* --- 本地 three.js 渲染器（固定正视图） --- */
    (function localThreePreview() {
        const root = document.getElementById('model-canvas-root');
        if (!root) return;

    let renderer, scene, camera, mixer, clock, animId;
    // interactive camera movement state (moved to top-level so animate() can access)
    let faceTargetGlobal = null;      // THREE.Vector3 the camera should look at (model centroid / face)
    let baseCameraPos = null;         // original camera world position (centered)
    let targetCameraPos = null;       // desired world position (updated from mouse)
    let MAX_SHIFT_X = 0;              // max shift along camera local X (world units)
    let MAX_SHIFT_Z = 0;              // max shift along camera local Z (world units)
    let camPlaneHelper = null;        // visual helper attached to camera
    let lastPointer = { x: 0, y: 0 }; // normalized pointer (-1..1)

        async function initThree() {
            try {
                // dynamic import three.js modules from CDN
                // Prefer ES module imports (jsDelivr). If that fails, fall back to UMD script injection.
                let THREE = null;
                let FBXLoader = null;

                try {
                    // Attempt ESM dynamic import (recommended)
                    // Use import('three') so that the importmap in index.html can resolve the bare specifier.
                    const threeModule = await import('three');
                    // Import the FBXLoader ES module from jsDelivr; it uses a bare 'three' import which will be
                    // resolved by the importmap to the same ESM build above.
                    const loaderModule = await import('https://cdn.jsdelivr.net/npm/three@0.158.0/examples/jsm/loaders/FBXLoader.js');
                    THREE = threeModule;
                    FBXLoader = loaderModule.FBXLoader;
                } catch (esmErr) {
                    console.warn('ESM import failed, falling back to UMD injection', esmErr);

                    function loadScript(url) {
                        return new Promise((resolve, reject) => {
                            const s = document.createElement('script');
                            s.src = url;
                            s.async = true;
                            s.onload = () => resolve();
                            s.onerror = (e) => reject(new Error('Failed to load ' + url));
                            document.head.appendChild(s);
                        });
                    }

                    // UMD fallback (may be deprecated in newer r versions but works for older builds)
                    await loadScript('https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.min.js');
                    await loadScript('https://cdn.jsdelivr.net/npm/three@0.158.0/examples/js/loaders/FBXLoader.js');
                    THREE = window.THREE;
                    FBXLoader = THREE && THREE.FBXLoader ? THREE.FBXLoader : window.FBXLoader;
                }

                // renderer (transparent background)
                renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
                renderer.setPixelRatio(window.devicePixelRatio || 1);
                renderer.setSize(root.clientWidth, root.clientHeight, false);
                // ensure transparent clear so page background shows through
                renderer.setClearColor(0x000000, 0);
                renderer.domElement.style.position = 'absolute';
                renderer.domElement.style.top = '0';
                renderer.domElement.style.left = '0';
                renderer.domElement.style.width = '100%';
                renderer.domElement.style.height = '100%';
                renderer.domElement.style.background = 'transparent';
                // don't intercept pointer events by default so UI controls remain usable
                renderer.domElement.style.pointerEvents = 'none';
                root.style.background = 'transparent';
                root.appendChild(renderer.domElement);

                // scene & camera (transparent background). We'll position the camera after the model is loaded
                scene = new THREE.Scene();
                scene.background = null;
                // Camera field-of-view (degrees). Smaller value => narrower POV (zoomed in).
                const CAMERA_FOV = 18; // adjusted per user
                camera = new THREE.PerspectiveCamera(CAMERA_FOV, root.clientWidth / root.clientHeight, 1, 2000);

                // interactive camera movement state (initialized after model loads)

                // lights
                const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
                scene.add(hemi);
                const dir = new THREE.DirectionalLight(0xffffff, 0.8);
                dir.position.set(0.5, 1, 0.8).normalize();
                scene.add(dir);

                // clock for animations
                clock = new THREE.Clock();

                // load fbx
                const loader = new FBXLoader();
                loader.load('../src/assets/trump_lp_anim_iddle01.fbx', (obj) => {

                    // Normalize scale
                    // First compute bounding box, then scale object to a predictable size
                    let box = new THREE.Box3().setFromObject(obj);
                    const size = new THREE.Vector3();
                    box.getSize(size);
                    const maxDim = Math.max(size.x, size.y, size.z) || 1;
                    const scale = (120 / maxDim);
                    obj.scale.setScalar(scale);
                    // recompute box after scaling so positioning calculations are correct
                    box = new THREE.Box3().setFromObject(obj);
                    box.getSize(size);


                    // apply colors texture if model has no material
                    const texLoader = new THREE.TextureLoader();
                    texLoader.load('../src/assets/tumpLPcolors.png', (tex) => {
                        let hasMesh = false;
                        obj.traverse((c) => {
                            if (c.isMesh) {
                                hasMesh = true;
                                if (!c.material || Array.isArray(c.material) && c.material.length === 0) {
                                    c.material = new THREE.MeshStandardMaterial({ map: tex });
                                } else if (c.material && c.material.isMaterial && !c.material.map) {
                                    c.material.map = tex; c.material.needsUpdate = true;
                                }
                                c.castShadow = false; c.receiveShadow = false;
                            }
                        });
                        // if no mesh found, add a placeholder
                        if (!hasMesh) {
                            const g = new THREE.BoxGeometry(80, 180, 40);
                            const m = new THREE.MeshStandardMaterial({ map: tex });
                            const mesh = new THREE.Mesh(g, m);
                            scene.add(mesh);
                        }
                    }, undefined, (err) => { console.warn('color texture load failed', err); });

                    // play animations if present
                    if (obj.animations && obj.animations.length) {
                        mixer = new THREE.AnimationMixer(obj);
                        obj.animations.forEach((clip) => mixer.clipAction(clip).play());
                    }

                        // center and add to scene
                    const center = new THREE.Vector3();
                    box.getCenter(center);
                    // move object so its center is at origin
                    obj.position.sub(center);

                    // compute an approximate face target: a point near the top quarter of the model
                    const faceTarget = center.clone();
                    // bias upward by ~22% of height to approximate face region (may be tuned per-model)
                    faceTarget.y += size.y * 0.5;

                    // position camera relative to model size so face fills view consistently
                    // Previously camera was placed along Z (facing -Z). To face -Y, place camera on +Y and look downwards.
                    const camDistance = Math.max(size.x, size.y, size.z) * 3.0;
                    // place camera on the -Y side so it looks toward +Y (faceTarget)
                    // apply a small negative-Z offset so the camera is moved slightly downwards
                    // move camera further down (increase multiplier to shift more along -Z)
                    const Z_OFFSET = 0 ; // was 0.12; adjust in 0.05..0.5 range as needed
                    camera.position.set(faceTarget.x, faceTarget.y - camDistance, faceTarget.z - Z_OFFSET);
                    // set up vector so the view 'up' is along +Z (prevents roll when looking along -Y)
                    camera.up.set(0, 0, 1);
                    camera.lookAt(faceTarget);

                    // Create a light that lives with the camera so it always illuminates the face area
                    // PointLight is positioned in camera-local space; negative Z is forward for the camera
                    const cameraLight = new THREE.PointLight(0xffffff, 200000, Math.max(400, camDistance * 3));
                    cameraLight.position.set(0, 0, -Math.max(60, size.y * 0.6)); // in front of camera
                    camera.add(cameraLight);
                    // small ambient to soften shadows
                    const cameraAmbient = new THREE.AmbientLight(0xffffff, 6);
                    camera.add(cameraAmbient);

                    // ensure camera is part of the scene graph so its children (lights) transform correctly
                    if (!scene.children.includes(camera)) scene.add(camera);

                    // store global face target so other systems can access it
                    faceTargetGlobal = faceTarget.clone();

                    // base camera position (world space) that represents the centered view
                    baseCameraPos = camera.position.clone();
                    targetCameraPos = baseCameraPos.clone();

                    // determine max shifts (user-specified constants)
                    MAX_SHIFT_X = 256.00; // fixed per user input
                    MAX_SHIFT_Z = 72.00;  // fixed per user input

                    // create a small axes helper in camera-local XZ plane for debugging (optional)
                    if (!camPlaneHelper) {
                        camPlaneHelper = new THREE.Group();
                        const matX = new THREE.LineBasicMaterial({ color: 0xff4444 });
                        const matZ = new THREE.LineBasicMaterial({ color: 0x4444ff });
                        const geoX = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-MAX_SHIFT_X,0,0), new THREE.Vector3(MAX_SHIFT_X,0,0)]);
                        const geoZ = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,0,-MAX_SHIFT_Z), new THREE.Vector3(0,0,MAX_SHIFT_Z)]);
                        const lineX = new THREE.Line(geoX, matX);
                        const lineZ = new THREE.Line(geoZ, matZ);
                        camPlaneHelper.add(lineX); camPlaneHelper.add(lineZ);
                        // attach helper to camera so it moves with it
                        camera.add(camPlaneHelper);
                    }

                    // mouse handling: map page pointer (clientX/clientY) -> normalized (-1..1)
                    function updatePointer(e) {
                        const rect = root.getBoundingClientRect();
                        const cx = ((e.clientX - rect.left) / rect.width) * 2 - 1; // -1..1
                        const cy = -(((e.clientY - rect.top) / rect.height) * 2 - 1); // -1..1, inverted Y
                        lastPointer.x = Math.max(-1, Math.min(1, cx));
                        lastPointer.y = Math.max(-1, Math.min(1, cy));

                        // compute target offset in camera local XZ plane
                        // X axis: left/right (camera local X)
                        // Z axis: up/down (camera local Z)
                        const offsetX = lastPointer.x * MAX_SHIFT_X;
                        // invert vertical mapping so mouse up/down produces opposite camera Z movement
                        const offsetZ = -lastPointer.y * MAX_SHIFT_Z;

                        // convert camera-local offsets to world by using camera local axes
                        const worldOffset = new THREE.Vector3();
                        // camera.getWorldDirection gives a vector pointing towards -Z in camera space; compute right and up
                        const camDir = new THREE.Vector3(); camera.getWorldDirection(camDir);
                        const camRight = new THREE.Vector3().crossVectors(camera.up, camDir).normalize();
                        const camUp = new THREE.Vector3().copy(camera.up).normalize();

                        worldOffset.copy(camRight).multiplyScalar(offsetX);
                        worldOffset.add(camUp.clone().multiplyScalar(offsetZ));

                        targetCameraPos.copy(baseCameraPos).add(worldOffset);
                    }

                    // bind pointermove to a parent container if present, otherwise listen on the whole document
                    // Prefer an explicit main container (#MAIN-CONTAIT) or .main-content to keep coordinates local,
                    // but default to document so the interaction works anywhere on the page.
                    const preferredParent = document.getElementById('MAIN-CONTAIT') || document.querySelector('.main-content');
                    const pointerContainer = preferredParent || document;
                    pointerContainer.addEventListener('pointermove', updatePointer);

                    scene.add(obj);

                    // initial render
                    animate();
                }, undefined, (err) => { console.error('FBX load failed', err); root.querySelector('.model-loading').textContent = '模型加载失败'; });

                // responsive
                window.addEventListener('resize', () => {
                    if (!renderer || !camera) return;
                    const w = root.clientWidth; const h = root.clientHeight;
                    renderer.setSize(w, h, false);
                    camera.aspect = w / h; camera.updateProjectionMatrix();
                });

            } catch (e) {
                console.error('three init error', e);
                root.querySelector('.model-loading').textContent = '无法初始化 3D 渲染器';
            }
        }

        function animate() {
            animId = requestAnimationFrame(animate);
            const dt = clock ? clock.getDelta() : 0.016;
            if (mixer) mixer.update(dt);

            // Smoothly interpolate camera position toward targetCameraPos if available
            if (camera && targetCameraPos && typeof targetCameraPos.lerp === 'function') {
                // smoothing factor scaled by dt
                const smoothing = Math.min(1, 6 * dt);
                camera.position.lerp(targetCameraPos, smoothing);
                // ensure camera children (lights/helpers) update
                camera.updateMatrixWorld();
                // always look at model face target if available
                if (faceTargetGlobal) camera.lookAt(faceTargetGlobal);
            }

            if (renderer && scene && camera) renderer.render(scene, camera);
            // remove loading once first frame rendered
            const loading = root.querySelector('.model-loading'); if (loading) loading.style.display = 'none';
        }

        // start lazy init when element becomes visible via IntersectionObserver (defer load)
        const io = new IntersectionObserver((entries) => {
            entries.forEach(ent => {
                if (ent.isIntersecting) { initThree(); io.disconnect(); }
            });
        }, { root: null, threshold: 0.1 });

        io.observe(root);

    // camera config panel removed per user request
    })();

    // ---- Sidebar hover expand/collapse ----
    (function sidebarHoverToggle() {
        const sidebar = document.querySelector('.sidebar');
        if (!sidebar) return;

        let collapseTimer = null;
        const COLLAPSE_DELAY = 600; // ms

        // decide whether to enable hover behavior only on wide screens
        function isHoverEnabled() {
            return window.innerWidth >= 1200;
        }

        function collapseNow() {
            sidebar.classList.add('collapsed');
        }

        function expandNow() {
            sidebar.classList.remove('collapsed');
        }

        // initial state: collapsed on wide screens
        if (isHoverEnabled()) collapseNow();

        // mouse enter: expand and cancel pending collapse
        sidebar.addEventListener('mouseenter', () => {
            if (collapseTimer) { clearTimeout(collapseTimer); collapseTimer = null; }
            expandNow();
        });

        // mouse leave: start delayed collapse
        sidebar.addEventListener('mouseleave', () => {
            if (!isHoverEnabled()) return;
            if (collapseTimer) clearTimeout(collapseTimer);
            collapseTimer = setTimeout(() => { collapseNow(); collapseTimer = null; }, COLLAPSE_DELAY);
        });

        // when window resizes, enable/disable behavior and ensure class state
        window.addEventListener('resize', () => {
            if (isHoverEnabled()) {
                // enable and collapse by default
                collapseNow();
            } else {
                // disable collapsed mode on small screens
                expandNow();
                if (collapseTimer) { clearTimeout(collapseTimer); collapseTimer = null; }
            }
        });
    })();

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
                    ? 'http://localhost:5001/chat'
                    : `${window.location.protocol}//${window.location.host}/chat`;

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


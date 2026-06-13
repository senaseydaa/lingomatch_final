/**
 * LingoMatch Nihai SaaS & Gece Modu (Dark Mode) JS Refactor
 * İnteraktif Onboarding (Wizard), Tema Yönetimi ve Oyun Dünyası Dinamikleri
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- State Management ---
    const state = {
        user: null,
        xp: 0,
        completedTasks: [],
        earnedBadges: ['dil_avcisi'],
        flashcards: [
            { word: 'Hello', meaning: 'Merhaba', example: 'Hello, how are you?' },
            { word: 'Chameleon', meaning: 'Bukalemun', example: 'Chameleons adapt to their environment.' },
            { word: 'Glow', meaning: 'Parlama', example: 'The neon lights glow in the dark.' }
        ]
    };

    // --- Onboarding Wizard Logic ---
    let currentObStep = 1;
    const maxObSteps = 4;

    // Geçici kayıt verileri
    const obData = { native: '🇹🇷 Türkçe', learning: '🇬🇧 İngilizce', level: 'Başlangıç (A1-A2)', hobby: 'Oyun', username: '' };

    function renderObProgress() {
        const percent = (currentObStep / maxObSteps) * 100;
        document.getElementById('ob-progress').style.width = percent + '%';

        // Bubbles for Chameleon
        const texts = [
            "", // index 0 unused
            "Lingo dünyasına hoş geldin! Puanlar seninle olsun. Hangi kültürdensin (Ana Dil)?",
            "Güzel bir başlangıç! Peki hangi dili öğrenmek için buradasın?",
            "Hedefini sevdik. Şu anki beceri seviyeni nasıl tanımlarsın?",
            "Son adım! Profilini oluşturalım ve en büyük ilgin nedir?"
        ];
        document.getElementById('ob-bubble-text').innerText = texts[currentObStep];

        // Göster/Gizle
        for (let i = 1; i <= maxObSteps; i++) {
            const el = document.getElementById('ob-step-' + i);
            if (el) {
                if (i === currentObStep) el.classList.remove('hidden');
                else el.classList.add('hidden');
            }
        }
    }

    // Seçim tıklamaları
    document.querySelectorAll('.ob-step .card-select').forEach(card => {
        card.addEventListener('click', (e) => {
            const stepCtx = e.target.closest('.ob-step');

            // Eğer hobiyse (çoklu seçim yok, ama birden fazla grup barındıran step varsa diye)
            if (e.target.classList.contains('ob-hobby-select')) {
                document.querySelectorAll('.ob-hobby-select').forEach(c => c.classList.remove('active'));
            } else {
                stepCtx.querySelectorAll('.card-select:not(.ob-hobby-select)').forEach(c => c.classList.remove('active'));
            }

            e.target.classList.add('active');

            // Değerleri kaydet
            if (currentObStep === 1) obData.native = e.target.dataset.val;
            if (currentObStep === 2) obData.learning = e.target.dataset.val;
            if (currentObStep === 3) obData.level = e.target.dataset.val;
            if (e.target.classList.contains('ob-hobby-select')) obData.hobby = e.target.dataset.val;

            // Butona basmadan direkt geçiş yapalım (Son adım hariç, daha akıcı)
            if (currentObStep < maxObSteps) {
                setTimeout(() => {
                    currentObStep++;
                    renderObProgress();
                }, 300); // 300ms tıklandığını hissettirme süresi
            }
        });
    });

    document.getElementById('btn-ob-next').addEventListener('click', () => {
        if (currentObStep < maxObSteps) {
            currentObStep++;
            renderObProgress();
        } else {
            // Sonuçları Topla ve Kaydet
            const inputName = document.getElementById('ob-username').value.trim();
            obData.username = inputName || 'LingoÇaylağı';
            finalizeRegistration();
        }
    });

    document.getElementById('btn-start-ob').addEventListener('click', () => {
        currentObStep = 1;
        renderObProgress();
        switchView('onboarding-view');
    });

    document.getElementById('btn-cancel-ob').addEventListener('click', () => switchView('splash-view'));

    function finalizeRegistration() {
        // ObData to Login
        loginUser(obData.username, obData.learning, true, obData.native, obData.hobby, obData.level);
    }

    // --- Görünümler Arası Geçiş ---
    const views = {
        splash: document.getElementById('splash-view'),
        login: document.getElementById('login-view'),
        onboarding: document.getElementById('onboarding-view'),
        feed: document.getElementById('feed-view'),
        match: document.getElementById('match-view'),
        flashcards: document.getElementById('flashcards-view'),
        profile: document.getElementById('profile-view'),
        search: document.getElementById('search-view'),
        settings: document.getElementById('settings-view'),
        quiz: document.getElementById('quiz-view')
    };

    const mainAppContainer = document.getElementById('main-app');

    function switchView(targetViewId) {
        Object.values(views).forEach(v => {
            if (v) v.classList.add('hidden');
            if (v) v.classList.remove('active');
        });

        // Clear search input if navigating away from search results
        if (targetViewId !== 'search-view') {
            const searchInput = document.getElementById('input-search');
            if (searchInput) searchInput.value = '';
        }

        const target = document.getElementById(targetViewId);
        if (target) {
            target.classList.remove('hidden');
            target.classList.add('active');
        }

        if (['feed-view', 'match-view', 'profile-view', 'flashcards-view', 'search-view', 'settings-view', 'quiz-view'].includes(targetViewId)) {
            mainAppContainer.classList.remove('hidden');
            document.querySelectorAll('.sidebar-nav .nav-item[data-target]').forEach(btn => {
                if (btn.dataset.target === targetViewId) btn.classList.add('active');
                else btn.classList.remove('active');
            });
        } else {
            mainAppContainer.classList.add('hidden');
        }

        if (targetViewId === 'quiz-view') {
            updateQuizSelectionPanel();
        }
    }

    document.querySelectorAll('[data-target]').forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            switchView(el.dataset.target);
            // Nav item'a tıklayınca menüyü kapat
            closeSidebar();
        });
    });

    // --- Hamburger Menü ---
    const sidebar = document.getElementById('main-sidebar');
    const overlay = document.getElementById('sidebar-overlay');

    function openSidebar() {
        sidebar.classList.add('open');
        overlay.classList.remove('hidden');
    }
    function closeSidebar() {
        sidebar.classList.remove('open');
        overlay.classList.add('hidden');
    }

    const hamburgerBtn = document.getElementById('btn-hamburger');
    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', () => {
            if (sidebar.classList.contains('open')) closeSidebar();
            else openSidebar();
        });
    }

    // Overlay'e tıklayınca menüyü kapat
    if (overlay) {
        overlay.addEventListener('click', closeSidebar);
    }

    // --- Header Avatar -> Profil sayfası ---
    const headerAvatar = document.getElementById('header-avatar');
    if (headerAvatar) {
        headerAvatar.addEventListener('click', () => switchView('profile-view'));
    }

    const searchForm = document.getElementById('form-search');
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const term = document.getElementById('input-search').value.trim();
            if (term) {
                document.getElementById('search-title').innerText = '"' + term + '" İçin Sonuçlar';
                switchView('search-view');
            }
        });
    }

    // --- Normal Login ---
    document.getElementById('login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('login-username').value;
        loginUser(username, '🇬🇧 İngilizce', false, '🇹🇷 Türkçe', 'Oyun', 'Orta (B1-B2)');
    });

    document.getElementById('btn-logout').addEventListener('click', () => {
        state.user = null;
        switchView('splash-view');
    });

    // --- DİNAMİK SEVİYE HESAPLAMA (A1-C2) ---
    function calculateLevel(xp) {
        if (xp < 100) return 'A1';
        if (xp < 250) return 'A2';
        if (xp < 500) return 'B1';
        if (xp < 800) return 'B2';
        if (xp < 1200) return 'C1';
        return 'C2';
    }

    // --- CORE KULLANICI MANTIĞI ---
    function loginUser(username, targetLang, isNew, nativeLang, hobby, level) {
        state.user = { name: username, lang: targetLang, native: nativeLang, hobby, level };
        
        // Seviyeye göre başlangıç puanını ayarlayalım
        if (level.includes('A1-A2') || level === 'A1' || level === 'A2') {
            state.xp = isNew ? 50 : 80;
        } else if (level.includes('B1-B2') || level === 'B1' || level === 'B2') {
            state.xp = isNew ? 250 : 320;
        } else if (level.includes('C1-C2') || level === 'C1' || level === 'C2') {
            state.xp = isNew ? 800 : 920;
        } else {
            state.xp = isNew ? 50 : 120;
        }

        const initials = username.substring(0, 2).toUpperCase();

        document.getElementById('header-avatar').innerText = initials;
        document.getElementById('profile-avatar-large').innerText = initials;
        document.getElementById('profile-username').innerText = username;

        updateXPDisplay();
        renderTasks(); renderFeed(); renderMatches(); renderBadges(); renderFlashcards();

        switchView('feed-view');
        if (isNew) showToast('Hoş Geldin Oyuncu!', `+${state.xp} XP Başlangıç Ödülü Yüklendi.`);
    }

    function updateXPDisplay() {
        document.getElementById('xp-count').innerText = state.xp;
        document.getElementById('stat-xp').innerText = state.xp;
        document.getElementById('stat-tasks').innerText = state.completedTasks.length;
        document.getElementById('stat-cards').innerText = state.flashcards.length;

        // Seviye etiketlerini dinamik olarak güncelle
        if (state.user) {
            const currentLevel = calculateLevel(state.xp);
            const tagsContainer = document.getElementById('profile-tags-container');
            if (tagsContainer) {
                tagsContainer.innerHTML = `
                    <span class="tag">${state.user.native}</span>
                    <span class="tag">${state.user.lang}</span>
                    <span class="tag" style="background:var(--primary); color:white; border:none; box-shadow:0 2px 0 var(--primary-shadow);">${currentLevel}</span>
                    <span class="tag" style="background:transparent; color:var(--text-dark); border:2px solid var(--border-color);">${state.user.hobby}</span>
                `;
            }
        }
    }

    function showToast(title, message) {
        const toast = document.getElementById('toast-notification');
        document.getElementById('toast-title').innerText = title;
        document.getElementById('toast-message').innerText = message;
        toast.classList.remove('hidden');
        setTimeout(() => toast.classList.add('hidden'), 3500);
    }

    // --- DARK MODE THEME TOGGLE ---
    const btnTheme = document.getElementById('btn-theme-toggle');
    const bodyEl = document.body;

    // Check local storage for preference
    const savedTheme = localStorage.getItem('lingoTheme');
    if (savedTheme) bodyEl.setAttribute('data-theme', savedTheme);

    btnTheme.addEventListener('click', () => {
        const currentTheme = bodyEl.getAttribute('data-theme');
        if (currentTheme === 'dark') {
            bodyEl.setAttribute('data-theme', 'light');
            btnTheme.innerHTML = `<i class="ph-fill ph-moon"></i> <span>Gece Modu</span>`;
            localStorage.setItem('lingoTheme', 'light');
        } else {
            bodyEl.setAttribute('data-theme', 'dark');
            btnTheme.innerHTML = `<i class="ph-fill ph-sun"></i> <span>Gündüz Modu</span>`;
            localStorage.setItem('lingoTheme', 'dark');
        }
    });

    // --- KONFETİ EFEKTİ ---
    function launchConfetti() {
        const container = document.getElementById('confetti-container');
        container.innerHTML = '';
        const colors = ['#0077B6', '#90E0EF', '#0096C7', '#F3F4F6', '#E2E8F0'];

        for (let i = 0; i < 80; i++) {
            const conf = document.createElement('div');
            conf.classList.add('confetti');
            conf.style.left = Math.random() * 100 + 'vw';
            conf.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            conf.style.animation = `fall ${Math.random() * 3 + 2}s linear forwards`;
            conf.style.animationDelay = Math.random() * 1 + 's';
            container.appendChild(conf);
        }
    }

    // --- RENDER FONKSİYONLARI ---

    const mockTasks = [
        { id: 1, title: '☕ Kahve Siparişi', desc: 'Partnerine sütlü bir latte sipariş etmeyi dene.', xp: 20 },
        { id: 2, title: '🗺️ Adres Sorma', desc: 'Partnerinden en yakın metro istasyonuna tarif iste.', xp: 15 },
        { id: 3, title: '🍕 Yemek Seçimi', desc: 'Partnerine bu akşam ne yemek istediğini sor.', xp: 40 }
    ];

    const mockFeed = [
        { id: 1, author: 'Alex Rivera', time: '1s önce', content: 'Fosforlu yeşilin gücü adına, İspanyolca çalışmak bambaşka!', liked: false, comments: [] },
        { id: 2, author: 'Sena S.', time: '3s önce', content: 'Dark mode ve Glow efekti şahane görünüyor.', liked: true, comments: [{ author: 'Kullanıcı', text: 'Gerçekten harika! 🐰' }] }
    ];

    const mockMatches = [
        { id: 'm1', name: 'Maria Garcia', lang: 'es', avatar: 'MG' },
        { id: 'm2', name: 'John Doe', lang: 'en', avatar: 'JD' },
        { id: 'm3', name: 'Emiko H.', lang: 'ja', avatar: 'EH' }
    ];

    function completeAvailableTask() {
        const uncompletedTask = mockTasks.find(t => !state.completedTasks.includes(t.id));
        if (uncompletedTask) {
            state.completedTasks.push(uncompletedTask.id);
            state.xp += uncompletedTask.xp;
            updateXPDisplay();
            renderTasks();
            showToast('Görev Tamamlandı! ✅', `+${uncompletedTask.xp} XP kazandınız!`);
        }
    }

    function renderTasks() {
        const container = document.getElementById('daily-tasks');
        container.innerHTML = '';
        mockTasks.forEach(task => {
            const isCompleted = state.completedTasks.includes(task.id);
            container.insertAdjacentHTML('beforeend', `
                <div class="task-card ${isCompleted ? 'completed' : ''}" data-task-id="${task.id}" style="${isCompleted ? 'border-color: #10B981;' : ''}">
                    <div class="task-info">
                        <h4>${task.title}</h4>
                        <p>${task.desc} <span style="color:var(--primary);font-weight:800;">(+${task.xp} XP)</span></p>
                    </div>
                    <button class="btn btn-3d btn-task" style="padding:10px 16px; font-size:0.9rem; ${isCompleted ? 'background-color: #10B981; border-color: #059669; color: white;' : 'background-color: var(--primary); border-color: #9333ea; color: white;'}" ${isCompleted ? 'disabled' : ''}>
                        ${isCompleted ? '✅ Tamamlandı' : 'Görevi Yap'}
                    </button>
                </div>
            `);
        });

        document.querySelectorAll('.btn-task').forEach(btn => {
            btn.addEventListener('click', (e) => {
                switchView('match-view');
            });
        });

        // Dark mode task observer hook
        btnTheme.addEventListener('click', () => {
            if (!state.completedTasks.includes(2) && state.user) {
                state.completedTasks.push(2);
                state.xp += 15;
                updateXPDisplay(); renderTasks();
                showToast('Gece Modu Aktif!', '+15 XP kazandın.');
            }
        });
    }

    function renderFeed() {
        const container = document.getElementById('social-feed');
        container.innerHTML = '';
        mockFeed.forEach(post => {
            container.insertAdjacentHTML('beforeend', `
                <div class="post-card">
                    <div class="post-header">
                        <div class="avatar" style="width:40px; height:40px; font-size:1rem; border:2px solid var(--primary);">${post.author.substring(0, 2).toUpperCase()}</div>
                        <span class="post-author">${post.author}</span>
                        <span class="post-time">${post.time}</span>
                    </div>
                    <div class="post-content">${post.content}</div>
                    <div class="post-actions">
                        <button class="btn-action btn-like ${post.liked ? 'liked' : ''}">
                            <i class="${post.liked ? 'ph-fill' : 'ph'} ph-heart"></i>
                            Beğen
                        </button>
                        <button class="btn-action btn-comment" data-id="${post.id}">
                            <i class="ph ph-chat-circle"></i> Yorum Yap
                        </button>
                    </div>
                    
                    <div class="comments-section" id="comments-${post.id}">
                        <div class="comments-list">
                            ${post.comments.map(c => `
                                <div class="comment-item">
                                    <div class="avatar" style="width:30px; height:30px; font-size:0.8rem; border:2px solid var(--primary);">${c.author.substring(0, 2).toUpperCase()}</div>
                                    <div class="comment-bubble"><strong>${c.author}</strong><br>${c.text}</div>
                                </div>
                            `).join('')}
                        </div>
                        <form class="comment-input-area" data-id="${post.id}">
                            <input type="text" placeholder="Bir şeyler yaz..." required>
                            <button type="submit" class="btn btn-3d primary" style="padding: 8px 16px; font-size:0.9rem;">İlet</button>
                        </form>
                    </div>
                </div>
            `);
        });

        // Event listeners...

        document.querySelectorAll('.btn-like').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const b = e.target.closest('.btn-like');
                const icon = b.querySelector('i');
                if (b.classList.contains('liked')) {
                    b.classList.remove('liked');
                    icon.className = 'ph ph-heart';
                } else {
                    b.classList.add('liked');
                    icon.className = 'ph-fill ph-heart';
                    if (!state.completedTasks.includes(3)) {
                        state.completedTasks.push(3);
                        state.xp += 40;
                        updateXPDisplay(); renderTasks();
                        showToast('Popülerlik', '+40 XP eklendi!');
                    }
                }
            });
        });

        document.querySelectorAll('.btn-comment').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                document.getElementById('comments-' + id).classList.toggle('open');
            });
        });

        document.querySelectorAll('.comment-input-area').forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const id = parseInt(e.currentTarget.dataset.id);
                const input = e.currentTarget.querySelector('input');
                const text = input.value.trim();
                if (text) {
                    const post = mockFeed.find(p => p.id === id);
                    post.comments.push({ author: state.user ? state.user.name : 'Misafir', text: text });
                    renderFeed();
                    document.getElementById('comments-' + id).classList.add('open');
                }
            });
        });
    }

    const postModal = document.getElementById('post-modal');
    document.getElementById('btn-new-post').addEventListener('click', () => postModal.classList.remove('hidden'));
    document.querySelector('.close-modal').addEventListener('click', () => postModal.classList.add('hidden'));
    document.getElementById('new-post-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const text = document.getElementById('post-text').value;
        mockFeed.unshift({ id: Date.now(), author: state.user.name, time: 'Şimdi', content: text, liked: false, comments: [] });
        e.target.reset(); postModal.classList.add('hidden'); renderFeed();
        state.xp += 10; updateXPDisplay(); showToast('Yayınlandı', '+10 Puan');
    });

    // --- Matches, Lingolandınız Kutlaması ---
    function renderMatches() {
        const container = document.getElementById('match-list');
        container.innerHTML = '';
        mockMatches.forEach(match => {
            container.insertAdjacentHTML('beforeend', `
                <div class="match-card" data-name="${match.name}" data-initials="${match.avatar}">
                    <div class="avatar" style="border: 2px solid var(--secondary);">${match.avatar}</div>
                    <div class="match-info">
                        <h4 style="font-size:1.15rem; color:var(--text-dark);">${match.name}</h4>
                        <p style="color:var(--text-muted); font-weight:700;">${match.lang.toUpperCase()} Kanalı</p>
                    </div>
                </div>
            `);
        });

        document.querySelectorAll('.match-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const c = e.target.closest('.match-card');
                const pName = c.dataset.name;
                const pInitials = c.dataset.initials;

                // GARANTİ MANTIK: Direkt sohbete gir, openChat içindeki mantık devreye girsin.
                openChat(pName, pInitials);
            });
        });
    }

    const chatWrapper = document.getElementById('active-chat-wrapper');
    const emptyState = document.getElementById('chat-empty-state');
    const chatMessages = document.getElementById('chat-messages');

    function appendMessage(text, type, saveToStorage = true) {
        let contentHtml = text;
        
        // Sadece normal metinler (resim içermeyen) için kelime tıklama özelliği ekle
        if (!text.includes('<img')) {
            contentHtml = text.split(' ').map(w => {
                const clean = w.replace(/[^a-zA-ZçğıöşüÇĞIÖŞÜ0-9]/g, '');
                if (clean.length > 2) return `<span class="word-span" data-word="${clean}">${w}</span>`;
                return w;
            }).join(' ');
        }

        chatMessages.insertAdjacentHTML('beforeend', `<div class="message ${type}" style="${text.includes('<img') ? 'background:transparent; border:none; padding:0; box-shadow:none;' : ''}">${contentHtml}</div>`);
        chatMessages.scrollTo(0, chatMessages.scrollHeight);

        const newMsgDiv = chatMessages.lastElementChild;
        newMsgDiv.querySelectorAll('.word-span').forEach(span => {
            span.addEventListener('click', (e) => flyToLibrary(e.target));
        });

        // LocalStorage kaydetme kaldırıldı (artık localStorage kullanılmıyor)
    }

    function openChat(partner, initials) {
        document.getElementById('chat-partner-name').innerText = partner;
        document.getElementById('chat-partner-avatar').innerText = initials;
        chatMessages.innerHTML = '';
        emptyState.classList.add('hidden');
        chatWrapper.classList.remove('hidden');
        chatWrapper.style.opacity = '0';

        // Partner adını modal içine yaz
        const partnerLabel = document.getElementById('lingo-greeting-partner');
        if (partnerLabel) partnerLabel.textContent = partner + ' ile eşleştin';

        // Modalı aç ve konfeti patlat
        const overlay = document.getElementById('lingo-greeting-overlay');
        if (overlay) overlay.classList.remove('hidden');
        launchGreetingConfetti();

        // "Sohbete Işınlan" butonunu bağla (her seferinde yenile)
        const startBtn = document.getElementById('btn-start-convo');
        if (startBtn) {
            const newBtn = startBtn.cloneNode(true);
            startBtn.parentNode.replaceChild(newBtn, startBtn);
            newBtn.addEventListener('click', () => {
                if (overlay) overlay.classList.add('hidden');
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        chatWrapper.style.transition = 'opacity 0.4s ease';
                        chatWrapper.style.opacity = '1';
                    });
                });
                let firstMsg = 'Merhaba! Seninle konuşmak harika.';
                if (partner.includes('Maria')) firstMsg = '¡Hola! Qué buena coincidencia. ¿Cómo estás?';
                else if (partner.includes('Emiko')) firstMsg = 'Nice to meet you! Let\'s practice together.';
                else if (partner.includes('John')) firstMsg = 'Great match! How are you doing today?';
                appendMessage(firstMsg, 'received', false);
            });
        }
    }

    function launchGreetingConfetti() {
        const container = document.getElementById('lingo-confetti-container');
        if (!container) return;
        container.innerHTML = '';
        const colors = ['#0077B6', '#90E0EF', '#0096C7', '#FF4B4B', '#FFD700', '#34D399', '#F472B6'];
        for (let i = 0; i < 80; i++) {
            const c = document.createElement('div');
            const size = 6 + Math.random() * 10;
            c.style.cssText = `
                position:fixed;
                width:${size}px; height:${size}px;
                background:${colors[Math.floor(Math.random() * colors.length)]};
                border-radius:${Math.random() > 0.5 ? '50%' : '3px'};
                left:${Math.random() * 100}vw;
                top:-20px;
                z-index:10000;
                animation: confettiFall ${1.5 + Math.random() * 2}s ease-in ${Math.random() * 0.6}s forwards;
            `;
            container.appendChild(c);
        }
    }
    document.getElementById('chat-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('chat-input');
        const text = input.value;
        if (!text.trim()) return;

        appendMessage(text, 'sent', false);
        input.value = '';

        setTimeout(() => completeAvailableTask(), 500);
    });

    // --- Fly-to-Library Animasyonu ---
    function flyToLibrary(node) {
        const word = node.dataset.word;
        if (!word) return;

        const rect = node.getBoundingClientRect();
        const ghost = document.createElement('div');
        ghost.classList.add('mini-flying-card');
        ghost.innerText = word;

        ghost.style.left = rect.left + 'px';
        ghost.style.top = rect.top + 'px';
        document.body.appendChild(ghost);

        const targetBtn = document.querySelector('.nav-item[data-target="flashcards-view"] i');
        const tRect = targetBtn.getBoundingClientRect();

        const diffX = tRect.left - rect.left - 10;
        const diffY = tRect.top - rect.top - 10;

        setTimeout(() => {
            ghost.style.transform = `translate(${diffX}px, ${diffY}px) scale(0.2)`;
            ghost.style.opacity = '0';
        }, 50);

        setTimeout(() => {
            ghost.remove();

            targetBtn.classList.remove('jiggle-animate');
            void targetBtn.offsetWidth;
            targetBtn.classList.add('jiggle-animate');

            state.flashcards.unshift({ word: word, meaning: 'Anlamı', example: 'Cümle İçindeki Kullanımı' });
            renderFlashcards(); updateXPDisplay();
            showToast('Zihnine Kazındı!', `"${word}" Hazinene Eklendi!`);
            setTimeout(() => completeAvailableTask(), 300);
        }, 650);
    }

    document.getElementById('btn-sticker-toggle').addEventListener('click', () => {
        document.getElementById('sticker-panel').classList.toggle('hidden');
    });

    document.querySelectorAll('.sticker-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetBtn = e.currentTarget;
            const gifSrc = targetBtn.dataset.gif;
            
            let partnerName = document.getElementById('chat-partner-name').innerText;
            const storageKey = 'chat_history_' + partnerName;
            let historyBefore = JSON.parse(localStorage.getItem(storageKey)) || [];

            const imgTag = `<img src="${gifSrc}" style="width:140px; border-radius:var(--radius-lg); box-shadow:var(--shadow-md);">`;
            appendMessage(imgTag, 'sent');
            
            document.getElementById('sticker-panel').classList.add('hidden');
        });
    });

    function renderFlashcards() {
        const container = document.getElementById('flashcards-container');
        container.innerHTML = '';
        state.flashcards.forEach(card => {
            container.insertAdjacentHTML('beforeend', `
                <div class="flashcard" onclick="this.classList.toggle('flipped')">
                    <div class="flashcard-inner">
                        <div class="flashcard-front">${card.word}</div>
                        <div class="flashcard-back">
                            <span>${card.meaning}</span>
                            <p>${card.example}</p>
                        </div>
                    </div>
                </div>
            `);
        });
    }

    function renderBadges() {
        const container = document.getElementById('badges-container');
        const allBadges = [
            { id: 'dil_avcisi', name: 'Dil Avcısı', icon: '<i class="ph-fill ph-target"></i>' },
            { id: 'sohbet_canavari', name: 'Sohbet Kurdu', icon: '<i class="ph-fill ph-alien"></i>' },
            { id: 'kelime_bukucu', name: 'Zihin Ustası', icon: '<i class="ph-fill ph-magic-wand"></i>' }
        ];

        container.innerHTML = '';
        allBadges.forEach(b => {
            const earned = state.earnedBadges.includes(b.id) ? 'earned' : '';
            container.insertAdjacentHTML('beforeend', `
                <div class="badge-item ${earned}">
                    <div class="badge-icon">${b.icon}</div>
                    <span style="font-size:0.95rem; font-weight:800; color:var(--text-dark);">${b.name}</span>
                </div>
             `);
        });
    }

    // --- Ayarlar (Settings) Etkileşimleri ---
    const btnClearData = document.getElementById('btn-clear-data');
    if (btnClearData) {
        btnClearData.addEventListener('click', () => {
            if (confirm('Tüm verilerinizi silmek istediğinize emin misiniz?')) {
                localStorage.clear();
                window.location.reload();
            }
        });
    }


    const intensityBtns = document.querySelectorAll('.intensity-btn');
    intensityBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            intensityBtns.forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
        });
    });

    const toggleHighContrast = document.getElementById('toggle-high-contrast');
    if (toggleHighContrast) {
        toggleHighContrast.addEventListener('change', (e) => {
            if (e.target.checked) {
                document.body.classList.add('high-contrast');
            } else {
                document.body.classList.remove('high-contrast');
            }
        });
    }

    // --- QUIZ DATA & ENGINE ---
    const quizQuestionPool = {
        "🇬🇧 İngilizce": {
            "vocab": {
                "A1": [
                    { type: "choice", question: "Which word means 'Elma'?", options: ["Banana", "Apple", "Orange", "Grape"], answer: "Apple" },
                    { type: "boolean", question: "True or False: 'Book' means 'Masa' in Turkish.", options: ["Doğru (True)", "Yanlış (False)"], answer: "Yanlış (False)" },
                    { type: "fill", question: "Complete: The color of milk is ___.", options: ["red", "green", "white"], answer: "white" }
                ],
                "A2": [
                    { type: "choice", question: "Which is the opposite of 'Difficult'?", options: ["Easy", "Hard", "Heavy", "Strong"], answer: "Easy" },
                    { type: "boolean", question: "True or False: 'Bicycle' has two wheels.", options: ["Doğru (True)", "Yanlış (False)"], answer: "Doğru (True)" },
                    { type: "fill", question: "Complete: An ___ is a very large animal.", options: ["ant", "elephant", "cat"], answer: "elephant" }
                ],
                "B1": [
                    { type: "choice", question: "Which word is a synonym for 'Purchase'?", options: ["Sell", "Buy", "Rent", "Lend"], answer: "Buy" },
                    { type: "boolean", question: "True or False: 'Cozy' means extremely cold.", options: ["Doğru (True)", "Yanlış (False)"], answer: "Yanlış (False)" },
                    { type: "fill", question: "Complete: Please do not ___ the rules.", options: ["follow", "break", "make"], answer: "break" }
                ],
                "B2": [
                    { type: "choice", question: "What is a synonym for 'Accurate'?", options: ["Vague", "Precise", "Careless", "Quick"], answer: "Precise" },
                    { type: "boolean", question: "True or False: 'Obsolete' means outdated and no longer used.", options: ["Doğru (True)", "Yanlış (False)"], answer: "Doğru (True)" },
                    { type: "fill", question: "Complete: The business went ___ after the financial crash.", options: ["bankrupt", "successful", "wealthy"], answer: "bankrupt" }
                ],
                "C1": [
                    { type: "choice", question: "Which word means 'very enthusiastic or passionate'?", options: ["Indifferent", "Ardent", "Apathetic", "Lethargic"], answer: "Ardent" },
                    { type: "boolean", question: "True or False: 'Transient' means lasting for a very long time.", options: ["Doğru (True)", "Yanlış (False)"], answer: "Yanlış (False)" },
                    { type: "fill", question: "Complete: The speaker's arguments were so ___ that everyone agreed.", options: ["flimsy", "cogent", "unclear"], answer: "cogent" }
                ],
                "C2": [
                    { type: "choice", question: "Select the word that denotes 'extreme poverty':", options: ["Penury", "Affluence", "Splendor", "Moderation"], answer: "Penury" },
                    { type: "boolean", question: "True or False: 'Kakistocracy' means government by the least qualified citizens.", options: ["Doğru (True)", "Yanlış (False)"], answer: "Doğru (True)" },
                    { type: "fill", question: "Complete: Over the years, the monument has been ___ by wind and rain.", options: ["refurbished", "weathered", "constructed"], answer: "weathered" }
                ]
            },
            "grammar": {
                "A1": [
                    { type: "choice", question: "Complete: We _______ students.", options: ["is", "am", "are", "be"], answer: "are" },
                    { type: "boolean", question: "True or False: 'She like apples' is grammatically correct.", options: ["Doğru (True)", "Yanlış (False)"], answer: "Yanlış (False)" },
                    { type: "fill", question: "Complete: Where ___ you from?", options: ["is", "am", "are"], answer: "are" }
                ],
                "A2": [
                    { type: "choice", question: "Complete: He _______ a book yesterday.", options: ["reads", "read", "reading", "will read"], answer: "read" },
                    { type: "boolean", question: "True or False: 'He has gone to Paris last week' is grammatically correct.", options: ["Doğru (True)", "Yanlış (False)"], answer: "Yanlış (False)" },
                    { type: "fill", question: "Complete: She is taller ___ her sister.", options: ["than", "then", "that"], answer: "than" }
                ],
                "B1": [
                    { type: "choice", question: "Complete: If I had more time, I _______ learn tennis.", options: ["will", "would", "would have", "shall"], answer: "would" },
                    { type: "boolean", question: "True or False: 'I have been studying English since three years' is correct.", options: ["Doğru (True)", "Yanlış (False)"], answer: "Yanlış (False)" },
                    { type: "fill", question: "Complete: I am looking forward ___ meeting you.", options: ["to", "for", "at"], answer: "to" }
                ],
                "B2": [
                    { type: "choice", question: "Complete: She apologized _______ being late.", options: ["for", "to", "on", "about"], answer: "for" },
                    { type: "boolean", question: "True or False: In passive voice, 'They built the house' becomes 'The house was built by them'.", options: ["Doğru (True)", "Yanlış (False)"], answer: "Doğru (True)" },
                    { type: "fill", question: "Complete: I wish I ___ harder for the exam yesterday.", options: ["studied", "had studied", "study"], answer: "had studied" }
                ],
                "C1": [
                    { type: "choice", question: "Choose the correct inversion: Little _______ that she was wrong.", options: ["she knew", "did she know", "she had known", "knew she"], answer: "did she know" },
                    { type: "boolean", question: "True or False: 'He demanded that she is present' is the correct use of subjunctive mood.", options: ["Doğru (True)", "Yanlış (False)"], answer: "Yanlış (False)" },
                    { type: "fill", question: "Complete: Had they checked the weather, they ___ the trip.", options: ["won't start", "wouldn't have started", "will not start"], answer: "wouldn't have started" }
                ],
                "C2": [
                    { type: "choice", question: "Identify the correct form: Try _______ she might, she couldn't open the jar.", options: ["as", "how", "hard", "though"], answer: "as" },
                    { type: "boolean", question: "True or False: 'Under no circumstances should you open that door' uses correct inversion.", options: ["Doğru (True)", "Yanlış (False)"], answer: "Doğru (True)" },
                    { type: "fill", question: "Complete: Were it not for your help, I ___ in trouble now.", options: ["would be", "will be", "had been"], answer: "would be" }
                ]
            },
            "practice": {
                "A1": [
                    { type: "choice", question: "How do you ask someone's name?", options: ["How old are you?", "What is your name?", "Where are you?", "How are you?"], answer: "What is your name?" },
                    { type: "boolean", question: "True or False: 'Good night' is used when greeting someone in the morning.", options: ["Doğru (True)", "Yanlış (False)"], answer: "Yanlış (False)" },
                    { type: "fill", question: "Complete: Nice to ___ you.", options: ["meet", "look", "see"], answer: "meet" }
                ],
                "A2": [
                    { type: "choice", question: "What do you say when you want to buy something?", options: ["How much is this?", "What time is it?", "Where is the bathroom?", "Can you help me?"], answer: "How much is this?" },
                    { type: "boolean", question: "True or False: 'Bless you' is said when someone sneezes.", options: ["Doğru (True)", "Yanlış (False)"], answer: "Doğru (True)" },
                    { type: "fill", question: "Complete: Could you ___ me the way to the station?", options: ["say", "tell", "speak"], answer: "tell" }
                ],
                "B1": [
                    { type: "choice", question: "Which phrase is used to give advice?", options: ["If I were you, I would...", "I don't think so.", "Never mind.", "I agree with you."], answer: "If I were you, I would..." },
                    { type: "boolean", question: "True or False: 'Would you mind helping me?' expects 'Yes, I would' if you want to help.", options: ["Doğru (True)", "Yanlış (False)"], answer: "Yanlış (False)" },
                    { type: "fill", question: "Complete: I am not sure, but it ___ rain later.", options: ["must", "might", "should"], answer: "might" }
                ],
                "B2": [
                    { type: "choice", question: "What is a polite way to interrupt someone?", options: ["Shut up.", "May I check something?", "Sorry to interrupt, but...", "Wait a minute."], answer: "Sorry to interrupt, but..." },
                    { type: "boolean", question: "True or False: 'Take it easy' means to work extremely hard.", options: ["Doğru (True)", "Yanlış (False)"], answer: "Yanlış (False)" },
                    { type: "fill", question: "Complete: Let's ___ the pros and cons before deciding.", options: ["weigh", "make", "think"], answer: "weigh" }
                ],
                "C1": [
                    { type: "choice", question: "What does it mean to 'play devil's advocate'?", options: ["To support the popular view", "To argue against an idea for the sake of debate", "To make a mistake", "To create a conflict"], answer: "To argue against an idea for the sake of debate" },
                    { type: "boolean", question: "True or False: 'To hit the nail on the head' means to say something precisely correct.", options: ["Doğru (True)", "Yanlış (False)"], answer: "Doğru (True)" },
                    { type: "fill", question: "Complete: The new regulations have ___ a lot of controversy.", options: ["sparked", "prevented", "dissolved"], answer: "sparked" }
                ],
                "C2": [
                    { type: "choice", question: "What is the meaning of 'to burn the midnight oil'?", options: ["To waste energy", "To study or work late into the night", "To start a fire", "To sleep early"], answer: "To study or work late into the night" },
                    { type: "boolean", question: "True or False: 'To kick the bucket' is a formal way to say someone retired.", options: ["Doğru (True)", "Yanlış (False)"], answer: "Yanlış (False)" },
                    { type: "fill", question: "Complete: Her response was a classic case of ___ the issue.", options: ["skirting", "facing", "resolving"], answer: "skirting" }
                ]
            },
            "culture": {
                "A1": [
                    { type: "choice", question: "Which is the capital of the United Kingdom?", options: ["Paris", "Berlin", "London", "Rome"], answer: "London" },
                    { type: "boolean", question: "True or False: Halloween is celebrated in October.", options: ["Doğru (True)", "Yanlış (False)"], answer: "Doğru (True)" },
                    { type: "fill", question: "Complete: Thanksgiving is a popular holiday in the ___.", options: ["UK", "USA", "Germany"], answer: "USA" }
                ],
                "A2": [
                    { type: "choice", question: "What is the traditional British food?", options: ["Fish and Chips", "Pizza", "Tacos", "Sushi"], answer: "Fish and Chips" },
                    { type: "boolean", question: "True or False: The currency in the US is the Pound.", options: ["Doğru (True)", "Yanlış (False)"], answer: "Yanlış (False)" },
                    { type: "fill", question: "Complete: The Statue of Liberty is in New ___.", options: ["Jersey", "York", "Orleans"], answer: "York" }
                ],
                "B1": [
                    { type: "choice", question: "Who wrote the play 'Romeo and Juliet'?", options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"], answer: "William Shakespeare" },
                    { type: "boolean", question: "True or False: Big Ben is the name of the tower in London, not the bell inside.", options: ["Doğru (True)", "Yanlış (False)"], answer: "Yanlış (False)" },
                    { type: "fill", question: "Complete: The famous prehistoric monument Stonehenge is in ___.", options: ["Scotland", "England", "Ireland"], answer: "England" }
                ],
                "B2": [
                    { type: "choice", question: "Which is the largest English-speaking country by area?", options: ["United States", "Canada", "Australia", "United Kingdom"], answer: "Canada" },
                    { type: "boolean", question: "True or False: The US Independence Day is celebrated on July 4th.", options: ["Doğru (True)", "Yanlış (False)"], answer: "Doğru (True)" },
                    { type: "fill", question: "Complete: The Loch Ness Monster is a legend from ___.", options: ["Wales", "Scotland", "Ireland"], answer: "Scotland" }
                ],
                "C1": [
                    { type: "choice", question: "Which city is known as the 'Cradle of Jazz'?", options: ["New York", "Chicago", "New Orleans", "Los Angeles"], answer: "New Orleans" },
                    { type: "boolean", question: "True or False: The Magna Carta was signed in the 15th century.", options: ["Doğru (True)", "Yanlış (False)"], answer: "Yanlış (False)" },
                    { type: "fill", question: "Complete: The UK parliament consists of the House of Commons and the House of ___.", options: ["Representatives", "Lords", "Senators"], answer: "Lords" }
                ],
                "C2": [
                    { type: "choice", question: "What historical event in 1066 reshaped the English language?", options: ["The Magna Carta signing", "The Norman Conquest", "The Black Death", "The Industrial Revolution"], answer: "The Norman Conquest" },
                    { type: "boolean", question: "True or False: The term 'Jerry' was a British slang term for Germans in WWII.", options: ["Doğru (True)", "Yanlış (False)"], answer: "Doğru (True)" },
                    { type: "fill", question: "Complete: The literary movement of Harlem Renaissance took place in the ___.", options: ["1890s", "1920s", "1950s"], answer: "1920s" }
                ]
            }
        },
        "🇪🇸 İspanyolca": {
            "vocab": {
                "A1": [
                    { type: "choice", question: "¿Qué significa 'Perro'?", options: ["Cat", "Dog", "Bird", "Fish"], answer: "Dog" },
                    { type: "boolean", question: "Verdadero o Falso: 'Libro' significa 'Sandalye' en turco.", options: ["Doğru (True)", "Yanlış (False)"], answer: "Yanlış (False)" },
                    { type: "fill", question: "Completa: El color de la leche es ___.", options: ["rojo", "verde", "blanco"], answer: "blanco" }
                ],
                "A2": [
                    { type: "choice", question: "¿Cuál es el opuesto de 'Fácil'?", options: ["Difícil", "Grande", "Lento", "Fuerte"], answer: "Difícil" },
                    { type: "boolean", question: "Verdadero o Falso: Una 'bicicleta' tiene cuatro ruedas.", options: ["Doğru (True)", "Yanlış (False)"], answer: "Yanlış (False)" },
                    { type: "fill", question: "Completa: El ___ es el animal terrestre más grande.", options: ["gato", "elefante", "ratón"], answer: "elefante" }
                ],
                "B1": [
                    { type: "choice", question: "¿Cuál es un sinónimo de 'Comprar'?", options: ["Vender", "Adquirir", "Alquilar", "Prestar"], answer: "Adquirir" },
                    { type: "boolean", question: "Verdadero o Falso: 'Cálido' significa extremadamente frío.", options: ["Doğru (True)", "Yanlış (False)"], answer: "Yanlış (False)" },
                    { type: "fill", question: "Completa: Por favor, no ___ las reglas.", options: ["rompas", "sigas", "hagas"], answer: "rompas" }
                ],
                "B2": [
                    { type: "choice", question: "¿Cuál es un sinónimo de 'Preciso'?", options: ["Vago", "Exacto", "Rápido", "Despistado"], answer: "Exacto" },
                    { type: "boolean", question: "Verdadero o Falso: 'Obsoleto' significa anticuado y que ya no se usa.", options: ["Doğru (True)", "Yanlış (False)"], answer: "Doğru (True)" },
                    { type: "fill", question: "Completa: La empresa quedó en ___ tras la crisis financiera.", options: ["bancarrota", "éxito", "riqueza"], answer: "bancarrota" }
                ],
                "C1": [
                    { type: "choice", question: "¿Qué palabra significa 'muy entusiasta'?", options: ["Indiferente", "Ardiente", "Apático", "Letárgico"], answer: "Ardiente" },
                    { type: "boolean", question: "Verdadero o Falso: 'Efímero' significa que dura mucho tiempo.", options: ["Doğru (True)", "Yanlış (False)"], answer: "Yanlış (False)" },
                    { type: "fill", question: "Completa: Sus argumentos fueron tan ___ que todos aceptaron.", options: ["débiles", "convincentes", "oscuros"], answer: "convincentes" }
                ],
                "C2": [
                    { type: "choice", question: "Selecciona la palabra que denota 'pobreza extrema':", options: ["Penuria", "Opulencia", "Esplendor", "Templanza"], answer: "Penuria" },
                    { type: "boolean", question: "Verdadero o Falso: 'Cacocracia' es el gobierno de los peores ciudadanos.", options: ["Doğru (True)", "Yanlış (False)"], answer: "Doğru (True)" },
                    { type: "fill", question: "Completa: Con los años, el monumento ha sido ___ por el viento.", options: ["restaurado", "desgastado", "construido"], answer: "desgastado" }
                ]
            },
            "grammar": {
                "A1": [
                    { type: "choice", question: "Completa: Nosotros _______ estudiantes.", options: ["soy", "somos", "estoy", "estamos"], answer: "somos" },
                    { type: "boolean", question: "Verdadero o Falso: 'Él gustan las manzanas' es gramaticalmente correcto.", options: ["Doğru (True)", "Yanlış (False)"], answer: "Yanlış (False)" },
                    { type: "fill", question: "Completa: ¿De dónde ___ tú?", options: ["eres", "estás", "tienes"], answer: "eres" }
                ],
                "A2": [
                    { type: "choice", question: "Completa: Ayer yo _______ un libro.", options: ["leo", "leí", "leyendo", "leeré"], answer: "leí" },
                    { type: "boolean", question: "Verdadero o Falso: 'He comido paella la semana pasada' es correcto en español de España.", options: ["Doğru (True)", "Yanlış (False)"], answer: "Yanlış (False)" },
                    { type: "fill", question: "Completa: Ella es más alta ___ su hermana.", options: ["que", "como", "de"], answer: "que" }
                ],
                "B1": [
                    { type: "choice", question: "Completa: Si tuviera tiempo, _______ al tenis.", options: ["jugaría", "juego", "jugara", "jugaré"], answer: "jugaría" },
                    { type: "boolean", question: "Verdadero o Falso: 'Estudio español desde hace tres años' es correcto.", options: ["Doğru (True)", "Yanlış (False)"], answer: "Doğru (True)" },
                    { type: "fill", question: "Completa: Es importante que tú ___ la verdad.", options: ["digas", "dices", "dirás"], answer: "digas" }
                ],
                "B2": [
                    { type: "choice", question: "Completa: Se disculpó _______ llegar tarde.", options: ["por", "para", "de", "con"], answer: "por" },
                    { type: "boolean", question: "Verdadero o Falso: En voz pasiva, 'Ellos construyeron la casa' es 'La casa fue construida por ellos'.", options: ["Doğru (True)", "Yanlış (False)"], answer: "Doğru (True)" },
                    { type: "fill", question: "Completa: Ojalá ___ estudiado más ayer.", options: ["hubiera", "haya", "había"], answer: "hubiera" }
                ],
                "C1": [
                    { type: "choice", question: "Elige la opción correcta: No solo _______, sino que también cantó.", options: ["bailó", "bailara", "bailaría", "baila"], answer: "bailó" },
                    { type: "boolean", question: "Verdadero o Falso: 'Exijo que se vaya' utiliza correctamente el subjuntivo.", options: ["Doğru (True)", "Yanlış (False)"], answer: "Doğru (True)" },
                    { type: "fill", question: "Completa: De haber hecho sol, ___ a la playa.", options: ["iríamos", "habríamos ido", "iremos"], answer: "habríamos ido" }
                ],
                "C2": [
                    { type: "choice", question: "Elige la forma correcta: Por más que _______, no lo consiguió.", options: ["intenta", "intentara", "intentará", "intentó"], answer: "intentara" },
                    { type: "boolean", question: "Verdadero o Falso: 'Le di el regalo a ella' se puede abreviar como 'Se lo di'.", options: ["Doğru (True)", "Yanlış (False)"], answer: "Se lo di" },
                    { type: "fill", question: "Completa: Si no hubiera sido por tu ayuda, ahora ___ en problemas.", options: ["estaría", "estaré", "estuve"], answer: "estaría" }
                ]
            },
            "practice": {
                "A1": [
                    { type: "choice", question: "¿Cómo se pregunta el nombre de alguien?", options: ["¿Cuántos años tienes?", "¿Cómo te llamas?", "¿Dónde estás?", "¿Cómo estás?"], answer: "¿Cómo te llamas?" },
                    { type: "boolean", question: "Verdadero o Falso: 'Buenas noches' se usa para saludar por la mañana.", options: ["Doğru (True)", "Yanlış (False)"], answer: "Yanlış (False)" },
                    { type: "fill", question: "Completa: Encantado de ___.", options: ["conocerte", "verlo", "mirar"], answer: "conocerte" }
                ],
                "A2": [
                    { type: "choice", question: "¿Qué dices cuando quieres saber el precio de algo?", options: ["¿Cuánto cuesta esto?", "¿Qué hora es?", "¿Dónde está el baño?", "¿Me ayudas?"], answer: "¿Cuánto cuesta esto?" },
                    { type: "boolean", question: "Verdadero o Falso: 'Salud' se dice cuando alguien estornuda.", options: ["Doğru (True)", "Yanlış (False)"], answer: "Doğru (True)" },
                    { type: "fill", question: "Completa: ¿Podrías ___ dónde está la estación?", options: ["decirme", "hablarme", "contarme"], answer: "decirme" }
                ],
                "B1": [
                    { type: "choice", question: "¿Qué frase se usa para dar un consejo?", options: ["Si yo fuera tú, haría...", "No lo creo.", "No importa.", "Estoy de acuerdo."], answer: "Si yo fuera tú, haría..." },
                    { type: "boolean", question: "Verdadero o Falso: '¿Te importa ayudarme?' espera un 'Sí, me importa' si quieres ayudar.", options: ["Doğru (True)", "Yanlış (False)"], answer: "Yanlış (False)" },
                    { type: "fill", question: "Completa: No estoy seguro, pero ___ llover más tarde.", options: ["debe", "podría", "tengo que"], answer: "podría" }
                ],
                "B2": [
                    { type: "choice", question: "¿Cuál es una forma educada de interrumpir?", options: ["Cállate.", "¿Puedo hablar?", "Disculpa que interrompa, pero...", "Espera."], answer: "Disculpa que interrumpa, pero..." },
                    { type: "boolean", question: "Verdadero o Falso: 'Tomárselo con calma' significa trabajar extremadamente duro.", options: ["Doğru (True)", "Yanlış (False)"], answer: "Yanlış (False)" },
                    { type: "fill", question: "Completa: Vamos a ___ los pros y los contras antes de decidir.", options: ["sopesar", "hacer", "pensar"], answer: "sopesar" }
                ],
                "C1": [
                    { type: "choice", question: "¿Qué significa 'jugar al abogado del diablo'?", options: ["Apoyar la opinión popular", "Defender una posición contraria por debate", "Cometer un error", "Crear un conflicto"], answer: "Defender una posición contraria por debate" },
                    { type: "boolean", question: "Verdadero o Falso: 'Dar en el clavo' significa decir algo exactamente correcto.", options: ["Doğru (True)", "Yanlış (False)"], answer: "Doğru (True)" },
                    { type: "fill", question: "Completa: Las nuevas medidas han ___ mucha polémica.", options: ["desatado", "evitado", "resuelto"], answer: "desatado" }
                ],
                "C2": [
                    { type: "choice", question: "¿Qué significa 'quemarse las pestañas'?", options: ["Perder el tempo", "Estudiar o trabajar hasta muy tarde en la noche", "Hacer ejercicio", "Dormir temprano"], answer: "Estudiar o trabajar hasta muy tarde en la noche" },
                    { type: "boolean", question: "Verdadero o Falso: 'Estirar la pata' es una forma formal de decir que alguien se jubiló.", options: ["Doğru (True)", "Yanlış (False)"], answer: "Yanlış (False)" },
                    { type: "fill", question: "Completa: Su respuesta fue un clásico caso de ___ el tema.", options: ["esquivar", "afrontar", "resolver"], answer: "esquivar" }
                ]
            },
            "culture": {
                "A1": [
                    { type: "choice", question: "¿Cuál es la capital de España?", options: ["Barcelona", "Sevilla", "Madrid", "Valencia"], answer: "Madrid" },
                    { type: "boolean", question: "Verdadero o Falso: El Día de los Muertos es muy popular en México.", options: ["Doğru (True)", "Yanlış (False)"], answer: "Doğru (True)" },
                    { type: "fill", question: "Completa: El tango es originario de ___.", options: ["España", "Argentina", "Colombia"], answer: "Argentina" }
                ],
                "A2": [
                    { type: "choice", question: "¿Qué comida es típica de España?", options: ["Tacos", "Sushi", "Paella", "Fish and Chips"], answer: "Paella" },
                    { type: "boolean", question: "Verdadero o Falso: La moneda de México es el Peso.", options: ["Doğru (True)", "Yanlış (False)"], answer: "Doğru (True)" },
                    { type: "fill", question: "Completa: La famosa danza 'Flamenco' nació en ___.", options: ["Galicia", "Andalucía", "Cataluña"], answer: "Andalucía" }
                ],
                "B1": [
                    { type: "choice", question: "¿Quién escribió 'Don Quijote de la Mancha'?", options: ["Gabriel García Márquez", "Miguel de Cervantes", "Pablo Neruda", "Federico García Lorca"], answer: "Miguel de Cervantes" },
                    { type: "boolean", question: "Verdadero o Falso: El río Amazonas pasa por España.", options: ["Doğru (True)", "Yanlış (False)"], answer: "Yanlış (False)" },
                    { type: "fill", question: "Completa: Las ruinas de Machu Picchu están en ___.", options: ["Colombia", "Perú", "Chile"], answer: "Perú" }
                ],
                "B2": [
                    { type: "choice", question: "¿Cuál es el país de habla hispana más grande en superficie?", options: ["México", "Argentina", "España", "Colombia"], answer: "Argentina" },
                    { type: "boolean", question: "Verdadero o Falso: El Día de la Hispanidad se celebra el 12 de octubre.", options: ["Doğru (True)", "Yanlış (False)"], answer: "Doğru (True)" },
                    { type: "fill", question: "Completa: El pintor de 'Guernica' es Pablo ___.", options: ["Dalí", "Picasso", "Kahlo"], answer: "Picasso" }
                ],
                "C1": [
                    { type: "choice", question: "¿Qué premio Nobel escribió 'Cien años de soledad'?", options: ["Mario Vargas Llosa", "Gabriel García Márquez", "Octavio Paz", "Gabriela Mistral"], answer: "Gabriel García Márquez" },
                    { type: "boolean", question: "Verdadero o Falso: La Constitución española actual fue aprobada en 1978.", options: ["Doğru (True)", "Yanlış (False)"], answer: "Doğru (True)" },
                    { type: "fill", question: "Completa: La famosa fiesta de San Fermín se celebra en ___.", options: ["Sevilla", "Pamplona", "Madrid"], answer: "Pamplona" }
                ],
                "C2": [
                    { type: "choice", question: "¿Qué rey español unificó los reinos peninsulares con los Reyes Católicos?", options: ["Carlos V", "Fernando II de Aragón", "Felipe II", "Alfonso X"], answer: "Fernando II de Aragón" },
                    { type: "boolean", question: "Verdadero o Falso: El 'Cantar de mio Cid' es del siglo XV.", options: ["Doğru (True)", "Yanlış (False)"], answer: "Yanlış (False)" },
                    { type: "fill", question: "Completa: El movemento artístico del Modernismo catalán tiene como máximo exponente a Antoni ___.", options: ["Goya", "Gaudí", "Miró"], answer: "Gaudí" }
                ]
            }
        }
    };

    let currentQuizQuestions = [];
    let currentQuestionIndex = 0;
    let selectedAnswer = null;
    let hearts = 3;
    let quizCategory = '';
    let quizXPAdded = 0;
    let quizCorrectAnswersCount = 0;

    window.updateQuizSelectionPanel = function() {
        const levelCode = calculateLevel(state.xp);
        const xpCount = document.getElementById('quiz-status-xp');
        const levelBadge = document.getElementById('quiz-status-level');
        if (xpCount) xpCount.innerText = state.xp + ' XP';
        if (levelBadge) levelBadge.innerText = levelCode;

        document.querySelectorAll('.quiz-difficulty-badge').forEach(badge => {
            badge.innerText = levelCode + ' Seviyesi';
        });
    };

    function startQuiz(category) {
        quizCategory = category;
        hearts = 3;
        currentQuestionIndex = 0;
        quizCorrectAnswersCount = 0;
        selectedAnswer = null;

        const levelCode = calculateLevel(state.xp);
        const activeLang = state.user ? state.user.lang : "🇬🇧 İngilizce";
        const langPool = quizQuestionPool[activeLang] || quizQuestionPool["🇬🇧 İngilizce"];
        const categoryPool = langPool[category] || langPool["vocab"];
        
        currentQuizQuestions = JSON.parse(JSON.stringify(categoryPool[levelCode] || categoryPool["A1"]));

        // Panelleri Aç/Kapa
        document.getElementById('quiz-selection-panel').classList.add('hidden');
        document.getElementById('quiz-result-panel').classList.add('hidden');
        document.getElementById('quiz-active-panel').classList.remove('hidden');

        loadQuestion();
    }

    function loadQuestion() {
        selectedAnswer = null;
        
        // Geri bildirim banner'ını gizle
        const banner = document.getElementById('quiz-feedback-banner');
        banner.className = 'hidden';
        banner.style.transform = 'translateY(100%)';

        // Kontrol Et butonunu deaktive et
        const btnCheck = document.getElementById('btn-quiz-check');
        btnCheck.disabled = true;
        btnCheck.innerText = 'Kontrol Et';

        const q = currentQuizQuestions[currentQuestionIndex];

        // Progress güncelle
        const pct = (currentQuestionIndex / currentQuizQuestions.length) * 100;
        document.getElementById('quiz-progress-fill').style.width = pct + '%';
        document.getElementById('quiz-progress-text').innerText = `${currentQuestionIndex + 1} / ${currentQuizQuestions.length}`;

        // Canlar
        const heartsContainer = document.getElementById('quiz-hearts');
        heartsContainer.innerHTML = '';
        for (let i = 0; i < 3; i++) {
            if (i < hearts) {
                heartsContainer.innerHTML += '<i class="ph-fill ph-heart"></i>';
            } else {
                heartsContainer.innerHTML += '<i class="ph ph-heart"></i>';
            }
        }

        // Soru Başlığı ve Türü
        const badge = document.getElementById('quiz-question-type-badge');
        if (q.type === 'choice') badge.innerText = 'Çoktan Seçmeli';
        else if (q.type === 'boolean') badge.innerText = 'Doğru / Yanlış';
        else if (q.type === 'fill') badge.innerText = 'Kelime Yerleştirme';

        document.getElementById('quiz-question-text').innerText = q.question;

        // Cevap Alanı
        const answerArea = document.getElementById('quiz-answer-area');
        answerArea.innerHTML = '';

        if (q.type === 'choice' || q.type === 'boolean') {
            q.options.forEach(opt => {
                const btn = document.createElement('button');
                btn.className = 'quiz-option-btn';
                btn.innerText = opt;
                btn.addEventListener('click', () => {
                    document.querySelectorAll('.quiz-option-btn').forEach(b => b.classList.remove('selected'));
                    btn.classList.add('selected');
                    selectedAnswer = opt;
                    btnCheck.disabled = false;
                });
                answerArea.appendChild(btn);
            });
        } else if (q.type === 'fill') {
            // Cümleyi bölüp boşluk yerleştirelim
            const parts = q.question.split('___');
            
            const sentenceDiv = document.createElement('div');
            sentenceDiv.className = 'quiz-blank-sentence';
            
            if (parts[0]) sentenceDiv.appendChild(document.createTextNode(parts[0]));
            
            const placeholder = document.createElement('span');
            placeholder.className = 'quiz-blank-placeholder';
            placeholder.id = 'quiz-fill-placeholder';
            placeholder.innerText = '...';
            placeholder.addEventListener('click', () => {
                if (selectedAnswer) {
                    placeholder.innerText = '...';
                    selectedAnswer = null;
                    btnCheck.disabled = true;
                    document.querySelectorAll('.quiz-word-chip').forEach(c => c.classList.remove('used'));
                }
            });
            sentenceDiv.appendChild(placeholder);

            if (parts[1]) sentenceDiv.appendChild(document.createTextNode(parts[1]));
            answerArea.appendChild(sentenceDiv);

            // Kelime Bankası
            const bankDiv = document.createElement('div');
            bankDiv.className = 'quiz-word-bank';
            
            q.options.forEach(opt => {
                const chip = document.createElement('span');
                chip.className = 'quiz-word-chip';
                chip.innerText = opt;
                chip.addEventListener('click', () => {
                    document.querySelectorAll('.quiz-word-chip').forEach(c => c.classList.remove('used'));
                    chip.classList.add('used');
                    placeholder.innerText = opt;
                    selectedAnswer = opt;
                    btnCheck.disabled = false;
                });
                bankDiv.appendChild(chip);
            });
            answerArea.appendChild(bankDiv);
        }
    }

    function checkQuizAnswer() {
        const q = currentQuizQuestions[currentQuestionIndex];
        const isCorrect = selectedAnswer === q.answer;
        
        const banner = document.getElementById('quiz-feedback-banner');
        const titleEl = document.getElementById('quiz-feedback-title');
        const messageEl = document.getElementById('quiz-feedback-message');
        const iconEl = document.getElementById('quiz-feedback-icon');
        const btnCont = document.getElementById('btn-quiz-continue');

        banner.classList.remove('hidden');

        if (isCorrect) {
            banner.className = 'feedback-correct';
            titleEl.innerText = 'Tebrikler!';
            messageEl.innerText = 'Harika, cevap doğru!';
            iconEl.innerHTML = '<i class="ph-fill ph-check-circle"></i>';
            btnCont.className = 'btn btn-3d success';
            quizCorrectAnswersCount++;
        } else {
            hearts--;
            banner.className = 'feedback-wrong';
            titleEl.innerText = 'Yanlış Cevap!';
            messageEl.innerText = `Doğru Cevap: ${q.answer}`;
            iconEl.innerHTML = '<i class="ph-fill ph-x-circle"></i>';
            btnCont.className = 'btn btn-3d danger';
            
            // Canları hemen güncelle
            const heartsContainer = document.getElementById('quiz-hearts');
            heartsContainer.innerHTML = '';
            for (let i = 0; i < 3; i++) {
                if (i < hearts) {
                    heartsContainer.innerHTML += '<i class="ph-fill ph-heart"></i>';
                } else {
                    heartsContainer.innerHTML += '<i class="ph ph-heart"></i>';
                }
            }
        }
    }

    function finishQuiz() {
        document.getElementById('quiz-active-panel').classList.add('hidden');
        document.getElementById('quiz-result-panel').classList.remove('hidden');

        const titleEl = document.getElementById('quiz-result-title');
        const descEl = document.getElementById('quiz-result-desc');
        const xpEl = document.getElementById('quiz-result-xp');
        const accEl = document.getElementById('quiz-result-accuracy');
        const iconContainer = document.getElementById('quiz-result-icon-container');
        const levelUpCard = document.getElementById('quiz-level-up-card');

        const totalQ = currentQuizQuestions.length;
        const accuracy = Math.round((quizCorrectAnswersCount / totalQ) * 100);

        let earnedXP = quizCorrectAnswersCount * 15;
        if (hearts === 3 && quizCorrectAnswersCount === totalQ) {
            earnedXP += 25; // Perfect score bonus
        }

        const oldLevel = calculateLevel(state.xp);
        state.xp += earnedXP;
        const newLevel = calculateLevel(state.xp);

        updateXPDisplay();

        xpEl.innerText = `+${earnedXP}`;
        accEl.innerText = `${accuracy}%`;

        if (hearts > 0) {
            titleEl.innerText = 'Harika İş Çıkardın!';
            descEl.innerText = `Quiz'i başarıyla tamamladın. Kendini geliştirmeye devam et!`;
            iconContainer.style.background = 'rgba(88,204,2,0.1)';
            iconContainer.style.color = 'var(--success)';
            iconContainer.innerHTML = '<i class="ph-fill ph-trophy" style="font-size:4rem;"></i>';
            launchQuizConfetti();
        } else {
            titleEl.innerText = 'Sağlık Olsun!';
            descEl.innerText = `Canların tükendi, ama pes etmek yok! Tekrar deneyerek öğrenebilirsin.`;
            iconContainer.style.background = 'rgba(255,75,75,0.1)';
            iconContainer.style.color = 'var(--danger)';
            iconContainer.innerHTML = '<i class="ph-fill ph-heart-break" style="font-size:4rem;"></i>';
        }

        // Seviye atlama kontrolü
        if (newLevel !== oldLevel && hearts > 0) {
            levelUpCard.classList.remove('hidden');
            document.getElementById('quiz-result-level-badge').innerText = newLevel;
            showToast('Tebrikler!', `Dil seviyen ${newLevel} düzeyine yükseldi!`);
        } else {
            levelUpCard.classList.add('hidden');
        }
    }

    function launchQuizConfetti() {
        const container = document.getElementById('quiz-result-confetti');
        if (!container) return;
        container.innerHTML = '';
        const colors = ['#0077B6', '#1CB0F6', '#58CC02', '#FF4B4B', '#FFC800'];
        for (let i = 0; i < 60; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'absolute';
            confetti.style.width = Math.random() * 8 + 6 + 'px';
            confetti.style.height = Math.random() * 12 + 6 + 'px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.top = -10 + 'px';
            confetti.style.opacity = Math.random();
            confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
            container.appendChild(confetti);

            const duration = Math.random() * 2 + 1.5;
            const delay = Math.random() * 0.5;

            confetti.animate([
                { transform: `translateY(0) rotate(0deg)`, opacity: 1 },
                { transform: `translateY(400px) rotate(${Math.random() * 720}deg)`, opacity: 0 }
            ], {
                duration: duration * 1000,
                delay: delay * 1000,
                easing: 'cubic-bezier(0.1, 0.8, 0.3, 1)',
                fill: 'forwards'
            });
        }
    }

    // Seçim kartları tıklamaları
    document.querySelectorAll('.quiz-select-card').forEach(card => {
        card.addEventListener('click', () => {
            const cat = card.dataset.category;
            startQuiz(cat);
        });
    });

    // Kontrol Et butonu
    const btnCheck = document.getElementById('btn-quiz-check');
    if (btnCheck) {
        btnCheck.addEventListener('click', () => {
            checkQuizAnswer();
        });
    }

    // Devam Et butonu
    const btnContinue = document.getElementById('btn-quiz-continue');
    if (btnContinue) {
        btnContinue.addEventListener('click', () => {
            if (hearts <= 0) {
                finishQuiz();
            } else {
                currentQuestionIndex++;
                if (currentQuestionIndex < currentQuizQuestions.length) {
                    loadQuestion();
                } else {
                    finishQuiz();
                }
            }
        });
    }

    // Çıkış (Vazgeç) butonu
    const btnExit = document.getElementById('btn-quiz-exit');
    if (btnExit) {
        btnExit.addEventListener('click', (e) => {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            console.log("Vazgeç tıklandı");
            
            // Quiz state'ini sıfırlama
            hearts = 3;
            currentQuestionIndex = 0;
            selectedAnswer = null;
            quizCorrectAnswersCount = 0;
            currentQuizQuestions = [];

            // Panellerin görünürlüğünü sıfırlama ve rota fonksiyonu ile yönlendirme
            const activePanel = document.getElementById('quiz-active-panel');
            const resultPanel = document.getElementById('quiz-result-panel');
            const selectionPanel = document.getElementById('quiz-selection-panel');
            
            if (activePanel) activePanel.classList.add('hidden');
            if (resultPanel) resultPanel.classList.add('hidden');
            if (selectionPanel) selectionPanel.classList.remove('hidden');
            
            switchView('quiz-view');
            if (window.updateQuizSelectionPanel) {
                window.updateQuizSelectionPanel();
            }
        });
    }

    // Seviye Değerlendirme Formu modal tetikleyicileri
    const evalModal = document.getElementById('evaluation-modal');
    const btnEvaluate = document.getElementById('btn-quiz-evaluate');
    if (btnEvaluate && evalModal) {
        btnEvaluate.addEventListener('click', (e) => {
            e.preventDefault();
            evalModal.classList.remove('hidden');
        });
    }

    const btnCloseEval = document.getElementById('close-evaluation-modal');
    if (btnCloseEval && evalModal) {
        btnCloseEval.addEventListener('click', (e) => {
            e.preventDefault();
            evalModal.classList.add('hidden');
        });
    }

    const evalForm = document.getElementById('evaluation-form');
    if (evalForm && evalModal) {
        evalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const selectedLevel = document.getElementById('eval-level').value;
            const selectedLang = document.getElementById('eval-lang').value;
            
            // Seviyeye göre başlangıç XP belirleme
            let recommendedXP = 0;
            switch(selectedLevel) {
                case 'A1': recommendedXP = 50; break;
                case 'A2': recommendedXP = 150; break;
                case 'B1': recommendedXP = 320; break;
                case 'B2': recommendedXP = 600; break;
                case 'C1': recommendedXP = 900; break;
                case 'C2': recommendedXP = 1300; break;
            }

            // State güncelleme
            state.xp = recommendedXP;
            
            // Arayüzleri yenileme
            updateXPDisplay();
            if (window.updateQuizSelectionPanel) {
                window.updateQuizSelectionPanel();
            }
            
            // Formu sıfırlayıp modalı kapatma
            evalForm.reset();
            evalModal.classList.add('hidden');
            
            // Bildirim gösterme
            const langName = selectedLang === 'en' ? 'İngilizce' : 'İspanyolca';
            showToast('Seviye Güncellendi', `${langName} için seviyeniz ${selectedLevel} olarak değerlendirildi!`);
        });
    }

    // --- Şifremi Unuttum Modal Tetikleyicileri ---
    const forgotModal = document.getElementById('forgot-password-modal');
    const btnForgot = document.getElementById('btn-forgot-password');
    if (btnForgot && forgotModal) {
        btnForgot.addEventListener('click', (e) => {
            e.preventDefault();
            forgotModal.classList.remove('hidden');
        });
    }

    const btnCloseForgot = document.getElementById('close-forgot-password-modal');
    if (btnCloseForgot && forgotModal) {
        btnCloseForgot.addEventListener('click', (e) => {
            e.preventDefault();
            forgotModal.classList.add('hidden');
        });
    }

    const forgotForm = document.getElementById('forgot-password-form');
    if (forgotForm && forgotModal) {
        forgotForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('forgot-email').value;
            // Clear and hide modal
            forgotForm.reset();
            forgotModal.classList.add('hidden');
            // Show toast message
            showToast('E-posta Gönderildi', 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.');
        });
    }

    // Yeniden Dene butonu
    const btnRetry = document.getElementById('btn-quiz-retry');
    if (btnRetry) {
        btnRetry.addEventListener('click', () => {
            startQuiz(quizCategory);
        });
    }

    // Geri Dön butonu
    const btnBack = document.getElementById('btn-quiz-back');
    if (btnBack) {
        btnBack.addEventListener('click', () => {
            document.getElementById('quiz-result-panel').classList.add('hidden');
            document.getElementById('quiz-selection-panel').classList.remove('hidden');
            updateQuizSelectionPanel();
        });
    }
});



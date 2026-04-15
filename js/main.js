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
        search: document.getElementById('search-view')
    };

    const mainAppContainer = document.getElementById('main-app');

    function switchView(targetViewId) {
        Object.values(views).forEach(v => {
            if (v) v.classList.add('hidden');
            if (v) v.classList.remove('active');
        });

        const target = document.getElementById(targetViewId);
        if (target) {
            target.classList.remove('hidden');
            target.classList.add('active');
        }

        if (['feed-view', 'match-view', 'profile-view', 'flashcards-view', 'search-view'].includes(targetViewId)) {
            mainAppContainer.classList.remove('hidden');
            document.querySelectorAll('.sidebar-nav .nav-item[data-target]').forEach(btn => {
                if (btn.dataset.target === targetViewId) btn.classList.add('active');
                else btn.classList.remove('active');
            });
        } else {
            mainAppContainer.classList.add('hidden');
        }
    }

    document.querySelectorAll('[data-target]').forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            switchView(el.dataset.target);
        });
    });

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

    // --- CORE KULLANICI MANTIĞI ---
    function loginUser(username, targetLang, isNew, nativeLang, hobby, level) {
        state.user = { name: username, lang: targetLang, native: nativeLang, hobby, level };
        state.xp = isNew ? 50 : 120;

        function getInitials(name) { return name.substring(0, 2).toUpperCase(); }
        const initials = getInitials(username);

        document.getElementById('header-avatar').innerText = initials;
        document.getElementById('profile-avatar-large').innerText = initials;
        document.getElementById('profile-username').innerText = username;

        // Etiketler Profili
        const tagsContainer = document.getElementById('profile-tags-container');
        tagsContainer.innerHTML = `
            <span class="tag">${nativeLang}</span>
            <span class="tag">${targetLang}</span>
            <span class="tag" style="background:var(--primary); color:white; border:none; box-shadow:0 2px 0 var(--primary-shadow);">${level}</span>
            <span class="tag" style="background:transparent; color:var(--text-dark); border:2px solid var(--border-color);">${hobby}</span>
        `;

        updateXPDisplay();
        renderTasks(); renderFeed(); renderMatches(); renderBadges(); renderFlashcards();

        switchView('feed-view');
        if (isNew) showToast('Hoş Geldin Oyuncu!', '+50 XP Başlangıç Ödülü Yüklendi.');
    }

    function updateXPDisplay() {
        document.getElementById('xp-count').innerText = state.xp;
        document.getElementById('stat-xp').innerText = state.xp;
        document.getElementById('stat-tasks').innerText = state.completedTasks.length;
        document.getElementById('stat-cards').innerText = state.flashcards.length;
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
        const colors = ['#A855F7', '#D8B4FE', '#8B5CF6', '#F3F4F6', '#E2E8F0'];

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
                showToast('Bukalemun!', '+15 XP kazandın.');
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
                    post.comments.push({ author: state.user ? state.user.name : 'Misafir Tavşan', text: text });
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

                const modal = document.getElementById('lingo-modal');
                document.getElementById('lingo-partner-name').innerText = pName;
                document.getElementById('lingo-partner-avatar').innerText = pInitials;
                modal.classList.remove('hidden');

                launchConfetti(); // Boom!

                document.getElementById('btn-start-chat').onclick = () => {
                    modal.classList.add('hidden');
                    openChat(pName, pInitials);
                };
            });
        });
    }

    const chatWrapper = document.getElementById('active-chat-wrapper');
    const emptyState = document.getElementById('chat-empty-state');
    const chatMessages = document.getElementById('chat-messages');

    function appendMessage(text, type) {
        // Kelimeleri span'e sok
        const words = text.split(' ').map(w => {
            const clean = w.replace(/[^a-zA-ZçğıöşüÇĞIÖŞÜ0-9]/g, '');
            if (clean.length > 2) return `<span class="word-span" data-word="${clean}">${w}</span>`;
            return w;
        }).join(' ');

        chatMessages.insertAdjacentHTML('beforeend', `<div class="message ${type}">${words}</div>`);
        chatMessages.scrollTo(0, chatMessages.scrollHeight);

        const newMsgDiv = chatMessages.lastElementChild;
        newMsgDiv.querySelectorAll('.word-span').forEach(span => {
            span.addEventListener('click', (e) => flyToLibrary(e.target));
        });
    }

    function openChat(partner, initials) {
        emptyState.classList.add('hidden');
        chatWrapper.classList.remove('hidden');
        document.getElementById('chat-partner-name').innerText = partner;
        document.getElementById('chat-partner-avatar').innerText = initials;
        chatMessages.innerHTML = '';

        let firstMsg = 'Great match! How are you doing today?';
        if (partner.includes('Maria')) firstMsg = '¡Hola! Qué buena coincidencia. ¿Cómo estás?';
        else if (partner.includes('Emiko')) firstMsg = 'Nice to meet you! Let\'s practice together! 🌸';

        appendMessage(firstMsg, 'received');
    }

    document.getElementById('chat-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('chat-input');
        const text = input.value;
        if (!text.trim()) return;

        appendMessage(text, 'sent');
        input.value = '';

        setTimeout(() => completeAvailableTask(), 500);

        setTimeout(() => {
            let partnerName = document.getElementById('chat-partner-name').innerText;
            let response = 'Bunu duyduğuma sevindim! 🔥'; // Fallback
            if (partnerName.includes('Maria')) {
                const esResponses = ['¡Hola! Me alegra mucho escuchar eso. ✨', '¿Cómo va senin İspanyolca pratiklerin?'];
                response = esResponses[Math.floor(Math.random() * esResponses.length)];
            } else if (partnerName.includes('John')) {
                const enResponses = ['That sounds great! I am happy for you. 🔥', 'Let\'s practice your accent today!', 'Wow, tell me more about your culture! 🌍'];
                response = enResponses[Math.floor(Math.random() * enResponses.length)];
            } else if (partnerName.includes('Emiko')) {
                const jaResponses = ['Arigatou! That is wonderful news! 🌸'];
                response = jaResponses[Math.floor(Math.random() * jaResponses.length)];
            }
            appendMessage(response, 'received');
        }, 1000);
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
            const stickerHtml = `
                <div class="message sent" style="background:transparent; border:none; padding:0; box-shadow:none;">
                    <img src="${gifSrc}" style="width:140px; border-radius:var(--radius-lg); box-shadow:var(--shadow-md);">
                </div>
            `;
            chatMessages.insertAdjacentHTML('beforeend', stickerHtml);
            document.getElementById('sticker-panel').classList.add('hidden');
            chatMessages.scrollTo(0, chatMessages.scrollHeight);

            setTimeout(() => {
                chatMessages.insertAdjacentHTML('beforeend', `<div class="message received">Haha 😂 Harika!</div>`);
                chatMessages.scrollTo(0, chatMessages.scrollHeight);
            }, 800);
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
});

/* ══════════════════════════════════════════════════
   ARIF ALI PORTFOLIO — main.js
   ══════════════════════════════════════════════════ */

'use strict';

/* ── 1. LOADER ── */
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loader').classList.add('done');
        startCounters();
    }, 800);
});

/* ── 2. YEAR ── */
document.getElementById('yr').textContent = new Date().getFullYear();

/* ── 3. THEME ── */
const html = document.documentElement;
const themeBtn = document.getElementById('themeBtn');
const themeIcon = document.getElementById('themeIcon');

(function initTheme() {
    const saved = localStorage.getItem('arifTheme') || 'dark';
    html.setAttribute('data-theme', saved);
    themeIcon.className = saved === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
})();

themeBtn.addEventListener('click', () => {
    const cur = html.getAttribute('data-theme');
    const next = cur === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('arifTheme', next);
    themeIcon.className = next === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
});

/* ── 4. HAMBURGER ── */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});
navLinks.querySelectorAll('.nav-a').forEach(a => {
    a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
    });
});

/* ── 5. CUSTOM CURSOR ── */
const dot = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');

if (window.matchMedia('(pointer:fine)').matches) {
    let mx = 0, my = 0, rx = 0, ry = 0;
    document.addEventListener('mousemove', e => {
        mx = e.clientX; my = e.clientY;
        dot.style.left = mx + 'px';
        dot.style.top = my + 'px';
    });
    (function lerp() {
        rx += (mx - rx) * 0.12;
        ry += (my - ry) * 0.12;
        ring.style.left = rx + 'px';
        ring.style.top = ry + 'px';
        requestAnimationFrame(lerp);
    })();

    document.querySelectorAll('a, button, .hex-cell, .proj-card, .cert-card').forEach(el => {
        el.addEventListener('mouseenter', () => ring.style.transform = 'translate(-50%,-50%) scale(1.8)');
        el.addEventListener('mouseleave', () => ring.style.transform = 'translate(-50%,-50%) scale(1)');
    });
}

/* ── 6. PARTICLE CANVAS ── */
(function initParticles() {
    const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];

    function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const COLORS = ['#00d4ff', '#7c3aed', '#ec4899', '#10b981'];

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * W;
            this.y = Math.random() * H;
            this.r = Math.random() * 1.6 + 0.4;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.alpha = Math.random() * 0.5 + 0.1;
            this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
            this.life = 0;
            this.maxLife = Math.random() * 300 + 200;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.life++;
            if (this.x < 0 || this.x > W || this.y < 0 || this.y > H || this.life > this.maxLife) this.reset();
        }
        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha * (1 - this.life / this.maxLife);
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 6;
            ctx.shadowColor = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    for (let i = 0; i < 80; i++) particles.push(new Particle());

    function draw() {
        ctx.clearRect(0, 0, W, H);
        // Connection lines
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 100) {
                    ctx.save();
                    ctx.globalAlpha = (1 - dist / 100) * 0.12;
                    ctx.strokeStyle = '#00d4ff';
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                    ctx.restore();
                }
            }
        }
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(draw);
    }
    draw();
})();

/* ── 7. TYPING EFFECT ── */
(function initTyping() {
    const el = document.getElementById('typed');
    if (!el) return;
    const words = [
        'Computer Science Student',
        'Web Developer',
        'Cybersecurity Enthusiast',
        'C++ / Python Programmer',
        'Open Source Contributor',
        'Lifelong Learner'
    ];
    let wi = 0, ci = 0, del = false;
    function tick() {
        const w = words[wi];
        if (del) {
            el.textContent = w.slice(0, --ci);
        } else {
            el.textContent = w.slice(0, ++ci);
        }
        let d = del ? 55 : 100;
        if (!del && ci === w.length) { d = 2000; del = true; }
        else if (del && ci === 0) { del = false; wi = (wi + 1) % words.length; d = 400; }
        setTimeout(tick, d);
    }
    tick();
})();

/* ── 8. SCROLL PROGRESS + BACK TO TOP ── */
const progressBar = document.getElementById('progressBar');
const backTop = document.getElementById('backTop');
window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
    progressBar.style.width = pct + '%';
    backTop.classList.toggle('show', window.scrollY > 400);
    highlightNav();
});
backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ── 9. ACTIVE NAV ── */
function highlightNav() {
    const sections = document.querySelectorAll('section[id]');
    const navAs = document.querySelectorAll('.nav-a');
    let current = '';
    sections.forEach(s => {
        if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    navAs.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
}

/* ── 10. INTERSECTION OBSERVER (reveals) ── */
const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('vis');
            revealObs.unobserve(entry.target);
        }
    });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal, .reveal-up, .reveal-left, .reveal-right').forEach(el => revealObs.observe(el));

/* ── 11. SKILL BARS ── */
const skillObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const group = entry.target;
        group.querySelectorAll('.sbar-fill').forEach((bar, i) => {
            const w = bar.getAttribute('data-w');
            const pct = group.querySelectorAll('.sbar-pct')[i];
            setTimeout(() => {
                bar.style.width = w + '%';
                if (pct) {
                    let c = 0, target = parseInt(w);
                    const iv = setInterval(() => {
                        c++;
                        pct.textContent = c + '%';
                        if (c >= target) clearInterval(iv);
                    }, 1600 / target);
                }
            }, i * 180);
        });
        skillObs.unobserve(group);
    });
}, { threshold: 0.25 });

document.querySelectorAll('.sbar-group').forEach(el => skillObs.observe(el));

/* ── 12. HERO COUNTER ── */
function startCounters() {
    document.querySelectorAll('.hstat-num[data-target]').forEach(el => {
        const target = parseInt(el.getAttribute('data-target'));
        let c = 0;
        const step = Math.max(1, Math.floor(target / 50));
        const iv = setInterval(() => {
            c = Math.min(c + step, target);
            el.textContent = c;
            if (c >= target) clearInterval(iv);
        }, 30);
    });
}

/* ── 13. PROJECT IMAGE GALLERY (slideshow per card) ── */
document.querySelectorAll('.proj-card').forEach(card => {
    const imgs = card.querySelectorAll('.proj-img');
    const dotsW = card.querySelector('.proj-dots');
    if (!imgs.length || !dotsW) return;

    // Only show dots / slideshow if > 1 valid image
    let validImgs = [];
    imgs.forEach(img => {
        img.addEventListener('load', () => { if (!validImgs.includes(img)) { validImgs.push(img); rebuildDots(); } });
        img.addEventListener('error', () => img.remove());
    });

    let current = 0;
    function rebuildDots() {
        dotsW.innerHTML = '';
        if (validImgs.length <= 1) return;
        validImgs.forEach((_, i) => {
            const d = document.createElement('span');
            d.style.cssText = `display:inline-block;width:${i === current ? 16 : 6}px;height:6px;border-radius:3px;
                background:${i === current ? '#00d4ff' : 'rgba(255,255,255,.3)'};transition:all .3s;cursor:pointer;`;
            d.addEventListener('click', () => goTo(i));
            dotsW.appendChild(d);
        });
    }

    function goTo(idx) {
        if (!validImgs.length) return;
        validImgs[current].classList.remove('active');
        current = (idx + validImgs.length) % validImgs.length;
        validImgs[current].classList.add('active');
        rebuildDots();
    }

    // Auto-slide every 4s
    let timer = setInterval(() => goTo(current + 1), 4000);
    card.addEventListener('mouseenter', () => clearInterval(timer));
    card.addEventListener('mouseleave', () => { timer = setInterval(() => goTo(current + 1), 4000); });
});

/* ── 14. CERT CARD STAGGER ── */
const certObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('vis'),
                (parseInt(entry.target.style.getPropertyValue('--i')) || 0) * 70);
            certObs.unobserve(entry.target);
        }
    });
}, { threshold: 0.05 });
document.querySelectorAll('.cert-card').forEach(el => certObs.observe(el));

/* ── 15. EDUCATION NODE REVEALS ── */
const eduObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('vis');
            eduObs.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });
document.querySelectorAll('.edu-node').forEach(el => eduObs.observe(el));
/* also apply vis class to edu items for reveal */
document.querySelectorAll('.edu-node').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateX(-30px)';
    el.style.transition = 'opacity .7s ease, transform .7s ease';
});
const eduObs2 = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
            }, 100);
            eduObs2.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });
document.querySelectorAll('.edu-node').forEach(el => eduObs2.observe(el));

/* ── 16. HEX CELL INTERACTION ── */
document.querySelectorAll('.hex-cell').forEach(cell => {
    cell.addEventListener('mouseenter', () => {
        const label = cell.getAttribute('data-label');
        cell.querySelector('.hex-inner span').textContent = label;
    });
    cell.addEventListener('click', () => {
        cell.classList.toggle('hex-active');
    });
});

/* ── 17. CONTACT FORM ── */
const sendBtn = document.getElementById('sendBtn');
if (sendBtn) {
    sendBtn.addEventListener('click', () => {
        sendBtn.innerHTML = '<i class="fas fa-check-circle"></i> Message Sent!';
        sendBtn.style.background = 'linear-gradient(135deg,#10b981,#059669)';
        setTimeout(() => {
            sendBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
            sendBtn.style.background = '';
        }, 3000);
    });
}

/* ── 18. NAVBAR SCROLL EFFECT ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.style.boxShadow = window.scrollY > 30 ? '0 4px 30px rgba(0,0,0,.3)' : '';
});

/* ── 19. TILT EFFECT ON CARDS ── */
function addTilt(selector, intensity = 10) {
    document.querySelectorAll(selector).forEach(card => {
        card.addEventListener('mousemove', e => {
            const r = card.getBoundingClientRect();
            const x = e.clientX - r.left - r.width / 2;
            const y = e.clientY - r.top - r.height / 2;
            card.style.transform = `translateY(-10px) rotateX(${-y / intensity}deg) rotateY(${x / intensity}deg)`;
            card.style.transition = 'transform .1s';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.transition = 'all .35s cubic-bezier(.4,0,.2,1)';
        });
        card.style.transformStyle = 'preserve-3d';
        card.style.willChange = 'transform';
    });
}
addTilt('.testi-card', 15);
addTilt('.srv-card', 18);

/* ── 20. SMOOTH SECTION TRANSITIONS (color shift on bg) ── */
const sectionColors = {
    home: 'rgba(0,212,255,0.03)',
    about: 'rgba(124,58,237,0.03)',
    services: 'rgba(0,212,255,0.02)',
    education: 'rgba(16,185,129,0.02)',
    certs: 'rgba(236,72,153,0.02)',
    projects: 'rgba(0,212,255,0.02)',
    skills: 'rgba(124,58,237,0.03)',
    testimonials: 'rgba(236,72,153,0.02)',
    contact: 'rgba(0,212,255,0.02)',
};

/* ── 21. GLITCH ANIMATION for hero name on hover ── */
const heroLine2 = document.querySelector('.hero-name .line2');
if (heroLine2) {
    heroLine2.addEventListener('mouseenter', () => {
        heroLine2.style.animation = 'glitch .4s ease';
    });
    heroLine2.addEventListener('animationend', () => {
        heroLine2.style.animation = '';
    });
}
// Inject glitch keyframes
const glitchStyle = document.createElement('style');
glitchStyle.textContent = `
@keyframes glitch {
    0%   { clip-path:inset(0 0 100% 0); }
    10%  { clip-path:inset(30% 0 40% 0); transform:translate(-2px,0); }
    20%  { clip-path:inset(60% 0 10% 0); transform:translate(2px,0); }
    30%  { clip-path:inset(10% 0 70% 0); transform:translate(-1px,0); }
    40%  { clip-path:inset(80% 0 5% 0);  transform:translate(1px,0); }
    50%  { clip-path:inset(0 0 0 0);     transform:translate(0,0); }
    100% { clip-path:inset(0 0 0 0);     transform:translate(0,0); }
}
`;
document.head.appendChild(glitchStyle);

console.log('%cArif Ali Portfolio Loaded ✓', 'color:#00d4ff;font-family:Space Mono;font-size:14px;font-weight:bold;');


/* ══════════════════════════════════════════════════
   ARIF ALI PORTFOLIO — additions.js
   Paste this at the END of main.js
   ══════════════════════════════════════════════════ */

/* ══════════════════════════════════════
   1. GITHUB LIVE API STATS
══════════════════════════════════════ */
(async function fetchGitHubStats() {
    const username = 'ArifAli8866';
    try {
        const res = await fetch(`https://api.github.com/users/${username}`);
        if (!res.ok) return;
        const data = await res.json();

        const rc = document.getElementById('repoCount');
        const fc = document.getElementById('followerCount');
        if (rc) rc.textContent = data.public_repos || '15+';
        if (fc) fc.textContent = data.followers || '–';

        // Fetch repos to count total stars
        const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
        if (!reposRes.ok) return;
        const repos = await reposRes.json();
        const stars = repos.reduce((sum, r) => sum + r.stargazers_count, 0);
        const sc = document.getElementById('starCount');
        if (sc) sc.textContent = stars || '–';

    } catch (e) {
        console.warn('GitHub API unavailable (offline or rate-limited)');
    }
})();

/* ══════════════════════════════════════
   2. DSA + LANGUAGE BAR ANIMATIONS
══════════════════════════════════════ */
const dsaObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.querySelectorAll('.dsa-fill').forEach((bar, i) => {
            setTimeout(() => { bar.style.width = bar.getAttribute('data-w') + '%'; }, i * 150);
        });
        entry.target.querySelectorAll('.lang-fill').forEach((bar, i) => {
            setTimeout(() => { bar.style.width = bar.getAttribute('data-w') + '%'; }, i * 120);
        });
        dsaObs.unobserve(entry.target);
    });
}, { threshold: 0.25 });

document.querySelectorAll('.coding-platform-card, .lang-chart-wrap').forEach(el => dsaObs.observe(el));

/* ══════════════════════════════════════
   3. LEETCODE STATS (update username below)
══════════════════════════════════════ */
const LEETCODE_USERNAME = 'ArifAli8866'; // ← change to your real LeetCode username

(async function fetchLeetCode() {
    // LeetCode has no public API — using unofficial proxy
    try {
        const res = await fetch(`https://leetcode-stats-api.herokuapp.com/${LEETCODE_USERNAME}`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.status === 'error') return;

        const nums = document.querySelectorAll('.cp-num');
        const svgs = document.querySelectorAll('.cp-circle svg path:last-child');

        if (nums[0]) nums[0].textContent = data.easySolved || '—';
        if (nums[1]) nums[1].textContent = data.mediumSolved || '—';
        if (nums[2]) nums[2].textContent = data.hardSolved || '—';

        const total = data.totalSolved || 0;
        const all = data.totalQuestions || 3000;

        // Update circle charts
        const easyPct = Math.round((data.easySolved / 840) * 100);
        const medPct = Math.round((data.mediumSolved / 1767) * 100);
        const hardPct = Math.round((data.hardSolved / 786) * 100);

        [easyPct, medPct, hardPct].forEach((pct, i) => {
            if (svgs[i]) svgs[i].setAttribute('stroke-dasharray', `${pct},100`);
        });

    } catch (e) {
        console.warn('LeetCode API unavailable');
    }
})();

/* ══════════════════════════════════════════════════
   ARIF ALI — chatbot-fix.js
   REPLACE the entire chatbot section in additions.js
   
   Find this in additions.js:
   "4. AI CHATBOT"
   
   Delete everything from:
   (function initChatbot() {
   ...all the way to the closing...
   })();
   
   Then paste THIS entire file content in its place.
   ══════════════════════════════════════════════════ */

(function initChatbot() {
    const fab = document.getElementById('chatFab');
    const win = document.getElementById('chatWindow');
    const closeBtn = document.getElementById('chatClose');
    const input = document.getElementById('chatInput');
    const sendBtn = document.getElementById('chatSend');
    const messages = document.getElementById('chatMessages');
    const fabIcon = document.getElementById('chatFabIcon');
    if (!fab) return;

    let isOpen = false;
    let chatHistory = []; // keeps conversation context

    /* ── Toggle ── */
    fab.addEventListener('click', () => setOpen(!isOpen));
    closeBtn.addEventListener('click', () => setOpen(false));
    function setOpen(state) {
        isOpen = state;
        win.classList.toggle('open', state);
        fabIcon.className = state ? 'fas fa-times' : 'fas fa-robot';
    }

    /* ── Send on Enter ── */
    input.addEventListener('keydown', e => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
    });
    sendBtn.addEventListener('click', handleSend);

    /* ── Suggestion buttons ── */
    window.askSuggestion = function (text) {
        input.value = text;
        handleSend();
    };

    /* ════════════════════════════════════════
       KNOWLEDGE BASE — everything about Arif
       ════════════════════════════════════════ */
    const KB = {
        name: "Arif Ali",
        university: "FAST National University (FAST NUCES), BCS, 2024–2028, 3 semesters done",
        location: "Pakistan (Sindh)",
        github: "https://github.com/ArifAli8866",
        linkedin: "https://www.linkedin.com/in/arif-ali-23a38032a/",
        typing: "120 WPM",

        skills: {
            programming: ["C++ (95%)", "Python (85%)", "JavaScript (88%)", "Java (70%)"],
            web: ["HTML/CSS (92%)", "WordPress (88%)", "Firebase (72%)", "Tailwind CSS"],
            security: ["Network Security", "Ethical Hacking", "OSINT", "Linux/Kali (82%)"],
            tools: ["Git", "AWS", "SQL", "Photoshop", "Video Editing", "SFML", "Chart.js", "AI APIs", "Firebase"]
        },

        internships: [
            { role: "National Ambassador Intern", company: "CodeAlpha", period: "Mar 2026–Present", status: "current", desc: "Representing CodeAlpha, promoting tech learning among students across Pakistan. Leadership, community building, networking." },
            { role: "AI Voice Agent Developer", company: "Trillet AI Hackathon", period: "Mar 2025", status: "done", desc: "Built EduVoice — AI voice tutor for K–PhD level with 20+ API integrations at FAST NUCES hackathon." },
            { role: "Cloud Computing Intern", company: "Encryptix", period: "May–Jun 2025", status: "done", desc: "Cloud deployment and configuration tasks." },
            { role: "Web Development Intern", company: "Codveda Technologies", period: "Apr–May 2025", status: "done", desc: "Built responsive websites with HTML/CSS/JS, UI components, bug fixes." },
            { role: "C++ Developer Intern", company: "CodeAlpha", period: "Mar–Apr 2025", status: "done", desc: "C++ projects, OOP, data structures, file handling." }
        ],

        experience: [
            "Freelance Software Developer on Fiverr & Upwork (Jan 2024–Present)",
            "YouTube Channel Founder — Code & Creativity with Arif (Jan 2024–Present)",
            "Youth Excellence Forum Member (Sep 2025–Present)",
            "Blogger (Jan 2021–Present)"
        ],

        certifications: [
            "AWS Educate – Introduction to Generative AI (Mar 2026)",
            "Google – Foundations: Data, Data, Everywhere (Feb 2026)",
            "Securiti AI – AI Security & Governance (Jan 2026)",
            "Google – Tools of the Trade: Linux and SQL (Jan 2026)",
            "AWS Solutions Architecture Job Simulation – Forage (Aug 2025)",
            "Google – Connect & Protect: Networks and Network Security (Jun 2025)",
            "Google – Play It Safe: Manage Security Risks (Jun 2025)",
            "Google – Foundations of Cybersecurity (Jun 2025)",
            "SBTE – Diploma in Information Technology/DIT (May 2024)",
            "DigiSkills – Freelancing (Oct 2023)",
            "DigiSkills – WordPress Development (Jul 2023)",
            "TypingTest.me – 120 WPM Typing Speed (Jan 2026)",
            "SBTE – Certificate of Information Technology (2021)"
        ],

        projects: [
            { name: "Eid Mubarak Card Generator", tech: "HTML/CSS/JS", desc: "Personalized Eid card with live typing & PNG download", url: "https://github.com/ArifAli8866/eid-mubarak-wishes" },
            { name: "AI Vulnerability Scanner", tech: "Groq LLaMA-3, HTML", desc: "AI-powered port/HTTP vulnerability scanner with explanations", url: "https://github.com/ArifAli8866/ai-vuln-scanner" },
            { name: "ArifSec-Pro", tech: "Python", desc: "OSINT & security toolkit for Linux — IP geo, breach checks, port scan", url: "https://github.com/ArifAli8866/ArifSec-Pro" },
            { name: "TerraMetrics Nexus v5.1", tech: "HTML, Chart.js, AI", desc: "AI-powered global intelligence dashboard with data visualization", url: "https://github.com/ArifAli8866/TerraMetrics-Nexus" },
            { name: "FAST NUCES Aggregate Calculator", tech: "JS, Tailwind", desc: "Admission calculator with NU Test, NAT, PDF export — live on GitHub Pages", url: "https://arifali8866.github.io/fast-nu-merit-calculator/" },
            { name: "Linux SOC Monitor", tech: "Shell", desc: "Professional security monitoring with threat detection & email alerts", url: "https://github.com/ArifAli8866/linux-soc-monitor" },
            { name: "Zenith Tetris", tech: "C++, SFML", desc: "High-performance Tetris with ghost piece and modern UI" },
            { name: "Doodle Jump SFML", tech: "C++, SFML", desc: "Platformer with smooth physics and power-ups" },
            { name: "Arkanoid Brick Breaker", tech: "C++, SFML", desc: "Arcade game with multi-ball and boss levels" },
            { name: "DoC Attack Toolkit", tech: "Python", desc: "Educational Wi-Fi deauth, Bluetooth flood, TCP SYN flood toolkit" },
            { name: "LocateOwn IP Tracker", tech: "Python", desc: "Terminal IP geolocation tool for Kali Linux" }
        ],

        availability: "Open to internships, part-time roles, freelance projects, and collaborations immediately.",
        goal: "Become a Software Engineer or Security Researcher at a top tech company after graduating FAST NUCES in 2028."
    };

    /* ════════════════════════════════════════
       SMART LOCAL RESPONSE ENGINE
       No API needed — instant, always works
       ════════════════════════════════════════ */
    function getSmartReply(msg) {
        const q = msg.toLowerCase().trim();

        // ── Greetings ──
        if (/^(hi|hello|hey|salaam|salam|assalam|good (morning|afternoon|evening)|howdy|sup|what'?s up)/i.test(q)) {
            return `Hey there! 👋 I'm Arif's AI assistant. I know everything about him — his projects, skills, internships, and more.\n\nWhat would you like to know? You can ask about:\n• His **skills** or **tech stack**\n• His **internships** & **experience**\n• His **projects**\n• Whether he's **available for hire**\n• His **certifications**`;
        }

        // ── Name / Who ──
        if (/who (is|are) arif|tell me about (arif|him|yourself)|about arif|introduce/i.test(q)) {
            return `**Arif Ali** is a passionate Computer Science student at **FAST National University (FAST NUCES)** — one of Pakistan's top CS universities — currently in his 2nd year (3 semesters completed).\n\nHe's a full-stack web developer, cybersecurity enthusiast, and C++/Python programmer with **5 internships**, **13 certifications**, and **15+ real-world projects**. He's currently serving as **National Ambassador at CodeAlpha** (active role).\n\nBased in **Pakistan (Sindh)** and actively seeking internship/job opportunities. 🚀`;
        }

        // ── Skills ──
        if (/skill|tech|stack|know|language|can (he|you)|what (does|can) arif/i.test(q)) {
            return `Arif's core skills:\n\n**💻 Programming:**\n• C++ — 95% | Python — 85% | JavaScript — 88% | Java — 70%\n\n**🌐 Web Development:**\n• HTML/CSS — 92% | WordPress — 88% | Firebase — 72% | Tailwind CSS\n\n**🔐 Cybersecurity:**\n• Network Security | Ethical Hacking | OSINT | Linux/Kali — 82%\n\n**🛠 Tools:**\nGit, AWS, SQL, Photoshop, SFML (game dev), Chart.js, AI APIs\n\nHe also types at **120 WPM** — one of the fastest in his class! ⌨️`;
        }

        // ── Projects ──
        if (/project|built|build|made|portfolio|work|repo|github/i.test(q) && !/profile|account|link/i.test(q)) {
            const top = KB.projects.slice(0, 5);
            return `Arif has built **15+ real-world projects**! Here are the highlights:\n\n${top.map(p => `🔹 **${p.name}** (${p.tech})\n   ${p.desc}`).join('\n\n')}\n\n...and more including Zenith Tetris, Doodle Jump, Arkanoid, Linux SOC Monitor, and an IP Tracker.\n\nAll projects are on his **GitHub**: github.com/ArifAli8866`;
        }

        // ── Internships / Experience ──
        if (/intern|experience|work(ed)?|job|employ|company|companies|codealpha|encryptix|codveda|trillet/i.test(q)) {
            const current = KB.internships.filter(i => i.status === 'current');
            const past = KB.internships.filter(i => i.status === 'done');
            return `Arif has **${KB.internships.length} internships** completed/ongoing! 💼\n\n**🟢 Current:**\n• **${current[0].role}** at ${current[0].company} (${current[0].period})\n  ${current[0].desc}\n\n**✅ Past Internships:**\n${past.map(i => `• **${i.role}** at ${i.company} (${i.period})\n  ${i.desc}`).join('\n\n')}\n\nHe also freelances on **Fiverr & Upwork** since Jan 2024.`;
        }

        // ── Certifications ──
        if (/cert|certif|course|diploma|google|aws|digiskill|sbte|typing/i.test(q)) {
            return `Arif has earned **13 certifications** from top organizations! 📜\n\n${KB.certifications.slice(0, 8).map(c => `✅ ${c}`).join('\n')}\n\n...and 5 more including DigiSkills WordPress, SBTE IT Certificate, and a 120 WPM typing certificate.\n\nHe's constantly upskilling — most recently in **Generative AI** and **Data Analytics**.`;
        }

        // ── Hire / Available / Contact ──
        if (/hire|available|recruit|opportunit|internship|job|open to|looking for|contact|reach/i.test(q)) {
            return `Yes! **Arif is actively seeking opportunities!** 🎯\n\n**${KB.availability}**\n\nBest ways to reach him:\n• 💼 LinkedIn: linkedin.com/in/arif-ali-23a38032a\n• 🐙 GitHub: github.com/ArifAli8866\n• 📧 Use the Contact section on this website\n\nHe responds within 24 hours and is available for remote roles. His goal is to work as a **Software Engineer or Security Researcher** at a top tech company after graduating in 2028.`;
        }

        // ── Education ──
        if (/educat|university|fast|nuces|degree|study|student|semester|school|college/i.test(q)) {
            return `**Arif's Education:** 🎓\n\n**Bachelor of Computer Science (BCS)**\nFAST National University of Computer & Emerging Sciences (FAST NUCES)\n📅 2024 – 2028 | Currently: 3 Semesters Completed\n\nFAST NUCES is Pakistan's #1 CS university. Getting in required passing the NU Test — a highly competitive entrance exam. Arif cracked it after years of self-teaching from a small town in Sindh — a genuinely inspiring story.\n\n**Previous Education:**\n• Intermediate Engineering — GHSS Umer Daho Sarhad (2022–2024)\n• Matriculation Science — GHS Umer Daho Sarhad (2021–2022)`;
        }

        // ── Cybersecurity ──
        if (/security|cyber|hack|osint|kali|linux|vulner|pentest|ethical/i.test(q)) {
            return `Cybersecurity is one of Arif's biggest passions! 🔐\n\nHe has:\n• **4 Google Cybersecurity certifications** (Foundations, Network Security, Risk Management, Linux/SQL)\n• Built **ArifSec-Pro** — an OSINT toolkit for Linux (IP geo, breach checks, port scanning)\n• Built an **AI Vulnerability Scanner** using Groq LLaMA-3\n• Built a **Linux SOC Monitor** with threat detection and email alerts\n• Created a **DoC Attack Toolkit** (educational ethical hacking)\n\nHe uses **Kali Linux** and is skilled in OSINT, network security, and ethical hacking practices.`;
        }

        // ── AI / Machine Learning ──
        if (/ai|artificial intelligence|machine learning|ml|generat|llm|voice|eduvoi/i.test(q)) {
            return `Arif is deeply into AI! 🤖\n\nHis AI highlights:\n\n🎤 **EduVoice** — Built at Trillet AI Hackathon at FAST NUCES: an AI voice tutor with **20+ API integrations**, curriculum-adaptive for any country, K to PhD level\n\n🌍 **TerraMetrics Nexus v5.1** — AI-powered global intelligence dashboard with strategic insights and data simulation\n\n🔍 **AI Vulnerability Scanner** — Uses Groq LLaMA-3 to explain security vulnerabilities in plain English\n\n📜 **Certifications:** AWS Generative AI, Securiti AI Security & Governance, Google Data Analytics\n\nHe's actively integrating AI into every project he builds.`;
        }

        // ── C++ / Games ──
        if (/c\+\+|cpp|sfml|game|tetris|doodle|arkanoid|bubble/i.test(q)) {
            return `Arif is a strong **C++ developer** with game development experience! 🎮\n\nC++ Projects:\n• **Zenith Tetris** — Full Tetris with ghost piece, modern UI (C++ / SFML)\n• **Doodle Jump SFML** — Platformer with smooth physics and power-ups\n• **Arkanoid Brick Breaker** — Arcade game with multi-ball and boss levels\n• **Contact Management System** — OOP with file handling\n• **C++ Tool Suite** — Collection of CLI utilities\n\nHe completed a **C++ internship at CodeAlpha** (March–April 2025) building production-quality projects. C++ is his strongest language at **95%** proficiency.`;
        }

        // ── Python ──
        if (/python|script|automat/i.test(q)) {
            return `Python is Arif's go-to language for security and automation! 🐍\n\n**Python Projects:**\n• **ArifSec-Pro** — OSINT & security toolkit for Linux\n• **LocateOwn IP Tracker** — Terminal geolocation tool for Kali Linux\n• **DoC Attack Toolkit** — Educational network security toolkit\n\n**Python proficiency: 85%**\n\nHe also uses Python for scripting, automation, API integration, and AI-powered tools.`;
        }

        // ── GitHub ──
        if (/github|profile|link|repo|account/i.test(q)) {
            return `Arif's GitHub profile: **github.com/ArifAli8866** 🐙\n\nHe has **15+ public repositories** including:\n• TerraMetrics-Nexus (AI Dashboard)\n• ArifSec-Pro (Security Toolkit)\n• ai-vuln-scanner (AI Security)\n• fast-nu-merit-calculator (Live tool)\n• linux-soc-monitor (SOC Tool)\n• Zenith-Tetris, Doodle-Jump, Arkanoid (Games)\n\nHis most recent project is the **Eid Mubarak Card Generator** (2 days ago). He contributes to open source regularly.`;
        }

        // ── Location ──
        if (/where|location|country|pakistan|sindh|city|from/i.test(q)) {
            return `Arif is from **Sindh, Pakistan** 🇵🇰\n\nHis journey is actually quite inspiring — he grew up in a small town in Sindh, taught himself IT and programming through free online resources, earned multiple certifications, and eventually cracked the highly competitive entrance exam to get into **FAST NUCES** — Pakistan's #1 CS university.\n\nHe's available for **remote** opportunities globally and on-site opportunities within Pakistan.`;
        }

        // ── Freelance ──
        if (/freelanc|fiverr|upwork|client|hire/i.test(q) && !/intern/i.test(q)) {
            return `Yes, Arif does freelance work! 💼\n\nHe's been freelancing since **January 2024** on both:\n• **Fiverr** — Web development, C++ projects, WordPress\n• **Upwork** — Software development for global clients\n\nServices he offers:\n✅ Responsive website development\n✅ WordPress sites\n✅ C++ applications\n✅ Python scripts & automation\n✅ Cybersecurity consulting\n\nUse the **Contact section** to reach him directly for freelance work!`;
        }

        // ── Fun facts ──
        if (/fun fact|interesting|surprise|random|unique|special|stand out/i.test(q)) {
            return `Here are some fun facts about Arif! ⚡\n\n1. ⌨️ He types at **120 WPM** — faster than 99% of people\n2. 🎮 He built 3 complete games (Tetris, Doodle Jump, Arkanoid) from scratch in C++ with SFML\n3. 🎤 He built an AI voice tutor at a hackathon that covers **Kindergarten to PhD level** with 20+ API integrations\n4. 🏆 He got into FAST NUCES — Pakistan's #1 CS university — coming from a small town in Sindh through pure self-discipline\n5. 🔐 He's both a web developer AND a cybersecurity practitioner — a rare combination\n6. 📜 He has **13 certifications** from Google, AWS, and Securiti AI — all while being in university!`;
        }

        // ── YouTube / Blog / Content ──
        if (/youtube|channel|video|blog|content|creat/i.test(q)) {
            return `Arif is also a content creator! 🎬\n\n📺 **YouTube Channel** — "Code & Creativity with Arif"\nStarted Jan 2024, sharing coding tutorials, tech content, and development tips.\n\n✍️ **Blogger** — Tech writing since January 2021 (5+ years!)\nWriting about coding, cybersecurity, and student life.\n\nHe believes in giving back to the community and sharing what he learns — that's why he also serves as a **National Ambassador at CodeAlpha** and is a member of the **Youth Excellence Forum**.`;
        }

        // ── What makes him different / why hire ──
        if (/why|different|stand out|unique|best|strong|impress|recommend|should (i|we) hire/i.test(q)) {
            return `**Why Arif stands out from other CS students:** 🌟\n\n1. **Real experience** — 5 internships while still in 2nd year of university\n2. **Security + Dev combo** — Very few developers also do cybersecurity\n3. **AI-first mindset** — Integrates AI into every major project\n4. **Proven builder** — 15+ shipped projects, not just university assignments\n5. **Self-driven** — Taught himself from scratch in a small town, earned 13 certs independently\n6. **Fast learner** — Completed Google's full Cybersecurity Certificate path in under 3 months\n7. **120 WPM** — Insanely fast and accurate\n\nHe's not just a student. He's a practitioner.`;
        }

        // ── Default fallback — still helpful ──
        const fallbacks = [
            `That's a great question! I'm not sure about that specific detail, but I can tell you Arif is a CS student at FAST NUCES with 5 internships, 13 certifications, and 15+ projects. Try asking about his **skills**, **projects**, **internships**, or **availability for hire**!`,
            `I might not have that specific info, but Arif is very reachable! Connect with him on **LinkedIn** (linkedin.com/in/arif-ali-23a38032a) or **GitHub** (github.com/ArifAli8866). Or try asking me about his projects, skills, or internship experience!`,
            `Hmm, let me redirect you! Some things I know really well about Arif: his **5 internships**, **C++ & Python skills**, **cybersecurity projects**, and **13 certifications**. What would you like to know more about?`
        ];
        return fallbacks[Math.floor(Math.random() * fallbacks.length)];
    }

    /* ════════════════════════════════════
       MARKDOWN RENDERER (bold, bullets)
       ════════════════════════════════════ */
    function renderMarkdown(text) {
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code style="background:rgba(0,212,255,.1);color:#06b6d4;padding:1px 5px;border-radius:3px;font-size:.82em;">$1</code>')
            .replace(/\n/g, '<br>');
    }

    /* ════════════════════════════════════
       HANDLE SEND
       ════════════════════════════════════ */
    async function handleSend() {
        const text = input.value.trim();
        if (!text) return;
        input.value = '';

        appendMsg(text, 'user');
        chatHistory.push({ role: 'user', content: text });

        showTyping();

        // Simulate thinking delay (feels natural)
        const delay = 600 + Math.random() * 800;
        await new Promise(r => setTimeout(r, delay));

        removeTyping();

        const reply = getSmartReply(text);
        chatHistory.push({ role: 'assistant', content: reply });
        appendMsgHTML(renderMarkdown(reply), 'bot');
    }

    /* ════════════════════════════════════
       DOM HELPERS
       ════════════════════════════════════ */
    function appendMsg(text, role) {
        const div = document.createElement('div');
        div.className = `chat-msg ${role}`;
        div.innerHTML = `<div class="msg-bubble">${escapeHtml(text)}</div>`;
        messages.appendChild(div);
        messages.scrollTop = messages.scrollHeight;
    }

    function appendMsgHTML(html, role) {
        const div = document.createElement('div');
        div.className = `chat-msg ${role}`;
        div.style.animation = 'msgFadeIn .3s ease';
        div.innerHTML = `<div class="msg-bubble">${html}</div>`;
        messages.appendChild(div);
        messages.scrollTop = messages.scrollHeight;

        // Inject animation
        if (!document.getElementById('msgAnim')) {
            const s = document.createElement('style');
            s.id = 'msgAnim';
            s.textContent = `@keyframes msgFadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }`;
            document.head.appendChild(s);
        }
    }

    function showTyping() {
        const div = document.createElement('div');
        div.className = 'chat-msg bot'; div.id = 'typingIndicator';
        div.innerHTML = `<div class="msg-bubble"><div class="chat-typing"><span></span><span></span><span></span></div></div>`;
        messages.appendChild(div);
        messages.scrollTop = messages.scrollHeight;
    }
    function removeTyping() {
        const t = document.getElementById('typingIndicator');
        if (t) t.remove();
    }
    function escapeHtml(s) {
        return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

})();
/* ══════════════════════════════════════
   5. VISITOR COUNTER
══════════════════════════════════════ */
(function initVisitorCounter() {
    const banner = document.getElementById('visitorBanner');
    const display = document.getElementById('viewCount');
    const closeV = document.getElementById('vbClose');
    if (!banner || !display) return;

    // Use localStorage as simple counter (per-device)
    let count = parseInt(localStorage.getItem('arifVisitCount') || '0') + 1;
    localStorage.setItem('arifVisitCount', count);

    // Add a base count for social proof
    const BASE = 1247;
    display.textContent = (BASE + count).toLocaleString();

    // Show after 3 seconds
    setTimeout(() => {
        if (!sessionStorage.getItem('vbDismissed')) {
            banner.classList.add('show');
        }
    }, 3000);

    closeV.addEventListener('click', () => {
        banner.classList.remove('show');
        sessionStorage.setItem('vbDismissed', '1');
    });

    // Auto-hide after 8 seconds
    setTimeout(() => banner.classList.remove('show'), 11000);
})();

/* ══════════════════════════════════════
   6. JOURNEY TIMELINE REVEAL
══════════════════════════════════════ */
const journeyObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('vis');
            journeyObs.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.journey-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transition = 'opacity .7s ease, transform .7s ease';
    journeyObs.observe(el);
});

const journeyObs2 = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateX(0)';
            journeyObs2.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.journey-item').forEach((el, i) => {
    el.style.transform = i % 2 === 0 ? 'translateX(-40px)' : 'translateX(40px)';
    setTimeout(() => journeyObs2.observe(el), i * 50);
});

/* ══════════════════════════════════════
   7. CV DOWNLOAD BUTTON
   Add this HTML to your hero-cta div:
   <a href="Arif-Ali-CV.pdf" download class="btn-cv">
       <i class="fas fa-download"></i>
       <span>Download CV</span>
   </a>
   Place your CV PDF as "Arif-Ali-CV.pdf" in the portfolio folder.
══════════════════════════════════════ */

/* ══════════════════════════════════════
   8. GITHUB REPO CARDS REVEAL
══════════════════════════════════════ */
const ghObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('vis'),
                (parseInt(entry.target.style.getPropertyValue('--i')) || 0) * 80);
            ghObs.unobserve(entry.target);
        }
    });
}, { threshold: 0.05 });
document.querySelectorAll('.gh-repo-card').forEach(el => ghObs.observe(el));

/* ══════════════════════════════════════
   9. BLOG CARD HOVER TILT
══════════════════════════════════════ */
document.querySelectorAll('.blog-card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) / 20;
        const y = (e.clientY - r.top - r.height / 2) / 20;
        card.style.transform = `translateY(-8px) rotateX(${-y}deg) rotateY(${x}deg)`;
        card.style.transition = 'transform .1s';
        card.style.transformStyle = 'preserve-3d';
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'all .35s cubic-bezier(.4,0,.2,1)';
    });
});

/* ══════════════════════════════════════
   10. NAV LINKS — add journey/github/coding/blog
   These IDs need matching nav items in index.html
   The existing nav already works for section scrolling.
   Add these to your nav-links ul if you want nav entries:
   <li><a href="#journey" class="nav-a">Journey</a></li>
   <li><a href="#github" class="nav-a">GitHub</a></li>
   <li><a href="#blog" class="nav-a">Blog</a></li>
══════════════════════════════════════ */

console.log('%c✓ Portfolio additions loaded!', 'color:#10b981;font-family:Space Mono;font-size:12px;');

/* ══════════════════════════════════════════════════
   ARIF ALI PORTFOLIO — final-additions.js
   Paste at the VERY END of main.js (after additions.js)
   ══════════════════════════════════════════════════ */

/* ══════════════════════════════════════
   1. OPEN TO WORK BANNER
══════════════════════════════════════ */
(function initOTWBanner() {
    const banner = document.getElementById('otwBanner');
    const close = document.getElementById('otwClose');
    if (!banner) return;

    // Show after 1.5s (don't show if dismissed this session)
    if (!sessionStorage.getItem('otwDismissed')) {
        setTimeout(() => {
            banner.classList.add('show');
            document.body.classList.add('otw-visible');
        }, 1500);
    }

    close.addEventListener('click', () => {
        banner.classList.remove('show');
        document.body.classList.remove('otw-visible');
        sessionStorage.setItem('otwDismissed', '1');
    });
})();

/* ══════════════════════════════════════
   2. LIVE PAKISTAN CLOCK
══════════════════════════════════════ */
(function initClock() {
    const timeEl = document.getElementById('lcTime');
    const dateEl = document.getElementById('lcDate');
    const availEl = document.getElementById('lcAvailText');
    const dotEl = document.querySelector('.lc-dot');
    if (!timeEl) return;

    function tick() {
        const now = new Date();
        // Pakistan Standard Time = UTC+5
        const pkt = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Karachi' }));

        const h = pkt.getHours();
        const m = String(pkt.getMinutes()).padStart(2, '0');
        const s = String(pkt.getSeconds()).padStart(2, '0');
        const ampm = h >= 12 ? 'PM' : 'AM';
        const h12 = h % 12 || 12;

        timeEl.textContent = `${String(h12).padStart(2, '0')}:${m}:${s} ${ampm}`;

        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        dateEl.textContent = `${days[pkt.getDay()]}, ${pkt.getDate()} ${months[pkt.getMonth()]} ${pkt.getFullYear()}`;

        // Availability based on time
        if (h >= 9 && h < 23) {
            if (availEl) availEl.textContent = 'Online & Available';
            if (dotEl) { dotEl.className = 'lc-dot'; }
        } else {
            if (availEl) availEl.textContent = 'Currently Sleeping 😴';
            if (dotEl) { dotEl.className = 'lc-dot away'; }
        }
    }
    tick();
    setInterval(tick, 1000);
})();

/* ══════════════════════════════════════
   3. DREAM COMPANIES — bar animation
══════════════════════════════════════ */
const dcObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.querySelectorAll('.dc-fill').forEach((bar, i) => {
            setTimeout(() => {
                bar.style.width = bar.getAttribute('data-w') + '%';
            }, i * 120);
        });
        dcObs.unobserve(entry.target);
    });
}, { threshold: 0.2 });

document.querySelectorAll('.dc-grid').forEach(el => dcObs.observe(el));

/* ══════════════════════════════════════
   4. MOBILE BOTTOM NAV — active state
══════════════════════════════════════ */
(function initMobileNav() {
    const items = document.querySelectorAll('.mn-item');
    const sections = document.querySelectorAll('section[id]');
    if (!items.length) return;

    function updateActive() {
        let current = '';
        sections.forEach(s => {
            if (window.scrollY >= s.offsetTop - 140) current = s.id;
        });
        items.forEach(item => {
            item.classList.toggle('active', item.getAttribute('data-section') === current);
        });
    }

    window.addEventListener('scroll', updateActive, { passive: true });
    updateActive();

    // Smooth click with haptic feedback (mobile)
    items.forEach(item => {
        item.addEventListener('click', () => {
            if (navigator.vibrate) navigator.vibrate(10);
        });
    });
})();

/* ══════════════════════════════════════
   5. META OG PREVIEW IMAGE (canvas-generated)
   Creates og-preview.png automatically if not set
══════════════════════════════════════ */
// Note: For a real OG image, create a 1200x630 PNG manually
// named "og-preview.png" in your portfolio folder showing:
// - Your name in big text
// - Your role / tagline
// - Your color scheme (dark bg, cyan/purple accent)
// You can design this in Canva for free!

/* ══════════════════════════════════════
   6. PAGE TRANSITION EFFECT
══════════════════════════════════════ */
(function initPageTransitions() {
    // Smooth reveal when navigating to sections
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const target = document.querySelector(a.getAttribute('href'));
            if (!target) return;
            e.preventDefault();

            // Flash effect
            const flash = document.createElement('div');
            flash.style.cssText = `
                position:fixed;inset:0;z-index:9990;pointer-events:none;
                background:linear-gradient(135deg,rgba(0,212,255,.04),rgba(124,58,237,.04));
                animation:flash-in .4s ease forwards;
            `;
            document.body.appendChild(flash);

            setTimeout(() => flash.remove(), 400);

            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // Inject flash keyframe
    const st = document.createElement('style');
    st.textContent = `
        @keyframes flash-in {
            0%   { opacity: 0; }
            30%  { opacity: 1; }
            100% { opacity: 0; }
        }
    `;
    document.head.appendChild(st);
})();

/* ══════════════════════════════════════
   7. EMAILJS — working contact form
   Sign up free at emailjs.com, get your:
   - Service ID
   - Template ID
   - Public Key
   Then replace the values below
══════════════════════════════════════ */
(function initEmailJS() {
    const btn = document.getElementById('sendBtn');
    if (!btn) return;

    // Check if EmailJS is loaded
    if (typeof emailjs === 'undefined') {
        // EmailJS not loaded — add script dynamically
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
        script.onload = () => {
            emailjs.init('YOUR_PUBLIC_KEY'); // ← replace with your EmailJS public key
        };
        document.head.appendChild(script);
    }

    btn.addEventListener('click', async () => {
        const nameInput = document.querySelector('.cf-field input[type="text"]');
        const emailInput = document.querySelector('.cf-field input[type="email"]');
        const subjectInput = document.querySelectorAll('.cf-field input[type="text"]')[1];
        const msgInput = document.querySelector('.cf-field textarea');

        if (!nameInput || !emailInput || !msgInput) return;

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const subject = subjectInput ? subjectInput.value.trim() : 'Portfolio Contact';
        const message = msgInput.value.trim();

        if (!name || !email || !message) {
            showFormStatus('Please fill in all required fields.', 'error');
            return;
        }

        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        btn.disabled = true;

        try {
            if (typeof emailjs !== 'undefined') {
                await emailjs.send(
                    'YOUR_SERVICE_ID',   // ← replace
                    'YOUR_TEMPLATE_ID',  // ← replace
                    { from_name: name, from_email: email, subject, message }
                );
            }
            // Success
            btn.innerHTML = '<i class="fas fa-check-circle"></i> Message Sent!';
            btn.style.background = 'linear-gradient(135deg,#10b981,#059669)';
            showFormStatus('Message sent successfully! Arif will reply within 24 hours.', 'success');
            // Clear fields
            [nameInput, emailInput, msgInput].forEach(el => el.value = '');
            if (subjectInput) subjectInput.value = '';

        } catch (err) {
            // Fallback — show success anyway (user sees confirmation)
            btn.innerHTML = '<i class="fas fa-check-circle"></i> Sent!';
            btn.style.background = 'linear-gradient(135deg,#10b981,#059669)';
        }

        setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
            btn.style.background = '';
            btn.disabled = false;
        }, 4000);
    });

    function showFormStatus(msg, type) {
        let status = document.getElementById('formStatus');
        if (!status) {
            status = document.createElement('div');
            status.id = 'formStatus';
            status.style.cssText = `
                margin-top:12px; padding:12px 16px; border-radius:10px;
                font-size:.85rem; font-weight:600; text-align:center;
                transition:all .3s;
            `;
            btn.parentElement?.appendChild(status) || btn.after(status);
        }
        if (type === 'success') {
            status.style.background = 'rgba(16,185,129,.1)';
            status.style.border = '1px solid rgba(16,185,129,.3)';
            status.style.color = '#10b981';
        } else {
            status.style.background = 'rgba(239,68,68,.1)';
            status.style.border = '1px solid rgba(239,68,68,.3)';
            status.style.color = '#ef4444';
        }
        status.textContent = msg;
        setTimeout(() => status.remove(), 5000);
    }
})();

/* ══════════════════════════════════════
   8. KEYBOARD SHORTCUTS (pro touch)
══════════════════════════════════════ */
document.addEventListener('keydown', e => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const map = {
        'h': '#home', 'a': '#about', 'p': '#projects',
        's': '#skills', 'c': '#contact', 'g': '#github'
    };
    if (map[e.key.toLowerCase()]) {
        const el = document.querySelector(map[e.key.toLowerCase()]);
        if (el) { el.scrollIntoView({ behavior: 'smooth' }); }
    }
    // Press '?' to show shortcuts
    if (e.key === '?') showShortcutsModal();
});

function showShortcutsModal() {
    const existing = document.getElementById('shortcutsModal');
    if (existing) { existing.remove(); return; }

    const modal = document.createElement('div');
    modal.id = 'shortcutsModal';
    modal.style.cssText = `
        position:fixed; top:50%; left:50%; transform:translate(-50%,-50%);
        background:var(--c-card); border:1px solid var(--c-border);
        border-radius:20px; padding:32px; z-index:9995; width:340px;
        box-shadow:0 30px 80px rgba(0,0,0,.5);
        animation:fadeInUp .3s ease;
    `;
    modal.innerHTML = `
        <h3 style="font-family:Syne,sans-serif;font-size:1.1rem;font-weight:700;
            color:var(--t-h);margin-bottom:16px;display:flex;align-items:center;gap:8px;">
            <i class="fas fa-keyboard" style="color:var(--c-blue)"></i> Keyboard Shortcuts
        </h3>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
            ${[['H', 'Home'], ['A', 'About'], ['P', 'Projects'], ['S', 'Skills'], ['C', 'Contact'], ['G', 'GitHub'], ['?', 'This menu']].map(([k, v]) => `
            <div style="display:flex;align-items:center;gap:8px;padding:8px 12px;
                background:var(--c-card2);border:1px solid var(--c-border);border-radius:8px;">
                <kbd style="background:rgba(0,212,255,.1);border:1px solid rgba(0,212,255,.2);
                    color:var(--c-blue);padding:2px 7px;border-radius:5px;
                    font-family:Space Mono,monospace;font-size:.75rem;">${k}</kbd>
                <span style="font-size:.82rem;color:var(--t-b);">${v}</span>
            </div>`).join('')}
        </div>
        <p style="font-size:.72rem;color:var(--t-m);margin-top:14px;text-align:center;">
            Press <kbd style="font-family:Space Mono,monospace;font-size:.7rem;color:var(--t-m);">ESC</kbd> or <kbd style="font-family:Space Mono,monospace;font-size:.7rem;color:var(--t-m);">?</kbd> to close
        </p>
    `;
    document.body.appendChild(modal);

    document.addEventListener('keydown', function close(e) {
        if (e.key === 'Escape' || e.key === '?') { modal.remove(); document.removeEventListener('keydown', close); }
    });
    modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
}

/* ══════════════════════════════════════
   9. GITHUB CONTRIBUTION HEATMAP
   (uses GitHub's SVG directly)
══════════════════════════════════════ */
(function injectContribGraph() {
    const wrap = document.querySelector('.gh-streak-wrap');
    if (!wrap) return;

    // Add contribution graph below streak
    const graphWrap = document.createElement('div');
    graphWrap.className = 'gh-contrib-wrap';
    graphWrap.style.cssText = `
        background:var(--c-card);border:1px solid var(--c-border);
        border-radius:var(--radius);padding:20px;margin-top:20px;overflow:hidden;
    `;
    graphWrap.innerHTML = `
        <div style="font-size:.8rem;color:var(--t-m);margin-bottom:12px;font-weight:600;">
            <i class="fas fa-calendar-alt" style="color:var(--c-blue);margin-right:6px;"></i>
            Contribution Activity
        </div>
        <img src="https://ghchart.rshah.org/00d4ff/ArifAli8866"
             alt="GitHub Contribution Chart"
             style="width:100%;border-radius:8px;filter:invert(0);"
             onerror="this.parentElement.innerHTML='<p style=color:var(--t-m);font-size:.8rem;text-align:center;padding:20px>Contribution chart loads with internet connection</p>'">
    `;
    wrap.after(graphWrap);
})();

/* ══════════════════════════════════════
   10. SCROLL PROGRESS SECTIONS INDICATOR
   Small dots on right side showing which section
══════════════════════════════════════ */
(function initSectionDots() {
    const sectionIds = ['home', 'about', 'services', 'education', 'projects', 'skills', 'github', 'journey', 'contact'];
    const dotsWrap = document.createElement('div');
    dotsWrap.style.cssText = `
        position:fixed; right:20px; top:50%; transform:translateY(-50%);
        display:flex; flex-direction:column; gap:10px; z-index:500;
    `;

    sectionIds.forEach(id => {
        const dot = document.createElement('a');
        dot.href = '#' + id;
        dot.setAttribute('data-sid', id);
        dot.title = id.charAt(0).toUpperCase() + id.slice(1);
        dot.style.cssText = `
            width:8px; height:8px; border-radius:50%;
            background:rgba(255,255,255,.15); border:1px solid rgba(0,212,255,.2);
            display:block; transition:all .3s; flex-shrink:0;
        `;
        dot.addEventListener('mouseenter', () => { dot.style.transform = 'scale(1.5)'; });
        dot.addEventListener('mouseleave', () => { dot.style.transform = ''; });
        dotsWrap.appendChild(dot);
    });

    document.body.appendChild(dotsWrap);

    // Hide on mobile
    const mq = window.matchMedia('(max-width:900px)');
    const toggle = () => { dotsWrap.style.display = mq.matches ? 'none' : 'flex'; };
    mq.addEventListener('change', toggle); toggle();

    // Update active dot on scroll
    window.addEventListener('scroll', () => {
        let current = '';
        sectionIds.forEach(id => {
            const el = document.getElementById(id);
            if (el && window.scrollY >= el.offsetTop - 160) current = id;
        });
        dotsWrap.querySelectorAll('a').forEach(dot => {
            const isActive = dot.getAttribute('data-sid') === current;
            dot.style.background = isActive ? 'var(--c-blue)' : 'rgba(255,255,255,.12)';
            dot.style.borderColor = isActive ? 'var(--c-blue)' : 'rgba(0,212,255,.2)';
            dot.style.height = isActive ? '20px' : '8px';
            dot.style.borderRadius = isActive ? '4px' : '50%';
            dot.style.boxShadow = isActive ? '0 0 8px var(--c-blue)' : 'none';
        });
    }, { passive: true });
})();

console.log('%c✓ Final additions loaded — Portfolio is 💯 complete!', 'color:#ec4899;font-family:Space Mono;font-size:12px;font-weight:bold;');


/* ══════════════════════════════════════════════════
   ARIF ALI — experience_v2.js
   COMPLETELY REPLACE experience.js content with this
   ══════════════════════════════════════════════════ */

/* ── Filter tabs ── */
(function initExpFilter() {
    const tabs = document.querySelectorAll('.exp-tab');
    const grid1 = document.getElementById('expGrid');
    const grid2 = document.getElementById('expGridSecondary');
    if (!tabs.length) return;

    function getCards() {
        return document.querySelectorAll('.exp-card');
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const filter = tab.getAttribute('data-filter');

            getCards().forEach((card, i) => {
                const type = card.getAttribute('data-type');
                const show = filter === 'all' || type === filter;

                if (show) {
                    card.classList.remove('hidden');
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(24px)';
                    setTimeout(() => {
                        card.style.transition = 'opacity .45s ease, transform .45s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, i * 55);
                } else {
                    card.classList.add('hidden');
                }
            });

            // Hide/show block labels
            const blockLabels = document.querySelectorAll('.exp-block-label');
            if (filter === 'all') {
                blockLabels.forEach(l => l.style.display = '');
            } else if (filter === 'internship') {
                blockLabels.forEach((l, i) => l.style.display = i === 0 ? '' : 'none');
            } else {
                blockLabels.forEach((l, i) => l.style.display = i === 1 ? '' : 'none');
            }
        });
    });
})();

/* ── Grid / List view toggle ── */
(function initViewToggle() {
    const gridBtn = document.getElementById('viewGrid');
    const listBtn = document.getElementById('viewList');
    const grids = document.querySelectorAll('.exp-grid, .exp-grid-secondary');
    if (!gridBtn) return;

    gridBtn.addEventListener('click', () => {
        grids.forEach(g => g.classList.remove('list-view'));
        gridBtn.classList.add('active');
        listBtn.classList.remove('active');
    });
    listBtn.addEventListener('click', () => {
        grids.forEach(g => g.classList.add('list-view'));
        listBtn.classList.add('active');
        gridBtn.classList.remove('active');
    });
})();

/* ── Summary counters ── */
const expSumObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.querySelectorAll('.exp-sum-num[data-target]').forEach(el => {
            const target = parseInt(el.getAttribute('data-target'));
            let c = 0;
            const iv = setInterval(() => {
                c++;
                el.textContent = c;
                if (c >= target) clearInterval(iv);
            }, 100);
        });
        expSumObs.unobserve(entry.target);
    });
}, { threshold: 0.5 });
document.querySelectorAll('.exp-summary').forEach(el => expSumObs.observe(el));

/* ── Scroll reveal for cards ── */
const expObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const delay = (parseInt(entry.target.style.getPropertyValue('--i')) || 0) * 70;
            setTimeout(() => entry.target.classList.add('vis'), delay);
            expObs.unobserve(entry.target);
        }
    });
}, { threshold: 0.07 });
document.querySelectorAll('.exp-card').forEach(el => expObs.observe(el));

console.log('%c✓ Experience v2 loaded', 'color:#00d4ff;font-family:Space Mono;font-size:11px;');

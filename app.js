document.addEventListener('DOMContentLoaded', function() {
    // Set up navigation
    setupNavigation();
    
    // Set up test flow if on test page
    setupTestFlow();
    
    // Setup countdown timer if exists
    setupCountdown();
    
    // Setup smooth scrolling for anchor links
    setupSmoothScrolling();
    
    // Initialize iframes for app previews
    initAppPreviews();
});

// Navigation setup
function setupNavigation() {
    // Mobile menu toggle
    const menuButton = document.querySelector('button.md\\:hidden');
    if (menuButton) {
        menuButton.addEventListener('click', function() {
            const mobileMenu = document.querySelector('.md\\:flex.items-center');
            if (mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.remove('hidden');
                mobileMenu.classList.add('flex', 'flex-col', 'w-full', 'absolute', 'top-16', 'left-0', 'bg-white', 'z-50', 'py-4', 'shadow-md');
            } else {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('flex', 'flex-col', 'w-full', 'absolute', 'top-16', 'left-0', 'bg-white', 'z-50', 'py-4', 'shadow-md');
            }
        });
    }
}

// Test flow setup
function setupTestFlow() {
    // Elements
    const startTestBtn = document.getElementById('start-test-btn');
    if (!startTestBtn) return;
    
    const testStart = document.getElementById('test-start');
    const musicTest = document.getElementById('music-test');
    const colorTest = document.getElementById('color-test');
    const analyzing = document.getElementById('analyzing');
    const result = document.getElementById('result');
    
    let musicScores = [0, 0, 0, 0, 0];
    let colorScores = [0, 0, 0, 0, 0];
    let currentMusicQuestion = 0;
    let currentColorQuestion = 0;
    
    // Test content
    const musicQuestions = [
        {title: "musicTest.question1", audio: "https://example.com/audio/jiao.mp3"},
        {title: "musicTest.question2", audio: "https://example.com/audio/zhi.mp3"},
        {title: "musicTest.question3", audio: "https://example.com/audio/gong.mp3"},
        {title: "musicTest.question4", audio: "https://example.com/audio/shang.mp3"},
        {title: "musicTest.question5", audio: "https://example.com/audio/yu.mp3"}
    ];
    
    const colorQuestions = [
        {title: "colorTest.question1", color: "#006E54"},
        {title: "colorTest.question2", color: "#C73E3A"},
        {title: "colorTest.question3", color: "#D9B611"},
        {title: "colorTest.question4", color: "#EAE7E1"},
        {title: "colorTest.question5", color: "#080C0E"}
    ];
    
    // Start test button
    if (startTestBtn) {
        startTestBtn.addEventListener('click', function() {
            testStart.classList.add('hidden');
            musicTest.classList.remove('hidden');
            updateMusicQuestion();
        });
    }
    
    // Music test rating buttons
    const musicRatingBtns = document.querySelectorAll('.music-rating');
    musicRatingBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            musicScores[currentMusicQuestion] = rating;
            
            // Highlight selected rating
            musicRatingBtns.forEach(b => b.classList.remove('bg-gray-200', 'font-bold'));
            this.classList.add('bg-gray-200', 'font-bold');
            
            // Enable next button
            document.getElementById('next-music-btn').disabled = false;
        });
    });
    
    // Color test rating buttons
    const colorRatingBtns = document.querySelectorAll('.color-rating');
    colorRatingBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            colorScores[currentColorQuestion] = rating;
            
            // Highlight selected rating
            colorRatingBtns.forEach(b => b.classList.remove('bg-gray-200', 'font-bold'));
            this.classList.add('bg-gray-200', 'font-bold');
            
            // Enable next button
            document.getElementById('next-color-btn').disabled = false;
        });
    });
    
    // Music test prev button
    const prevMusicBtn = document.getElementById('prev-music-btn');
    if (prevMusicBtn) {
        prevMusicBtn.addEventListener('click', function() {
            if (currentMusicQuestion > 0) {
                currentMusicQuestion--;
                updateMusicQuestion();
            }
        });
    }
    
    // Music test next button
    const nextMusicBtn = document.getElementById('next-music-btn');
    if (nextMusicBtn) {
        nextMusicBtn.addEventListener('click', function() {
            if (currentMusicQuestion < 4) {
                currentMusicQuestion++;
                updateMusicQuestion();
            } else {
                // Music test complete, start color test
                musicTest.classList.add('hidden');
                colorTest.classList.remove('hidden');
                updateColorQuestion();
            }
        });
    }
    
    // Color test prev button
    const prevColorBtn = document.getElementById('prev-color-btn');
    if (prevColorBtn) {
        prevColorBtn.addEventListener('click', function() {
            if (currentColorQuestion > 0) {
                currentColorQuestion--;
                updateColorQuestion();
            }
        });
    }
    
    // Color test next button
    const nextColorBtn = document.getElementById('next-color-btn');
    if (nextColorBtn) {
        nextColorBtn.addEventListener('click', function() {
            if (currentColorQuestion < 4) {
                currentColorQuestion++;
                updateColorQuestion();
            } else {
                // Color test complete, show analyzing
                colorTest.classList.add('hidden');
                analyzing.classList.remove('hidden');
                
                // Simulate analysis, show result after 3 seconds
                setTimeout(function() {
                    analyzing.classList.add('hidden');
                    result.classList.remove('hidden');
                    
                    // Calculate result
                    calculateResult();
                }, 3000);
            }
        });
    }
    
    // Update music test question
    function updateMusicQuestion() {
        const question = musicQuestions[currentMusicQuestion];
        const questionTitle = document.querySelector('#music-question h4');
        if (questionTitle) {
            questionTitle.setAttribute('data-i18n', question.title);
            // Trigger translation update
            const lang = localStorage.getItem('preferredLanguage') || 'zh';
            loadLanguage(lang);
        }
        
        const audio = document.getElementById('current-audio');
        if (audio) audio.src = question.audio;
        
        // Update progress bar
        const progressBar = musicTest.querySelector('.progress-bar');
        if (progressBar) {
            progressBar.style.width = `${(currentMusicQuestion + 1) * 20}%`;
            const span = progressBar.querySelector('span');
            if (span) span.textContent = `${currentMusicQuestion + 1}/5`;
        }
        
        // Reset rating buttons
        document.querySelectorAll('.music-rating').forEach(btn => {
            btn.classList.remove('bg-gray-200', 'font-bold');
            if (parseInt(btn.getAttribute('data-rating')) === musicScores[currentMusicQuestion]) {
                btn.classList.add('bg-gray-200', 'font-bold');
            }
        });
        
        // Disable/enable prev and next buttons
        if (prevMusicBtn) prevMusicBtn.disabled = currentMusicQuestion === 0;
        if (nextMusicBtn) nextMusicBtn.disabled = musicScores[currentMusicQuestion] === 0;
    }
    
    // Update color test question
    function updateColorQuestion() {
        const question = colorQuestions[currentColorQuestion];
        const questionTitle = document.querySelector('#color-question h4');
        if (questionTitle) {
            questionTitle.setAttribute('data-i18n', question.title);
            // Trigger translation update
            const lang = localStorage.getItem('preferredLanguage') || 'zh';
            loadLanguage(lang);
        }
        
        const colorTile = document.querySelector('.color-tile');
        if (colorTile) colorTile.style.backgroundColor = question.color;
        
        // Update progress bar
        const progressBar = colorTest.querySelector('.progress-bar');
        if (progressBar) {
            progressBar.style.width = `${(currentColorQuestion + 1) * 20}%`;
            const span = progressBar.querySelector('span');
            if (span) span.textContent = `${currentColorQuestion + 1}/5`;
        }
        
        // Reset rating buttons
        document.querySelectorAll('.color-rating').forEach(btn => {
            btn.classList.remove('bg-gray-200', 'font-bold');
            if (parseInt(btn.getAttribute('data-rating')) === colorScores[currentColorQuestion]) {
                btn.classList.add('bg-gray-200', 'font-bold');
            }
        });
        
        // Disable/enable prev and next buttons
        if (prevColorBtn) prevColorBtn.disabled = currentColorQuestion === 0;
        if (nextColorBtn) nextColorBtn.disabled = colorScores[currentColorQuestion] === 0;
    }
    
    // Calculate test result
    function calculateResult() {
        const musicSum = musicScores.reduce((a, b) => a + b, 0);
        const colorSum = colorScores.reduce((a, b) => a + b, 0);
        
        const musicPercentage = Math.round((musicSum / 25) * 100);
        const colorPercentage = Math.round((colorSum / 25) * 100);
        
        // Update result display
        const resultTalent = document.getElementById('result-talent');
        if (resultTalent) {
            if (musicPercentage > colorPercentage) {
                resultTalent.setAttribute('data-i18n', 'app.result.talent.music');
            } else {
                resultTalent.setAttribute('data-i18n', 'app.result.talent.color');
            }
            // Trigger translation update
            const lang = localStorage.getItem('preferredLanguage') || 'zh';
            loadLanguage(lang);
        }
        
        // Update progress bars
        const musicProgressBar = result.querySelectorAll('.progress-bar')[0];
        const colorProgressBar = result.querySelectorAll('.progress-bar')[1];
        
        if (musicProgressBar) musicProgressBar.style.width = `${musicPercentage}%`;
        if (colorProgressBar) colorProgressBar.style.width = `${colorPercentage}%`;
        
        const musicPercentageText = result.querySelectorAll('.text-right')[0];
        const colorPercentageText = result.querySelectorAll('.text-right')[1];
        
        if (musicPercentageText) musicPercentageText.textContent = `${musicPercentage}%`;
        if (colorPercentageText) colorPercentageText.textContent = `${colorPercentage}%`;
    }
}

// Countdown timer setup
function setupCountdown() {
    const hours = document.getElementById('hours');
    const minutes = document.getElementById('minutes');
    const seconds = document.getElementById('seconds');
    
    if (!hours || !minutes || !seconds) return;
    
    function updateCountdown() {
        let h = parseInt(hours.textContent);
        let m = parseInt(minutes.textContent);
        let s = parseInt(seconds.textContent);
        
        s--;
        
        if (s < 0) {
            s = 59;
            m--;
            
            if (m < 0) {
                m = 59;
                h--;
                
                if (h < 0) {
                    // Reset to 10 hours when countdown ends
                    h = 10;
                    m = 0;
                    s = 0;
                }
            }
        }
        
        hours.textContent = h < 10 ? '0' + h : h;
        minutes.textContent = m < 10 ? '0' + m : m;
        seconds.textContent = s < 10 ? '0' + s : s;
    }
    
    // Update countdown every second
    setInterval(updateCountdown, 1000);
}

// Smooth scrolling for anchor links
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Initialize app preview iframes
function initAppPreviews() {
    const previewContainer = document.getElementById('app-previews');
    if (!previewContainer) return;
    
    const pages = ['test.html', 'result.html', 'home.html'];
    
    pages.forEach(page => {
        const iframe = document.createElement('iframe');
        iframe.src = page;
        iframe.className = 'border rounded-xl shadow-lg';
        iframe.style.width = '375px'; // iPhone width
        iframe.style.height = '812px'; // iPhone height
        iframe.style.border = 'none';
        iframe.title = page.split('.')[0] + ' preview';
        
        const container = document.createElement('div');
        container.className = 'inline-block mx-2 my-4';
        
        // Add device frame
        const frame = document.createElement('div');
        frame.className = 'relative';
        frame.innerHTML = `
            <div class="absolute top-0 left-0 right-0 h-6 bg-black rounded-t-xl z-10">
                <div class="w-1/3 h-4 mx-auto mt-1 bg-gray-800 rounded-full"></div>
            </div>
            <div class="absolute bottom-0 left-0 right-0 h-6 bg-black rounded-b-xl z-10"></div>
        `;
        
        frame.appendChild(iframe);
        container.appendChild(frame);
        previewContainer.appendChild(container);
    });
}
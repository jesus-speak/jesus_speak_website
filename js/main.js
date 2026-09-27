/**
 * JESUS SPEAKS NOW / WALK WITH CHRIST - OFFICIAL SHOWCASE WEBSITE
 * Interactive Functionality & Micro-Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileMenu();
  initPhoneVideoPlayer();
  initPrayerSimulator();
  initPosterCustomizer();
  initInteractiveQuiz();
  initFaqAccordion();
  initSupportForm();
  initSmoothScroll();
});

/* --------------------------------------------------------------------------
   1. Header Sticky Effect
   -------------------------------------------------------------------------- */
function initHeader() {
  const header = document.querySelector('.site-header-pill, .site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/* --------------------------------------------------------------------------
   2. Mobile Drawer Navigation
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobileToggle');
  const mobileNav = document.getElementById('mobileNav');
  if (!toggleBtn || !mobileNav) return;

  toggleBtn.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
    const isOpen = mobileNav.classList.contains('open');
    toggleBtn.setAttribute('aria-expanded', isOpen);
  });

  // Close when clicking a link
  mobileNav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

/* --------------------------------------------------------------------------
   3. Phone Mockup Video Player (Sample Muted Loop with Audio Toggle)
   -------------------------------------------------------------------------- */
function initPhoneVideoPlayer() {
  const video = document.getElementById('sampleVideo');
  const audioBtn = document.getElementById('audioToggleBtn');
  const audioIcon = document.getElementById('audioIcon');
  const progressBar = document.getElementById('videoProgressBar');

  if (!video) return;

  // Ensure initial state is muted as requested: "display sample video without sound"
  video.muted = true;

  // Attempt autoplay
  const playPromise = video.play();
  if (playPromise !== undefined) {
    playPromise.catch(() => {
      console.log('Autoplay waiting for user gesture.');
    });
  }

  // Update progress bar
  video.addEventListener('timeupdate', () => {
    if (progressBar && video.duration) {
      const pct = (video.currentTime / video.duration) * 100;
      progressBar.style.width = `${pct}%`;
    }
  });

  // Audio Toggle Button
  if (audioBtn) {
    audioBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      video.muted = !video.muted;
      updateAudioIcon(video.muted);
      showToast(video.muted ? 'Audio Muted' : 'Audio Unmuted');
    });
  }

  function updateAudioIcon(isMuted) {
    if (!audioIcon) return;
    if (isMuted) {
      audioIcon.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
          <line x1="23" y1="9" x2="17" y2="15"></line>
          <line x1="17" y1="9" x2="23" y2="15"></line>
        </svg>
      `;
    } else {
      audioIcon.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 5"></polygon>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
        </svg>
      `;
    }
  }
}

/* --------------------------------------------------------------------------
   4. Interactive "Pray with AI" Devotional Simulator
   -------------------------------------------------------------------------- */
const PRAYER_DATABASE = {
  anxiety: {
    prayer: "Heavenly Father, quiet my racing thoughts. Wrap me in Your supernatural peace which surpasses all human understanding. May Your gentle Holy Spirit guard my heart today, knowing You hold every tomorrow in Your hands.",
    scripture: "Philippians 4:6–7 — Do not be anxious about anything, but in every situation, present your requests to God.",
    topic: "Peace in Anxiety"
  },
  gratitude: {
    prayer: "Lord of all Grace, thank You for the breath in my lungs, the sunrise this morning, and Your steadfast love that never ceases. Even in trials, You are my faithful refuge and everlasting fortress.",
    scripture: "Psalm 107:1 — Give thanks to the Lord, for He is good; His love endures forever.",
    topic: "Daily Gratitude"
  },
  guidance: {
    prayer: "Lord Jesus, illuminate my path when the crossroads seem unclear. Grant me divine discernment and righteous wisdom, that every decision I make honors Your name and fulfills Your purpose.",
    scripture: "Proverbs 3:5–6 — Trust in the Lord with all your heart and lean not on your own understanding.",
    topic: "Divine Guidance"
  },
  healing: {
    prayer: "Great Physician, reach Your restorative hands over my mind, body, and spirit. Infuse strength where there is weariness, and pour living water into every dry place in my soul.",
    scripture: "Isaiah 53:5 — By His wounds we are healed.",
    topic: "Healing & Restoration"
  },
  family: {
    prayer: "Loving Shepherd, bless and protect my family under the shadow of Your wings. Grant us patience, unity, forgiveness, and unconditional love that mirrors Your covenant with us.",
    scripture: "Joshua 24:15 — As for me and my household, we will serve the Lord.",
    topic: "Family & Loved Ones"
  }
};

function initPrayerSimulator() {
  const chips = document.querySelectorAll('.prayer-prompt-chip');
  const outputEl = document.getElementById('prayerOutputText');
  const scriptureEl = document.getElementById('prayerScriptureAnchor');
  const topicEl = document.getElementById('prayerActiveTopic');

  if (!chips.length || !outputEl) return;

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const key = chip.getAttribute('data-prompt-key');
      const item = PRAYER_DATABASE[key] || PRAYER_DATABASE.anxiety;

      // Animate typing text
      typePrayerText(item.prayer, outputEl);
      if (scriptureEl) scriptureEl.innerHTML = `<span>✦</span> ${item.scripture}`;
      if (topicEl) topicEl.textContent = `Praying for: ${item.topic}`;
    });
  });
}

function typePrayerText(fullText, element) {
  element.textContent = '';
  element.style.opacity = '0.5';

  let index = 0;
  const speed = 12; // ms per char

  const interval = setInterval(() => {
    if (index < fullText.length) {
      element.textContent += fullText.charAt(index);
      index++;
    } else {
      clearInterval(interval);
      element.style.opacity = '1';
    }
  }, speed);
}

/* --------------------------------------------------------------------------
   5. Verse Poster Customizer
   -------------------------------------------------------------------------- */
const POSTER_TEMPLATES = [
  {
    bg: 'assets/images/daily_verse_bible.jpg',
    verse: '“I can do all this through Him who gives me strength.”',
    ref: 'Philippians 4:13'
  },
  {
    bg: 'assets/images/rock_horizontal.png',
    verse: '“The rain came down, the streams rose, and the winds blew, yet it did not fall.”',
    ref: 'Matthew 7:25'
  },
  {
    bg: 'assets/images/bible_header_bg.png',
    verse: '“Your Word is a lamp to my feet and a light to my path.”',
    ref: 'Psalm 119:105'
  },
  {
    bg: 'assets/images/home_jesus_bg_1.jpg',
    verse: '“Peace I leave with you; my peace I give you. Do not let your hearts be troubled.”',
    ref: 'John 14:27'
  }
];

function initPosterCustomizer() {
  const posterCard = document.getElementById('livePosterCard');
  const quoteEl = document.getElementById('posterQuoteText');
  const refEl = document.getElementById('posterRefText');
  const thumbs = document.querySelectorAll('.preset-thumb-btn');

  if (!posterCard || !thumbs.length) return;

  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      thumbs.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');

      const idx = parseInt(thumb.getAttribute('data-preset-idx'), 10) || 0;
      const tpl = POSTER_TEMPLATES[idx] || POSTER_TEMPLATES[0];

      posterCard.style.backgroundImage = `url('${tpl.bg}')`;
      if (quoteEl) quoteEl.textContent = tpl.verse;
      if (refEl) refEl.textContent = tpl.ref;

      showToast('Theme Updated');
    });
  });
}

/* --------------------------------------------------------------------------
   6. Interactive Episode Quiz
   -------------------------------------------------------------------------- */
const QUIZ_QUESTIONS = [
  {
    q: "In the teaching 'Build Your Life on the Rock', where did the wise builder construct his house?",
    options: [
      { text: "On the solid bedrock", correct: true },
      { text: "On the shifting coastal sand", correct: false },
      { text: "On the top of a tree", correct: false },
      { text: "In a shielded valley", correct: false }
    ],
    explanation: "Matthew 7:24 — 'Therefore everyone who hears these words of mine and puts them into practice is like a wise man who built his house on the rock.'"
  },
  {
    q: "What does Jesus declare the 'Rock' represents in our daily walk?",
    options: [
      { text: "Financial riches and worldly honors", correct: false },
      { text: "Hearing His words and putting them into practice", correct: true },
      { text: "Having no storms or troubles in life", correct: false },
      { text: "Following ancient cultural traditions", correct: false }
    ],
    explanation: "Jesus explained that the storm hits both houses equally, but the house rooted in obedience to His Word stands firm against every wind."
  },
  {
    q: "What happened when the storms, rain, and winds beat against the foolish man's house?",
    options: [
      { text: "It stood completely unchanged", correct: false },
      { text: "It fell with a great crash", correct: true },
      { text: "The sand turned into stone", correct: false },
      { text: "The water gently flowed around it", correct: false }
    ],
    explanation: "Matthew 7:27 — 'The rain came down, the streams rose, and the winds blew and beat against that house, and it fell with a great crash.'"
  }
];

let currentQuizIdx = 0;
let quizScore = 0;

function initInteractiveQuiz() {
  renderQuizQuestion(currentQuizIdx);

  const nextBtn = document.getElementById('quizNextBtn');
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentQuizIdx++;
      if (currentQuizIdx >= QUIZ_QUESTIONS.length) {
        showQuizResults();
      } else {
        renderQuizQuestion(currentQuizIdx);
      }
    });
  }
}

function renderQuizQuestion(idx) {
  const item = QUIZ_QUESTIONS[idx];
  const qTitle = document.getElementById('quizQuestionTitle');
  const qNum = document.getElementById('quizQuestionNum');
  const optionsWrap = document.getElementById('quizOptionsList');
  const feedbackBox = document.getElementById('quizFeedbackBox');
  const nextBtn = document.getElementById('quizNextBtn');

  if (!qTitle || !optionsWrap) return;

  if (qNum) qNum.textContent = `Question ${idx + 1} of ${QUIZ_QUESTIONS.length}`;
  qTitle.textContent = item.q;
  optionsWrap.innerHTML = '';
  if (feedbackBox) {
    feedbackBox.classList.remove('show');
    feedbackBox.innerHTML = '';
  }
  if (nextBtn) {
    nextBtn.style.display = 'none';
    nextBtn.textContent = idx === QUIZ_QUESTIONS.length - 1 ? 'View Quiz Results' : 'Next Question';
  }

  item.options.forEach((opt) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'quiz-option-btn';
    btn.innerHTML = `
      <span>${opt.text}</span>
      <span class="opt-indicator"></span>
    `;

    btn.addEventListener('click', () => {
      // Disable all buttons in this question
      const allBtns = optionsWrap.querySelectorAll('.quiz-option-btn');
      allBtns.forEach(b => b.disabled = true);

      if (opt.correct) {
        btn.classList.add('correct');
        quizScore++;
        if (feedbackBox) {
          feedbackBox.innerHTML = `<strong>✨ Correct!</strong> ${item.explanation}`;
          feedbackBox.classList.add('show');
        }
      } else {
        btn.classList.add('incorrect');
        // highlight correct one
        allBtns.forEach((b, i) => {
          if (item.options[i].correct) b.classList.add('correct');
        });
        if (feedbackBox) {
          feedbackBox.innerHTML = `<strong>Faith Insight:</strong> ${item.explanation}`;
          feedbackBox.classList.add('show');
        }
      }

      if (nextBtn) nextBtn.style.display = 'inline-flex';
    });

    optionsWrap.appendChild(btn);
  });
}

function showQuizResults() {
  const qTitle = document.getElementById('quizQuestionTitle');
  const optionsWrap = document.getElementById('quizOptionsList');
  const feedbackBox = document.getElementById('quizFeedbackBox');
  const nextBtn = document.getElementById('quizNextBtn');
  const qNum = document.getElementById('quizQuestionNum');

  if (qNum) qNum.textContent = 'Quiz Completed';
  if (qTitle) qTitle.textContent = `You scored ${quizScore} out of ${QUIZ_QUESTIONS.length}!`;

  if (optionsWrap) {
    optionsWrap.innerHTML = `
      <div style="text-align: center; padding: 20px 0;">
        <p style="font-size: 1.1rem; color: var(--gold-highlight); margin-bottom: 12px; font-weight: 700;">
          ${quizScore === QUIZ_QUESTIONS.length ? '🌟 Outstanding! You have built your faith on the Rock!' : '🕊️ Well done! Continue to meditate on the Word daily.'}
        </p>
        <p style="color: var(--text-secondary); font-size: 0.95rem;">
          In the Jesus Speaks Now app, every episode features quizzes with streak badges, leaderboards, and scripture rewards.
        </p>
      </div>
    `;
  }

  if (feedbackBox) feedbackBox.classList.remove('show');
  if (nextBtn) {
    nextBtn.textContent = 'Retake Quiz';
    nextBtn.style.display = 'inline-flex';
    nextBtn.onclick = () => {
      currentQuizIdx = 0;
      quizScore = 0;
      renderQuizQuestion(0);
      nextBtn.onclick = null;
    };
  }
}

/* --------------------------------------------------------------------------
   7. FAQ Accordion (From support_screen.dart)
   -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const items = document.querySelectorAll('.accordion-item');
  if (!items.length) return;

  items.forEach((item, index) => {
    const header = item.querySelector('.accordion-header');
    const body = item.querySelector('.accordion-body');

    // Expand the first item by default
    if (index === 0) {
      item.classList.add('active');
      body.style.maxHeight = body.scrollHeight + 30 + 'px';
    }

    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all others
      items.forEach(other => {
        other.classList.remove('active');
        const otherBody = other.querySelector('.accordion-body');
        if (otherBody) otherBody.style.maxHeight = null;
      });

      // Toggle current
      if (!isActive) {
        item.classList.add('active');
        body.style.maxHeight = body.scrollHeight + 30 + 'px';
      }
    });
  });
}

/* --------------------------------------------------------------------------
   8. Support Message Form (From support_screen.dart)
   -------------------------------------------------------------------------- */
function initSupportForm() {
  const form = document.getElementById('supportForm');
  const copyEmailBtn = document.getElementById('copyEmailBtn');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const subject = document.getElementById('supportSubject').value.trim();
      const message = document.getElementById('supportMessage').value.trim();
      const submitBtn = form.querySelector('button[type="submit"]');

      if (!subject || !message) {
        showToast('Please complete both Subject and Message fields.');
        return;
      }

      // Simulate sending with loading state
      const origText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Sending prayerfully...</span>`;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = origText;
        form.reset();

        showToast('Message sent! Our team will reply within 24 hours.');
        alert('🕊️ Thank You for Reaching Out!\n\nYour message has been received with care. The Jesus Speaks Now team will respond within 24 hours.\n\nMay God bless your journey today.');
      }, 1200);
    });
  }

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', (e) => {
      e.preventDefault();
      navigator.clipboard.writeText('support@jesusspeaksnow.com').then(() => {
        showToast('Copied support@jesusspeaksnow.com to clipboard');
      }).catch(() => {
        showToast('support@jesusspeaksnow.com');
      });
    });
  }
}

/* --------------------------------------------------------------------------
   9. Smooth Scroll Anchors
   -------------------------------------------------------------------------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* --------------------------------------------------------------------------
   10. Toast Notifications
   -------------------------------------------------------------------------- */
let toastTimeout = null;
function showToast(msg) {
  let toast = document.getElementById('toastMsg');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toastMsg';
    toast.className = 'toast-msg';
    document.body.appendChild(toast);
  }

  toast.textContent = msg;
  toast.classList.add('show');

  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 2600);
}

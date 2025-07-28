import { appState } from './state.js';

const elements = {
    html: document.documentElement,
    landingPageView: document.getElementById('landing-page-view'),
    dashboardView: document.getElementById('dashboard-view'),
    examView: document.getElementById('exam-view'),
    authModal: document.getElementById('auth-modal'),
    loginForm: document.getElementById('login-form'),
    registerForm: document.getElementById('register-form'),
    userEmailDisplay: document.getElementById('user-email-display'),
    featuresContainer: document.getElementById('features-container'),
    testimonialsContainer: document.getElementById('testimonials-container'),
    faqAccordion: document.getElementById('faq-accordion'),
    subjectSelectionSection: document.getElementById('subject-selection-section'),
    examInProgressSection: document.getElementById('exam-in-progress-section'),
    resultsSection: document.getElementById('results-section'),
    questionText: document.getElementById('question-text'),
    optionsContainer: document.getElementById('options-container'),
    timerDisplay: document.getElementById('timer'),
    currentQuestionNumberSpan: document.getElementById('current-question-number'),
    totalQuestionsSpan: document.getElementById('total-questions'),
    questionNavGrid: document.getElementById('question-nav-grid'),
    nextButton: document.getElementById('next-button'),
    prevButton: document.querySelector('[data-action="prev-question"]'),
    scoreDisplay: document.getElementById('score-display'),
    answersBreakdown: document.getElementById('answers-breakdown'),
    sunIcon: document.getElementById('sun-icon'),
    moonIcon: document.getElementById('moon-icon'),
    expandIcon: document.getElementById('expand-icon'),
    compressIcon: document.getElementById('compress-icon'),
};

export function showView(viewId) { [elements.landingPageView, elements.dashboardView, elements.examView].forEach(view => { view.classList.toggle('hidden', view.id !== viewId); }); window.scrollTo(0, 0); }
async function fetchData(url) { try { const response = await fetch(url); if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`); return await response.json(); } catch (error) { console.error(`Failed to fetch data from ${url}:`, error); return []; } }
export async function loadDynamicContent() { const [features, testimonials, faqs] = await Promise.all([fetchData('data/features.json'), fetchData('data/testimonials.json'), fetchData('data/faqs.json')]); if (elements.featuresContainer) elements.featuresContainer.innerHTML = features.map(f => `<div class="feature-card p-8 rounded-xl"><div class="feature-icon-bg">${f.icon}</div><h3 class="text-2xl font-bold text-white mb-3">${f.title}</h3><p class="text-gray-400">${f.description}</p></div>`).join(''); if (elements.testimonialsContainer) elements.testimonialsContainer.innerHTML = testimonials.map(t => `<div class="testimonial-card p-8 rounded-xl relative"><span class="absolute top-4 left-6 text-7xl brand-yellow opacity-10 font-serif">“</span><p class="text-lg text-gray-200 z-10 relative">${t.quote}</p><div class="flex items-center mt-6"><img src="${t.image}" class="w-12 h-12 rounded-full" alt="${t.name}"><div class="ml-4"><p class="font-bold text-white">${t.name}</p><p class="text-sm text-gray-400">${t.title}</p></div></div></div>`).join(''); if (elements.faqAccordion) elements.faqAccordion.innerHTML = faqs.map(f => `<div class="faq-item"><button class="faq-question" data-action="toggle-faq"><span>${f.question}</span><span class="faq-icon">+</span></button><div class="faq-answer"><p>${f.answer}</p></div></div>`).join(''); }
export function setupScrollAnimations() { const sections = document.querySelectorAll('.fade-in-section'); const observer = new IntersectionObserver((entries) => { entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); } }); }, { threshold: 0.1 }); sections.forEach(section => observer.observe(section)); }
export function showAuthModal() { elements.authModal.classList.remove('hidden'); setTimeout(() => elements.authModal.classList.add('visible'), 10); }
export function hideAuthModal() { elements.authModal.classList.remove('visible'); setTimeout(() => { elements.authModal.classList.add('hidden'); showLoginForm(); }, 300); }
export function showLoginForm() { elements.registerForm.classList.add('hidden'); elements.loginForm.classList.remove('hidden'); }
export function showRegisterForm() { elements.loginForm.classList.add('hidden'); elements.registerForm.classList.remove('hidden'); }
export function updateUserDisplay(email) { if (elements.userEmailDisplay) elements.userEmailDisplay.textContent = email; }
export function toggleDarkMode() { elements.html.classList.toggle('dark'); const isDarkMode = elements.html.classList.contains('dark'); localStorage.setItem('theme', isDarkMode ? 'dark' : 'light'); updateThemeIcons(isDarkMode); }
export function applyThemePreference() { const savedTheme = localStorage.getItem('theme'); const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches; const isDarkMode = savedTheme === 'dark' || (!savedTheme && prefersDark); if (isDarkMode) elements.html.classList.add('dark'); else elements.html.classList.remove('dark'); updateThemeIcons(isDarkMode); }
function updateThemeIcons(isDarkMode) { elements.sunIcon.classList.toggle('hidden', isDarkMode); elements.moonIcon.classList.toggle('hidden', !isDarkMode); }
export function toggleFullScreen() { if (!document.fullscreenElement) { elements.html.requestFullscreen().catch(err => console.error(err)); } else { document.exitFullscreen(); } }
export function updateFullScreenIcon() { const isFullscreen = !!document.fullscreenElement; elements.expandIcon.classList.toggle('hidden', isFullscreen); elements.compressIcon.classList.toggle('hidden', !isFullscreen); }
export function renderQuestion() { const { questions, currentQuestionIndex, userAnswers } = appState.exam; if (questions.length === 0) return; const question = questions[currentQuestionIndex]; elements.questionText.textContent = question.question; elements.currentQuestionNumberSpan.textContent = currentQuestionIndex + 1; elements.totalQuestionsSpan.textContent = questions.length; elements.optionsContainer.innerHTML = question.options.map((option, index) => { const optionId = `q${currentQuestionIndex}-option${index}`; const isChecked = userAnswers[currentQuestionIndex] === option; return `<div class="flex items-center p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-blue-800 cursor-pointer" onclick="document.getElementById('${optionId}').click()"><input type="radio" id="${optionId}" name="question-${currentQuestionIndex}" value="${option.replace(/"/g, "&quot;")}" class="mr-3" ${isChecked ? 'checked' : ''} onchange="window.examApp.saveCurrentAnswer()"><label for="${optionId}" class="text-lg text-gray-800 dark:text-gray-100 flex-grow cursor-pointer">${String.fromCharCode(65 + index)}. ${option}</label></div>`; }).join(''); updateNavigationButtons(); updateQuestionNavGrid(); }
export function updateNavigationButtons() { const { currentQuestionIndex, questions } = appState.exam; elements.prevButton.disabled = currentQuestionIndex === 0; const isLastQuestion = currentQuestionIndex === questions.length - 1; elements.nextButton.textContent = isLastQuestion ? 'Submit Exam' : 'Next'; elements.nextButton.classList.toggle('bg-green-600', isLastQuestion); elements.nextButton.classList.toggle('hover:bg-green-700', isLastQuestion); elements.nextButton.classList.toggle('bg-blue-600', !isLastQuestion); elements.nextButton.classList.toggle('hover:bg-blue-700', !isLastQuestion); }
export function generateQuestionNavGrid() { elements.questionNavGrid.innerHTML = appState.exam.questions.map((_, index) => `<button class="w-10 h-10 flex items-center justify-center rounded-lg font-semibold transition duration-200 shadow-sm" data-action="nav-to-question" data-index="${index}">${index + 1}</button>`).join(''); }
export function updateQuestionNavGrid() { const { currentQuestionIndex, userAnswers } = appState.exam; Array.from(elements.questionNavGrid.children).forEach((button, i) => { button.className = 'w-10 h-10 flex items-center justify-center rounded-lg font-semibold transition duration-200 shadow-sm'; if (i === currentQuestionIndex) { button.classList.add('bg-blue-600', 'text-white'); } else if (userAnswers[i] !== null) { button.classList.add('bg-green-200', 'dark:bg-green-800', 'text-green-800', 'dark:text-green-200'); } else { button.classList.add('bg-gray-200', 'dark:bg-gray-700'); } }); }
export function updateTimerDisplay() { const minutes = Math.floor(appState.exam.timeLeft / 60); const seconds = appState.exam.timeLeft % 60; elements.timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`; }
export function renderResults() { const { questions, userAnswers } = appState.exam; let score = 0; const breakdownHTML = questions.map((q, i) => { const isCorrect = userAnswers[i] === q.correctAnswer; if (isCorrect) score++; return `<div class="p-4 rounded-lg shadow-sm ${isCorrect ? 'bg-green-50 dark:bg-green-900' : 'bg-red-50 dark:bg-red-900'}"><p class="font-semibold text-gray-900 dark:text-white text-lg mb-1">Q${i + 1}: ${q.question}</p><p class="text-gray-700 dark:text-gray-200">Your Answer: <span class="${isCorrect ? 'text-green-600' : 'text-red-600'} font-medium">${userAnswers[i] || 'Not Answered'}</span></p><p class="text-gray-700 dark:text-gray-200">Correct Answer: <span class="text-blue-600 font-medium">${q.correctAnswer}</span></p></div>`; }).join(''); elements.scoreDisplay.textContent = `You scored ${score} out of ${questions.length}!`; elements.answersBreakdown.innerHTML = breakdownHTML; elements.examInProgressSection.classList.add('hidden'); elements.resultsSection.classList.remove('hidden'); }
export function resetExamUI() { elements.subjectSelectionSection.classList.remove('hidden'); elements.examInProgressSection.classList.add('hidden'); elements.resultsSection.classList.add('hidden'); document.getElementById('subject-select').value = ''; document.getElementById('start-exam-button').disabled = true; }

import { appState } from './state.js';
import { showView, showAuthModal, hideAuthModal, showLoginForm, showRegisterForm, toggleDarkMode, toggleFullScreen, updateFullScreenIcon } from './ui.js';
import { handleLogin, handleLogout, handleRegistration } from './auth.js';
import { startExam, handleNext, handlePrevious, navigateToQuestion, retakeExam, startSpecificExam } from './exam.js';

export function initializeEventListeners() {
    document.body.addEventListener('click', (e) => {
        const target = e.target.closest('[data-action]');
        if (!target) return;

        const action = target.dataset.action;
        if (action !== 'toggle-faq') e.preventDefault();

        switch (action) {
            // ... other cases remain the same
            case 'go-to-landing': showView('landing-page-view'); break;
            case 'get-started': showView('dashboard-view'); break;
            case 'show-auth-modal': showAuthModal(); break;
            case 'close-auth-modal': hideAuthModal(); break;
            case 'show-register': showRegisterForm(); break;
            case 'show-login': showLoginForm(); break;
            case 'logout': handleLogout(); break;
            case 'start-exam-page': showView('exam-view'); break;
            case 'go-to-dashboard': showView('dashboard-view'); retakeExam(); break;
            case 'toggle-dark-mode': toggleDarkMode(); break;
            case 'toggle-fullscreen': toggleFullScreen(); break;
            case 'start-exam': startExam(); break;
            case 'next-question': handleNext(); break;
            case 'prev-question': handlePrevious(); break;
            case 'retake-exam': retakeExam(); break;
            case 'nav-to-question': navigateToQuestion(parseInt(target.dataset.index, 10)); break;
            case 'toggle-faq': toggleFaq(target); break;

            // NEW: Handle clicks on specific exam cards from the dashboard
            case 'start-specific-exam':
                const subject = target.dataset.subject;
                if (subject) {
                    startSpecificExam(subject);
                }
                break;
        }
    });

    // ... other event listeners remain the same
    document.addEventListener('fullscreenchange', updateFullScreenIcon);
    document.getElementById('subject-select').addEventListener('change', (e) => { appState.exam.selectedSubjectFile = e.target.value; document.getElementById('start-exam-button').disabled = !e.target.value; });
    document.getElementById('timer-select').addEventListener('change', (e) => { appState.exam.examDuration = parseInt(e.target.value, 10); });
    document.getElementById('login-form').addEventListener('submit', (e) => { e.preventDefault(); handleLogin(e.target.querySelector('input[type="email"]').value, e.target.querySelector('input[type="password"]').value); });
    document.getElementById('register-form').addEventListener('submit', (e) => { e.preventDefault(); handleRegistration(e.target.querySelector('input[type="email"]').value, e.target.querySelector('input[type="password"]').value); });
}

function toggleFaq(questionButton) {
    const faqItem = questionButton.closest('.faq-item');
    if (!faqItem) return;
    const isOpen = faqItem.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(openItem => {
        if (openItem !== faqItem) {
            openItem.classList.remove('open');
            openItem.querySelector('.faq-answer').style.maxHeight = null;
            openItem.querySelector('.faq-icon').style.transform = 'rotate(0deg)';
        }
    });
    if (!isOpen) {
        faqItem.classList.add('open');
        const answer = faqItem.querySelector('.faq-answer');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        faqItem.querySelector('.faq-icon').style.transform = 'rotate(45deg)';
    } else {
        faqItem.classList.remove('open');
        const answer = faqItem.querySelector('.faq-answer');
        answer.style.maxHeight = null;
        faqItem.querySelector('.faq-icon').style.transform = 'rotate(0deg)';
    }
}

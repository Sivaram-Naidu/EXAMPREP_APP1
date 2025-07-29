import { appState, resetExamState } from './state.js';
import { showView, renderQuestion, generateQuestionNavGrid, updateTimerDisplay, renderResults, resetExamUI, renderExamSelection, showExamInProgress } from './ui.js';

// IMPORTANT: UPDATE THIS URL
// Replace this with the URL of your deployed backend server from Render
const API_BASE_URL = 'https://examprep-app1.onrender.com'; // Example URL

async function fetchQuestions(subject) {
    try {
        // Use the API_BASE_URL variable to make the request
        const response = await fetch(`${API_BASE_URL}/questions/${subject}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Could not fetch questions:', error);
        return null;
    }
}

// This function is for starting the exam from the subject selection page
export async function startExam() {
    const { selectedSubjectFile, examDuration } = appState.exam;
    if (!selectedSubjectFile) return;

    await fetchAndBegin(selectedSubjectFile, examDuration);
}

// This function starts a specific exam directly from the dashboard
export async function startSpecificExam(subject) {
    const duration = appState.exam.examDuration;
    await fetchAndBegin(subject, duration);
}

// Central function to fetch questions and start the exam process
async function fetchAndBegin(subject, duration) {
    const questions = await fetchQuestions(subject);
    if (!questions || questions.length === 0) {
        alert('Failed to load exam questions or subject is empty. Please try another.');
        return;
    }
    appState.exam.questions = questions;
    appState.exam.userAnswers = Array(questions.length).fill(null);
    appState.exam.timeLeft = duration;

    showExamInProgress();

    generateQuestionNavGrid();
    renderQuestion();
    startTimer();
}


function startTimer() {
    clearInterval(appState.exam.timerInterval);
    updateTimerDisplay();
    appState.exam.timerInterval = setInterval(() => {
        appState.exam.timeLeft--;
        updateTimerDisplay();
        if (appState.exam.timeLeft <= 0) submitExam();
    }, 1000);
}

export function submitExam() {
    if (appState.exam.isExamSubmitted) return;
    appState.exam.isExamSubmitted = true;
    clearInterval(appState.exam.timerInterval);
    renderResults();
}

export function handleNext() {
    if (appState.exam.currentQuestionIndex < appState.exam.questions.length - 1) {
        appState.exam.currentQuestionIndex++;
        renderQuestion();
    } else {
        submitExam();
    }
}

export function handlePrevious() {
    if (appState.exam.currentQuestionIndex > 0) {
        appState.exam.currentQuestionIndex--;
        renderQuestion();
    }
}

export function navigateToQuestion(index) {
    appState.exam.currentQuestionIndex = index;
    renderQuestion();
}

export function saveCurrentAnswer() {
    const selectedOption = document.querySelector(`input[name="question-${appState.exam.currentQuestionIndex}"]:checked`);
    appState.exam.userAnswers[appState.exam.currentQuestionIndex] = selectedOption ? selectedOption.value : null;
    renderQuestion();
}
window.examApp = { saveCurrentAnswer };

export function retakeExam() {
    resetExamState();
    resetExamUI();
}

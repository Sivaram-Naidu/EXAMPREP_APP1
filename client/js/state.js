export const appState = {
    isLoggedIn: false,
    currentUserEmail: '',
    exam: {
        questions: [],
        currentQuestionIndex: 0,
        userAnswers: [],
        timerInterval: null,
        timeLeft: 1800,
        isExamSubmitted: false,
        selectedSubjectFile: '',
        examDuration: 1800
    }
};

export function setUser(email) {
    appState.isLoggedIn = true;
    appState.currentUserEmail = email;
}

export function clearUser() {
    appState.isLoggedIn = false;
    appState.currentUserEmail = '';
}

export function resetExamState() {
    clearInterval(appState.exam.timerInterval);
    appState.exam = {
        questions: [],
        currentQuestionIndex: 0,
        userAnswers: [],
        timerInterval: null,
        timeLeft: 1800,
        isExamSubmitted: false,
        selectedSubjectFile: '',
        examDuration: 1800
    };
}

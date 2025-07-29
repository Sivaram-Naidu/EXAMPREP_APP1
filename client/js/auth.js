import { setUser, clearUser } from './state.js';
import { showView, hideAuthModal, updateUserDisplay } from './ui.js';

const API_BASE_URL = 'https://examprep-app1.onrender.com';

async function apiRequest(endpoint, options) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(errorData?.message || 'An API error occurred.');
        }
        return await response.json();
    } catch (error) {
        console.error('API Request Failed:', error);
        alert(`Error: ${error.message}`);
        return null;
    }
}

export async function handleLogin(email, password) {
    const data = await apiRequest('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    if (data && data.success) {
        setUser(data.user.email);
        updateUserDisplay(data.user.email);
        hideAuthModal();
        showView('dashboard-view');
    }
}

export async function handleRegistration(email, password) {
    const data = await apiRequest('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    if (data && data.success) {
        handleLogin(email, password);
    }
}

export function handleLogout() {
    clearUser();
    updateUserDisplay('');
    showView('landing-page-view');
}

import { initializeEventListeners } from './events.js';
import { setupScrollAnimations, loadDynamicContent, applyThemePreference } from './ui.js';

function main() {
    applyThemePreference();
    initializeEventListeners();
    setupScrollAnimations();
    loadDynamicContent();
}

document.addEventListener('DOMContentLoaded', main);

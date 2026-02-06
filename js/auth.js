import { auth, googleProvider, signInWithPopup, signOut, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword } from './firebase.js';
import { loadUserProgress } from './userData.js';

// Auth UI HTML to inject
const authTemplate = `
<div class="auth-container">
    <div id="auth-status" class="auth-status">Checking login status...</div>
    
    <div id="auth-forms" class="auth-forms">
        <div class="auth-row">
            <input type="email" id="auth-email" placeholder="Email" class="auth-input">
            <input type="password" id="auth-pass" placeholder="Password" class="auth-input">
        </div>
        <div class="auth-row">
            <button id="btn-signin" class="auth-btn secondary">Sign In</button>
            <button id="btn-signup" class="auth-btn secondary">Sign Up</button>
        </div>
        <div class="auth-divider"><span>OR</span></div>
        <button id="btn-google" class="auth-btn google-btn">
            <i class="fab fa-google"></i> Continue with Google
        </button>
    </div>

    <div id="auth-user" class="auth-user" hidden>
        <p>Welcome back!</p>
        <button id="btn-signout" class="auth-btn outline">Sign Out</button>
    </div>
    
    <p id="auth-error" class="auth-error"></p>
</div>
`;

// Inject Auth UI if on Journey page
function initAuthUI() {
    const heroSection = document.querySelector('.journey-hero');
    if (!heroSection) return;

    // Create container and insert before title
    const container = document.createElement('div');
    container.className = 'auth-wrapper';
    container.innerHTML = authTemplate;

    // Insert as first child of hero content if possible, or append
    const title = heroSection.querySelector('.journey-title');
    if (title) {
        heroSection.insertBefore(container, title);
    } else {
        heroSection.prepend(container);
    }

    // Event Listeners
    document.getElementById('btn-google').addEventListener('click', handleGoogleLogin);
    document.getElementById('btn-signin').addEventListener('click', handleEmailLogin);
    document.getElementById('btn-signup').addEventListener('click', handleEmailSignup);
    document.getElementById('btn-signout').addEventListener('click', handleSignOut);
}

// Logic
async function handleGoogleLogin() {
    try {
        clearError();
        await signInWithPopup(auth, googleProvider);
    } catch (error) {
        showError(error.message);
    }
}

async function handleEmailLogin() {
    const email = document.getElementById('auth-email').value;
    const pass = document.getElementById('auth-pass').value;
    try {
        clearError();
        await signInWithEmailAndPassword(auth, email, pass);
    } catch (error) {
        showError(error.message);
    }
}

async function handleEmailSignup() {
    const email = document.getElementById('auth-email').value;
    const pass = document.getElementById('auth-pass').value;
    try {
        clearError();
        await createUserWithEmailAndPassword(auth, email, pass);
    } catch (error) {
        showError(error.message);
    }
}

async function handleSignOut() {
    try {
        await signOut(auth);
        window.location.reload(); // clear simple UI state
    } catch (error) {
        console.error(error);
    }
}

function updateUI(user) {
    const statusEl = document.getElementById('auth-status');
    const formsEl = document.getElementById('auth-forms');
    const userEl = document.getElementById('auth-user');

    if (user) {
        statusEl.textContent = `Signed in as ${user.email}`;
        formsEl.hidden = true;
        userEl.hidden = false;
        // Load Data
        loadUserProgress(user.uid);
    } else {
        statusEl.textContent = "Sign in to save your progress";
        formsEl.hidden = false;
        userEl.hidden = true;
    }
}

function showError(msg) {
    const el = document.getElementById('auth-error');
    if (el) el.textContent = msg;
}

function clearError() {
    const el = document.getElementById('auth-error');
    if (el) el.textContent = '';
}

// Initializer
if (document.querySelector('.journey-hero')) {
    initAuthUI();
}

// Monitor state
onAuthStateChanged(auth, (user) => {
    if (document.querySelector('.journey-hero')) {
        updateUI(user);
    }
});

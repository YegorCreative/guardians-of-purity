import { db, doc, setDoc, getDoc, updateDoc, arrayUnion, serverTimestamp, onAuthStateChanged, auth } from './firebase.js';

// --- DATA MODEL ---
// users/{uid}/progress -> { completed: [1,2], currentChapter: 5 }
// users/{uid}/reflections/{chapterId} -> { text: "...", updatedAt: ... }

// --- PROGRESS ---

export async function loadUserProgress(uid) {
    if (!uid) return;
    try {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            applyProgressToUI(data.progress || {});
        } else {
            // Create user doc if new
            await setDoc(docRef, {
                createdAt: serverTimestamp(),
                progress: { currentChapter: 1, completed: [] }
            });
        }
    } catch (e) {
        console.error("Error loading progress:", e);
    }
}

function applyProgressToUI(progress) {
    // 1. Highlight Completed Chapters
    if (progress.completed && Array.isArray(progress.completed)) {
        progress.completed.forEach(num => {
            // Find card by href
            const card = document.querySelector(`a[href="chapter${num}.html"].chapter-card`);
            if (card) {
                card.classList.add('chapter-completed');
                // Optional: Add checkmark
                if (!card.querySelector('.completion-mark')) {
                    const mark = document.createElement('div');
                    mark.className = 'completion-mark';
                    mark.innerHTML = '✓';
                    card.appendChild(mark);
                }
            }
        });
    }

    // 2. Mark Current (Optional visual cue)
    if (progress.currentChapter) {
        const currentCard = document.querySelector(`a[href="chapter${progress.currentChapter}.html"].chapter-card`);
        if (currentCard) currentCard.classList.add('chapter-current');
    }
}

// Called when viewing a chapter
export async function markChapterVisit(chapterNum) {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const userRef = doc(db, "users", user.uid);
            try {
                // We update currentChapter. We DO NOT auto-mark as completed on visit (user must do work).
                // But specifically requested: "On any progress change -> save"
                // Let's assume visiting updates 'currentChapter' at least.
                await setDoc(userRef, {
                    progress: { currentChapter: parseInt(chapterNum) },
                    updatedAt: serverTimestamp()
                }, { merge: true });
            } catch (e) {
                console.error("Error saving visit:", e);
            }
        }
    });
}

// Called explicitly or imputed
export async function markChapterComplete(chapterNum) {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const userRef = doc(db, "users", user.uid);
            try {
                // Update progress using dot notation for specific field if possible, 
                // but 'progress' is a map. easier to merge.
                // We need to retrieve existing to not overwrite array? 
                // arrayUnion works on top-level or dot-notation fields.
                await setDoc(userRef, {
                    progress: {
                        currentChapter: parseInt(chapterNum) + 1 // Advance?
                        // Actually let's just create field if missing
                    }
                }, { merge: true });

                await updateDoc(userRef, {
                    "progress.completed": arrayUnion(parseInt(chapterNum))
                });
            } catch (e) {
                console.error("Error completing chapter:", e);
            }
        }
    });
}

// --- REFLECTIONS ---

// Hook into existing textareas
export function initReflectionSync(chapterNum) {
    // Listen for auth, if loaded -> sync
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            // Load existing
            await loadReflection(user.uid, chapterNum);

            // Bind listeners
            const textareas = document.querySelectorAll('textarea[id^="chapter"]');
            textareas.forEach(ta => {
                ta.addEventListener('change', (e) => saveReflection(user.uid, chapterNum, ta.id, ta.value));
            });
        }
    });
}

async function loadReflection(uid, chapterNum) {
    try {
        const refDoc = doc(db, "users", uid, "reflections", `chapter${chapterNum}`);
        const snap = await getDoc(refDoc);
        if (snap.exists()) {
            const data = snap.data();
            // Fill textareas mapped by ID
            if (data.entries) {
                Object.entries(data.entries).forEach(([id, text]) => {
                    const el = document.getElementById(id);
                    if (el) el.value = text;
                });
            }
        }
    } catch (e) {
        console.error("Load reflection error:", e);
    }
}

// Debounce helper could be good, but 'change' event is safe enough for now
async function saveReflection(uid, chapterNum, fieldId, text) {
    try {
        const refDoc = doc(db, "users", uid, "reflections", `chapter${chapterNum}`);
        // We store all fields in one doc for the chapter for simplicity
        // Need to merge
        await setDoc(refDoc, {
            chapterNumber: parseInt(chapterNum),
            entries: { [fieldId]: text },
            updatedAt: serverTimestamp()
        }, { merge: true });

        // Also mark as 'started' / progress?
        // Let's assume writing a reflection implies engagement.
    } catch (e) {
        console.error("Save reflection error:", e);
    }
}

// Auto-run if on chapter page
const path = window.location.pathname;
const match = path.match(/chapter(\d+)\.html/i);
if (match) {
    const num = match[1];
    markChapterVisit(num);
    initReflectionSync(num);
}

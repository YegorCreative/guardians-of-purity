// --- PRAYER JOURNEY LOGIC --- //
// Unified logic for 28-day prayer journey

let prayerData = [];

// Helper: Formatted date string "Mon 5"
function getFormattedDate(date) {
    const options = { month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// --- MAIN INIT ---
async function init() {
    // 1. Load Data
    try {
        const res = await fetch("./data/weeklyPrayer.json");
        const jsonData = await res.json();
        prayerData = jsonData[0];
    } catch (e) {
        console.error("Failed to load prayer data", e);
        return;
    }

    // 2. Journey State Check
    const storedStartDate = window.AppStorage.get("prayerJourneyStartDate");
    let journeyState = {
        started: false,
        startDate: null,
        currentDay: 0
    };

    if (storedStartDate) {
        const start = new Date(storedStartDate);
        start.setHours(0, 0, 0, 0);
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        const diffTime = now - start;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        journeyState.started = true;
        journeyState.startDate = start;
        journeyState.currentDay = diffDays + 1;
    }

    // 3. Render Controls (Start/Restart)
    renderJourneyControls(journeyState);

    // 4. Initialize Unified View
    initUnifiedView(journeyState);
}

// --- CONTROLS UI ---
function renderJourneyControls(state) {
    const cleanupId = "journey-controls-container";
    document.querySelectorAll(`#${cleanupId}`).forEach(el => el.remove());

    const container = document.createElement("div");
    container.id = cleanupId;
    container.className = "journey-controls-wrapper";

    const btn = document.createElement("button");
    btn.className = "journey-btn";

    if (state.started) {
        btn.textContent = "Restart Prayer Journey";
        btn.classList.add("secondary");
        btn.onclick = (e) => {
            e.preventDefault();
            showRestartConfirm(container);
        };
    } else {
        btn.textContent = "Start Prayer Journey";
        btn.classList.add("primary");
        btn.onclick = (e) => {
            e.preventDefault();
            showDatePicker(container);
        };
    }

    container.appendChild(btn);

    const subText = document.createElement("div");
    subText.textContent = "You are not praying alone — our team is praying with you.";
    subText.className = "journey-reassurance-text";
    container.appendChild(subText);

    // Inject into unified wrapper
    const targetWrapper = document.querySelector(".monthly_prayer_guide_wrapper");
    if (targetWrapper) {
        const card = targetWrapper.querySelector(".monthly_prayer_guide_card");
        if (card) targetWrapper.insertBefore(container, card);
    }
}

// Custom Restart Modal
function showRestartConfirm(parentContainer) {
    if (document.querySelector(".journey-modal-overlay")) return;

    const overlay = document.createElement("div");
    overlay.className = "journey-modal-overlay";

    const card = document.createElement("div");
    card.className = "journey-modal-card";

    const title = document.createElement("h3");
    title.textContent = "Restart Prayer Journey?";

    const desc = document.createElement("p");
    desc.textContent = "This will reset your progress.";

    const btnRow = document.createElement("div");
    btnRow.className = "journey-modal-actions";

    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = "Cancel";
    cancelBtn.className = "journey-modal-btn cancel";
    cancelBtn.onclick = () => overlay.remove();

    const confirmBtn = document.createElement("button");
    confirmBtn.textContent = "Restart";
    confirmBtn.className = "journey-modal-btn confirm";
    confirmBtn.onclick = () => {
        window.AppStorage.remove("prayerJourneyStartDate");
        location.reload();
    };

    btnRow.appendChild(cancelBtn);
    btnRow.appendChild(confirmBtn);

    card.appendChild(title);
    card.appendChild(desc);
    card.appendChild(btnRow);
    overlay.appendChild(card);

    document.body.appendChild(overlay);
}

// Custom Calendar Modal
function showDatePicker(parentContainer) {
    if (document.querySelector(".journey-modal-overlay")) return;

    const overlay = document.createElement("div");
    overlay.className = "journey-modal-overlay";

    const card = document.createElement("div");
    card.className = "journey-modal-card calendar-mode";

    const title = document.createElement("h3");
    title.textContent = "Select Start Date";

    const today = new Date();
    let currentViewDate = new Date(today.getFullYear(), today.getMonth(), 1);
    let selectedDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const calendarWrapper = document.createElement("div");
    calendarWrapper.className = "journey-calendar-wrapper";

    const header = document.createElement("div");
    header.className = "journey-calendar-header";

    const prevBtn = document.createElement("button");
    prevBtn.innerHTML = "&lt;";
    prevBtn.className = "journey-calendar-nav-btn";
    prevBtn.onclick = () => {
        currentViewDate.setMonth(currentViewDate.getMonth() - 1);
        renderCalendar();
    };

    const nextBtn = document.createElement("button");
    nextBtn.innerHTML = "&gt;";
    nextBtn.className = "journey-calendar-nav-btn";
    nextBtn.onclick = () => {
        currentViewDate.setMonth(currentViewDate.getMonth() + 1);
        renderCalendar();
    };

    const monthLabel = document.createElement("span");
    monthLabel.className = "journey-calendar-month-label";

    header.appendChild(prevBtn);
    header.appendChild(monthLabel);
    header.appendChild(nextBtn);

    const daysHeader = document.createElement("div");
    daysHeader.className = "journey-calendar-days-header";
    const days = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
    days.forEach(d => {
        const span = document.createElement("span");
        span.className = "journey-calendar-day-name";
        span.textContent = d;
        daysHeader.appendChild(span);
    });

    const grid = document.createElement("div");
    grid.className = "journey-calendar-grid";

    calendarWrapper.appendChild(header);
    calendarWrapper.appendChild(daysHeader);
    calendarWrapper.appendChild(grid);

    function renderCalendar() {
        grid.innerHTML = "";

        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        monthLabel.textContent = `${monthNames[currentViewDate.getMonth()]} ${currentViewDate.getFullYear()}`;

        const year = currentViewDate.getFullYear();
        const month = currentViewDate.getMonth();

        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let i = 0; i < firstDayOfMonth; i++) {
            const empty = document.createElement("div");
            empty.className = "journey-calendar-cell empty";
            grid.appendChild(empty);
        }

        for (let d = 1; d <= daysInMonth; d++) {
            const cell = document.createElement("button");
            cell.className = "journey-calendar-cell";
            cell.textContent = d;

            if (selectedDate.getDate() === d &&
                selectedDate.getMonth() === month &&
                selectedDate.getFullYear() === year) {
                cell.classList.add("selected");
            }

            if (today.getDate() === d &&
                today.getMonth() === month &&
                today.getFullYear() === year) {
                cell.classList.add("today");
            }

            cell.onclick = () => {
                selectedDate = new Date(year, month, d);
                renderCalendar();
            };

            grid.appendChild(cell);
        }
    }

    renderCalendar();

    const btnRow = document.createElement("div");
    btnRow.className = "journey-modal-actions";

    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = "Cancel";
    cancelBtn.className = "journey-modal-btn cancel";
    cancelBtn.onclick = () => overlay.remove();

    const startBtn = document.createElement("button");
    startBtn.textContent = "Start";
    startBtn.className = "journey-modal-btn confirm";
    startBtn.onclick = () => {
        const localDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
        window.AppStorage.set("prayerJourneyStartDate", localDate.toISOString());
        location.reload();
    };

    btnRow.appendChild(cancelBtn);
    btnRow.appendChild(startBtn);

    card.appendChild(title);
    card.appendChild(calendarWrapper);
    card.appendChild(btnRow);
    overlay.appendChild(card);

    document.body.appendChild(overlay);
}

// --- UNIFIED VIEW LOGIC ---
function initUnifiedView(state) {
    const unifiedCard = document.querySelector(".monthly_prayer_guide_card.unified");
    if (!unifiedCard) return;

    const weekBtns = Array.from(unifiedCard.querySelectorAll(".monthly_prayer_guide_week_item"));
    const daysContainer = unifiedCard.querySelector(".monthly_prayer_guide_days");

    const titleEl = document.getElementById("prayerTitle");
    const verseEl = document.getElementById("prayerVerse");
    const prayerDayEl = document.getElementById("prayerDay");
    const prayerTextEl = document.getElementById("prayerText");

    let activeWeekIdx = 0;
    let activeDayIdx = 0;
    let dayBtns = [];

    // Determine Initial View
    if (state.started) {
        if (state.currentDay >= 1 && state.currentDay <= 28) {
            activeWeekIdx = Math.floor((state.currentDay - 1) / 7);
            activeDayIdx = (state.currentDay - 1) % 7;
        } else if (state.currentDay > 28) {
            activeWeekIdx = 3;
            activeDayIdx = 6;
        }
    }

    // KEYBOARD: Week Tabs
    weekBtns.forEach((btn, idx) => {
        btn.addEventListener("click", () => {
            activeWeekIdx = idx;
            activeDayIdx = 0; // reset to first day of that week
            renderState();
        });

        btn.addEventListener("keydown", (e) => {
            let nextIdx = idx;
            if (e.key === "ArrowRight") {
                nextIdx = (idx + 1) % weekBtns.length;
            } else if (e.key === "ArrowLeft") {
                nextIdx = (idx - 1 + weekBtns.length) % weekBtns.length;
            } else if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                btn.click();
                return;
            }

            if (nextIdx !== idx) {
                weekBtns[nextIdx].focus();
                weekBtns[nextIdx].click();
            }
        });
    });

    function initDays() {
        daysContainer.innerHTML = "";
        dayBtns = [];
        for (let i = 0; i < 7; i++) {
            const btn = document.createElement("button");
            btn.className = "monthly_prayer_guide_day_item flex-center";
            btn.setAttribute("role", "tab");
            btn.setAttribute("aria-selected", "false");
            btn.tabIndex = -1;

            daysContainer.appendChild(btn);
            dayBtns.push(btn);

            btn.addEventListener("click", () => {
                if (!btn.classList.contains("locked")) {
                    activeDayIdx = i;
                    renderState();
                }
            });

            btn.addEventListener("keydown", (e) => {
                let nextIdx = i;
                if (e.key === "ArrowDown") {
                    nextIdx = Math.min(dayBtns.length - 1, i + 1);
                } else if (e.key === "ArrowUp") {
                    nextIdx = Math.max(0, i - 1);
                } else if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    btn.click();
                    return;
                }

                if (nextIdx !== i && !dayBtns[nextIdx].classList.contains("locked")) {
                    e.preventDefault();
                    dayBtns[nextIdx].focus();
                    dayBtns[nextIdx].click();
                }
            });
        }
    }

    initDays();

    function renderState() {
        // 1. Update Weeks UI & A11y
        weekBtns.forEach((btn, idx) => {
            const isActive = (idx === activeWeekIdx);
            btn.classList.toggle("active", isActive);
            btn.setAttribute("aria-selected", isActive ? "true" : "false");
            btn.tabIndex = isActive ? 0 : -1;
        });

        // 2. Update Days
        dayBtns.forEach((btn, dayRelIdx) => {
            const absoluteDayNum = (activeWeekIdx * 7) + (dayRelIdx + 1);
            let layoutText = `Day ${absoluteDayNum}`;

            let isLocked = false;
            if (state.started && state.startDate) {
                const dayDate = new Date(state.startDate);
                dayDate.setDate(state.startDate.getDate() + (absoluteDayNum - 1));
                layoutText += ` | ${getFormattedDate(dayDate)}`;

                const today = new Date(); today.setHours(0, 0, 0, 0);
                const dDate = new Date(dayDate); dDate.setHours(0, 0, 0, 0);

                if (today.getTime() === dDate.getTime()) btn.classList.add("today");
                else btn.classList.remove("today");

                if (absoluteDayNum > state.currentDay) {
                    isLocked = true;
                }
            } else {
                btn.classList.remove("today");
            }

            btn.textContent = layoutText;
            btn.classList.remove("locked", "active");

            const isActive = (dayRelIdx === activeDayIdx);

            if (isLocked) {
                btn.classList.add("locked");
                btn.setAttribute("aria-selected", "false");
                btn.tabIndex = -1;
            } else {
                btn.classList.toggle("active", isActive);
                btn.setAttribute("aria-selected", isActive ? "true" : "false");
                btn.tabIndex = isActive ? 0 : -1;
            }
        });

        // 3. Update Content Details
        const wKeys = ["first_week", "second_week", "third_week", "fourth_week"];
        const key = wKeys[activeWeekIdx];
        const data = prayerData[key] ? prayerData[key][activeDayIdx] : null;

        if (data) {
            const absDay = (activeWeekIdx * 7) + (activeDayIdx + 1);
            prayerDayEl.textContent = `DAY ${absDay}`;
            titleEl.textContent = data.title;
            verseEl.innerHTML = `<span class="verse-label">Scripture</span>${data.verse}`;
            prayerTextEl.innerHTML = `<span class="prayer-body-label">Prayer</span>${data.prayer}`;

            // Micro-interaction: replay content fade
            const cardWrap = unifiedCard.querySelector(".thirty_one_day_card_wrapper");
            if (cardWrap) {
                cardWrap.classList.remove("content-enter");
                void cardWrap.offsetWidth; // force reflow
                cardWrap.classList.add("content-enter");
            }
        }
    }

    renderState();
}

document.addEventListener("DOMContentLoaded", init);

document.addEventListener("DOMContentLoaded", init);

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

    // 1. Main Action Button
    const btn = document.createElement("button");
    btn.className = "journey-btn"; // Base class

    if (state.started) {
        btn.textContent = "Restart Prayer Journey";
        btn.classList.add("secondary"); // Ghost/Secondary style
        btn.onclick = (e) => {
            e.preventDefault();
            showRestartConfirm(container);
        };
    } else {
        btn.textContent = "Start Prayer Journey";
        btn.classList.add("primary"); // Gradient pill style
        btn.onclick = (e) => {
            e.preventDefault();
            showDatePicker(container);
        };
    }

    container.appendChild(btn);

    // 2. Reassurance Text
    const subText = document.createElement("div");
    subText.textContent = "You are not praying alone — our team is praying with you.";
    subText.className = "journey-reassurance-text";
    container.appendChild(subText);

    // Inject Unified
    const target = document.querySelector(".monthly_prayer_guide_wrapper .monthly_prayer_guide_wrapper");
    if (target) {
        const card = target.querySelector(".monthly_prayer_guide_card");
        if (card) target.insertBefore(container, card);
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

    // Append to body to cover everything
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

    // State
    const today = new Date();
    let currentViewDate = new Date(today.getFullYear(), today.getMonth(), 1);
    let selectedDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    // Calendar Container
    const calendarWrapper = document.createElement("div");
    calendarWrapper.className = "journey-calendar-wrapper";

    // Header (Month + Nav)
    const header = document.createElement("div");
    header.className = "journey-calendar-header";

    const prevBtn = document.createElement("button");
    prevBtn.innerHTML = "&lt;"; // < symbol
    prevBtn.className = "journey-calendar-nav-btn";
    prevBtn.onclick = () => {
        currentViewDate.setMonth(currentViewDate.getMonth() - 1);
        renderCalendar();
    };

    const nextBtn = document.createElement("button");
    nextBtn.innerHTML = "&gt;"; // > symbol
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

    // Days Header (Sun, Mon...)
    const daysHeader = document.createElement("div");
    daysHeader.className = "journey-calendar-days-header";
    const days = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
    days.forEach(d => {
        const span = document.createElement("span");
        span.className = "journey-calendar-day-name";
        span.textContent = d;
        daysHeader.appendChild(span);
    });

    // Days Grid
    const grid = document.createElement("div");
    grid.className = "journey-calendar-grid";

    calendarWrapper.appendChild(header);
    calendarWrapper.appendChild(daysHeader);
    calendarWrapper.appendChild(grid);

    // Render Logic
    function renderCalendar() {
        grid.innerHTML = "";

        // Update Label
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        monthLabel.textContent = `${monthNames[currentViewDate.getMonth()]} ${currentViewDate.getFullYear()}`;

        const year = currentViewDate.getFullYear();
        const month = currentViewDate.getMonth();

        const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 (Sun) to 6 (Sat)
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Empty slots for offset
        for (let i = 0; i < firstDayOfMonth; i++) {
            const empty = document.createElement("div");
            empty.className = "journey-calendar-cell empty";
            grid.appendChild(empty);
        }

        // Day Cells
        for (let d = 1; d <= daysInMonth; d++) {
            const cell = document.createElement("button");
            cell.className = "journey-calendar-cell";
            cell.textContent = d;

            // Check if this cell is the selected date
            if (selectedDate.getDate() === d &&
                selectedDate.getMonth() === month &&
                selectedDate.getFullYear() === year) {
                cell.classList.add("selected");
            }

            // Check if Today
            if (today.getDate() === d &&
                today.getMonth() === month &&
                today.getFullYear() === year) {
                cell.classList.add("today");
            }

            cell.onclick = () => {
                selectedDate = new Date(year, month, d);
                renderCalendar(); // Re-render to update selection style
            };

            grid.appendChild(cell);
        }
    }

    // Initial Render
    renderCalendar();

    // Modal Actions
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
        // Use selectedDate state
        const localDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
        window.AppStorage.set("prayerJourneyStartDate", localDate.toISOString());
        location.reload();
    };

    btnRow.appendChild(cancelBtn);
    btnRow.appendChild(startBtn);

    card.appendChild(title);
    card.appendChild(calendarWrapper); // Replaces input
    card.appendChild(btnRow);
    overlay.appendChild(card);

    document.body.appendChild(overlay);
}

// --- UNIFIED VIEW LOGIC ---
function initUnifiedView(state) {
    const wrapper = document.querySelector(".monthly_prayer_guide_card.unified");
    if (!wrapper) return;

    const weekBtns = Array.from(wrapper.querySelectorAll(".monthly_prayer_guide_week_item"));
    const daysContainer = wrapper.querySelector(".monthly_prayer_guide_days");

    const titleEl = document.getElementById("prayerTitle");
    const verseEl = document.getElementById("prayerVerse");
    const prayerDayEl = document.getElementById("prayerDay");
    const prayerTextEl = document.getElementById("prayerText");

    let activeWeekIdx = 0;
    let activeDayIdx = 0;

    // Navigation Logic: Determine Initial View
    if (state.started) {
        if (state.currentDay >= 1 && state.currentDay <= 28) {
            activeWeekIdx = Math.floor((state.currentDay - 1) / 7);
            activeDayIdx = (state.currentDay - 1) % 7;
        } else if (state.currentDay > 28) {
            activeWeekIdx = 3;
            activeDayIdx = 6;
        }
    }

    // Keyboard Navigation: Week Tabs
    weekBtns.forEach((btn, idx) => {
        btn.addEventListener("click", () => {
            activeWeekIdx = idx;
            activeDayIdx = 0;
            renderState();

            // Focus shift when switching weeks
            const days = Array.from(daysContainer.querySelectorAll(".monthly_prayer_guide_day_item:not(.locked)"));
            if (days.length > 0) {
                days[0].focus();
            }
        });

        btn.addEventListener("keydown", (e) => {
            let newIdx = idx;
            if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                newIdx = (idx - 1 + weekBtns.length) % weekBtns.length;
                e.preventDefault();
                weekBtns[newIdx].focus();
            } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                newIdx = (idx + 1) % weekBtns.length;
                e.preventDefault();
                weekBtns[newIdx].focus();
            } else if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                btn.click();
            }
        });
    });

    function renderState() {
        // Update Week Tabs
        weekBtns.forEach((btn, idx) => {
            const isActive = idx === activeWeekIdx;
            btn.classList.toggle("active", isActive);
            btn.setAttribute("aria-selected", isActive ? "true" : "false");
            btn.setAttribute("tabindex", isActive ? "0" : "-1");
        });

        // Render Days
        daysContainer.innerHTML = "";
        const dayItems = [];

        for (let dayRelIdx = 0; dayRelIdx < 7; dayRelIdx++) {
            const btn = document.createElement("button");
            btn.className = "monthly_prayer_guide_day_item flex-center";
            btn.setAttribute("role", "tab");

            const absoluteDayNum = (activeWeekIdx * 7) + (dayRelIdx + 1);
            let layoutText = `Day ${absoluteDayNum}`;

            if (state.started && state.startDate) {
                const dayDate = new Date(state.startDate);
                dayDate.setDate(state.startDate.getDate() + (absoluteDayNum - 1));
                layoutText += ` | ${getFormattedDate(dayDate)}`;

                const today = new Date(); today.setHours(0, 0, 0, 0);
                const dDate = new Date(dayDate); dDate.setHours(0, 0, 0, 0);

                if (today.getTime() === dDate.getTime()) btn.classList.add("today");
            }

            btn.textContent = layoutText;

            if (state.started && absoluteDayNum > state.currentDay) {
                btn.classList.add("locked");
                btn.setAttribute("aria-disabled", "true");
                btn.setAttribute("tabindex", "-1");
            } else {
                const isActive = (dayRelIdx === activeDayIdx);
                if (isActive) btn.classList.add("active");
                btn.setAttribute("aria-selected", isActive ? "true" : "false");
                btn.setAttribute("tabindex", isActive ? "0" : "-1");

                btn.onclick = () => {
                    activeDayIdx = dayRelIdx;
                    renderState();
                };
            }

            daysContainer.appendChild(btn);
            dayItems.push(btn);
        }

        // Keyboard Navigation: Day Tabs
        dayItems.forEach((btn, idx) => {
            if (btn.classList.contains("locked")) return;

            btn.addEventListener("keydown", (e) => {
                let nextIdx = idx;
                if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
                    nextIdx = idx - 1;
                } else if (e.key === "ArrowDown" || e.key === "ArrowRight") {
                    nextIdx = idx + 1;
                } else if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    btn.click();
                    return;
                } else {
                    return;
                }

                e.preventDefault();

                while (nextIdx >= 0 && nextIdx < dayItems.length) {
                    if (!dayItems[nextIdx].classList.contains("locked")) {
                        dayItems[nextIdx].focus();
                        break;
                    }
                    nextIdx += (e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : -1);
                }
            });
        });

        // Update Content
        const wKeys = ["first_week", "second_week", "third_week", "fourth_week"];
        const key = wKeys[activeWeekIdx];
        const data = prayerData[key] ? prayerData[key][activeDayIdx] : null;

        if (data) {
            const absDay = (activeWeekIdx * 7) + (activeDayIdx + 1);
            prayerDayEl.textContent = `DAY ${absDay}`;
            titleEl.textContent = data.title;
            verseEl.innerHTML = `<span style="display:block; font-size: 0.8em; margin-bottom: 5px; text-transform:uppercase; letter-spacing:1px; opacity:0.7;">Scripture</span>${data.verse}`;
            prayerTextEl.textContent = data.prayer;
        }
    }

    renderState();
}

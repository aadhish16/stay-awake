let lastActivityTime;
let inactivityLimit = 5 * 60 * 1000; // Default: 5 minutes
let remainingTime = inactivityLimit;
let trackingInterval;
let isTracking = false;
const alarm = document.getElementById("alarm");
const status = document.getElementById("status");
const timerDisplay = document.getElementById("timer");
const body = document.body;

// Reset activity timer
function resetTimer() {
    if (isTracking) {
        lastActivityTime = Date.now();
        updateTimerDisplay(inactivityLimit);
        status.innerText = "Tracking your activity...";
        status.style.color = "#fff";
        stopBlinking();
    }
}

// Update timer display
function updateTimerDisplay(timeLeft) {
    const minutes = Math.floor(timeLeft / 60000);
    const seconds = Math.floor((timeLeft % 60000) / 1000);
    timerDisplay.innerText = `Time Remaining: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// Check inactivity
function checkInactivity() {
    const elapsedTime = Date.now() - lastActivityTime;
    remainingTime = inactivityLimit - elapsedTime;

    if (remainingTime <= 0) {
        status.innerText = "Inactivity detected! Playing alarm...";
        status.style.color = "red";
        startBlinking();
        alarm.play();
        resetTimer(); // Reset timer to avoid repeated alarms
    } else {
        updateTimerDisplay(remainingTime);
    }
}

// Start blinking effect
function startBlinking() {
    body.style.animation = "blinking 0.5s infinite";
}

// Stop blinking effect
function stopBlinking() {
    body.style.animation = "none";
}

// Start tracking activity
function startTracking() {
    const minutes = document.getElementById("interval").value;
    if (minutes && minutes > 0) {
        inactivityLimit = minutes * 60 * 1000;
        alert(`Inactivity timer set to ${minutes} minutes.`);
    } else {
        inactivityLimit = 5 * 60 * 1000; // Default 5 minutes
    }

    lastActivityTime = Date.now();
    remainingTime = inactivityLimit;
    isTracking = true;
    updateTimerDisplay(inactivityLimit);

    if (!trackingInterval) {
        trackingInterval = setInterval(checkInactivity, 1000);
    }

    status.innerText = "Tracking your activity...";
    status.style.color = "#fff";
}

// Stop tracking activity
function stopTracking() {
    isTracking = false;
    clearInterval(trackingInterval);
    trackingInterval = null;
    status.innerText = "Tracking stopped.";
    status.style.color = "yellow";
    stopBlinking();
    timerDisplay.innerText = "Time Remaining: --:--";
}

// Resume tracking activity
function resumeTracking() {
    if (!isTracking) {
        isTracking = true;
        lastActivityTime = Date.now() - (inactivityLimit - remainingTime); // Adjust last activity time
        if (!trackingInterval) {
            trackingInterval = setInterval(checkInactivity, 1000);
        }
        status.innerText = "Resumed tracking your activity...";
        status.style.color = "#fff";
    }
}

// Detect user activity
document.addEventListener("mousemove", resetTimer);
document.addEventListener("keydown", resetTimer);

// HotSeat Selection Wheel Logic

let students = [];
let startAngle = 0;
let arc = 0;
let spinTimeout = null;
let spinAngleStart = 10;
let spinTime = 0;
let spinTimeTotal = 0;
let ctx = null;

const spinBtn = document.getElementById('spinBtn');
const wheelResultSpan = document.querySelector('#wheelResult span');
const canvas = document.getElementById('wheelCanvas');

if (canvas) {
    ctx = canvas.getContext('2d');
    initWheel();
}

async function initWheel() {
    try {
        const response = await fetch('/api/students');
        students = await response.json();
        
        if (students.length === 0) {
            // Render dummy segments if no students registered
            students = [
                { name: 'Camp Guide 1' },
                { name: 'Camp Guide 2' },
                { name: 'Guest User' }
            ];
            showToast("No active students found. Showing demo wheel.", "info");
        }
        
        arc = Math.PI / (students.length / 2);
        drawWheel();
        
        if (spinBtn) {
            spinBtn.addEventListener('click', spin);
        }
    } catch (err) {
        console.error("Failed to load students for wheel", err);
        showToast("Error loading student wheel data", "error");
    }
}

// Generate beautiful HSL colors dynamically
function getColor(index, total) {
    const h = Math.round((360 / total) * index);
    return `hsl(${h}, 70%, 45%)`;
}

function drawWheel() {
    if (!ctx || !canvas) return;
    
    const width = canvas.width;
    const height = canvas.height;
    const outsideRadius = width / 2 - 10;
    const textRadius = outsideRadius - 50;
    const insideRadius = 30;
    
    ctx.clearRect(0, 0, width, height);
    
    ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
    ctx.lineWidth = 2;
    ctx.font = 'bold 12px "Outfit", sans-serif';
    
    for (let i = 0; i < students.length; i++) {
        const angle = startAngle + i * arc;
        ctx.fillStyle = getColor(i, students.length);
        
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, outsideRadius, angle, angle + arc, false);
        ctx.arc(width / 2, height / 2, insideRadius, angle + arc, angle, true);
        ctx.stroke();
        ctx.fill();
        
        ctx.save();
        ctx.shadowOffsetX = -1;
        ctx.shadowOffsetY = -1;
        ctx.shadowBlur = 0;
        ctx.fillStyle = "#FFFFFF";
        ctx.translate(width / 2 + Math.cos(angle + arc / 2) * textRadius, 
                      height / 2 + Math.sin(angle + arc / 2) * textRadius);
        ctx.rotate(angle + arc / 2 + Math.PI / 2);
        
        const text = students[i].name;
        // Truncate if name is too long
        const displayName = text.length > 12 ? text.substring(0, 10) + '..' : text;
        ctx.fillText(displayName, -ctx.measureText(displayName).width / 2, 0);
        ctx.restore();
    }
    
    // Draw Center Circle
    ctx.fillStyle = "#1e2937";
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, insideRadius, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
    ctx.stroke();
    
    // Draw Center Ring Inner
    ctx.fillStyle = "#8b5cf6";
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, 10, 0, Math.PI * 2, false);
    ctx.fill();
}

function spin() {
    if (spinBtn.disabled) return;
    spinBtn.disabled = true;
    wheelResultSpan.style.display = 'none';
    
    spinAngleStart = Math.random() * 10 + 10;
    spinTime = 0;
    spinTimeTotal = Math.random() * 3000 + 4000; // 4 to 7 seconds spin
    rotateWheel();
}

function rotateWheel() {
    spinTime += 30;
    if (spinTime >= spinTimeTotal) {
        stopRotateWheel();
        return;
    }
    const spinAngle = spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
    startAngle += (spinAngle * Math.PI / 180);
    drawWheel();
    requestAnimationFrame(rotateWheel);
}

function stopRotateWheel() {
    spinBtn.disabled = false;
    
    const width = canvas.width;
    const height = canvas.height;
    
    // Calculations for winner matching pointer at top (12 o'clock / -Math.PI / 2 radians)
    const degrees = startAngle * 180 / Math.PI + 90;
    const arcd = arc * 180 / Math.PI;
    const index = Math.floor((360 - (degrees % 360)) / arcd);
    
    const winnerIdx = (index + students.length) % students.length;
    const winner = students[winnerIdx];
    
    // Show winner
    wheelResultSpan.innerText = winner.name;
    wheelResultSpan.style.display = 'inline-block';
    
    showToast(`Congrats to ${winner.name}! You are in the HotSeat!`, 'success');
}

function easeOut(t, b, c, d) {
    const ts = (t /= d) * t;
    const tc = ts * t;
    return b + c * (tc + -3 * ts + 3 * t);
}

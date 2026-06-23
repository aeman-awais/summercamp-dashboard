// Leaderboard Dynamically Loaded Scoring Logic

document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('leaderboardBody');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    if (!tableBody) return; // Exit if not on leaderboard page
    
    loadLeaderboard(''); // Load all by default
    
    // Wire up filter click actions
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active states
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const level = btn.dataset.level || '';
            loadLeaderboard(level);
        });
    });
});

async function loadLeaderboard(level) {
    const tableBody = document.getElementById('leaderboardBody');
    tableBody.innerHTML = `
        <tr>
            <td colspan="4" style="text-align: center; color: var(--text-secondary); padding: 40px 0;">
                <i class="fas fa-spinner fa-spin" style="margin-right: 8px;"></i> Loading Scores...
            </td>
        </tr>
    `;
    
    try {
        const response = await fetch(`/api/leaderboard?level=${level}`);
        const data = await response.json();
        
        tableBody.innerHTML = '';
        
        if (data.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="4">
                        <div class="empty-leaderboard">
                            <i class="fas fa-trophy"></i>
                            <p>No students have registered in this category yet!</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }
        
        data.forEach((student, index) => {
            const rank = index + 1;
            
            // Build Rank Badge HTML
            let rankHtml = '';
            if (rank === 1) {
                rankHtml = `<span class="rank-badge rank-1"><i class="fas fa-crown"></i></span>`;
            } else if (rank === 2) {
                rankHtml = `<span class="rank-badge rank-2">2</span>`;
            } else if (rank === 3) {
                rankHtml = `<span class="rank-badge rank-3">3</span>`;
            } else {
                rankHtml = `<span class="rank-badge rank-normal">${rank}</span>`;
            }
            
            // Build Level Badge HTML
            const lvl = student.level.toLowerCase();
            const levelHtml = `<span class="level-badge level-${lvl}">${student.level}</span>`;
            
            // Get Student Avatar Initials
            const initials = student.name ? student.name.substring(0, 2).toUpperCase() : 'ST';
            
            const row = document.createElement('tr');
            row.className = 'leaderboard-row';
            row.innerHTML = `
                <td style="width: 80px;">${rankHtml}</td>
                <td>
                    <div class="student-meta">
                        <div class="student-avatar">${initials}</div>
                        <span class="student-name">${student.name}</span>
                    </div>
                </td>
                <td>${levelHtml}</td>
                <td class="points-val text-right">${student.total_score} pts</td>
            `;
            tableBody.appendChild(row);
        });
        
    } catch (err) {
        console.error("Failed to load leaderboard data", err);
        tableBody.innerHTML = `
            <tr>
                <td colspan="4" style="text-align: center; color: var(--danger); padding: 40px 0;">
                    <i class="fas fa-exclamation-triangle" style="margin-right: 8px;"></i> Error loading leaderboard data.
                </td>
            </tr>
        `;
    }
}

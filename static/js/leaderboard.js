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
        const podiumContainer = document.getElementById('podiumContainer');
        if (podiumContainer) podiumContainer.innerHTML = '';
        
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
        
        // Split data into top 3 (podium) and rest (table)
        const podiumData = data.slice(0, 3);
        const tableData = data.slice(3);
        
        // Render Podium
        if (podiumContainer && podiumData.length > 0) {
            // Helper to get initials
            const getInitials = (name) => name ? name.substring(0, 2).toUpperCase() : 'ST';
            
            // We want to render columns: 2nd place, 1st place, 3rd place
            const first = podiumData[0];
            const second = podiumData[1];
            const third = podiumData[2];
            
            let podiumHtml = '';
            
            // 2nd Place column (left)
            if (second) {
                podiumHtml += `
                    <div class="podium-column second">
                        <div class="podium-avatar-wrapper">
                            <div class="podium-avatar">${getInitials(second.name)}</div>
                            <span class="podium-badge">2nd</span>
                        </div>
                        <div class="podium-name" title="${second.name}">${second.name}</div>
                        <span class="level-badge level-${second.level.toLowerCase()}" style="font-size: 0.65rem; padding: 2px 8px; margin-bottom: 8px;">${second.level}</span>
                        <div class="podium-points">${second.total_score} pts</div>
                    </div>
                `;
            }
            
            // 1st Place column (middle)
            if (first) {
                podiumHtml += `
                    <div class="podium-column first">
                        <div class="podium-avatar-wrapper">
                            <i class="fas fa-crown podium-crown" style="color: #fbbf24;"></i>
                            <div class="podium-avatar">${getInitials(first.name)}</div>
                            <span class="podium-badge">1st</span>
                        </div>
                        <div class="podium-name" title="${first.name}">${first.name}</div>
                        <span class="level-badge level-${first.level.toLowerCase()}" style="font-size: 0.65rem; padding: 2px 8px; margin-bottom: 8px;">${first.level}</span>
                        <div class="podium-points">${first.total_score} pts</div>
                    </div>
                `;
            }
            
            // 3rd Place column (right)
            if (third) {
                podiumHtml += `
                    <div class="podium-column third">
                        <div class="podium-avatar-wrapper">
                            <div class="podium-avatar">${getInitials(third.name)}</div>
                            <span class="podium-badge">3rd</span>
                        </div>
                        <div class="podium-name" title="${third.name}">${third.name}</div>
                        <span class="level-badge level-${third.level.toLowerCase()}" style="font-size: 0.65rem; padding: 2px 8px; margin-bottom: 8px;">${third.level}</span>
                        <div class="podium-points">${third.total_score} pts</div>
                    </div>
                `;
            }
            
            podiumContainer.innerHTML = podiumHtml;
        }
        
        // Render remaining list in the table
        if (tableData.length === 0 && podiumData.length > 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="4" style="text-align: center; color: var(--text-muted); padding: 24px 0; font-size: 0.9rem;">
                        <i class="fas fa-medal" style="margin-right: 6px;"></i> All other campers rank on the podium!
                    </td>
                </tr>
            `;
            return;
        }
        
        tableData.forEach((student, index) => {
            const rank = index + 4; // Because top 3 are on the podium
            
            // Build Rank Badge HTML
            const rankHtml = `<span class="rank-badge rank-normal">${rank}</span>`;
            
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
                <td class="points-val" style="text-align: right;">${student.total_score} pts</td>
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

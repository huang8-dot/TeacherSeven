class LeaderboardManager {
    constructor() {
        this.games = [];
        this.currentFilter = 'score';
        this.initializeElements();
        this.loadGameData();
        this.setupEventListeners();
        this.updateUI();
    }

    initializeElements() {
        this.totalGamesEl = document.getElementById('totalGames');
        this.avgSurvivalTimeEl = document.getElementById('avgSurvivalTime');
        this.totalCoinsEl = document.getElementById('totalCoins');
        this.totalEPEl = document.getElementById('totalEP');
        this.scoreLeaderboardEl = document.getElementById('scoreLeaderboard');
        this.highestScoreEl = document.getElementById('highestScore');
        this.longestSurvivalEl = document.getElementById('longestSurvival');
        this.mostCoinsEl = document.getElementById('mostCoins');
        this.mostEPEl = document.getElementById('mostEP');
        this.totalZombiesDefeatedEl = document.getElementById('totalZombiesDefeated');
        this.totalItemsCollectedEl = document.getElementById('totalItemsCollected');
        this.recentGamesEl = document.getElementById('recentGames');
    }

    loadGameData() {
        const savedGames = localStorage.getItem('zombieEnhancementGames');
        if (savedGames) {
            try {
                this.games = JSON.parse(savedGames);
            } catch (e) {
                console.error('Failed to load game data:', e);
                this.games = [];
            }
        }
    }

    setupEventListeners() {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.filter;
                this.updateLeaderboard();
            });
        });
    }

    updateUI() {
        this.updateStatsOverview();
        this.updateLeaderboard();
        this.updatePersonalRecords();
        this.updateRecentGames();
    }

    updateStatsOverview() {
        const totalGames = this.games.length;
        const totalTime = this.games.reduce((sum, game) => sum + game.time, 0);
        const totalCoins = this.games.reduce((sum, game) => sum + game.coins, 0);
        const totalEP = this.games.reduce((sum, game) => sum + game.ep, 0);

        this.totalGamesEl.textContent = totalGames;
        this.avgSurvivalTimeEl.textContent = totalGames > 0 ? this.formatTime(Math.floor(totalTime / totalGames)) : '00:00';
        this.totalCoinsEl.textContent = totalCoins;
        this.totalEPEl.textContent = totalEP;
    }

    updateLeaderboard() {
        const sortedGames = [...this.games].sort((a, b) => {
            switch (this.currentFilter) {
                case 'score':
                    return b.score - a.score;
                case 'time':
                    return b.time - a.time;
                case 'coins':
                    return b.coins - a.coins;
                default:
                    return 0;
            }
        });

        const topGames = sortedGames.slice(0, 10);

        this.scoreLeaderboardEl.innerHTML = topGames.map((game, index) => {
            const rank = index + 1;
            const rankClass = rank <= 3 ? `rank-${rank}` : '';
            const playerName = `Player ${rank}`;
            
            return `
                <div class="leaderboard-item">
                    <div class="rank ${rankClass}">${rank}</div>
                    <div class="player-info">
                        <div class="player-name">${playerName}</div>
                        <div class="player-stats">
                            <span class="stat">🏆 ${game.score}</span>
                            <span class="stat">⏱️ ${this.formatTime(game.time)}</span>
                            <span class="stat">💰 ${game.coins}</span>
                        </div>
                    </div>
                    <div class="player-score">${this.getFilterValue(game)}</div>
                </div>
            `;
        }).join('');

        if (topGames.length === 0) {
            this.scoreLeaderboardEl.innerHTML = `
                <div class="leaderboard-item" style="justify-content: center; color: #95a5a6;">
                    暂无游戏记录 No games recorded
                </div>
            `;
        }
    }

    getFilterValue(game) {
        switch (this.currentFilter) {
            case 'score':
                return game.score;
            case 'time':
                return this.formatTime(game.time);
            case 'coins':
                return game.coins;
            default:
                return 0;
        }
    }

    updatePersonalRecords() {
        if (this.games.length === 0) {
            this.highestScoreEl.textContent = '0';
            this.longestSurvivalEl.textContent = '00:00';
            this.mostCoinsEl.textContent = '0';
            this.mostEPEl.textContent = '0';
            this.totalZombiesDefeatedEl.textContent = '0';
            this.totalItemsCollectedEl.textContent = '0';
            return;
        }

        const highestScore = Math.max(...this.games.map(g => g.score));
        const longestSurvival = Math.max(...this.games.map(g => g.time));
        const mostCoins = Math.max(...this.games.map(g => g.coins));
        const mostEP = Math.max(...this.games.map(g => g.ep));
        const totalZombiesDefeated = this.games.reduce((sum, g) => sum + (g.stats?.zombiesDefeated || 0), 0);
        const totalItemsCollected = this.games.reduce((sum, g) => sum + (g.stats?.itemsCollected || 0), 0);

        this.highestScoreEl.textContent = highestScore;
        this.longestSurvivalEl.textContent = this.formatTime(longestSurvival);
        this.mostCoinsEl.textContent = mostCoins;
        this.mostEPEl.textContent = mostEP;
        this.totalZombiesDefeatedEl.textContent = totalZombiesDefeated;
        this.totalItemsCollectedEl.textContent = totalItemsCollected;
    }

    updateRecentGames() {
        const recentGames = [...this.games]
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, 10);

        this.recentGamesEl.innerHTML = recentGames.map(game => {
            const date = new Date(game.timestamp);
            const formattedDate = date.toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });

            return `
                <div class="recent-game-item">
                    <div class="game-date">${formattedDate}</div>
                    <div class="game-stats">
                        <span class="game-stat">🏆 ${game.score}</span>
                        <span class="game-stat">⏱️ ${this.formatTime(game.time)}</span>
                        <span class="game-stat">💰 ${game.coins}</span>
                        <span class="game-stat">🧟 ${game.ep} EP</span>
                    </div>
                </div>
            `;
        }).join('');

        if (recentGames.length === 0) {
            this.recentGamesEl.innerHTML = `
                <div class="recent-game-item" style="justify-content: center; color: #95a5a6;">
                    暂无游戏记录 No games recorded
                </div>
            `;
        }
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    showToast(message, type = 'neutral') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = `toast active ${type}`;
        
        setTimeout(() => {
            toast.classList.remove('active');
        }, 3000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const leaderboard = new LeaderboardManager();
});
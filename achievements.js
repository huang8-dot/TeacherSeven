class AchievementManager {
    constructor() {
        this.achievements = [];
        this.unlockedAchievements = [];
        this.currentFilter = 'all';
        this.initializeElements();
        this.loadAchievements();
        this.loadUnlockedAchievements();
        this.setupEventListeners();
        this.updateUI();
    }

    initializeElements() {
        this.totalAchievementsEl = document.getElementById('totalAchievements');
        this.maxAchievementsEl = document.getElementById('maxAchievements');
        this.completionRateEl = document.getElementById('completionRate');
        this.rareAchievementsEl = document.getElementById('rareAchievements');
        this.recentlyUnlockedEl = document.getElementById('recentlyUnlocked');
        this.combatAchievementsEl = document.getElementById('combatAchievements');
        this.explorationAchievementsEl = document.getElementById('explorationAchievements');
        this.survivalAchievementsEl = document.getElementById('survivalAchievements');
        this.specialAchievementsEl = document.getElementById('specialAchievements');
        this.recentUnlocksEl = document.getElementById('recentUnlocks');
        this.achievementModal = document.getElementById('achievementModal');
        this.closeModalBtn = document.getElementById('closeModalBtn');
    }

    loadAchievements() {
        this.achievements = [
            {
                id: 'first_blood',
                category: 'combat',
                name: '初次击杀 First Blood',
                description: '击败第一个僵尸 Defeat your first zombie',
                icon: '⚔️',
                rarity: 'common',
                progress: { current: 0, target: 1 },
                rewards: [{ type: 'coins', amount: 50 }],
                unlocked: false
            },
            {
                id: 'zombie_hunter',
                category: 'combat',
                name: '僵尸猎人 Zombie Hunter',
                description: '击败10个僵尸 Defeat 10 zombies',
                icon: '🎯',
                rarity: 'uncommon',
                progress: { current: 0, target: 10 },
                rewards: [{ type: 'coins', amount: 100 }],
                unlocked: false
            },
            {
                id: 'zombie_slayer',
                category: 'combat',
                name: '僵尸杀手 Zombie Slayer',
                description: '击败50个僵尸 Defeat 50 zombies',
                icon: '💀',
                rarity: 'rare',
                progress: { current: 0, target: 50 },
                rewards: [{ type: 'coins', amount: 200 }],
                unlocked: false
            },
            {
                id: 'zombie_master',
                category: 'combat',
                name: '僵尸大师 Zombie Master',
                description: '击败100个僵尸 Defeat 100 zombies',
                icon: '👑',
                rarity: 'epic',
                progress: { current: 0, target: 100 },
                rewards: [{ type: 'coins', amount: 500 }],
                unlocked: false
            },
            {
                id: 'explorer',
                category: 'exploration',
                name: '探索者 Explorer',
                description: '收集10个道具 Collect 10 items',
                icon: '🗺️',
                rarity: 'common',
                progress: { current: 0, target: 10 },
                rewards: [{ type: 'coins', amount: 50 }],
                unlocked: false
            },
            {
                id: 'treasure_hunter',
                category: 'exploration',
                name: '宝藏猎人 Treasure Hunter',
                description: '收集50个道具 Collect 50 items',
                icon: '💎',
                rarity: 'uncommon',
                progress: { current: 0, target: 50 },
                rewards: [{ type: 'coins', amount: 150 }],
                unlocked: false
            },
            {
                id: 'map_master',
                category: 'exploration',
                name: '地图大师 Map Master',
                description: '收集100个道具 Collect 100 items',
                icon: '🌍',
                rarity: 'rare',
                progress: { current: 0, target: 100 },
                rewards: [{ type: 'coins', amount: 300 }],
                unlocked: false
            },
            {
                id: 'survivor',
                category: 'survival',
                name: '幸存者 Survivor',
                description: '存活1分钟 Survive for 1 minute',
                icon: '⏱️',
                rarity: 'common',
                progress: { current: 0, target: 60 },
                rewards: [{ type: 'coins', amount: 50 }],
                unlocked: false
            },
            {
                id: 'endurance',
                category: 'survival',
                name: '耐力 Endurance',
                description: '存活5分钟 Survive for 5 minutes',
                icon: '💪',
                rarity: 'uncommon',
                progress: { current: 0, target: 300 },
                rewards: [{ type: 'coins', amount: 150 }],
                unlocked: false
            },
            {
                id: 'marathon',
                category: 'survival',
                name: '马拉松 Marathon',
                description: '存活10分钟 Survive for 10 minutes',
                icon: '🏃',
                rarity: 'rare',
                progress: { current: 0, target: 600 },
                rewards: [{ type: 'coins', amount: 300 }],
                unlocked: false
            },
            {
                id: 'immortal',
                category: 'survival',
                name: '不朽 Immortal',
                description: '存活20分钟 Survive for 20 minutes',
                icon: '⭐',
                rarity: 'epic',
                progress: { current: 0, target: 1200 },
                rewards: [{ type: 'coins', amount: 500 }],
                unlocked: false
            },
            {
                id: 'skill_master',
                category: 'special',
                name: '技能大师 Skill Master',
                description: '使用所有技能 Use all skills',
                icon: '⚡',
                rarity: 'rare',
                progress: { current: 0, target: 4 },
                rewards: [{ type: 'coins', amount: 200 }],
                unlocked: false
            },
            {
                id: 'lucky_star',
                category: 'special',
                name: '幸运星 Lucky Star',
                description: '获得10次正面事件 Get 10 positive events',
                icon: '🍀',
                rarity: 'uncommon',
                progress: { current: 0, target: 10 },
                rewards: [{ type: 'coins', amount: 100 }],
                unlocked: false
            },
            {
                id: 'evolution_master',
                category: 'special',
                name: '进化大师 Evolution Master',
                description: '僵尸进化到传说阶段 Evolve zombie to legendary stage',
                icon: '🧟',
                rarity: 'epic',
                progress: { current: 0, target: 1 },
                rewards: [{ type: 'coins', amount: 400 }],
                unlocked: false
            },
            {
                id: 'champion',
                category: 'special',
                name: '冠军 Champion',
                description: '获得1000分 Score 1000 points',
                icon: '🏆',
                rarity: 'rare',
                progress: { current: 0, target: 1000 },
                rewards: [{ type: 'coins', amount: 250 }],
                unlocked: false
            },
            {
                id: 'legend',
                category: 'special',
                name: '传奇 Legend',
                description: '获得5000分 Score 5000 points',
                icon: '👑',
                rarity: 'legendary',
                progress: { current: 0, target: 5000 },
                rewards: [{ type: 'coins', amount: 1000 }],
                unlocked: false
            }
        ];
    }

    loadUnlockedAchievements() {
        const saved = localStorage.getItem('zombieEnhancementAchievements');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.unlockedAchievements = data.unlocked || [];
                
                this.achievements.forEach(achievement => {
                    if (this.unlockedAchievements.includes(achievement.id)) {
                        achievement.unlocked = true;
                    }
                });
            } catch (e) {
                console.error('Failed to load achievements:', e);
            }
        }
    }

    setupEventListeners() {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.filter;
                this.updateAchievementLists();
            });
        });

        this.closeModalBtn.addEventListener('click', () => {
            this.achievementModal.classList.remove('active');
        });

        this.achievementModal.addEventListener('click', (e) => {
            if (e.target === this.achievementModal) {
                this.achievementModal.classList.remove('active');
            }
        });
    }

    updateUI() {
        this.updateProgressOverview();
        this.updateAchievementLists();
        this.updateRecentUnlocks();
    }

    updateProgressOverview() {
        const total = this.achievements.length;
        const unlocked = this.achievements.filter(a => a.unlocked).length;
        const rare = this.achievements.filter(a => a.unlocked && ['rare', 'epic', 'legendary'].includes(a.rarity)).length;
        const recent = this.unlockedAchievements.slice(-5).length;

        this.totalAchievementsEl.textContent = unlocked;
        this.maxAchievementsEl.textContent = total;
        this.completionRateEl.textContent = `${Math.round((unlocked / total) * 100)}%`;
        this.rareAchievementsEl.textContent = rare;
        this.recentlyUnlockedEl.textContent = recent;
    }

    updateAchievementLists() {
        const filteredAchievements = this.getFilteredAchievements();

        this.combatAchievementsEl.innerHTML = this.renderAchievements(
            filteredAchievements.filter(a => a.category === 'combat')
        );
        this.explorationAchievementsEl.innerHTML = this.renderAchievements(
            filteredAchievements.filter(a => a.category === 'exploration')
        );
        this.survivalAchievementsEl.innerHTML = this.renderAchievements(
            filteredAchievements.filter(a => a.category === 'survival')
        );
        this.specialAchievementsEl.innerHTML = this.renderAchievements(
            filteredAchievements.filter(a => a.category === 'special')
        );
    }

    getFilteredAchievements() {
        switch (this.currentFilter) {
            case 'unlocked':
                return this.achievements.filter(a => a.unlocked);
            case 'locked':
                return this.achievements.filter(a => !a.unlocked);
            default:
                return this.achievements;
        }
    }

    renderAchievements(achievements) {
        if (achievements.length === 0) {
            return `
                <div class="achievement-card" style="justify-content: center; color: #95a5a6;">
                    暂无成就 No achievements
                </div>
            `;
        }

        return achievements.map(achievement => {
            const progressPercent = Math.min((achievement.progress.current / achievement.progress.target) * 100, 100);
            const statusClass = achievement.unlocked ? 'unlocked' : 'locked';
            const statusIcon = achievement.unlocked ? '✅' : '🔒';
            const statusText = achievement.unlocked ? '已解锁 Unlocked' : '未解锁 Locked';

            return `
                <div class="achievement-card ${statusClass}" data-id="${achievement.id}">
                    <div class="achievement-header">
                        <div class="achievement-icon">${achievement.icon}</div>
                        <div class="achievement-title">
                            <div class="achievement-name">${achievement.name}</div>
                            <div class="achievement-rarity ${achievement.rarity}">${this.getRarityText(achievement.rarity)}</div>
                        </div>
                    </div>
                    <div class="achievement-description">${achievement.description}</div>
                    <div class="achievement-progress">
                        <div class="progress-label">进度 Progress</div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${progressPercent}%"></div>
                        </div>
                        <div class="progress-value">${achievement.progress.current} / ${achievement.progress.target}</div>
                    </div>
                    <div class="achievement-rewards">
                        <div class="rewards-label">奖励 Rewards</div>
                        ${achievement.rewards.map(reward => `
                            <span class="reward">${this.getRewardText(reward)}</span>
                        `).join('')}
                    </div>
                    <div class="achievement-status ${statusClass}">
                        <span class="status-icon">${statusIcon}</span>
                        <span class="status-text">${statusText}</span>
                    </div>
                </div>
            `;
        }).join('');
    }

    getRarityText(rarity) {
        const rarityMap = {
            common: '普通 Common',
            uncommon: '罕见 Uncommon',
            rare: '稀有 Rare',
            epic: '史诗 Epic',
            legendary: '传说 Legendary'
        };
        return rarityMap[rarity] || rarity;
    }

    getRewardText(reward) {
        switch (reward.type) {
            case 'coins':
                return `💰 ${reward.amount} 金币`;
            default:
                return `${reward.type}: ${reward.amount}`;
        }
    }

    updateRecentUnlocks() {
        const recentUnlocks = this.unlockedAchievements.slice(-10).reverse();
        
        this.recentUnlocksEl.innerHTML = recentUnlocks.map(id => {
            const achievement = this.achievements.find(a => a.id === id);
            if (!achievement) return '';

            const savedData = localStorage.getItem('zombieEnhancementAchievementDates');
            const dates = savedData ? JSON.parse(savedData) : {};
            const date = dates[id] ? new Date(dates[id]) : new Date();

            return `
                <div class="recent-unlock-item">
                    <div class="recent-unlock-icon">${achievement.icon}</div>
                    <div class="recent-unlock-info">
                        <div class="recent-unlock-name">${achievement.name}</div>
                        <div class="recent-unlock-date">${date.toLocaleString('zh-CN')}</div>
                    </div>
                </div>
            `;
        }).join('');

        if (recentUnlocks.length === 0) {
            this.recentUnlocksEl.innerHTML = `
                <div class="recent-unlock-item" style="justify-content: center; color: #95a5a6;">
                    暂无解锁记录 No unlocks yet
                </div>
            `;
        }
    }

    updateProgress(achievementId, progress) {
        const achievement = this.achievements.find(a => a.id === achievementId);
        if (!achievement) return;

        achievement.progress.current = progress;

        if (!achievement.unlocked && achievement.progress.current >= achievement.progress.target) {
            this.unlockAchievement(achievementId);
        }

        this.saveAchievements();
        this.updateUI();
    }

    unlockAchievement(achievementId) {
        const achievement = this.achievements.find(a => a.id === achievementId);
        if (!achievement || achievement.unlocked) return;

        achievement.unlocked = true;
        this.unlockedAchievements.push(achievementId);

        const savedData = localStorage.getItem('zombieEnhancementAchievementDates');
        const dates = savedData ? JSON.parse(savedData) : {};
        dates[achievementId] = new Date().toISOString();
        localStorage.setItem('zombieEnhancementAchievementDates', JSON.stringify(dates));

        this.showToast(`成就解锁！${achievement.name}`, 'positive');
        this.showAchievementNotification(achievement);
    }

    showAchievementNotification(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="notification-icon">${achievement.icon}</div>
            <div class="notification-content">
                <div class="notification-title">成就解锁！Achievement Unlocked!</div>
                <div class="notification-name">${achievement.name}</div>
            </div>
        `;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%);
            padding: 20px;
            border-radius: 15px;
            display: flex;
            align-items: center;
            gap: 15px;
            z-index: 10000;
            animation: slide-in 0.5s ease-out;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slide-out 0.5s ease-out';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 500);
        }, 3000);
    }

    saveAchievements() {
        const data = {
            unlocked: this.unlockedAchievements,
            progress: this.achievements.map(a => ({
                id: a.id,
                progress: a.progress
            }))
        };
        localStorage.setItem('zombieEnhancementAchievements', JSON.stringify(data));
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

const style = document.createElement('style');
style.textContent = `
    @keyframes slide-in {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes slide-out {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }

    .achievement-notification {
        color: white;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    .notification-icon {
        font-size: 48px;
    }

    .notification-content {
        flex: 1;
    }

    .notification-title {
        font-size: 14px;
        opacity: 0.8;
        margin-bottom: 5px;
    }

    .notification-name {
        font-size: 18px;
        font-weight: bold;
    }
`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', () => {
    const achievementManager = new AchievementManager();
});
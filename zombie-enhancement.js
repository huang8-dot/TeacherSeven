class ZombieEnhancementGame {
    constructor() {
        this.mapSize = 10;
        this.gameMap = [];
        this.player = { row: 0, col: 0, health: 100, speed: 1 };
        this.zombies = [];
        this.hearts = [];
        this.traps = [];
        this.obstacles = [];
        this.gameState = 'idle';
        this.score = 0;
        this.time = 0;
        this.coins = 0;
        this.ep = 0;
        this.gameInterval = null;
        this.eventInterval = null;
        this.environment = 'day';
        this.environmentTime = 0;
        this.eventTimer = 15;
        this.skills = {
            dash: { cooldown: 5, currentCooldown: 0, active: false },
            shield: { cooldown: 15, currentCooldown: 0, active: false },
            trap: { cooldown: 10, currentCooldown: 0, active: false },
            blink: { cooldown: 12, currentCooldown: 0, active: false },
            attack: { cooldown: 8, currentCooldown: 0, active: false }
        };
        this.passiveSkills = {
            agility: { active: true, effect: 0.2 },
            luck: { active: true, effect: 0.3 },
            resilience: { active: true, effect: 0.5 }
        };
        this.stats = {
            zombiesDefeated: 0,
            itemsCollected: 0,
            skillsUsed: 0,
            tasksCompleted: 0
        };
        this.shieldActive = false;
        this.shieldTimer = null;
        this.visualEffects = window.visualEffects;
        this.achievementProgress = {
            first_blood: 0,
            zombie_hunter: 0,
            zombie_slayer: 0,
            zombie_master: 0,
            explorer: 0,
            treasure_hunter: 0,
            map_master: 0,
            survivor: 0,
            endurance: 0,
            marathon: 0,
            immortal: 0,
            skill_master: 0,
            lucky_star: 0,
            evolution_master: 0,
            champion: 0,
            legend: 0
        };
        this.unlockedAchievements = [];
        
        this.initializeElements();
        this.initializeMap();
        this.setupEventListeners();
        this.loadGameData();
        this.loadAchievements();
    }

    initializeElements() {
        this.gameMapEl = document.getElementById('gameMap');
        this.healthEl = document.getElementById('health');
        this.scoreEl = document.getElementById('score');
        this.timeEl = document.getElementById('time');
        this.environmentEl = document.getElementById('environment');
        this.coinsEl = document.getElementById('coins');
        this.epProgressEl = document.getElementById('epProgress');
        this.epValueEl = document.getElementById('epValue');
        this.eventLogEl = document.getElementById('eventLog');
        this.eventTimerEl = document.getElementById('eventTimer');
        this.zombiesDefeatedEl = document.getElementById('zombiesDefeated');
        this.itemsCollectedEl = document.getElementById('itemsCollected');
        this.skillsUsedEl = document.getElementById('skillsUsed');
        this.tasksCompletedEl = document.getElementById('tasksCompleted');
        this.gameOverModal = document.getElementById('gameOverModal');
    }

    initializeMap() {
        this.gameMap = [];
        this.obstacles = [];
        
        for (let row = 0; row < this.mapSize; row++) {
            this.gameMap[row] = [];
            for (let col = 0; col < this.mapSize; col++) {
                this.gameMap[row][col] = { type: 'empty', content: null };
            }
        }

        const obstaclePositions = [
            [2, 3], [2, 4], [5, 6], [5, 7], [7, 2], [7, 3]
        ];

        obstaclePositions.forEach(([row, col]) => {
            this.gameMap[row][col] = { type: 'obstacle', content: '🚧' };
            this.obstacles.push({ row, col });
        });

        this.player = { row: 0, col: 0, health: 100, speed: 1 };
        this.zombies = [];
        this.hearts = [];
        this.traps = [];

        this.renderMap();
    }

    renderMap() {
        this.gameMapEl.innerHTML = '';
        
        for (let row = 0; row < this.mapSize; row++) {
            for (let col = 0; col < this.mapSize; col++) {
                const cell = document.createElement('div');
                cell.className = 'map-cell';
                cell.dataset.row = row;
                cell.dataset.col = col;

                if (this.player.row === row && this.player.col === col) {
                    cell.classList.add('player');
                    cell.textContent = this.shieldActive ? '🛡️' : '🏃';
                } else {
                    const zombie = this.zombies.find(z => z.row === row && z.col === col);
                    if (zombie) {
                        cell.classList.add('zombie');
                        if (zombie.stage > 1) {
                            cell.classList.add('evolved');
                        }
                        cell.textContent = this.getZombieIcon(zombie.stage);
                    } else {
                        const heart = this.hearts.find(h => h.row === row && h.col === col);
                        if (heart) {
                            cell.classList.add('heart');
                            cell.textContent = '❤️';
                        } else {
                            const trap = this.traps.find(t => t.row === row && t.col === col);
                            if (trap) {
                                cell.classList.add('trap');
                                cell.textContent = '⚠️';
                            } else if (this.gameMap[row][col].type === 'obstacle') {
                                cell.classList.add('obstacle');
                                cell.textContent = this.gameMap[row][col].content;
                            }
                        }
                    }
                }

                this.gameMapEl.appendChild(cell);
            }
        }
    }

    getZombieIcon(stage) {
        const icons = ['🧟', '🧟‍♂️', '🧟‍♀️', '🧟‍♂️'];
        return icons[stage - 1] || '🧟';
    }

    setupEventListeners() {
        document.getElementById('startBtn').addEventListener('click', () => this.startGame());
        document.getElementById('pauseBtn').addEventListener('click', () => this.togglePause());
        document.getElementById('restartBtn').addEventListener('click', () => this.restartGame());
        document.getElementById('upBtn').addEventListener('click', () => this.movePlayer(-1, 0));
        document.getElementById('downBtn').addEventListener('click', () => this.movePlayer(1, 0));
        document.getElementById('leftBtn').addEventListener('click', () => this.movePlayer(0, -1));
        document.getElementById('rightBtn').addEventListener('click', () => this.movePlayer(0, 1));
        document.getElementById('attackBtn').addEventListener('click', () => this.useSkill('attack'));
        document.getElementById('restartModalBtn').addEventListener('click', () => {
            this.gameOverModal.classList.remove('active');
            this.restartGame();
        });
        document.getElementById('returnModalBtn').addEventListener('click', () => {
            this.gameOverModal.classList.remove('active');
            window.location.href = 'zombie-mode.html';
        });

        document.querySelectorAll('.skill-slot').forEach(slot => {
            slot.addEventListener('click', () => {
                const skill = slot.dataset.skill;
                this.useSkill(skill);
            });
        });

        document.addEventListener('keydown', (e) => {
            if (this.gameState !== 'playing') return;

            switch(e.key) {
                case 'ArrowUp':
                case 'w':
                case 'W':
                    this.movePlayer(-1, 0);
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    this.movePlayer(1, 0);
                    break;
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    this.movePlayer(0, -1);
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    this.movePlayer(0, 1);
                    break;
                case ' ':
                    e.preventDefault();
                    this.useSkill('dash');
                    break;
                case 'e':
                case 'E':
                    this.useSkill('shield');
                    break;
                case 'q':
                case 'Q':
                    this.useSkill('trap');
                    break;
                case 'r':
                case 'R':
                    this.useSkill('blink');
                    break;
                case 'f':
                case 'F':
                    this.useSkill('attack');
                    break;
                case 'Escape':
                    this.togglePause();
                    break;
            }
        });
    }

    startGame() {
        if (this.gameState === 'playing') return;
        
        this.gameState = 'playing';
        this.score = 0;
        this.time = 0;
        this.loadCoinsFromStorage();
        this.ep = 0;
        this.environment = 'day';
        this.environmentTime = 0;
        this.eventTimer = 15;
        
        this.stats = {
            zombiesDefeated: 0,
            itemsCollected: 0,
            skillsUsed: 0,
            tasksCompleted: 0
        };

        this.resetSkillCooldowns();
        this.spawnZombies();
        this.spawnHearts();
        this.updateUI();
        this.renderMap();

        this.gameInterval = setInterval(() => this.gameLoop(), 1000);
        this.eventInterval = setInterval(() => this.eventLoop(), 1000);
        
        this.showToast('游戏开始！Game Started!', 'positive');
    }

    gameLoop() {
        if (this.gameState !== 'playing') return;

        this.time++;
        this.environmentTime++;
        this.eventTimer--;

        this.updateEnvironment();
        this.moveZombies();
        this.checkCollisions();
        this.updateUI();
        this.renderMap();

        this.updateAchievementProgress('survivor');
        this.updateAchievementProgress('endurance');
        this.updateAchievementProgress('marathon');
        this.updateAchievementProgress('immortal');
        this.updateAchievementProgress('champion', 0);
        this.updateAchievementProgress('legend', 0);

        if (this.player.health <= 0) {
            this.gameOver();
        }
    }

    eventLoop() {
        if (this.gameState !== 'playing') return;

        if (this.eventTimer <= 0) {
            this.triggerRandomEvent();
            this.eventTimer = 15;
        }

        this.updateSkillCooldowns();
        this.updateUI();
    }

    updateEnvironment() {
        const environments = [
            { name: 'day', duration: 45, icon: '🌅', label: '白天 Day' },
            { name: 'night', duration: 45, icon: '🌙', label: '夜晚 Night' },
            { name: 'fog', duration: 45, icon: '🌫️', label: '迷雾 Fog' },
            { name: 'storm', duration: 45, icon: '🌪️', label: '暴风雨 Storm' }
        ];

        let totalTime = 0;
        for (const env of environments) {
            totalTime += env.duration;
            if (this.environmentTime <= totalTime) {
                if (this.environment !== env.name) {
                    this.environment = env.name;
                    this.environmentEl.textContent = `${env.icon} ${env.label}`;
                    this.showToast(`环境切换：${env.label}`, 'neutral');
                }
                break;
            }
        }
    }

    movePlayer(rowDelta, colDelta) {
        if (this.gameState !== 'playing') return;

        const newRow = this.player.row + rowDelta;
        const newCol = this.player.col + colDelta;

        if (newRow < 0 || newRow >= this.mapSize || newCol < 0 || newCol >= this.mapSize) return;
        if (this.gameMap[newRow][newCol].type === 'obstacle') return;

        const trap = this.traps.find(t => t.row === newRow && t.col === newCol);
        if (trap) {
            this.showToast('踩中陷阱！Trapped!', 'negative');
            return;
        }

        this.player.row = newRow;
        this.player.col = newCol;

        this.checkCollisions();
        this.renderMap();
    }

    moveZombies() {
        this.zombies.forEach(zombie => {
            if (zombie.stunned > 0) {
                zombie.stunned--;
                return;
            }

            const target = this.findTarget(zombie);
            if (target) {
                this.moveZombieTowardsTarget(zombie, target);
            }
        });
    }

    findTarget(zombie) {
        const heartTarget = this.hearts.find(heart => {
            const distance = Math.abs(zombie.row - heart.row) + Math.abs(zombie.col - heart.col);
            return distance <= zombie.detectionRange;
        });

        if (heartTarget) {
            return { row: heartTarget.row, col: heartTarget.col, type: 'heart' };
        }

        const playerDistance = Math.abs(zombie.row - this.player.row) + Math.abs(zombie.col - this.player.col);
        if (playerDistance <= zombie.detectionRange) {
            return { row: this.player.row, col: this.player.col, type: 'player' };
        }

        return null;
    }

    moveZombieTowardsTarget(zombie, target) {
        const rowDiff = target.row - zombie.row;
        const colDiff = target.col - zombie.col;

        let newRow = zombie.row;
        let newCol = zombie.col;

        if (Math.abs(rowDiff) > Math.abs(colDiff)) {
            newRow += rowDiff > 0 ? 1 : -1;
        } else {
            newCol += colDiff > 0 ? 1 : -1;
        }

        if (newRow >= 0 && newRow < this.mapSize && newCol >= 0 && newCol < this.mapSize) {
            if (this.gameMap[newRow][newCol].type !== 'obstacle') {
                zombie.row = newRow;
                zombie.col = newCol;
            }
        }
    }

    checkCollisions() {
        this.hearts = this.hearts.filter(heart => {
            if (heart.row === this.player.row && heart.col === this.player.col) {
                this.player.health = Math.min(this.player.health + 20, 100);
                this.score += 10;
                this.coins += 5;
                this.stats.itemsCollected++;
                this.saveCoinsToStorage();
                this.updateAchievementProgress('explorer');
                this.updateAchievementProgress('treasure_hunter');
                this.updateAchievementProgress('map_master');
                if (this.visualEffects) {
                    const cell = this.gameMapEl.querySelector(`[data-row="${heart.row}"][data-col="${heart.col}"]`);
                    if (cell) {
                        const rect = cell.getBoundingClientRect();
                        this.visualEffects.createHeartParticles(rect.left + rect.width / 2, rect.top + rect.height / 2);
                        this.visualEffects.createCoinParticles(rect.left + rect.width / 2, rect.top + rect.height / 2, 3);
                    }
                }
                this.showToast('获得爱心！+20生命值 +5金币', 'positive');
                this.updateUI();
                return false;
            }
            return true;
        });

        this.zombies.forEach(zombie => {
            if (zombie.row === this.player.row && zombie.col === this.player.col) {
                if (this.shieldActive) {
                    if (this.visualEffects) {
                        this.visualEffects.flashEffect('#3498db', 300);
                    }
                    this.showToast('护盾抵挡伤害！', 'positive');
                } else {
                    const damage = Math.floor(10 * (1 - this.passiveSkills.resilience.effect));
                    this.player.health -= damage;
                    if (this.visualEffects) {
                        this.visualEffects.screenShake(5, 500);
                        this.visualEffects.flashEffect('#e74c3c', 300);
                    }
                    this.showToast(`被僵尸攻击！-${damage}生命值`, 'negative');
                }
            }

            this.hearts = this.hearts.filter(heart => {
                if (heart.row === zombie.row && heart.col === zombie.col) {
                    this.evolveZombie(zombie);
                    return false;
                }
                return true;
            });
        });

        if (this.hearts.length === 0) {
            this.spawnHearts();
        }
    }

    evolveZombie(zombie) {
        if (zombie.stage < 4) {
            zombie.stage++;
            this.updateZombieStats(zombie);
            this.ep += 50;
            if (zombie.stage === 4) {
                this.updateAchievementProgress('evolution_master');
            }
            if (this.visualEffects) {
                const cell = this.gameMapEl.querySelector(`[data-row="${zombie.row}"][data-col="${zombie.col}"]`);
                if (cell) {
                    const rect = cell.getBoundingClientRect();
                    this.visualEffects.createMagicParticles(rect.left + rect.width / 2, rect.top + rect.height / 2, 15);
                    this.visualEffects.flashEffect('#9b59b6', 500);
                }
            }
            this.showToast(`僵尸进化！阶段 ${zombie.stage}`, 'neutral');
        }
    }

    updateZombieStats(zombie) {
        const stageStats = {
            1: { speed: 1.0, detectionRange: 3, health: 100 },
            2: { speed: 1.2, detectionRange: 4, health: 120 },
            3: { speed: 1.4, detectionRange: 5, health: 140 },
            4: { speed: 1.6, detectionRange: 6, health: 160 }
        };

        const stats = stageStats[zombie.stage];
        zombie.speed = stats.speed;
        zombie.detectionRange = stats.detectionRange;
        zombie.health = stats.health;
    }

    spawnZombies() {
        this.zombies = [];
        const zombieCount = 3;

        for (let i = 0; i < zombieCount; i++) {
            let row, col;
            do {
                row = Math.floor(Math.random() * this.mapSize);
                col = Math.floor(Math.random() * this.mapSize);
            } while (
                (row === this.player.row && col === this.player.col) ||
                this.gameMap[row][col].type === 'obstacle'
            );

            this.zombies.push({
                row,
                col,
                stage: 1,
                speed: 1.0,
                detectionRange: 3,
                health: 100,
                stunned: 0
            });
        }
    }

    spawnHearts() {
        this.hearts = [];
        const heartCount = 2;

        for (let i = 0; i < heartCount; i++) {
            let row, col;
            do {
                row = Math.floor(Math.random() * this.mapSize);
                col = Math.floor(Math.random() * this.mapSize);
            } while (
                (row === this.player.row && col === this.player.col) ||
                this.gameMap[row][col].type === 'obstacle' ||
                this.hearts.some(h => h.row === row && h.col === col)
            );

            this.hearts.push({ row, col });
        }
    }

    useSkill(skillName) {
        if (this.gameState !== 'playing') return;
        if (this.skills[skillName].currentCooldown > 0) {
            this.showToast('技能冷却中！Skill on cooldown!', 'negative');
            return;
        }

        this.stats.skillsUsed++;
        this.skills[skillName].currentCooldown = this.skills[skillName].cooldown;
        this.updateAchievementProgress('skill_master');

        switch (skillName) {
            case 'dash':
                this.dashSkill();
                break;
            case 'shield':
                this.shieldSkill();
                break;
            case 'trap':
                this.trapSkill();
                break;
            case 'blink':
                this.blinkSkill();
                break;
            case 'attack':
                this.attackSkill();
                break;
        }

        this.updateUI();
    }

    dashSkill() {
        const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        const direction = directions[Math.floor(Math.random() * directions.length)];
        
        if (this.visualEffects) {
            const cell = this.gameMapEl.querySelector(`[data-row="${this.player.row}"][data-col="${this.player.col}"]`);
            if (cell) {
                const rect = cell.getBoundingClientRect();
                this.visualEffects.createStarParticles(rect.left + rect.width / 2, rect.top + rect.height / 2, 10);
            }
        }
        
        for (let i = 0; i < 3; i++) {
            const newRow = this.player.row + direction[0];
            const newCol = this.player.col + direction[1];
            
            if (newRow >= 0 && newRow < this.mapSize && newCol >= 0 && newCol < this.mapSize) {
                if (this.gameMap[newRow][newCol].type !== 'obstacle') {
                    this.player.row = newRow;
                    this.player.col = newCol;
                }
            }
        }
        
        this.showToast('冲刺！Dash!', 'positive');
        this.renderMap();
    }

    shieldSkill() {
        this.shieldActive = true;
        
        if (this.shieldTimer) {
            clearTimeout(this.shieldTimer);
        }
        
        this.shieldTimer = setTimeout(() => {
            this.shieldActive = false;
            this.showToast('护盾消失！Shield expired!', 'neutral');
            this.renderMap();
        }, 5000);
        
        this.showToast('护盾激活！Shield active!', 'positive');
        this.renderMap();
    }

    trapSkill() {
        const trap = { row: this.player.row, col: this.player.col };
        this.traps.push(trap);
        this.showToast('陷阱放置！Trap placed!', 'positive');
        this.renderMap();
    }

    blinkSkill() {
        let newRow, newCol;
        do {
            newRow = Math.floor(Math.random() * this.mapSize);
            newCol = Math.floor(Math.random() * this.mapSize);
        } while (
            (newRow === this.player.row && newCol === this.player.col) ||
            this.gameMap[newRow][newCol].type === 'obstacle' ||
            this.zombies.some(z => z.row === newRow && z.col === newCol)
        );

        this.player.row = newRow;
        this.player.col = newCol;
        
        this.showToast('闪现！Blink!', 'positive');
        this.renderMap();
    }

    attackSkill() {
        const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        let defeated = false;
        
        directions.forEach(([rowDelta, colDelta]) => {
            const targetRow = this.player.row + rowDelta;
            const targetCol = this.player.col + colDelta;
            
            const zombie = this.zombies.find(z => z.row === targetRow && z.col === targetCol);
            if (zombie) {
                const damage = 30;
                zombie.health -= damage;
                
                if (this.visualEffects) {
                    const cell = this.gameMapEl.querySelector(`[data-row="${targetRow}"][data-col="${targetCol}"]`);
                    if (cell) {
                        const rect = cell.getBoundingClientRect();
                        this.visualEffects.createStarParticles(rect.left + rect.width / 2, rect.top + rect.height / 2, 8);
                        this.visualEffects.flashEffect('#e74c3c', 300);
                    }
                }
                
                if (zombie.health <= 0) {
                    this.zombies = this.zombies.filter(z => z !== zombie);
                    this.stats.zombiesDefeated++;
                    this.score += 25;
                    this.coins += 10;
                    this.saveCoinsToStorage();
                    this.updateAchievementProgress('first_blood');
                    this.updateAchievementProgress('zombie_hunter');
                    this.updateAchievementProgress('zombie_slayer');
                    this.updateAchievementProgress('zombie_master');
                    defeated = true;
                    
                    if (this.visualEffects) {
                        const cell = this.gameMapEl.querySelector(`[data-row="${targetRow}"][data-col="${targetCol}"]`);
                        if (cell) {
                            const rect = cell.getBoundingClientRect();
                            this.visualEffects.createCoinParticles(rect.left + rect.width / 2, rect.top + rect.height / 2, 5);
                        }
                    }
                    
                    this.showToast('僵尸击败！+25分数 +10金币', 'positive');
                    this.updateUI();
                } else {
                    this.showToast(`僵尸受到${damage}伤害！`, 'neutral');
                }
            }
        });
        
        if (defeated && this.zombies.length === 0) {
            this.spawnZombies();
        }
        
        this.renderMap();
    }

    resetSkillCooldowns() {
        Object.keys(this.skills).forEach(skill => {
            this.skills[skill].currentCooldown = 0;
        });
    }

    updateSkillCooldowns() {
        Object.keys(this.skills).forEach(skill => {
            if (this.skills[skill].currentCooldown > 0) {
                this.skills[skill].currentCooldown--;
            }
        });
    }

    triggerRandomEvent() {
        const events = [
            { type: 'positive', name: '道具雨', effect: () => this.itemRainEvent() },
            { type: 'positive', name: '金币雨', effect: () => this.coinRainEvent() },
            { type: 'positive', name: '生命恢复', effect: () => this.healthRestoreEvent() },
            { type: 'positive', name: '加速', effect: () => this.speedBoostEvent() },
            { type: 'negative', name: '僵尸狂暴', effect: () => this.zombieRageEvent() },
            { type: 'negative', name: '迷雾降临', effect: () => this.fogEvent() },
            { type: 'negative', name: '陷阱出现', effect: () => this.trapEvent() },
            { type: 'neutral', name: '环境变化', effect: () => this.environmentChangeEvent() },
            { type: 'neutral', name: '僵尸刷新', effect: () => this.zombieRefreshEvent() },
            { type: 'neutral', name: '道具刷新', effect: () => this.itemRefreshEvent() }
        ];

        const event = events[Math.floor(Math.random() * events.length)];
        event.effect();
        
        if (event.type === 'positive') {
            this.updateAchievementProgress('lucky_star');
        }
        
        this.addEventLog(event.name, event.type);
    }

    itemRainEvent() {
        for (let i = 0; i < 5; i++) {
            let row, col;
            do {
                row = Math.floor(Math.random() * this.mapSize);
                col = Math.floor(Math.random() * this.mapSize);
            } while (
                this.gameMap[row][col].type === 'obstacle' ||
                this.hearts.some(h => h.row === row && h.col === col)
            );

            this.hearts.push({ row, col });
        }
        this.showToast('道具雨！Item rain!', 'positive');
    }

    coinRainEvent() {
        this.coins += 50;
        this.saveCoinsToStorage();
        this.showToast('金币雨！+50金币', 'positive');
        this.updateUI();
    }

    healthRestoreEvent() {
        this.player.health = Math.min(this.player.health + 30, 100);
        this.showToast('生命恢复！+30生命值', 'positive');
    }

    speedBoostEvent() {
        this.player.speed = 1.5;
        setTimeout(() => {
            this.player.speed = 1;
            this.showToast('加速结束！', 'neutral');
        }, 10000);
        this.showToast('加速！速度提升50%', 'positive');
    }

    zombieRageEvent() {
        this.zombies.forEach(zombie => {
            zombie.speed *= 1.5;
        });
        setTimeout(() => {
            this.zombies.forEach(zombie => {
                zombie.speed /= 1.5;
            });
            this.showToast('僵尸狂暴结束！', 'neutral');
        }, 15000);
        this.showToast('僵尸狂暴！速度提升50%', 'negative');
    }

    fogEvent() {
        this.showToast('迷雾降临！视野减少', 'negative');
        setTimeout(() => {
            this.showToast('迷雾消散！', 'neutral');
        }, 20000);
    }

    trapEvent() {
        for (let i = 0; i < 3; i++) {
            let row, col;
            do {
                row = Math.floor(Math.random() * this.mapSize);
                col = Math.floor(Math.random() * this.mapSize);
            } while (
                (row === this.player.row && col === this.player.col) ||
                this.gameMap[row][col].type === 'obstacle' ||
                this.traps.some(t => t.row === row && t.col === col)
            );

            this.traps.push({ row, col });
        }
        this.showToast('陷阱出现！Traps appeared!', 'negative');
    }

    environmentChangeEvent() {
        const environments = ['day', 'night', 'fog', 'storm'];
        const currentIndex = environments.indexOf(this.environment);
        const nextIndex = (currentIndex + 1) % environments.length;
        this.environment = environments[nextIndex];
        
        const envLabels = {
            day: '🌅 白天 Day',
            night: '🌙 夜晚 Night',
            fog: '🌫️ 迷雾 Fog',
            storm: '🌪️ 暴风雨 Storm'
        };
        
        this.environmentEl.textContent = envLabels[this.environment];
        this.showToast('环境变化！', 'neutral');
    }

    zombieRefreshEvent() {
        this.spawnZombies();
        this.showToast('僵尸刷新！Zombies refreshed!', 'neutral');
    }

    itemRefreshEvent() {
        this.hearts = [];
        this.spawnHearts();
        this.showToast('道具刷新！Items refreshed!', 'neutral');
    }

    addEventLog(name, type) {
        const eventItem = document.createElement('div');
        eventItem.className = `event-item ${type}`;
        eventItem.textContent = `${name} - ${new Date().toLocaleTimeString()}`;
        this.eventLogEl.insertBefore(eventItem, this.eventLogEl.firstChild);
        
        if (this.eventLogEl.children.length > 10) {
            this.eventLogEl.removeChild(this.eventLogEl.lastChild);
        }
    }

    updateUI() {
        this.healthEl.textContent = this.player.health;
        this.scoreEl.textContent = this.score;
        this.timeEl.textContent = this.formatTime(this.time);
        this.coinsEl.textContent = this.coins;
        
        const epPercentage = Math.min((this.ep / 600) * 100, 100);
        this.epProgressEl.style.width = `${epPercentage}%`;
        this.epValueEl.textContent = `${this.ep} / 600 EP`;
        
        this.eventTimerEl.textContent = `${this.eventTimer}s`;
        
        this.zombiesDefeatedEl.textContent = this.stats.zombiesDefeated;
        this.itemsCollectedEl.textContent = this.stats.itemsCollected;
        this.skillsUsedEl.textContent = this.stats.skillsUsed;
        this.tasksCompletedEl.textContent = this.stats.tasksCompleted;

        this.updateSkillUI();
        this.updateEvolutionUI();
    }

    updateSkillUI() {
        Object.keys(this.skills).forEach(skill => {
            const skillEl = document.querySelector(`.skill-slot[data-skill="${skill}"]`);
            const cooldownEl = document.getElementById(`${skill}Cooldown`);
            
            if (this.skills[skill].currentCooldown > 0) {
                skillEl.classList.add('cooldown');
                cooldownEl.textContent = `${this.skills[skill].currentCooldown}s`;
            } else {
                skillEl.classList.remove('cooldown');
                cooldownEl.textContent = `${this.skills[skill].cooldown}s`;
            }
        });
    }

    updateEvolutionUI() {
        document.querySelectorAll('.evolution-stage').forEach(stage => {
            const stageNum = parseInt(stage.dataset.stage);
            const epRequired = stageNum * 150;
            
            if (this.ep >= epRequired) {
                stage.classList.add('active');
            } else {
                stage.classList.remove('active');
            }
        });
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    togglePause() {
        if (this.gameState === 'playing') {
            this.gameState = 'paused';
            document.getElementById('pauseBtn').textContent = '▶️ 继续 Resume';
            this.showToast('游戏暂停！Game Paused!', 'neutral');
        } else if (this.gameState === 'paused') {
            this.gameState = 'playing';
            document.getElementById('pauseBtn').textContent = '⏸️ 暂停 Pause';
            this.showToast('游戏继续！Game Resumed!', 'positive');
        }
    }

    restartGame() {
        this.stopGame();
        this.initializeMap();
        this.startGame();
    }

    stopGame() {
        if (this.gameInterval) {
            clearInterval(this.gameInterval);
            this.gameInterval = null;
        }
        if (this.eventInterval) {
            clearInterval(this.eventInterval);
            this.eventInterval = null;
        }
        if (this.shieldTimer) {
            clearTimeout(this.shieldTimer);
            this.shieldTimer = null;
        }
        
        this.gameState = 'idle';
        this.shieldActive = false;
    }

    gameOver() {
        this.stopGame();
        
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('finalTime').textContent = this.formatTime(this.time);
        document.getElementById('finalCoins').textContent = this.coins;
        document.getElementById('finalEP').textContent = this.ep;
        
        this.gameOverModal.classList.add('active');
        this.saveGameData();
    }

    showToast(message, type = 'neutral') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = `toast active ${type}`;
        
        setTimeout(() => {
            toast.classList.remove('active');
        }, 3000);
    }

    saveGameData() {
        const gameData = {
            score: this.score,
            time: this.time,
            coins: this.coins,
            ep: this.ep,
            stats: this.stats,
            timestamp: new Date().toISOString()
        };
        
        let savedGames = JSON.parse(localStorage.getItem('zombieEnhancementGames') || '[]');
        savedGames.push(gameData);
        localStorage.setItem('zombieEnhancementGames', JSON.stringify(savedGames));
        
        this.saveCoinsToStorage();
    }

    loadGameData() {
        const savedGames = JSON.parse(localStorage.getItem('zombieEnhancementGames') || '[]');
        console.log('已保存的游戏记录:', savedGames.length);
    }

    loadCoinsFromStorage() {
        const savedCoins = localStorage.getItem('zombieEnhancementCoins');
        if (savedCoins) {
            try {
                this.coins = parseInt(savedCoins);
            } catch (e) {
                console.error('Failed to load coins:', e);
                this.coins = 1000;
            }
        } else {
            this.coins = 1000;
            this.saveCoinsToStorage();
        }
    }

    saveCoinsToStorage() {
        localStorage.setItem('zombieEnhancementCoins', this.coins.toString());
    }

    loadAchievements() {
        const savedAchievements = localStorage.getItem('zombieEnhancementAchievements');
        if (savedAchievements) {
            try {
                const data = JSON.parse(savedAchievements);
                this.unlockedAchievements = data.unlocked || [];
                
                const savedProgress = localStorage.getItem('zombieEnhancementAchievementProgress');
                if (savedProgress) {
                    const progressData = JSON.parse(savedProgress);
                    Object.keys(progressData).forEach(key => {
                        if (this.achievementProgress.hasOwnProperty(key)) {
                            this.achievementProgress[key] = progressData[key];
                        }
                    });
                }
            } catch (e) {
                console.error('Failed to load achievements:', e);
            }
        }
    }

    saveAchievements() {
        localStorage.setItem('zombieEnhancementAchievements', JSON.stringify({
            unlocked: this.unlockedAchievements
        }));
        localStorage.setItem('zombieEnhancementAchievementProgress', JSON.stringify(this.achievementProgress));
    }

    updateAchievementProgress(achievementId, increment = 1) {
        if (!this.achievementProgress.hasOwnProperty(achievementId)) return;
        
        if (increment > 0) {
            this.achievementProgress[achievementId] += increment;
        }
        this.checkAchievementUnlock(achievementId);
        this.saveAchievements();
    }

    checkAchievementUnlock(achievementId) {
        if (this.unlockedAchievements.includes(achievementId)) return;
        
        const achievementTargets = {
            first_blood: 1,
            zombie_hunter: 10,
            zombie_slayer: 50,
            zombie_master: 100,
            explorer: 10,
            treasure_hunter: 50,
            map_master: 100,
            survivor: 60,
            endurance: 300,
            marathon: 600,
            immortal: 1200,
            skill_master: 4,
            lucky_star: 10,
            evolution_master: 1,
            champion: 1000,
            legend: 5000
        };

        const target = achievementTargets[achievementId];
        if (target && this.achievementProgress[achievementId] >= target) {
            this.unlockAchievement(achievementId);
        }
    }

    unlockAchievement(achievementId) {
        if (this.unlockedAchievements.includes(achievementId)) return;
        
        this.unlockedAchievements.push(achievementId);
        
        const achievementNames = {
            first_blood: '初次击杀 First Blood',
            zombie_hunter: '僵尸猎人 Zombie Hunter',
            zombie_slayer: '僵尸杀手 Zombie Slayer',
            zombie_master: '僵尸大师 Zombie Master',
            explorer: '探索者 Explorer',
            treasure_hunter: '宝藏猎人 Treasure Hunter',
            map_master: '地图大师 Map Master',
            survivor: '幸存者 Survivor',
            endurance: '耐力 Endurance',
            marathon: '马拉松 Marathon',
            immortal: '不朽 Immortal',
            skill_master: '技能大师 Skill Master',
            lucky_star: '幸运星 Lucky Star',
            evolution_master: '进化大师 Evolution Master',
            champion: '冠军 Champion',
            legend: '传奇 Legend'
        };

        const achievementRewards = {
            first_blood: 50,
            zombie_hunter: 100,
            zombie_slayer: 200,
            zombie_master: 500,
            explorer: 50,
            treasure_hunter: 150,
            map_master: 300,
            survivor: 50,
            endurance: 150,
            marathon: 300,
            immortal: 500,
            skill_master: 200,
            lucky_star: 100,
            evolution_master: 400,
            champion: 250,
            legend: 1000
        };

        const reward = achievementRewards[achievementId] || 0;
        if (reward > 0) {
            this.coins += reward;
            this.saveCoinsToStorage();
            this.updateUI();
        }

        this.showToast(`🏆 成就解锁！${achievementNames[achievementId]} +${reward}金币`, 'positive');
        this.showAchievementNotification(achievementId);
    }

    showAchievementNotification(achievementId) {
        const achievementIcons = {
            first_blood: '⚔️',
            zombie_hunter: '🎯',
            zombie_slayer: '💀',
            zombie_master: '👑',
            explorer: '🗺️',
            treasure_hunter: '💎',
            map_master: '🌍',
            survivor: '⏱️',
            endurance: '💪',
            marathon: '🏃',
            immortal: '⭐',
            skill_master: '⚡',
            lucky_star: '🍀',
            evolution_master: '🧟',
            champion: '🏆',
            legend: '👑'
        };

        const achievementNames = {
            first_blood: '初次击杀 First Blood',
            zombie_hunter: '僵尸猎人 Zombie Hunter',
            zombie_slayer: '僵尸杀手 Zombie Slayer',
            zombie_master: '僵尸大师 Zombie Master',
            explorer: '探索者 Explorer',
            treasure_hunter: '宝藏猎人 Treasure Hunter',
            map_master: '地图大师 Map Master',
            survivor: '幸存者 Survivor',
            endurance: '耐力 Endurance',
            marathon: '马拉松 Marathon',
            immortal: '不朽 Immortal',
            skill_master: '技能大师 Skill Master',
            lucky_star: '幸运星 Lucky Star',
            evolution_master: '进化大师 Evolution Master',
            champion: '冠军 Champion',
            legend: '传奇 Legend'
        };

        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="notification-icon">${achievementIcons[achievementId] || '🏆'}</div>
            <div class="notification-content">
                <div class="notification-title">成就解锁！Achievement Unlocked!</div>
                <div class="notification-name">${achievementNames[achievementId] || 'Achievement'}</div>
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
            color: white;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slide-out 0.5s ease-out';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 500);
        }, 3000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const game = new ZombieEnhancementGame();
});
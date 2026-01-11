// 游戏配置和常量
const DIRECTIONS = {
    NORTH: 0,
    EAST: 1,
    SOUTH: 2,
    WEST: 3
};

const DIRECTION_ARROWS = ['⬆️', '➡️', '⬇️', '⬅️'];
const DIRECTION_NAMES = {
    0: { zh: '向北', en: 'North' },
    1: { zh: '向东', en: 'East' },
    2: { zh: '向南', en: 'South' },
    3: { zh: '向西', en: 'West' }
};

// 获取双语方向名称
function getDirectionText(direction) {
    const dir = DIRECTION_NAMES[direction];
    return `${dir.en} ${dir.zh}`;
}

// 建筑物定义
const BUILDINGS_EASY = [
    { 
        icon: '🏫', 
        name: '学校', 
        nameEn: 'School', 
        pos: [[0,0], [0,1], [1,0], [1,1]],
        description: '欢迎来到学校！这里是学生们学习知识、成长成才的地方。',
        items: [
            { icon: '📚', name: '教室' },
            { icon: '🎸', name: '音乐室' },
            { icon: '⚽', name: '操场' },
            { icon: '💻', name: '电脑室' }
        ]
    },
    { 
        icon: '🏪', 
        name: '商店', 
        nameEn: 'Shop', 
        pos: [[0,3], [0,4], [1,3], [1,4]],
        description: '欢迎光临！这里有各种商品，满足你的日常需求。',
        items: [
            { icon: '🍎', name: '食品区' },
            { icon: '👔', name: '服装区' },
            { icon: '🎮', name: '玩具区' },
            { icon: '📱', name: '电子产品' }
        ]
    },
    { 
        icon: '🏛️', 
        name: '博物馆', 
        nameEn: 'Museum', 
        pos: [[0,6], [0,7], [1,6], [1,7]],
        description: '欢迎参观博物馆！这里展示着丰富的历史文化珍品。',
        items: [
            { icon: '🏺', name: '古代文物' },
            { icon: '🖼️', name: '艺术展厅' },
            { icon: '🦕', name: '自然馆' },
            { icon: '🚀', name: '科技馆' }
        ]
    },
    { 
        icon: '🏥', 
        name: '医院', 
        nameEn: 'Hospital', 
        pos: [[3,0], [3,1], [4,0], [4,1]],
        description: '欢迎来到医院！这里提供专业的医疗服务和健康护理。',
        items: [
            { icon: '👨‍⚕️', name: '门诊' },
            { icon: '🛌', name: '住院部' },
            { icon: '💊', name: '药房' },
            { icon: '🩺', name: '急诊室' }
        ]
    },
    { 
        icon: '🏢', 
        name: '办公楼', 
        nameEn: 'Office', 
        pos: [[3,3], [3,4], [4,3], [4,4]],
        description: '欢迎光临办公楼！这里是专业的办公场所。',
        items: [
            { icon: '💼', name: '会议室' },
            { icon: '🖥️', name: '办公区' },
            { icon: '☕', name: '茶水间' },
            { icon: '📊', name: '总经理室' }
        ]
    },
    { 
        icon: '🏨', 
        name: '酒店', 
        nameEn: 'Hotel', 
        pos: [[3,6], [3,7], [4,6], [4,7]],
        description: '欢迎入住酒店！这里提供舒适的住宿体验。',
        items: [
            { icon: '🛌', name: '客房' },
            { icon: '🍽️', name: '餐厅' },
            { icon: '🏊', name: '游泳池' },
            { icon: '🏋️', name: '健身房' }
        ]
    },
    { 
        icon: '🌳', 
        name: '公园', 
        nameEn: 'Park', 
        pos: [[6,0], [6,1], [7,0], [7,1]],
        description: '欢迎来到公园！这里是放松和享受自然的好地方。',
        items: [
            { icon: '🌺', name: '花园' },
            { icon: '⛲', name: '喷泉' },
            { icon: '🦺', name: '长椅' },
            { icon: '🏞️', name: '湖泊' }
        ]
    },
    { 
        icon: '🍔', 
        name: '餐厅', 
        nameEn: 'Restaurant', 
        pos: [[6,3], [6,4], [7,3], [7,4]],
        description: '欢迎光临餐厅！这里提供各种美味佳肴。',
        items: [
            { icon: '🍕', name: '主食区' },
            { icon: '🍰', name: '甘点区' },
            { icon: '🥤', name: '饮品区' },
            { icon: '🍽️', name: '就餐区' }
        ]
    },
    { 
        icon: '📚', 
        name: '图书馆', 
        nameEn: 'Library', 
        pos: [[6,6], [6,7], [7,6], [7,7]],
        description: '欢迎来到图书馆！这里有丰富的图书资源。',
        items: [
            { icon: '📖', name: '阅览室' },
            { icon: '💻', name: '电子阅览' },
            { icon: '🎓', name: '学习区' },
            { icon: '🧑‍🏫', name: '咨询台' }
        ]
    }
];

const BUILDINGS_HARD = [
    { icon: '🏫', name: '学校', nameEn: 'School', pos: [[0,0], [0,1], [1,0], [1,1]] },
    { icon: '🏪', name: '商店', nameEn: 'Shop', pos: [[0,3], [0,4], [1,3], [1,4]] },
    { icon: '🏛️', name: '博物馆', nameEn: 'Museum', pos: [[0,6], [0,7], [1,6], [1,7]] },
    { icon: '🏦', name: '银行', nameEn: 'Bank', pos: [[0,9], [0,10], [0,11], [1,9], [1,10], [1,11]] },
    { icon: '🏥', name: '医院', nameEn: 'Hospital', pos: [[3,0], [3,1], [4,0], [4,1]] },
    { icon: '🏢', name: '办公楼', nameEn: 'Office', pos: [[3,3], [3,4], [4,3], [4,4]] },
    { icon: '🏨', name: '酒店', nameEn: 'Hotel', pos: [[3,6], [3,7], [4,6], [4,7]] },
    { icon: '⛪', name: '教堂', nameEn: 'Church', pos: [[3,9], [3,10], [3,11], [4,9], [4,10], [4,11]] },
    { icon: '🌳', name: '公园', nameEn: 'Park', pos: [[6,0], [6,1], [7,0], [7,1]] },
    { icon: '🍔', name: '餐厅', nameEn: 'Restaurant', pos: [[6,3], [6,4], [7,3], [7,4]] },
    { icon: '📚', name: '图书馆', nameEn: 'Library', pos: [[6,6], [6,7], [7,6], [7,7]] },
    { icon: '🎭', name: '剧院', nameEn: 'Theater', pos: [[6,9], [6,10], [6,11], [7,9], [7,10], [7,11]] },
    { icon: '🏬', name: '购物中心', nameEn: 'Mall', pos: [[9,0], [9,1], [10,0], [10,1]] },
    { icon: '🏰', name: '城堡', nameEn: 'Castle', pos: [[9,3], [9,4], [10,3], [10,4]] },
    { icon: '🎪', name: '游乐场', nameEn: 'Amusement', pos: [[9,6], [9,7], [10,6], [10,7]] },
    { icon: '🏟️', name: '体育馆', nameEn: 'Stadium', pos: [[9,9], [9,10], [9,11], [10,9], [10,10], [10,11]] }
];

// 宝箱奖励系统
const TREASURE_REWARDS = [
    { id: 1, name: '免作业1次', icon: '📝', emoji: '✨' },
    { id: 2, name: '糖果1个', icon: '🍬', emoji: '🎀' },
    { id: 3, name: '一支笔', icon: '✏️', emoji: '🎨' }
];

const PRAISE_WORDS = [
    '你真棒！继续加油！🌟',
    '你是最聪明的孩子！💝',
    '太厉害了！你做得真好！🎉',
    '你是小天才！⭐',
    '真是太优秀了！继续努力！🏆',
    '你的表现超级棒！💖',
    '好孩子，你真行！🌈',
    '你太聪明了！👏'
];

// 游戏状态
class Game {
    constructor() {
        this.difficulty = 'easy'; // easy, hard
        this.mode = 'single'; // single, double, timed
        this.gridSize = 8;
        this.playerPos = { row: 6, col: 2 };
        this.playerDirection = DIRECTIONS.NORTH;
        this.currentDestination = null;
        this.score = 0;
        this.highScore = parseInt(localStorage.getItem('highScore') || '0');
        this.steps = 0;
        this.time = 0;
        this.currentMissionTime = 0;  // 当前任务用时（独立计时）
        this.currentMissionSteps = 0; // 当前任务步数（独立计数）
        this.timer = null;
        this.isGameStarted = false;
        this.isPaused = false;
        this.isWaitingForFirstMove = false;  // 是否等待第一次移动（用于延迟开始计时）
        this.combo = 0;
        this.missions = [];
        this.currentMissionIndex = 0;
        this.currentTreasureOpened = false; // 当前目标的宝箱是否已打开
        
        // 双人模式数据
        this.player1 = {
            pos: { row: 6, col: 2 },
            direction: DIRECTIONS.NORTH,
            icon: '🚶',
            color: '#667eea',
            name: 'Player 1 玩家1',
            score: 0,
            roundsWon: 0,
            currentSteps: 0
        };
        
        this.player2 = {
            pos: { row: 6, col: 5 },
            direction: DIRECTIONS.NORTH,
            icon: '🏃',
            color: '#e74c3c',
            name: 'Player 2 玩家2',
            score: 0,
            roundsWon: 0,
            currentSteps: 0
        };
        
        this.currentPlayer = 1;  // 当前操作的玩家 (1 或 2)
        this.roundNumber = 1;    // 当前回合
        this.maxRounds = 3;      // 总回合数（3局2胜）
        this.roundStartTime = 0; // 本轮开始时间
        
        // 用户ID（用于排行榜）
        this.userId = this.getUserId();
        
        // 宝箱抽奖系统
        this.initTreasureSystem();
        
        this.init();
    }

    getUserId() {
        // 获取或生成用户ID
        let userId = localStorage.getItem('userId');
        if (!userId) {
            // 生成唯一ID：时间戳 + 随机数
            userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('userId', userId);
        }
        return userId;
    }

    maskUserId(userId) {
        // 用户ID脱敏：显示为 Player_XXX
        const hash = userId.split('_').pop();
        return 'Player_' + hash.substring(0, 6).toUpperCase();
    }

    init() {
        this.setupEventListeners();
        this.updateHighScore();
        this.renderMap();
        this.setupAdminPanel();
    }

    initTreasureSystem() {
        // 初始化宝箱系统
        const today = new Date().toDateString();
        const savedData = localStorage.getItem('treasureData');
        
        if (savedData) {
            const data = JSON.parse(savedData);
            if (data.date === today) {
                // 同一天，使用保存的数据
                this.dailyRewardsGiven = data.rewardsGiven || 0;
                this.treasureRewards = data.rewards || [...TREASURE_REWARDS];
            } else {
                // 新的一天，重置
                this.resetDailyRewards();
            }
        } else {
            this.resetDailyRewards();
        }
    }

    resetDailyRewards() {
        this.dailyRewardsGiven = 0; // 已发放的奖励数量
        this.treasureRewards = [...TREASURE_REWARDS];
        this.saveTreasureData();
    }

    saveTreasureData() {
        const today = new Date().toDateString();
        const data = {
            date: today,
            rewardsGiven: this.dailyRewardsGiven,
            rewards: this.treasureRewards
        };
        localStorage.setItem('treasureData', JSON.stringify(data));
    }

    setupAdminPanel() {
        // 管理员配置按钮
        const adminBtn = document.getElementById('adminBtn');
        const adminPanel = document.getElementById('adminPanel');
        const adminPwdInput = document.getElementById('adminPassword');
        const adminLoginBtn = document.getElementById('adminLogin');
        const adminContent = document.getElementById('adminContent');
        const closeAdminBtn = document.getElementById('closeAdmin');
        const resetRewardsBtn = document.getElementById('resetRewards');
        const saveRewardsBtn = document.getElementById('saveRewards');

        adminBtn.addEventListener('click', () => {
            adminPanel.classList.add('active');
        });

        closeAdminBtn.addEventListener('click', () => {
            adminPanel.classList.remove('active');
            adminContent.style.display = 'none';
            adminPwdInput.value = '';
            document.querySelector('.admin-login').style.display = 'block';
        });

        adminLoginBtn.addEventListener('click', () => {
            if (adminPwdInput.value === '678678') {
                document.querySelector('.admin-login').style.display = 'none';
                adminContent.style.display = 'block';
                this.loadAdminRewards();
            } else {
                alert('密码错误！');
                adminPwdInput.value = '';
            }
        });

        resetRewardsBtn.addEventListener('click', () => {
            if (confirm('确定要重置今日奖励吗？')) {
                this.resetDailyRewards();
                this.loadAdminRewards();
                alert('奖励已重置！');
            }
        });

        saveRewardsBtn.addEventListener('click', () => {
            this.saveAdminRewards();
        });
    }

    loadAdminRewards() {
        const remainingRewards = 3 - this.dailyRewardsGiven;
        document.getElementById('rewardsLeftCount').textContent = remainingRewards;
        
        const rewardInputs = document.getElementById('rewardInputs');
        rewardInputs.innerHTML = '';
        
        this.treasureRewards.forEach((reward, index) => {
            const div = document.createElement('div');
            div.className = 'reward-input-item';
            div.innerHTML = `
                <label>奖励${index + 1}:</label>
                <input type="text" class="reward-icon" value="${reward.icon}" placeholder="图标" maxlength="2">
                <input type="text" class="reward-name" value="${reward.name}" placeholder="奖励名称">
            `;
            rewardInputs.appendChild(div);
        });
    }

    saveAdminRewards() {
        const items = document.querySelectorAll('.reward-input-item');
        items.forEach((item, index) => {
            const icon = item.querySelector('.reward-icon').value.trim();
            const name = item.querySelector('.reward-name').value.trim();
            if (icon && name) {
                this.treasureRewards[index].icon = icon;
                this.treasureRewards[index].name = name;
            }
        });
        this.saveTreasureData();
        alert('奖励配置已保存！');
    }

    setupEventListeners() {
        // 检查是否在僵尸模式页面
        const isZombieMode = document.title && document.title.includes('僵尸模式');
        
        // 如果在僵尸模式页面，不绑定按钮事件（由僵尸模式自己处理）
        if (isZombieMode) return;

        // 难度选择
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.changeDifficulty(e.target.dataset.difficulty);
            });
        });

        // 游戏模式选择
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (!this.isGameStarted) {
                    document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
                    e.target.classList.add('active');
                    this.mode = e.target.dataset.mode;
                    this.updateUIForMode();
                }
            });
        });

        // 控制按钮
        document.getElementById('btnTurnLeft').addEventListener('click', () => this.turnLeft());
        document.getElementById('btnTurnRight').addEventListener('click', () => this.turnRight());
        document.getElementById('btnGoStraight').addEventListener('click', () => this.goStraight());

        // 操作按钮
        const btnStart = document.getElementById('btnStart');
        if (btnStart) btnStart.addEventListener('click', () => this.startGame());
        
        const btnRestart = document.getElementById('btnRestart');
        if (btnRestart) btnRestart.addEventListener('click', () => this.restartGame());
        
        const btnPause = document.getElementById('btnPause');
        if (btnPause) btnPause.addEventListener('click', () => this.togglePause());
        
        const btnHint = document.getElementById('btnHint');
        if (btnHint) btnHint.addEventListener('click', () => this.showHint());

        // 其他按钮
        const btnLeaderboard = document.getElementById('btnLeaderboard');
        if (btnLeaderboard) btnLeaderboard.addEventListener('click', () => {
            this.showLeaderboard();
        });
        
        const btnSettings = document.getElementById('btnSettings');
        if (btnSettings) btnSettings.addEventListener('click', () => {
            // 打开管理员配置面板
            const adminPanel = document.getElementById('adminPanel');
            if (adminPanel) adminPanel.classList.add('active');
        });

        // 排行榜相关
        const closeLeaderboard = document.getElementById('closeLeaderboard');
        if (closeLeaderboard) {
            closeLeaderboard.addEventListener('click', () => {
                const leaderboardModal = document.getElementById('leaderboardModal');
                if (leaderboardModal) leaderboardModal.classList.remove('active');
            });
        }
        
        // 使用querySelectorAll更安全，即使没有元素也不会出错
        document.querySelectorAll('.leaderboard-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                document.querySelectorAll('.leaderboard-tab').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                this.currentLeaderboardTab = e.target.dataset.tab;
                this.updateLeaderboardDisplay();
            });
        });

        // 难度筛选选项卡
        document.querySelectorAll('.difficulty-filter-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                document.querySelectorAll('.difficulty-filter-tab').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                this.currentDifficultyFilter = e.target.dataset.difficulty;
                this.updateLeaderboardDisplay();
            });
        });

        const clearLeaderboard = document.getElementById('clearLeaderboard');
        if (clearLeaderboard) {
            clearLeaderboard.addEventListener('click', () => {
                this.showConfirmDialog(
                    '🧹 清空数据？ Clear Data?',
                    '确定要清空所有排行榜数据吗？此操作不可恢复！<br><small>Are you sure to clear all leaderboard data? This cannot be undone!</small>',
                    () => {
                        localStorage.removeItem('leaderboard');
                        this.showLeaderboard();
                        this.showNotification('✅ 排行榜数据已清空！<br>Leaderboard cleared!', 'success');
                    }
                );
            });
        }

        // 建筑内部相关
        const closeInterior = document.getElementById('closeInterior');
        if (closeInterior) closeInterior.addEventListener('click', () => this.closeBuilding());
        
        const btnExitBuilding = document.getElementById('btnExitBuilding');
        if (btnExitBuilding) btnExitBuilding.addEventListener('click', () => this.closeBuilding());

        // 宝箱相关
        const closeTreasure = document.getElementById('closeTreasure');
        if (closeTreasure) closeTreasure.addEventListener('click', () => this.closeTreasureBox());

        // 键盘控制
        document.addEventListener('keydown', (e) => {
            if (!this.isGameStarted || this.isPaused) return;
            
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    e.stopPropagation();
                    this.turnLeft();
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    e.stopPropagation();
                    this.goStraight();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    e.stopPropagation();
                    this.turnRight();
                    break;
            }
        });
    }

    changeDifficulty(difficulty) {
        if (this.isGameStarted) return;
        
        if (difficulty === 'zombie') {
            // 跳转到僵尸模式页面
            window.location.href = 'zombie-mode.html';
            return;
        }
        
        this.difficulty = difficulty;
        this.gridSize = difficulty === 'easy' ? 8 : 12;
        
        // 更新UI
        const body = document.body;
        const badge = document.getElementById('difficultyBadge');
        const btnHint = document.getElementById('btnHint');
        const hintBox = document.getElementById('hintBox');
        
        if (difficulty === 'hard') {
            body.classList.add('hard-mode');
            if (badge) {
                badge.textContent = '🔥 Hard Mode 困难模式';
                badge.style.display = 'inline-block';
            }
            if (btnHint) btnHint.style.display = 'inline-block';
            
            // 更新提示文本
            if (hintBox) {
                hintBox.innerHTML = `
                    Hard Mode Challenge 困难模式挑战：
                    
                    <br>• One-way street restrictions 单行道限制
                    <br>• Multiple missions challenge 多任务连续挑战
                    <div class="keyboard-hints">
                        <span class="key">⬅️ Turn Left 左转</span>
                        <span class="key">⬆️ Go Straight 前进</span>
                        <span class="key">➡️ Turn Right 右转</span>
                    </div>
                `;
            }
        } else {
            body.classList.remove('hard-mode');
            if (badge) badge.style.display = 'none';
            if (btnHint) btnHint.style.display = 'none';
            
            // 恢复简单模式提示文本
            if (hintBox) {
                hintBox.innerHTML = `
                    Use direction buttons or keyboard arrow keys to control character movement, reach the destination to get points! 使用方向按钮或键盘方向键控制角色移动，到达目标地点获得分数！
                    <div class="keyboard-hints">
                        <span class="key">⬅️ Turn Left 左转</span>
                        <span class="key">⬆️ Go Straight 前进</span>
                        <span class="key">➡️ Turn Right 右转</span>
                    </div>
                `;
            }
        }
        
        this.renderMap();
    }

    updateUIForMode() {
        const timeLabel = document.getElementById('timeLabel');
        
        if (this.mode === 'timed') {
            timeLabel.textContent = 'Time Left 剩余时间';
        } else {
            timeLabel.textContent = 'Time 时间';
        }
        
        // 双人模式信息仅在弹窗中显示，不在游戏底部显示
        // 不再需要显示/隐藏双人模式UI
    }

    renderMap() {
        const mapGrid = document.getElementById('mapGrid');
        mapGrid.innerHTML = '';
        
        const buildings = this.difficulty === 'easy' ? BUILDINGS_EASY : BUILDINGS_HARD;
        const map = this.createMapLayout();
        
        for (let row = 0; row < this.gridSize; row++) {
            for (let col = 0; col < this.gridSize; col++) {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                
                const cellType = map[row][col];
                
                if (cellType.type === 'building') {
                    cell.classList.add('building');
                    const building = buildings[cellType.buildingIndex];
                    const isMainCell = building.pos[0][0] === row && building.pos[0][1] === col;
                    
                    // 添加英文名称属性，用于悬停显示
                    cell.dataset.nameEn = building.nameEn;
                    
                    cell.innerHTML = `<span class="building-icon">${building.icon}</span>`;
                    if (isMainCell) {
                        cell.innerHTML += `<span class="building-label">${building.name}</span>`;
                    }
                } else if (cellType.type === 'road') {
                    cell.classList.add('road');
                    if (cellType.vertical) {
                        cell.classList.add('road-vertical');
                    }
                    if (cellType.intersection) {
                        cell.classList.add('road-intersection');
                    }
                    if (cellType.oneway) {
                        cell.classList.add('oneway');
                        if (cellType.onewayDir === 'up') cell.classList.add('oneway-up');
                        if (cellType.onewayDir === 'down') cell.classList.add('oneway-down');
                        if (cellType.onewayDir === 'left') cell.classList.add('oneway-left');
                    }
                    if (cellType.trafficLight) {
                        cell.innerHTML = this.createTrafficLight(cellType.trafficLight);
                    }
                } else if (cellType.type === 'obstacle') {
                    cell.classList.add('obstacle');
                    cell.innerHTML = '<span class="obstacle-icon">🚧</span>';
                }
                
                mapGrid.appendChild(cell);
            }
        }
        
        this.updatePlayerPosition();
    }

    createMapLayout() {
        const size = this.gridSize;
        const map = Array(size).fill(null).map(() => Array(size).fill({ type: 'empty' }));
        
        if (this.difficulty === 'easy') {
            return this.createEasyMap(map);
        } else {
            return this.createHardMap(map);
        }
    }

    createEasyMap(map) {
        const buildings = BUILDINGS_EASY;
        
        // 放置建筑物
        buildings.forEach((building, index) => {
            building.pos.forEach(([row, col]) => {
                map[row][col] = { type: 'building', buildingIndex: index };
            });
        });
        
        // 创建道路 - 第3行和第6行（横向）
        for (let col = 0; col < 8; col++) {
            map[2][col] = { type: 'road', vertical: false };
            map[5][col] = { type: 'road', vertical: false };
        }
        
        // 创建道路 - 第3列和第6列（纵向）
        for (let row = 0; row < 8; row++) {
            map[row][2] = { type: 'road', vertical: true };
            map[row][5] = { type: 'road', vertical: true };
        }
        
        // 创建路口
        map[2][2] = { type: 'road', intersection: true };
        map[2][5] = { type: 'road', intersection: true };
        map[5][2] = { type: 'road', intersection: true };
        map[5][5] = { type: 'road', intersection: true };
        
        return map;
    }

    createHardMap(map) {
        const buildings = BUILDINGS_HARD;
        
        // 放置建筑物
        buildings.forEach((building, index) => {
            building.pos.forEach(([row, col]) => {
                map[row][col] = { type: 'building', buildingIndex: index };
            });
        });
        
        // 创建道路 - 横向（第3, 6, 9, 12行）
        for (let col = 0; col < 12; col++) {
            map[2][col] = { type: 'road', vertical: false };
            map[5][col] = { type: 'road', vertical: false };
            map[8][col] = { type: 'road', vertical: false };
            map[11][col] = { type: 'road', vertical: false };
        }
        
        // 创建道路 - 纵向（第3, 6, 9列）
        for (let row = 0; row < 12; row++) {
            map[row][2] = { type: 'road', vertical: true };
            map[row][5] = { type: 'road', vertical: true };
            map[row][8] = { type: 'road', vertical: true };
        }
        
        // 添加单行道
        map[1][2] = { type: 'road', vertical: true, oneway: true, onewayDir: 'up' };
        map[3][2] = { type: 'road', vertical: true, oneway: true, onewayDir: 'up' };
        map[4][2] = { type: 'road', vertical: true, oneway: true, onewayDir: 'up' };
        
        map[7][5] = { type: 'road', vertical: true, oneway: true, onewayDir: 'down' };
        map[9][5] = { type: 'road', vertical: true, oneway: true, onewayDir: 'down' };
        map[10][5] = { type: 'road', vertical: true, oneway: true, onewayDir: 'down' };
        
        map[8][3] = { type: 'road', vertical: false, oneway: true };
        map[8][4] = { type: 'road', vertical: false, oneway: true };
        
        // 创建路口并添加红绿灯
        const intersections = [
            [2, 2], [2, 5], [2, 8],
            [5, 2], [5, 5], [5, 8],
            [8, 2], [8, 5], [8, 8],
            [11, 2], [11, 5], [11, 8]
        ];
        
        intersections.forEach(([row, col]) => {
            // 随机决定红绿灯的位置
            const positions = ['top', 'bottom', 'left', 'right'];
            const randomPosition = positions[Math.floor(Math.random() * positions.length)];
            
            map[row][col] = { type: 'road', intersection: true, trafficLight: randomPosition };
        });
        
        // 添加障碍物
        map[4][5] = { type: 'obstacle' };
        map[5][4] = { type: 'obstacle' };
        
        return map;
    }

    createTrafficLight(position) {
        const colors = ['red', 'yellow', 'green'];
        const activeColor = colors[Math.floor(Math.random() * 3)];
        
        return `
            <div class="traffic-light ${position}">
                <div class="light ${activeColor === 'red' ? 'red' : ''}"></div>
                <div class="light ${activeColor === 'yellow' ? 'yellow' : ''}"></div>
                <div class="light ${activeColor === 'green' ? 'green' : ''}"></div>
            </div>
        `;
    }

    startGame() {
        this.isGameStarted = true;
        
        // 双人模式初始化
        if (this.mode === 'double') {
            this.initDoubleMode();
            // 不再创建双人模式UI，信息仅在弹窗中显示
        } else {
            // 单人模式
            this.score = 0;
            this.steps = 0;
            this.time = this.mode === 'timed' ? 180 : 0;
            this.currentMissionTime = 0;
            this.currentMissionSteps = 0;
            this.combo = 0;
            this.currentMissionIndex = 0;
            
            // 重置玩家位置
            this.playerPos = { row: 6, col: 2 };
            this.playerDirection = DIRECTIONS.NORTH;
        }
        
        // 困难模式初始化任务
        if (this.difficulty === 'hard') {
            this.initMissions();
            document.getElementById('missionPanel').style.display = 'block';
            document.getElementById('comboStat').style.display = 'flex';
            document.getElementById('taskTitle').textContent = 'Current Mission 当前任务';
        } else {
            document.getElementById('missionPanel').style.display = 'none';
            document.getElementById('comboStat').style.display = 'none';
            document.getElementById('taskTitle').textContent = 'Destination 目标地点';
        }
        
        // 生成目标
        this.generateDestination();
        
        // 更新UI
        const btnStart = document.getElementById('btnStart');
        if (btnStart) btnStart.disabled = true;
        
        const btnRestart = document.getElementById('btnRestart');
        if (btnRestart) btnRestart.disabled = false;
        
        const btnPause = document.getElementById('btnPause');
        if (btnPause) btnPause.disabled = false;
        
        const btnTurnLeft = document.getElementById('btnTurnLeft');
        if (btnTurnLeft) btnTurnLeft.disabled = false;
        
        const btnGoStraight = document.getElementById('btnGoStraight');
        if (btnGoStraight) btnGoStraight.disabled = false;
        
        const btnTurnRight = document.getElementById('btnTurnRight');
        if (btnTurnRight) btnTurnRight.disabled = false;
        
        this.updateStats();
        this.updatePlayerPosition();
        this.updateDirection();
        
        // 启动计时器
        this.startTimer();
    }
    
    // 双人模式初始化
    initDoubleMode() {
        this.roundNumber = 1;
        this.currentPlayer = 1;
        this.roundStartTime = Date.now();
        this.isWaitingForFirstMove = true;
        
        // 重置双方玩家数据
        this.player1 = {
            pos: { row: 6, col: 2 },
            direction: DIRECTIONS.NORTH,
            icon: '🚶',
            color: '#667eea',
            name: 'Player 1 玩家1',
            score: 0,
            roundsWon: 0,
            currentSteps: 0
        };
        
        this.player2 = {
            pos: { row: 6, col: 5 },
            direction: DIRECTIONS.NORTH,
            icon: '🏃',
            color: '#e74c3c',
            name: 'Player 2 玩家2',
            score: 0,
            roundsWon: 0,
            currentSteps: 0
        };
        
        // 生成目标地点
        this.generateDestination();
        
        // 不再在游戏底部显示双人模式UI
        // this.updateDoubleModeUI();
    }

    initMissions() {
        const buildings = BUILDINGS_HARD;
        const missionBuildings = buildings.filter(b => 
            !['学校'].includes(b.name)
        ).sort(() => Math.random() - 0.5).slice(0, 5);
        
        this.missions = missionBuildings.map((b, i) => ({
            building: b,
            completed: false,
            index: i
        }));
        
        this.updateMissionList();
    }

    updateMissionList() {
        const list = document.getElementById('missionList');
        list.innerHTML = '';
        
        this.missions.forEach((mission, index) => {
            const item = document.createElement('div');
            item.className = 'mission-item';
            
            if (mission.completed) {
                item.classList.add('completed');
                item.textContent = `✅ ${index + 1}. Go to ${mission.building.nameEn} 前往${mission.building.name} (Completed 已完成)`;
            } else if (index === this.currentMissionIndex) {
                item.classList.add('active');
                item.textContent = `🎯 ${index + 1}. Reach ${mission.building.nameEn} 抵达${mission.building.name} (In Progress 进行中)`;
            } else {
                item.textContent = `⏳ ${index + 1}. Go to ${mission.building.nameEn} 前往${mission.building.name}`;
            }
            
            list.appendChild(item);
        });
        
        const completed = this.missions.filter(m => m.completed).length;
        const missionProgress = document.getElementById('missionProgress');
        if (missionProgress) missionProgress.textContent = `(${completed}/${this.missions.length})`;
    }

    generateDestination() {
        const buildings = this.difficulty === 'easy' ? BUILDINGS_EASY : BUILDINGS_HARD;
        
        if (this.difficulty === 'hard' && this.missions.length > 0) {
            // 困难模式使用任务列表
            if (this.currentMissionIndex < this.missions.length) {
                this.currentDestination = this.missions[this.currentMissionIndex].building;
            }
        } else {
            // 简单模式
            if (this.mode === 'double') {
                // 双人模式：选择距离当前玩家最远的建筑
                this.currentDestination = this.getFarthestBuildingPosition();
            } else {
                // 单人模式：随机选择
                let destination;
                do {
                    destination = buildings[Math.floor(Math.random() * buildings.length)];
                } while (destination === this.currentDestination);
                
                this.currentDestination = destination;
            }
        }
        
        // 选择一个边界格子作为目标点
        this.selectBorderCell();
        
        // 更新UI
        const destinationName = document.getElementById('destinationName');
        if (destinationName) destinationName.textContent = this.currentDestination.name;
        
        const destinationNameEn = document.getElementById('destinationNameEn');
        if (destinationNameEn) destinationNameEn.textContent = this.currentDestination.nameEn;
        
        if (this.difficulty === 'hard') {
            const distance = this.calculateDistance();
            const destinationDistance = document.getElementById('destinationDistance');
            if (destinationDistance) {
                destinationDistance.textContent = `📍 预计距离: ${distance}个街区`;
                destinationDistance.style.display = 'block';
            }
        }
        
        this.updateDestinationMarker();
    }

    selectBorderCell() {
        // 获取建筑的边界格子（靠近道路的格子）
        const borderCells = this.getBorderCells(this.currentDestination.pos);
        
        if (borderCells.length > 0) {
            // 随机选择一个边界格子
            const selectedCell = borderCells[Math.floor(Math.random() * borderCells.length)];
            this.currentDestination.targetPos = selectedCell;
        } else {
            // 如果没有边界格子，使用第一个格子
            this.currentDestination.targetPos = this.currentDestination.pos[0];
        }
        
        // 添加调试信息
        console.log('选择的目标位置:', this.currentDestination.targetPos);
    }

    getBorderCells(positions) {
        // 返回靠近道路的边界格子
        const borderCells = [];
        
        positions.forEach(([row, col]) => {
            // 检查四个方向是否有道路
            const directions = [
                [row - 1, col], // 上
                [row + 1, col], // 下
                [row, col - 1], // 左
                [row, col + 1]  // 右
            ];
            
            for (const [r, c] of directions) {
                // 检查是否在地图范围内
                if (r >= 0 && r < this.gridSize && c >= 0 && c < this.gridSize) {
                    const cell = document.querySelector(`[data-row="${r}"][data-col="${c}"]`);
                    if (cell && cell.classList.contains('road')) {
                        // 这个格子靠近道路，是边界格子
                        if (!borderCells.some(([br, bc]) => br === row && bc === col)) {
                            borderCells.push([row, col]);
                        }
                        break;
                    }
                }
            }
        });
        
        return borderCells;
    }

    calculateDistance() {
        const destPos = this.currentDestination.targetPos || this.currentDestination.pos[0];
        return Math.abs(this.playerPos.row - destPos[0]) + Math.abs(this.playerPos.col - destPos[1]);
    }
    
    // 计算两个位置之间的曼哈顿距离
    calculateManhattanDistance(pos1, pos2) {
        return Math.abs(pos1.row - pos2.row) + Math.abs(pos1.col - pos2.col);
    }
    
    // 获取距离玩家最远的建筑位置
    getFarthestBuildingPosition() {
        const buildings = this.difficulty === 'easy' ? BUILDINGS_EASY : BUILDINGS_HARD;
        
        // 获取当前玩家位置（双人模式下获取当前玩家位置）
        let playerPos;
        if (this.mode === 'double') {
            const currentPlayer = this.currentPlayer === 1 ? this.player1 : this.player2;
            playerPos = currentPlayer.pos;
        } else {
            playerPos = this.playerPos;
        }
        
        let farthestBuilding = null;
        let maxDistance = -1;
        
        // 遍历所有建筑，找到距离玩家最远的建筑
        buildings.forEach(building => {
            // 计算建筑中心点
            let centerRow = 0, centerCol = 0;
            building.pos.forEach(([row, col]) => {
                centerRow += row;
                centerCol += col;
            });
            centerRow /= building.pos.length;
            centerCol /= building.pos.length;
            
            const buildingCenter = { row: centerRow, col: centerCol };
            const distance = this.calculateManhattanDistance(playerPos, buildingCenter);
            
            if (distance > maxDistance) {
                maxDistance = distance;
                farthestBuilding = building;
            }
        });
        
        return farthestBuilding;
    }

    updateDestinationMarker() {
        // 移除旧标记
        document.querySelectorAll('.destination-marker').forEach(m => m.remove());
        
        // 添加新标记（使用边界格子）
        if (this.currentDestination) {
            const targetPos = this.currentDestination.targetPos || this.currentDestination.pos[0];
            const cell = document.querySelector(`[data-row="${targetPos[0]}"][data-col="${targetPos[1]}"]`);
            if (cell) {
                const marker = document.createElement('span');
                marker.className = 'destination-marker';
                marker.textContent = '🎯';
                cell.appendChild(marker);
            }
        }
    }

    startTimer() {
        if (this.timer) clearInterval(this.timer);
        
        this.timer = setInterval(() => {
            if (this.isPaused) return;
            
            // 如果在等待第一次移动，不计时
            if (this.isWaitingForFirstMove) return;
            
            if (this.mode === 'timed') {
                this.time--;
                if (this.time <= 0) {
                    this.gameOver();
                    return;
                }
            } else {
                this.time++;  // 总时间
                this.currentMissionTime++;  // 当前任务时间（独立计时）
            }
            
            // 在困难模式下控制红绿灯变化
            if (this.difficulty === 'hard') {
                this.updateTrafficLights();
            }
            
            this.updateStats();
        }, 1000);
    }

    updateStats() {
        const currentScore = document.getElementById('currentScore');
        if (currentScore) currentScore.textContent = this.score;
        
        const steps = document.getElementById('steps');
        if (steps) steps.textContent = this.currentMissionSteps;  // 显示当前任务步数
        
        const minutes = Math.floor(Math.abs(this.time) / 60);
        const seconds = Math.abs(this.time) % 60;
        const time = document.getElementById('time');
        if (time) time.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        if (this.difficulty === 'hard') {
            const combo = document.getElementById('combo');
            if (combo) combo.textContent = `×${this.combo}`;
        }
    }
    
    // 更新红绿灯状态（困难模式）
    updateTrafficLights() {
        // 获取所有红绿灯元素
        const trafficLights = document.querySelectorAll('.traffic-light');
        
        // 每5秒随机改变红绿灯状态
        if (this.time % 5 === 0) {
            trafficLights.forEach(light => {
                // 随机选择一个灯亮起
                const lights = light.querySelectorAll('.light');
                const randomIndex = Math.floor(Math.random() * 3);
                
                // 重置所有灯
                lights.forEach(l => {
                    l.style.opacity = '0.3';
                });
                
                // 点亮随机选择的灯
                lights[randomIndex].style.opacity = '1';
            });
        }
    }

    updateHighScore() {
        const highScore = document.getElementById('highScore');
        if (highScore) highScore.textContent = this.highScore;
    }

    updatePlayerPosition() {
        // 移除旧位置
        document.querySelectorAll('.player').forEach(p => p.remove());
        
        if (this.mode === 'double') {
            // 双人模式：显示两个玩家
            [this.player1, this.player2].forEach((player, index) => {
                const cell = document.querySelector(
                    `[data-row="${player.pos.row}"][data-col="${player.pos.col}"]`
                );
                
                if (cell) {
                    const playerEl = document.createElement('div');
                    playerEl.className = 'player';
                    if (this.currentPlayer === index + 1) {
                        playerEl.classList.add('active');
                    }
                    playerEl.style.color = player.color;
                    
                    // 添加方向箭头
                    const arrow = document.createElement('div');
                    arrow.className = 'player-arrow';
                    arrow.textContent = DIRECTION_ARROWS[player.direction];
                    arrow.style.color = player.color;
                    
                    // 添加人物图标
                    const icon = document.createElement('div');
                    icon.className = 'player-icon';
                    icon.textContent = player.icon;
                    
                    playerEl.appendChild(arrow);
                    playerEl.appendChild(icon);
                    cell.appendChild(playerEl);
                }
            });
        } else {
            // 单人模式
            const cell = document.querySelector(
                `[data-row="${this.playerPos.row}"][data-col="${this.playerPos.col}"]`
            );
            
            if (cell) {
                const player = document.createElement('div');
                player.className = 'player';
                
                // 添加方向箭头
                const arrow = document.createElement('div');
                arrow.className = 'player-arrow';
                arrow.textContent = DIRECTION_ARROWS[this.playerDirection];
                
                // 添加人物图标
                const icon = document.createElement('div');
                icon.className = 'player-icon';
                icon.textContent = '🚶';
                
                player.appendChild(arrow);
                player.appendChild(icon);
                cell.appendChild(player);
            }
        }
    }

    updateDirection() {
        const arrow = document.getElementById('directionArrow');
        const text = document.getElementById('directionText');
        
        if (this.mode === 'double') {
            const player = this.currentPlayer === 1 ? this.player1 : this.player2;
            arrow.textContent = DIRECTION_ARROWS[player.direction];
            text.textContent = getDirectionText(player.direction);
        } else {
            arrow.textContent = DIRECTION_ARROWS[this.playerDirection];
            text.textContent = getDirectionText(this.playerDirection);
        }
    }

    turnLeft() {
        if (!this.isGameStarted || this.isPaused) return;
        
        // 第一次移动时，开始计时
        if (this.isWaitingForFirstMove) {
            this.isWaitingForFirstMove = false;
        }
        
        if (this.mode === 'double') {
            // 双人模式
            const player = this.currentPlayer === 1 ? this.player1 : this.player2;
            player.direction = (player.direction + 3) % 4;
            player.currentSteps++;
            
            this.updatePlayerPosition();
            this.updateDirection();
            // 不再更新双人模式UI，信息仅在弹窗中显示
            // this.updateDoubleModeUI();
            
            // 切换玩家
            this.switchPlayer();
        } else {
            // 单人模式
            this.playerDirection = (this.playerDirection + 3) % 4;
            this.steps++;
            this.currentMissionSteps++;
            this.updateDirection();
            this.updatePlayerPosition();
            this.updateStats();
        }
    }

    turnRight() {
        if (!this.isGameStarted || this.isPaused) return;
        
        // 第一次移动时，开始计时
        if (this.isWaitingForFirstMove) {
            this.isWaitingForFirstMove = false;
        }
        
        if (this.mode === 'double') {
            // 双人模式
            const player = this.currentPlayer === 1 ? this.player1 : this.player2;
            player.direction = (player.direction + 1) % 4;
            player.currentSteps++;
            
            this.updatePlayerPosition();
            this.updateDirection();
            // 不再更新双人模式UI，信息仅在弹窗中显示
            // this.updateDoubleModeUI();
            
            // 切换玩家
            this.switchPlayer();
        } else {
            // 单人模式
            this.playerDirection = (this.playerDirection + 1) % 4;
            this.steps++;
            this.currentMissionSteps++;
            this.updateDirection();
            this.updatePlayerPosition();
            this.updateStats();
        }
    }

    goStraight() {
        if (!this.isGameStarted || this.isPaused) return;
        
        // 第一次移动时，开始计时
        if (this.isWaitingForFirstMove) {
            this.isWaitingForFirstMove = false;
        }
        
        if (this.mode === 'double') {
            // 双人模式
            const player = this.currentPlayer === 1 ? this.player1 : this.player2;
            
            let newRow = player.pos.row;
            let newCol = player.pos.col;
            
            switch(player.direction) {
                case DIRECTIONS.NORTH: newRow--; break;
                case DIRECTIONS.EAST: newCol++; break;
                case DIRECTIONS.SOUTH: newRow++; break;
                case DIRECTIONS.WEST: newCol--; break;
            }
            
            // 检查移动合法性
            if (!this.isValidMove(newRow, newCol, player.direction)) {
                return; // 非法移动，不切换玩家
            }
            
            // 移动成功
            player.pos.row = newRow;
            player.pos.col = newCol;
            player.currentSteps++;
            
            this.updatePlayerPosition();
            // 不再更新双人模式UI，信息仅在弹窗中显示
            // this.updateDoubleModeUI();
            
            // 检查是否到达终点
            if (this.checkPlayerReachedDestination(player)) {
                this.playerWinRound(this.currentPlayer);
                return; // 到达终点，不切换
            }
            
            // 关键：每步操作后切换玩家
            this.switchPlayer();
        } else {
            // 单人模式
            let newRow = this.playerPos.row;
            let newCol = this.playerPos.col;
            
            switch(this.playerDirection) {
                case DIRECTIONS.NORTH: newRow--; break;
                case DIRECTIONS.EAST: newCol++; break;
                case DIRECTIONS.SOUTH: newRow++; break;
                case DIRECTIONS.WEST: newCol--; break;
            }
            
            // 使用统一的移动合法性检查函数
            if (!this.isValidMove(newRow, newCol, this.playerDirection)) {
                return;
            }
            
            // 移动成功
            this.playerPos.row = newRow;
            this.playerPos.col = newCol;
            this.steps++;
            this.currentMissionSteps++;
            
            this.updatePlayerPosition();
            this.updateStats();
            
            // 检查是否到达目标
            this.checkDestination();
        }
    }

    checkOneway(cell, direction) {
        if (cell.classList.contains('oneway-up') && direction === DIRECTIONS.NORTH) return true;
        if (cell.classList.contains('oneway-down') && direction === DIRECTIONS.SOUTH) return true;
        if (cell.classList.contains('oneway-left') && direction === DIRECTIONS.WEST) return true;
        if (cell.classList.contains('oneway') && !cell.classList.contains('oneway-up') && 
            !cell.classList.contains('oneway-down') && !cell.classList.contains('oneway-left') && 
            direction === DIRECTIONS.EAST) return true;
        return false;
    }
    
    // 双人模式辅助方法
    
    // 检查移动是否合法
    isValidMove(newRow, newCol, direction) {
        // 检查是否越界
        if (newRow < 0 || newRow >= this.gridSize || newCol < 0 || newCol >= this.gridSize) {
            this.showMessage('⚠️ Can\'t go out of bounds! 不能越界！', 'warning');
            return false;
        }
        
        // 检查目标格子
        const cell = document.querySelector(`[data-row="${newRow}"][data-col="${newCol}"]`);
        if (!cell) return false;
        
        // 检查是否是目标建筑的🎯格子
        const targetPos = this.currentDestination.targetPos || this.currentDestination.pos[0];
        const isDestinationCell = this.currentDestination && 
            targetPos[0] === newRow && 
            targetPos[1] === newCol;
        
        // 检查是否是道路或目标格子
        if (!cell.classList.contains('road') && !isDestinationCell) {
            this.showMessage('⚠️ Can\'t go through buildings! 不能穿过建筑！', 'warning');
            return false;
        }
        
        // 检查是否是障碍物
        if (cell.classList.contains('obstacle')) {
            this.showMessage('⚠️ Construction ahead! 前方有障碍！', 'warning');
            return false;
        }
        
        // 检查单行道
        if (cell.classList.contains('oneway')) {
            const canPass = this.checkOneway(cell, direction);
            if (!canPass) {
                this.showMessage('⚠️ One-way street! 不能逆行！', 'warning');
                return false;
            }
        }
        
        // 检查红绿灯（仅在困难模式下）
        if (this.difficulty === 'hard') {
            const trafficLight = cell.querySelector('.traffic-light');
            if (trafficLight) {
                // 检查红绿灯状态
                const redLight = trafficLight.querySelector('.light.red');
                const yellowLight = trafficLight.querySelector('.light.yellow');
                const greenLight = trafficLight.querySelector('.light.green');
                
                // 如果是红灯或黄灯，禁止通行
                if (redLight && redLight.style.opacity !== '0.3') {
                    this.showMessage('🔴 红灯停！请等待绿灯。', 'warning');
                    return false;
                }
                
                if (yellowLight && yellowLight.style.opacity !== '0.3') {
                    this.showMessage('🟡 黄灯请注意！请等待绿灯。', 'warning');
                    return false;
                }
                
                // 绿灯可以通行
                if (greenLight && greenLight.style.opacity !== '0.3') {
                    // 可以通行
                }
            }
        }
        
        return true;
    }
    
    // 检查玩家是否到达终点
    checkPlayerReachedDestination(player) {
        const targetPos = this.currentDestination.targetPos || this.currentDestination.pos[0];
        return targetPos[0] === player.pos.row && targetPos[1] === player.pos.col;
    }
    
    // 切换玩家
    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
        // 不再更新双人模式UI，信息仅在弹窗中显示
        // this.updateDoubleModeUI();
        this.showPlayerSwitchNotification();
    }
    
    // 显示切换提示
    showPlayerSwitchNotification() {
        const player = this.currentPlayer === 1 ? this.player1 : this.player2;
        const banner = document.getElementById('playerSwitchBanner');
        
        if (!banner) {
            const newBanner = document.createElement('div');
            newBanner.id = 'playerSwitchBanner';
            newBanner.className = 'player-switch-banner';
            document.body.appendChild(newBanner);
        }
        
        const bannerEl = document.getElementById('playerSwitchBanner');
        bannerEl.textContent = `🔄 ${player.name} 的回合！${player.name.includes('1') ? 'Player 1' : 'Player 2'}\'s Turn!`;
        bannerEl.style.display = 'block';
        
        setTimeout(() => {
            bannerEl.style.display = 'none';
        }, 800);
    }
    
    // 玩家获胜回合
    playerWinRound(playerNum) {
        const winner = playerNum === 1 ? this.player1 : this.player2;
        
        // 停止计时
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        
        // 计算得分
        const timeTaken = Math.floor((Date.now() - this.roundStartTime) / 1000);
        const baseScore = 100;
        const stepBonus = Math.max(0, 50 - winner.currentSteps);
        const timeBonus = Math.max(0, 60 - timeTaken);
        const firstArriveBonus = 50;
        
        const roundScore = baseScore + stepBonus + timeBonus + firstArriveBonus;
        winner.score += roundScore;
        winner.roundsWon++;
        
        // 只显示toast提示获胜者，然后直接开始下一回合
        this.showMessage(`${winner.name} 获胜！`, 'success');
        
        // 延迟一段时间后开始下一回合
        setTimeout(() => {
            if (this.player1.roundsWon >= 2 || this.player2.roundsWon >= 2) {
                this.doubleGameComplete();
            } else {
                this.startNextRound();
            }
        }, 1500);
    }
    
    // 显示回合结算（已移除，逻辑已在playerWinRound中实现）
    showRoundResult(playerNum, roundScore, stepBonus, timeBonus, timeTaken) {
        // 此函数已废弃，保留为空以避免错误
    }
    
    // 显示优美的获胜弹窗
    showWinnerDialog(winner, loser, roundNum, roundScore, stepBonus, timeBonus, timeTaken) {
        const message = `
            <div class="winner-celebration">
                <div class="winner-trophy">🏆</div>
                <div class="winner-title">Round ${roundNum} 获胜者</div>
                <div class="winner-player">
                    <span class="winner-icon">${winner.icon}</span>
                    <span class="winner-name">${winner.name}</span>
                </div>
                
                <div class="round-stats">
                    <div class="stat-row">
                        <span class="stat-icon">⭐</span>
                        <span class="stat-label">本轮得分 Round Score:</span>
                        <span class="stat-value">+${roundScore}分</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-icon">👣</span>
                        <span class="stat-label">步数奖励 Step Bonus:</span>
                        <span class="stat-value">+${stepBonus}分</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-icon">⏱️</span>
                        <span class="stat-label">时间奖励 Time Bonus:</span>
                        <span class="stat-value">+${timeBonus}分</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-icon">🔥</span>
                        <span class="stat-label">先到奖励 First Arrival:</span>
                        <span class="stat-value">+50分</span>
                    </div>
                    <div class="stat-row stat-time">
                        <span class="stat-icon">⏰</span>
                        <span class="stat-label">用时 Time Taken:</span>
                        <span class="stat-value">${timeTaken}秒</span>
                    </div>
                </div>
                
                <div class="score-board-summary">
                    <div class="score-title">📈 当前比分 Current Score</div>
                    <div class="scores-container">
                        <div class="player-score ${winner === this.player1 ? 'winner-highlight' : ''}">
                            <div class="score-player">${this.player1.icon} Player 1</div>
                            <div class="score-stats">
                                <span class="wins">${this.player1.roundsWon}胜</span>
                                <span class="points">${this.player1.score}分</span>
                            </div>
                        </div>
                        <div class="score-vs">VS</div>
                        <div class="player-score ${winner === this.player2 ? 'winner-highlight' : ''}">
                            <div class="score-player">${this.player2.icon} Player 2</div>
                            <div class="score-stats">
                                <span class="wins">${this.player2.roundsWon}胜</span>
                                <span class="points">${this.player2.score}分</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // 直接开始下一回合，不显示获胜弹窗
        // 检查是否游戏结束
        if (this.player1.roundsWon >= 2 || this.player2.roundsWon >= 2) {
            this.doubleGameComplete();
        } else {
            this.startNextRound();
        }
    }
    
    // 开始下一回合
    startNextRound() {
        this.roundNumber++;
        this.roundStartTime = Date.now();
        this.isWaitingForFirstMove = true;
        
        // 重置双方位置和步数
        this.player1.pos = { row: 6, col: 2 };
        this.player1.direction = DIRECTIONS.NORTH;
        this.player1.currentSteps = 0;
        
        this.player2.pos = { row: 6, col: 5 };
        this.player2.direction = DIRECTIONS.NORTH;
        this.player2.currentSteps = 0;
        
        this.currentPlayer = 1;
        
        // 生成新目标
        this.generateDestination();
        this.updatePlayerPosition();
        // 不再更新双人模式UI，信息仅在弹窗中显示
        // this.updateDoubleModeUI();
        
        // 重新开始计时
        this.startTimer();
    }
    
    // 双人游戏结束
    doubleGameComplete() {
        const winner = this.player1.roundsWon > this.player2.roundsWon ? this.player1 : this.player2;
        
        // 只显示toast提示获胜者，不显示弹窗
        this.showMessage(`🏆 ${winner.name} 获胜！游戏结束！`, 'success');
        
        // 延迟一段时间后重置游戏状态
        setTimeout(() => {
            this.isGameStarted = false;
            document.getElementById('btnStart').disabled = false;
            document.getElementById('btnRestart').disabled = true;
        }, 1500);
    }
    
    // 更新双人模式UI
    updateDoubleModeUI() {
        // 双人模式信息仅在弹窗中显示，不在游戏底部显示
        // 此函数保留为空，以确保游戏其他部分正常工作
        if (this.mode !== 'double') return;
    }
    
    // 创建双人模式UI
    createDoubleModeUI() {
        // 双人模式信息仅在弹窗中显示，不在游戏底部显示
        // 移除之前可能创建的双人模式面板
        const existingPanel = document.getElementById('doubleModePanel');
        if (existingPanel) {
            existingPanel.remove();
        }
    }

    checkDestination() {
        // 只有到达带🎯标记的格子才算成功
        const targetPos = this.currentDestination.targetPos || this.currentDestination.pos[0];
        const isAtDestination = targetPos[0] === this.playerPos.row && 
                               targetPos[1] === this.playerPos.col;
        
        if (isAtDestination) {
            this.reachedDestination();
        }
    }

    reachedDestination() {
        // 停止计时（本轮游戏结束）
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        
        // 使用当前任务的独立时间和步数计算得分
        const baseScore = this.difficulty === 'easy' ? 100 : 200;
        const stepBonus = Math.max(0, 50 - this.currentMissionSteps);  // 使用当前任务步数
        const timeBonus = Math.max(0, 60 - this.currentMissionTime);  // 使用当前任务时间，用时越短奖励越多
        const comboBonus = this.combo * 10;
        
        const earnedScore = baseScore + stepBonus + timeBonus + comboBonus;
        this.score += earnedScore;
        this.combo++;
        
        // 每次到达终点都保存到排行榜
        this.saveToLeaderboard();
        
        // 更新任务状态
        if (this.difficulty === 'hard' && this.currentMissionIndex < this.missions.length) {
            this.missions[this.currentMissionIndex].completed = true;
            this.updateMissionList();
            this.currentMissionIndex++;
            
            if (this.currentMissionIndex >= this.missions.length) {
                // 所有任务完成
                this.gameComplete();
                return;
            }
        }
        
        // 显示成功消息并进入建筑
        this.showSuccessMessageAndEnterBuilding(earnedScore, stepBonus, timeBonus, comboBonus);
    }

    showSuccessMessage(total, stepBonus, timeBonus, comboBonus) {
        const msg = document.getElementById('successMessage');
        const text = document.getElementById('successText');
        const stats = document.getElementById('successStats');
        
        text.textContent = `你成功到达${this.currentDestination.name}！`;
        stats.innerHTML = `
            获得 ${total} 分！<br>
            ${stepBonus > 0 ? `步数奖励: +${stepBonus} ` : ''}
            ${timeBonus > 0 ? `时间奖励: +${timeBonus} ` : ''}
            ${comboBonus > 0 ? `连击奖励: +${comboBonus}` : ''}
        `;
        
        msg.style.display = 'block';
        setTimeout(() => {
            msg.style.display = 'none';
        }, 2000);
    }

    showSuccessMessageAndEnterBuilding(total, stepBonus, timeBonus, comboBonus) {
        const msg = document.getElementById('successMessage');
        const text = document.getElementById('successText');
        const stats = document.getElementById('successStats');
        
        text.textContent = `🎉 You reached ${this.currentDestination.nameEn} ${this.currentDestination.name}!  你成功到达${this.currentDestination.name}！`;
        stats.innerHTML = `
            Earned 获得 ${total} Points 分！<br>
            ${stepBonus > 0 ? `Step Bonus 步数奖励: +${stepBonus} ` : ''}
            ${timeBonus > 0 ? `Time Bonus 时间奖励: +${timeBonus} ` : ''}
            ${comboBonus > 0 ? `Combo Bonus 连击奖励: +${comboBonus}` : ''}
        `;
        
        msg.style.display = 'block';
        
        // 1秒后显示宝箱
        setTimeout(() => {
            msg.style.display = 'none';
            this.showTreasureBox();
        }, 1500);
    }

    showTreasureBox() {
        const treasureBox = document.getElementById('treasureBox');
        const openTreasureBtn = document.getElementById('openTreasure');
        const rewardDisplay = document.getElementById('rewardDisplay');
        
        treasureBox.classList.add('active');
        
        // 重置宝箱状态
        const chest = document.querySelector('.treasure-chest');
        chest.classList.remove('open');
        rewardDisplay.style.display = 'none';
        rewardDisplay.innerHTML = '';
        openTreasureBtn.style.display = 'block';
        
        // 标记当前目标的宝箱未打开
        this.currentTreasureOpened = false;
        
        openTreasureBtn.onclick = () => {
            if (!this.currentTreasureOpened) {
                this.openTreasure();
                this.currentTreasureOpened = true;
            }
        };
    }

    openTreasure() {
        const chest = document.querySelector('.treasure-chest');
        const rewardDisplay = document.getElementById('rewardDisplay');
        const closeTreasureBtn = document.getElementById('closeTreasure');
        const openTreasureBtn = document.getElementById('openTreasure');
        
        // 隐藏打开按钮
        openTreasureBtn.style.display = 'none';
        
        // 宝箱打开动画
        chest.classList.add('open');
        
        setTimeout(() => {
            let rewardHTML = '';
            
            // 检查当天已发放的奖励数量（总库存为3个）
            if (this.dailyRewardsGiven < 3) {
                // 还有奖励，随机选取一个
                const randomReward = this.treasureRewards[Math.floor(Math.random() * this.treasureRewards.length)];
                this.dailyRewardsGiven++;
                this.saveTreasureData();
                
                rewardHTML = `
                    <div class="reward-item sparkle">
                        <div class="reward-emoji">🎉</div>
                        <div class="reward-icon">${randomReward.icon}</div>
                        <div class="reward-name">${randomReward.name}</div>
                        <div class="reward-congrats">恭喜获得奖励！</div>
                    </div>
                `;
            } else {
                // 奖励已经领完，只显示赞美
                const praise = PRAISE_WORDS[Math.floor(Math.random() * PRAISE_WORDS.length)];
                rewardHTML = `
                    <div class="reward-item praise">
                        <div class="reward-emoji">🌟</div>
                        <div class="praise-text">${praise}</div>
                        <div class="praise-note">今天的奖励已经领完啦，<br>明天再来吧！</div>
                    </div>
                `;
            }
            
            rewardDisplay.innerHTML = rewardHTML;
            rewardDisplay.style.display = 'block';
            closeTreasureBtn.style.display = 'block';
        }, 800);
    }

    closeTreasureBox() {
        const treasureBox = document.getElementById('treasureBox');
        const closeTreasureBtn = document.getElementById('closeTreasure');
        const openTreasureBtn = document.getElementById('openTreasure');
        const rewardDisplay = document.getElementById('rewardDisplay');
        
        treasureBox.classList.remove('active');
        
        // 重置按钮显示状态
        closeTreasureBtn.style.display = 'none';
        openTreasureBtn.style.display = 'block';
        rewardDisplay.style.display = 'none';
        
        // 重置宝箱打开标记
        this.currentTreasureOpened = false;
        
        // 重置所有状态（每轮游戏完全独立）
        this.score = 0;  // 分数归零，不累加
        this.time = 0;
        this.currentMissionTime = 0;
        this.currentMissionSteps = 0;
        this.combo = 0;  // 连击也重置
        
        // 设置为等待第一次移动状态（延迟开始计时）
        this.isWaitingForFirstMove = true;
        
        // 启动计时器（但不会立即计时，等待第一次移动）
        this.startTimer();
        
        // 生成新目标
        setTimeout(() => {
            this.generateDestination();
            this.updateStats();
        }, 500);
    }

    enterBuilding() {
        // 暂停游戏
        const wasPaused = this.isPaused;
        this.isPaused = true;
        
        // 显示建筑内部
        const interior = document.getElementById('buildingInterior');
        interior.classList.add('active');
        
        // 填充建筑信息
        document.getElementById('interiorIcon').textContent = this.currentDestination.icon;
        document.getElementById('interiorName').textContent = this.currentDestination.name;
        document.getElementById('interiorNameEn').textContent = this.currentDestination.nameEn;
        document.getElementById('interiorDescription').textContent = 
            this.currentDestination.description || `欢迎来到${this.currentDestination.name}！`;
        
        // 生成内部物品
        const itemsContainer = document.getElementById('interiorItems');
        itemsContainer.innerHTML = '';
        
        if (this.currentDestination.items && this.currentDestination.items.length > 0) {
            this.currentDestination.items.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'interior-item';
                itemDiv.innerHTML = `
                    <div class="interior-item-icon">${item.icon}</div>
                    <div class="interior-item-name">${item.name}</div>
                `;
                itemsContainer.appendChild(itemDiv);
            });
        }
        
        this.wasPausedBeforeBuilding = wasPaused;
    }

    closeBuilding() {
        const interior = document.getElementById('buildingInterior');
        interior.classList.remove('active');
        
        // 恢复游戏状态
        if (!this.wasPausedBeforeBuilding) {
            this.isPaused = false;
        }
        
        // 生成新目标
        setTimeout(() => {
            this.generateDestination();
            this.updateStats();
        }, 500);
    }

    showMessage(message, type = 'info') {
        // 创建或获取toast元素
        let toast = document.getElementById('gameToast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'gameToast';
            toast.className = 'game-toast';
            document.body.appendChild(toast);
        }
        
        // 设置消息内容和类型
        toast.textContent = message;
        toast.className = 'game-toast ' + type;
        toast.classList.add('show');
        
        // 2秒后隐藏
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2000);
    }
    
    // 美观的通知弹窗
    showNotification(message, type = 'info') {
        let notification = document.getElementById('customNotification');
        if (!notification) {
            notification = document.createElement('div');
            notification.id = 'customNotification';
            notification.className = 'custom-notification';
            document.body.appendChild(notification);
        }
        
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: '💬'
        };
        
        notification.innerHTML = `
            <div class="notification-icon">${icons[type] || icons.info}</div>
            <div class="notification-message">${message}</div>
        `;
        notification.className = `custom-notification ${type}`;
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
    
    // 美观的确认对话框
    showConfirmDialog(title, message, onConfirm) {
        let dialog = document.getElementById('customConfirmDialog');
        if (!dialog) {
            dialog = document.createElement('div');
            dialog.id = 'customConfirmDialog';
            dialog.className = 'custom-confirm-dialog';
            dialog.innerHTML = `
                <div class="confirm-overlay"></div>
                <div class="confirm-box">
                    <div class="confirm-header">
                        <div class="confirm-title"></div>
                    </div>
                    <div class="confirm-body"></div>
                    <div class="confirm-buttons">
                        <button class="confirm-btn cancel-btn">❌ 取消 Cancel</button>
                        <button class="confirm-btn confirm-btn-primary">✅ 确定 Confirm</button>
                    </div>
                </div>
            `;
            document.body.appendChild(dialog);
        }
        
        dialog.querySelector('.confirm-title').innerHTML = title;
        dialog.querySelector('.confirm-body').innerHTML = message;
        
        const overlay = dialog.querySelector('.confirm-overlay');
        const cancelBtn = dialog.querySelector('.cancel-btn');
        const confirmBtn = dialog.querySelector('.confirm-btn-primary');
        
        const hideDialog = () => {
            dialog.classList.remove('show');
        };
        
        overlay.onclick = hideDialog;
        cancelBtn.onclick = hideDialog;
        confirmBtn.onclick = () => {
            hideDialog();
            if (onConfirm) onConfirm();
        };
        
        dialog.classList.add('show');
    }

    gameComplete() {
        clearInterval(this.timer);
        
        // 注意：排行榜数据已在 reachedDestination() 中保存，这里不需要再次保存
        
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('highScore', this.highScore.toString());
            this.updateHighScore();
        }
        
        const msg = document.getElementById('successMessage');
        const text = document.getElementById('successText');
        const stats = document.getElementById('successStats');
        
        text.textContent = '🎊 恭喜！你完成了所有任务！';
        stats.innerHTML = `
            最终得分: ${this.score} 分<br>
            总用时: ${Math.floor(this.time / 60)}:${(this.time % 60).toString().padStart(2, '0')}<br>
            ${this.score > this.highScore ? '🏆 新纪录！' : ''}
        `;
        
        msg.style.display = 'block';
        
        this.isGameStarted = false;
        document.getElementById('btnStart').disabled = false;
        document.getElementById('btnRestart').disabled = true;
        document.getElementById('btnPause').disabled = true;
    }

    gameOver() {
        clearInterval(this.timer);
        alert('⏰ 时间到！游戏结束！\n最终得分: ' + this.score);
        this.restartGame();
    }

    restartGame() {
        clearInterval(this.timer);
        this.isGameStarted = false;
        this.isPaused = false;
        
        document.getElementById('btnStart').disabled = false;
        document.getElementById('btnRestart').disabled = true;
        document.getElementById('btnPause').disabled = true;
        document.getElementById('btnPause').textContent = '⏸️ 暂停';
        document.getElementById('btnTurnLeft').disabled = true;
        document.getElementById('btnGoStraight').disabled = true;
        document.getElementById('btnTurnRight').disabled = true;
        
        this.playerPos = { row: 6, col: 2 };
        this.playerDirection = DIRECTIONS.NORTH;
        this.currentDestination = null;
        this.score = 0;
        this.steps = 0;
        this.time = 0;
        this.currentMissionTime = 0;
        this.currentMissionSteps = 0;
        this.combo = 0;
        this.missions = [];
        this.currentMissionIndex = 0;
        
        document.querySelectorAll('.destination-marker').forEach(m => m.remove());
        
        this.updateStats();
        this.updatePlayerPosition();
        this.updateDirection();
        
        if (this.difficulty === 'hard') {
            document.getElementById('missionList').innerHTML = '';
            document.getElementById('missionProgress').textContent = '(0/5)';
        }
    }

    togglePause() {
        if (!this.isGameStarted) return;
        
        this.isPaused = !this.isPaused;
        const btn = document.getElementById('btnPause');
        
        if (this.isPaused) {
            btn.textContent = '▶️ 继续';
            document.getElementById('btnTurnLeft').disabled = true;
            document.getElementById('btnGoStraight').disabled = true;
            document.getElementById('btnTurnRight').disabled = true;
        } else {
            btn.textContent = '⏸️ 暂停';
            document.getElementById('btnTurnLeft').disabled = false;
            document.getElementById('btnGoStraight').disabled = false;
            document.getElementById('btnTurnRight').disabled = false;
        }
    }

    showHint() {
        if (!this.isGameStarted || !this.currentDestination) return;
        
        const destPos = this.currentDestination.targetPos || this.currentDestination.pos[0];
        const rowDiff = destPos[0] - this.playerPos.row;
        const colDiff = destPos[1] - this.playerPos.col;
        
        let hint = '提示：';
        if (Math.abs(rowDiff) > Math.abs(colDiff)) {
            hint += rowDiff > 0 ? '目标在南方 ⬇️' : '目标在北方 ⬆️';
        } else {
            hint += colDiff > 0 ? '目标在东方 ➡️' : '目标在西方 ⬅️';
        }
        
        alert(hint);
    }

    // 排行榜系统
    saveToLeaderboard() {
        const leaderboard = JSON.parse(localStorage.getItem('leaderboard') || '[]');
        
        const now = new Date();
        const record = {
            userId: this.userId,
            playerName: this.maskUserId(this.userId),
            score: this.score,
            time: this.time,
            difficulty: this.difficulty,
            mode: this.mode,
            timestamp: now.getTime(),
            dateTime: this.formatDateTime(now)  // 完整的日期时间
        };
        
        console.log('🏆 保存排行榜数据:', record);
        
        leaderboard.push(record);
        
        // 按时间戳排序（从新到旧），显示所有记录
        leaderboard.sort((a, b) => b.timestamp - a.timestamp);
        
        // 保存所有记录（不限制数量）
        localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
        
        console.log('💾 排行榜已保存，总记录数:', leaderboard.length);
    }
    
    // 格式化日期时间：2025-11-09 14:30:25
    formatDateTime(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    showLeaderboard() {
        const modal = document.getElementById('leaderboardModal');
        modal.classList.add('active');
        
        // 初始化默认筛选（显示所有记录）
        this.currentLeaderboardTab = 'all';
        this.currentDifficultyFilter = 'all';
        
        // 重置选项卡状态
        document.querySelectorAll('.leaderboard-tab').forEach(t => t.classList.remove('active'));
        document.querySelector('.leaderboard-tab[data-tab="all"]').classList.add('active');
        
        document.querySelectorAll('.difficulty-filter-tab').forEach(t => t.classList.remove('active'));
        document.querySelector('.difficulty-filter-tab[data-difficulty="all"]').classList.add('active');
        
        // 显示排行榜
        this.updateLeaderboardDisplay();
    }

    updateLeaderboardDisplay() {
        const leaderboard = JSON.parse(localStorage.getItem('leaderboard') || '[]');
        const listContainer = document.getElementById('leaderboardList');
        
        console.log('📊 排行榜数据:', leaderboard);
        console.log('📊 当前选项卡:', this.currentLeaderboardTab);
        console.log('🎯 难度筛选:', this.currentDifficultyFilter);
        
        let filteredData = leaderboard;
        
        // 按时间筛选（如果选择了“今日”）
        if (this.currentLeaderboardTab === 'today') {
            const today = new Date();
            const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
            const todayEnd = todayStart + 24 * 60 * 60 * 1000;
            filteredData = filteredData.filter(record => {
                return record.timestamp >= todayStart && record.timestamp < todayEnd;
            });
            console.log('📅 今日数据:', filteredData);
        }
        
        // 按难度筛选
        if (this.currentDifficultyFilter !== 'all') {
            filteredData = filteredData.filter(record => record.difficulty === this.currentDifficultyFilter);
            console.log('🎯 筛选后数据:', filteredData);
        }
        
        if (filteredData.length === 0) {
            const difficultyText = this.currentDifficultyFilter === 'all' ? '' : 
                                  this.currentDifficultyFilter === 'easy' ? ' (简单模式)' : ' (困难模式)';
            listContainer.innerHTML = `
                <div class="leaderboard-empty">
                    <div style="font-size: 48px; margin-bottom: 10px;">🏆</div>
                    <div>No Records Yet${difficultyText} 暂无记录${difficultyText}</div>
                    <div style="font-size: 14px; margin-top: 10px;">Complete a game to see your ranking! 完成游戏后就会显示排名哦！</div>
                </div>
            `;
            return;
        }
        
        // 生成排行榜 HTML（显示所有记录）
        let html = '';
        filteredData.forEach((record, index) => {
            const rank = index + 1;
            const rankClass = rank <= 3 ? `rank-${rank}` : '';
            const rankIcon = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`;
            const topClass = rank <= 3 ? 'top3' : '';
            
            const difficultyText = record.difficulty === 'hard' ? '🔥 Hard 困难' : '⭐ Easy 简单';
            const timeText = `${Math.floor(record.time / 60)}:${(record.time % 60).toString().padStart(2, '0')}`;
            const isCurrentUser = record.userId === this.userId;
            
            // 显示完整日期时间
            const dateTimeText = record.dateTime || this.formatDateTime(new Date(record.timestamp));
            
            html += `
                <div class="leaderboard-item ${rankClass}" style="${isCurrentUser ? 'border: 2px solid #667eea;' : ''}">
                    <div class="leaderboard-rank ${topClass}">${rankIcon}</div>
                    <div class="leaderboard-player">
                        <div class="leaderboard-player-name">
                            ${isCurrentUser ? '👤 ' : ''}${record.playerName}
                        </div>
                        <div class="leaderboard-player-info">
                            ${difficultyText} • Time 用时: ${timeText}
                        </div>
                        <div class="leaderboard-player-datetime" style="font-size: 11px; color: #95a5a6; margin-top: 2px;">
                            📅 ${dateTimeText}
                        </div>
                    </div>
                    <div class="leaderboard-score">
                        ${record.score} <span style="font-size: 14px; color: #95a5a6;">pts</span>
                    </div>
                </div>
            `;
        });
        
        listContainer.innerHTML = html;
        console.log('✅ 排行榜显示完成，显示', filteredData.length, '条记录');
    }
}

// 初始化游戏
const game = new Game();

// 绑定僵尸模式按钮事件
document.addEventListener('DOMContentLoaded', function() {
    const btnZombieMode = document.getElementById('btnZombieMode');
    if (btnZombieMode) {
        btnZombieMode.addEventListener('click', function() {
            // 跳转到僵尸模式页面
            window.location.href = 'ui-prototype-zombie.html';
        });
    }
});


// 反馈用户名单（可维护）
const FEEDBACK_USERS = ['huan', 'lipeng', 'zhangfei', 'AoA', 'Lily', 'Welcome to submit your article'];

// 初始化滚动字幕（支持按像素/秒设置速度）
function initMarquee({ speedPxPerSec = 40, users = FEEDBACK_USERS } = {}) {
  const primary = document.getElementById('marqueePrimary');
  const clone = document.getElementById('marqueeClone');
  const track = primary ? primary.parentElement : null;
  if (!primary || !clone || !track) return;

  function rand(min, max) { return Math.random() * (max - min) + min; }
  function build(usersArr) {
    const lead = '特别感谢以下用户的宝贵反馈：';
    const names = usersArr.map(u => {
      const gap = Math.round(rand(32, 64));
      const smin = rand(0.85, 1.0).toFixed(2);
      const smax = rand(1.1, 1.45).toFixed(2);
      const pd = rand(1.2, 2.2).toFixed(2) + 's';
      const gd = rand(2.0, 3.0).toFixed(2) + 's';
      const delay = (-rand(0, 1.5)).toFixed(2) + 's';
      return `<span class="marquee-name" style="--name-gap:${gap}px;--scale-min:${smin};--scale-max:${smax};--pulse-duration:${pd};--glow-duration:${gd};animation-delay:${delay}">[${u}]</span>`;
    }).join(' ');
    return lead + names;
  }

  function layout() {
    const distance = primary.offsetWidth;
    track.style.setProperty('--marquee-distance', distance + 'px');
    track.style.setProperty('--marquee-duration', (distance / speedPxPerSec) + 's');
  }

  const source = users.slice();
  const contentHTML = build(source);
  primary.innerHTML = contentHTML;
  clone.innerHTML = contentHTML;
  layout();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(layout, 150);
  });

  track.addEventListener('animationiteration', () => {
    for (let i = source.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = source[i]; source[i] = source[j]; source[j] = t;
    }
    speedPxPerSec = Math.round(rand(30, 50));
    const html = build(source);
    primary.innerHTML = html;
    clone.innerHTML = html;
    layout();
  });
}

// 启动滚动字幕
initMarquee({ speedPxPerSec: 40 });

// 弹幕引擎（B站风格）
function initDanmaku({
  speedRangePxPerSec = [70, 160],
  fontSizeRange = [14, 24],
  spawnIntervalMs = 800,
  maxConcurrent = 30
} = {}) {
  const container = document.getElementById('danmaku');
  if (!container) return;

  const names = FEEDBACK_USERS.slice();
  let idx = 0;

  const PASTEL_COLORS = ['#ff9aa2','#ffb7b2','#ffdac1','#e2f0cb','#b5ead7','#c7ceea','#a0e7e5','#74c0fc','#f7b2d9','#ffd1dc'];
  const CUTE_EMOJIS = ['🌸','💖','✨','🎀','🍓','🧸','🌈','🐻','🐱','🦄','🍭','🌼'];

  function rand(min, max) { return Math.random() * (max - min) + min; }
  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // 计算轨道
  function computeLanes() {
    const h = container.clientHeight || 80;
    const baseLine = 22; // 基础行高
    const lanes = Math.max(3, Math.min(6, Math.floor(h / baseLine)));
    const laneTops = Array.from({ length: lanes }, (_, i) => Math.round((i + 0.5) * (h / lanes) - baseLine / 2));
    return { laneTops, lanes };
  }
  let { laneTops, lanes } = computeLanes();
  const laneNextAvailable = Array(lanes).fill(0);

  window.addEventListener('resize', () => {
    ({ laneTops, lanes } = computeLanes());
    while (laneNextAvailable.length < lanes) laneNextAvailable.push(0);
  });

  function createItem(name) {
    const item = document.createElement('span');
    item.className = 'danmaku-item';
    const emojiL = CUTE_EMOJIS[Math.floor(Math.random() * CUTE_EMOJIS.length)];
    const emojiR = CUTE_EMOJIS[Math.floor(Math.random() * CUTE_EMOJIS.length)];
    item.innerHTML = `${emojiL} [${name}] ${emojiR}`;
    const fontSize = Math.round(rand(fontSizeRange[0], fontSizeRange[1]));
    const color = PASTEL_COLORS[Math.floor(Math.random() * PASTEL_COLORS.length)];
    item.style.fontSize = fontSize + 'px';
    item.style.color = color;
    item.style.textShadow = `0 0 8px ${color}`;
    return item;
  }

  function spawn() {
    if (!container.isConnected) return;
    if (container.childElementCount >= maxConcurrent) return;

    if (idx >= names.length) {
      shuffle(names);
      idx = 0;
    }
    const name = names[idx++];
    const item = createItem(name);
    container.appendChild(item);

    // 测量宽度
    const itemWidth = item.offsetWidth;
    const containerWidth = container.clientWidth || 800;
    const speed = Math.round(rand(speedRangePxPerSec[0], speedRangePxPerSec[1]));
    const distance = containerWidth + itemWidth + 20;
    const duration = distance / speed; // 秒

    // 选择轨道（避免重叠）
    const now = performance.now();
    let laneIndex = Math.floor(rand(0, lanes));
    for (let k = 0; k < lanes; k++) {
      const i = (laneIndex + k) % lanes;
      if (now >= laneNextAvailable[i]) { laneIndex = i; break; }
    }

    // 计算下一可用时间（简单间隔 = itemWidth / speed * 1000）
    laneNextAvailable[laneIndex] = now + (itemWidth / speed) * 1000 * 1.2;

    // 应用变量与定位
    item.style.setProperty('--distance', distance + 'px');
    item.style.setProperty('--duration', duration + 's');
    item.style.top = Math.max(0, laneTops[laneIndex]) + 'px';
    item.style.right = -itemWidth + 'px';

    item.addEventListener('animationend', () => {
      item.remove();
    }, { once: true });
  }

  const timer = setInterval(spawn, spawnIntervalMs);
  // 页面可选卸载处理
  window.addEventListener('beforeunload', () => clearInterval(timer));
}

// 启动弹幕
initDanmaku({ speedRangePxPerSec: [80, 160], fontSizeRange: [14, 24], spawnIntervalMs: 800, maxConcurrent: 28 });

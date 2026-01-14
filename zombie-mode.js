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

// localStorage key
const STORAGE_KEY = 'zombieModeData';

// 获取双语方向名称
function getDirectionText(direction) {
    const dir = DIRECTION_NAMES[direction];
    return `${dir.en} ${dir.zh}`;
}

// 建筑物定义（使用12x12地图的建筑物）
const BUILDINGS_ZOMBIE = [
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

// 僵尸状态枚举
const ZOMBIE_STATES = {
    NORMAL: 'normal',           // 普通状态
    POWERED_UP: 'powered_up',   // 获得爱心状态
    RECOVERING: 'recovering'    // 效果结束恢复状态
};

// 僵尸类
class Zombie {
    constructor(row, col) {
        this.pos = { row, col };
        this.icon = '🧟';
        this.direction = Math.floor(Math.random() * 4);
        this.isChasing = true; // 默认开启追击
        this.speedBoost = false; // 速度提升状态
        this.speedBoostEndTime = 0; // 速度提升结束时间
        
        // 僵尸状态管理
        this.state = ZOMBIE_STATES.NORMAL; // 当前状态
        this.scale = 1.0; // 体型缩放比例
        this.powerUpEndTime = 0; // 爱心效果结束时间
        this.powerUpDuration = 7000; // 爱心效果持续时间（毫秒）
        this.moveSpeed = 1; // 移动速度倍率
        this.detectionRange = 3; // 玩家检测范围
    }

    // 僵尸移动逻辑
    move(map, playerPos, gridSize, hearts) {
        // 检查爱心效果是否过期
        if (this.state === ZOMBIE_STATES.POWERED_UP && Date.now() > this.powerUpEndTime) {
            this.endPowerUp();
        }
        
        // 检查速度提升是否过期
        if (this.speedBoost && Date.now() > this.speedBoostEndTime) {
            this.speedBoost = false;
        }

        // 获取目标优先级：第一优先级玩家，第二优先级爱心
        const target = this.selectTarget(hearts, playerPos);
        
        if (target) {
            if (target.type === 'player') {
                // 追踪玩家（最高优先级）
                if (this.isChasing) {
                    this.chasePlayer(playerPos);
                } else {
                    this.randomMove(gridSize);
                }
            } else if (target.type === 'heart') {
                // 追踪爱心（第二优先级）
                this.chaseTarget(target.pos);
            }
        } else {
            // 第三优先级：随机移动
            this.randomMove(gridSize);
        }

        // 确保僵尸不会走到建筑物上
        const cellType = map[this.pos.row][this.pos.col];
        if (cellType.type === 'building' || cellType.type === 'obstacle') {
            // 如果走到了建筑物或障碍物上，退回到原来的位置
            this.pos.row = Math.max(0, Math.min(gridSize - 1, this.pos.row));
            this.pos.col = Math.max(0, Math.min(gridSize - 1, this.pos.col));
        }
    }

    // 选择目标（优先追踪玩家，其次追踪爱心）
    selectTarget(hearts, playerPos) {
        // 第一优先级：检测玩家是否在范围内
        if (this.isPlayerInRange(playerPos)) {
            const playerDistance = this.calculateDistance(playerPos);
            return { type: 'player', pos: playerPos, distance: playerDistance };
        }
        
        // 第二优先级：查找最近的激活爱心
        let nearestHeart = null;
        let nearestHeartDistance = Infinity;
        
        hearts.forEach(heart => {
            if (heart.isHeartActive()) {
                const distance = this.calculateDistance(heart.pos);
                if (distance < nearestHeartDistance) {
                    nearestHeart = heart;
                    nearestHeartDistance = distance;
                }
            }
        });
        
        // 如果有爱心在检测范围内，追踪爱心
        if (nearestHeart && nearestHeartDistance <= 5) {
            return { type: 'heart', pos: nearestHeart.pos, distance: nearestHeartDistance };
        }
        
        // 第三优先级：无目标
        return null;
    }

    // 计算距离
    calculateDistance(targetPos) {
        return Math.abs(this.pos.row - targetPos.row) + Math.abs(this.pos.col - targetPos.col);
    }

    // 检查玩家是否在检测范围内
    isPlayerInRange(playerPos) {
        return Math.abs(this.pos.row - playerPos.row) <= this.detectionRange && 
               Math.abs(this.pos.col - playerPos.col) <= this.detectionRange;
    }

    // 追踪目标
    chaseTarget(targetPos) {
        const rowDiff = targetPos.row - this.pos.row;
        const colDiff = targetPos.col - this.pos.col;

        // 优先向目标方向移动
        if (Math.abs(rowDiff) > Math.abs(colDiff)) {
            // 上下移动
            this.pos.row += rowDiff > 0 ? 1 : -1;
        } else {
            // 左右移动
            this.pos.col += colDiff > 0 ? 1 : -1;
        }
    }

    // 追踪玩家
    chasePlayer(playerPos) {
        const rowDiff = playerPos.row - this.pos.row;
        const colDiff = playerPos.col - this.pos.col;

        // 优先向玩家方向移动
        if (Math.abs(rowDiff) > Math.abs(colDiff)) {
            // 上下移动
            this.pos.row += rowDiff > 0 ? 1 : -1;
        } else {
            // 左右移动
            this.pos.col += colDiff > 0 ? 1 : -1;
        }
    }

    // 随机移动
    randomMove(gridSize) {
        const direction = Math.floor(Math.random() * 4);
        
        switch (direction) {
            case DIRECTIONS.NORTH:
                this.pos.row = Math.max(0, this.pos.row - 1);
                break;
            case DIRECTIONS.EAST:
                this.pos.col = Math.min(gridSize - 1, this.pos.col + 1);
                break;
            case DIRECTIONS.SOUTH:
                this.pos.row = Math.min(gridSize - 1, this.pos.row + 1);
                break;
            case DIRECTIONS.WEST:
                this.pos.col = Math.max(0, this.pos.col - 1);
                break;
        }
    }

    // 获得爱心效果
    activatePowerUp() {
        this.state = ZOMBIE_STATES.POWERED_UP;
        this.scale = 2.0; // 体型增大至2倍
        this.powerUpEndTime = Date.now() + this.powerUpDuration;
        this.moveSpeed = 1.5; // 移动速度提升50%
        this.detectionRange = 5; // 玩家检测范围扩大至5格
        
        // 立即启用追击状态，确保获得爱心后立即追踪玩家
        this.isChasing = true;
    }

    // 结束爱心效果
    endPowerUp() {
        this.state = ZOMBIE_STATES.NORMAL;
        this.scale = 1.0; // 恢复原始大小
        this.moveSpeed = 1; // 恢复原始速度
        this.detectionRange = 3; // 恢复原始检测范围
    }

    // 设置追击状态
    setChasing(chasing) {
        this.isChasing = chasing;
    }
    
    // 获取追击状态
    getChasing() {
        return this.isChasing;
    }
    
    // 获取速度提升状态
    hasSpeedBoost() {
        return this.speedBoost;
    }

    // 获取当前状态
    getState() {
        return this.state;
    }

    // 获取体型缩放比例
    getScale() {
        return this.scale;
    }
}

// 爱心道具类
class Heart {
    constructor(row, col) {
        this.pos = { row, col };
        this.icon = '❤️';
        this.isActive = true;
        this.pulseAnimation = true;
    }

    // 获取位置
    getPosition() {
        return this.pos;
    }

    // 检查是否激活
    isHeartActive() {
        return this.isActive;
    }

    // 设置激活状态
    setActive(active) {
        this.isActive = active;
    }
}

// 游戏状态类
class ZombieGame {
    constructor() {
        this.difficulty = 'zombie'; // 僵尸模式
        this.gridSize = 12;
        this.playerPos = { row: 6, col: 2 };
        this.playerDirection = DIRECTIONS.NORTH;
        this.playerHealth = 100;
        this.maxHealth = 100;
        this.currentDestination = null;
        this.score = 0;
        this.steps = 0;
        this.time = 0;
        this.currentMissionTime = 0;
        this.currentMissionSteps = 0;
        this.timer = null;
        this.isGameStarted = false;
        this.isPaused = false;
        this.isMusicPlaying = false;
        this.zombies = [];
        this.missions = [];
        this.currentMissionIndex = 0;
        
        // 用户数据
        this.highScore = 0;
        this.totalGamesPlayed = 0;
        this.totalSteps = 0;
        this.totalTime = 0;
        
        // 爱心道具系统
        this.hearts = [];
        this.maxHearts = 2; // 最大爱心数量
        this.heartRespawnTime = 10; // 爱心重生时间（秒）
        this.heartRespawnTimers = {}; // 爱心重生计时器
        
        // 追击恢复机制
        this.playerMovesSinceContact = 0; // 玩家与僵尸碰撞后的移动计数
        this.isRecoveryPeriod = false; // 是否处于追击恢复期间
        this.MAX_MOVES_BEFORE_RECOVERY = 3; // 恢复追击前的最大移动次数
        this.lastPlayerMoveTime = 0; // 记录玩家最后一次移动的时间
        this.MAX_IDLE_TIME = 3; // 最大闲置时间（秒）
        
        // 加载用户数据
        this.loadUserData();
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderMap();
        this.generateZombies(5); // 生成5个僵尸
        
        // 更新UI显示初始数据
        this.updateStats();
        this.updateHealthBar();
    }

    setupEventListeners() {
        // 返回主游戏按钮
        document.getElementById('btnBackToMain').addEventListener('click', () => {
            this.stopBackgroundMusic();
            window.location.href = 'index.html';
        });
        
        // 音乐控制按钮
        document.getElementById('btnToggleMusic').addEventListener('click', () => this.toggleMusic());
        
        // 游戏控制按钮
        document.getElementById('btnStart').addEventListener('click', () => this.startGame());
        document.getElementById('btnRestart').addEventListener('click', () => this.restartGame());
        document.getElementById('btnPause').addEventListener('click', () => this.togglePause());
        
        // 方向控制按钮
        document.getElementById('btnUp').addEventListener('click', () => this.moveUp());
        document.getElementById('btnDown').addEventListener('click', () => this.moveDown());
        document.getElementById('btnLeft').addEventListener('click', () => this.moveLeft());
        document.getElementById('btnRight').addEventListener('click', () => this.moveRight());
        
        // 游戏结束弹窗按钮
        document.getElementById('btnRestartGame').addEventListener('click', () => this.restartGame());
        
        // 键盘控制
        document.addEventListener('keydown', (e) => {
            if (!this.isGameStarted || this.isPaused) return;
            
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    this.moveLeft();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.moveRight();
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    this.moveUp();
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    this.moveDown();
                    break;
            }
        });
    }

    generateZombies(count) {
        this.zombies = [];
        for (let i = 0; i < count; i++) {
            // 确保僵尸不会生成在玩家初始位置附近
            let row, col;
            do {
                row = Math.floor(Math.random() * this.gridSize);
                col = Math.floor(Math.random() * this.gridSize);
            } while (Math.abs(row - this.playerPos.row) <= 2 && Math.abs(col - this.playerPos.col) <= 2);
            
            this.zombies.push(new Zombie(row, col));
        }
    }

    generateHearts() {
        this.hearts = [];
        const map = this.createMapLayout();
        
        for (let i = 0; i < this.maxHearts; i++) {
            let row, col;
            let attempts = 0;
            const maxAttempts = 100;
            
            do {
                row = Math.floor(Math.random() * this.gridSize);
                col = Math.floor(Math.random() * this.gridSize);
                attempts++;
                
                // 检查是否为道路且不是障碍物
                const cellType = map[row][col];
                const isRoad = cellType.type === 'road';
                const isObstacle = cellType.type === 'obstacle';
                const isBuilding = cellType.type === 'building';
                
                // 确保不在玩家初始位置附近
                const tooCloseToPlayer = Math.abs(row - this.playerPos.row) <= 2 && Math.abs(col - this.playerPos.col) <= 2;
                
                // 确保不与其他爱心重叠
                const tooCloseToOtherHeart = this.hearts.some(heart => 
                    Math.abs(heart.pos.row - row) <= 1 && Math.abs(heart.pos.col - col) <= 1
                );
                
                if (isRoad && !isObstacle && !isBuilding && !tooCloseToPlayer && !tooCloseToOtherHeart) {
                    this.hearts.push(new Heart(row, col));
                    break;
                }
            } while (attempts < maxAttempts);
        }
        
        this.updateHeartsPosition();
    }

    renderMap() {
        const mapGrid = document.getElementById('mapGrid');
        mapGrid.innerHTML = '';
        
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
                    const building = BUILDINGS_ZOMBIE[cellType.buildingIndex];
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
                } else if (cellType.type === 'obstacle') {
                    cell.classList.add('obstacle');
                    cell.innerHTML = '<span class="obstacle-icon">🚧</span>';
                    cell.title = '障碍物，无法通行 Obstacle, cannot pass';
                }
                
                mapGrid.appendChild(cell);
            }
        }
        
        this.updatePlayerPosition();
        this.updateZombiesPosition();
        this.updateHeartsPosition();
    }

    createMapLayout() {
        const size = this.gridSize;
        const map = Array(size).fill(null).map(() => Array(size).fill({ type: 'empty' }));
        
        return this.createZombieMap(map);
    }

    createZombieMap(map) {
        const buildings = BUILDINGS_ZOMBIE;
        
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
        
        // 创建路口
        const intersections = [
            [2, 2], [2, 5], [2, 8],
            [5, 2], [5, 5], [5, 8],
            [8, 2], [8, 5], [8, 8],
            [11, 2], [11, 5], [11, 8]
        ];
        
        intersections.forEach(([row, col]) => {
            map[row][col] = { type: 'road', intersection: true };
        });
        
        // 添加障碍物
        // map[4][5] = { type: 'obstacle' };
        map[5][4] = { type: 'obstacle' };
        // map[2][4] = { type: 'obstacle' };
        // map[3][7] = { type: 'obstacle' };
        // map[6][2] = { type: 'obstacle' };
        map[9][8] = { type: 'obstacle' };
        
        return map;
    }

    startGame() {
        this.isGameStarted = true;
        
        this.score = 0;
        this.steps = 0;
        this.time = 0;
        this.currentMissionTime = 0;
        this.currentMissionSteps = 0;
        this.playerHealth = 100;
        this.currentMissionIndex = 0;
        this.lastPlayerMoveTime = Date.now(); // 初始化玩家最后一次移动时间
        
        console.log('游戏开始 - 初始分数:', this.score);
        
        // 初始化任务
        this.initMissions();
        
        // 生成目标
        this.generateDestination();
        
        // 生成爱心道具
        this.generateHearts();
        
        // 更新UI
        document.getElementById('btnStart').disabled = true;
        document.getElementById('btnRestart').disabled = false;
        document.getElementById('btnPause').disabled = false;
        document.getElementById('btnUp').disabled = false;
        document.getElementById('btnDown').disabled = false;
        document.getElementById('btnLeft').disabled = false;
        document.getElementById('btnRight').disabled = false;
        
        this.updateStats();
        this.updateHealthBar();
        this.updatePlayerPosition();
        this.updateDirection();
        
        // 启动计时器
        this.startTimer();
        
        // 播放背景音乐
        this.playBackgroundMusic();
    }
    
    // 播放背景音乐
    playBackgroundMusic() {
        const music = document.getElementById('zombieBackgroundMusic');
        if (music) {
            music.volume = 0.3; // 设置音量为30%
            music.play().catch(error => {
                console.log('背景音乐播放失败:', error);
            });
            this.isMusicPlaying = true;
        }
    }
    
    // 停止背景音乐
    stopBackgroundMusic() {
        const music = document.getElementById('zombieBackgroundMusic');
        if (music) {
            music.pause();
            music.currentTime = 0;
        }
        this.isMusicPlaying = false;
    }
    
    // 加载用户数据
    loadUserData() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            console.log('从localStorage读取的数据:', data);
            if (data) {
                const userData = JSON.parse(data);
                this.highScore = userData.highScore || 0;
                this.totalGamesPlayed = userData.totalGamesPlayed || 0;
                this.totalSteps = userData.totalSteps || 0;
                this.totalTime = userData.totalTime || 0;
                console.log('加载的用户数据:', userData);
            } else {
                console.log('没有找到历史数据，使用默认值');
            }
        } catch (error) {
            console.error('加载用户数据失败:', error);
        }
    }
    
    // 保存用户数据
    saveUserData() {
        try {
            const userData = {
                highScore: this.highScore,
                totalGamesPlayed: this.totalGamesPlayed,
                totalSteps: this.totalSteps,
                totalTime: this.totalTime
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
            console.log('保存的用户数据:', userData);
            console.log('localStorage中的数据:', localStorage.getItem(STORAGE_KEY));
        } catch (error) {
            console.error('保存用户数据失败:', error);
        }
    }
    
    // 更新用户数据
    updateUserData() {
        console.log('更新用户数据 - 分数:', this.score, '步数:', this.steps, '时间:', this.time);
        this.totalGamesPlayed++;
        this.totalSteps += this.steps;
        this.totalTime += this.time;
        
        if (this.score > this.highScore) {
            this.highScore = this.score;
            console.log('新最高分:', this.highScore);
        }
        
        this.saveUserData();
    }
    
    // 切换音乐状态
    toggleMusic() {
        if (this.isMusicPlaying) {
            this.stopBackgroundMusic();
            document.getElementById('btnToggleMusic').textContent = '🔊 开启音乐 Turn On Music';
        } else {
            this.playBackgroundMusic();
            document.getElementById('btnToggleMusic').textContent = '🔇 关闭音乐 Turn Off Music';
        }
    }

    initMissions() {
        const buildings = BUILDINGS_ZOMBIE;
        // 随机选择5个不同的建筑物作为任务目标
        const missionBuildings = [];
        while (missionBuildings.length < 5) {
            const building = buildings[Math.floor(Math.random() * buildings.length)];
            if (!missionBuildings.includes(building)) {
                missionBuildings.push(building);
            }
        }
        
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
        document.getElementById('missionProgress').textContent = `(${completed}/${this.missions.length})`;
    }

    generateDestination() {
        const buildings = BUILDINGS_ZOMBIE;
        
        if (this.missions.length > 0 && this.currentMissionIndex < this.missions.length) {
            this.currentDestination = this.missions[this.currentMissionIndex].building;
        } else {
            // 随机选择一个建筑物
            this.currentDestination = buildings[Math.floor(Math.random() * buildings.length)];
        }
        
        // 选择一个边界格子作为目标点
        this.selectBorderCell();
        
        // 更新UI
        document.getElementById('destinationName').textContent = this.currentDestination.name;
        document.getElementById('destinationNameEn').textContent = this.currentDestination.nameEn;
        
        const distance = this.calculateDistance();
        document.getElementById('destinationDistance').textContent = `📍 预计距离: ${distance}个街区 Estimated Distance: ${distance} blocks`;
        document.getElementById('destinationDistance').style.display = 'block';
        
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
                    const cellType = this.getCellType(r, c);
                    if (cellType.type === 'road') {
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

    getCellType(row, col) {
        // 获取指定位置的格子类型
        // 注意：这个方法应该根据实际的地图数据来实现
        // 这里为了简化，我们返回一个默认的道路类型
        return { type: 'road' };
    }

    calculateDistance() {
        const destPos = this.currentDestination.targetPos || this.currentDestination.pos[0];
        return Math.abs(this.playerPos.row - destPos[0]) + Math.abs(this.playerPos.col - destPos[1]);
    }

    startTimer() {
        if (this.timer) clearInterval(this.timer);
        
        this.timer = setInterval(() => {
            if (this.isPaused) return;
            
            this.time++;
            this.currentMissionTime++;
            
            // 检查是否有僵尸处于powered-up状态
            const hasPoweredUpZombie = this.zombies.some(z => z.getState() === ZOMBIE_STATES.POWERED_UP);
            
            // 如果有powered-up僵尸，每秒移动一次，否则每2秒移动一次
            if (hasPoweredUpZombie || this.time % 2 === 0) {
                this.moveZombies();
            }
            
            // 检查僵尸是否与玩家接触
            this.checkZombieContact();
            
            // 检查玩家是否长时间未移动
            this.checkPlayerIdleTime();
            
            this.updateStats();
        }, 1000);
    }

    updateStats() {
        document.getElementById('currentScore').textContent = this.score;
        document.getElementById('highScoreDisplay').textContent = this.highScore;
        document.getElementById('steps').textContent = this.currentMissionSteps;
        
        const minutes = Math.floor(this.time / 60);
        const seconds = this.time % 60;
        document.getElementById('time').textContent = 
            `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    updateHealthBar() {
        const healthPercentage = (this.playerHealth / this.maxHealth) * 100;
        document.getElementById('healthBarFill').style.width = `${healthPercentage}%`;
        document.getElementById('healthValue').textContent = this.playerHealth;
    }

    updatePlayerPosition() {
        // 移除旧位置
        document.querySelectorAll('.player').forEach(p => p.remove());
        
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

    checkHeartCollisions() {
        // 检查玩家与爱心的碰撞
        this.hearts.forEach((heart, index) => {
            if (heart.isHeartActive() && 
                heart.pos.row === this.playerPos.row && 
                heart.pos.col === this.playerPos.col) {
                // 玩家拾取爱心
                this.playerHealth = this.playerHealth + 20;
                heart.setActive(false);
                this.updateHealthBar();
                this.updateHeartsPosition();
                
                // 注意：爱心不会重生，只在任务完成后统一刷新
            }
        });

        // 检查僵尸与爱心的碰撞
        // 先找到所有与僵尸碰撞的爱心索引
        const collectedHeartIndices = new Set();
        
        this.zombies.forEach(zombie => {
            this.hearts.forEach((heart, index) => {
                if (heart.isHeartActive() && 
                    !collectedHeartIndices.has(index) &&
                    heart.pos.row === zombie.pos.row && 
                    heart.pos.col === zombie.pos.col) {
                    // 僵尸拾取爱心，激活power-up效果
                    heart.setActive(false);
                    collectedHeartIndices.add(index);
                    zombie.activatePowerUp();
                    
                    // 注意：爱心不会重生，只在任务完成后统一刷新
                    // activatePowerUp() 内部已设置 isChasing = true，确保立即追踪玩家
                }
            });
        });
        
        // 更新爱心和僵尸位置
        if (collectedHeartIndices.size > 0) {
            this.updateHeartsPosition();
            this.updateZombiesPosition();
        }
    }

    // 安排爱心重生
    scheduleHeartRespawn(index) {
        if (this.heartRespawnTimers[index]) {
            clearTimeout(this.heartRespawnTimers[index]);
        }
        
        this.heartRespawnTimers[index] = setTimeout(() => {
            this.respawnHeart(index);
        }, this.heartRespawnTime * 1000);
    }

    // 重生爱心
    respawnHeart(index) {
        if (!this.isGameStarted || this.isPaused) {
            // 如果游戏未开始或暂停，重新安排重生
            this.scheduleHeartRespawn(index);
            return;
        }
        
        const map = this.createMapLayout();
        let row, col;
        let attempts = 0;
        const maxAttempts = 100;
        
        do {
            row = Math.floor(Math.random() * this.gridSize);
            col = Math.floor(Math.random() * this.gridSize);
            attempts++;
            
            // 检查是否为道路且不是障碍物
            const cellType = map[row][col];
            const isRoad = cellType.type === 'road';
            const isObstacle = cellType.type === 'obstacle';
            const isBuilding = cellType.type === 'building';
            
            // 确保不在玩家当前位置附近
            const tooCloseToPlayer = Math.abs(row - this.playerPos.row) <= 2 && Math.abs(col - this.playerPos.col) <= 2;
            
            // 确保不与其他爱心重叠
            const tooCloseToOtherHeart = this.hearts.some((heart, i) => 
                i !== index && heart.isHeartActive() && 
                Math.abs(heart.pos.row - row) <= 1 && Math.abs(heart.pos.col - col) <= 1
            );
            
            // 确保不在僵尸当前位置附近
            const tooCloseToZombie = this.zombies.some(zombie => 
                Math.abs(zombie.pos.row - row) <= 1 && Math.abs(zombie.pos.col - col) <= 1
            );
            
            if (isRoad && !isObstacle && !isBuilding && !tooCloseToPlayer && !tooCloseToOtherHeart && !tooCloseToZombie) {
                this.hearts[index].pos = { row, col };
                this.hearts[index].setActive(true);
                this.updateHeartsPosition();
                break;
            }
        } while (attempts < maxAttempts);
        
        // 清除重生计时器
        delete this.heartRespawnTimers[index];
    }

    updateZombiesPosition() {
        // 移除旧位置
        document.querySelectorAll('.zombie').forEach(z => z.remove());
        
        this.zombies.forEach(zombie => {
            const cell = document.querySelector(
                `[data-row="${zombie.pos.row}"][data-col="${zombie.pos.col}"]`
            );
            
            if (cell) {
                const zombieEl = document.createElement('div');
                zombieEl.className = 'zombie';
                
                // 应用体型缩放
                zombieEl.style.transform = `scale(${zombie.getScale()})`;
                
                // 根据状态添加不同的CSS类
                if (zombie.getState() === ZOMBIE_STATES.POWERED_UP) {
                    zombieEl.classList.add('powered-up');
                }
                
                if (zombie.hasSpeedBoost()) {
                    zombieEl.classList.add('speed-boost');
                }
                
                zombieEl.textContent = zombie.icon;
                cell.appendChild(zombieEl);
            }
        });
    }

    updateHeartsPosition() {
        // 移除旧位置
        document.querySelectorAll('.heart').forEach(h => h.remove());
        
        this.hearts.forEach(heart => {
            if (heart.isHeartActive()) {
                const cell = document.querySelector(
                    `[data-row="${heart.pos.row}"][data-col="${heart.pos.col}"]`
                );
                
                if (cell) {
                    const heartEl = document.createElement('div');
                    heartEl.className = 'heart';
                    heartEl.textContent = heart.icon;
                    cell.appendChild(heartEl);
                }
            }
        });
    }

    refreshHearts() {
        console.log('任务完成，刷新爱心图标');
        
        // 为现有爱心添加淡出效果
        const existingHearts = document.querySelectorAll('.heart');
        existingHearts.forEach(heart => {
            heart.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';
            heart.style.opacity = '0';
            heart.style.transform = 'scale(0.5)';
        });
        
        // 等待淡出动画完成后重新生成爱心
        setTimeout(() => {
            // 清除所有爱心重生计时器
            Object.values(this.heartRespawnTimers).forEach(timer => clearTimeout(timer));
            this.heartRespawnTimers = {};
            
            // 重新生成爱心
            this.generateHearts();
            
            // 为新生成的爱心添加淡入效果
            setTimeout(() => {
                const newHearts = document.querySelectorAll('.heart');
                newHearts.forEach(heart => {
                    heart.style.transition = 'opacity 0.5s ease-in, transform 0.5s ease-in';
                    heart.style.opacity = '1';
                    heart.style.transform = 'scale(1)';
                });
            }, 50);
        }, 500);
    }

    moveZombies() {
        const map = this.createMapLayout();
        this.zombies.forEach(zombie => {
            zombie.move(map, this.playerPos, this.gridSize, this.hearts);
        });
        this.updateZombiesPosition();
        
        // 检查僵尸与爱心的碰撞
        this.checkHeartCollisions();
    }

    checkZombieContact() {
        this.zombies.forEach(zombie => {
            if (zombie.pos.row === this.playerPos.row && zombie.pos.col === this.playerPos.col) {
                // 僵尸与玩家接触，减少生命值
                this.playerHealth -= 20;
                this.updateHealthBar();
                this.showMessage('💀 被僵尸攻击了！生命值减少20点！ Attacked by zombie! Health reduced by 20!', 'warning');
                
                // 添加页面抖动效果
                const gameContainer = document.querySelector('.game-container');
                if (gameContainer) {
                    gameContainer.classList.add('shake-screen');
                    
                    // 动画结束后移除类，以便下次可以再次触发抖动
                    setTimeout(() => {
                        gameContainer.classList.remove('shake-screen');
                    }, 500); // 与CSS动画时间一致
                }
                
                // 触发追击停止逻辑
                this.stopZombieChasing();
                
                // 检查是否游戏结束
                if (this.playerHealth <= 0) {
                    this.gameOver();
                }
            }
        });
    }
    
    // 停止所有僵尸的追击行为
    stopZombieChasing() {
        this.zombies.forEach(zombie => {
            zombie.setChasing(false);
        });
        
        // 初始化追击恢复机制
        this.playerMovesSinceContact = 0;
        this.isRecoveryPeriod = true;
    }
    
    // 处理玩家移动事件，实现追击恢复逻辑
    handlePlayerMove() {
        // 更新玩家最后一次移动时间
        this.lastPlayerMoveTime = Date.now();
        
        if (!this.isRecoveryPeriod) return;
        
        this.playerMovesSinceContact++;
        
        // 检查是否达到恢复条件
        if (this.playerMovesSinceContact >= this.MAX_MOVES_BEFORE_RECOVERY) {
            this.restoreZombieChasing();
        }
    }
    
    // 恢复所有僵尸的追击行为
    restoreZombieChasing() {
        this.zombies.forEach(zombie => {
            zombie.setChasing(true);
        });
        
        this.isRecoveryPeriod = false;
        this.playerMovesSinceContact = 0;
        this.lastPlayerMoveTime = Date.now(); // 更新玩家最后一次移动时间
    }

    updateDirection() {
        const arrow = document.getElementById('directionArrow');
        const text = document.getElementById('directionText');
        
        arrow.textContent = DIRECTION_ARROWS[this.playerDirection];
        text.textContent = getDirectionText(this.playerDirection);
    }

    moveUp() {
        if (!this.isGameStarted || this.isPaused) return;
        
        let newRow = this.playerPos.row - 1;
        let newCol = this.playerPos.col;
        
        // 检查移动合法性
        if (!this.isValidMove(newRow, newCol, DIRECTIONS.NORTH)) {
            return;
        }
        
        // 移动成功
        this.playerPos.row = newRow;
        this.playerPos.col = newCol;
        this.playerDirection = DIRECTIONS.NORTH;
        this.steps++;
        this.currentMissionSteps++;
        
        // 处理移动计数和追击恢复
        this.handlePlayerMove();
        
        this.updatePlayerPosition();
        this.updateDirection();
        this.updateStats();
        
        // 检查是否到达目标
        this.checkDestination();
        
        // 检查爱心碰撞
        this.checkHeartCollisions();
    }

    moveDown() {
        if (!this.isGameStarted || this.isPaused) return;
        
        let newRow = this.playerPos.row + 1;
        let newCol = this.playerPos.col;
        
        // 检查移动合法性
        if (!this.isValidMove(newRow, newCol, DIRECTIONS.SOUTH)) {
            return;
        }
        
        // 移动成功
        this.playerPos.row = newRow;
        this.playerPos.col = newCol;
        this.playerDirection = DIRECTIONS.SOUTH;
        this.steps++;
        this.currentMissionSteps++;
        
        // 处理移动计数和追击恢复
        this.handlePlayerMove();
        
        this.updatePlayerPosition();
        this.updateDirection();
        this.updateStats();
        
        // 检查是否到达目标
        this.checkDestination();
        
        // 检查爱心碰撞
        this.checkHeartCollisions();
    }

    moveLeft() {
        if (!this.isGameStarted || this.isPaused) return;
        
        let newRow = this.playerPos.row;
        let newCol = this.playerPos.col - 1;
        
        // 检查移动合法性
        if (!this.isValidMove(newRow, newCol, DIRECTIONS.WEST)) {
            return;
        }
        
        // 移动成功
        this.playerPos.row = newRow;
        this.playerPos.col = newCol;
        this.playerDirection = DIRECTIONS.WEST;
        this.steps++;
        this.currentMissionSteps++;
        
        // 处理移动计数和追击恢复
        this.handlePlayerMove();
        
        this.updatePlayerPosition();
        this.updateDirection();
        this.updateStats();
        
        // 检查是否到达目标
        this.checkDestination();
        
        // 检查爱心碰撞
        this.checkHeartCollisions();
    }

    moveRight() {
        if (!this.isGameStarted || this.isPaused) return;
        
        let newRow = this.playerPos.row;
        let newCol = this.playerPos.col + 1;
        
        // 检查移动合法性
        if (!this.isValidMove(newRow, newCol, DIRECTIONS.EAST)) {
            return;
        }
        
        // 移动成功
        this.playerPos.row = newRow;
        this.playerPos.col = newCol;
        this.playerDirection = DIRECTIONS.EAST;
        this.steps++;
        this.currentMissionSteps++;
        
        // 处理移动计数和追击恢复
        this.handlePlayerMove();
        
        this.updatePlayerPosition();
        this.updateDirection();
        this.updateStats();
        
        // 检查是否到达目标
        this.checkDestination();
        
        // 检查爱心碰撞
        this.checkHeartCollisions();
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

    isValidMove(newRow, newCol, direction) {
        // 检查是否越界
        if (newRow < 0 || newRow >= this.gridSize || newCol < 0 || newCol >= this.gridSize) {
            this.showMessage('⚠️ 不能越界！ Cannot cross the border!', 'warning');
            return false;
        }
        
        // 检查目标格子
        const cell = document.querySelector(`[data-row="${newRow}"][data-col="${newCol}"]`);
        if (!cell) return false;
        
        // 检查是否是目标建筑的格子
        const targetPos = this.currentDestination.targetPos || this.currentDestination.pos[0];
        const isDestinationCell = this.currentDestination && 
            targetPos[0] === newRow && 
            targetPos[1] === newCol;
        
        // 检查是否是道路或目标格子
        if (!cell.classList.contains('road') && !isDestinationCell) {
            this.showMessage('⚠️ 不能穿过建筑！ Cannot pass through buildings!', 'warning');
            return false;
        }
        
        // 检查是否是障碍物
        if (cell.classList.contains('obstacle')) {
            this.showMessage('⚠️ 前方有障碍！ Obstacle ahead!', 'warning');
            return false;
        }
        
        // 检查单行道
        if (cell.classList.contains('oneway')) {
            const canPass = this.checkOneway(cell, direction);
            if (!canPass) {
                this.showMessage('⚠️ 不能逆行！ Cannot go against traffic!', 'warning');
                return false;
            }
        }
        
        return true;
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
        // 计算得分
        const baseScore = 100;
        const timeBonus = Math.max(0, 60 - this.currentMissionTime);
        const stepBonus = Math.max(0, 30 - this.currentMissionSteps);
        const earnedScore = baseScore + timeBonus + stepBonus;
        this.score += earnedScore;
        
        console.log('到达目的地 - 基础分:', baseScore, '时间奖励:', timeBonus, '步数奖励:', stepBonus, '获得分数:', earnedScore, '总分:', this.score);
        
        // 更新任务状态
        if (this.currentMissionIndex < this.missions.length) {
            this.missions[this.currentMissionIndex].completed = true;
            this.updateMissionList();
            this.currentMissionIndex++;
            
            if (this.currentMissionIndex >= this.missions.length) {
                // 所有任务完成
                this.gameComplete();
                return;
            }
        }
        
        this.showMessage(`🎉 成功到达${this.currentDestination.name}！获得${earnedScore}分！`, 'success');
        
        // 重置当前任务的时间和步数
        this.currentMissionTime = 0;
        this.currentMissionSteps = 0;
        
        // 生成新目标
        this.generateDestination();
        
        // 任务完成后刷新爱心（带平滑过渡效果）
        this.refreshHearts();
    }

    gameComplete() {
        clearInterval(this.timer);
        
        this.showMessage(`🏆 恭喜！你完成了所有任务！最终得分：${this.score}`, 'success');
        
        // 停止背景音乐
        this.stopBackgroundMusic();
        
        this.isGameStarted = false;
        document.getElementById('btnStart').disabled = false;
        document.getElementById('btnRestart').disabled = true;
        document.getElementById('btnPause').disabled = true;
        document.getElementById('btnUp').disabled = true;
        document.getElementById('btnDown').disabled = true;
        document.getElementById('btnLeft').disabled = true;
        document.getElementById('btnRight').disabled = true;
    }

    gameOver() {
        console.log('gameOver被调用 - 当前分数:', this.score, '步数:', this.steps, '时间:', this.time);
        clearInterval(this.timer);
        
        // 更新用户数据
        this.updateUserData();
        
        // 显示游戏结束弹窗
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('finalMissions').textContent = `${this.missions.filter(m => m.completed).length}/${this.missions.length}`;
        
        const minutes = Math.floor(this.time / 60);
        const seconds = this.time % 60;
        document.getElementById('finalTime').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        document.getElementById('finalSteps').textContent = this.steps;
        
        console.log('更新游戏结束UI - 分数:', this.score, '步数:', this.steps, '时间:', this.time);
        
        document.getElementById('gameOverModal').classList.add('active');
        
        // 停止背景音乐
        this.stopBackgroundMusic();
        
        this.isGameStarted = false;
        document.getElementById('btnStart').disabled = false;
        document.getElementById('btnRestart').disabled = true;
        document.getElementById('btnPause').disabled = true;
        document.getElementById('btnUp').disabled = true;
        document.getElementById('btnDown').disabled = true;
        document.getElementById('btnLeft').disabled = true;
        document.getElementById('btnRight').disabled = true;
    }

    restartGame() {
        clearInterval(this.timer);
        this.isGameStarted = false;
        this.isPaused = false;
        
        // 隐藏游戏结束弹窗
        document.getElementById('gameOverModal').classList.remove('active');
        
        // 停止背景音乐
        this.stopBackgroundMusic();
        
        // 重置音乐按钮文本
        document.getElementById('btnToggleMusic').textContent = '🔊 开启音乐 Turn On Music';
        
        // 重置按钮状态
        document.getElementById('btnStart').disabled = false;
        document.getElementById('btnRestart').disabled = true;
        document.getElementById('btnPause').disabled = true;
        document.getElementById('btnUp').disabled = true;
        document.getElementById('btnDown').disabled = true;
        document.getElementById('btnLeft').disabled = true;
        document.getElementById('btnRight').disabled = true;
        
        // 重置游戏状态
        this.playerPos = { row: 6, col: 2 };
        this.playerDirection = DIRECTIONS.NORTH;
        this.currentDestination = null;
        this.score = 0;
        this.steps = 0;
        this.time = 0;
        this.currentMissionTime = 0;
        this.currentMissionSteps = 0;
        this.playerHealth = 100;
        this.currentMissionIndex = 0;
        this.lastPlayerMoveTime = 0;
        
        // 重置追击恢复机制
        this.playerMovesSinceContact = 0;
        this.isRecoveryPeriod = false;
        
        // 重置爱心重生计时器
        Object.values(this.heartRespawnTimers).forEach(timer => clearTimeout(timer));
        this.heartRespawnTimers = {};
        
        // 重置任务和僵尸
        this.missions = [];
        this.zombies = [];
        this.generateZombies(5);
        this.generateHearts();
        
        // 更新UI
        this.updateStats();
        this.updateHealthBar();
        this.updatePlayerPosition();
        this.updateZombiesPosition();
        this.updateDirection();
        this.updateMissionList();
        document.getElementById('destinationName').textContent = '未选择';
        document.getElementById('destinationNameEn').textContent = '';
        document.getElementById('destinationDistance').textContent = '';
        
        // 重新渲染地图
        this.renderMap();
    }

    togglePause() {
        if (!this.isGameStarted) return;
        
        this.isPaused = !this.isPaused;
        const btn = document.getElementById('btnPause');
        
        if (this.isPaused) {
            btn.textContent = '▶️ 继续';
        } else {
            btn.textContent = '⏸️ 暂停';
        }
    }

    updateDestinationMarker() {
        // 移除旧标记
        document.querySelectorAll('.destination-marker').forEach(m => m.remove());
        
        // 添加新标记（使用边界格子）
        const targetPos = this.currentDestination.targetPos || this.currentDestination.pos[0];
        const cell = document.querySelector(`[data-row="${targetPos[0]}"][data-col="${targetPos[1]}"]`);
        if (cell) {
            const marker = document.createElement('span');
            marker.className = 'destination-marker';
            marker.textContent = '🎯';
            cell.appendChild(marker);
        }
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
}

// 初始化游戏
window.addEventListener('DOMContentLoaded', () => {
    new ZombieGame();
});
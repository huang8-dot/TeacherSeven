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

// 僵尸类
class Zombie {
    constructor(row, col) {
        this.pos = { row, col };
        this.icon = '🧟';
        this.direction = Math.floor(Math.random() * 4);
    }

    // 僵尸移动逻辑
    move(map, playerPos, gridSize) {
        // 检查是否接近玩家（3格内），如果是则追踪玩家
        if (Math.abs(this.pos.row - playerPos.row) <= 3 && Math.abs(this.pos.col - playerPos.col) <= 3) {
            this.chasePlayer(playerPos);
        } else {
            // 随机移动
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
        this.zombies = [];
        this.missions = [];
        this.currentMissionIndex = 0;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderMap();
        this.generateZombies(5); // 生成5个僵尸
    }

    setupEventListeners() {
        // 返回主游戏按钮
        document.getElementById('btnBackToMain').addEventListener('click', () => {
            window.location.href = 'index.html';
        });
        
        // 游戏控制按钮
        document.getElementById('btnStart').addEventListener('click', () => this.startGame());
        document.getElementById('btnRestart').addEventListener('click', () => this.restartGame());
        document.getElementById('btnPause').addEventListener('click', () => this.togglePause());
        
        // 方向控制按钮
        document.getElementById('btnTurnLeft').addEventListener('click', () => this.turnLeft());
        document.getElementById('btnGoStraight').addEventListener('click', () => this.goStraight());
        document.getElementById('btnTurnRight').addEventListener('click', () => this.turnRight());
        
        // 游戏结束弹窗按钮
        document.getElementById('btnRestartGame').addEventListener('click', () => this.restartGame());
        
        // 键盘控制
        document.addEventListener('keydown', (e) => {
            if (!this.isGameStarted || this.isPaused) return;
            
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    this.turnLeft();
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    this.goStraight();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.turnRight();
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
        map[4][5] = { type: 'obstacle' };
        map[5][4] = { type: 'obstacle' };
        map[2][4] = { type: 'obstacle' };
        map[3][7] = { type: 'obstacle' };
        map[6][2] = { type: 'obstacle' };
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
        
        // 初始化任务
        this.initMissions();
        
        // 生成目标
        this.generateDestination();
        
        // 更新UI
        document.getElementById('btnStart').disabled = true;
        document.getElementById('btnRestart').disabled = false;
        document.getElementById('btnPause').disabled = false;
        document.getElementById('btnTurnLeft').disabled = false;
        document.getElementById('btnGoStraight').disabled = false;
        document.getElementById('btnTurnRight').disabled = false;
        
        this.updateStats();
        this.updateHealthBar();
        this.updatePlayerPosition();
        this.updateDirection();
        
        // 启动计时器
        this.startTimer();
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
            
            // 每2秒移动一次僵尸
            if (this.time % 2 === 0) {
                this.moveZombies();
            }
            
            // 检查僵尸是否与玩家接触
            this.checkZombieContact();
            
            this.updateStats();
        }, 1000);
    }

    updateStats() {
        document.getElementById('currentScore').textContent = this.score;
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
                zombieEl.textContent = zombie.icon;
                cell.appendChild(zombieEl);
            }
        });
    }

    moveZombies() {
        const map = this.createMapLayout();
        this.zombies.forEach(zombie => {
            zombie.move(map, this.playerPos, this.gridSize);
        });
        this.updateZombiesPosition();
    }

    checkZombieContact() {
        this.zombies.forEach(zombie => {
            if (zombie.pos.row === this.playerPos.row && zombie.pos.col === this.playerPos.col) {
                // 僵尸与玩家接触，减少生命值
                this.playerHealth -= 20;
                this.updateHealthBar();
                this.showMessage('💀 被僵尸攻击了！生命值减少20点！ Attacked by zombie! Health reduced by 20!', 'warning');
                
                // 检查是否游戏结束
                if (this.playerHealth <= 0) {
                    this.gameOver();
                }
            }
        });
    }

    updateDirection() {
        const arrow = document.getElementById('directionArrow');
        const text = document.getElementById('directionText');
        
        arrow.textContent = DIRECTION_ARROWS[this.playerDirection];
        text.textContent = getDirectionText(this.playerDirection);
    }

    turnLeft() {
        if (!this.isGameStarted || this.isPaused) return;
        
        this.playerDirection = (this.playerDirection + 3) % 4;
        this.steps++;
        this.currentMissionSteps++;
        
        this.updatePlayerPosition();
        this.updateDirection();
    }

    turnRight() {
        if (!this.isGameStarted || this.isPaused) return;
        
        this.playerDirection = (this.playerDirection + 1) % 4;
        this.steps++;
        this.currentMissionSteps++;
        
        this.updatePlayerPosition();
        this.updateDirection();
    }

    goStraight() {
        if (!this.isGameStarted || this.isPaused) return;
        
        let newRow = this.playerPos.row;
        let newCol = this.playerPos.col;
        
        switch(this.playerDirection) {
            case DIRECTIONS.NORTH: newRow--; break;
            case DIRECTIONS.EAST: newCol++; break;
            case DIRECTIONS.SOUTH: newRow++; break;
            case DIRECTIONS.WEST: newCol--; break;
        }
        
        // 检查移动合法性
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
    }

    gameComplete() {
        clearInterval(this.timer);
        
        this.showMessage(`🏆 恭喜！你完成了所有任务！最终得分：${this.score}`, 'success');
        
        this.isGameStarted = false;
        document.getElementById('btnStart').disabled = false;
        document.getElementById('btnRestart').disabled = true;
        document.getElementById('btnPause').disabled = true;
        document.getElementById('btnTurnLeft').disabled = true;
        document.getElementById('btnGoStraight').disabled = true;
        document.getElementById('btnTurnRight').disabled = true;
    }

    gameOver() {
        clearInterval(this.timer);
        
        // 显示游戏结束弹窗
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('finalMissions').textContent = `${this.missions.filter(m => m.completed).length}/${this.missions.length}`;
        
        const minutes = Math.floor(this.time / 60);
        const seconds = this.time % 60;
        document.getElementById('finalTime').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        document.getElementById('finalSteps').textContent = this.steps;
        
        document.getElementById('gameOverModal').classList.add('active');
        
        this.isGameStarted = false;
        document.getElementById('btnStart').disabled = false;
        document.getElementById('btnRestart').disabled = true;
        document.getElementById('btnPause').disabled = true;
        document.getElementById('btnTurnLeft').disabled = true;
        document.getElementById('btnGoStraight').disabled = true;
        document.getElementById('btnTurnRight').disabled = true;
    }

    restartGame() {
        clearInterval(this.timer);
        this.isGameStarted = false;
        this.isPaused = false;
        
        // 隐藏游戏结束弹窗
        document.getElementById('gameOverModal').classList.remove('active');
        
        // 重置按钮状态
        document.getElementById('btnStart').disabled = false;
        document.getElementById('btnRestart').disabled = true;
        document.getElementById('btnPause').disabled = true;
        document.getElementById('btnTurnLeft').disabled = true;
        document.getElementById('btnGoStraight').disabled = true;
        document.getElementById('btnTurnRight').disabled = true;
        
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
        
        // 重置任务和僵尸
        this.missions = [];
        this.zombies = [];
        this.generateZombies(5);
        
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
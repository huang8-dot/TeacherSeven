class ShopManager {
    constructor() {
        this.items = [];
        this.purchasedItems = [];
        this.purchaseHistory = [];
        this.coins = 0;
        this.currentTab = 'consumables';
        this.selectedItem = null;
        this.quantity = 1;
        this.insufficientModal = null;
        this.previousCoins = 1000;
        this.initializeElements();
        this.loadShopData();
        this.setupEventListeners();
        this.updateUI();
    }

    initializeElements() {
        this.coinAmountEl = document.getElementById('coinAmount');
        this.consumablesGridEl = document.getElementById('consumablesGrid');
        this.permanentGridEl = document.getElementById('permanentGrid');
        this.skillsGridEl = document.getElementById('skillsGrid');
        this.purchaseHistoryEl = document.getElementById('purchaseHistory');
        this.itemModal = document.getElementById('itemModal');
        this.closeModalBtn = document.getElementById('closeModalBtn');
        this.buyBtn = document.getElementById('buyBtn');
        this.cancelBtn = document.getElementById('cancelBtn');
        this.decreaseBtn = document.getElementById('decreaseBtn');
        this.increaseBtn = document.getElementById('increaseBtn');
        this.quantityInput = document.getElementById('quantityInput');
    }

    loadShopData() {
        this.items = {
            consumables: [
                {
                    id: 'health_potion',
                    name: '生命药水 Health Potion',
                    description: '立即恢复30点生命值 Instantly restore 30 health points',
                    icon: '🧪',
                    rarity: 'common',
                    price: 50,
                    effects: ['+30 生命值 Health'],
                    type: 'consumable'
                },
                {
                    id: 'speed_boost',
                    name: '加速药水 Speed Potion',
                    description: '移动速度提升50%，持续10秒 Movement speed +50% for 10 seconds',
                    icon: '⚡',
                    rarity: 'uncommon',
                    price: 100,
                    effects: ['+50% 速度 Speed', '10秒 10s duration'],
                    type: 'consumable'
                },
                {
                    id: 'shield_potion',
                    name: '护盾药水 Shield Potion',
                    description: '免疫伤害5秒 Immune to damage for 5 seconds',
                    icon: '🛡️',
                    rarity: 'uncommon',
                    price: 150,
                    effects: ['免疫伤害 Immunity', '5秒 5s duration'],
                    type: 'consumable'
                },
                {
                    id: 'trap_kit',
                    name: '陷阱套件 Trap Kit',
                    description: '放置3个陷阱 Place 3 traps',
                    icon: '⚠️',
                    rarity: 'rare',
                    price: 200,
                    effects: ['3个陷阱 3 traps'],
                    type: 'consumable'
                }
            ],
            permanent: [
                {
                    id: 'health_boost',
                    name: '生命提升 Health Boost',
                    description: '永久增加20点最大生命值 Permanently increase max health by 20',
                    icon: '❤️',
                    rarity: 'uncommon',
                    price: 300,
                    effects: ['+20 最大生命值 Max Health'],
                    type: 'permanent'
                },
                {
                    id: 'speed_upgrade',
                    name: '速度升级 Speed Upgrade',
                    description: '永久提升10%移动速度 Permanently increase movement speed by 10%',
                    icon: '🏃',
                    rarity: 'rare',
                    price: 500,
                    effects: ['+10% 移动速度 Movement Speed'],
                    type: 'permanent'
                },
                {
                    id: 'detection_range',
                    name: '感知范围 Detection Range',
                    description: '永久增加1格感知范围 Permanently increase detection range by 1',
                    icon: '👁️',
                    rarity: 'rare',
                    price: 400,
                    effects: ['+1 感知范围 Detection Range'],
                    type: 'permanent'
                },
                {
                    id: 'lucky_charm',
                    name: '幸运护符 Lucky Charm',
                    description: '道具生成概率提升20% Increase item spawn rate by 20%',
                    icon: '🍀',
                    rarity: 'epic',
                    price: 800,
                    effects: ['+20% 道具概率 Item Rate'],
                    type: 'permanent'
                }
            ],
            skills: [
                {
                    id: 'dash_upgrade',
                    name: '冲刺升级 Dash Upgrade',
                    description: '冲刺距离从3格提升到5格 Dash distance increased from 3 to 5 cells',
                    icon: '🏃',
                    rarity: 'rare',
                    price: 600,
                    effects: ['冲刺 +2格 Dash +2 cells'],
                    type: 'skill',
                    skill: 'dash'
                },
                {
                    id: 'shield_upgrade',
                    name: '护盾升级 Shield Upgrade',
                    description: '护盾持续时间从5秒提升到8秒 Shield duration increased from 5 to 8 seconds',
                    icon: '🛡️',
                    rarity: 'rare',
                    price: 700,
                    effects: ['护盾 +3秒 Shield +3s'],
                    type: 'skill',
                    skill: 'shield'
                },
                {
                    id: 'trap_upgrade',
                    name: '陷阱升级 Trap Upgrade',
                    description: '陷阱持续时间从3秒提升到5秒 Trap duration increased from 3 to 5 seconds',
                    icon: '⚠️',
                    rarity: 'rare',
                    price: 650,
                    effects: ['陷阱 +2秒 Trap +2s'],
                    type: 'skill',
                    skill: 'trap'
                },
                {
                    id: 'blink_upgrade',
                    name: '闪现升级 Blink Upgrade',
                    description: '闪现冷却时间从25秒减少到20秒 Blink cooldown reduced from 25 to 20 seconds',
                    icon: '✨',
                    rarity: 'epic',
                    price: 900,
                    effects: ['冷却 -5秒 Cooldown -5s'],
                    type: 'skill',
                    skill: 'blink'
                }
            ]
        };

        this.loadPlayerData();
    }

    loadPlayerData() {
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
            this.savePlayerData();
        }

        const savedPurchases = localStorage.getItem('zombieEnhancementPurchases');
        if (savedPurchases) {
            try {
                const data = JSON.parse(savedPurchases);
                this.purchasedItems = data.purchased || [];
                this.purchaseHistory = data.history || [];
            } catch (e) {
                console.error('Failed to load purchases:', e);
            }
        }
    }

    setupEventListeners() {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentTab = e.target.dataset.tab;
                this.updateShopSections();
            });
        });

        this.closeModalBtn.addEventListener('click', () => this.closeModal());
        this.cancelBtn.addEventListener('click', () => this.closeModal());
        this.itemModal.addEventListener('click', (e) => {
            if (e.target === this.itemModal) this.closeModal();
        });

        this.buyBtn.addEventListener('click', () => this.purchaseItem());
        this.decreaseBtn.addEventListener('click', () => this.changeQuantity(-1));
        this.increaseBtn.addEventListener('click', () => this.changeQuantity(1));
        this.quantityInput.addEventListener('change', (e) => {
            this.quantity = Math.max(1, Math.min(99, parseInt(e.target.value) || 1));
            this.quantityInput.value = this.quantity;
        });

        const coinDisplay = document.querySelector('.coin-display');
        if (coinDisplay) {
            coinDisplay.addEventListener('click', () => {
                this.showInsufficientGoldModal();
            });
            coinDisplay.style.cursor = 'pointer';
        }
    }

    updateUI() {
        this.updateCoinDisplay();
        this.updateShopSections();
        this.updatePurchaseHistory();
    }

    updateCoinDisplay() {
        this.coinAmountEl.textContent = this.coins;
    }

    updateShopSections() {
        this.renderShopItems(this.items.consumables, this.consumablesGridEl);
        this.renderShopItems(this.items.permanent, this.permanentGridEl);
        this.renderShopItems(this.items.skills, this.skillsGridEl);

        const sections = document.querySelectorAll('.shop-section');
        sections.forEach(section => {
            section.classList.remove('active');
        });

        const activeSection = document.getElementById(this.currentTab);
        if (activeSection) {
            activeSection.classList.add('active');
        }
    }

    renderShopItems(items, container) {
        container.innerHTML = items.map(item => {
            const isPurchased = this.purchasedItems.includes(item.id);
            const canAfford = this.coins >= item.price;
            const statusClass = isPurchased ? 'purchased' : '';
            const rarityClass = item.rarity;

            return `
                <div class="shop-item ${statusClass}" data-id="${item.id}">
                    <div class="item-header">
                        <div class="item-icon">${item.icon}</div>
                        <div class="item-title">
                            <div class="item-name">${item.name}</div>
                            <div class="item-rarity ${rarityClass}">${this.getRarityText(item.rarity)}</div>
                        </div>
                    </div>
                    <div class="item-description">${item.description}</div>
                    <div class="item-effects">
                        <div class="effects-label">效果 Effects</div>
                        <div class="effects-list">
                            ${item.effects.map(effect => `<span class="effect">${effect}</span>`).join('')}
                        </div>
                    </div>
                    <div class="item-price">
                        <div class="price-label">价格 Price</div>
                        <div class="price-value">
                            <span class="coin-icon">💰</span>
                            <span>${item.price}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        container.querySelectorAll('.shop-item:not(.purchased)').forEach(itemEl => {
            itemEl.addEventListener('click', () => {
                const itemId = itemEl.dataset.id;
                this.openItemModal(itemId);
            });
        });
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

    updatePurchaseHistory() {
        const recentPurchases = this.purchaseHistory.slice(-10).reverse();

        this.purchaseHistoryEl.innerHTML = recentPurchases.map(purchase => {
            const item = this.findItemById(purchase.itemId);
            if (!item) return '';

            const date = new Date(purchase.timestamp);
            const totalCost = purchase.price * purchase.quantity;

            return `
                <div class="history-item">
                    <div class="history-icon">${item.icon}</div>
                    <div class="history-info">
                        <div class="history-name">${item.name} x${purchase.quantity}</div>
                        <div class="history-date">${date.toLocaleString('zh-CN')}</div>
                    </div>
                    <div class="history-price">💰 ${totalCost}</div>
                </div>
            `;
        }).join('');

        if (recentPurchases.length === 0) {
            this.purchaseHistoryEl.innerHTML = `
                <div class="history-item" style="justify-content: center; color: #95a5a6;">
                    暂无购买记录 No purchases yet
                </div>
            `;
        }
    }

    findItemById(itemId) {
        for (const category of Object.values(this.items)) {
            const item = category.find(i => i.id === itemId);
            if (item) return item;
        }
        return null;
    }

    openItemModal(itemId) {
        const item = this.findItemById(itemId);
        if (!item) return;

        this.selectedItem = item;
        this.quantity = 1;
        this.quantityInput.value = 1;

        document.getElementById('modalIcon').textContent = item.icon;
        document.getElementById('modalTitle').textContent = item.name;
        document.getElementById('modalRarity').textContent = this.getRarityText(item.rarity);
        document.getElementById('modalRarity').className = `item-rarity ${item.rarity}`;
        document.getElementById('modalDescription').textContent = item.description;
        document.getElementById('modalEffects').innerHTML = item.effects.map(effect => 
            `<span class="effect">${effect}</span>`
        ).join('');
        document.getElementById('modalPrice').textContent = item.price;

        this.updateBuyButton();
        this.itemModal.classList.add('active');
    }

    closeModal() {
        this.itemModal.classList.remove('active');
        this.selectedItem = null;
        this.quantity = 1;
    }

    changeQuantity(delta) {
        this.quantity = Math.max(1, Math.min(99, this.quantity + delta));
        this.quantityInput.value = this.quantity;
        this.updateBuyButton();
    }

    updateBuyButton() {
        if (!this.selectedItem) return;

        const totalCost = this.selectedItem.price * this.quantity;
        const canAfford = this.coins >= totalCost;

        this.buyBtn.disabled = !canAfford;
        this.buyBtn.textContent = canAfford ? `购买 Buy (💰 ${totalCost})` : `金币不足 Not enough coins`;
    }

    purchaseItem() {
        if (!this.selectedItem) return;

        const totalCost = this.selectedItem.price * this.quantity;
        if (this.coins < totalCost) {
            const shortage = totalCost - this.coins;
            this.showInsufficientCoinsModal(shortage);
            return;
        }

        this.previousCoins = this.coins;
        this.coins -= totalCost;

        if (this.coins <= 0) {
            this.showInsufficientGoldModal();
            this.coins = this.previousCoins;
            this.savePlayerData();
            this.updateCoinDisplay();
            return;
        }

        if (this.selectedItem.type === 'permanent' || this.selectedItem.type === 'skill') {
            if (!this.purchasedItems.includes(this.selectedItem.id)) {
                this.purchasedItems.push(this.selectedItem.id);
            }
        }

        const purchase = {
            itemId: this.selectedItem.id,
            price: this.selectedItem.price,
            quantity: this.quantity,
            timestamp: new Date().toISOString()
        };
        this.purchaseHistory.push(purchase);

        this.savePlayerData();
        this.updateUI();
        this.closeModal();
        this.showToast(`购买成功！Purchase successful! -${totalCost} 金币`, 'positive');
    }

    savePlayerData() {
        localStorage.setItem('zombieEnhancementCoins', this.coins.toString());
        localStorage.setItem('zombieEnhancementPurchases', JSON.stringify({
            purchased: this.purchasedItems,
            history: this.purchaseHistory
        }));
    }

    addCoins(amount) {
        this.coins += amount;
        this.savePlayerData();
        this.updateCoinDisplay();
    }

    showToast(message, type = 'neutral') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = `toast active ${type}`;
        
        setTimeout(() => {
            toast.classList.remove('active');
        }, 3000);
    }

    showInsufficientCoinsModal(shortage) {
        const modal = document.createElement('div');
        modal.className = 'insufficient-coins-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>💰 金币不足 Insufficient Coins</h2>
                    <button class="close-btn" onclick="this.closest('.insufficient-coins-modal').remove()">✕</button>
                </div>
                <div class="modal-body">
                    <p class="shortage-info">您还缺少 ${shortage} 金币 You need ${shortage} more coins</p>
                    
                    <div class="earn-methods">
                        <h3>🎮 获得金币的方法 Ways to Earn Coins</h3>
                        <div class="method-item">
                            <span class="method-icon">🏃</span>
                            <div class="method-info">
                                <div class="method-title">玩游戏 Play Games</div>
                                <div class="method-desc">在僵尸模式游戏中生存并获得分数 Survive and score in zombie mode</div>
                            </div>
                        </div>
                        <div class="method-item">
                            <span class="method-icon">❤️</span>
                            <div class="method-info">
                                <div class="method-title">收集道具 Collect Items</div>
                                <div class="method-desc">收集爱心道具获得金币 Collect hearts to earn coins</div>
                            </div>
                        </div>
                        <div class="method-item">
                            <span class="method-icon">🧟</span>
                            <div class="method-info">
                                <div class="method-title">击败僵尸 Defeat Zombies</div>
                                <div class="method-desc">使用技能击败僵尸获得奖励 Use skills to defeat zombies for rewards</div>
                            </div>
                        </div>
                        <div class="method-item">
                            <span class="method-icon">🎯</span>
                            <div class="method-info">
                                <div class="method-title">完成任务 Complete Tasks</div>
                                <div class="method-desc">完成游戏任务获得金币奖励 Complete game tasks for coin rewards</div>
                            </div>
                        </div>
                        <div class="method-item">
                            <span class="method-icon">🏆</span>
                            <div class="method-info">
                                <div class="method-title">达成成就 Achieve Goals</div>
                                <div class="method-desc">解锁成就获得额外金币 Unlock achievements for bonus coins</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="modal-actions">
                        <button class="action-btn primary" onclick="window.location.href='zombie-enhancement.html'">
                            🎮 开始游戏 Start Game
                        </button>
                        <button class="action-btn secondary" onclick="this.closest('.insufficient-coins-modal').remove()">
                            ❌ 关闭 Close
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
    }

    showInsufficientGoldModal() {
        if (this.insufficientModal) {
            this.insufficientModal.remove();
        }

        this.insufficientModal = document.createElement('div');
        this.insufficientModal.className = 'insufficient-gold-modal';
        this.insufficientModal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h2>⚠️ 金币不足 Insufficient Gold Balance</h2>
                    <button class="close-btn" onclick="window.shopManager.closeInsufficientGoldModal()">✕</button>
                </div>
                <div class="modal-body">
                    <div class="warning-icon">💰</div>
                    <p class="warning-message">您的金币余额不足，无法完成此操作 Your gold balance is insufficient to complete this operation</p>
                    <p class="current-balance">当前余额 Current Balance: <span class="balance-amount">${this.coins}</span> 金币</p>
                    
                    <div class="modal-actions">
                        <button class="action-btn primary" onclick="window.location.href='zombie-enhancement.html'">
                            🎮 开始游戏 Start Game
                        </button>
                        <button class="action-btn secondary" onclick="window.shopManager.closeInsufficientGoldModal()">
                            ❌ 关闭 Close
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(this.insufficientModal);
        document.body.style.overflow = 'hidden';
        
        setTimeout(() => {
            this.insufficientModal.classList.add('active');
        }, 10);
    }

    closeInsufficientGoldModal() {
        if (this.insufficientModal) {
            this.insufficientModal.classList.remove('active');
            setTimeout(() => {
                this.insufficientModal.remove();
                this.insufficientModal = null;
                document.body.style.overflow = '';
            }, 300);
        }
    }
}

window.shopManager = null;

document.addEventListener('DOMContentLoaded', () => {
    window.shopManager = new ShopManager();
});
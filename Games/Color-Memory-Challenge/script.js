class ColorMemoryChallenge {
    constructor() {
        this.level = 1;
        this.score = 0;
        this.round = 1;
        this.lives = 3;
        this.difficulty = 'easy';
        this.gameActive = false;
        this.showingSequence = false;
        this.playerTurn = false;
        
        this.sequence = [];
        this.playerSequence = [];
        this.currentStep = 0;
        this.perfectRounds = 0;
        this.highestLevel = 1;
        
        this.colors = {
            easy: ['red', 'blue', 'green'],
            medium: ['red', 'blue', 'green', 'yellow'],
            hard: ['red', 'blue', 'green', 'yellow', 'purple', 'orange']
        };
        
        this.initializeElements();
        this.bindEvents();
        this.showStartScreen();
    }
    
    initializeElements() {
        this.levelEl = document.getElementById('level');
        this.scoreEl = document.getElementById('score');
        this.roundEl = document.getElementById('round');
        this.instructionEl = document.getElementById('instruction-text');
        this.currentStepEl = document.getElementById('current-step');
        this.totalStepsEl = document.getElementById('total-steps');
        this.colorButtons = document.querySelectorAll('.color-button');
        this.livesEl = document.getElementById('lives');
        this.progressCircle = document.getElementById('progress-circle');
        this.progressText = document.getElementById('progress-text');
        this.startScreen = document.getElementById('start-screen');
        this.gameScreen = document.getElementById('game-screen');
        this.gameOverScreen = document.getElementById('game-over-screen');
        this.finalScoreEl = document.getElementById('final-score');
        this.highestLevelEl = document.getElementById('highest-level');
        this.perfectRoundsEl = document.getElementById('perfect-rounds');
        this.achievementBadges = document.getElementById('achievement-badges');
    }
    
    bindEvents() {
        document.getElementById('start-game-btn').addEventListener('click', () => this.startGame());
        document.getElementById('play-again-btn').addEventListener('click', () => this.restartGame());
        document.getElementById('start-sequence').addEventListener('click', () => this.startSequence());
        document.getElementById('repeat-sequence').addEventListener('click', () => this.repeatSequence());
        document.getElementById('hint-btn').addEventListener('click', () => this.showHint());
        
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.difficulty = e.target.dataset.difficulty;
                document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('selected'));
                e.target.classList.add('selected');
            });
        });
        
        this.colorButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (this.playerTurn && this.gameActive) {
                    this.handleColorClick(e.target.dataset.color);
                }
            });
            
            // Touch events for mobile
            btn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                if (this.playerTurn && this.gameActive) {
                    btn.style.transform = 'scale(0.9)';
                }
            });
            
            btn.addEventListener('touchend', (e) => {
                e.preventDefault();
                if (this.playerTurn && this.gameActive) {
                    btn.style.transform = '';
                    this.handleColorClick(e.target.dataset.color);
                }
            });
        });
    }
    
    startGame() {
        this.gameActive = true;
        this.score = 0;
        this.round = 1;
        this.level = 1;
        this.lives = 3;
        this.perfectRounds = 0;
        this.highestLevel = 1;
        
        this.updateUI();
        this.showGameScreen();
        this.updateColorGrid();
        this.generateSequence();
    }
    
    updateColorGrid() {
        const availableColors = this.colors[this.difficulty];
        this.colorButtons.forEach(btn => {
            const color = btn.dataset.color;
            if (availableColors.includes(color)) {
                btn.style.display = 'flex';
            } else {
                btn.style.display = 'none';
            }
        });
    }
    
    generateSequence() {
        const availableColors = this.colors[this.difficulty];
        const sequenceLength = Math.min(3 + this.level, 12);
        this.sequence = [];
        
        for (let i = 0; i < sequenceLength; i++) {
            const randomColor = availableColors[Math.floor(Math.random() * availableColors.length)];
            this.sequence.push(randomColor);
        }
        
        this.playerSequence = [];
        this.currentStep = 0;
        this.updateSequenceDisplay();
        this.instructionEl.textContent = 'Click "Start" to see the sequence!';
    }
    
    startSequence() {
        if (this.showingSequence) return;
        this.showSequence();
    }
    
    async showSequence() {
        this.showingSequence = true;
        this.playerTurn = false;
        this.instructionEl.textContent = 'Watch carefully!';
        
        for (let i = 0; i < this.sequence.length; i++) {
            await this.delay(600);
            this.highlightColor(this.sequence[i]);
            this.currentStep = i + 1;
            this.updateSequenceDisplay();
            await this.delay(400);
            this.unhighlightAll();
        }
        
        await this.delay(800);
        this.showingSequence = false;
        this.playerTurn = true;
        this.currentStep = 0;
        this.updateSequenceDisplay();
        this.instructionEl.textContent = 'Now repeat the sequence!';
    }
    
    repeatSequence() {
        if (!this.showingSequence) {
            this.showSequence();
        }
    }
    
    highlightColor(color) {
        const button = document.querySelector(`[data-color="${color}"]`);
        if (button) {
            button.classList.add('active');
            this.playSound(button.dataset.sound);
        }
    }
    
    unhighlightAll() {
        this.colorButtons.forEach(btn => btn.classList.remove('active'));
    }
    
    playSound(note) {
        // Create audio context for sound effects
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        const frequencies = {
            do: 261.63, re: 293.66, mi: 329.63, fa: 349.23, sol: 392.00, la: 440.00
        };
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(frequencies[note] || 440, this.audioContext.currentTime);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.3);
    }
    
    handleColorClick(color) {
        if (!this.playerTurn || this.showingSequence) return;
        
        this.highlightColor(color);
        setTimeout(() => this.unhighlightAll(), 200);
        
        this.playerSequence.push(color);
        this.currentStep = this.playerSequence.length;
        this.updateSequenceDisplay();
        
        if (this.playerSequence[this.playerSequence.length - 1] !== this.sequence[this.playerSequence.length - 1]) {
            this.handleIncorrectInput();
            return;
        }
        
        if (this.playerSequence.length === this.sequence.length) {
            this.handleCorrectSequence();
        }
    }
    
    handleCorrectSequence() {
        this.playerTurn = false;
        this.score += this.sequence.length * this.getDifficultyMultiplier() * 10;
        this.perfectRounds++;
        
        this.showFeedback('Perfect! Well done! 🎉', 'success');
        
        setTimeout(() => {
            this.nextRound();
        }, 1500);
    }
    
    handleIncorrectInput() {
        this.playerTurn = false;
        this.lives--;
        this.updateLivesDisplay();
        
        if (this.lives <= 0) {
            this.showFeedback('Game Over! 😢', 'error');
            setTimeout(() => this.endGame(), 1500);
        } else {
            this.showFeedback('Try again! 💪', 'warning');
            setTimeout(() => {
                this.playerSequence = [];
                this.currentStep = 0;
                this.updateSequenceDisplay();
                this.playerTurn = true;
                this.instructionEl.textContent = 'Try the sequence again!';
            }, 1500);
        }
    }
    
    nextRound() {
        this.round++;
        
        if (this.round % 5 === 0) {
            this.level++;
            this.highestLevel = Math.max(this.highestLevel, this.level);
            this.showLevelUp();
        } else {
            this.generateSequence();
        }
        
        this.updateUI();
        this.updateProgress();
    }
    
    showLevelUp() {
        this.showFeedback(`Level ${this.level}! Sequences getting longer! 🚀`, 'success');
        setTimeout(() => {
            this.generateSequence();
        }, 2000);
    }
    
    showHint() {
        if (this.playerSequence.length < this.sequence.length && this.playerTurn) {
            const nextColor = this.sequence[this.playerSequence.length];
            this.highlightColor(nextColor);
            setTimeout(() => this.unhighlightAll(), 800);
            this.score = Math.max(0, this.score - 5);
            this.updateUI();
            this.showFeedback('Here\'s the next color! 💡', 'info');
        }
    }
    
    showFeedback(message, type) {
        const feedback = document.createElement('div');
        feedback.textContent = message;
        feedback.className = `feedback ${type}`;
        feedback.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: ${this.getFeedbackColor(type)};
            color: white;
            padding: 20px 30px;
            border-radius: 15px;
            font-size: 1.4em;
            font-weight: bold;
            z-index: 2000;
            text-align: center;
            animation: feedbackAnimation 1.5s ease;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        `;
        
        document.body.appendChild(feedback);
        setTimeout(() => feedback.remove(), 1500);
    }
    
    getFeedbackColor(type) {
        const colors = {
            success: 'linear-gradient(45deg, #00b894, #00cec9)',
            error: 'linear-gradient(45deg, #d63031, #e17055)',
            warning: 'linear-gradient(45deg, #fdcb6e, #e17055)',
            info: 'linear-gradient(45deg, #74b9ff, #0984e3)'
        };
        return colors[type] || colors.info;
    }
    
    getDifficultyMultiplier() {
        const multipliers = {easy: 1, medium: 1.5, hard: 2};
        return multipliers[this.difficulty];
    }
    
    updateSequenceDisplay() {
        this.currentStepEl.textContent = this.currentStep;
        this.totalStepsEl.textContent = this.sequence.length;
    }
    
    updateProgress() {
        const progress = (this.round % 5) / 5 * 100;
        const circumference = 2 * Math.PI * 50;
        const offset = circumference - (progress / 100) * circumference;
        this.progressCircle.style.strokeDashoffset = offset;
        this.progressText.textContent = `${Math.round(progress)}%`;
    }
    
    updateLivesDisplay() {
        const hearts = this.livesEl.querySelectorAll('.heart');
        hearts.forEach((heart, index) => {
            if (index >= this.lives) {
                heart.classList.add('lost');
            } else {
                heart.classList.remove('lost');
            }
        });
    }
    
    updateUI() {
        this.levelEl.textContent = this.level;
        this.scoreEl.textContent = this.score;
        this.roundEl.textContent = this.round;
    }
    
    showStartScreen() {
        this.startScreen.classList.remove('hidden');
        this.gameScreen.style.display = 'none';
        this.gameOverScreen.classList.add('hidden');
    }
    
    showGameScreen() {
        this.startScreen.classList.add('hidden');
        this.gameScreen.style.display = 'flex';
        this.gameOverScreen.classList.add('hidden');
    }
    
    endGame() {
        this.finalScoreEl.textContent = this.score;
        this.highestLevelEl.textContent = this.highestLevel;
        this.perfectRoundsEl.textContent = this.perfectRounds;
        
        this.generateAchievements();
        
        this.gameScreen.style.display = 'none';
        this.gameOverScreen.classList.remove('hidden');
    }
    
    generateAchievements() {
        this.achievementBadges.innerHTML = '';
        const achievements = [];
        
        if (this.score >= 500) achievements.push('🏆 High Scorer');
        if (this.perfectRounds >= 10) achievements.push('⭐ Perfect Player');
        if (this.highestLevel >= 5) achievements.push('🚀 Level Master');
        if (this.perfectRounds >= 5) achievements.push('🎯 Sharp Memory');
        
        achievements.forEach(achievement => {
            const badge = document.createElement('div');
            badge.className = 'badge';
            badge.textContent = achievement;
            this.achievementBadges.appendChild(badge);
        });
    }
    
    restartGame() {
        this.difficulty = 'easy';
        this.showStartScreen();
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Add feedback animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes feedbackAnimation {
        0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
        20% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
        25% { transform: translate(-50%, -50%) scale(1); }
        75% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
    }
`;
document.head.appendChild(style);

// Initialize game
document.addEventListener('DOMContentLoaded', () => {
    new ColorMemoryChallenge();
});

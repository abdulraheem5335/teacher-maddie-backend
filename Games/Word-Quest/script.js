class WordQuest {
    constructor() {
        this.level = 1;
        this.score = 0;
        this.streak = 0;
        this.bestStreak = 0;
        this.currentWord = 0;
        this.totalWords = 10;
        this.difficulty = 'easy';
        this.gameActive = false;
        this.hintsUsed = 0;
        this.wordsLearned = 0;
        
        this.currentWordData = {};
        this.playerAnswer = [];
        
        this.wordDatabase = {
            easy: [
                {word: 'CAT', emoji: '🐱', definition: 'A small furry pet that says meow'},
                {word: 'DOG', emoji: '🐕', definition: 'A loyal pet that barks and wags its tail'},
                {word: 'SUN', emoji: '☀️', definition: 'The bright star that gives us light and warmth'},
                {word: 'TREE', emoji: '🌳', definition: 'A tall plant with branches and leaves'},
                {word: 'BIRD', emoji: '🐦', definition: 'An animal that can fly and has feathers'},
                {word: 'FISH', emoji: '🐟', definition: 'An animal that swims in water'},
                {word: 'BOOK', emoji: '📚', definition: 'Something you read that has pages and words'},
                {word: 'BALL', emoji: '⚽', definition: 'A round toy you can throw and catch'},
                {word: 'CAKE', emoji: '🎂', definition: 'A sweet dessert for birthdays'},
                {word: 'STAR', emoji: '⭐', definition: 'A twinkling light in the night sky'}
            ],
            medium: [
                {word: 'APPLE', emoji: '🍎', definition: 'A crunchy red or green fruit'},
                {word: 'HOUSE', emoji: '🏠', definition: 'A building where people live'},
                {word: 'FLOWER', emoji: '🌸', definition: 'A colorful part of a plant that smells nice'},
                {word: 'SCHOOL', emoji: '🏫', definition: 'A place where children go to learn'},
                {word: 'FRIEND', emoji: '👫', definition: 'Someone you like to play and spend time with'},
                {word: 'HAPPY', emoji: '😊', definition: 'The feeling when something good happens'},
                {word: 'PLANET', emoji: '🪐', definition: 'A large round object in space like Earth'},
                {word: 'CASTLE', emoji: '🏰', definition: 'A big stone building where kings and queens lived'},
                {word: 'ROCKET', emoji: '🚀', definition: 'A vehicle that can fly to space'},
                {word: 'RAINBOW', emoji: '🌈', definition: 'Colorful arcs in the sky after rain'}
            ],
            hard: [
                {word: 'ELEPHANT', emoji: '🐘', definition: 'A very large gray animal with a long trunk'},
                {word: 'BUTTERFLY', emoji: '🦋', definition: 'A colorful insect with beautiful wings'},
                {word: 'MOUNTAIN', emoji: '⛰️', definition: 'A very tall hill that reaches toward the sky'},
                {word: 'DINOSAUR', emoji: '🦕', definition: 'A giant lizard that lived long ago'},
                {word: 'TREASURE', emoji: '💰', definition: 'Valuable things like gold and jewels'},
                {word: 'ADVENTURE', emoji: '🗺️', definition: 'An exciting journey to new places'},
                {word: 'PRINCESS', emoji: '👸', definition: 'A daughter of a king and queen'},
                {word: 'MAGICAL', emoji: '✨', definition: 'Something that seems to have special powers'},
                {word: 'GIGANTIC', emoji: '🦣', definition: 'Extremely large or huge'},
                {word: 'WONDERFUL', emoji: '🌟', definition: 'Something that makes you feel amazed and happy'}
            ]
        };
        
        this.initializeElements();
        this.bindEvents();
        this.showStartScreen();
    }
    
    initializeElements() {
        this.levelEl = document.getElementById('level');
        this.scoreEl = document.getElementById('score');
        this.streakEl = document.getElementById('streak');
        this.imageHintEl = document.getElementById('image-hint');
        this.wordLettersEl = document.getElementById('word-letters');
        this.definitionEl = document.getElementById('definition');
        this.lettersEl = document.getElementById('letters');
        this.progressFill = document.getElementById('progress-fill');
        this.progressText = document.getElementById('progress-text');
        this.startScreen = document.getElementById('start-screen');
        this.gameScreen = document.getElementById('game-screen');
        this.gameOverScreen = document.getElementById('game-over-screen');
        this.finalScoreEl = document.getElementById('final-score');
        this.wordsLearnedEl = document.getElementById('words-learned');
        this.bestStreakEl = document.getElementById('best-streak');
    }
    
    bindEvents() {
        document.getElementById('start-btn').addEventListener('click', () => this.startGame());
        document.getElementById('restart-btn').addEventListener('click', () => this.restartGame());
        document.getElementById('hint-btn').addEventListener('click', () => this.showHint());
        document.getElementById('clear-btn').addEventListener('click', () => this.clearWord());
        document.getElementById('submit-btn').addEventListener('click', () => this.submitWord());
        
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.difficulty = e.target.dataset.difficulty;
                document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('selected'));
                e.target.classList.add('selected');
            });
        });
        
        // Touch events for mobile
        document.addEventListener('touchstart', (e) => {
            if (e.target.classList.contains('letter-btn') || e.target.classList.contains('letter-slot')) {
                e.target.style.transform = 'scale(0.95)';
            }
        });
        
        document.addEventListener('touchend', (e) => {
            if (e.target.classList.contains('letter-btn') || e.target.classList.contains('letter-slot')) {
                e.target.style.transform = '';
            }
        });
        
        // Keyboard support
        document.addEventListener('keydown', (e) => {
            if (this.gameActive) {
                if (e.key.match(/[a-zA-Z]/)) {
                    this.addLetter(e.key.toUpperCase());
                } else if (e.key === 'Backspace') {
                    this.removeLetter();
                } else if (e.key === 'Enter') {
                    this.submitWord();
                }
            }
        });
    }
    
    startGame() {
        this.gameActive = true;
        this.score = 0;
        this.streak = 0;
        this.currentWord = 0;
        this.level = 1;
        this.hintsUsed = 0;
        this.wordsLearned = 0;
        
        this.updateUI();
        this.showGameScreen();
        this.loadNextWord();
    }
    
    loadNextWord() {
        const words = this.wordDatabase[this.difficulty];
        this.currentWordData = words[Math.floor(Math.random() * words.length)];
        this.playerAnswer = [];
        
        this.displayWord();
        this.generateLetterBank();
        this.updateProgress();
    }
    
    displayWord() {
        this.imageHintEl.textContent = this.currentWordData.emoji;
        this.definitionEl.textContent = this.currentWordData.definition;
        
        // Create letter slots
        this.wordLettersEl.innerHTML = '';
        for (let i = 0; i < this.currentWordData.word.length; i++) {
            const slot = document.createElement('div');
            slot.className = 'letter-slot';
            slot.dataset.index = i;
            slot.addEventListener('click', () => this.removeLetter(i));
            this.wordLettersEl.appendChild(slot);
        }
    }
    
    generateLetterBank() {
        const wordLetters = this.currentWordData.word.split('');
        const extraLetters = this.generateExtraLetters(wordLetters.length);
        const allLetters = [...wordLetters, ...extraLetters];
        
        // Shuffle letters
        for (let i = allLetters.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allLetters[i], allLetters[j]] = [allLetters[j], allLetters[i]];
        }
        
        this.lettersEl.innerHTML = '';
        allLetters.forEach(letter => {
            const btn = document.createElement('button');
            btn.className = 'letter-btn';
            btn.textContent = letter;
            btn.addEventListener('click', () => this.addLetter(letter, btn));
            this.lettersEl.appendChild(btn);
        });
    }
    
    generateExtraLetters(wordLength) {
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const extraCount = Math.max(4, Math.floor(wordLength * 1.5));
        const extras = [];
        
        for (let i = 0; i < extraCount; i++) {
            extras.push(alphabet[Math.floor(Math.random() * alphabet.length)]);
        }
        
        return extras;
    }
    
    addLetter(letter, btnElement = null) {
        if (this.playerAnswer.length >= this.currentWordData.word.length) return;
        
        const nextSlot = this.wordLettersEl.children[this.playerAnswer.length];
        if (nextSlot) {
            nextSlot.textContent = letter;
            nextSlot.classList.add('filled');
            this.playerAnswer.push(letter);
            
            if (btnElement) {
                btnElement.classList.add('used');
                btnElement.disabled = true;
            }
        }
    }
    
    removeLetter(index = null) {
        if (index !== null) {
            // Remove specific letter
            if (index < this.playerAnswer.length) {
                const letter = this.playerAnswer[index];
                this.playerAnswer.splice(index, 1);
                this.updateWordDisplay();
                this.enableLetterButton(letter);
            }
        } else {
            // Remove last letter
            if (this.playerAnswer.length > 0) {
                const letter = this.playerAnswer.pop();
                const slot = this.wordLettersEl.children[this.playerAnswer.length];
                slot.textContent = '';
                slot.classList.remove('filled');
                this.enableLetterButton(letter);
            }
        }
    }
    
    updateWordDisplay() {
        Array.from(this.wordLettersEl.children).forEach((slot, index) => {
            if (index < this.playerAnswer.length) {
                slot.textContent = this.playerAnswer[index];
                slot.classList.add('filled');
            } else {
                slot.textContent = '';
                slot.classList.remove('filled');
            }
        });
    }
    
    enableLetterButton(letter) {
        const buttons = Array.from(this.lettersEl.children);
        const button = buttons.find(btn => btn.textContent === letter && btn.disabled);
        if (button) {
            button.classList.remove('used');
            button.disabled = false;
        }
    }
    
    clearWord() {
        this.playerAnswer = [];
        Array.from(this.wordLettersEl.children).forEach(slot => {
            slot.textContent = '';
            slot.classList.remove('filled');
        });
        Array.from(this.lettersEl.children).forEach(btn => {
            btn.classList.remove('used');
            btn.disabled = false;
        });
    }
    
    showHint() {
        if (this.hintsUsed >= 2) {
            this.showFeedback('No more hints available! 🤔');
            return;
        }
        
        const correctWord = this.currentWordData.word;
        const emptySlots = [];
        
        Array.from(this.wordLettersEl.children).forEach((slot, index) => {
            if (!slot.classList.contains('filled')) {
                emptySlots.push(index);
            }
        });
        
        if (emptySlots.length > 0) {
            const randomIndex = emptySlots[Math.floor(Math.random() * emptySlots.length)];
            const hintLetter = correctWord[randomIndex];
            this.addLetter(hintLetter);
            this.hintsUsed++;
            this.showFeedback('Here\'s a letter to help! 💡');
        }
    }
    
    submitWord() {
        if (this.playerAnswer.length !== this.currentWordData.word.length) {
            this.showFeedback('Please fill in all letters! 📝');
            return;
        }
        
        const playerWord = this.playerAnswer.join('');
        const correctWord = this.currentWordData.word;
        
        if (playerWord === correctWord) {
            this.handleCorrectAnswer();
        } else {
            this.handleIncorrectAnswer();
        }
    }
    
    handleCorrectAnswer() {
        this.score += (10 * this.getDifficultyMultiplier()) - (this.hintsUsed * 2);
        this.streak++;
        this.wordsLearned++;
        this.bestStreak = Math.max(this.bestStreak, this.streak);
        
        this.wordLettersEl.classList.add('correct-word');
        this.showFeedback('Excellent! Well done! 🎉');
        
        setTimeout(() => {
            this.wordLettersEl.classList.remove('correct-word');
            this.nextWord();
        }, 1500);
    }
    
    handleIncorrectAnswer() {
        this.streak = 0;
        this.showFeedback(`Try again! The word is: ${this.currentWordData.word} 📚`);
        
        setTimeout(() => {
            this.nextWord();
        }, 2000);
    }
    
    getDifficultyMultiplier() {
        const multipliers = {easy: 1, medium: 2, hard: 3};
        return multipliers[this.difficulty];
    }
    
    nextWord() {
        this.currentWord++;
        this.hintsUsed = 0;
        
        if (this.currentWord >= this.totalWords) {
            if (this.difficulty === 'easy' && this.wordsLearned >= 7) {
                this.difficulty = 'medium';
                this.level++;
                this.currentWord = 0;
                this.showLevelUp();
                return;
            } else if (this.difficulty === 'medium' && this.wordsLearned >= 15) {
                this.difficulty = 'hard';
                this.level++;
                this.currentWord = 0;
                this.showLevelUp();
                return;
            } else {
                this.endGame();
                return;
            }
        }
        
        this.loadNextWord();
    }
    
    showLevelUp() {
        this.showFeedback(`Level Up! Now trying ${this.difficulty} words! 🚀`);
        setTimeout(() => {
            this.loadNextWord();
        }, 2000);
    }
    
    showFeedback(message) {
        const feedback = document.createElement('div');
        feedback.textContent = message;
        feedback.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0,0,0,0.9);
            color: white;
            padding: 20px 30px;
            border-radius: 15px;
            font-size: 1.3em;
            z-index: 2000;
            text-align: center;
            animation: feedbackSlide 2s ease;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        `;
        
        document.body.appendChild(feedback);
        setTimeout(() => feedback.remove(), 2000);
    }
    
    updateProgress() {
        const progress = (this.currentWord / this.totalWords) * 100;
        this.progressFill.style.width = `${progress}%`;
        this.progressText.textContent = `${this.currentWord + 1}/${this.totalWords}`;
    }
    
    updateUI() {
        this.levelEl.textContent = this.level;
        this.scoreEl.textContent = this.score;
        this.streakEl.textContent = this.streak;
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
        this.wordsLearnedEl.textContent = this.wordsLearned;
        this.bestStreakEl.textContent = this.bestStreak;
        
        this.gameScreen.style.display = 'none';
        this.gameOverScreen.classList.remove('hidden');
    }
    
    restartGame() {
        this.difficulty = 'easy';
        this.showStartScreen();
    }
}

// Add feedback animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes feedbackSlide {
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
    new WordQuest();
});

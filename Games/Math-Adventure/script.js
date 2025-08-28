class MathAdventure {
    constructor() {
        this.level = 1;
        this.score = 0;
        this.lives = 3;
        this.currentQuestion = 0;
        this.totalQuestions = 10;
        this.difficulty = 1;
        this.gameActive = false;
        
        this.questions = [];
        this.correctAnswer = 0;
        
        this.initializeElements();
        this.bindEvents();
        this.showStartScreen();
    }
    
    initializeElements() {
        this.levelEl = document.getElementById('level');
        this.scoreEl = document.getElementById('score');
        this.livesEl = document.getElementById('lives');
        this.questionEl = document.getElementById('question');
        this.answersEl = document.getElementById('answers');
        this.progressFill = document.getElementById('progress-fill');
        this.startScreen = document.getElementById('start-screen');
        this.gameScreen = document.getElementById('game-screen');
        this.gameOverScreen = document.getElementById('game-over-screen');
        this.finalScoreEl = document.getElementById('final-score');
    }
    
    bindEvents() {
        document.getElementById('start-btn').addEventListener('click', () => this.startGame());
        document.getElementById('restart-btn').addEventListener('click', () => this.restartGame());
        
        document.querySelectorAll('.level-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.difficulty = parseInt(e.target.dataset.level);
                document.querySelectorAll('.level-btn').forEach(b => b.classList.remove('selected'));
                e.target.classList.add('selected');
            });
        });
        
        this.answersEl.addEventListener('click', (e) => {
            if (e.target.classList.contains('answer-btn') && this.gameActive) {
                this.checkAnswer(parseInt(e.target.dataset.answer));
            }
        });
        
        // Touch events for mobile
        this.answersEl.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (e.target.classList.contains('answer-btn') && this.gameActive) {
                e.target.style.transform = 'scale(0.95)';
            }
        });
        
        this.answersEl.addEventListener('touchend', (e) => {
            e.preventDefault();
            if (e.target.classList.contains('answer-btn') && this.gameActive) {
                e.target.style.transform = '';
                this.checkAnswer(parseInt(e.target.dataset.answer));
            }
        });
    }
    
    startGame() {
        this.gameActive = true;
        this.score = 0;
        this.lives = 3;
        this.currentQuestion = 0;
        this.level = this.difficulty;
        
        this.updateUI();
        this.showGameScreen();
        this.generateQuestion();
    }
    
    generateQuestion() {
        let num1, num2, operator, question, answer;
        
        switch(this.difficulty) {
            case 1: // Addition
                num1 = Math.floor(Math.random() * 10) + 1;
                num2 = Math.floor(Math.random() * 10) + 1;
                operator = '+';
                answer = num1 + num2;
                break;
            case 2: // Subtraction
                num1 = Math.floor(Math.random() * 20) + 10;
                num2 = Math.floor(Math.random() * num1) + 1;
                operator = '-';
                answer = num1 - num2;
                break;
            case 3: // Multiplication
                num1 = Math.floor(Math.random() * 12) + 1;
                num2 = Math.floor(Math.random() * 12) + 1;
                operator = '×';
                answer = num1 * num2;
                break;
        }
        
        question = `${num1} ${operator} ${num2}`;
        this.correctAnswer = answer;
        
        // Generate answer options
        const answers = [answer];
        while(answers.length < 4) {
            let wrongAnswer;
            if (this.difficulty === 3) {
                wrongAnswer = answer + Math.floor(Math.random() * 20) - 10;
            } else {
                wrongAnswer = answer + Math.floor(Math.random() * 10) - 5;
            }
            if (wrongAnswer > 0 && !answers.includes(wrongAnswer)) {
                answers.push(wrongAnswer);
            }
        }
        
        // Shuffle answers
        for (let i = answers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [answers[i], answers[j]] = [answers[j], answers[i]];
        }
        
        this.displayQuestion(question, answers);
    }
    
    displayQuestion(question, answers) {
        this.questionEl.textContent = `What is ${question}?`;
        
        const answerButtons = this.answersEl.querySelectorAll('.answer-btn');
        answerButtons.forEach((btn, index) => {
            btn.textContent = answers[index];
            btn.dataset.answer = answers[index];
            btn.className = 'answer-btn';
        });
        
        // Add entrance animation
        this.questionEl.style.animation = 'none';
        this.questionEl.offsetHeight; // Trigger reflow
        this.questionEl.style.animation = 'slideIn 0.5s ease-out';
    }
    
    checkAnswer(selectedAnswer) {
        this.gameActive = false;
        const buttons = this.answersEl.querySelectorAll('.answer-btn');
        
        buttons.forEach(btn => {
            const answer = parseInt(btn.dataset.answer);
            if (answer === this.correctAnswer) {
                btn.classList.add('correct');
            } else if (answer === selectedAnswer && answer !== this.correctAnswer) {
                btn.classList.add('incorrect');
            }
        });
        
        if (selectedAnswer === this.correctAnswer) {
            this.score += 10 * this.difficulty;
            this.showFeedback('Correct! Well done! 🎉');
        } else {
            this.lives--;
            this.showFeedback('Oops! Try again! 💪');
        }
        
        this.updateUI();
        
        setTimeout(() => {
            this.nextQuestion();
        }, 1500);
    }
    
    showFeedback(message) {
        // Create temporary feedback element
        const feedback = document.createElement('div');
        feedback.textContent = message;
        feedback.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 20px;
            border-radius: 10px;
            font-size: 1.5em;
            z-index: 1000;
            animation: fadeInOut 1.5s ease;
            text-align: center;
            font-weight: bold;
        `;
        
        document.body.appendChild(feedback);
        setTimeout(() => feedback.remove(), 1500);
    }
    
    nextQuestion() {
        this.currentQuestion++;
        this.updateProgress();
        
        if (this.lives <= 0) {
            this.endGame();
            return;
        }
        
        if (this.currentQuestion >= this.totalQuestions) {
            if (this.difficulty < 3) {
                this.difficulty++;
                this.level++;
                this.currentQuestion = 0;
                this.showLevelUp();
            } else {
                this.endGame();
            }
            return;
        }
        
        this.gameActive = true;
        this.generateQuestion();
    }
    
    showLevelUp() {
        this.showFeedback(`Level Up! Now trying ${this.getDifficultyName()} problems! 🚀`);
        setTimeout(() => {
            this.gameActive = true;
            this.generateQuestion();
        }, 2000);
    }
    
    getDifficultyName() {
        const names = ['', 'Addition', 'Subtraction', 'Multiplication'];
        return names[this.difficulty];
    }
    
    updateProgress() {
        const progress = (this.currentQuestion / this.totalQuestions) * 100;
        this.progressFill.style.width = `${progress}%`;
    }
    
    updateUI() {
        this.levelEl.textContent = this.level;
        this.scoreEl.textContent = this.score;
        this.livesEl.textContent = this.lives;
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
        this.finalScoreEl.textContent = `Your Score: ${this.score}`;
        this.gameScreen.style.display = 'none';
        this.gameOverScreen.classList.remove('hidden');
    }
    
    restartGame() {
        this.difficulty = 1;
        this.showStartScreen();
    }
}

// Add CSS for feedback animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInOut {
        0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
        50% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
    }
    .selected { background: linear-gradient(45deg, #2ed573, #7bed9f) !important; }
`;
document.head.appendChild(style);

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    new MathAdventure();
});

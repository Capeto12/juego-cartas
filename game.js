// Bird emojis for the memory game - 5 pairs = 10 cards
const birdEmojis = ['🦉', '🦅', '🦆', '🦜', '🦚'];

// Game state
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let canFlip = true;

// Initialize the game
function initGame() {
    // Reset game state
    cards = [];
    flippedCards = [];
    matchedPairs = 0;
    moves = 0;
    canFlip = true;
    
    // Update UI
    document.getElementById('moves').textContent = moves;
    document.getElementById('pairs').textContent = matchedPairs;
    document.getElementById('win-message').classList.add('hidden');
    
    // Create pairs of cards (10 cards total)
    const cardPairs = [...birdEmojis, ...birdEmojis];
    
    // Shuffle the cards
    cards = shuffle(cardPairs);
    
    // Render the game board
    renderBoard();
}

// Shuffle array using Fisher-Yates algorithm
function shuffle(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// Render the game board
function renderBoard() {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';
    
    cards.forEach((bird, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.index = index;
        card.dataset.bird = bird;
        
        card.innerHTML = `
            <div class="card-front">?</div>
            <div class="card-back">${bird}</div>
        `;
        
        card.addEventListener('click', () => handleCardClick(card, index));
        gameBoard.appendChild(card);
    });
}

// Handle card click
function handleCardClick(card, index) {
    // Don't allow flipping if:
    // - Already flipping animation in progress
    // - Card is already flipped
    // - Card is already matched
    // - Two cards are already flipped
    if (!canFlip || 
        card.classList.contains('flipped') || 
        card.classList.contains('matched') ||
        flippedCards.length === 2) {
        return;
    }
    
    // Flip the card
    card.classList.add('flipped');
    flippedCards.push({ card, index, bird: card.dataset.bird });
    
    // Check if two cards are flipped
    if (flippedCards.length === 2) {
        moves++;
        document.getElementById('moves').textContent = moves;
        checkMatch();
    }
}

// Check if flipped cards match
function checkMatch() {
    canFlip = false;
    const [card1, card2] = flippedCards;
    
    if (card1.bird === card2.bird) {
        // Cards match!
        setTimeout(() => {
            card1.card.classList.add('matched');
            card2.card.classList.add('matched');
            matchedPairs++;
            document.getElementById('pairs').textContent = matchedPairs;
            
            flippedCards = [];
            canFlip = true;
            
            // Check if game is won
            if (matchedPairs === birdEmojis.length) {
                showWinMessage();
            }
        }, 500);
    } else {
        // Cards don't match - flip them back
        setTimeout(() => {
            card1.card.classList.remove('flipped');
            card2.card.classList.remove('flipped');
            flippedCards = [];
            canFlip = true;
        }, 1000);
    }
}

// Show win message
function showWinMessage() {
    setTimeout(() => {
        document.getElementById('final-moves').textContent = moves;
        document.getElementById('win-message').classList.remove('hidden');
    }, 500);
}

// Event listeners
document.getElementById('restart-btn').addEventListener('click', initGame);
document.getElementById('play-again-btn').addEventListener('click', initGame);

// Start the game when page loads
initGame();

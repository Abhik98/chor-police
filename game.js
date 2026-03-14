// --- Game State & Variables ---
let playerName = "";
let soundEnabled = true;
const roles = [
    { name: "OC", points: 2000 },
    { name: "Daroga", points: 1200 },
    { name: "Police", points: 500 },
    { name: "Chor", points: 0 }
];

// --- DOM Elements ---
const lobbyScreen = document.getElementById('lobby-screen');
const gameScreen = document.getElementById('game-screen');
const joinBtn = document.getElementById('join-btn');
const nameInput = document.getElementById('player-name');
const cardTable = document.getElementById('card-table');
const dialogueBox = document.getElementById('dialogue-box');
const soundToggle = document.getElementById('sound-toggle');

// --- Event Listeners ---
soundToggle.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundToggle.innerText = soundEnabled ? "🔊 Sound On" : "🔇 Sound Off";
});

joinBtn.addEventListener('click', () => {
    if (nameInput.value.trim().length > 0) {
        playerName = nameInput.value.trim();
        // Transition to game screen
        lobbyScreen.classList.remove('active');
        gameScreen.classList.active = true;
        gameScreen.classList.add('active');
        
        startGameRound();
    } else {
        alert("Please enter a name first!");
    }
});

// --- Game Logic Functions ---

// Fisher-Yates Shuffle Algorithm
function shuffleArray(array) {
    let shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function startGameRound() {
    dialogueBox.innerText = "Fast! Pick a card!";
    cardTable.innerHTML = ""; // Clear table
    
    // Shuffle roles for this round
    const roundRoles = shuffleArray(roles);

    // Generate 4 Cards
    for (let i = 0; i < 4; i++) {
        const cardObj = roundRoles[i];
        const cardEl = document.createElement('div');
        cardEl.classList.add('card');
        cardEl.innerText = "?"; // Hidden initially
        
        // Add click event to flip card
        cardEl.addEventListener('click', function() {
            if (!this.classList.contains('flipped')) {
                flipCard(this, cardObj);
            }
        });
        
        cardTable.appendChild(cardEl);
    }
}

function flipCard(cardElement, roleObject) {
    // Visual flip
    cardElement.classList.add('flipped');
    // We reverse the text so it reads correctly after the 3D CSS flip
    cardElement.style.transform = "rotateY(180deg)";
    setTimeout(() => {
        cardElement.innerText = `${roleObject.name}\n(${roleObject.points})`;
    }, 150); // Wait half the animation time to change text

    // Play sound if enabled
    if (soundEnabled) {
        // let audio = new Audio('flip-sound.mp3'); 
        // audio.play();
    }

    /* IMPORTANT: In the real multiplayer version, clicking a card here
    would send a message to Firebase saying "Player X claimed Card Y".
    Firebase would then tell all other phones to remove Card Y from the screen.
    */
   
    checkIfAllCardsPicked();
}

function checkIfAllCardsPicked() {
    const flippedCards = document.querySelectorAll('.card.flipped');
    if (flippedCards.length === 4) {
        triggerCinematicDialogue();
    }
}

// The Timed Dialogue Sequence
function triggerCinematicDialogue() {
    dialogueBox.innerText = "Processing roles...";
    
    setTimeout(() => {
        dialogueBox.innerHTML = "<em>Police, police; koun hai??</em>";
        // Play sound here
    }, 2000);

    setTimeout(() => {
        dialogueBox.innerHTML = "<strong>Hum hai!</strong>";
        // Play sound here
    }, 5000);

    setTimeout(() => {
        dialogueBox.innerHTML = "<span style='color:red;'>Chor ko pakdo!</span>";
        // This is where you would activate the Police player's guessing UI
    }, 7000);
}

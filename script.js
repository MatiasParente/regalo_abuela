document.addEventListener('DOMContentLoaded', () => {
    /* ==============================
       1. Control de Audio
       ============================== */
    const bgMusic = document.getElementById('bg-music');
    const musicBtn = document.getElementById('music-btn');
    const musicIcon = document.getElementById('music-icon');
    let isPlaying = false;

    // Intentar reproducir automáticamente (puede ser bloqueado por el navegador)
    bgMusic.volume = 0.5;
    
    const toggleMusic = () => {
        if (isPlaying) {
            bgMusic.pause();
            musicIcon.textContent = 'Reproducir Música';
            musicBtn.classList.remove('playing');
        } else {
            bgMusic.play().then(() => {
                musicIcon.textContent = 'Pausar Música';
                musicBtn.classList.add('playing');
            }).catch(error => {
                console.log("Reproducción automática bloqueada por el navegador. El usuario debe interactuar primero.");
            });
        }
        isPlaying = !isPlaying;
    };

    musicBtn.addEventListener('click', toggleMusic);

    // Intentar play on first interaction si no está sonando
    document.body.addEventListener('click', () => {
        if (!isPlaying) {
            // Uncomment next line if you want to force auto-play on first click anywhere
            // toggleMusic();
        }
    }, { once: true });


    /* ==============================
       2. Modal de Galería de Fotos
       ============================== */
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    const closeBtn = document.querySelector('.close-modal');
    const galleryItems = document.querySelectorAll('.gallery-item img');

    galleryItems.forEach(img => {
        img.addEventListener('click', () => {
            modal.classList.remove('hidden');
            modalImg.src = img.src;
        });
    });

    closeBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    });


    /* ==============================
       3. Juego de Memoria
       ============================== */
    const gameBoard = document.getElementById('memory-game');
    const winModal = document.getElementById('game-win-modal');
    const restartBtn = document.getElementById('restart-btn');

    // Selección de fotos para el juego
    const gameImages = [
        'resources/abuela y todos sus hijos.jpeg',
        'resources/hija elsa y nieto matias.jpeg',
        'resources/nieta luzmila.jpeg',
        'resources/nieto lucas y oriana.jpeg',
        'resources/nieto.jpg',
        'resources/oriana, hija maria, abuela.jpeg',
        'resources/nieto mateo.jpeg',
        'resources/nietos antiguo.jpeg',
        'resources/nietos 2.jpeg',
        'resources/abuela.jpeg'
    ];

    let cards = [];
    let hasFlippedCard = false;
    let lockBoard = false;
    let firstCard, secondCard;
    let matchedPairs = 0;

    function initGame() {
        gameBoard.innerHTML = '';
        matchedPairs = 0;
        hasFlippedCard = false;
        lockBoard = false;
        firstCard = null;
        secondCard = null;
        winModal.classList.add('hidden');

        // Duplicar las imágenes para formar los pares
        cards = [...gameImages, ...gameImages];
        
        // Barajar aleatoriamente
        cards.sort(() => 0.5 - Math.random());

        // Crear las cartas en el DOM
        cards.forEach(imgSrc => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('memory-card');
            cardElement.dataset.image = imgSrc;

            cardElement.innerHTML = `
                <div class="front-face">
                    <img src="${imgSrc}" alt="Recuerdo">
                </div>
                <div class="back-face">
                    
                </div>
            `;

            cardElement.addEventListener('click', flipCard);
            gameBoard.appendChild(cardElement);
        });
    }

    function flipCard() {
        if (lockBoard) return;
        if (this === firstCard) return;

        this.classList.add('flip');

        if (!hasFlippedCard) {
            // Primer clic
            hasFlippedCard = true;
            firstCard = this;
            return;
        }

        // Segundo clic
        hasFlippedCard = false;
        secondCard = this;

        checkForMatch();
    }

    function checkForMatch() {
        let isMatch = firstCard.dataset.image === secondCard.dataset.image;

        if (isMatch) {
            disableCards();
        } else {
            unflipCards();
        }
    }

    function disableCards() {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        
        matchedPairs++;
        
        if (matchedPairs === gameImages.length) {
            setTimeout(() => {
                winModal.classList.remove('hidden');
            }, 500);
        }

        resetBoard();
    }

    function unflipCards() {
        lockBoard = true;

        setTimeout(() => {
            firstCard.classList.remove('flip');
            secondCard.classList.remove('flip');
            resetBoard();
        }, 1000); // 1 segundo para memorizar
    }

    function resetBoard() {
        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];
    }

    restartBtn.addEventListener('click', initGame);

    // Iniciar el juego por primera vez
    initGame();
});

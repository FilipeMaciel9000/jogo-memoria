document.addEventListener('DOMContentLoaded', () => {
  const gridContainer = document.getElementById('grid');
  const movesDisplay = document.getElementById('moves');
  const matchesDisplay = document.getElementById('matches');
  const restartButton = document.getElementById('restart');
  const countdownDisplay = document.getElementById('timer');

  let cards = [];
  let flippedCards = [];
  let matchedPairs = 0;
  let moves = 0;
  let lockBoard = false;
  let countdownInterval;
  let memorizationTime = 5; // Tempo em segundos para memorização

  // Emojis para as cartas (6 pares)
  const cardIcons = [
    'fas fa-heart', // Coração
    'fas fa-square', // Quadrado
    'fas fa-diamond', // Losango
    'fas fa-sun', // Sol
    'fas fa-star', // Estrela
    'fas fa-moon', // Lua
  ];

  // Duplicar e embaralhar os ícones
  function shuffleCards() {
    const allCards = [...cardIcons, ...cardIcons];
    return allCards.sort(() => Math.random() - 0.5);
  }

  // Inicializar o jogo
  function initGame() {
    // Limpar o tabuleiro
    gridContainer.innerHTML = '';
    flippedCards = [];
    matchedPairs = 0;
    moves = 0;
    lockBoard = false;

    // Atualizar displays
    movesDisplay.textContent = moves;
    matchesDisplay.textContent = matchedPairs;

    // Embaralhar cartas
    cards = shuffleCards();

    // Criar as cartas no DOM
    cards.forEach((icon, index) => {
      const card = document.createElement('div');
      card.classList.add('card');
      card.dataset.index = index;
      card.dataset.icon = icon;

      card.innerHTML = `
                        <div class="card-inner">
                            <div class="card-front"><i class="${icon}"></i></div>
                            <div class="card-back"></div>
                        </div>
                    `;

      gridContainer.appendChild(card);
    });

    // Mostrar todas as cartas para memorização
    showAllCards();
  }

  // Mostrar todas as cartas por um tempo para memorização
  function showAllCards() {
    const allCards = document.querySelectorAll('.card');

    // Mostrar todas as cartas
    allCards.forEach((card) => {
      card.classList.add('flipped');
    });

    // Iniciar contagem regressiva
    let timeLeft = memorizationTime;
    countdownDisplay.textContent = timeLeft;

    // Desabilitar o botão de reinício durante a memorização
    restartButton.disabled = true;

    countdownInterval = setInterval(() => {
      timeLeft--;
      countdownDisplay.textContent = timeLeft;

      if (timeLeft <= 0) {
        clearInterval(countdownInterval);
        hideAllCards();
      }
    }, 1000);
  }

  // Esconder todas as cartas após o tempo de memorização
  function hideAllCards() {
    const allCards = document.querySelectorAll('.card');

    // Esconder todas as cartas
    allCards.forEach((card) => {
      card.classList.remove('flipped');

      // Adicionar evento de clique após a memorização
      card.addEventListener('click', flipCard);
    });

    // Habilitar o botão de reinício
    restartButton.disabled = false;

    // Esconder o contador
    document.getElementById('countdown').style.display = 'none';
  }

  // Virar uma carta
  function flipCard() {
    if (lockBoard) return;
    if (this === flippedCards[0]) return;
    if (this.classList.contains('matched')) return;

    this.classList.add('flipped');

    if (flippedCards.length === 0) {
      // Primeira carta virada
      flippedCards.push(this);
      return;
    }

    // Segunda carta virada
    flippedCards.push(this);
    moves++;
    movesDisplay.textContent = moves;
    lockBoard = true;

    checkForMatch();
  }

  // Verificar se as cartas formam um par
  function checkForMatch() {
    const [card1, card2] = flippedCards;
    const isMatch = card1.dataset.icon === card2.dataset.icon;

    isMatch ? disableCards() : unflipCards();
  }

  // Desabilitar cartas combinadas
  function disableCards() {
    flippedCards.forEach((card) => {
      card.classList.add('matched');
      card.removeEventListener('click', flipCard);
    });

    matchedPairs++;
    matchesDisplay.textContent = matchedPairs;

    resetBoard();

    // Verificar se o jogo terminou
    if (matchedPairs === cardIcons.length) {
      setTimeout(() => {
        alert(`Parabéns! Você completou o jogo em ${moves} movimentos!`);
      }, 500);
    }
  }

  // Desvirar cartas que não combinam
  function unflipCards() {
    setTimeout(() => {
      flippedCards.forEach((card) => {
        card.classList.remove('flipped');
      });
      resetBoard();
    }, 800);
  }

  // Resetar o tabuleiro após cada jogada
  function resetBoard() {
    [lockBoard, flippedCards] = [false, []];
  }

  // Reiniciar o jogo
  restartButton.addEventListener('click', () => {
    // Limpar intervalo se existir
    if (countdownInterval) {
      clearInterval(countdownInterval);
    }

    // Mostrar o contador novamente
    document.getElementById('countdown').style.display = 'block';

    initGame();
  });

  // Iniciar o jogo quando a página carregar
  initGame();
});

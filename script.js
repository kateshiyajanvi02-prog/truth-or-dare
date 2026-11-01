const $ = (id) => document.getElementById(id);

const setup = $("setup");
const game = $("game");
const result = $("result");
const challengeBox = $("challengeBox");

/* Built-in static questions (kept by default) */
const staticTruths = [
  // Student Life
  "Have you ever attended class without completing your homework?",
  "What is your funniest college memory?",
  "Have you ever studied only the night before an exam?",
  "Which subject do you find the most difficult?",
  "Have you ever pretended to understand something in class?",
  "What is your dream job after graduation?",
  "Have you ever forgotten about an assignment deadline?",
  "Who is the funniest person in your class?",
  "What is your biggest fear about exams?",
  "If you could change one thing about college, what would it be?",

  // Course & Career
  "Why did you choose your current course?",
  "Which programming language do you like the most?",
  "What is your dream company to work for?",
  "Would you prefer a high salary or a job you love?",
  "What new technical skill do you want to learn?",
  "Where do you see yourself five years from now?",
  "Which is harder for you: coding, theory, or practicals?",
  "Would you like to work abroad someday?",
  "What is your biggest career goal?",
  "If you could create any app, what would it do?",

  // Friendship
  "Who was your first best friend?",
  "What makes someone a true friend?",
  "Have you ever laughed at a completely wrong moment?",
  "What is your favourite memory with your friends?",
  "What is one thing you appreciate about your best friend?",
  "Would you forgive a friend who broke your trust?",

  // Funny & Personal
  "What is the most embarrassing thing you have done?",
  "What is your weirdest habit?",
  "What is the funniest nickname someone has given you?",
  "What is one thing you are secretly proud of?",
  "If you could become invisible for a day, what would you do?",
  "What is the silliest thing you are afraid of?",
  "If you won a million rupees, what would you buy first?",
  "What is one thing people often misunderstand about you?",
  "What is your favourite song that you never get tired of?",
  "If your life were a movie, what would its title be?"
];

const staticDares = [
  // Funny Dares
  "Dance for 15 seconds without music.",
  "Make your funniest face for 10 seconds.",
  "Act like a robot for 20 seconds.",
  "Speak like a news reporter for 30 seconds.",
  "Tell a joke and try to make everyone laugh.",
  "Pretend to be a teacher taking attendance.",
  "Sing one line of your favourite song.",
  "Walk like a model for 15 seconds.",

  // Student & College Dares
  "Act like your favourite teacher for 20 seconds.",
  "Explain your course in 15 seconds.",
  "Pretend you are giving a speech on your first day of college.",
  "Name five subjects or topics in 10 seconds.",
  "Give a motivational speech before an exam.",
  "Spell your college name backwards if you can.",

  // Course & Tech Dares
  "Explain what a computer is in 15 seconds.",
  "Name five programming languages in 10 seconds.",
  "Explain your favourite app in three sentences.",
  "Pretend you are interviewing for your dream job.",
  "Describe your dream project in 30 seconds.",

  // Friendship Dares
  "Give the other players three genuine compliments.",
  "Invent a funny superhero name for your friend.",
  "Say three things that make a good friendship.",
  "Make up a short rap about college life.",
  "Tell the other player a funny, harmless joke.",

  // Creative Dares
  "Act like a famous actor for 15 seconds.",
  "Tell a short story using the words love, college, and computer.",
  "Speak in a funny accent for 20 seconds.",
  "Hum a song and let the other players guess it.",
  "Describe your dream holiday in 20 seconds.",
  "Try saying a tongue twister three times."
];

const PLAYER_ICONS = ["💜", "💗", "💙", "💚", "🧡", "💛", "💖", "💎", "⭐", "🦄"];

let customTruths = [];
let customDares = [];
let playerNamesList = ["Player 1", "Player 2"];

let players = [];
let scores = [];
let currentPlayer = 0;
let round = 1;
let roundLimit = 5;
let gameActive = false;
let challengeActive = false;
let currentChallengeType = "truth";

/* --- 1. SETUP & PLAYER MANAGEMENT --- */

function renderPlayerInputs() {
  const container = $("playerInputsList");
  container.innerHTML = "";
  $("playerCount").textContent = playerNamesList.length;

  playerNamesList.forEach((name, index) => {
    const row = document.createElement("div");
    row.className = "player-input-row";

    const badge = document.createElement("span");
    badge.className = "player-badge";
    badge.textContent = PLAYER_ICONS[index % PLAYER_ICONS.length];

    const input = document.createElement("input");
    input.type = "text";
    input.maxLength = 20;
    input.placeholder = `Player ${index + 1} Name`;
    input.value = name;
    input.dataset.index = index;

    input.addEventListener("input", (e) => {
      playerNamesList[index] = e.target.value;
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") startGame();
    });

    row.appendChild(badge);
    row.appendChild(input);

    if (playerNamesList.length > 2) {
      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.className = "remove-player-btn";
      removeBtn.innerHTML = "&times;";
      removeBtn.title = "Remove player";
      removeBtn.addEventListener("click", () => {
        playerNamesList.splice(index, 1);
        renderPlayerInputs();
      });
      row.appendChild(removeBtn);
    }

    container.appendChild(row);
  });

  $("addPlayerBtn").disabled = playerNamesList.length >= 10;
}

$("addPlayerBtn").addEventListener("click", () => {
  if (playerNamesList.length < 10) {
    playerNamesList.push(`Player ${playerNamesList.length + 1}`);
    renderPlayerInputs();
  }
});

/* Custom Questions in Pool */
$("addCustomTruthBtn").addEventListener("click", () => {
  const input = $("newTruthInput");
  const val = input.value.trim();
  if (!val) return;
  customTruths.push(val);
  input.value = "";
  renderCustomList("customTruthsList", customTruths);
});

$("addCustomDareBtn").addEventListener("click", () => {
  const input = $("newDareInput");
  const val = input.value.trim();
  if (!val) return;
  customDares.push(val);
  input.value = "";
  renderCustomList("customDaresList", customDares);
});

function renderCustomList(elementId, list) {
  const ul = $(elementId);
  ul.innerHTML = "";
  list.forEach((item, index) => {
    const li = document.createElement("li");
    const span = document.createElement("span");
    span.textContent = item;
    const btn = document.createElement("button");
    btn.innerHTML = "&times;";
    btn.title = "Delete";
    btn.addEventListener("click", () => {
      list.splice(index, 1);
      renderCustomList(elementId, list);
    });
    li.appendChild(span);
    li.appendChild(btn);
    ul.appendChild(li);
  });
}

function showScreen(screen) {
  setup.classList.toggle("hidden", screen !== "setup");
  game.classList.toggle("hidden", screen !== "game");
  result.classList.toggle("hidden", screen !== "result");
}

/* --- 2. GAME INITIALIZATION --- */

function startGame() {
  const inputs = $("playerInputsList").querySelectorAll("input");
  const names = [];

  for (let i = 0; i < inputs.length; i++) {
    const name = inputs[i].value.trim();
    if (!name) {
      $("setupError").textContent = `Please enter a name for Player ${i + 1}.`;
      inputs[i].focus();
      return;
    }
    names.push(name);
  }

  // Check unique names
  const lowerNames = names.map(n => n.toLowerCase());
  const uniqueSet = new Set(lowerNames);
  if (uniqueSet.size !== names.length) {
    $("setupError").textContent = "Please enter unique names for each player.";
    return;
  }

  players = [...names];
  scores = new Array(players.length).fill(0);
  currentPlayer = 0;
  round = 1;
  roundLimit = Number($("roundLimit").value);
  gameActive = true;
  challengeActive = false;

  $("setupError").textContent = "";

  renderScoreboard();
  updateGame();
  showScreen("game");
}

/* --- 3. IN-GAME FUNCTIONS --- */

function renderScoreboard() {
  const board = $("scoreboard");
  board.innerHTML = "";

  players.forEach((name, i) => {
    const card = document.createElement("div");
    card.className = `score-card ${i === currentPlayer ? "active-turn" : ""}`;
    card.id = `scoreCard_${i}`;

    const icon = document.createElement("span");
    icon.className = "player-icon";
    icon.textContent = PLAYER_ICONS[i % PLAYER_ICONS.length];

    const p = document.createElement("p");
    p.textContent = name;

    const strong = document.createElement("strong");
    strong.id = `scoreVal_${i}`;
    strong.textContent = scores[i];

    const small = document.createElement("small");
    small.textContent = "POINTS";

    card.appendChild(icon);
    card.appendChild(p);
    card.appendChild(strong);
    card.appendChild(small);
    board.appendChild(card);
  });
}

function updateScoreboardHighlight() {
  players.forEach((_, i) => {
    const card = $(`scoreCard_${i}`);
    if (card) {
      card.classList.toggle("active-turn", i === currentPlayer);
      const val = $(`scoreVal_${i}`);
      if (val) val.textContent = scores[i];
    }
  });
}

function updateGame() {
  updateScoreboardHighlight();

  $("roundLabel").textContent = `ROUND ${round} / ${roundLimit}`;
  $("turnName").textContent = players[currentPlayer];

  const askerIndex = (currentPlayer - 1 + players.length) % players.length;
  $("turnAsker").textContent = `${players[askerIndex].toUpperCase()} ASKS ${players[currentPlayer].toUpperCase()}`;
  $("turnPrompt").textContent = "Choose Truth or Dare!";
  $("gameMessage").textContent = `${players[currentPlayer]}, choose Truth or Dare!`;

  challengeBox.classList.add("hidden");
  $("truthBtn").disabled = false;
  $("dareBtn").disabled = false;
  challengeActive = false;
}

function getRandomQuestion(type) {
  const staticPool = type === "truth" ? staticTruths : staticDares;
  const customPool = type === "truth" ? customTruths : customDares;
  const combined = [...staticPool, ...customPool];
  return combined[Math.floor(Math.random() * combined.length)];
}

function chooseChallenge(type) {
  if (!gameActive || challengeActive) return;

  challengeActive = true;
  currentChallengeType = type;
  $("truthBtn").disabled = true;
  $("dareBtn").disabled = true;

  const isTruth = type === "truth";
  const askerIndex = (currentPlayer - 1 + players.length) % players.length;
  const asker = players[askerIndex];
  const target = players[currentPlayer];

  $("challengeType").textContent = isTruth ? "💭 TRUTH" : "🔥 DARE";
  $("challengeText").textContent = getRandomQuestion(type);

  $("dynamicLabel").textContent = `✏️ ${asker}, type your own ${isTruth ? "Truth" : "Dare"} for ${target}:`;
  $("dynamicInput").value = "";
  $("dynamicInput").placeholder = `Type a custom ${isTruth ? "truth question" : "dare"} for ${target}...`;

  challengeBox.classList.remove("hidden");
  $("gameMessage").textContent = `${target}'s challenge is ready!`;
}

/* Shuffle button to roll another default question */
$("shuffleChallengeBtn").addEventListener("click", () => {
  if (!challengeActive) return;
  $("challengeText").textContent = getRandomQuestion(currentChallengeType);
});

/* Dynamic custom question input by the asker */
function applyDynamicQuestion() {
  const custom = $("dynamicInput").value.trim();
  if (!custom) return;

  const askerIndex = (currentPlayer - 1 + players.length) % players.length;
  $("challengeText").textContent = `"${custom}"`;
  $("gameMessage").textContent = `Custom challenge from ${players[askerIndex]}!`;
}

$("dynamicSubmitBtn").addEventListener("click", applyDynamicQuestion);
$("dynamicInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    applyDynamicQuestion();
  }
});

function finishTurn(completed) {
  if (!gameActive || !challengeActive) return;

  if (completed) {
    scores[currentPlayer] += 10;
  }

  // Advance to next player
  currentPlayer++;

  // Completed one full circle round
  if (currentPlayer >= players.length) {
    currentPlayer = 0;
    round++;
  }

  if (round > roundLimit) {
    endGame();
    return;
  }

  updateGame();
}

/* --- 4. GAME OVER & WINNER --- */

function endGame() {
  gameActive = false;
  challengeActive = false;

  const maxScore = Math.max(...scores);
  const winners = players.filter((_, i) => scores[i] === maxScore);

  if (winners.length === 1) {
    $("resultTitle").textContent = `🎉 ${winners[0]} wins!`;
    $("resultMessage").textContent = `Outstanding performance with ${maxScore} points!`;
  } else {
    $("resultTitle").textContent = "🤝 It's a Tie!";
    $("resultMessage").textContent = `Tied winners (${winners.join(" & ")}) scored ${maxScore} points!`;
  }

  const container = $("finalScoresContainer");
  container.innerHTML = "";

  players.forEach((name, i) => {
    const card = document.createElement("div");
    if (scores[i] === maxScore) {
      card.classList.add("winner-card");
    }

    const nameSpan = document.createElement("span");
    nameSpan.textContent = `${PLAYER_ICONS[i % PLAYER_ICONS.length]} ${name} ${scores[i] === maxScore ? "👑" : ""}`;

    const scoreStrong = document.createElement("strong");
    scoreStrong.textContent = scores[i];

    const labelSmall = document.createElement("small");
    labelSmall.className = "muted";
    labelSmall.textContent = "POINTS";

    card.appendChild(nameSpan);
    card.appendChild(scoreStrong);
    card.appendChild(labelSmall);
    container.appendChild(card);
  });

  showScreen("result");
}

function restartGame() {
  gameActive = false;
  challengeActive = false;
  renderPlayerInputs();
  showScreen("setup");
}

/* --- 5. EVENT LISTENERS --- */

$("startBtn").addEventListener("click", startGame);
$("truthBtn").addEventListener("click", () => chooseChallenge("truth"));
$("dareBtn").addEventListener("click", () => chooseChallenge("dare"));
$("doneBtn").addEventListener("click", () => finishTurn(true));
$("skipBtn").addEventListener("click", () => finishTurn(false));
$("restartBtn").addEventListener("click", restartGame);
$("playAgainBtn").addEventListener("click", restartGame);

// Initial setup render
renderPlayerInputs();

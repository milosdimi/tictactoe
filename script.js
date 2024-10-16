let fields = [null, null, null, null, null, null, null, null, null];
let currentPlayer = "circle";
let gameOver = false;
let gameMode = "";
let player1Score = 0;
let player2Score = 0;
const clickSound = new Audio("audio/click.mp3");
const winSound = new Audio("audio/win.mp3");

function init() {
  document.getElementById("content").innerHTML = "";
}

function selectGameMode(mode) {
  gameMode = mode;
  document.getElementById("gameModeSelection").style.display = "none"; // Blende die Auswahl aus
  render(); // Starte das Spiel
}

function render() {
  let tableHTML = "<table>";
  for (let i = 0; i < 3; i++) {
    tableHTML += "<tr>";
    for (let j = 0; j < 3; j++) {
      const index = i * 3 + j;
      const field = fields[index];
      let symbol = "";

      // Bestimme das Symbol, das in das Feld eingefügt wird
      if (field === "circle") {
        symbol = generateCircleSVG();
      } else if (field === "cross") {
        symbol = generateCrossSVG();
      }

      // Falls das Feld leer ist, wird ein onclick-Attribut hinzugefügt
      tableHTML += `<td id="cell-${index}" onclick="handleClick(${index}, this)">${symbol}</td>`;
    }
    tableHTML += "</tr>";
  }
  tableHTML += "</table>";

  // Tabelle in den Div mit der ID 'content' einfügen
  document.getElementById("content").innerHTML = tableHTML;
}

function handleClick(index, element) {
  if (fields[index] !== null || gameOver) return;

  // Spiele den Klick-Sound ab
  clickSound.currentTime = 0;
  clickSound.play().catch((error) => {
    console.error("Fehler beim Abspielen des Klick-Sounds:", error);
  });

  // Setze den aktuellen Spieler in das Array
  fields[index] = currentPlayer;

  // Setze das Symbol in das angeklickte td-Element
  if (currentPlayer === "circle") {
    element.innerHTML = generateCircleSVG();
  } else if (currentPlayer === "cross") {
    element.innerHTML = generateCrossSVG();
  }

  // Entferne die onclick-Funktion, um weitere Klicks zu verhindern
  element.onclick = null;

  // Überprüfe, ob jemand gewonnen hat
  const winner = checkWin();
  if (winner) {
    gameOver = true;

    highlightWinningCells(winner);
    drawWinningLine(winner);

    winSound.currentTime = 0;
    winSound.play().catch((error) => {
      console.error("Fehler beim Abspielen des Gewinn-Sounds:", error);
    });

    if (currentPlayer === "circle") {
      player1Score++;
    } else {
      player2Score++;
    }

    updateScoreboard();
    return;
  }

  // Überprüfe, ob das Spiel unentschieden ist
  checkDraw();

  // Wechsel zum anderen Spieler oder Computer
  currentPlayer = currentPlayer === "circle" ? "cross" : "circle";

  // Wenn der Spielmodus "computer" ist und der Computer an der Reihe ist
  if (gameMode === "computer" && currentPlayer === "cross" && !gameOver) {
    setTimeout(computerMove, 500); // Der Computerzug erfolgt mit einer leichten Verzögerung
  }
}

function computerMove() {
  // Überprüfe, ob der Computer gewinnen kann
  let move = findWinningMove("cross");
  if (move === null) {
    // Wenn kein Gewinnzug vorhanden ist, versuche, den Gegner zu blockieren
    move = findWinningMove("circle");
  }

  // Wenn weder Gewinnen noch Blockieren möglich ist, wähle ein zufälliges Feld
  if (move === null) {
    const availableFields = fields
      .map((value, index) => (value === null ? index : null))
      .filter((index) => index !== null);

    move = availableFields[Math.floor(Math.random() * availableFields.length)];
  }

  // Führe den Zug aus
  fields[move] = "cross";
  const cellElement = document.getElementById(`cell-${move}`);
  cellElement.innerHTML = generateCrossSVG();
  cellElement.onclick = null;

  // Überprüfe, ob der Computer gewonnen hat
  const winner = checkWin();
  if (winner) {
    gameOver = true;
    highlightWinningCells(winner);
    drawWinningLine(winner);

    winSound.currentTime = 0;
    winSound.play().catch((error) => {
      console.error("Fehler beim Abspielen des Gewinn-Sounds:", error);
    });

    player2Score++;
    updateScoreboard();
  } else {
    // Wechsel zum Spieler
    checkDraw();
    currentPlayer = "circle";
  }
}

// Hilfsfunktion, um einen Gewinnzug zu finden
function findWinningMove(player) {
  const winCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let combination of winCombinations) {
    const [a, b, c] = combination;
    if (fields[a] === player && fields[b] === player && fields[c] === null) {
      return c;
    } else if (
      fields[a] === player &&
      fields[c] === player &&
      fields[b] === null
    ) {
      return b;
    } else if (
      fields[b] === player &&
      fields[c] === player &&
      fields[a] === null
    ) {
      return a;
    }
  }

  return null; // Kein Gewinnzug vorhanden
}

function checkDraw() {
  // Überprüfe, ob es kein freies Feld mehr gibt und kein Gewinner gefunden wurde
  if (!fields.includes(null) && !checkWin()) {
    gameOver = true; // Setze das Spiel als beendet
    alert("Unentschieden!");
  }
}

function highlightWinningCells(winningCombination) {
  // Gehe durch jedes Feld der Gewinnkombination und ändere die Hintergrundfarbe
  winningCombination.forEach((index) => {
    document.getElementById(`cell-${index}`).style.backgroundColor =
      "lightgreen";
  });
}

// Funktion zur Aktualisierung des Scoreboards
function updateScoreboard() {
  document.getElementById("player1Score").textContent = player1Score;
  document.getElementById("player2Score").textContent = player2Score;
}

function restartGame() {
  // Setze das Spielfeld zurück
  fields = [null, null, null, null, null, null, null, null, null];
  currentPlayer = "circle"; // Setzt den aktuellen Spieler zurück
  gameOver = false; // Setze das Flag 'gameOver' zurück

  // Entferne alle SVG-Gewinnlinien
  const contentElement = document.getElementById("content");
  contentElement.innerHTML = ""; // Entfernt den gesamten Inhalt (inkl. SVGs)

  // Rendere das leere Spielfeld neu
  render();
}

// Kreis SVG generieren
function generateCircleSVG() {
  return `
    <svg width="70" height="70" viewBox="0 0 70 70" xmlns="http://www.w3.org/2000/svg">
      <circle cx="35" cy="35" r="30" stroke="#00B0EF" stroke-width="5" fill="none"
              stroke-dasharray="188.4" stroke-dashoffset="188.4">
        <animate attributeName="stroke-dashoffset" from="188.4" to="0" dur="200ms" fill="freeze" />
      </circle>
    </svg>
  `;
}

// Kreuz SVG generieren
function generateCrossSVG() {
  return `
    <svg width="70" height="70" viewBox="0 0 70 70" xmlns="http://www.w3.org/2000/svg">
      <line x1="15" y1="15" x2="55" y2="55" stroke="#FFC000" stroke-width="5" stroke-linecap="round">
        <animate attributeName="x2" from="15" to "55" dur="200ms" fill="freeze" />
        <animate attributeName="y2" from="15" to "55" dur="200ms" fill="freeze" />
      </line>
      <line x1="15" y1="55" x2="55" y2="15" stroke="#FFC000" stroke-width="5" stroke-linecap="round">
        <animate attributeName="x2" from="15" to "55" dur="200ms" fill="freeze" />
        <animate attributeName="y2" from="55" to "15" dur="200ms" fill="freeze" />
      </line>
    </svg>
  `;
}

// Funktion zur Überprüfung, ob jemand gewonnen hat
function checkWin() {
  const winCombinations = [
    // Horizontale Kombinationen
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    // Vertikale Kombinationen
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    // Diagonale Kombinationen
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let combination of winCombinations) {
    const [a, b, c] = combination;
    if (fields[a] && fields[a] === fields[b] && fields[a] === fields[c]) {
      return combination; // Gibt die Gewinnkombination zurück
    }
  }

  return null; // Kein Gewinner
}

// Funktion zum Zeichnen der Gewinnlinie
function drawWinningLine(winningCombination) {
  const [a, b, c] = winningCombination;

  // Finde die Positionen der Zellen, um die Linie über den gesamten Container zu zeichnen
  const cellA = document.getElementById(`cell-${a}`);
  const cellC = document.getElementById(`cell-${c}`);

  // Hole die Positionen der Zellen relativ zum Bildschirm
  const rectA = cellA.getBoundingClientRect();
  const rectC = cellC.getBoundingClientRect();

  // Berechne die Mittelpunkte der beiden Zellen
  const startX = rectA.left + rectA.width / 2;
  const startY = rectA.top + rectA.height / 2;
  const endX = rectC.left + rectC.width / 2;
  const endY = rectC.top + rectC.height / 2;

  // Erstelle ein SVG, das die Linie über den Container 'content' zeichnet
  const svgHTML = `
    <svg width="100%" height="100%" style="position:absolute; top:0; left:0; pointer-events:none;">
      <line x1="${startX}" y1="${startY}" x2="${startX}" y2="${startY}" stroke="white" stroke-width="5">
        <animate attributeName="x2" to="${endX}" dur="0.5s" fill="freeze" />
        <animate attributeName="y2" to="${endY}" dur="0.5s" fill="freeze" />
      </line>
    </svg>
  `;

  // Füge die Linie dem Container hinzu
  const contentElement = document.getElementById("content");
  contentElement.innerHTML += svgHTML;
}

function changeOpponent() {
  // Setze das Spielfeld zurück
  fields = [null, null, null, null, null, null, null, null, null];
  currentPlayer = "circle"; // Setze den aktuellen Spieler zurück
  gameOver = false; // Setze das Spiel-Flag zurück
  player1Score = 0; // Setze die Punktzahlen zurück
  player2Score = 0;

  // Entferne alle SVG-Gewinnlinien
  document.getElementById("content").innerHTML = "";

  // Setze die Auswahl für den Spielmodus wieder sichtbar
  document.getElementById("gameModeSelection").style.display = "flex";

  // Aktualisiere das Scoreboard
  updateScoreboard();
}

// Initialisiere das Spiel
init();

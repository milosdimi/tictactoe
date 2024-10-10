let fields = [
  null,
  "circle",
  "circle",
  "circle",
  null,
  null,
  "cross",
  "cross",
  null,
];

function init() {
  // Initiales Rendern der Tabelle
  render();
}

// Die render-Funktion generiert die Tabelle und rendert sie in den Container
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
        symbol = "o"; // Kreis
      } else if (field === "cross") {
        symbol = "x"; // Kreuz
      }

      tableHTML += `<td>${symbol}</td>`;
    }
    tableHTML += "</tr>";
  }
  tableHTML += "</table>";

  // Tabelle in den Div mit der ID 'content' einfügen
  document.getElementById("content").innerHTML = tableHTML;
}

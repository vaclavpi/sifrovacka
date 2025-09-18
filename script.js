// Každá šifra má otázku a odpověď (question/answer) + PDF a kód ze šifry (codeAnswer)
const puzzles = [
  {
    id:1,
    name:"Začátek cesty",
    question:"Jaké je poslední slovo na podstavci sochy sv. Václava na Mariánském náměstí?",
    answer:"budoucim",
    pdf:"sifra1.pdf",
    codeAnswer:"labe",
    points: 20
  },
  {
    id:2,
    name:"Vstupní brána",
    question:"Kolik zlatých okvětních lístků je vidět na vstupové bráně, kde podle legendy zavraždili sv. Václava?",
    answer:"8",
    pdf:"sifra2.pdf",
    codeAnswer:"esus",
    points: 20
  },
  {
    id:3,
    name:"Kaple sv. Rocha",
    question:"Kolik zlatých Křížků je v kapli sv. Rocha?",
    answer:"2",
    pdf:"sifra3.pdf",
    codeAnswer:"90minut",
    points: 20
  },
  {
    id:4,
    name:"Lipová alej",
    question:"Kolik je v Lipové aleji olympijských kovových zástav?",
    answer:"28",
    pdf:"sifra4.pdf",
    codeAnswer:"cteniskautskehostoleti",
    points: 20
  },
  {
    id:5,
    name:"Rychlostní omezení",
    question:"Na kolik km v h je omezená rychlost z ulice 5. Května do Dobrovského (až po odbočení) směrem dětské hřiště?",
    answer:"30",
    pdf:"sifra5.pdf",
    codeAnswer:"kmen",
    points: 20
  },
  {
    id:6,
    name:"Uzeniny u Jiříka",
    question:"Jak se jmenuje občerstvení vedle stánku uzeniny u Jiříka nedaleko zahradnictví Benešovi?",
    answer:"umysi",
    pdf:"sifra6.pdf",
    codeAnswer:"praha",
    points: 20
  }
];

const bonuses = [
    { id: 1, text: "Hudební vložka – zazpívejte cestou po Staré Boleslavi libovolnou písničku nahlas na veřejnosti a pošlete na skupinu \"Lišky + Vašek\" 10sekundový důkaz.", points: 10 },
    { id: 2, text: "Dobrá duše – po cestě oslovte kolemjdoucího, popřejte mu hezký den a požádejte ho o palec nahoru na fotku s vámi.", points: 10 },
    { id: 3, text: "Stylovka – alespoň jeden člen týmu musí během hry nosit improvizovanou korunu z čehokoliv, dokud ji někdo nepochválí.", points: 10 },
    { id: 4, text: "Vitaminek – přineste alespoň dva různé druhy ovoce.", points: 5 },
    { id: 5, text: "Selfie challenge – udělejte týmovou selfie u každého místa, kde je otázka, a na jedné z nich musí všichni dělat \"nejhorší možný výraz\".", points: 15 }
];

function showAlert(message, type, containerId) {
    const alertPlaceholder = document.getElementById(containerId);
    alertPlaceholder.innerHTML = '';
    const wrapper = document.createElement('div');
    wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible" role="alert">`,
        `   <div>${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>'
    ].join('');
    alertPlaceholder.append(wrapper);
}

function showToast(message, type) {
    const toastContainer = document.getElementById('toast-container');
    const toastEl = document.createElement('div');
    toastEl.className = `toast align-items-center text-bg-${type} border-0`;
    toastEl.role = 'alert';
    toastEl.ariaLive = 'assertive';
    toastEl.ariaAtomic = 'true';
    toastEl.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;
    toastContainer.appendChild(toastEl);
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
}

// Přihlášení
function login(){
  const name = document.getElementById('team-name').value;
  const pass = document.getElementById('team-password').value;
  if(pass === '2025' && name.trim() !== ''){
    localStorage.setItem('team', name);
    showGame();
  } else {
    showAlert('Špatné heslo nebo prázdný název týmu!', 'danger', 'login-alert');
  }
}

function logout(){
  localStorage.clear();
  document.getElementById('game-screen').classList.add('hidden');
  document.getElementById('login-screen').classList.remove('hidden');
}

function showGame(){
  const team = localStorage.getItem('team');
  if(!team) return;
  document.getElementById('welcome').innerText = "Tým: " + team;
  document.getElementById('login-screen').classList.add('hidden');
  document.getElementById('puzzle-screen').classList.add('hidden');
  document.getElementById('game-screen').classList.remove('hidden');
  renderPuzzles();
  renderBonuses();
  updateScore();
}

function renderBonuses() {
    const bonusList = document.getElementById('bonus-list');
    bonusList.innerHTML = '';
    bonuses.forEach(bonus => {
        const checked = localStorage.getItem('bonus_' + bonus.id) === 'true';
        const div = document.createElement('div');
        div.className = 'form-check';
        div.innerHTML = `
            <input class="form-check-input" type="checkbox" id="bonus-${bonus.id}" ${checked ? 'checked' : ''} onchange="toggleBonus(${bonus.id}, ${bonus.points})">
            <label class="form-check-label" for="bonus-${bonus.id}">
                ${bonus.text} (${bonus.points} bodů)
            </label>
        `;
        bonusList.appendChild(div);
    });
}

function toggleBonus(id) {
    const checkbox = document.getElementById(`bonus-${id}`);
    if (checkbox.checked) {
        localStorage.setItem('bonus_' + id, 'true');
    } else {
        localStorage.removeItem('bonus_' + id);
    }
    updateScore();
}

function updateScore() {
    let score = 0;
    puzzles.forEach(p => {
        if (localStorage.getItem('puzzle_' + p.id + '_solved')) {
            score += p.points;
        }
    });
    bonuses.forEach(b => {
        if (localStorage.getItem('bonus_' + b.id) === 'true') {
            score += b.points;
        }
    });
    document.getElementById('score').innerText = score;
}


// Vykreslení seznamu šifer s postupným odemykáním
function renderPuzzles(){
  const list = document.getElementById('puzzle-list');
  list.innerHTML = '';
  let lastSolvedIndex = -1;

  puzzles.forEach((p, idx) => {
    const solved = localStorage.getItem('puzzle_'+p.id+'_solved');
    if(solved) lastSolvedIndex = idx;

    const a = document.createElement('a');
    a.href = "#";
    a.className = 'list-group-item list-group-item-action puzzle-item';
    a.innerHTML = `Šifra ${p.id}: ${p.name} <span class="badge bg-${solved ? 'success' : 'secondary'} float-end">${solved ? 'Vyřešeno' : 'Nevyřešeno'}</span>`;

    const locked = idx > lastSolvedIndex + 1;
    if(locked){
      a.classList.add('locked');
    } else {
      a.onclick = () => openPuzzle(p.id);
    }
    list.appendChild(a);
  });
}

// Otevření konkrétní šifry
function openPuzzle(id){
  const puzzle = puzzles.find(p=>p.id===id);
  document.getElementById('game-screen').classList.add('hidden');
  document.getElementById('puzzle-screen').classList.remove('hidden');
  document.getElementById('puzzle-title').innerText = "Šifra "+puzzle.id+": "+puzzle.name;

  const questionSolved = localStorage.getItem('puzzle_'+id+'_question');
  const solved = localStorage.getItem('puzzle_'+id+'_solved');

  let html = `<p>${puzzle.question}</p>`;

  if(!questionSolved){
    html += '<div class="input-group mb-3"><input type="text" id="answer" class="form-control" placeholder="Odpověď"><button class="btn btn-outline-secondary" type="button" onclick="checkAnswer('+id+')">Odeslat odpověď</button></div>';
  } else if(!solved){
    html += '<p><strong>Otázka vyřešena!</strong> Tady je šifra:</p>';
    html += `<button class="btn btn-success mb-3" onclick="window.open('${puzzle.pdf}')">Otevřít šifru</button>`;
    html += '<p>Zadejte odpověď na šifru:</p>';
    html += '<div class="input-group mb-3"><input type="text" id="code" class="form-control" placeholder="Odpověď na šifru"><button class="btn btn-outline-secondary" type="button" onclick="checkCode('+id+')">Odeslat kód</button></div>';
  } else {
    html += '<p><strong>Šifra vyřešena!</strong></p>';
    html += `<button class="btn btn-info" onclick="window.open('${puzzle.pdf}')">Zobrazit šifru znovu</button>`;
  }

  document.getElementById('puzzle-content').innerHTML = html;
}

// Ověření odpovědi na otázku v terénu
function checkAnswer(id){
  const puzzle = puzzles.find(p=>p.id===id);
  const val = document.getElementById('answer').value.trim().toLowerCase();
  if(val === puzzle.answer.toLowerCase()){
    localStorage.setItem('puzzle_'+id+'_question', true);
    openPuzzle(id);
  } else {
    showAlert('Špatná odpověď, zkuste to znovu.', 'danger', 'puzzle-alert');
  }
}

// Ověření kódu ze šifry
function checkCode(id){
  const puzzle = puzzles.find(p=>p.id===id);
  const val = document.getElementById('code').value.trim().toLowerCase();
  if(val === puzzle.codeAnswer.toLowerCase()){
    localStorage.setItem('puzzle_'+id+'_solved', true);
    updateScore();

    if (id === puzzles.length) { // Last puzzle
        showToast("Postupujte dle instrukcí v poslední šifře.", "success");
        openPuzzle(id);
    } else {
        showToast("Šifra vyřešena!", "success");
        setTimeout(closePuzzle, 2000);
    }
  } else {
    showAlert('Špatný kód ze šifry, zkuste to znovu.', 'danger', 'puzzle-alert');
  }
}

function closePuzzle(){
  document.getElementById('puzzle-screen').classList.add('hidden');
  showGame();
}

window.onload = () => {
  if(localStorage.getItem('team')) showGame();
};

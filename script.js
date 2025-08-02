// Každá šifra má otázku a odpověď (question/answer) + PDF a kód ze šifry (codeAnswer)
const puzzles = [
  {
    id:1,
    name:"Začátek cesty",
    question:"Na Mariánském náměstí ve Staré Boleslavi je kašna. Kolik má na vrchu andělů?",
    answer:"4",
    pdf:"sifra1.pdf",
    codeAnswer:"labe"
  },
  {
    id:2,
    name:"Pod starou bránou",
    question:"U brány Pražské najdete desku. Kolikátý je tam letopočet zleva?",
    answer:"3",
    pdf:"sifra2.pdf",
    codeAnswer:"esus"
  },
  {
    id:3,
    name:"Kroky historie",
    question:"Kolik schodů vede k bazilice sv. Václava?",
    answer:"28",
    pdf:"sifra3.pdf",
    codeAnswer:"90minut"
  },
  {
    id:4,
    name:"Řeka a most",
    question:"Na mostě přes Labe je cedule s názvem. Jaké je třetí slovo?",
    answer:"most",
    pdf:"sifra4.pdf",
    codeAnswer:"cteniskautskehostoleti"
  },
  {
    id:5,
    name:"Cesta k městu",
    question:"Na autobusovém nádraží ve Staré Boleslavi – kolikáté nástupiště je směr Praha?",
    answer:"2",
    pdf:"sifra5.pdf",
    codeAnswer:"kmen"
  },
  {
    id:6,
    name:"Poslední klíč",
    question:"Jaké číslo autobusu vás doveze na místo, kde hra končí?",
    answer:"367",
    pdf:"sifra6.wav",
    codeAnswer:"praha"
  }
];

// Přihlášení
function login(){
  const name = document.getElementById('team-name').value;
  const pass = document.getElementById('team-password').value;
  if(pass === '2025' && name.trim() !== ''){
    localStorage.setItem('team', name);
    showGame();
  } else {
    alert('Špatné heslo nebo prázdný název týmu!');
  }
}

function logout(){
  localStorage.removeItem('team');
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
}

// Vykreslení seznamu šifer s postupným odemykáním
function renderPuzzles(){
  const list = document.getElementById('puzzle-list');
  list.innerHTML = '';
  let lastSolvedIndex = -1;

  puzzles.forEach((p, idx) => {
    const solved = localStorage.getItem('puzzle_'+p.id+'_solved');
    if(solved) lastSolvedIndex = idx;

    const div = document.createElement('div');
    div.className = 'puzzle-item';
    div.innerText = "Šifra "+p.id+": "+p.name+" - "+(solved?"Vyřešeno":"Nevyřešeno");

    const locked = idx > lastSolvedIndex + 1;
    if(locked){
      div.classList.add('locked');
    } else {
      div.onclick = () => openPuzzle(p.id);
    }
    list.appendChild(div);
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

  let html = "<p>"+puzzle.question+"</p>";

  if(!questionSolved){
    html += '<input type="text" id="answer" placeholder="Odpověď">';
    html += '<button onclick="checkAnswer('+id+')">Odeslat odpověď</button>';
  } else if(!solved){
    html += '<p><strong>Otázka vyřešena!</strong> Tady je šifra:</p>';
    html += '<button onclick="window.open(\''+puzzle.pdf+'\')">Otevřít šifru</button>';
    html += '<p>Zadejte odpověď na šifru:</p>';
    html += '<input type="text" id="code" placeholder="Odpověď na šifru">';
    html += '<button onclick="checkCode('+id+')">Odeslat kód</button>';
  } else {
    html += '<p><strong>Šifra vyřešena!</strong></p>';
    html += '<button style="color: white;" onclick="window.open(\''+puzzle.pdf+'\')">Zobrazit šifru znovu</button>';
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
    alert('Špatná odpověď, zkuste to znovu.');
  }
}

// Ověření kódu ze šifry
function checkCode(id){
  const puzzle = puzzles.find(p=>p.id===id);
  const val = document.getElementById('code').value.trim().toLowerCase();
  if(val === puzzle.codeAnswer.toLowerCase()){
    localStorage.setItem('puzzle_'+id+'_solved', true);
    openPuzzle(id);
  } else {
    alert('Špatný kód ze šifry, zkuste to znovu.');
  }
}

function closePuzzle(){
  document.getElementById('puzzle-screen').classList.add('hidden');
  showGame();
}

window.onload = () => {
  if(localStorage.getItem('team')) showGame();
};


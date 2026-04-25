const SFX = {
    ctx: null,
    init() { if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)(); },
    play(type) {
        try {
            this.init();
            const osc = this.ctx.createOscillator(), gain = this.ctx.createGain();
            osc.connect(gain); gain.connect(this.ctx.destination);
            const now = this.ctx.currentTime;
            if (type === 'click') {
                osc.frequency.setValueAtTime(600, now);
                osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);
                gain.gain.setValueAtTime(0.1, now);
                osc.start(); osc.stop(now + 0.1);
            } else if (type === 'win') {
                osc.type = 'square';
                [400, 500, 600].forEach((f, i) => osc.frequency.setValueAtTime(f, now + i * 0.1));
                gain.gain.setValueAtTime(0.05, now);
                osc.start(); osc.stop(now + 0.3);
            } else if (type === 'fail') {
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(200, now);
                osc.frequency.linearRampToValueAtTime(50, now + 0.3);
                gain.gain.setValueAtTime(0.1, now);
                osc.start(); osc.stop(now + 0.3);
            }
        } catch (e) {}
    }
};

const state = {
    lang: 'python',
    prog: { python: 0, cpp: 0 },
    stars: { python: {}, cpp: {} }, // { nivelIndex: 3, ... }
    editor: null,
    currentAttempts: 0, // intentos en el nivel actual
    levelPassed: false
};

// Cargar progreso guardado
try {
    const saved = JSON.parse(localStorage.getItem('codequest_progress'));
    if (saved) {
        if (saved.prog) state.prog = saved.prog;
        if (saved.stars) state.stars = saved.stars;
    }
} catch (e) {}

function saveProgress() {
    localStorage.setItem('codequest_progress', JSON.stringify({
        prog: state.prog,
        stars: state.stars
    }));
}

function getCurrentLevel() {
    const idx = state.prog[state.lang];
    return idx < levels.length ? levels[idx] : null;
}

function getStarsForCurrentLevel() {
    const idx = state.prog[state.lang];
    if (!state.stars[state.lang]) state.stars[state.lang] = {};
    if (state.stars[state.lang][idx] === undefined) state.stars[state.lang][idx] = 3;
    return state.stars[state.lang][idx];
}

function setStarsForCurrentLevel(count) {
    const idx = state.prog[state.lang];
    if (!state.stars[state.lang]) state.stars[state.lang] = {};
    state.stars[state.lang][idx] = Math.max(0, Math.min(3, count));
    saveProgress();
}

function renderStars() {
    const stars = getStarsForCurrentLevel();
    const container = document.getElementById('stars-display');
    if (!container) return;
    let html = '';
    for (let i = 0; i < 3; i++) {
        html += `<span class="star ${i < stars ? '' : 'empty'}">★</span>`;
    }
    container.innerHTML = html;
}

function createPanels() {
    const main = document.getElementById('main-content');
    main.innerHTML = `
        <div id="view-docs" class="view-panel active p-5">
            <div class="flex justify-between items-start mb-2">
                <h2 id="lvl-title" class="text-2xl font-bold text-white"></h2>
                <button id="btn-hint" class="hint-btn" title="Ver pista">💡 Pista</button>
            </div>
            <div id="hint-area" class="hint-text hidden"></div>
            <div id="concept-box" class="bg-indigo-500/10 border-l-4 border-indigo-500 p-3 rounded mb-4 mt-2">
                <p id="concept-text" class="text-xs text-indigo-200 italic"></p>
            </div>
            <p id="lvl-desc" class="text-slate-400 text-sm mb-5"></p>
            <div class="bg-slate-900 p-4 rounded-xl border border-slate-800 mb-4">
                <span class="text-[10px] text-slate-500 font-bold block mb-2 uppercase">Sintaxis</span>
                <pre id="lvl-example" class="text-xs text-indigo-300 font-mono overflow-x-auto"></pre>
            </div>
            <div class="bg-indigo-600 p-4 rounded-2xl shadow-lg mt-auto mb-4">
                <span class="text-[10px] text-indigo-200 font-bold block mb-1 uppercase">Misión</span>
                <p id="lvl-mission" class="text-white text-sm font-bold leading-tight"></p>
            </div>
        </div>
        <div id="view-editor" class="view-panel">
            <div class="flex-1 overflow-hidden bg-[#0f172a]"><textarea id="editor-raw"></textarea></div>
            <div class="p-4 bg-slate-900 border-t border-slate-800 flex gap-2 shrink-0">
                <button id="btn-run" class="btn-game flex-1 bg-indigo-600 text-white font-bold py-4 rounded-xl text-xs tracking-widest shadow-lg">VALIDAR CÓDIGO</button>
                <button id="btn-reset" class="btn-game px-6 bg-slate-800 text-slate-400 rounded-xl">⟲</button>
            </div>
        </div>
        <div id="view-console" class="view-panel bg-black p-5 font-mono">
            <div class="flex justify-between mb-4 border-b border-white/10 pb-2">
                <span class="text-[10px] text-green-500 font-bold tracking-tighter uppercase">Consola de Salida</span>
                <button id="btn-clear" class="text-[10px] text-slate-500 bg-slate-900 px-2 py-1 rounded">CLEAR</button>
            </div>
            <div id="output-text" class="text-green-400 text-sm whitespace-pre-wrap leading-relaxed">Esperando ejecución...</div>
        </div>
    `;
}

function initEditor() {
    if (state.editor) {
        state.editor.toTextArea();
        state.editor = null;
    }
    state.editor = CodeMirror.fromTextArea(document.getElementById('editor-raw'), {
        lineNumbers: true,
        mode: state.lang === 'python' ? 'python' : 'text/x-c++src',
        theme: 'material-ocean',
        indentUnit: 4,
        autoCloseBrackets: true,
        lineWrapping: true,
        inputStyle: 'contenteditable'
    });
    state.editor.setSize('100%', '100%');
    state.editor.on('change', () => state.editor.save());
}

function render() {
    const idx = state.prog[state.lang];
    const main = document.getElementById('main-content');
    const nav = document.getElementById('bottom-nav');

    if (idx >= levels.length) {
        main.innerHTML = `<div class='h-full flex flex-col items-center justify-center p-10 text-center'>
            <div class='text-6xl mb-4'>🏆</div>
            <h1 class='text-2xl font-bold'>¡CURSO COMPLETADO!</h1>
            <p class='text-slate-400 mt-2'>Has dominado de 0 a POO en ${state.lang === 'python' ? 'Python' : 'C++'}</p>
        </div>`;
        nav.style.display = 'none';
        confetti({ particleCount: 200, spread: 120 });
        return;
    }

    nav.style.display = '';
    if (!document.getElementById('view-docs')) {
        createPanels();
        initEditor();
        bindEvents();
    }

    const level = getCurrentLevel();
    if (!level) return;
    const ld = level[state.lang];
    document.getElementById('lvl-title').innerText = level.title;
    document.getElementById('concept-text').innerText = level.concept;
    document.getElementById('lvl-desc').innerText = level.type === 'TEORÍA' ? 'Aprende la sintaxis base.' : 'Resuelve el problema lógico.';
    document.getElementById('lvl-example').innerText = ld.ex;
    document.getElementById('lvl-mission').innerText = ld.mission;
    document.getElementById('progreso-badge').innerText = `ETAPA ${idx+1}/${levels.length}`;
    document.getElementById('type-label').innerText = level.type;

    // Ocultar pista previa
    const hintArea = document.getElementById('hint-area');
    hintArea.classList.add('hidden');
    hintArea.innerText = '';
    // Si el nivel tiene hint, habilitar botón
    const btnHint = document.getElementById('btn-hint');
    if (btnHint) {
        btnHint.style.display = level.hint ? 'inline-block' : 'none';
    }

    state.editor.setValue(ld.init || '');
    state.editor.setOption('mode', state.lang === 'python' ? 'python' : 'text/x-c++src');
    setTimeout(() => state.editor.refresh(), 50);

    state.currentAttempts = 0;
    state.levelPassed = false;
    renderStars();
    saveProgress();
}

function switchView(view) {
    if (!document.getElementById('view-' + view)) return;
    SFX.play('click');
    document.querySelectorAll('.view-panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('tab-active'));
    document.getElementById('view-' + view).classList.add('active');
    document.getElementById('tab-' + view).classList.add('tab-active');
    if (view === 'editor') setTimeout(() => state.editor.refresh(), 50);
}

function showHint() {
    const level = getCurrentLevel();
    if (!level || !level.hint) return;
    const hintArea = document.getElementById('hint-area');
    hintArea.innerText = level.hint;
    hintArea.classList.remove('hidden');
}

function runCode() {
    if (state.levelPassed) return; // Evitar reintentos tras superar
    SFX.play('click');
    state.editor.save();
    const code = state.editor.getValue();
    const outEl = document.getElementById('output-text');
    outEl.innerText = '> Ejecutando...';
    switchView('console');

    setTimeout(() => {
        try {
            const simOut = simulateExecution(code, state.lang);
            outEl.innerText = simOut || 'Salida vacía.';
            const level = getCurrentLevel();
            const ld = level[state.lang];
            if (ld.check(code, simOut)) {
                // Éxito: calcular estrellas según intentos
                let stars = 3;
                if (state.currentAttempts === 1) stars = 3;
                else if (state.currentAttempts === 2) stars = 2;
                else if (state.currentAttempts >= 3) stars = 1;
                setStarsForCurrentLevel(stars);
                state.levelPassed = true;
                SFX.play('win');
                // Mostrar estrellas ganadas en modal
                const starsDiv = document.getElementById('stars-earned');
                starsDiv.innerHTML = '';
                for (let i = 0; i < 3; i++) {
                    starsDiv.innerHTML += `<span class="star ${i < stars ? '' : 'empty'}">★</span>`;
                }
                document.getElementById('modal').classList.remove('hidden');
                confetti({ particleCount: 100, spread: 70, origin: { y: 0.8 } });
            } else {
                // Fallo
                state.currentAttempts++;
                // Si ya tiene estrellas guardadas no las reducimos hasta que pase
                // Pero podríamos mostrar advertencia
                SFX.play('fail');
                outEl.innerHTML += '\n\n<span class="text-red-500 font-bold">[!] ERROR: No cumple la misión. Revisa la salida esperada.</span>';
                if (state.currentAttempts >= 4) {
                    outEl.innerHTML += '\n<span class="text-yellow-500 text-xs">💡 Usa el botón Pista en Misión si lo necesitas.</span>';
                }
            }
        } catch (e) {
            outEl.innerHTML = `<span class="text-red-500">Error interno: ${e.message}</span>`;
            SFX.play('fail');
        }
    }, 600);
}

function nextLevel() {
    state.prog[state.lang]++;
    state.levelPassed = false;
    document.getElementById('modal').classList.add('hidden');
    render();
    if (state.prog[state.lang] < levels.length) switchView('docs');
}

function handleLangChange() {
    state.lang = document.getElementById('lang-select').value;
    state.levelPassed = false;
    render();
    if (state.prog[state.lang] < levels.length) switchView('docs');
}

function resetLevel() {
    if (confirm('¿Reiniciar etapa actual? Se mantendrán las estrellas ganadas.')) {
        state.currentAttempts = 0;
        render();
    }
}

function clearConsole() {
    document.getElementById('output-text').innerText = 'Terminal limpia.';
}

// Tutorial interactivo con intro.js
function startTutorial() {
    if (!document.getElementById('view-docs')) return; // no listo aún
    const tutorial = introJs();
    tutorial.setOptions({
        steps: [
            {
                intro: "¡Bienvenido a <b>CodeQuest</b>!<br>Vamos a aprender a programar resolviendo misiones. Este tutorial rápido te mostrará lo esencial."
            },
            {
                element: '#lang-select',
                intro: "Elige entre <b>Python</b> o <b>C++</b>. Cambiará el tipo de código que debes escribir.",
                position: 'bottom'
            },
            {
                element: '#tab-docs',
                intro: "Aquí verás la <b>Misión</b> actual: qué debes lograr, ejemplos de sintaxis y una pista si la necesitas.",
                position: 'top'
            },
            {
                element: '#tab-editor',
                intro: "En el <b>Editor</b> escribirás tu código para cumplir la misión. Presiona el botón para abrirlo.",
                position: 'top'
            },
            {
                element: '#btn-run',
                intro: "Cuando tengas listo tu código, pulsa <b>VALIDAR CÓDIGO</b> para probarlo. ¡Aquí empieza la magia!",
                position: 'top'
            },
            {
                element: '#tab-console',
                intro: "La <b>Consola</b> muestra el resultado de tu programa. Si algo sale mal, verás pistas aquí.",
                position: 'top'
            },
            {
                element: '#btn-hint',
                intro: "Si te atascas, puedes usar el botón <b>💡 Pista</b> en la vista Misión para obtener una ayuda sin revelar la solución.",
                position: 'left'
            },
            {
                element: '#stars-display',
                intro: "¡Gana <b>estrellas</b> según tus intentos! Mínimo 1, máximo 3. ¿Podrás conseguir las 3 en cada nivel?",
                position: 'bottom'
            },
            {
                element: '#btn-help',
                intro: "Si quieres repetir este tutorial, solo pulsa el botón <b>🧭</b> en la cabecera.",
                position: 'bottom'
            },
            {
                intro: "¡Listo! Empieza a programar y diviértete. 🚀"
            }
        ],
        showProgress: true,
        exitOnOverlayClick: false,
        doneLabel: 'Entendido',
        nextLabel: 'Siguiente',
        prevLabel: 'Anterior'
    });

    tutorial.start();
}

function bindEvents() {
    document.getElementById('btn-run').onclick = runCode;
    document.getElementById('btn-reset').onclick = resetLevel;
    document.getElementById('btn-clear').onclick = clearConsole;
    document.getElementById('btn-next').onclick = nextLevel;
    document.getElementById('lang-select').onchange = handleLangChange;
    document.getElementById('tab-docs').onclick = () => switchView('docs');
    document.getElementById('tab-editor').onclick = () => switchView('editor');
    document.getElementById('tab-console').onclick = () => switchView('console');
    document.getElementById('btn-hint').onclick = showHint;
    document.getElementById('btn-help').onclick = startTutorial;

    // Atajo Ctrl+Enter
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            runCode();
        }
    });
}

window.onload = () => {
    createPanels();
    initEditor();
    bindEvents();
    render();
    switchView('docs');
    document.body.addEventListener('touchstart', () => SFX.init(), { once: true });

    // Lanzar tutorial automático la primera vez (si no hay progreso guardado)
    const hasProgress = state.prog.python > 0 || state.prog.cpp > 0;
    if (!hasProgress) {
        setTimeout(() => startTutorial(), 800);
    }
};
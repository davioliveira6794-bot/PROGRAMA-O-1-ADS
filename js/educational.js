(function () {
    'use strict';

    const TOTAL_QUESTIONS = 10;

    const state = {
        fator1: 0,
        fator2: 0,
        resposta: 0,
        acertos: 0,
        erros: 0,
        questao: 0,
        dificuldade: 'medio',
        respondido: false,
        gameOver: false,
        touchedTile: null,
        touchOffsetX: 0,
        touchOffsetY: 0,
    };

    const dificuldadeRange = {
        facil: { max: 5 },
        medio: { max: 9 },
        dificil: { max: 12 },
    };

    const fator1El = document.getElementById('fator1');
    const fator2El = document.getElementById('fator2');
    const tilesContainer = document.getElementById('tilesContainer');
    const dropZone = document.getElementById('dropZone');
    const feedbackEl = document.getElementById('feedback');
    const nextBtn = document.getElementById('nextBtn');
    const acertosEl = document.getElementById('acertos');
    const errosEl = document.getElementById('erros');
    const questaoAtualEl = document.getElementById('questaoAtual');
    const gameOverEl = document.getElementById('gameOver');
    const finalScoreEl = document.getElementById('finalScore');
    const starsEl = document.getElementById('stars');
    const finalMessageEl = document.getElementById('finalMessage');
    const dificuldadeSelect = document.getElementById('dificuldade');
    const novoJogoBtn = document.getElementById('novoJogoBtn');
    const jogarNovamenteBtn = document.getElementById('jogarNovamenteBtn');
    const equationDisplay = document.getElementById('equationDisplay');

    function gerarNumeroAleatorio(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function gerarRespostaErrada(certa, max) {
        let errada;
        const tentativas = 20;
        for (let i = 0; i < tentativas; i++) {
            const offset = gerarNumeroAleatorio(1, Math.max(3, Math.floor(max * 0.4)));
            errada = Math.random() < 0.5 ? certa + offset : certa - offset;
            if (errada >= 1 && errada <= max * max && errada !== certa) {
                return errada;
            }
        }
        let e = certa + 1;
        while (e === certa) e++;
        return e;
    }

    function gerarOpcoes(certa, max) {
        const opcoes = new Set();
        opcoes.add(certa);
        while (opcoes.size < 4) {
            opcoes.add(gerarRespostaErrada(certa, max));
        }
        return Array.from(opcoes).sort(function (a, b) { return a - b; });
    }

    function gerarQuestao() {
        const range = dificuldadeRange[state.dificuldade];
        state.fator1 = gerarNumeroAleatorio(1, range.max);
        state.fator2 = gerarNumeroAleatorio(1, range.max);
        state.resposta = state.fator1 * state.fator2;
        state.respondido = false;

        fator1El.textContent = state.fator1;
        fator2El.textContent = state.fator2;

        dropZone.textContent = '?';
        dropZone.className = 'drop-zone';
        feedbackEl.className = 'feedback';
        feedbackEl.textContent = '';
        nextBtn.className = 'next-btn btn';

        const opcoes = gerarOpcoes(state.resposta, range.max);
        tilesContainer.innerHTML = '';
        opcoes.forEach(function (valor) {
            const tile = document.createElement('div');
            tile.className = 'tile';
            tile.textContent = valor;
            tile.draggable = true;
            tile.dataset.valor = valor;

            tile.addEventListener('dragstart', onDragStart);
            tile.addEventListener('dragend', onDragEnd);
            tile.addEventListener('touchstart', onTouchStart, { passive: false });
            tile.addEventListener('touchmove', onTouchMove, { passive: false });
            tile.addEventListener('touchend', onTouchEnd, { passive: false });

            tilesContainer.appendChild(tile);
        });

        equationDisplay.classList.remove('fade-in');
        void equationDisplay.offsetWidth;
        equationDisplay.classList.add('fade-in');

        questaoAtualEl.textContent = state.questao + 1;
    }

    function verificarResposta(valor) {
        if (state.respondido || state.gameOver) return;

        state.respondido = true;

        const tiles = tilesContainer.querySelectorAll('.tile');
        tiles.forEach(function (t) {
            t.draggable = false;
        });

        if (valor === state.resposta) {
            state.acertos++;
            dropZone.className = 'drop-zone correct';
            dropZone.textContent = valor;
            feedbackEl.className = 'feedback correct show';
            feedbackEl.textContent = 'Correto! &#10003;';

            tiles.forEach(function (t) {
                if (parseInt(t.dataset.valor, 10) === state.resposta) {
                    t.classList.add('correct');
                }
            });
        } else {
            state.erros++;
            dropZone.className = 'drop-zone wrong';
            dropZone.textContent = valor;
            feedbackEl.className = 'feedback wrong show';
            feedbackEl.textContent = 'Incorreto! Tente novamente na próxima.';

            tiles.forEach(function (t) {
                if (parseInt(t.dataset.valor, 10) === state.resposta) {
                    t.classList.add('correct');
                }
                if (parseInt(t.dataset.valor, 10) === valor) {
                    t.classList.add('wrong');
                }
            });

            dropZone.textContent = state.resposta;
        }

        acertosEl.textContent = state.acertos;
        errosEl.textContent = state.erros;

        if (state.questao < TOTAL_QUESTIONS) {
            nextBtn.className = 'next-btn btn show';
        }
    }

    function proximaQuestao() {
        state.questao++;
        if (state.questao >= TOTAL_QUESTIONS) {
            finalizarJogo();
        } else {
            gerarQuestao();
        }
    }

    function finalizarJogo() {
        state.gameOver = true;
        gameOverEl.classList.add('show');
        finalScoreEl.textContent = state.acertos + '/' + TOTAL_QUESTIONS;

        const porcentagem = state.acertos / TOTAL_QUESTIONS;
        let estrelas = 0;
        if (porcentagem >= 0.9) estrelas = 3;
        else if (porcentagem >= 0.7) estrelas = 2;
        else if (porcentagem >= 0.4) estrelas = 1;

        starsEl.textContent = '';
        for (let i = 0; i < estrelas; i++) {
            starsEl.textContent += '\u2B50 ';
        }
        if (estrelas === 0) {
            starsEl.textContent = 'Continue praticando!';
        }

        if (porcentagem >= 0.9) {
            finalMessageEl.textContent = 'Excelente! Voc\u00EA \u00E9 um mestre da multiplica\u00E7\u00E3o!';
        } else if (porcentagem >= 0.7) {
            finalMessageEl.textContent = 'Muito bom! Continue praticando para melhorar ainda mais.';
        } else if (porcentagem >= 0.4) {
            finalMessageEl.textContent = 'Bom progresso! Com mais pr\u00E1tica voc\u00EA vai chegar l\u00E1.';
        } else {
            finalMessageEl.textContent = 'Continue praticando! A pr\u00E1tica leva \u00E0 perfei\u00E7\u00E3o.';
        }
    }

    function resetarJogo() {
        state.acertos = 0;
        state.erros = 0;
        state.questao = 0;
        state.gameOver = false;
        state.respondido = false;

        acertosEl.textContent = '0';
        errosEl.textContent = '0';
        questaoAtualEl.textContent = '0';
        gameOverEl.classList.remove('show');
        feedbackEl.className = 'feedback';
        feedbackEl.textContent = '';
        nextBtn.className = 'next-btn btn';
        dropZone.className = 'drop-zone';
        dropZone.textContent = '?';

        state.dificuldade = dificuldadeSelect.value;
        gerarQuestao();
    }

    function onDragStart(e) {
        if (state.respondido || state.gameOver) {
            e.preventDefault();
            return;
        }
        const tile = e.target;
        if (!tile.classList.contains('tile')) return;
        tile.classList.add('dragging');
        e.dataTransfer.setData('text/plain', tile.dataset.valor);
        e.dataTransfer.effectAllowed = 'move';
    }

    function onDragEnd(e) {
        e.target.classList.remove('dragging');
    }

    dropZone.addEventListener('dragover', function (e) {
        e.preventDefault();
        if (!state.respondido && !state.gameOver) {
            dropZone.classList.add('drag-over');
        }
    });

    dropZone.addEventListener('dragleave', function () {
        dropZone.classList.remove('drag-over');
    });

    dropZone.addEventListener('drop', function (e) {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        if (state.respondido || state.gameOver) return;
        const valor = parseInt(e.dataTransfer.getData('text/plain'), 10);
        if (!isNaN(valor)) {
            verificarResposta(valor);
        }
    });

    var dragTile = null;
    var dragClone = null;

    function onTouchStart(e) {
        if (state.respondido || state.gameOver) return;
        const tile = e.currentTarget;
        if (!tile.classList.contains('tile')) return;

        const touch = e.touches[0];
        const rect = tile.getBoundingClientRect();

        dragTile = tile;
        state.touchOffsetX = touch.clientX - rect.left;
        state.touchOffsetY = touch.clientY - rect.top;

        dragClone = tile.cloneNode(true);
        dragClone.style.position = 'fixed';
        dragClone.style.width = rect.width + 'px';
        dragClone.style.height = rect.height + 'px';
        dragClone.style.left = (touch.clientX - state.touchOffsetX) + 'px';
        dragClone.style.top = (touch.clientY - state.touchOffsetY) + 'px';
        dragClone.style.pointerEvents = 'none';
        dragClone.style.zIndex = '1000';
        dragClone.style.opacity = '0.85';
        dragClone.style.transform = 'scale(1.1)';
        document.body.appendChild(dragClone);

        tile.style.opacity = '0.4';
    }

    function onTouchMove(e) {
        if (!dragClone || !dragTile) return;
        e.preventDefault();

        const touch = e.touches[0];
        dragClone.style.left = (touch.clientX - state.touchOffsetX) + 'px';
        dragClone.style.top = (touch.clientY - state.touchOffsetY) + 'px';

        const dzRect = dropZone.getBoundingClientRect();
        if (
            touch.clientX >= dzRect.left &&
            touch.clientX <= dzRect.right &&
            touch.clientY >= dzRect.top &&
            touch.clientY <= dzRect.bottom
        ) {
            dropZone.classList.add('drag-over');
        } else {
            dropZone.classList.remove('drag-over');
        }
    }

    function onTouchEnd(e) {
        if (!dragClone || !dragTile) return;
        const touch = e.changedTouches[0];

        const dzRect = dropZone.getBoundingClientRect();
        const isOverDrop =
            touch.clientX >= dzRect.left &&
            touch.clientX <= dzRect.right &&
            touch.clientY >= dzRect.top &&
            touch.clientY <= dzRect.bottom;

        dragClone.remove();
        dragClone = null;

        dragTile.style.opacity = '1';
        dropZone.classList.remove('drag-over');

        if (isOverDrop && !state.respondido && !state.gameOver) {
            const valor = parseInt(dragTile.dataset.valor, 10);
            if (!isNaN(valor)) {
                verificarResposta(valor);
            }
        }

        dragTile = null;
    }

    nextBtn.addEventListener('click', proximaQuestao);
    novoJogoBtn.addEventListener('click', resetarJogo);
    jogarNovamenteBtn.addEventListener('click', resetarJogo);
    dificuldadeSelect.addEventListener('change', function () {
        state.dificuldade = this.value;
    });

    resetarJogo();

})();

(function () {
    'use strict';

    const form = document.getElementById('contactForm');
    const successMsg = document.getElementById('successMessage');

    function showError(inputId, errorId) {
        const input = document.getElementById(inputId);
        const error = document.getElementById(errorId);
        if (input) input.classList.add('error');
        if (error) error.classList.add('show');
    }

    function clearError(inputId, errorId) {
        const input = document.getElementById(inputId);
        const error = document.getElementById(errorId);
        if (input) input.classList.remove('error');
        if (error) error.classList.remove('show');
    }

    function clearRadioError() {
        document.getElementById('contatoError').classList.remove('show');
    }

    function clearCheckboxError() {
        document.getElementById('interesseError').classList.remove('show');
    }

    document.getElementById('nome').addEventListener('input', function () {
        if (this.value.trim().length >= 3) {
            clearError('nome', 'nomeError');
        }
    });

    document.getElementById('email').addEventListener('input', function () {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (re.test(this.value.trim())) {
            clearError('email', 'emailError');
        }
    });

    document.getElementById('nascimento').addEventListener('change', function () {
        if (this.value) {
            const parts = this.value.split('-');
            const d = new Date(parts[0], parts[1] - 1, parts[2]);
            const today = new Date();
            if (d < today) {
                clearError('nascimento', 'nascimentoError');
            }
        }
    });

    document.getElementById('idade').addEventListener('input', function () {
        const val = parseInt(this.value, 10);
        if (val >= 1 && val <= 150) {
            clearError('idade', 'idadeError');
        }
    });

    document.querySelectorAll('input[name="contato"]').forEach(function (radio) {
        radio.addEventListener('change', clearRadioError);
    });

    document.querySelectorAll('input[name="interesse"]').forEach(function (cb) {
        cb.addEventListener('change', clearCheckboxError);
    });

    document.getElementById('assunto').addEventListener('change', function () {
        if (this.value) {
            clearError('assunto', 'assuntoError');
        }
    });

    document.getElementById('mensagem').addEventListener('input', function () {
        if (this.value.trim().length >= 10) {
            clearError('mensagem', 'mensagemError');
        }
    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        let valid = true;

        clearError('nome', 'nomeError');
        clearError('email', 'emailError');
        clearError('nascimento', 'nascimentoError');
        clearError('idade', 'idadeError');
        clearError('assunto', 'assuntoError');
        clearError('mensagem', 'mensagemError');
        clearRadioError();
        clearCheckboxError();

        const nome = document.getElementById('nome').value.trim();
        if (nome.length < 3) {
            showError('nome', 'nomeError');
            valid = false;
        }

        const email = document.getElementById('email').value.trim();
        const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRe.test(email)) {
            showError('email', 'emailError');
            valid = false;
        }

        const nascimento = document.getElementById('nascimento').value;
        if (!nascimento) {
            showError('nascimento', 'nascimentoError');
            valid = false;
        } else {
            const parts = nascimento.split('-');
            const d = new Date(parts[0], parts[1] - 1, parts[2]);
            const today = new Date();
            if (d >= today || isNaN(d.getTime())) {
                showError('nascimento', 'nascimentoError');
                valid = false;
            }
        }

        const idade = parseInt(document.getElementById('idade').value, 10);
        if (isNaN(idade) || idade < 1 || idade > 150) {
            showError('idade', 'idadeError');
            valid = false;
        }

        const contatoSelected = document.querySelector('input[name="contato"]:checked');
        if (!contatoSelected) {
            document.getElementById('contatoError').classList.add('show');
            valid = false;
        }

        const interesses = document.querySelectorAll('input[name="interesse"]:checked');
        if (interesses.length === 0) {
            document.getElementById('interesseError').classList.add('show');
            valid = false;
        }

        const assunto = document.getElementById('assunto').value;
        if (!assunto) {
            showError('assunto', 'assuntoError');
            valid = false;
        }

        const mensagem = document.getElementById('mensagem').value.trim();
        if (mensagem.length < 10) {
            showError('mensagem', 'mensagemError');
            valid = false;
        }

        if (valid) {
            successMsg.classList.add('show');
            form.reset();
            setTimeout(function () {
                successMsg.classList.remove('show');
            }, 5000);
        }
    });

    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    hamburger.addEventListener('click', function () {
        navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
            navLinks.classList.remove('open');
        });
    });

})();

const telaInicial = document.getElementById('tela-inicial');
const botaoIniciar = document.getElementById('botao-iniciar');
botaoIniciar.addEventListener('click', iniciar);

const containerPrimeiroValor = document.getElementById('container-primeiro-valor');
const containerSegundoValor = document.getElementById('container-segundo-valor');
const resultadoUsuario = document.getElementById('resultado-usuario');
const placar = document.getElementById('placar');
const multiplicador = document.getElementById('multiplicador');
const tempo = document.getElementById('tempo');
const botaoEnviar = document.getElementById('botao-enviar');

const botoesNumericos = document.getElementsByClassName('num');

Array.from(botoesNumericos).forEach(botao => {
    botao.addEventListener('click', () => digitar(botao.dataset.value));
});

const telaDerrota = document.getElementById('tela-derrota');
const retorno = document.getElementById('retorno');
const botaoJogarNovamente = document.getElementById('botao-jogar-novamente');
const botaoPararJogo = document.getElementById('botao-parar-jogo');
const telaTriste = document.getElementById('tela-triste');

const tempoPadrao = 10;
let tempoRestante = tempoPadrao;
let primeiraPartida = true;
let novoRecorde = false;
let questaoAtual = 1;
let pontos = 0;
let recorde = 0;
let valorMultiplicador = 1;
let valorMaxTabuada = 10;
let segundosAdicionais = 3;
let resultadoCorreto = undefined;
let contadorTempo;

let apertouEnter = (e) => {
    if (e.key === 'Enter') enviar();
};

function iniciar() {
    resultadoUsuario.value = '';
    telaInicial.style.display = 'none';
    botaoEnviar.addEventListener('click', enviar);
    document.addEventListener('keypress', apertouEnter);
    contadorTempo = setInterval(atualizarTempo, 1000);
    gerarConta();
    if (!ehMobile()) resultadoUsuario.focus();
}

function digitar(botaoPressionado) {
    if (botaoPressionado !== 'backspace' && isNaN(botaoPressionado)) throw new Error('Input inválido');

    if (botaoPressionado === 'backspace') resultadoUsuario.value = resultadoUsuario.value.slice(0, -1);
    else resultadoUsuario.value += botaoPressionado;
}

function gerarConta() {
    let valorAleatorio1 = Math.round(Math.random() * valorMaxTabuada);
    let valorAleatorio2 = Math.round(Math.random() * valorMaxTabuada);
    resultadoCorreto = valorAleatorio1 * valorAleatorio2;

    containerPrimeiroValor.innerText = valorAleatorio1;
    containerSegundoValor.innerText = valorAleatorio2;
}


function enviar() {
    if (Number(resultadoUsuario.value) === resultadoCorreto) {
        tempoRestante += segundosAdicionais;
        atualizarQuestaoAtual();
        atualizarMultiplicador();
        atualizarPontos();
        resultadoUsuario.value = '';
        if (!ehMobile()) resultadoUsuario.focus();
        gerarConta();
    } else {
        terminarPartida();
    }
}

function atualizarQuestaoAtual() {
    questaoAtual++;

    if (questaoAtual === 41) ativarHardcore();
    else if (questaoAtual === 86) ativarUltrahardcore();
}

function atualizarMultiplicador() {
    valorMultiplicador = Math.ceil(questaoAtual / 5);
    multiplicador.innerText = valorMultiplicador;
}

function atualizarPontos() {
    pontos += 3 * valorMultiplicador;
    placar.innerText = pontos;

    if (pontos > recorde) {
        recorde = pontos;
        novoRecorde = true;
    }
}

function atualizarTempo() {
    tempoRestante--;
    let min = Math.floor(tempoRestante / 60);
    let s = tempoRestante - min * 60;

    if (min > 9) {
        tempo.innerText = s > 9? `${min}:${s}` : `${min}:0${s}`;
    } else {
        tempo.innerText = s > 9? `0${min}:${s}` : `0${min}:0${s}`;
    }

    if (tempoRestante <= 0) terminarPartida();
}

function terminarPartida() {
    botaoEnviar.removeEventListener('click', enviar);
    document.removeEventListener('keypress', apertouEnter);
    clearInterval(contadorTempo);
    resultadoUsuario.value = '';

    retorno.innerHTML = tempoRestante <= 0
    ? `o seu tempo acabou<br>`
    : `voce errou a conta ${containerPrimeiroValor.innerText} x ${containerSegundoValor.innerText}<br>`;

    if (primeiraPartida === true) {
        retorno.innerHTML += `pontuacao: ${pontos} pontos<br><br>`;
    } else {
        retorno.innerHTML += novoRecorde
        ? `pontuacao: ${pontos} pontos<br><span style="color: var(--cor-destaque-atual);">novo recorde!</span><br><br>`
        : `pontuacao: ${pontos} pontos<br>recorde: ${recorde} pontos<br><br>`;
    }

    retorno.innerHTML += `deseja jogar novamente?`;
    telaDerrota.style.display = 'block';

    botaoJogarNovamente.addEventListener('click', jogarNovamente);
    botaoPararJogo.addEventListener('click', pararJogo);
}

function jogarNovamente() {
    telaDerrota.style.display = 'none';
    desativarHardcores();

    novoRecorde = false;
    primeiraPartida = false;
    questaoAtual = 1;
    pontos = 0;
    valorMultiplicador = 1;
    tempoRestante = tempoPadrao;

    placar.innerText = pontos;
    multiplicador.innerText = valorMultiplicador;

    botaoEnviar.addEventListener('click', enviar);
    document.addEventListener('keypress', apertouEnter);
    contadorTempo = setInterval(atualizarTempo, 1000);
    if (!ehMobile()) resultadoUsuario.focus();
    gerarConta();
}

function pararJogo() {
   telaTriste.style.display = 'block';
}

function ativarHardcore() {
    segundosAdicionais = 2;
    valorMaxTabuada = 20;

    atualizarTema('hardcore');
}

function ativarUltrahardcore() {
    valorMaxTabuada = 30;

    atualizarTema('ultrahardcore');
}

function desativarHardcores() {
    segundosAdicionais = 3;
    valorMaxTabuada = 10;

    atualizarTema('padrao');
}

function atualizarTema(modo) {
    if (!['padrao', 'hardcore', 'ultrahardcore'].includes(modo)) throw new Error('Modo de cor inválido');

    let corFundo = getComputedStyle(document.documentElement).getPropertyValue(`--cor-fundo-${modo}`);
    let corDetalhes = getComputedStyle(document.documentElement).getPropertyValue(`--cor-detalhes-${modo}`);

    document.querySelector(':root').style.setProperty('--cor-fundo-atual', corFundo);
    document.querySelector(':root').style.setProperty('--cor-detalhes-atual', corDetalhes);

    const emoticons = {
        padrao: ':p',
        hardcore: '>:D',
        ultrahardcore: 'D:'
    };

    document.querySelector('#emoticon-teclado').innerText = emoticons[modo];
}

function ehMobile() {
    return 'ontouchstart' in botaoIniciar;
}
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

const digitos = document.getElementsByClassName('num');

for (const prop in digitos) {
    if (typeof digitos[prop] !== 'object') continue;

    digitos[prop].addEventListener('click', () => digitar(digitos[prop].id));
}

const telaDerrota = document.getElementById('tela-derrota');
const retorno = document.getElementById('retorno');
const botaoJogarNovamente = document.getElementById('botao-jogar-novamente');
const botaoPararJogo = document.getElementById('botao-parar-jogo');
const telaTriste = document.getElementById('tela-triste');

let primeiraPartida = true;
let novoRecorde = false;
let questaoAtual = 1;
let pontos = 0;
let recorde = 0;
let valorMultiplicador = 1;
let resultadoCorreto = undefined;
let tempoPadrao = 10;
let tempoRestante = tempoPadrao;
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

function digitar(digito) {
    if (digito === 'backspace') resultadoUsuario.value = resultadoUsuario.value.slice(0, -1);
    else resultadoUsuario.value += digito.replace('num', '');
}

let valorMax = 10;
function gerarConta() {
    let valorAleatorio1 = Math.round(Math.random() * valorMax);
    let valorAleatorio2 = Math.round(Math.random() * valorMax);
    resultadoCorreto = valorAleatorio1 * valorAleatorio2;

    containerPrimeiroValor.innerText = valorAleatorio1;
    containerSegundoValor.innerText = valorAleatorio2;
}

let segundosAdicionais = 3;
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
    else if (questaoAtual === 86) ativarUltraHardcore();
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
    ? `O SEU TEMPO ACABOU<br>`
    : `VOCE ERROU A CONTA ${containerPrimeiroValor.innerText} x ${containerSegundoValor.innerText}<br>`;

    if (primeiraPartida === true) {
        retorno.innerHTML += `PONTUACAO: ${pontos} PONTOS<br><br>`;
    } else {
        retorno.innerHTML += novoRecorde
        ? `PONTUACAO: ${pontos} PONTOS<br><span style="color: var(--cor-destaque-atual);">NOVO RECORDE!</span><br><br>`
        : `PONTUACAO: ${pontos} PONTOS<br>RECORDE: ${recorde} PONTOS<br><br>`;
    }

    retorno.innerHTML += `DESEJA JOGAR NOVAMENTE?`;
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

const cssRootGetter = getComputedStyle(document.documentElement);

function ativarHardcore() {
    segundosAdicionais = 2;
    valorMax = 20;

    let corFundoHardcore = cssRootGetter.getPropertyValue('--cor-fundo-hardcore');
    let corDetalhesHardcore = cssRootGetter.getPropertyValue('--cor-detalhes-hardcore');

    document.querySelector(':root').style.setProperty('--cor-fundo-atual', corFundoHardcore);
    document.querySelector(':root').style.setProperty('--cor-detalhes-atual', corDetalhesHardcore);
    document.querySelector('#num-fake').innerText = '>:D';
}

function ativarUltraHardcore() {
    valorMax = 30;

    let corFundoUltrahardcore = cssRootGetter.getPropertyValue('--cor-fundo-ultrahardcore');
    let corDetalhesUltrahardcore = cssRootGetter.getPropertyValue('--cor-detalhes-ultrahardcore');

    document.querySelector(':root').style.setProperty('--cor-fundo-atual', corFundoUltrahardcore);
    document.querySelector(':root').style.setProperty('--cor-detalhes-atual', corDetalhesUltrahardcore);
    document.querySelector('#num-fake').innerText = 'D:';
}

function desativarHardcores() {
    segundosAdicionais = 3;
    valorMax = 10;

    let corFundoPadrao = cssRootGetter.getPropertyValue('--cor-fundo-padrao');
    let corDetalhesPadrao = cssRootGetter.getPropertyValue('--cor-detalhes-padrao');

    document.querySelector(':root').style.setProperty('--cor-fundo-atual', corFundoPadrao);
    document.querySelector(':root').style.setProperty('--cor-detalhes-atual', corDetalhesPadrao);
    document.querySelector('#num-fake').innerText = ':p';
}

function ehMobile() {
    return 'ontouchstart' in botaoIniciar;
}
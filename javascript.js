const telaInicial = document.getElementById('telaInicial');
const botaoIniciar = document.getElementById('botaoIniciar');
botaoIniciar.addEventListener('click', iniciar);

const valor1 = document.getElementById('valor1');
const valor2 = document.getElementById('valor2');
const resultadoUsuario = document.getElementById('resultadoUsuario');
const placar = document.getElementById('placar');
const multiplicador = document.getElementById('multiplicador');
const tempo = document.getElementById('tempo');
const botaoEnviar = document.getElementById('botaoEnviar');

const num1 = document.getElementById('num1');
const num2 = document.getElementById('num2');
const num3 = document.getElementById('num3');
const num4 = document.getElementById('num4');
const num5 = document.getElementById('num5');
const num6 = document.getElementById('num6');
const num7 = document.getElementById('num7');
const num8 = document.getElementById('num8');
const num9 = document.getElementById('num9');
const num0 = document.getElementById('num0');
const backspace = document.getElementById('backspace');

num1.addEventListener('click', () => digitar(1));
num2.addEventListener('click', () => digitar(2));
num3.addEventListener('click', () => digitar(3));
num4.addEventListener('click', () => digitar(4));
num5.addEventListener('click', () => digitar(5));
num6.addEventListener('click', () => digitar(6));
num7.addEventListener('click', () => digitar(7));
num8.addEventListener('click', () => digitar(8));
num9.addEventListener('click', () => digitar(9));
num0.addEventListener('click', () => digitar(0));
backspace.addEventListener('click', () => digitar('x'));

const telaDerrota = document.getElementById('telaDerrota');
const retorno = document.getElementById('retorno');
const botaoJogarNovamente = document.getElementById('botaoJogarNovamente');
const botaoPararJogo = document.getElementById('botaoPararJogo');
const telaTriste = document.getElementById('telaTriste');

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
    if (!ehMobile) resultadoUsuario.focus();
    gerarConta();
}

let valorMax = 10;
function gerarConta() {
    let valorAleatorio1 = Math.round(Math.random() * valorMax);
    let valorAleatorio2 = Math.round(Math.random() * valorMax);
    resultadoCorreto = valorAleatorio1 * valorAleatorio2;

    valor1.innerText = valorAleatorio1;
    valor2.innerText = valorAleatorio2;
}

function digitar(i) {
    if (i === 'x') resultadoUsuario.value = resultadoUsuario.value.slice(0, -1);
    else resultadoUsuario.value += i;
}

function enviar() {
    if (Number(resultadoUsuario.value) === resultadoCorreto) {
        tempoRestante += 3;
        questaoAtual++;
        atualizarMultiplicador();
        atualizarPontos();
        resultadoUsuario.value = '';
        if (!ehMobile) resultadoUsuario.focus();
        gerarConta();
    } else {
        terminarPartida();
    }
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
    : `VOCE ERROU A CONTA ${valor1.innerText} x ${valor2.innerText}<br>`;

    if (primeiraPartida === true) {
        retorno.innerHTML += `PONTUACAO: ${pontos} PONTOS<br><br>`;
    } else {
        retorno.innerHTML += novoRecorde
        ? `PONTUACAO: ${pontos} PONTOS<br><span style="color: var(--amarelo);">NOVO RECORDE!</span><br><br>`
        : `PONTUACAO: ${pontos} PONTOS<br>RECORDE: ${recorde} PONTOS<br><br>`;
    }

    retorno.innerHTML += `DESEJA JOGAR NOVAMENTE?`;
    telaDerrota.style.display = 'block';

    botaoJogarNovamente.addEventListener('click', jogarNovamente);
    botaoPararJogo.addEventListener('click', pararJogo);
}

function jogarNovamente() {
    telaDerrota.style.display = 'none';
    retorno.innerHTML = '';

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
    if (!ehMobile) resultadoUsuario.focus();
    gerarConta();
}

function pararJogo() {
   telaTriste.style.display = 'block';
}

function ehMobile() {
    return "ontouchstart" in botaoIniciar;
}
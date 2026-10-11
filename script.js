
const API_KEY = "apresentacao";

// URL do servidor - NÃO ALTERAR
const API_URL = "https://weathermonitor-6b78.onrender.com";

// Controle das tabelas
const tabelasExpandidas = {
    dia: false,
    semana: false,
    mes: false
};

// Busca a última medição
async function buscarUltimo() {
    const resposta = await fetch(
        API_URL + "/measurements/latest",
        {
            headers: {
                "X-API-Key": API_KEY
            }
        }
    );

    if (!resposta.ok) {
        throw new Error("Erro ao buscar última medição: " + resposta.status);
    }

    const dados = await resposta.json();

    document.getElementById("ultimo").innerHTML = `
        <div class="card temperatura">
            <h3>Temperatura 🌡️</h3>
            <p>${dados.temperature}ºC</p>
        </div>

        <div class="card umidade">
            <h3>Umidade 💧</h3>
            <p>${dados.humidity}%</p>
        </div>

        <div class="card pressao">
            <h3>Pressão 🌬️</h3>
            <p>${dados.pressure} hPa</p>
        </div>

        <div class="card luminosidade">
            <h3>Luminosidade ☀️</h3>
            <p>${dados.luminosity}</p>
        </div>

        <div class="card chuva">
            <h3>Chuva 🌧️</h3>
            <p>${dados.raindrop}</p>
        </div>

        <div class="data-medicao">
            <p>Data: ${formatarData(dados.timestamp)}</p>
        </div>
    `;
}

// Busca as medições do dia
async function buscarDia(data) {
    let url = API_URL + "/measurements/day";

    if (data != null) {
        url += "?date=" + data;
    }

    const resposta = await fetch(url, {
        headers: {
            "X-API-Key": API_KEY
        }
    });

    if (!resposta.ok) {
        throw new Error("Erro ao buscar medições do dia: " + resposta.status);
    }

    const dados = await resposta.json();

    document.getElementById("dia").innerHTML = criarTabela(dados);

    tabelasExpandidas.dia = false;
    atualizarVisibilidade("dia", "botaoExpandirDia");
}

// Busca as medições da semana
async function buscarSemana(dataInicial) {
    const dataBase = new Date(dataInicial + "T12:00:00");
    const requisicoes = [];

    for (let i = 0; i < 7; i++) {
        const data = new Date(dataBase);
        data.setDate(dataBase.getDate() + i);

        const ano = data.getFullYear();
        const mes = String(data.getMonth() + 1).padStart(2, "0");
        const dia = String(data.getDate()).padStart(2, "0");

        const dataFormatada = `${ano}-${mes}-${dia}`;

        requisicoes.push(
            fetch(API_URL + "/measurements/day?date=" + dataFormatada, {
                headers: {
                    "X-API-Key": API_KEY
                }
            }).then(async resposta => {
                if (!resposta.ok) {
                    throw new Error("Erro ao consultar " + dataFormatada);
                }
                return resposta.json();
            })
        );
    }

    const resultados = await Promise.all(requisicoes);
    const dados = resultados.flat();

    dados.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    document.getElementById("semana").innerHTML = criarTabela(dados);

    tabelasExpandidas.semana = false;
    atualizarVisibilidade("semana", "botaoExpandirSemana");
}

// Busca as medições do mês
async function buscarMes(data) {
    let url = API_URL + "/measurements/month";

    if (data != null) {
        const [ano, mes] = data.split("-");

        if (!ano || !mes || ano.length !== 4 || mes.length !== 2) {
            alert("Formato inválido. Use YYYY-MM");
            return;
        }

        url += "?month=" + mes + "&year=" + ano;
    }

    const resposta = await fetch(url, {
        headers: {
            "X-API-Key": API_KEY
        }
    });

    if (!resposta.ok) {
        throw new Error("Erro ao buscar medições do mês: " + resposta.status);
    }

    const dados = await resposta.json();

    document.getElementById("mes").innerHTML = criarTabela(dados);

    tabelasExpandidas.mes = false;
    atualizarVisibilidade("mes", "botaoExpandirMes");
}

// Cria a tabela com os dados recebidos
function criarTabela(dados) {
    let tabela = `
        <table>
            <thead>
                <tr>
                    <th>Data</th>
                    <th>Temperatura</th>
                    <th>Umidade</th>
                    <th>Pressão</th>
                    <th>Luminosidade</th>
                    <th>Chuva</th>
                </tr>
            </thead>
            <tbody>
    `;

    dados.forEach(medicao => {
        tabela += `
            <tr>
                <td>${formatarData(medicao.timestamp)}</td>
                <td>${medicao.temperature} °C</td>
                <td>${medicao.humidity} %</td>
                <td>${medicao.pressure} hPa</td>
                <td>${medicao.luminosity}</td>
                <td>${medicao.raindrop}</td>
            </tr>
        `;
    });

    tabela += `
            </tbody>
        </table>
    `;

    return tabela;
}

// Formata a data para o padrão brasileiro
function formatarData(data) {
    return new Date(data).toLocaleString("pt-BR");
}

// Mostra 5 medições ou todas, conforme o botão
function atualizarVisibilidade(idTabela, idBotao) {
    const linhas = document.querySelectorAll(
        "#" + idTabela + " table tbody tr"
    );

    const botao = document.getElementById(idBotao);
    const expandida = tabelasExpandidas[idTabela];

    linhas.forEach((linha, indice) => {
        linha.style.display =
            expandida || indice < 5 ? "" : "none";
    });

    if (botao) {
        botao.textContent = expandida
            ? "Mostrar menos ▲"
            : "Ver todas as medições ▼";

        botao.style.display =
            linhas.length > 5 ? "block" : "none";
    }
}

// Configura os botões das três tabelas
function configurarBotao(idTabela, idBotao) {
    const botao = document.getElementById(idBotao);

    if (botao) {
        botao.addEventListener("click", function () {
            tabelasExpandidas[idTabela] =
                !tabelasExpandidas[idTabela];

            atualizarVisibilidade(idTabela, idBotao);
        });
    }
}

configurarBotao("dia", "botaoExpandirDia");
configurarBotao("semana", "botaoExpandirSemana");
configurarBotao("mes", "botaoExpandirMes");

// Testa a API no console
async function testarDadosAPI() {
    const resposta = await fetch(
        API_URL + "/measurements/day?date=2026-09-10",
        {
            headers: {
                "X-API-Key": API_KEY
            }
        }
    );

    if (!resposta.ok) {
        throw new Error("Erro ao consultar API: " + resposta.status);
    }

    const dados = await resposta.json();

    console.log("Dados recebidos da API:", dados);
}

// Consultar um dia escolhido
document.getElementById("consultarDia").addEventListener("click", async function () {
    const data = document.getElementById("dataDia").value;

    if (!data) {
        alert("Selecione uma data.");
        return;
    }

try {
    await buscarDia(data);
    await carregarDadosAPI(data);
} catch (erro) {
    console.error(erro);
    alert("Erro ao consultar o dia.");
}
});

// Consultar 7 dias a partir da data escolhida
document.getElementById("consultarSemana").addEventListener("click", async function () {
    const data = document.getElementById("dataSemana").value;

    if (!data) {
        alert("Selecione uma data inicial.");
        return;
    }

    try {
        await buscarSemana(data);
    } catch (erro) {
        console.error(erro);
        alert("Erro ao consultar a semana.");
    }
});

// Consultar um mês escolhido
document.getElementById("consultarMes").addEventListener("click", async function () {
    const mes = document.getElementById("dataMes").value;

    if (!mes) {
        alert("Selecione um mês.");
        return;
    }

    try {
        await buscarMes(mes);
    } catch (erro) {
        console.error(erro);
        alert("Erro ao consultar o mês.");
    }
});

// Carregamento inicial
buscarUltimo().catch(console.error);
buscarDia("2026-09-10").catch(console.error);
buscarSemana("2026-09-10").catch(console.error);
buscarMes("2026-09").catch(console.error);
testarDadosAPI().catch(console.error);


// ========================================
// CARROSSEL DE GRÁFICOS
// ========================================

const slidesGraficos = document.querySelectorAll(".slide-grafico");

const setaAnterior = document.getElementById("setaAnterior");
const setaProxima = document.getElementById("setaProxima");
const contadorGraficos = document.getElementById("contadorGraficos");

let graficoAtual = 0;

function mostrarGrafico(indice) {
    if (slidesGraficos.length === 0) return;

    slidesGraficos[graficoAtual].classList.remove("ativo");

    graficoAtual =
        (indice + slidesGraficos.length) % slidesGraficos.length;

    slidesGraficos[graficoAtual].classList.add("ativo");

    contadorGraficos.textContent =
        `${graficoAtual + 1} de ${slidesGraficos.length}`;

    // Ajusta o tamanho do Chart.js quando o gráfico aparece
    const canvas = slidesGraficos[graficoAtual].querySelector("canvas");

    if (canvas && typeof Chart !== "undefined") {
        const grafico = Chart.getChart(canvas);

        if (grafico) {
            grafico.resize();
        }
    }
}

if (setaAnterior && setaProxima) {
    setaAnterior.addEventListener("click", function () {
        mostrarGrafico(graficoAtual - 1);
    });

    setaProxima.addEventListener("click", function () {
        mostrarGrafico(graficoAtual + 1);
    });
}

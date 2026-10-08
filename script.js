//bota a sua chave da API aqui!!!
const API_KEY = "apresentacao";

//URL que busca do servidor, NÃO MUDE
const API_URL = "https://weathermonitor-6b78.onrender.com";

//funções que buscam os dados do servidor
//pega a ultima medição
async function buscarUltimo() {
    const resposta = await fetch(
        API_URL + "/measurements/latest",
        {
            headers: {
                "X-API-Key": API_KEY
            }
        }
    );
    const dados = await resposta.json();
    document.getElementById("ultimo").innerHTML = `
        <p>Temperatura: ${dados.temperature} °C</p>
        <p>Umidade: ${dados.humidity} %</p>
        <p>Pressão: ${dados.pressure} hPa</p>
        <p>Luminosidade: ${dados.luminosity}</p>
        <p>Chuva: ${dados.raindrop}</p>
        <p>Data: ${formatarData(dados.timestamp)}</p>
    `;
}

//pega a medição de um dia especifico/dia atual se não tiver parametro
//aceita o formato YYYY-MM-DD
async function buscarDia(data) {
    let url = API_URL + "/measurements/day";
    if (data != null) {
        url += "?date=" + data;
    }
    const resposta = await fetch(
        url,
        {
            headers: {
                "X-API-Key": API_KEY
            }
        }
    );
    const dados = await resposta.json();
    document.getElementById("dia").innerHTML =
        criarTabela(dados);
}

//pega a medição dos ultimos 7 dias
async function buscarSemana() {
    const resposta = await fetch(
        API_URL + "/measurements/week",
        {
            headers: {
                "X-API-Key": API_KEY
            }
        }
    );
    const dados = await resposta.json();
    document.getElementById("semana").innerHTML =
        criarTabela(dados);
}

//pega a medição de um mes especifico/ultimos 30dias se não tiver parametro
//recebe mes e ano no formato YYYY-MM
async function buscarMes(data) {
    let url = API_URL + "/measurements/month";
    if (data != null) {
        let [ano, mes] = data.split("-");
        if (ano.length != 4 || mes.length != 2) {
            alert("Formato invalido. Use YYYY-MM");
            return;
        }
        url += "?month=" + mes + "&year=" + ano;
    }
    const resposta = await fetch(
        url,
        {
            headers: {
                "X-API-Key": API_KEY
            }
        }
    );
    const dados = await resposta.json();
    document.getElementById("mes").innerHTML =
        criarTabela(dados);
}

//pode ser personalizado com id ou classes para estilizar a tabela
//exemplo: <th class="temp">Temperatura</th>,
//tbm serve pro td <td>${formatarData(medicao.timestamp)}</td> pode inserir id, classes, span, divs, etc
function criarTabela(dados) {
    let tabela = `
        <table>
            <tr>
                <th>Data</th>
                <th>Temperatura</th>
                <th>Umidade</th>
                <th>Pressão</th>
                <th>Luminosidade</th>
                <th>Chuva</th>
            </tr>
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
        </table>
    `;
    return tabela;
}

//formata a data para o padrao br DD/MM/YYYY HH:MM:SS
function formatarData(data) {
    return new Date(data).toLocaleString("pt-BR");
}

//chama as funções para buscar os dados do servidor
buscarUltimo();
//aceita formato YYYY-MM-DD
buscarDia("2026-09-10");
//por enquanto, busca apenas a ultima semana, mas dps vai receber parametro com a data final da semana
buscarSemana();
//aceita formato YYYY-MM
//buscarMes("2026-09");
buscarMes();

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
        throw new Error(
            "Erro ao consultar API: " + resposta.status
        );
    }

    const dados = await resposta.json();

    console.log("Dados recebidos da API:", dados);
}

testarDadosAPI().catch(console.error);
/*

Tecnologias:
- JavaScript
- Chart.js
- API REST

IMPORTANTE:
1. A URL e a chave da API estão no arquivo script.js.
2. O script.js deve ser carregado antes do dados.js.
3. Os gráficos utilizam a biblioteca Chart.js.
4. Os IDs dos gráficos devem existir no index.html

*/


let graficos = {};

async function carregarDadosAPI(dataSelecionada = "2026-09-10") {

    // Consulta as medições do banco pela API 
    const resposta = await fetch(
    API_URL + "/measurements/day?date=" + dataSelecionada,
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

    // Organiza as medições
    const datas = dados.map(medicao =>
        formatarData(medicao.timestamp)
    );
// Guarda as leituras de temperatura recebidas da API
    const temperaturas = dados.map(medicao =>
        medicao.temperature
    );

// Guarda as leituras de umidade recebidas da API
    const umidades = dados.map(medicao =>
        medicao.humidity
    );

    //leituras de pressão atmosférica recebidas da API
    const pressoes = dados.map(medicao =>
        medicao.pressure
    );

    // Guarda as leituras de luminosidade recebidas da API
    const luminosidades = dados.map(medicao => medicao.luminosity);

    // Guarda as leituras do sensor de chuva recebidas da API
    const chuvas = dados.map(medicao => medicao.raindrop);

    // Função para criar os gráficos
    function criarGrafico(id, titulo, valores, cor, unidade) {
        const canvas = document.getElementById(id);

        if (!canvas) {
            console.error("Gráfico não encontrado:", id);
            return;
        }

        // Remove o gráfico anterior para permitir uma nova consulta
        if (graficos[id]) {
            graficos[id].destroy();
}
        graficos[id] = new Chart(canvas, {
            type: "line",
            data: {
                labels: datas,
                datasets: [{
                    label: titulo,
                    data: valores,
                    borderColor: cor,
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        title: {
                            display: true,
                            text: unidade
                        }
                    }
                }
            }
        });
    }

    // Gráfico de temperatura
    criarGrafico(
        "graficoTemperatura",
        "Temperatura (°C)",
        temperaturas,
        "blue",
        "Temperatura (°C)"
    );

    // Gráfico de umidade
    criarGrafico(
        "graficoUmidade",
        "Umidade (%)",
        umidades,
        "green",
        "Umidade (%)"
    );

    // Gráfico de pressão
    criarGrafico(
        "graficoPressao",
        "Pressão Atmosférica (hPa)",
        pressoes,
        "purple",
        "Pressão (hPa)"
    );

    // Gráfico de luminosidade
    criarGrafico(
        "graficoLuminosidade",
        "Luminosidade (lux)",
        luminosidades,
        "orange",
        "Luminosidade (lux)"
    );

    // gráfico com as leituras do sensor de chuva
    criarGrafico(
        "graficoChuva",
        "Leituras do Sensor de Chuva",
        chuvas,
         "blue",
        "Leitura do sensor"
    );
}

carregarDadosAPI().catch(console.error);


 // Encontra o botão Consultar no HTML
const botaoConsultar = document.getElementById("botaoConsultar");

// Detecta quando o usuário clica no botão
botaoConsultar.addEventListener("click", async function() {

    // Obtém a data escolhida pelo usuário
    const data = document.getElementById("dataConsulta").value;

    // Verifica se alguma data foi selecionada
    if (!data) {
        alert("Selecione uma data para consultar.");
        return;
    }

    try {
        // Atualiza os cinco gráficos
        await carregarDadosAPI(data);

        // Atualiza a tabela de medições do dia
        await buscarDia(data);

    } catch (erro) {
        console.error("Erro ao consultar:", erro);
        alert("Não foi possível consultar os dados.");
    }
});

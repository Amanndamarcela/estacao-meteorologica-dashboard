
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

    const temperaturas = dados.map(medicao =>
        medicao.temperature
    );

    const umidades = dados.map(medicao =>
        medicao.humidity
    );

    const pressoes = dados.map(medicao =>
        medicao.pressure
    );

    // Função para criar os gráficos
    function criarGrafico(id, titulo, valores, cor, unidade) {
        const canvas = document.getElementById(id);

        if (!canvas) {
            console.error("Gráfico não encontrado:", id);
            return;
        }

        new Chart(canvas, {
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
}

carregarDadosAPI().catch(console.error);

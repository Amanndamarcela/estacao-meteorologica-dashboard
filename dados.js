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

    // para evitar erros caso não haja medições para a data selecionada
if (dados.length === 0) {
    document.getElementById("condicaoMeteorologica").innerHTML =
    "<p>Nenhuma medição encontrada para esta data.</p>";

    document.getElementById("resumoTemperatura").innerHTML =
        "<p>Nenhuma medição encontrada para esta data.</p>";

    Object.values(graficos).forEach(grafico => {
        grafico.destroy();
    });

    graficos = {};
    return;
}

    // Organiza as medições
    const datas = dados.map(medicao =>
        formatarData(medicao.timestamp)
    );
// Guarda as leituras de temperatura recebidas da API
    const temperaturas = dados.map(medicao =>
        medicao.temperature
    );
    // Calcula a maior temperatura registrada
    const temperaturaMaxima = Math.max(...temperaturas);

    // Calcula a menor temperatura registrada
    const temperaturaMinima = Math.min(...temperaturas);

    console.log("Temperatura máxima:", temperaturaMaxima);
    console.log("Temperatura mínima:", temperaturaMinima);

    const soma = temperaturas.reduce((acumulador, temperatura) => {
    return acumulador + temperatura;
}, 0);
    const media = soma / temperaturas.length;
    console.log("Temperatura média:", media.toFixed(2));
    document.getElementById("resumoTemperatura").innerHTML = `

    <div class="resumo">

    <div class="card temp-maxima">
        <h3>🌡️ Temperatura Máxima</h3>
        <p>${temperaturaMaxima.toFixed(2)} °C</p>
    </div>

    <div class="card temp-minima">
        <h3>🌡️ Temperatura Mínima</h3>
        <p>${temperaturaMinima.toFixed(2)} °C</p>
    </div>

    <div class="card temp-media">
        <h3>🌡️ Temperatura Média</h3>
        <p>${media.toFixed(2)} °C</p>
    </div>
</div>

`;

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

    console.log("Valores de luminosidade:", luminosidades);
    console.log("Valores de chuva:", dados.map(medicao => medicao.raindrop));

    // Guarda as leituras do sensor de chuva recebidas da API
    const chuvas = dados.map(medicao => medicao.raindrop);

    // Obtém a última medição recebida
    const ultimaMedicao = dados[dados.length - 1];

    // Obtém o valor do sensor de chuva
    const valorChuva = ultimaMedicao.raindrop;

    // Formata a data e o horário da medição
    const horarioMedicao = formatarData(ultimaMedicao.timestamp);

    // Define o ícone e a descrição
    let iconeClima;
    let descricaoClima;

if (valorChuva < 4095) {
    iconeClima = "🌧️";
    descricaoClima = "Possível presença de água no sensor";
} else {
    iconeClima = "☀️";
    descricaoClima = "Sem indicação de água no sensor";
}

// Atualiza a seção meteorológica
document.getElementById("condicaoMeteorologica").innerHTML = `
    <div class="clima-card">
        <div class="clima-icone">${iconeClima}</div>
        <h3>${descricaoClima}</h3>
        <p>Leitura do sensor: ${valorChuva}</p>
        <p>🕒 Medição registrada em: ${horarioMedicao}</p>
    </div>
`;

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

// Cria o gráfico com os dados fornecidos e as opções de configuração
        graficos[id] = new Chart(canvas, {
            type: "line",
            data: {
                labels: datas,
                datasets: [{
                    label: titulo,
                    data: valores,
                    borderColor: cor,
                    backgroundColor: cor,
                    borderWidth: 2,
                    tension: 0.3,
                    pointRadius: 3,
                    pointHoverRadius: 7,
                    pointBackgroundColor: cor,
                    pointBorderColor: "#ffffff",
                    pointBorderWidth: 2
}]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
    tooltip: {
        callbacks: {
            label: function(context) {
                const valor = context.parsed.y.toFixed(2);

                return titulo + ": " + valor.replace(".", ",");
            }
        }
    }
},
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


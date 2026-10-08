
/*
=========================================================
DASHBOARD - ESTAÇÃO METEOROLÓGICA
Arquivo: dados.js

Objetivo:
Consultar as medições da estação meteorológica física
por meio da API e apresentar os dados em gráficos.

Tecnologias:
- JavaScript
- Chart.js
- API REST

IMPORTANTE:
1. A URL e a chave da API estão no arquivo script.js.
2. O script.js deve ser carregado antes do dados.js.
3. Os gráficos utilizam a biblioteca Chart.js.
4. Os IDs dos gráficos devem existir no index.html
=========================================================
*/


// =======================================================
// 1. ARMAZENAMENTO DOS GRÁFICOS
// =======================================================

// Guarda as instâncias dos gráficos criados pelo Chart.js.
// Isso permite destruir o gráfico anterior antes de criar
// outro, evitando gráficos duplicados ao mudar a data.

let graficos = {};


// =======================================================
// 2. CONSULTA DOS DADOS NA API
// =======================================================

// Recebe uma data no formato YYYY-MM-DD.
// Caso nenhuma data seja informada, utiliza 10/09/2026,
// uma data que já sabemos que possui registros.

async function carregarDadosAPI(dataSelecionada = "2026-09-10") {

    // Monta a URL de consulta para o dia selecionado.
    // O endpoint /measurements/day retorna as medições
    // armazenadas no banco para a data informada.

    const url = API_URL + "/measurements/day?date="
        + encodeURIComponent(dataSelecionada);

    // Faz a requisição HTTP para a API.
    // A chave de acesso é definida no script.js.

    const resposta = await fetch(url, {
        headers: {
            "X-API-Key": API_KEY
        }
    });

    // Verifica se o servidor respondeu corretamente.
    // Se houver erro, interrompe a execução.

    if (!resposta.ok) {
        throw new Error(
            "Erro ao consultar API: " + resposta.status
        );
    }

    // Converte a resposta JSON em um array de medições.

    const dados = await resposta.json();

    // Verifica se existem registros para a data escolhida.

    if (!Array.isArray(dados) || dados.length === 0) {
        alert("Não existem medições para a data selecionada.");

        // Remove os gráficos anteriores para não exibir
        // dados de outra data como se fossem atuais.
        Object.values(graficos).forEach(grafico => {
            grafico.destroy();
        });

        graficos = {};
        return;
    }


    // ===================================================
    // 3. ORGANIZAÇÃO DOS DADOS
    // ===================================================

    // O método map() percorre as medições recebidas
    // e cria uma lista para cada variável meteorológica.

    // Datas e horários das medições.
    const datas = dados.map(medicao =>
        formatarData(medicao.timestamp)
    );

    // Valores de temperatura em graus Celsius.
    const temperaturas = dados.map(medicao =>
        medicao.temperature
    );

    // Valores de umidade relativa em porcentagem.
    const umidades = dados.map(medicao =>
        medicao.humidity
    );

    // Valores de pressão atmosférica em hPa.
    const pressoes = dados.map(medicao =>
        medicao.pressure
    );


    // ===================================================
    // 4. FUNÇÃO PARA CRIAR OS GRÁFICOS
    // ===================================================

    // Esta função é reutilizada para diferentes sensores.
    //
    // Parâmetros:
    // id      = ID do canvas no index.html
    // titulo  = Nome exibido na legenda
    // valores = Lista de medições
    // cor     = Cor da linha
    // unidade = Identificação do eixo vertical

    function criarGrafico(id, titulo, valores, cor, unidade) {

        // Localiza o elemento canvas no HTML.
        const canvas = document.getElementById(id);

        // Verifica se o elemento existe.
        if (!canvas) {
            console.error("Gráfico não encontrado:", id);
            return;
        }

        // Destrói o gráfico anterior, caso exista.
        // Necessário para atualizar ao consultar outra data.
        if (graficos[id]) {
            graficos[id].destroy();
        }

        // Cria o gráfico utilizando Chart.js.
        graficos[id] = new Chart(canvas, {

            // Gráfico de linhas.
            type: "line",

            data: {

                // Datas apresentadas no eixo horizontal.
                labels: datas,

                datasets: [{
                    label: titulo,
                    data: valores,
                    borderColor: cor,

                    // Suaviza as linhas entre os pontos.
                    tension: 0.3
                }]
            },

            options: {

                // Ajusta o gráfico ao tamanho da tela.
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


    // ===================================================
    // 5. GRÁFICOS DOS SENSORES
    // ===================================================

    // TEMPERATURA
    criarGrafico(
        "graficoTemperatura",
        "Temperatura (°C)",
        temperaturas,
        "blue",
        "Temperatura (°C)"
    );

    // UMIDADE
    criarGrafico(
        "graficoUmidade",
        "Umidade (%)",
        umidades,
        "green",
        "Umidade (%)"
    );

    // PRESSÃO ATMOSFÉRICA
    criarGrafico(
        "graficoPressao",
        "Pressão Atmosférica (hPa)",
        pressoes,
        "purple",
        "Pressão (hPa)"
    );

}


// =======================================================
// 6. CARREGAMENTO INICIAL
// =======================================================

// Ao abrir o dashboard, consulta a data inicial
// configurada no campo de seleção do HTML.

const campoData = document.getElementById("dataConsulta");

const dataInicial = campoData?.value || "2026-09-10";

carregarDadosAPI(dataInicial).catch(erro => {
    console.error("Erro ao carregar os gráficos:", erro);
});


// =======================================================
// 7. FILTRO DE DATAS
// =======================================================

// Localiza o botão Consultar no index.html.
const botaoConsultar = document.getElementById(
    "botaoConsultar"
);

// Verifica se o botão existe antes de adicionar o evento.
if (botaoConsultar) {

    // O evento click é executado quando o usuário
    // pressiona o botão Consultar.

    botaoConsultar.addEventListener("click", async function () {

        // Obtém a data selecionada no calendário.
        const data = document.getElementById(
            "dataConsulta"
        ).value;

        // Impede a consulta sem uma data.
        if (!data) {
            alert("Selecione uma data!");
            return;
        }

        try {
            // Busca as medições da data escolhida
            // e atualiza os três gráficos.
            await carregarDadosAPI(data);

        } catch (erro) {

            // Exibe o erro no Console para ajudar
            // a equipe a identificar problemas.
            console.error("Erro ao consultar os dados:", erro);

            alert("Erro ao consultar os dados da estação.");
        }
    });
}

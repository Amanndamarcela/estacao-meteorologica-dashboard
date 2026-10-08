# Dashboard de Estação Meteorológica

## Sobre o projeto

Este projeto tem como objetivo desenvolver um dashboard para visualização e análise de dados meteorológicos coletados por uma estação física.

O desenvolvimento também inclui uma simulação de estação meteorológica utilizando a plataforma Wokwi, permitindo demonstrar virtualmente o funcionamento dos sensores.

## Tecnologias utilizadas

- **HTML:** estrutura do dashboard.
- **CSS:** estilização da interface.
- **JavaScript:** consultas à API e processamento dos dados.
- **Chart.js:** criação de gráficos meteorológicos.
- **Wokwi:** simulação da estação meteorológica.
- **GitHub:** versionamento e colaboração no desenvolvimento.

## Funcionalidades

- Consulta à última medição registrada.
- Visualização das medições diárias, semanais e mensais.
- Gráfico de temperatura.
- Gráfico de umidade.
- Gráfico de pressão atmosférica.
- Integração com a API da estação meteorológica física.
- Consulta de dados históricos.

## Estrutura do projeto

```text
frontend/
├── index.html
├── style.css
├── script.js
├── dados.js
├── dados_estacao_meteorologica_set_out_2026.csv
└── README.md
```

## Como executar

1. Clone o repositório no computador.
2. Abra a pasta do projeto no VS Code.
3. Instale a extensão Live Server, caso ainda não esteja instalada.
4. Abra o arquivo `index.html` utilizando o Live Server.
5. O dashboard será exibido no navegador.

A consulta à API depende de conexão com a internet e de autorização de acesso.

## Organização do projeto

A estação meteorológica física foi desenvolvida por outra turma e fornece os dados armazenados no banco de dados.

A simulação no Wokwi foi desenvolvida como parte das atividades da equipe atual e funciona independentemente do banco.

O dashboard consulta os registros da estação física por meio de uma API.

## Status do desenvolvimento

Projeto em desenvolvimento. A estrutura inicial do dashboard, as consultas à API e os gráficos de temperatura, umidade e pressão atmosférica já foram implementados.

As próximas etapas incluem filtros de consulta e melhorias na interface.
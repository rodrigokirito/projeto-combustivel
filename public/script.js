const botao = document.getElementById("consultar");
const tabela = document.getElementById("tabela-coletas");

const linkMenorMaior = document.getElementById("menor-maior");
const linkPrecoMedio = document.getElementById("preco-medio");
const linkPrecoRecente = document.getElementById("preco-recente");
const linkEvolucao = document.getElementById("evolucao");

const resultado = document.getElementById("resultado-menor-maior");

botao.addEventListener("click", function() {

    fetch("/coletas")
        .then(function(resposta) {
            return resposta.json();
        })
        .then(function(coletas) {

            tabela.innerHTML = "";

            coletas.forEach(function(coleta) {

                const linha = document.createElement("tr");

                const data = new Date(coleta.data_coleta);

                const dataFormatada = data.toLocaleDateString("pt-BR", {
                    timeZone: "UTC"
                });

                linha.innerHTML = `
                    <td>${coleta.posto}</td>
                    <td>${coleta.combustivel}</td>
                    <td>R$ ${Number(coleta.preco).toFixed(2)}</td>
                    <td>${dataFormatada}</td>
                `;

                tabela.appendChild(linha);
            });

        })
        .catch(function(erro) {
            console.error("Erro ao buscar os dados:", erro);
        });

});

linkMenorMaior.addEventListener("click", function(event) {

    event.preventDefault();

    fetch("/menor-maior")
        .then(function(resposta) {
            return resposta.json();
        })
        .then(function(dados) {

            resultado.innerHTML = `
                <h2>Menor e Maior preço</h2>

                <table>
                    <tr>
                        <th>Combustível</th>
                        <th>Tipo</th>
                        <th>Posto</th>
                        <th>Endereço</th>
                        <th>Bairro</th>
                        <th>Preço</th>
                        <th>Data</th>
                    </tr>

                    ${dados.map(function(item) {
                        return `
                            <tr>
                                <td>${item.combustivel}</td>
                                <td>${item.tipo_preco}</td>
                                <td>${item.posto}</td>
                                <td>${item.endereco}</td>
                                <td>${item.bairro}</td>
                                <td>R$ ${Number(item.preco).toFixed(2)}</td>
                                <td>${item.data}</td>
                            </tr>
                        `;
                    }).join("")}
                </table>

                <br>

                <button id="voltar-menor-maior">← Voltar</button>
            `;

            document.getElementById("voltar-menor-maior").addEventListener("click", function() {
                resultado.innerHTML = "";
            });

        })
        .catch(function(erro) {
            console.error("Erro ao buscar menor e maior preço:", erro);
        });

});

linkPrecoMedio.addEventListener("click", function(event) {

    event.preventDefault();

    fetch("/preco-medio")
        .then(function(resposta) {
            return resposta.json();
        })
        .then(function(dados) {

            resultado.innerHTML = `
                <h2>Preço médio</h2>

                <table>
                    <tr>
                        <th>Posto</th>
                        <th>Bairro</th>
                        <th>Combustível</th>
                        <th>Preço médio</th>
                        <th>Quantidade de coletas</th>
                    </tr>

                    ${dados.map(function(item) {
                        return `
                            <tr>
                                <td>${item.posto}</td>
                                <td>${item.bairro}</td>
                                <td>${item.combustivel}</td>
                                <td>R$ ${Number(item.preco_medio).toFixed(2)}</td>
                                <td>${item.quantidade_coletas}</td>
                            </tr>
                        `;
                    }).join("")}
                </table>

                <br>

                <button id="voltar-preco-medio">← Voltar</button>
            `;

            document.getElementById("voltar-preco-medio").addEventListener("click", function() {
                resultado.innerHTML = "";
            });

        })
        .catch(function(erro) {
            console.error("Erro ao buscar preço médio:", erro);
        });

});

linkPrecoRecente.addEventListener("click", function(event) {

    event.preventDefault();

    fetch("/preco-recente")
        .then(function(resposta) {
            return resposta.json();
        })
        .then(function(dados) {

            resultado.innerHTML = `
                <h2>Preço mais recente</h2>

                <table>
                    <tr>
                        <th>Posto</th>
                        <th>Endereço</th>
                        <th>Bairro</th>
                        <th>Combustível</th>
                        <th>Preço</th>
                        <th>Data</th>
                    </tr>

                    ${dados.map(function(item) {
                        return `
                            <tr>
                                <td>${item.posto}</td>
                                <td>${item.endereco}</td>
                                <td>${item.bairro}</td>
                                <td>${item.combustivel}</td>
                                <td>R$ ${Number(item.preco).toFixed(2)}</td>
                                <td>${item.data}</td>
                            </tr>
                        `;
                    }).join("")}
                </table>

                <br>

                <button id="voltar-preco-recente">← Voltar</button>
            `;

            document.getElementById("voltar-preco-recente").addEventListener("click", function() {
                resultado.innerHTML = "";
            });

        })
        .catch(function(erro) {
            console.error("Erro ao buscar preço mais recente:", erro);
        });

});

linkEvolucao.addEventListener("click", function(event) {

    event.preventDefault();

    resultado.innerHTML = `
        <h2>Evolução dos preços</h2>

        <label for="combustivel-evolucao">
            Escolha o combustível:
        </label>

        <select id="combustivel-evolucao">
            <option value="Gasolina">Gasolina</option>
            <option value="Gasolina aditivada">Gasolina aditivada</option>
            <option value="Etanol">Etanol</option>
            <option value="Diesel">Diesel</option>
        </select>

        <div style="width: 100%; max-width: 900px; margin: 30px auto;">
            <canvas id="grafico-evolucao"></canvas>
        </div>

        <div id="tabela-evolucao"></div>

        <button id="voltar-evolucao">← Voltar</button>
    `;

    const selectCombustivel = document.getElementById("combustivel-evolucao");

    function carregarEvolucao(combustivel) {

        fetch(`/evolucao?combustivel=${encodeURIComponent(combustivel)}`)
            .then(function(resposta) {
                return resposta.json();
            })
            .then(function(dados) {

                const tabelaEvolucao = document.getElementById("tabela-evolucao");

                tabelaEvolucao.innerHTML = `
                    <table>
                        <tr>
                            <th>Posto</th>
                            <th>Bairro</th>
                            <th>Combustível</th>
                            <th>Preço</th>
                            <th>Data</th>
                        </tr>

                        ${dados.map(function(item) {
                            return `
                                <tr>
                                    <td>${item.posto}</td>
                                    <td>${item.bairro}</td>
                                    <td>${item.combustivel}</td>
                                    <td>R$ ${Number(item.preco).toFixed(2)}</td>
                                    <td>${item.data}</td>
                                </tr>
                            `;
                        }).join("")}
                    </table>
                `;

                const dadosPorPosto = {};

                dados.forEach(function(item) {

                    if (!dadosPorPosto[item.posto]) {
                        dadosPorPosto[item.posto] = [];
                    }

                    dadosPorPosto[item.posto].push({
                        data: item.data,
                        preco: Number(item.preco)
                    });

                });

                const labels = [...new Set(
                    dados.map(function(item) {
                        return item.data;
                    })
                )];

                const conjuntos = Object.keys(dadosPorPosto).map(function(posto) {

                    return {
                        label: posto,
                        data: labels.map(function(data) {

                            const registro = dadosPorPosto[posto].find(function(item) {
                                return item.data === data;
                            });

                            return registro ? registro.preco : null;
                        }),
                        tension: 0.3
                    };

                });

                const canvas = document.getElementById("grafico-evolucao");

                if (window.graficoEvolucao) {
                    window.graficoEvolucao.destroy();
                }

                window.graficoEvolucao = new Chart(canvas, {
                    type: "line",

                    data: {
                        labels: labels,
                        datasets: conjuntos
                    },

                    options: {
                        responsive: true,

                        plugins: {
                            title: {
                                display: true,
                                text: `Evolução do preço — ${combustivel}`
                            }
                        },

                        scales: {
                            y: {
                                beginAtZero: false,

                                title: {
                                    display: true,
                                    text: "Preço (R$)"
                                }
                            },

                            x: {
                                title: {
                                    display: true,
                                    text: "Data"
                                }
                            }
                        }
                    }
                });

            })
            .catch(function(erro) {
                console.error("Erro ao buscar evolução dos preços:", erro);
            });
    }

    carregarEvolucao(selectCombustivel.value);

    selectCombustivel.addEventListener("change", function() {

        carregarEvolucao(this.value);

    });

    document.getElementById("voltar-evolucao").addEventListener("click", function() {

        resultado.innerHTML = "";

    });

});
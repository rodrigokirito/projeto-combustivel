const express = require("express");
const app = express();
const mysql = require("mysql2");

app.use(express.static("public"));

const conexao = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Rx87@6939",
    database: "projeto_combustiveis"
});

conexao.connect((erro) => {
    if (erro) {
        console.error("Erro ao conectar ao MySQL:", erro);
        return;
    }

    console.log("Conectado ao MySQL com sucesso!");
});


// Página inicial
app.get("/", function(req, res) {
    res.send("API da Pesquisa de Combustíveis funcionando!");
});


// Todas as coletas
app.get("/coletas", function(req, res) {

    const sql = `
        SELECT
            posto.nome AS posto,
            combustivel.tipo AS combustivel,
            coleta.preco,
            coleta.data_coleta
        FROM coleta
        INNER JOIN posto
            ON coleta.id_posto = posto.id_posto
        INNER JOIN combustivel
            ON coleta.id_combustivel = combustivel.id_combustivel
        ORDER BY coleta.data_coleta ASC
    `;

    conexao.query(sql, function(erro, resultados) {

        if (erro) {
            console.error("Erro na consulta:", erro);

            return res.status(500).json({
                erro: "Erro ao consultar o banco"
            });
        }

        res.json(resultados);
    });

});


// Menor e maior preço
app.get("/menor-maior", function(req, res) {

    const sql = `
        SELECT
            posto.nome AS posto,
            CONCAT(
                posto.logradouro,
                ', ',
                posto.numero
            ) AS endereco,
            posto.bairro AS bairro,
            combustivel.tipo AS combustivel,
            coleta.preco,
            DATE_FORMAT(coleta.data_coleta, '%d/%m/%Y') AS data,
            CASE
                WHEN coleta.preco = (
                    SELECT MIN(c2.preco)
                    FROM coleta c2
                    WHERE c2.id_combustivel = coleta.id_combustivel
                )
                THEN 'Menor preço'
                ELSE 'Maior preço'
            END AS tipo_preco
        FROM coleta
        INNER JOIN posto
            ON coleta.id_posto = posto.id_posto
        INNER JOIN combustivel
            ON coleta.id_combustivel = combustivel.id_combustivel
        WHERE coleta.preco = (
            SELECT MIN(c2.preco)
            FROM coleta c2
            WHERE c2.id_combustivel = coleta.id_combustivel
        )
        OR coleta.preco = (
            SELECT MAX(c3.preco)
            FROM coleta c3
            WHERE c3.id_combustivel = coleta.id_combustivel
        )
        ORDER BY combustivel.tipo, coleta.preco ASC
    `;

    conexao.query(sql, function(erro, resultados) {

        if (erro) {
            console.error("Erro na consulta:", erro);

            return res.status(500).json({
                erro: "Erro ao consultar os preços"
            });
        }

        res.json(resultados);
    });

});

// Preço médio
app.get("/preco-medio", function(req, res) {

    const sql = `
        SELECT
            posto.nome AS posto,
            posto.bairro AS bairro,
            combustivel.tipo AS combustivel,
            ROUND(AVG(coleta.preco), 2) AS preco_medio,
            COUNT(coleta.id_coleta) AS quantidade_coletas
        FROM coleta
        INNER JOIN posto
            ON coleta.id_posto = posto.id_posto
        INNER JOIN combustivel
            ON coleta.id_combustivel = combustivel.id_combustivel
        GROUP BY
            posto.nome,
            posto.bairro,
            combustivel.tipo
        ORDER BY
            posto.nome,
            combustivel.tipo
    `;

    conexao.query(sql, function(erro, resultados) {

        if (erro) {
            console.error("Erro na consulta:", erro);

            return res.status(500).json({
                erro: "Erro ao consultar o preço médio"
            });
        }

        res.json(resultados);
    });

});


// Preço mais recente
app.get("/preco-recente", function(req, res) {

    const sql = `
        SELECT
            posto.nome AS posto,
            CONCAT(
                posto.logradouro,
                ', ',
                posto.numero
            ) AS endereco,
            posto.bairro AS bairro,
            combustivel.tipo AS combustivel,
            coleta.preco,
            DATE_FORMAT(coleta.data_coleta, '%d/%m/%Y') AS data
        FROM coleta
        INNER JOIN posto
            ON coleta.id_posto = posto.id_posto
        INNER JOIN combustivel
            ON coleta.id_combustivel = combustivel.id_combustivel
        WHERE coleta.data_coleta = (
            SELECT MAX(c2.data_coleta)
            FROM coleta c2
            WHERE c2.id_posto = coleta.id_posto
              AND c2.id_combustivel = coleta.id_combustivel
        )
        ORDER BY posto.nome, combustivel.tipo
    `;

    conexao.query(sql, function(erro, resultados) {

        if (erro) {
            console.error("Erro na consulta:", erro);

            return res.status(500).json({
                erro: "Erro ao consultar preço mais recente"
            });
        }

        res.json(resultados);
    });

});

// Evolução dos preços
app.get("/evolucao", function(req, res) {

    const combustivel = req.query.combustivel;

    if (!combustivel) {
        return res.status(400).json({
            erro: "Informe o combustível"
        });
    }

    const sql = `
        SELECT
            posto.nome AS posto,
            posto.bairro AS bairro,
            combustivel.tipo AS combustivel,
            coleta.preco,
            DATE_FORMAT(coleta.data_coleta, '%d/%m/%Y') AS data
        FROM coleta
        INNER JOIN posto
            ON coleta.id_posto = posto.id_posto
        INNER JOIN combustivel
            ON coleta.id_combustivel = combustivel.id_combustivel
        WHERE combustivel.tipo = ?
        ORDER BY coleta.data_coleta ASC
    `;

    conexao.query(sql, [combustivel], function(erro, resultados) {

        if (erro) {
            console.error("Erro na consulta:", erro);

            return res.status(500).json({
                erro: "Erro ao consultar evolução dos preços"
            });
        }

        res.json(resultados);
    });

});


// Iniciar servidor
app.listen(3000, function() {
    console.log("Servidor funcionando na porta 3000");
});
const express = require('express');
const os = require('os');
const mysql = require('mysql2');

const app = express();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'achilesDB',
  port: process.env.DB_PORT || 3306
};

// Conexão sem especificar o banco de dados para criar o banco se não existir
const connection = mysql.createConnection({
  host: dbConfig.host,
  user: dbConfig.user,
  password: dbConfig.password,
  port: dbConfig.port
});

// Verifica e cria o banco de dados se não existir
connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\`;`, (err) => {
  if (err) {
    console.error('Erro ao criar banco de dados:', err);
    return;
  }

  console.log(`Banco de dados "${dbConfig.database}" pronto para uso.`);

  // Conecta ao banco de dados específico
  connection.changeUser({ database: dbConfig.database }, (err) => {
    if (err) {
      console.error('Erro ao conectar ao banco de dados:', err);
      return;
    }

    console.log('Conectado ao banco de dados com sucesso!');

    // Rota para consulta de dados
    app.get('/consulta-dados', (req, res) => {
      const createTableSql = `
        CREATE TABLE IF NOT EXISTS aluno (
          id INT AUTO_INCREMENT PRIMARY KEY,
          nome VARCHAR(255) NOT NULL,
          idade INT NOT NULL
        );
      `;

      const insertDataSql = `
        INSERT INTO aluno (nome, idade)
        VALUES ('João', 20), ('Maria', 22), ('José', 21)
        ON DUPLICATE KEY UPDATE nome=VALUES(nome), idade=VALUES(idade);
      `;

      const selectDataSql = `SELECT * FROM aluno;`;

      connection.query(createTableSql, (err, results) => {
        if (err) {
          console.error('Erro ao criar tabela:', err);
          return res.status(500).json({ error: 'Erro ao criar tabela' });
        }

        connection.query(insertDataSql, (err, results) => {
          if (err) {
            console.error('Erro ao inserir dados:', err);
            return res.status(500).json({ error: 'Erro ao inserir dados' });
          }

          connection.query(selectDataSql, (err, results) => {
            if (err) {
              console.error('Erro ao consultar dados:', err);
              return res.status(500).json({ error: 'Erro ao consultar dados' });
            }

            res.status(200).json(results);
          });
        });
      });
    });

    // Outras rotas
    app.get('/', (req, res) => {
      res.status(200).json({
        message: "ON",
      });
    });

    app.get('/liveness', (req, res) => {
      res.status(200).json({
        message: "Meu servidor está vivo!",
        path: process.cwd(),
        gid: process.getgid ? process.getgid() : null,
        uid: process.getuid ? process.getuid() : null,
        date: new Date().getTime()
      });
    });

    app.get('/readiness', (req, res) => {
      res.status(200).json({
        message: "Meu servidor está pronto para receber requisições!",
        platform: os.platform(),
        freemem: os.freemem(),
        homedir: os.homedir(),
        date: new Date().getTime()
      });
    });

    // Inicia o servidor após configurar todas as rotas
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  });
});

module.exports = app;
const express = require('express');
const countries = require('./routes/countries'); // Corrigir o caminho para o arquivo de rotas

const app = express();
const port = 8082;

app.get("/", (req, res) => {
    res.send({ message: 'Hello World' });
});

// Usar o prefixo de versão v1 para as rotas
app.use("/v1", countries);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

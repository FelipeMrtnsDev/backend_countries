const express = require('express');
const countries = require('./routes/countries');

const app = express();
const port = 8082;

app.get("/", (req, res) => {
    res.send({ message: 'Hello World' });
});

app.use("/v1", countries);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: 'application/json' }));
app.use(function(req, res, next) {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    if (req.method === "OPTIONS") {
        res.send(200);
    }
    next();
});

app.get("/", function(req, res) {
    res.send("API Receitas Dona Armênia");
});

app.get("/v1/receitas", function(req, res) {
    const jsonReceitas = fs.readFileSync("./receitas.json", "utf-8");
    res.send(jsonReceitas);
});

app.get("/v1/mensagens-enviadas", function(req, res) {
    const jsonMensagens = fs.readFileSync("./mensagens.json", "utf-8");
    res.send(jsonMensagens);
});

app.post("/v1/envio-mensagem", function(req, res) {
    try {
        const dadosEnviados = req.body;
        console.log(dadosEnviados);
        if (dadosEnviados)
        {
            if (!dadosEnviados.nome) throw new Error("Nome é obrigatório!");
            if (!dadosEnviados.email) throw new Error("E-mail é obrigatório!");
            if (!dadosEnviados.telefone) throw new Error("Telefone é obrigatório!");
            if (!dadosEnviados.dataNascimento) throw new Error("Data de Nascimento é obrigatória!");
            if (!dadosEnviados.idade) throw new Error("Idade é obrigatória!");
            if (!dadosEnviados.assunto) throw new Error("Assunto é obrigatório!");
            if (!dadosEnviados.mensagem) throw new Error("Mensagem é obrigatório!");

            const jsonMensagens = fs.readFileSync("./mensagens.json", "utf-8");
            const listaMensagensEnviadas = JSON.parse(jsonMensagens);
            listaMensagensEnviadas.push(dadosEnviados);
            fs.writeFileSync("./mensagens.json", JSON.stringify(listaMensagensEnviadas, null, 4), "utf-8");
            res.json({ status: 1, message: "Mensagem registrada com sucesso!" });
        }
        else
        {
            throw new Error("Não foi possível enviar sua mensagem!");
        }
    }
    catch(e) {
        res.json({ status: 0, message: e.message });
    }
});

app.listen(PORT, () => console.log(`Servidor da API rodando em http://localhost:${PORT}`));
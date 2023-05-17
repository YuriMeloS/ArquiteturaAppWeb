var app = require('http').createServer(resposta);
var fs = require('fs');
var io = require('socket.io')(app);
var app = require('http').createServer(resposta);
var fs = require('fs');
app.listen(3000);
console.log("Aplicação está em execução...");
var usuarios = [];
var ultimas_mensagens = [];

function armazenaMensagem(mensagem) {
    if (ultimas_mensagens.length > 5) {
        ultimas_mensagens.shift();
    }

    ultimas_mensagens.push(mensagem);
}


function resposta(req, res) {
    var arquivo = "";
    if (req.url == "/") {
        arquivo = __dirname + '/index.html';
    } else {
        arquivo = __dirname + req.url;
    }
    fs.readFile(arquivo,
        function (err, data) {
            if (err) {
                res.writeHead(404);
                return res.end('Página ou arquivo não encontrados');
            }
            res.writeHead(200);
            res.end(data);
        }
    );
}
io.on("connection", function (socket) {
    socket.on("entrar", function (apelido, callback) {
        if (!(apelido in usuarios)) {
            socket.apelido = apelido;
            usuarios[apelido] = socket;

            for (indice in ultimas_mensagens) {
                socket.emit("atualizar mensagens", ultimas_mensagens[indice]);
            }


            var mensagem = "[ " + pegarDataAtual() + " ] " + apelido + " acabou de entrar na sala";
            var obj_mensagem = { msg: mensagem, tipo: 'sistema' };

            io.sockets.emit("atualizar usuarios", Object.keys(usuarios));
            io.sockets.emit("atualizar mensagens", obj_mensagem);

            armazenaMensagem(obj_mensagem);

            callback(true);
        } else {
            callback(false);
        }
    });
    socket.on("enviar mensagem", function (dados, callback) {
        var mensagem_enviada = dados.msg;
        var usuario = dados.usu;
        if (usuario == null)
            usuario = '';

        mensagem_enviada = "[ " + pegarDataAtual() + " ] " + socket.apelido + " diz: " + mensagem_enviada;
        var obj_mensagem = { msg: mensagem_enviada, tipo: '' };

        if (usuario == '') {
            io.sockets.emit("atualizar mensagens", obj_mensagem);
            armazenaMensagem(obj_mensagem);
        } else {
            obj_mensagem.tipo = 'privada';
            socket.emit("atualizar mensagens", obj_mensagem);
            usuarios[usuario].emit("atualizar mensagens", obj_mensagem);
        }
        callback();
    });
    socket.on("atualizar usuarios", function (usuarios) {
        $("#lista_usuarios").empty();
        $("#lista_usuarios").append("<option value=''>Todos</option>");
        $.each(usuarios, function (indice) {
            var opcao_usuario = $("<option />").text(usuarios[indice]);
            $("#lista_usuarios").append(opcao_usuario);
    });
    });
    socket.on("disconnect", function () {
        delete usuarios[socket.apelido];
        io.sockets.emit("atualizar usuarios", Object.keys(usuarios));
        io.sockets.emit("atualizar mensagens", { msg: "[ " + pegarDataAtual() + " ] " + socket.apelido + " saiu da sala", tipo: 'sistema' });
    });
    socket.on("atualizar mensagens", function (dados) {
        var mensagem_formatada = $("<p />").text(dados.msg).addClass(dados.tipo);
        $("#historico_mensagens").append(mensagem_formatada);
    });

});    
function pegarDataAtual() {
    var dataAtual = new Date();
    var dia = (dataAtual.getDate() < 10 ? '0' : '') + dataAtual.getDate();
    var mes = ((dataAtual.getMonth() + 1) < 10 ? '0' : '') + (dataAtual.getMonth() + 1);
    var ano = dataAtual.getFullYear();
    var hora = (dataAtual.getHours() < 10 ? '0' : '') + dataAtual.getHours();
    var minuto = (dataAtual.getMinutes() < 10 ? '0' : '') + dataAtual.getMinutes();
    var segundo = (dataAtual.getSeconds() < 10 ? '0' : '') + dataAtual.getSeconds();
    var dataFormatada = dia + "/" + mes + "/" + ano + " " + hora + ":" + minuto + ":" + segundo;
    return dataFormatada;
}

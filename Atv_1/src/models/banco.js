var fs = require('fs');
function banco() {}
banco.prototype.getBanco = function(callback) {
    fs.readFile('./data/BancosBrasileiros.json', 'utf8', function(err, result) {
    var data = [];
        if (!err) {
        var obj = JSON.parse(result);
        var i = 0; //(obj.pessoas.length - 1);
        obj.bancos.forEach(function(bancos) {
        if (i >=  0) {
            data[i] = bancos;
            i++;
        }
    });
    }

    callback(err, data)
    
    })}
    module.exports = function(){
    return banco;
}
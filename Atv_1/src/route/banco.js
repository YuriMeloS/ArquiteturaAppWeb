module.exports = function(application){
    application.get('/', function(req, res){
    application.src.controllers.banco.index(application, req, res)
    })
    }
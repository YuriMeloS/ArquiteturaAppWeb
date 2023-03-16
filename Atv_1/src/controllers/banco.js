module.exports.index = function(application, req, res) {
    var bancoModels = new application.src.models.banco()
    bancoModels.getBanco(function(err, result) {
    res.render("banco/index", {banco : result})
    })}
const LivroController = require('../controllers/livroController');
const livroController = new LivroController();
const Livro = require('../models/livro');
const BaseController = require('../controllers/baseController');

module.exports = (app) => {

    const routesLivro = LivroController.routes();

    app.use(routesLivro.autenticadas, function(req, resp, next){
        if (req.isAuthenticated()){
            next();
        } else {
            resp.redirect(BaseController.routes().login);
        }
    });

    app.get(routesLivro.lista, livroController.lista());

    app.route(routesLivro.add)
        .get(livroController.formLivro())
        .post(Livro.validacoes(), livroController.addLivro())
        .put(livroController.updateLivro());

    app.get(routesLivro.update, livroController.buscaLivro());
    
    app.delete(routesLivro.delete, livroController.deleteLivro());
};
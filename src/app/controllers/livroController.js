const { validationResult } = require('express-validator/check');
const LivroDao = require('../infra/livro-dao');
const db = require('../../config/database');
const templates = require('../views/templates');

class LivroController{

    static routes() {
        return {
            autenticadas: '/livros*', //somente urls que serao acessadas apos o login, ou seja todas as urls que tem '/livros...'
            lista: '/livros',
            add: '/livros/form',
            update: '/livros/form/:id',
            delete: '/livros/:id'
        }
    }

    lista() {
        return function(req, resp) {

            const livroDao = new LivroDao(db);
            livroDao.lista()
                    .then(livros => resp.marko(
                        templates.livros.lista,
                        {
                            livros: livros
                        }
                    ))
                    .catch(erro => console.log(erro));
        };
    }

    formLivro(){
        return function(req, resp) {
            resp.marko(templates.livros.form, { livro: {} });
        };
    }

    addLivro(){
        return function(req, resp) {
            console.log(req.body);
            //cria uma instancia do livro passando o banco
            const livroDao = new LivroDao(db);
            
            const erros = validationResult(req);
    
            if (!erros.isEmpty()) {
                return resp.marko(
                    templates.livros.form,
                    { 
                        livro: {}, 
                        errosValidacao: erros.array()
                    }
                );
            }
    
            //utilizo a instancia e chama o metodo adiciona
            //entao devolve uma promisse que vai ser tratada
            //no then somente funciona apos ter add o livro no banco de acordo com a parte de add no livro-dao.js
            livroDao.add(req.body)
                    .then(resp.redirect(LivroController.routes().lista))
                    .catch(erro => console.log(erro));
        };
    }

    buscaLivro(){
        return function(req, resp) {
            const id = req.params.id;
            const livroDao = new LivroDao(db);
        
            livroDao.buscaPorId(id)
                .then(livro => 
                    resp.marko(
                        templates.livros.form,
                        { livro: livro }
                    )
                )
                .catch(erro => console.log(erro));
        
        };
    }

    updateLivro(){
        return function (req, resp) {
            console.log(req.body);
            const livroDao = new LivroDao(db);

            livroDao.update(req.body)
                        .then(resp.redirect(LivroController.routes().lista))
                        .catch(erro => console.log(erro));
        };
    }

    deleteLivro(){
        return function(req, resp) {
            const id = req.params.id;
    
            const livroDao = new LivroDao(db);
            livroDao.remove(id)
                    .then(() => resp.status(200).end())
                    .catch(erro => console.log(erro));
        };
    }

}
 
module.exports = LivroController;
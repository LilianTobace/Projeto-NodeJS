const uuid = require('uuid/v4');
const sessao = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;


const UsuarioDao = require('../app/infra/usuarioDao');
const db = require('./database');

module.exports = (app) => {

    //configuracao da sessao e da autenticacao
    passport.use(new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'senha'
        },
        (email, senha, done) => {
            const usuarioDao = new UsuarioDao(db);
            usuarioDao.buscaPorEmail(email)
                    .then(usuario => {
                        if(!usuario || senha != usuario.senha){
                            return done(null, false, {
                                mensagem: 'Login e senha incorretos!'
                            });
                        }

                        return done(null, usuario);
                    })
                    .catch(erro => done(erro, false));
        }
    ));

    passport.serializeUser((usuario, done) => {
        const usuarioSessao = {
            nome: usuario.nome_completo,
            email: usuario.email
        };

        done(null, usuarioSessao);
    });

    passport.deserializeUser((usuarioSessao, done) => {
        done(null, usuarioSessao);
    });

    app.use(sessao({
        secret: 'node alura',
        genid: function(req){
            return uuid();
        },
        resave: false, // nao permite resalvar a sessao mesmo se houver alteracao na sessao
        saveUninitialized: false // permitir salvar a sessao apenas apos o login
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    app.use(function(req, resp, next){
        req.passport = passport;
        next();
    })
};
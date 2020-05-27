class LivroDao{
    
    constructor(db){
        this._db = db;
    }

    //metodo run, metodo so sqlite utiliza, nao retorna nenhum resultado apenas o erro se houver
    //metodo run serve para add, update e delete 
    // values (?, ?, ?) = os valores que serao passado pelo post
    //e a segunda parte e onde defini os valors que irao subtituis os ?
    //deve colocar na prdem correta, valor titulo com titulo, preco com preco e etc
    //por ultimo passa um callback que recebe um erro
    add(livro) {
        return new Promise((resolve, reject) => {
            this._db.run(`
                INSERT INTO livros (
                    titulo, 
                    preco,
                    descricao
                ) values (?,?,?)
                `,
                [
                    livro.titulo,
                    livro.preco,
                    livro.descricao
                ],
                function (err) {
                    if (err) {
                        console.log(err);
                        return reject('Não foi possível adicionar o livro!');
                    }

                    resolve();
                }
            )
        });
    }

    lista() {
        return new Promise((resolve, reject) => {
            this._db.all(
                'SELECT * FROM livros',
                (erro, resultados) => {
                    if (erro) return reject('Não foi possível listar os livros!');

                    return resolve(resultados);
                }
            )
        });
    }

    buscaPorId(id) {
        return new Promise((resolve, reject) => {
            this._db.get(
                `
                    SELECT *
                    FROM livros
                    WHERE id = ?
                `,
                [id],
                (erro, livro) => {
                    if (erro) {
                        return reject('Não foi possível encontrar o livro!');
                    }
                    return resolve(livro);
                }
            );
        });
    }

    update(livro) {
        return new Promise((resolve, reject) => {
            this._db.run(`
                UPDATE livros SET
                titulo = ?,
                preco = ?,
                descricao = ?
                WHERE id = ?
            `,
            [
                livro.titulo,
                livro.preco,
                livro.descricao,
                livro.id
            ],
            erro => {
                if (erro) {
                    return reject('Não foi possível atualizar o livro!');
                }

                resolve();
            });
        });
    }


    remove(id) {

        return new Promise((resolve, reject) => {
            this._db.get(
                `
                    DELETE 
                    FROM livros
                    WHERE id = ?
                `,
                [id],
                (erro) => {
                    if (erro) {
                        return reject('Não foi possível remover o livro!');
                    }
                    return resolve();
                }
            );
        });
    }
}

module.exports = LivroDao;
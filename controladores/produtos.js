const knex = require('../conexao');

const listarProdutos = async (req, res) => {
    const { usuario } = req;
    const { categoria } = req.query;

    try {
        const query = knex('produtos').where({ usuario_id: usuario.id, });

        if (categoria) {
            query.where('categoria', 'ilike', `%${categoria}%`);
        }
        const produtos = await query.debug();

        if (produtos.length === 0) {
            return res.status(404).json('Não existem produtos para exibir');
        }

        return res.status(200).json(produtos);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const obterProduto = async (req, res) => {
    const { usuario } = req;
    const { id } = req.params;

    try {
        const produtos = await knex('produtos').where({ usuario_id: usuario.id, id: id }).first();

        if (!produtos) {
            return res.status(404).json('Produto não encontrado');
        }

        return res.status(200).json(produtos);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const cadastrarProduto = async (req, res) => {
    const { usuario } = req;
    const { nome, estoque, preco, categoria, descricao, imagem } = req.body;

    if (!nome) {
        return res.status(404).json('O campo nome é obrigatório');
    }

    if (!estoque) {
        return res.status(404).json('O campo estoque é obrigatório');
    }

    if (!preco) {
        return res.status(404).json('O campo preco é obrigatório');
    }

    if (!descricao) {
        return res.status(404).json('O campo descricao é obrigatório');
    }

    try {
        const dados =
        {
            usuario_id: usuario.id,
            nome,
            quantidade: estoque,
            preco,
            categoria,
            descricao,
            imagem
        }
        const produto = await knex('produtos').insert(dados).returning('*');

        if (!produto) {
            return res.status(400).json('O produto não foi cadastrado');
        }

        return res.status(200).json(produto);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const atualizarProduto = async (req, res) => {
    const { usuario } = req;
    const { id } = req.params;
    const { nome, estoque, preco, categoria, descricao, imagem } = req.body;

    if (!nome && !estoque && !preco && !categoria && !descricao && !imagem) {
        return res.status(404).json('Informe ao menos um campo para atualizaçao do produto');
    }
    const body = {
        ...(nome ? {nome} : {}),
        ...(estoque ? {quantidade: estoque} : {}),
        ...(preco ? {preco} : {}),
        ...(categoria ? {categoria} : {}),
        ...(descricao ? {descricao} : {}),
        ...(imagem ? {imagem} : {})
    }

    try {
        const produto = await knex('produtos').where({ usuario_id: usuario.id, id: id });

        if (!produto) {
            return res.status(404).json('Produto não encontrado');
        }

        const [produtoAtualizado] = await knex('produtos').update(body).where({ id, usuario_id: usuario.id }).returning('*');

        if (!produtoAtualizado) {
            return res.status(400).json("O produto não foi atualizado");
        }

        return res.status(200).json(produtoAtualizado);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const excluirProduto = async (req, res) => {
    const { usuario } = req;
    const { id } = req.params;

    try {
        const excluido = await knex('produtos').where({ usuario_id: usuario.id, id: id });

        if (excluido.length === 0) {
            return res.status(404).json('Produto não encontrado');
        }

        const produtoExcluido = await knex('produtos').del().where('id', id);

        return res.status(200).json('Produto excluido com sucesso');
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = {
    listarProdutos,
    obterProduto,
    cadastrarProduto,
    atualizarProduto,
    excluirProduto
}
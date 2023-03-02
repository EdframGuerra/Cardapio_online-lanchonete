const pool = require('../conexao-banco-dados/conexao')
const jwt = require('jsonwebtoken')
const senhaJwt = require('../senhajwt')

const cadastrarPedidoCliente = async (req, res) => {

    const { authorization } = req.headers
    const { id_cardapio, quantidade } = req.body


    if (!authorization) {
        return res.status(401).json({ mensagem: `Cliente não autorizado` })
    }

    const token = authorization.split(' ')[1];

    try {
        const { id } = jwt.verify(token, senhaJwt)

        const clienteCadastrado = await pool.query(`SELECT * FROM clientes WHERE id= $1`, [id])

        if (clienteCadastrado.rowCount === 0) {
            return res.status(401).json({ mensagem: 'Não autorizado' })
        }

        const usuario = clienteCadastrado.rows[0]

        req.usuario = usuario

        if (!id_cardapio || !quantidade) {
            return res.status(400).json({ mensagem: 'todos os campos devem ser preenchidos' })
        }
        // if (!id_cardapio.trim() || !quantidade.trim()) {
        //     return res.status(400).json({ mensagem: 'todos os campos devem ser preenchidos' })
        // }

        const pedido = await pool.query(`INSERT INTO pedidos (id_cliente)
        VALUES
        ($1)returning*`, [usuario.id])

        return res.status(201).json(pedido.rows[0])

    } catch (error) {
        return res.status(500).json({ mensagem: error.message })
    }


}
const cadastrarProdutoPedido = async (req, res) => {
    const { id_cardapio, quantidade } = req.body
    const { idPedido } = req.params

    const { authorization } = req.headers



    if (!authorization) {
        return res.status(401).json({ mensagem: `Cliente não autorizado` })
    }

    const token = authorization.split(' ')[1];

    try {
        const { id } = jwt.verify(token, senhaJwt)

        const clienteCadastrado = await pool.query(`SELECT * FROM clientes WHERE id= $1`, [id])

        if (clienteCadastrado.rowCount === 0) {
            return res.status(401).json({ mensagem: 'Não autorizado' })
        }

        const usuario = clienteCadastrado.rows[0]

        req.usuario = usuario

        if (!id_cardapio || !quantidade) {
            return res.status(400).json({ mensagem: 'todos os campos devem ser preenchidos' })
        }
       

        const cardapioItem = await pool.query(`SELECT valor FROM cardapio WHERE id = $1`, [id_cardapio])

        const valor = cardapioItem.rows[0].valor * quantidade

        const pedidoProduto = await pool.query(`INSERT INTO pedido_produtos(id_cardapio, id_pedido, quantidade, valor) 
        VALUES
        ($1,$2,$3,$4)returning*`, [id_cardapio, idPedido, quantidade, valor])

        return res.status(201).json(pedidoProduto.rows[0])

    } catch (error) {
        return res.status(500).json({ mensagem: error.message })
    }
}

const listarPedidos = async (req, res) => {
    try {
        const pedidosRealizados = await pool.query(`SELECT id, id_cliente,total, id_pedido_produto FROM pedidos`)

        return res.status(201).json(pedidosRealizados.rows)

    } catch (error) {
        return res.status(500).json({ mensagem: error.message })
    }

}

const atualizarPedido = async (req, res) => {

}

const excluirPedido = async (req, res) => {

}

module.exports = {
    cadastrarPedidoCliente,
    listarPedidos,
    atualizarPedido,
    excluirPedido,
    cadastrarProdutoPedido

}
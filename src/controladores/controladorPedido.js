const pool = require('../conexao-banco-dados/conexao')

const cadastrarPedido = async (req, res) => {
    const { cpf } = req.body

    const { itens } = req.body

    try {
        // Insere o pedido na tabela pedidos
        const { rows: [pedido] } = await pool.query(
            'INSERT INTO pedidos (cpf_cliente, total) VALUES ($1, 0) RETURNING id',
            [cpf]
        );

        // Insere os itens do pedido na tabela itens_pedido
        for (const item of itens) {
            const { quantidade, cardapio_id } = item;
            const { rows: [produto] } = await pool.query(
                'SELECT valor FROM cardapio WHERE id = $1',
                [cardapio_id]
            );
         
            
            const valor = quantidade * produto.valor;
          
            await pool.query(
                'INSERT INTO itens_pedido (pedido_id, quantidade, cardapio_id, valor) VALUES ($1, $2, $3, $4)',
                [pedido.id, quantidade, cardapio_id, valor]
            );
        }

        // Atualiza o valor do pedido na tabela pedidos
        const { rows: [total] } = await pool.query(
            'SELECT SUM(valor) AS total FROM itens_pedido WHERE pedido_id = $1',
            [pedido.id]
        );
        await pool.query(
            'UPDATE pedidos SET total = $1 WHERE id = $2',
            [total.total, pedido.id]
        );

        console.log(pedido.id)
        return res.status(201).json({
            pedido: pedido.id,
            totalApagar:total.total
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json(error)
    }
}


const listarPedidos = async (req, res) => {
    try {
        const pedidosRealizados = await pool.query(`SELECT * FROM pedidos`)

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
    listarPedidos,
    atualizarPedido,
    excluirPedido,
    cadastrarPedido

}
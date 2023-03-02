const pool = require('../conexao-banco-dados/conexao')

const cadastrarItemCardapio = async (req, res) => {
    const { nome, descricao, valor } = req.body

    if (!nome || !descricao || !valor) {
        res.status(400).json({ mensagem: 'Todos os campos devem ser preenchidos' })
    }

    try {
        const { rows } = await pool.query(`INSERT INTO cardapio (nome, descricao, valor)
        VALUES
        ($1, $2, $3)returning*`, [nome, descricao, valor])


        return res.status(201).json(rows)

    } catch (error) {
        res.status(500).json({ mensagem: error.message })
    }

}

const listarCardapio = async (req, res) => {
    try {
        const cardapio = await pool.query(`SELECT ID, nome, descricao, valor FROM cardapio WHERE status = true ORDER BY id`)

        return res.json(cardapio.rows)

    } catch (error) {

    }
}

const detalharItemCardapio = async (req, res) => {
    const { id } = req.params

    try {

        const existeId = await pool.query('SELECT * FROM cardapio WHERE id = $1', [id])

        if (existeId.rowCount === 0) {
            return res.status(404).json({ mensagem: 'Pastel não encontrado' })
        }

        return res.json(existeId.rows[0])

    } catch (error) {
        res.status(500).json({ mensagem: error.message })
    }

}

const atualizarCardapio = async (req, res) => {
    const { id } = req.params
    const { nome, descricao, valor, status } = req.body
    try {
        const existeId = await pool.query('SELECT * FROM cardapio WHERE id = $1', [id])

        if (existeId.rowCount === 0) {
            return res.status(404).json({ mensagem: 'Pastel não encontrado' })
        }

        await pool.query(`UPDATE cardapio SET nome =$1, descricao = $2, valor = $3 , status = $4 WHERE id = $5`, [nome, descricao, valor, status, id])

        return res.status(204).send()

    } catch (error) {
        res.status(500).json({ mensagem: error.message })
    }

}
const excluirPastelCadastrado = async (req, res) => {
    const { id } = req.params

    try {
        const existeId = await pool.query('SELECT * FROM cardapio WHERE id = $1', [id])

        if (existeId.rowCount === 0) {
            return res.status(404).json({ mensagem: 'Pastel não encontrado' })
        }
        await pool.query(`DELETE FROM cardapio WHERE id = $1 `, [id])

        return res.status(204).send()


    } catch (error) {
        res.status(500).json({ mensagem: error.message })
    }
}



module.exports = {
    cadastrarItemCardapio,
    listarCardapio,
    detalharItemCardapio,
    atualizarCardapio,
    excluirPastelCadastrado

}
const pool = require("../conexao-banco-dados/conexao")
const jwt = require('jsonwebtoken')
const senhaJwt = require('../senhajwt')

const login = async (req, res) => {
    const { email } = req.body

    console.log(email)
    try {
        const cliente = await pool.query(`SELECT * FROM clientes WHERE email = $1`, [email])


        if (cliente.rowCount === 0) {
            return res.status(404).json({ mensagem: 'Cliente não cadastrado' })
        }

        const token = jwt.sign({ cpf: cliente.rows[0].cpf }, senhaJwt, { expiresIn: '3h' })

        return res.json({ cliente: cliente.rows, token })

    } catch (error) {
        return res.status(500).json({ mensagem: error.message })
    }

}

module.exports = {
    login
}
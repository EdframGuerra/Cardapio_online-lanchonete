const pool = require("../conexao-banco-dados/conexao")
const jwt = require('jsonwebtoken')
const senhaJwt = require('../senhaJwt/senhaJwt')
const bcrypt = require('bcrypt')

const login = async (req, res) => {
    const { email, senha } = req.body

    try {
        const cliente = await pool.query(`SELECT * FROM clientes WHERE email = $1`, [email])
      
        if (cliente.rowCount === 0) {
            return res.status(404).json({ mensagem: 'Cliente não cadastrado' })
        }

        const { senha: _, ...clienteLogado } = cliente.rows[0]

        const senhaAutenticada = await bcrypt.compare(senha, cliente.rows[0].senha)

        if (!senhaAutenticada) {
            return res.status(404).json({ mensagem: 'Usuário e/ou senha inválido(s).' })
        }

        const token = jwt.sign({ id: cliente.rows[0].id }, senhaJwt, { expiresIn: '3h' })

        return res.json({ cliente: clienteLogado, token })

    } catch (error) {
        return res.status(500).json({ mensagem: error.message })
    }

}

module.exports = {
    login
}
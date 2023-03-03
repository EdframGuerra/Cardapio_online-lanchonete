const jwt = require('jsonwebtoken')
const pool = require('../conexao-banco-dados/conexao')
const senhaJwt = require('../senhaJwt/senhaJwt')

const autenticarLogin = async (req, res, next) => {

    const { authorization } = req.headers

    if (!authorization) {
        return res.status(401).json({ mensagem: `Cliente não autorizado1` })
    }

    const token = authorization.split(' ')[1];

    try {
        const { id } = jwt.verify(token, senhaJwt)

        const clienteCadastrado = await pool.query(`SELECT * FROM clientes WHERE id= $1`, [id])

        if (clienteCadastrado.rowCount === 0) {
            return res.status(401).json({ mensagem: 'Não autorizado2' })
        }

        const {usuario} = clienteCadastrado.rows[0]

        req.usuario = usuario

        next()

    } catch (error) {
        return res.status(500).json({ mensagem: error.message })
    }
}

module.exports = autenticarLogin


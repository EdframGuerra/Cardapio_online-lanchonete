const pool = require('../conexao-banco-dados/conexao')
const bcrypt = require('bcrypt')


//CRIAR AS FUNÇÃO QUE SERÃO EXECUTADAS NAS ROTAS

//Função cadastrar usuario
const cadastrarCliente = async (req, res) => {

    const { cpf, nome, email, senha } = req.body;

    // validação de campos obrigatórios via middleware
    try {

        //verifica se e-mail existe no banco de dados
        const emailVerificado = await pool.query(`SELECT * FROM clientes WHERE email = $1`, [email])

        if (emailVerificado.rowCount > 0) {
            return res.status(400).json({ mensagem: 'Já existe cliente cadastrado com o e-mail informado.' })
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10)

        //cadastrando o usuario no banco de dados
        const clienteCadastrado = await pool.query(`INSERT INTO clientes (cpf, nome, email, senha)
        VALUES
        ($1, $2, $3, $4) returning*`, [cpf, nome, email, senhaCriptografada])

        const { senha: _, ...clienteLogado } = clienteCadastrado.rows[0]

        return res.status(201).json(clienteLogado)

    } catch (error) {
        return res.status(500).json(error.message)
    }
}
// excluir 
// const listarCliente = async (req, res) => {
//     try {
//         const resultado = await pool.query(`SELECT id, nome, email FROM clientes`)

//         return res.status(201).json(resultado.rows)
//     } catch (error) {
//         return res.status(500).json(error.message)
//     }
// }

const detalharCliente = async (req, res) => {
    const { id } = req.params

    try {
        const clienteExiste = await pool.query(`SELECT * FROM clientes WHERE id = $1`, [id])

        if (clienteExiste.rowCount < 1) {
            return res.status(404).json({ mensagem: `Não existe cliente com id informado` })
        }

        const { rows } = await pool.query(`SELECT id, nome, email FROM clientes WHERE ID = $1`, [id])

        return res.status(201).json(rows)

    } catch (error) {
        return res.status(500).json(error.message)
    }
}



module.exports = {
    cadastrarCliente,
    detalharCliente
}
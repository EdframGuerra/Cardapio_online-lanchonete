const express = require('express')
const { cadastrarItemCardapio, listarCardapio, detalharItemCardapio, atualizarCardapio, excluirPastelCadastrado } = require('../controladores/controladorCardapio')
const { detalharCliente, cadastrarCliente } = require('../controladores/controladorCliente')


const { listarPedidos, cadastrarPedido } = require('../controladores/controladorPedido')
const { login } = require('../controladores/login')

const autenticarLogin = require('../intermediario/validarLogin')



const rotas = express.Router()

// cardapio 
rotas.post('/pastelaria', cadastrarItemCardapio)
rotas.get('/pastelaria', listarCardapio)
rotas.get('/pastelaria/:id', detalharItemCardapio)
rotas.put('/pastelaria/:id', atualizarCardapio)
rotas.delete('/pastelaria/:id', excluirPastelCadastrado)



// rotas.get('/clientes', listarCliente)
rotas.get('/clientes/:id', detalharCliente)


//clientes
rotas.post('/clientes', cadastrarCliente)
rotas.post('/logincliente', login)

//pedidos
rotas.get('/pedidos', listarPedidos)



rotas.use(autenticarLogin)
rotas.post('/pedidocadastrado', cadastrarPedido)
// rotas.post('/pedido', cadastrarItemPedido)


module.exports = rotas
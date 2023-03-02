const express = require('express')
const { cadastrarCliente, detalharCliente } = require('../controladores/controladorClientes')
const { cadastrarItemCardapio, listarCardapio, detalharItemCardapio, atualizarCardapio, excluirPastelCadastrado } = require('../controladores/controladoresCardapio')
const { cadastrarPedidoCliente, listarPedidos, cadastrarProdutoPedido } = require('../controladores/controladorPedido')
const { login } = require('../controladores/loginCliente')


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


rotas.post('/pedido', cadastrarPedidoCliente)
rotas.post('/pedido/:idPedido', cadastrarProdutoPedido)


module.exports = rotas
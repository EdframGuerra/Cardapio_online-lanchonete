async function cadastrarPedido(cpf, itens) {
    
    try {
      // Insere o pedido na tabela pedidos
      const { rows: [pedido] } = await client.query(
        'INSERT INTO pedidos (cpf, valor) VALUES ($1, 0) RETURNING id',
        [cpf]
      );
  
      // Insere os itens do pedido na tabela itens_pedido
      for (const item of itens) {
        const { quantidade, cardapio_id } = item;
        const { rows: [produto] } = await client.query(
          'SELECT valor FROM cardapio WHERE id = $1',
          [cardapio_id]
        );
        const valor = quantidade * produto.valor;
        await client.query(
          'INSERT INTO itens_pedido (pedido_id, quantidade, cardapio_id, valor) VALUES ($1, $2, $3, $4)',
          [pedido.id, quantidade, cardapio_id, valor]
        );
      }
  
      // Atualiza o valor do pedido na tabela pedidos
      const { rows: [total] } = await client.query(
        'SELECT SUM(valor) AS total FROM itens_pedido WHERE pedido_id = $1',
        [pedido.id]
      );
      await client.query(
        'UPDATE pedidos SET valor = $1 WHERE id = $2',
        [total.total, pedido.id]
      );
  
      return pedido.id;
    } finally {
      await client.end();
    }
  }
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.qtde button');
    const removeButtons = document.querySelectorAll('.remove');
    const limparCarrinhoButton = document.getElementById('limparCarrinhoBtn');

    function atualizarQuantidade(acao, quantidadeSpan, valorTotalSpan, precoUnitario) {
        let quantidade = parseInt(quantidadeSpan.textContent);

        if (acao === 'aumentar') {
            quantidade++;
        } else if (acao === 'diminuir' && quantidade > 0) {
            quantidade--;
        }

        quantidadeSpan.textContent = quantidade;
        const total = precoUnitario * quantidade;
        valorTotalSpan.textContent = `R$ ${total.toFixed(2)}`;
        calcularSubtotal();
    }

    function calcularSubtotal() {
        let subtotal = 0;
        document.querySelectorAll('.valor-Total').forEach(td => {
            const valor = parseFloat(td.textContent.replace('R$', '').trim());
            if (!isNaN(valor)) {
                subtotal += valor;
            }
        });

        document.getElementById('subtotal').textContent = `R$ ${subtotal.toFixed(2)}`;

        // Calcular desconto
        let desconto;
        if (subtotal > 1000.00) {
            desconto = subtotal * 0.10;
        } else if (subtotal > 500.00) {
            desconto = subtotal * 0.075;
        } else if (subtotal > 200.00) {
            desconto = subtotal * 0.05;
        } else if (subtotal >= 100.00) {
            desconto = subtotal * 0.02;
        } else {
            desconto = 0.00;
        }

        let descontoText;
        if (desconto === 0.00) {
            descontoText = "";
        } else if (desconto === subtotal * 0.10) {
            descontoText = "10%";
        } else if (desconto === subtotal * 0.075) {
            descontoText = "7.5%";
        } else if (desconto === subtotal * 0.05) {
            descontoText = "5%";
        } else if (desconto === subtotal * 0.02) {
            descontoText = "2%";
        } else {
            descontoText = "";
        }
        
        // Calcular frete (exemplo: sempre 0.00 neste caso)
        const frete = 0.00;
        
        // Calcular total com desconto e frete
        const totalComDesconto = subtotal - desconto + frete;
        
        document.getElementById('total').textContent = `R$ ${totalComDesconto.toFixed(2)}`;
        document.getElementById('desconto').textContent = descontoText;
    }

    function removerItem(button) {
        const quantidadeSpan = button.closest('tr').querySelector('.qtdProduto');
        const valorTotalSpan = button.closest('tr').querySelector('.valor-Total');
        const precoUnitario = parseFloat(button.closest('tr').querySelector('td[data-preco]').getAttribute('data-preco'));

        let quantidade = parseInt(quantidadeSpan.textContent);
        if (quantidade > 0) {
            quantidade = 0;
            quantidadeSpan.textContent = quantidade;
            valorTotalSpan.textContent = "";
            calcularSubtotal();
        }
    }

    // Função para limpar o carrinho
    function limparCarrinho() {
        const quantidadeSpans = document.querySelectorAll('.qtdProduto');
        const valorTotalSpans = document.querySelectorAll('.valor-Total');

        quantidadeSpans.forEach(span => {
            span.textContent = '0';
        });

        valorTotalSpans.forEach(span => {
            span.textContent = '';
        });

        calcularSubtotal();
    }

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const acao = button.getAttribute('data-action');
            const quantidadeSpan = button.parentElement.querySelector('.qtdProduto');
            const valorTotalSpan = button.closest('tr').querySelector('.valor-Total');
            const precoUnitario = parseFloat(button.closest('tr').querySelector('td[data-preco]').getAttribute('data-preco'));
            atualizarQuantidade(acao, quantidadeSpan, valorTotalSpan, precoUnitario);
        });
    });

    removeButtons.forEach(button => {
        button.addEventListener('click', () => {
            removerItem(button);
        });
    });

    // Adicionar evento de clique ao botão "Limpar Carrinho"
    limparCarrinhoButton.addEventListener('click', () => {
        limparCarrinho();
    });

    // Calcular o total inicial
    calcularSubtotal();
});

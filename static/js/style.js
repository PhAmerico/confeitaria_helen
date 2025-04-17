document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.qtde button');
    const removeButtons = document.querySelectorAll('.remove');
    const limparCarrinhoButton = document.getElementById('limparCarrinhoBtn');
    const finalizarBtn = document.getElementById('finalizarPedidoBtn');
    const form = document.getElementById('formFinalizar');

    // ====== Parte que você já tinha (controle de carrinho) ======

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
        
        const frete = 0.00;
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

    limparCarrinhoButton.addEventListener('click', () => {
        limparCarrinho();
    });

    calcularSubtotal();

    // ====== Parte NOVA: preparar o envio para Flask ======
    document.addEventListener('DOMContentLoaded', function() {
        const finalizarPedidoBtn = document.getElementById('finalizarPedidoBtn');
        const formFinalizar = document.getElementById('formFinalizar');
    
        finalizarPedidoBtn.addEventListener('click', function(event) {
            // Antes de enviar o formulário, limpar inputs antigos
            document.querySelectorAll('input[name="produto"], input[name="quantidade"]').forEach(input => input.remove());
    
            // Capturar todos os produtos do carrinho
            const produtos = document.querySelectorAll('tbody tr');
            produtos.forEach(produto => {
                const nomeProduto = produto.querySelector('.name')?.textContent.trim();
                const qtdProduto = produto.querySelector('.qtdProduto')?.textContent.trim();
    
                if (nomeProduto && qtdProduto && parseInt(qtdProduto) > 0) {
                    const inputProduto = document.createElement('input');
                    inputProduto.type = 'hidden';
                    inputProduto.name = 'produto';
                    inputProduto.value = nomeProduto;
    
                    const inputQuantidade = document.createElement('input');
                    inputQuantidade.type = 'hidden';
                    inputQuantidade.name = 'quantidade';
                    inputQuantidade.value = qtdProduto;
    
                    formFinalizar.appendChild(inputProduto);
                    formFinalizar.appendChild(inputQuantidade);
                }
            });
    
            // Se nenhum produto foi selecionado, impedir envio
            if (formFinalizar.querySelectorAll('input[name="produto"]').length === 0) {
                event.preventDefault();
                alert('Seu carrinho está vazio!');
            }
        });
    });
})

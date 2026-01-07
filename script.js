
let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

function atualizarContadorCarrinho() {
    const contador = document.getElementById('cart-count');
    if (contador) {
        contador.textContent = carrinho.length;
    }
}


function adicionarAoCarrinho(nome, preco) {
    const produto = {
        id: Date.now(),
        nome: nome,
        preco: preco,
        quantidade: 1
    };
    
    carrinho.push(produto);
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    atualizarContadorCarrinho();
    
    alert(`${nome} adicionado ao carrinho!`);
}


document.addEventListener('DOMContentLoaded', function() {
    
    atualizarContadorCarrinho();
    
    
    const botoesComprar = document.querySelectorAll('.card button:not(.item-controls button)');
    
    botoesComprar.forEach((botao, index) => {
        botao.addEventListener('click', function(e) {
            e.preventDefault();
            
            
            const card = botao.closest('.card');
            if (card) {
                
                const nomeElement = card.querySelector('h3 a') || card.querySelector('h3');
                const nome = nomeElement ? nomeElement.textContent.trim() : 'Produto';
                
                
                const precoElement = card.querySelector('.price');
                if (!precoElement) return;
                
                const precoText = precoElement.textContent;
                const preco = parseFloat(precoText.replace('€ ', '').replace(',', '.'));
                
                if (!isNaN(preco)) {
                    adicionarAoCarrinho(nome, preco);
                }
            }
        });
    });
    
    
    const cartBtn = document.getElementById('cart-btn');
    if (cartBtn) {
        cartBtn.addEventListener('click', function(e) {
            e.preventDefault();
            exibirCarrinho();
        });
    }
});


function exibirCarrinho() {
    let modal = document.getElementById('cart-modal');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'cart-modal';
        modal.className = 'modal';
        document.body.appendChild(modal);
    }
    
    let html = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2>Seu Carrinho</h2>
    `;
    
    if (carrinho.length === 0) {
        html += '<p>Carrinho vazio</p>';
    } else {
        html += '<ul>';
        let total = 0;
        
        carrinho.forEach((item, index) => {
            const subtotal = item.preco * item.quantidade;
            total += subtotal;
            html += `
                <li>
                    <strong>${item.nome}</strong> - €${item.preco.toFixed(2)} x ${item.quantidade}
                    <div class="item-controls">
                        <button onclick="alterarQuantidade(${index}, -1)">-</button>
                        <button onclick="removerDoCarrinho(${index})">Remover</button>
                        <button onclick="alterarQuantidade(${index}, 1)">+</button>
                    </div>
                </li>
            `;
        });
        
        html += '</ul>';
        html += `<h3>Total: €${total.toFixed(2)}</h3>`;
        html += '<button class="checkout-btn" onclick="finalizarCompra()">Finalizar Compra</button>';
    }
    
    html += '</div>';
    modal.innerHTML = html;
    modal.style.display = 'block';
    

    const closeBtn = modal.querySelector('.close');
    if (closeBtn) {
        closeBtn.onclick = function() {
            modal.style.display = 'none';
        };
    }
    

    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
}

function removerDoCarrinho(index) {
    carrinho.splice(index, 1);
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    atualizarContadorCarrinho();
    exibirCarrinho();
}


function alterarQuantidade(index, delta) {
    if (carrinho[index]) {
        carrinho[index].quantidade += delta;
        if (carrinho[index].quantidade <= 0) {
            removerDoCarrinho(index);
        } else {
            localStorage.setItem('carrinho', JSON.stringify(carrinho));
            exibirCarrinho();
        }
    }
}


function finalizarCompra() {
    if (carrinho.length === 0) {
        alert('Carrinho vazio!');
        return;
    }
    
    let total = 0;
    let resumo = 'Resumo da Compra:\n\n';
    
    carrinho.forEach(item => {
        const subtotal = item.preco * item.quantidade;
        total += subtotal;
        resumo += `${item.nome} x${item.quantidade} = €${subtotal.toFixed(2)}\n`;
    });
    
    resumo += `\nTotal: €${total.toFixed(2)}`;
    
    if (confirm(resumo + '\n\nConfirmar compra?')) {
        alert('Compra realizada com sucesso! Obrigado!');
        carrinho = [];
        localStorage.removeItem('carrinho');
        atualizarContadorCarrinho();
        document.getElementById('cart-modal').style.display = 'none';
    }
}

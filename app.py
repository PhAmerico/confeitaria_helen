from flask import Flask, render_template, request, redirect, url_for, session
import sqlite3


app = Flask(__name__)
app.secret_key = 'secreto_para_session'

# Página inicial
@app.route('/')
def home():
    return render_template('home.html')

# Página do carrinho
@app.route('/carrinho')
def carrinho():
    return render_template('carrinho.html')

# Página de contato
@app.route('/contato')
def contato():
    return render_template('contato.html')


@app.route('/admin')
def admin():
    return render_template('admin.html')


# Tela de Finalizar Pedido
@app.route('/finalizar', methods=['POST'])
def finalizar():
    produtos = request.form.getlist('produto')
    quantidades = request.form.getlist('quantidade')

    # Zipar produtos e quantidades
    session['produtos'] = list(zip(produtos, quantidades))

    return render_template('finalizar.html', produtos=session['produtos'])


# Confirmar Pedido (salvar no banco)
@app.route('/confirmar_pedido', methods=['POST'])
def confirmar_pedido():
    nome = request.form['nome']
    email = request.form['email']
    data_entrega = request.form['data_entrega']
    observacoes = request.form.get('observacoes')

    conn = sqlite3.connect('banco.db')
    cursor = conn.cursor()

    # Inserir pedido
    cursor.execute('''
        INSERT INTO pedidos (nome, email, data_entrega, observacoes)
        VALUES (?, ?, ?, ?)
    ''', (nome, email, data_entrega, observacoes))
    pedido_id = cursor.lastrowid  # Pega o ID do pedido inserido

    # Inserir cada item do pedido
    produtos = session.get('produtos', [])
    for produto, quantidade in produtos:
        cursor.execute('''
            INSERT INTO itens_pedido (pedido_id, produto, quantidade)
            VALUES (?, ?, ?)
        ''', (pedido_id, produto, quantidade))

    conn.commit()
    conn.close()

    session.pop('produtos', None)  # Limpa o carrinho da sessão

    return redirect(url_for('pedido_realizado'))

# Página de Sucesso
@app.route('/pedido_realizado')
def pedido_realizado():
    return render_template('pedido_realizado.html')

def get_db_connection():
    conn = sqlite3.connect('banco.db')
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/admin/pedidos')
def admin_pedidos():
    filtro = request.args.get('filtro')  # Captura filtro da URL

    conn = get_db_connection()

    query = 'SELECT * FROM pedidos'
    params = ()

    if filtro == 'entregues':
        query += ' WHERE status = ?'
        params = ('Entregue',)
    elif filtro == 'pendentes':
        query += ' WHERE pagamento = ?'
        params = ('Pendente',)
    elif filtro == 'pagos':
        query += ' WHERE pagamento = ?'
        params = ('Pago',)

    pedidos = conn.execute(query, params).fetchall()

    lista_pedidos = []

    for pedido in pedidos:
        itens = conn.execute('SELECT produto, quantidade FROM itens_pedido WHERE pedido_id = ?', (pedido['id'],)).fetchall()

        pedido_completo = {
            'id': pedido['id'],
            'nome': pedido['nome'],
            'email': pedido['email'],
            'data_entrega': pedido['data_entrega'],
            'observacoes': pedido['observacoes'],
            'status': pedido['status'],
            'pagamento': pedido['pagamento'],
            'itens': itens  # <-- Lista de produtos
        }

        lista_pedidos.append(pedido_completo)

    conn.close()

    return render_template('admin.html', pedidos=lista_pedidos)

@app.route('/marcar/como/entregue/<int:id>', methods=['POST'])
def marcar_como_entregue(id):
    conn = get_db_connection()
    conn.execute('UPDATE pedidos SET status = ? WHERE id = ?', ('Entregue', id))
    conn.commit()
    conn.close()
    return redirect(url_for('admin_pedidos'))

@app.route('/marcar/como/pago/<int:id>', methods=['POST'])
def marcar_como_pago(id):
    conn = get_db_connection()
    conn.execute('UPDATE pedidos SET pagamento = ? WHERE id = ?', ('Pago', id))
    conn.commit()
    conn.close()
    return redirect(url_for('admin_pedidos'))



@app.route('/dashboard')
def dashboard():
    conn = sqlite3.connect('banco.db')
    cur = conn.cursor()

    # Produtos mais vendidos
    cur.execute('SELECT produto, SUM(quantidade) FROM itens_pedido GROUP BY produto ORDER BY SUM(quantidade) DESC')
    produtos_vendidos = cur.fetchall()

    # Vendas por mês
    cur.execute('SELECT substr(data_entrega, 1, 7) as mes, COUNT(*) FROM pedidos GROUP BY mes ORDER BY mes')
    vendas_por_mes = cur.fetchall()

    conn.close()

    return render_template('dashboard.html', produtos=produtos_vendidos, vendas=vendas_por_mes)



@app.route('/service-worker.js')
def sw():
    return app.send_static_file('service-worker.js')



if __name__ == '__main__':
    app.run(debug=True)
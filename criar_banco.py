# criar_banco.py
import sqlite3

# Conectar/criar o banco
conn = sqlite3.connect('banco.db')

# Criar tabela pedidos
conn.execute('''
CREATE TABLE IF NOT EXISTS pedidos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    email TEXT,
    data_entrega TEXT,
    observacoes TEXT
)
''')

# Criar tabela itens_pedido
conn.execute('''
CREATE TABLE IF NOT EXISTS itens_pedido (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pedido_id INTEGER,
    produto TEXT,
    quantidade INTEGER,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id)
)
''')

conn.commit()
conn.close()

print("Banco de dados criado com sucesso!")

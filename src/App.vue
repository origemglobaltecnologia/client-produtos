<script setup>
import { ref, onMounted } from 'vue'
import { listarProdutos, criarProduto, atualizarProduto, deletarProduto } from './services/produtos.js'

// Estados reativos
const produtos = ref([])
const loading = ref(false)
const error = ref('')
const form = ref({ id: null, nome: '', descricao: '', quantidade: 0, preco: 0 })

// Carregar lista
async function carregarProdutos() {
  loading.value = true
  error.value = ''
  try {
    produtos.value = await listarProdutos()
  } catch (e) {
    error.value = e?.message || 'Falha ao carregar produtos'
  } finally {
    loading.value = false
  }
}

// Salvar produto (criar ou atualizar)
async function salvarProduto() {
  try {
    if (!form.value.nome.trim()) {
      error.value = 'Nome do produto é obrigatório'
      return
    }

    if (form.value.id) {
      await atualizarProduto(form.value.id, {
        nome: form.value.nome,
        descricao: form.value.descricao,
        quantidade: form.value.quantidade,
        preco: form.value.preco
      })
    } else {
      await criarProduto({
        nome: form.value.nome,
        descricao: form.value.descricao,
        quantidade: form.value.quantidade,
        preco: form.value.preco
      })
    }

    form.value = { id: null, nome: '', descricao: '', quantidade: 0, preco: 0 }
    await carregarProdutos()
  } catch (e) {
    error.value = e?.message || 'Erro ao salvar produto'
  }
}

// Editar produto
function editarProduto(p) {
  form.value = { ...p }
}

// Deletar produto
async function removerProduto(id) {
  if (!confirm("Deseja realmente excluir este produto?")) return
  try {
    await deletarProduto(id)
    await carregarProdutos()
  } catch (e) {
    error.value = e?.message || 'Erro ao excluir produto'
  }
}

onMounted(carregarProdutos)
</script>

<template>
  <main class="container">
    <header class="header">
      <h1>CRUD de Produtos</h1>
    </header>

    <p v-if="error" class="message error">{{ error }}</p>
    <p v-if="loading" class="message">Carregando...</p>

    <div class="card">
      <form @submit.prevent="salvarProduto" class="form">
        <h2>{{ form.id ? 'Editar Produto' : 'Novo Produto' }}</h2>
        <div class="form-group">
          <label for="nome">Nome:</label>
          <input id="nome" v-model="form.nome" required />
        </div>
        <div class="form-group">
          <label for="descricao">Descrição:</label>
          <input id="descricao" v-model="form.descricao" />
        </div>
        <div class="form-group">
          <label for="quantidade">Quantidade:</label>
          <input id="quantidade" v-model.number="form.quantidade" type="number" />
        </div>
        <div class="form-group">
          <label for="preco">Preço:</label>
          <input id="preco" v-model.number="form.preco" type="number" step="0.01" />
        </div>
        <div class="button-group">
          <button type="submit" class="button primary">
            {{ form.id ? 'Atualizar' : 'Salvar' }}
          </button>
          <button type="button" @click="form = { id: null, nome: '', descricao: '', quantidade: 0, preco: 0 }" class="button secondary">
            Cancelar
          </button>
        </div>
      </form>
    </div>

    <div class="card">
      <h2>Lista de Produtos</h2>
      <ul class="product-list">
        <li v-for="p in produtos" :key="p.id" class="product-item">
          <div class="product-info">
            <strong>{{ p.nome }}</strong>
            <span> - {{ p.descricao }}</span>
            <span> - {{ p.quantidade }}</span>
            <span> - R$ {{ p.preco }}</span>
          </div>
          <div class="button-group">
            <button @click="editarProduto(p)" class="button small primary">Editar</button>
            <button @click="removerProduto(p.id)" class="button small danger">Excluir</button>
          </div>
        </li>
      </ul>
    </div>
  </main>
</template>

<style>
/* Estilos Globais */
:root {
  --primary-color: #4A90E2;
  --secondary-color: #6C757D;
  --danger-color: #E24A4A;
  --text-color: #333;
  --background-color: #F8F9FA;
  --card-background: #FFFFFF;
  --border-color: #E9ECEF;
  --shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: var(--background-color);
  color: var(--text-color);
  margin: 0;
  padding: 0;
  line-height: 1.6;
}

.container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 1rem;
}

.header {
  text-align: center;
  margin-bottom: 2rem;
}

.message {
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  text-align: center;
}

.message.error {
  background-color: rgba(226, 74, 74, 0.1);
  color: var(--danger-color);
  border: 1px solid var(--danger-color);
}

.card {
  background-color: var(--card-background);
  padding: 2rem;
  border-radius: 10px;
  box-shadow: var(--shadow);
  margin-bottom: 2rem;
}

/* Estilos do Formulário */
.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 5px;
  box-sizing: border-box;
  font-size: 1rem;
}

.form-group input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.2);
}

/* Estilos dos Botões */
.button-group {
  display: flex;
  gap: 0.5rem;
  margin-top: 1.5rem;
}

.button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.button:hover {
  transform: translateY(-2px);
}

.button.primary {
  background-color: var(--primary-color);
  color: white;
}

.button.primary:hover {
  background-color: #3770b8;
}

.button.secondary {
  background-color: var(--secondary-color);
  color: white;
}

.button.secondary:hover {
  background-color: #5a6268;
}

.button.danger {
  background-color: var(--danger-color);
  color: white;
}

.button.danger:hover {
  background-color: #c23939;
}

.button.small {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

/* Estilos da Lista de Produtos */
.product-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.product-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.product-item:last-child {
  border-bottom: none;
}

.product-info {
  flex-grow: 1;
}
</style>


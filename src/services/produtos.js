// src/services/produtos.js

const base = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, "") || "";

/**
 * Função interna para requisições
 */
async function request(path, options = {}) {
  const url = `${base}/${path.replace(/^\/+/, "")}`;

  const res = await fetch(url, {
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} - ${text || res.statusText}`);
  }

  return res.status !== 204 ? res.json() : null;
}

/**
 * CRUD de produtos
 */
export function listarProdutos() {
  return request("produtos", { method: "GET" });
}

export function buscarProduto(id) {
  return request(`produtos/${id}`, { method: "GET" });
}

export function criarProduto(data) {
  return request("produtos", { method: "POST", body: JSON.stringify(data) });
}

export function atualizarProduto(id, data) {
  return request(`produtos/${id}`, { method: "PUT", body: JSON.stringify(data) });
}

export function deletarProduto(id) {
  return request(`produtos/${id}`, { method: "DELETE" });
}

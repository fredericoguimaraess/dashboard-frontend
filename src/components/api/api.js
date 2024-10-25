import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000/api';

export const fetchAtivos = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/ativos`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar ativos:', error);
        throw error;
    }
};

export const addAtivo = async (newAtivo) => {
    try {
        const response = await axios.post(`${BASE_URL}/ativos`, newAtivo);
        return response.data;
    } catch (error) {
        console.error('Erro ao adicionar ativo:', error);
        throw error;
    }
};

export const updateAtivo = async (ativoId, newAtivo) => {
    try {
        const response = await axios.put(`${BASE_URL}/ativos/${ativoId}`, newAtivo);
        return response.data;
    } catch (error) {
        console.error('Erro ao atualizar ativo:', error);
        throw error;
    }
};

export const deleteAtivo = async (ativoId) => {
    try {
        await axios.delete(`${BASE_URL}/ativos/${ativoId}`);
    } catch (error) {
        console.error('Erro ao excluir ativo:', error);
        throw error;
    }
};

export const addCompra = async (newCompra) => {
    try {
        const response = await axios.post(`${BASE_URL}/compras`, newCompra);
        return response.data;
    } catch (error) {
        console.error('Erro ao adicionar compra:', error);
        throw error;
    }
};

export const addVenda = async (newVenda) => {
    try {
        const response = await axios.post(`${BASE_URL}/vendas`, newVenda);
        return response.data;
    } catch (error) {
        console.error('Erro ao adicionar venda:', error);
        throw error;
    }
};

export const fetchMovimentacoes = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/movimentacoes`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar movimentações:', error);
        throw error;
    }
};


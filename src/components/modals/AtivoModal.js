import React from 'react';
import { Dialog } from '@headlessui/react';
import Swal from 'sweetalert2';

const AtivoModal = ({ showModal, isEditing, newAtivo, handleInputChange, closeModal, addAtivo, updateAtivo }) => {
    const handleAddOrUpdateAtivo = () => {
        if (!newAtivo.ticket || !newAtivo.data_compra || !newAtivo.quantidade || !newAtivo.cotacao || !newAtivo.tipo) {
            Swal.fire({
                icon: 'error',
                title: 'Campos Vazios',
                text: 'Por favor, preencha todos os campos.',
            });
            return;
        }

        if (isEditing) {
            updateAtivo();
        } else {
            addAtivo();
        }
    };

    return (
        showModal && (
            <Dialog open={showModal} onClose={closeModal} className="fixed inset-0 z-10 overflow-y-auto">
                <div className="flex items-center justify-center min-h-screen px-4">
                    <div className="fixed inset-0 bg-slate-500 opacity-50" />
                    <Dialog.Panel className="bg-white p-8 rounded-[32px] shadow-lg w-1/3 relative">
                        <Dialog.Title className="text-lg font-bold">
                            {isEditing ? 'Editar Ativo' : 'Adicionar Ativo'}
                        </Dialog.Title>
                        <form>
                            {['ticket', 'data_compra', 'quantidade', 'cotacao'].map((field) => (
                                <div className="mt-4" key={field}>
                                    <input
                                        placeholder={field === 'data_compra' ? 'Data de compra' : field === 'quantidade' ? 'Quantidade' : field === 'cotacao' ? 'Cotação' : 'Ticket do Ativo'}
                                        type={field === 'data_compra' ? 'date' : field === 'quantidade' || field === 'cotacao' ? 'number' : 'text'}
                                        name={field}
                                        value={newAtivo[field]}
                                        onChange={handleInputChange}
                                        className="mt-1 p-2 border w-full rounded-2xl bg-gray-100"
                                    />
                                </div>
                            ))}
                            <div className="mt-4">
                                <select
                                    name="tipo"
                                    value={newAtivo.tipo}
                                    onChange={handleInputChange}
                                    className="mt-1 p-2 border w-full rounded-2xl bg-gray-100"
                                >
                                    <option value="">Tipo</option>
                                    <option value="Ação">Ações</option>
                                    <option value="Renda Fixa">Renda Fixa</option>
                                    <option value="Cripto">Criptomoeda</option>
                                    <option value="Fundo">Fundos</option>
                                </select>
                            </div>
                            <div className="mt-4 flex justify-between items-center">
                                <p className="text-sm font-medium">Total: R${(newAtivo.quantidade * newAtivo.cotacao).toFixed(2)}</p>
                                <button
                                    type="button"
                                    className="bg-blue-400 text-white p-2 rounded-xl w-1/3"
                                    onClick={handleAddOrUpdateAtivo}
                                >
                                    {isEditing ? 'Atualizar Ativo' : '+ Adicionar Ativo'}
                                </button>
                            </div>
                        </form>
                    </Dialog.Panel>
                </div>
            </Dialog>
        )
    );
};

export default AtivoModal;

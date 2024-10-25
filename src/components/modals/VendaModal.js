import React from 'react';
import { Dialog } from '@headlessui/react';
import Swal from 'sweetalert2';

const VendaModal = ({ showVendaModal, vendaModalRef, newVenda, handleVendaChange, addVenda, closeModal }) => {
    const handleAddVenda = () => {
        if (!newVenda.ticket || !newVenda.data_venda || !newVenda.quantidade) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos Incompletos',
                text: 'Por favor, preencha todos os campos.',
            });
            return;
        }
        addVenda();
    };

    return (
        showVendaModal && (
            <Dialog open={showVendaModal} onClose={closeModal} className="fixed inset-0 z-10 overflow-y-auto">
                <div className="flex items-center justify-center min-h-screen px-4">
                    <div className="fixed inset-0 bg-slate-500 opacity-50" />
                    <Dialog.Panel className="bg-white p-8 rounded-[32px] shadow-lg w-1/3 relative" ref={vendaModalRef}>
                        <Dialog.Title className="text-lg font-bold">Nova Venda</Dialog.Title>
                        <form>
                            {['ticket', 'data_venda', 'quantidade'].map((field) => (
                                <div className="mt-4" key={field}>
                                    <input
                                        placeholder={field === 'data_venda' ? 'Data de venda' : field === 'quantidade' ? 'Quantidade' : field === 'cotacao' ? 'Cotação' : 'Ticket do Ativo'}
                                        type={field === 'data_venda' ? 'date' : field === 'quantidade' ? 'number' : 'text'}
                                        name={field}
                                        value={newVenda[field]}
                                        onChange={handleVendaChange}
                                        className="mt-1 p-2 border w-full rounded-2xl bg-gray-100"
                                        disabled={field === 'ticket'}
                                    />
                                </div>
                            ))}
                            <div className="mt-4 flex justify-end">
                                <button
                                    type="button"
                                    className="bg-blue-400 text-white p-2 rounded-xl w-1/3"
                                    onClick={handleAddVenda}
                                >
                                    + Adicionar Venda
                                </button>
                            </div>
                        </form>
                    </Dialog.Panel>
                </div>
            </Dialog>
        )
    );
};

export default VendaModal;

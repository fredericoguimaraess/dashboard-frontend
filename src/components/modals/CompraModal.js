import React from 'react';
import { Dialog } from '@headlessui/react';
import Swal from 'sweetalert2';

const CompraModal = ({ showCompraModal, compraModalRef, newCompra, handleCompraChange, addCompra, closeModal }) => {
    const handleAddCompra = () => {
        if (!newCompra.ticket || !newCompra.data_compra || !newCompra.quantidade || !newCompra.cotacao) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos Incompletos',
                text: 'Por favor, preencha todos os campos.',
            });
            return;
        }
        addCompra();
    };

    return (
        showCompraModal && (
            <Dialog open={showCompraModal} onClose={closeModal} className="fixed inset-0 z-10 overflow-y-auto">
                <div className="flex items-center justify-center min-h-screen px-4">
                    <div className="fixed inset-0 bg-slate-500 opacity-50" />
                    <Dialog.Panel className="bg-white p-8 rounded-[32px] shadow-lg w-1/3 relative" ref={compraModalRef}>
                        <Dialog.Title className="text-lg font-bold">Nova Compra</Dialog.Title>
                        <form>
                            {['ticket', 'data_compra', 'quantidade', 'cotacao'].map((field) => (
                                <div className="mt-4" key={field}>
                                    <input
                                        placeholder={field === 'data_compra' ? 'Data de compra' : field === 'quantidade' ? 'Quantidade' : field === 'cotacao' ? 'Cotação' : 'Ticket do Ativo'}
                                        type={field === 'data_compra' ? 'date' : field === 'quantidade' || field === 'cotacao' ? 'number' : 'text'}
                                        name={field}
                                        value={newCompra[field]}
                                        onChange={handleCompraChange}
                                        className="mt-1 p-2 border w-full rounded-2xl bg-gray-100"
                                        disabled={field === 'ticket'}
                                    />
                                </div>
                            ))}
                            <div className="mt-4 flex justify-between items-center">
                                <p className="text-sm font-medium">Total: R${(newCompra.quantidade * newCompra.cotacao).toFixed(2)}</p>
                                <button
                                    type="button"
                                    className="bg-blue-400 text-white p-2 rounded-xl w-1/3"
                                    onClick={handleAddCompra}
                                >
                                    + Adicionar Compra
                                </button>
                            </div>
                        </form>
                    </Dialog.Panel>
                </div>
            </Dialog>
        )
    );
};

export default CompraModal;

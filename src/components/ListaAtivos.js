import React, { useState, useEffect } from 'react';

const ListaAtivos = ({ ativos, handleDropdown, showDropdown, openCompraModal, openVendaModal, editAtivo, deleteAtivo, itemsPerPage, page, setPage, setShowModal, resetForm }) => {
    const [ativosExibidos, setAtivosExibidos] = useState([]);

    useEffect(() => {
        setAtivosExibidos(ativos.slice((page - 1) * itemsPerPage, page * itemsPerPage));
    }, [ativos, page, itemsPerPage]);

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    return (
        <div className="col-span-3 bg-white p-6 shadow-lg rounded-3xl h-full flex flex-col" key={ativos.length}>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm font-bold">Lista de ativos</h2>
                <button
                    className="bg-blue-400 text-white p-2 rounded-xl shadow font-semibold text-sm w-1/4"
                    onClick={() => { setShowModal(true); resetForm(); }}
                >
                    + Adicionar Ativo
                </button>
            </div>
            <input
                type="text"
                placeholder="Buscar ativo"
                className="border rounded-lg mb-4 bg-gray-100 font-medium text-sm w-1/6 pl-4"
                onChange={(e) => {
                    const searchTerm = e.target.value.toLowerCase();
                    setAtivosExibidos(ativos.filter(ativo => ativo.ticket.toLowerCase().includes(searchTerm))
                        .slice((page - 1) * itemsPerPage, page * itemsPerPage));
                }}
            />
            <ul className="mt-4 flex-grow">
                {ativosExibidos.map(ativo => {
                    let initials = '';
                    let bgColor = '';
                    let textColor = '';
                    switch (ativo.tipo) {
                        case 'Ação':
                            initials = 'AC';
                            bgColor = 'rgba(255, 159, 64, 1)';
                            textColor = 'black';
                            break;
                        case 'Fundo':
                            initials = 'FII';
                            bgColor = 'rgba(13, 37, 53, 1)';
                            textColor = 'white';
                            break;
                        case 'Renda Fixa':
                            initials = 'TD';
                            bgColor = 'rgba(244, 190, 55, 1)';
                            textColor = 'black';
                            break;
                        default:
                            initials = 'CR';
                            bgColor = 'rgba(83, 136, 216, 1)';
                            textColor = 'white';
                            break;
                    }
                    const saldoAtual = (ativo.quantidade * ativo.cotacao).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                    return (
                        <li key={ativo.id} className="bg-gray-50 p-2 rounded mb-6 flex justify-between items-center h-24">
                            <div className="grid grid-cols-3 gap-4 w-full font-medium text-sm text-left">
                                <span className="flex items-center">
                                    <span style={{ backgroundColor: bgColor, color: textColor }} className="flex items-center justify-center w-12 h-12 rounded-full font-bold mr-2">
                                        {initials}
                                    </span>
                                    {ativo.ticket}
                                </span>
                                <span className='mt-4'>Saldo Atual: <strong>{saldoAtual}</strong></span>
                                <span className='mt-4'>Quantidade: <strong>{ativo.quantidade}</strong></span>
                            </div>
                            <div className="relative flex">
                                <button
                                    className="text-black rounded-xl bg-blue-100 flex items-center justify-center w-12 h-8"
                                    onClick={() => handleDropdown(ativo.id)}
                                >
                                    &#x2022;&#x2022;&#x2022;
                                </button>
                                {showDropdown === ativo.id && (
                                    <div className="dropdown-menu absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
                                        <button
                                            className="block px-4 py-2 text-gray-600 hover:bg-gray-100 w-full text-left"
                                            onClick={() => { openCompraModal(ativo); handleDropdown(null); }}
                                        >
                                            Nova Compra
                                        </button>
                                        <button
                                            className="block px-4 py-2 text-gray-600 hover:bg-gray-100 w-full text-left"
                                            onClick={() => { openVendaModal(ativo); handleDropdown(null); }}
                                        >
                                            Nova Venda
                                        </button>
                                        <button
                                            className="block px-4 py-2 text-gray-600 hover:bg-gray-100 w-full text-left"
                                            onClick={() => { editAtivo(ativo); handleDropdown(null); }}
                                        >
                                            Editar Ativo
                                        </button>
                                        <button
                                            className="block px-4 py-2 text-gray-600 hover:bg-gray-100 w-full text-left"
                                            onClick={() => { deleteAtivo(ativo.id); handleDropdown(null); }}
                                        >
                                            Excluir
                                        </button>
                                    </div>
                                )}
                            </div>
                        </li>
                    );
                })}
            </ul>
            {ativos.length > itemsPerPage && (
                <div className="flex space-x-2 mt-4 justify-end">
                    {(() => {
                        const buttons = [];
                        for (let num = 1; num <= Math.ceil(ativos.length / itemsPerPage); num++) {
                            buttons.push(
                                <button
                                    key={num}
                                    className={`bg-gray-500 text-white p-2 rounded ${page === num ? 'bg-gray-700' : ''}`}
                                    onClick={() => handlePageChange(num)}
                                >
                                    {num}
                                </button>
                            );
                        }
                        return buttons;
                    })()}
                </div>
            )}
        </div>
    );
};

export default ListaAtivos;

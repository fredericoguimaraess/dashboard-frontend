import React, { useState, useEffect, useRef } from 'react';
import ECharts from 'echarts-for-react';
import ListaAtivos from './ListaAtivos';
import AtivoModal from './modals/AtivoModal';
import CompraModal from './modals/CompraModal';
import VendaModal from './modals/VendaModal';
import Swal from 'sweetalert2';
import { calcSaldoBruto, formatCurrency, getEchartsOption } from './util/utils';
import { fetchAtivos, addAtivo, updateAtivo, deleteAtivo, addCompra, addVenda, fetchMovimentacoes } from './api/api';

const Dashboard = () => {
    const [ativos, setAtivos] = useState([]);
    const [page, setPage] = useState(1);
    const itemsPerPage = 3;
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedAtivo, setSelectedAtivo] = useState(null);
    const [showDropdown, setShowDropdown] = useState(null);
    const [showCompraModal, setShowCompraModal] = useState(false);
    const [showVendaModal, setShowVendaModal] = useState(false);
    const [comprasNoMes, setComprasNoMes] = useState(0);
    const [vendasNoMes, setVendasNoMes] = useState(0);
    const [newCompra, setNewCompra] = useState({ ticket: '', data_compra: '', quantidade: '', cotacao: '', operacao: 'Compra' });
    const [newVenda, setNewVenda] = useState({ ticket: '', data_venda: '', quantidade: '', operacao: 'Venda' });
    const [newAtivo, setNewAtivo] = useState({
        ticket: '',
        data_compra: '',
        quantidade: '',
        cotacao: '',
        tipo: '',
    });

    const compraModalRef = useRef();
    const vendaModalRef = useRef();

    const atualizarMovimentacoes = async () => {
        try {
            const movimentacoes = await fetchMovimentacoes();

            const compras = movimentacoes.filter(mov => mov.tipo === 'Compra')[0]?.total_quantidade || 0;
            const vendas = movimentacoes.filter(mov => mov.tipo === 'Venda')[0]?.total_quantidade || 0;

            setComprasNoMes(compras);
            setVendasNoMes(vendas);
        } catch (error) {
            console.error('Erro ao buscar movimentações:', error);
        }
    };

    const fetchData = async () => {
        const data = await fetchAtivos();
        setAtivos(data);
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        atualizarMovimentacoes();
    }, [ativos]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewAtivo({ ...newAtivo, [name]: value });
    };

    const handleCompraChange = (e) => {
        const { name, value } = e.target;
        setNewCompra({ ...newCompra, [name]: value });
    };

    const handleVendaChange = (e) => {
        const { name, value } = e.target;
        setNewVenda({ ...newVenda, [name]: value });
    };

    const openCompraModal = (ativo) => {
        setNewCompra({ ticket: ativo.ticket, data_compra: '', quantidade: '', cotacao: '', tipo: ativo.tipo, operacao: 'Compra' });
        setShowCompraModal(true);
    };

    const openVendaModal = (ativo) => {
        setNewVenda({ ticket: ativo.ticket, data_venda: '', quantidade: '', cotacao: ativo.cotacao, tipo: ativo.tipo, operacao: 'Venda' });
        setShowVendaModal(true);
    };

    const handleAddAtivo = async () => {
        const data = await addAtivo(newAtivo);
        setAtivos([...ativos, data]);
        closeModal();
    };

    const handleUpdateAtivo = async () => {
        const data = await updateAtivo(selectedAtivo.id, newAtivo);
        setAtivos(ativos.map(ativo => (ativo.id === selectedAtivo.id ? data : ativo)));
        closeModal();
    };

    const editAtivo = (ativo) => {
        setSelectedAtivo(ativo);
        setNewAtivo(ativo);
        setIsEditing(true);
        setShowModal(true);
    };

    const handleDeleteAtivo = async (ativoId) => {
        const result = await Swal.fire({
            title: 'Tem certeza?',
            text: 'Você realmente quer excluir este ativo?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sim, excluir!',
            cancelButtonText: 'Não, cancelar',
        });

        if (result.isConfirmed) {
            try {
                await deleteAtivo(ativoId);
                setAtivos(prevAtivos => prevAtivos.filter(ativo => ativo.id !== ativoId));
                Swal.fire('Excluído!', 'O ativo foi excluído.', 'success');
            } catch (error) {
                console.error('Erro ao excluir ativo:', error);
                Swal.fire('Erro!', 'Houve um problema ao excluir o ativo.', 'error');
            }
        }
    };


    const handleAddCompra = async () => {
        try {
            const data = await addCompra(newCompra);

            setAtivos(prevAtivos => prevAtivos.map(ativo =>
                ativo.ticket === newCompra.ticket
                    ? { ...ativo, quantidade: parseInt(ativo.quantidade, 10) + parseInt(newCompra.quantidade, 10), cotacao: data.cotacao }
                    : ativo
            ));

            setAtivos(prevAtivos => {
                const exists = prevAtivos.some(ativo => ativo.ticket === data.ticket);
                return exists ? prevAtivos : [...prevAtivos, data];
            });

            closeModal();
        } catch (error) {
            console.error('Erro ao adicionar compra:', error);
        }
    };


    const handleAddVenda = async () => {
        const ativo = ativos.find(a => a.ticket === newVenda.ticket);

        if (!ativo || newVenda.quantidade > ativo.quantidade) {
            Swal.fire({
                icon: 'error',
                title: 'Quantidade Insuficiente',
                text: 'Você não possui quantidade suficiente desse ativo para realizar a venda.',
            });
            return;
        }

        try {
            await addVenda(newVenda);

            setAtivos(prevAtivos => prevAtivos.reduce((result, ativo) => {
                if (ativo.ticket === newVenda.ticket) {
                    const updatedQuantidade = ativo.quantidade - newVenda.quantidade;
                    if (updatedQuantidade > 0) {
                        result.push({ ...ativo, quantidade: updatedQuantidade });
                    }
                } else {
                    result.push(ativo);
                }
                return result;
            }, []));

            closeModal();
        } catch (error) {
            console.error('Erro ao adicionar venda:', error);
        }
    };



    const handleDropdown = (id) => {
        setShowDropdown(showDropdown === id ? null : id);
    };

    const closeModal = () => {
        setShowModal(false);
        setShowCompraModal(false);
        setShowVendaModal(false);
        resetForm();
    };

    const resetForm = () => {
        setNewAtivo({ ticket: '', data_compra: '', quantidade: '', cotacao: '', tipo: '' });
        setSelectedAtivo(null);
        setIsEditing(false);
    };

    return (
        <div className="container mx-auto p-4">
            <div className="gap-4 mt-8 mb-8 text-left font-bold bg-white border p-3 shadow-lg rounded-3xl pl-8">
                <h2 className="text-sm"><i className="fas fa-home"></i> > Meus Investimentos</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 text-left font-bold">
                <div className="bg-white border p-6 shadow-lg rounded-3xl">
                    <h2 className="text-sm mb-2">Saldo Bruto</h2>
                    <p className="text-base">{formatCurrency(calcSaldoBruto(ativos))}</p>
                </div>
                <div className="bg-white border p-6 shadow-lg rounded-3xl">
                    <h2 className="text-sm mb-2">Total de Ativos</h2>
                    <p className="text-base">{ativos.length}</p>
                </div>
                <div className="bg-white border p-6 shadow-lg rounded-3xl">
                    <h2 className="text-sm mb-2">Movimentações no Mês</h2>
                    <p className="text-base">{comprasNoMes} compras - {vendasNoMes} vendas</p>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="col-span-2 bg-white p-6 shadow-lg rounded-3xl h-80">
                    <ECharts
                        key={calcSaldoBruto(ativos)}
                        option={getEchartsOption(ativos)}
                        className="w-full h-full"
                    />
                </div>
                <ListaAtivos
                    ativos={ativos}
                    handleDropdown={handleDropdown}
                    showDropdown={showDropdown}
                    openCompraModal={openCompraModal}
                    openVendaModal={openVendaModal}
                    editAtivo={editAtivo}
                    deleteAtivo={handleDeleteAtivo}
                    itemsPerPage={itemsPerPage}
                    page={page}
                    setPage={setPage}
                    setShowModal={setShowModal}
                    resetForm={resetForm}
                />
            </div>
            <div className="gap-4 mt-16 text-center font-bold bg-white border p-4 shadow-lg rounded-3xl">
                <h2 className="text-sm">2024 - Todos os direitos reservados</h2>
            </div>
            <AtivoModal
                showModal={showModal}
                isEditing={isEditing}
                newAtivo={newAtivo}
                handleInputChange={handleInputChange}
                closeModal={closeModal}
                addAtivo={handleAddAtivo}
                updateAtivo={handleUpdateAtivo}
            />
            <CompraModal
                showCompraModal={showCompraModal}
                compraModalRef={compraModalRef}
                newCompra={newCompra}
                handleCompraChange={handleCompraChange}
                addCompra={handleAddCompra}
                closeModal={closeModal}
            />
            <VendaModal
                showVendaModal={showVendaModal}
                vendaModalRef={vendaModalRef}
                newVenda={newVenda}
                handleVendaChange={handleVendaChange}
                addVenda={handleAddVenda}
                closeModal={closeModal}
            />
        </div>
    );
};

export default Dashboard;

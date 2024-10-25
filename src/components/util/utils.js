export const calcSaldoBruto = (ativos) => {
    return ativos.reduce((acc, ativo) => acc + (ativo.quantidade * ativo.cotacao), 0);
};

export const calcSaldoPorTipo = (ativos) => {
    const saldoPorTipo = {
        Cripto: 0,
        Fundo: 0,
        Ação: 0,
        'Renda Fixa': 0,
    };
    ativos.forEach(ativo => {
        const valor = ativo.quantidade * ativo.cotacao;
        if (saldoPorTipo.hasOwnProperty(ativo.tipo)) {
            saldoPorTipo[ativo.tipo] += valor;
        }
    });
    return saldoPorTipo;
};

export const formatCurrency = (value) => {
    return value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });
};

export const getEchartsOption = (ativos) => {
    const saldoPorTipo = calcSaldoPorTipo(ativos);
    const totalSaldo = calcSaldoBruto(ativos);
    const data = ativos.map(ativo => {
        let color = '';
        switch (ativo.tipo) {
            case 'Ação':
                color = 'rgba(255, 159, 64, 1)';
                break;
            case 'Fundo':
                color = 'rgba(13, 37, 53, 1)';
                break;
            case 'Renda Fixa':
                color = 'rgba(244, 190, 55, 1)';
                break;
            default:
                color = 'rgba(83, 136, 216, 1)';
                break;
        }
        return {
            value: ativo.quantidade * ativo.cotacao,
            name: ativo.tipo,
            itemStyle: {
                color,
            },
        };
    });
    data.sort((a, b) => a.itemStyle.color.localeCompare(b.itemStyle.color));
    return {
        tooltip: {
            trigger: 'item',
        },
        legend: {
            icon: 'circle',
            right: 'right',
            top: 'middle',
            orient: 'horizontal',
            data: Object.keys(saldoPorTipo),
            formatter: name => {
                const value = saldoPorTipo[name] || 0;
                return `${name}: {bold|${formatCurrency(value)}}`;
            },
            textStyle: {
                rich: {
                    bold: {
                        fontWeight: 'bold',
                    },
                },
            },
            itemGap: 20,
        },
        series: [
            {
                name: 'Investimentos',
                type: 'pie',
                radius: ['55%', '80%'],
                center: ['50%', '50%'],
                left: -240,
                avoidLabelOverlap: false,
                label: {
                    show: true,
                    position: 'center',
                    formatter: `${formatCurrency(totalSaldo)}`,
                    fontSize: 14,
                    fontWeight: 'bold',
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: '20',
                        fontWeight: 'bold',
                    },
                },
                labelLine: {
                    show: false,
                },
                data,
            },
        ],
    };
};

import React, { useEffect } from 'react';
import * as echarts from 'echarts';

interface PieChartProps {
    title: string;
    data: { value: number, name: string }[];
}

const PieChart: React.FC<PieChartProps> = ({ title, data }) => {
    useEffect(() => {
        const chartDom = document.getElementById(title) as HTMLElement;
        const myChart = echarts.init(chartDom);
        const option = {
            title: {
                text: title,
                left: 'center'
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                left: 'left'
            },
            series: [
                {
                    name: title,
                    type: 'pie',
                    radius: '50%',
                    data,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
        myChart.setOption(option);
    }, [title, data]);

    return <div id={title} style={{ width: '100%', height: '400px' }} />;
};

export default PieChart;


import React, { useEffect } from 'react';
import Chart from 'chart.js/auto';
import './DashboardCharts.css';

const DashboardCharts = () => {
  useEffect(() => {
    // Gráfico de Pizza
    new Chart(document.getElementById('graficoPizza'), {
      type: 'doughnut',
      data: {
        labels: ['Moradia', 'Alimentação', 'Transporte', 'Saúde', 'Lazer', 'Outros'],
        datasets: [{
          data: [3500, 2800, 1700, 1500, 1000, 500],
          backgroundColor: ['#3498db', '#2ecc71', '#f39c12', '#e74c3c', '#9b59b6', '#95a5a6'],
          borderWidth: 0
        }]
      },
      options: {
        cutout: '60%',
        plugins: {
          legend: {
            position: 'right',
            labels: {
              boxWidth: 14,
              padding: 10
            }
          }
        }
      }
    });

    // Gráfico de Linha
    new Chart(document.getElementById('graficoLinha'), {
      type: 'line',
      data: {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
        datasets: [
          {
            label: 'Receitas',
            data: [7000, 7500, 8000, 8500, 8600, 8700],
            borderColor: '#2ecc71',
            backgroundColor: 'rgba(46,204,113,0.1)',
            fill: true,
            tension: 0.3
          },
          {
            label: 'Despesas',
            data: [4000, 3800, 3600, 3400, 3200, 3000],
            borderColor: '#e74c3c',
            backgroundColor: 'rgba(231,76,60,0.1)',
            fill: true,
            tension: 0.3
          }
        ]
      },
      options: {
        plugins: {
          legend: {
            labels: {
              usePointStyle: true
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return 'R$ ' + value.toLocaleString('pt-BR');
              }
            }
          }
        }
      }
    });
  }, []);

  return (
    <div className="graficos-container">
      <div className="grafico-box">
        <h3>Despesas por Categoria</h3>
        <canvas id="graficoPizza"></canvas>
      </div>
      <div className="grafico-box">
        <h3>Evolução Financeira</h3>
        <canvas id="graficoLinha"></canvas>
      </div>
    </div>
  );
};

export default DashboardCharts;


function formatarMoeda(valor) {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2
  });
}

function aplicarFormatacaoDashboard() {
  const receitas = Number(document.getElementById("totalReceitas").innerText.replace(/[^\d,-]/g, '').replace(',', '.')) || 0;
  const despesas = Number(document.getElementById("totalDespesas").innerText.replace(/[^\d,-]/g, '').replace(',', '.')) || 0;
  const saldo = Number(document.getElementById("saldoGeral").innerText.replace(/[^\d,-]/g, '').replace(',', '.')) || 0;

  document.getElementById("totalReceitas").innerText = formatarMoeda(receitas);
  document.getElementById("totalDespesas").innerText = formatarMoeda(despesas);
  document.getElementById("saldoGeral").innerText = formatarMoeda(saldo);
}

document.addEventListener("DOMContentLoaded", aplicarFormatacaoDashboard);

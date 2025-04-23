
function formatarMoeda(valor) {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2
  });
}

function aplicarFormatacaoDashboard() {
  const receitas = Number(document.getElementById("totalReceitas")?.innerText.replace(/[^\d,-]/g, '').replace(',', '.')) || 0;
  const despesas = Number(document.getElementById("totalDespesas")?.innerText.replace(/[^\d,-]/g, '').replace(',', '.')) || 0;
  const saldo = Number(document.getElementById("saldoGeral")?.innerText.replace(/[^\d,-]/g, '').replace(',', '.')) || 0;

  if (document.getElementById("totalReceitas")) document.getElementById("totalReceitas").innerText = formatarMoeda(receitas);
  if (document.getElementById("totalDespesas")) document.getElementById("totalDespesas").innerText = formatarMoeda(despesas);
  if (document.getElementById("saldoGeral")) document.getElementById("saldoGeral").innerText = formatarMoeda(saldo);
}

document.addEventListener("DOMContentLoaded", aplicarFormatacaoDashboard);

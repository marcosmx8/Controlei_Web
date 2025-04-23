
function formatarMoeda(valor) {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2
  });
}

function aplicarFormatacaoDashboard() {
  const receitas = parseFloat(document.getElementById("totalReceitas").innerText) || 0;
  const despesas = parseFloat(document.getElementById("totalDespesas").innerText) || 0;
  const saldo = parseFloat(document.getElementById("saldoGeral").innerText) || 0;

  document.getElementById("totalReceitas").innerText = formatarMoeda(receitas);
  document.getElementById("totalDespesas").innerText = formatarMoeda(despesas);
  document.getElementById("saldoGeral").innerText = formatarMoeda(saldo);
}

document.addEventListener("DOMContentLoaded", aplicarFormatacaoDashboard);

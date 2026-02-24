// ===============================
// js/site.js
// ===============================

// URL base da API (Somee)
const apiBase = "https://www.pagtomercadopago.ceuirmaolakota.com.br";

// Tipo de agenda que você quer filtrar
const tipoAgenda = 1;

// Inicia carregamento
document.addEventListener("DOMContentLoaded", () => {
    carregarAgendamentos(tipoAgenda);
});

/**
 * Função para carregar agendamentos da API
 */
async function carregarAgendamentos(tipo) {
    const container = document.getElementById("agendamentosCards");

    if (!container) return;

    container.innerHTML = "<p>Carregando agendamentos...</p>";

    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);

        const response = await fetch(`${apiBase}?tipo=${tipo}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            signal: controller.signal
        });

        clearTimeout(timeout);

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        const agendamentos = await response.json();

        if (!Array.isArray(agendamentos) || agendamentos.length === 0) {
            container.innerHTML = "<p>Nenhum agendamento cadastrado ainda.</p>";
            return;
        }

        renderAgendamentos(agendamentos);

    } catch (error) {
        console.error("Erro ao carregar agendamentos:", error);

        if (error.name === "AbortError") {
            container.innerHTML = "<p>Tempo de resposta excedido. Tente novamente.</p>";
        } else {
            container.innerHTML = "<p>Erro ao carregar agendamentos. Tente novamente mais tarde.</p>";
        }
    }
}

/**
 * Cria objeto Date unindo data ISO e hora separada
 */
function parseDateTime(isoDateStr, timeStr) {
    if (!isoDateStr) return null;

    const datePart = isoDateStr.split("T")[0];
    let finalStr = datePart;

    if (timeStr) {
        finalStr += `T${timeStr}:00`;
    } else {
        finalStr += "T00:00:00";
    }

    const dateObj = new Date(finalStr);
    return isNaN(dateObj.getTime()) ? null : dateObj;
}

/**
 * Renderiza os cards de agendamento
 */
function renderAgendamentos(agendamentos) {
    const container = document.getElementById("agendamentosCards");
    container.innerHTML = "";

    agendamentos.forEach(a => {
        const card = document.createElement("div");
        card.classList.add("card");

        const dataObj = parseDateTime(a.data, a.hora);

        const dataFormatada = dataObj
            ? dataObj.toLocaleString("pt-BR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            })
            : "Data não informada";

        const titulo = a.evento || "Evento sem título";
        const valor = a.valor !== undefined
            ? `Valor: R$ ${Number(a.valor).toFixed(2)}`
            : "Valor não informado";

        const mensagemWhatsApp = encodeURIComponent(
            `Olá, quero reservar vaga para "${titulo}" em ${dataFormatada}`
        );

        const waLink = `https://wa.me/5511930692059?text=${mensagemWhatsApp}`;

        card.innerHTML = `
            <span class="date-badge">${dataFormatada}</span>
            <h3>${titulo}</h3>
            <p>${valor}</p>
            <a class="btn" href="${waLink}" target="_blank">
                Reservar Vaga pelo WhatsApp
            </a>
        `;

        container.appendChild(card);
    });
}
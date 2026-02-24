// js/site.js

// Endpoint HTTPS da função Netlify
const apiBase = "/.netlify/functions/proxyAgenda";

// Tipo de agenda que você quer filtrar
const tipoAgenda = 1;
carregarAgendamentos(tipoAgenda);

/**
 * Função para carregar agendamentos da API
 */
async function carregarAgendamentos(tipo) {
    const container = document.getElementById("agendamentosCards");
    container.innerHTML = "<p>Carregando agendamentos...</p>";

    try {
        const response = await fetch(`${apiBase}?tipo=${tipo}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });

        if (!response.ok) {
            throw new Error(`Erro ao buscar agendamentos: ${response.status}`);
        }

        const agendamentos = await response.json();

        if (!agendamentos || agendamentos.length === 0) {
            container.innerHTML = "<p>Nenhum agendamento cadastrado ainda.</p>";
            return;
        }

        renderAgendamentos(agendamentos);

    } catch (error) {
        console.error("Erro ao carregar agendamentos:", error);
        container.innerHTML = "<p>Erro ao carregar agendamentos. Tente novamente mais tarde.</p>";
    }
}

/**
 * Cria objeto Date unindo data ISO e hora separada
 * @param {string} isoDateStr - string ISO: "YYYY-MM-DDTHH:MM:SSZ" ou "YYYY-MM-DD"
 * @param {string} timeStr - string HH:MM
 * @returns {Date|null}
 */
function parseDateTime(isoDateStr, timeStr) {
    if (!isoDateStr) return null;

    // Extrai apenas a parte da data
    const datePart = isoDateStr.split("T")[0]; // "YYYY-MM-DD"
    let finalStr = datePart;

    // Adiciona hora se existir
    if (timeStr) {
        finalStr += `T${timeStr}:00`; // "YYYY-MM-DDTHH:MM:00"
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

        // Cria Date com data + hora
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

        // Título e valor
        const titulo = a.evento || "Evento sem título";
        const valor = a.valor !== undefined ? `Valor: R$ ${a.valor}` : "Valor não informado";

        // Link WhatsApp com data e hora
        const mensagemWhatsApp = encodeURIComponent(
            `Olá, quero reservar vaga para "${titulo}" em ${dataFormatada}`
        );
        const waLink = `https://wa.me/5511930692059?text=${mensagemWhatsApp}`;

        // Monta o card
        card.innerHTML = `
            <span class="date-badge">${dataFormatada}</span>
            <h3>${titulo}</h3>
            <p>${valor}</p>
            <a class="btn" href="${waLink}" target="_blank">Reservar Vaga pelo WhatsApp</a>
        `;

        container.appendChild(card);
    });
}

/*
  https://www.hostazul.com.br/planos/hospedagem-de-sites
*/
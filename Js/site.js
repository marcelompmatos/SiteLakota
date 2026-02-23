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
 * Converte string YYYY-MM-DD em Date no fuso UTC
 */
function parseDateYYYYMMDD(str) {
    if (!str) return null;
    const [year, month, day] = str.split("-");
    return new Date(Date.UTC(year, month - 1, day));
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

        // Formata a data corretamente
        const dataObj = parseDateYYYYMMDD(a.data);
        const dataFormatada = dataObj 
            ? dataObj.toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "long",
                year: "numeric"
              })
            : "Data não informada";

        // Título, hora e valor
        const titulo = a.evento || "Evento sem título";
        const hora = a.hora ? ` - ${a.hora}` : "";
        const valor = a.valor !== undefined ? `Valor: R$ ${a.valor}` : "Valor não informado";

        // Link WhatsApp com mensagem dinâmica
        const mensagemWhatsApp = encodeURIComponent(
            `Olá, quero reservar vaga para "${titulo}" em ${dataFormatada}${hora}`
        );
        const waLink = `https://wa.me/5511930692059?text=${mensagemWhatsApp}`;

        // Monta o card
        card.innerHTML = `
            <span class="date-badge">${dataFormatada}${hora}</span>
            <h3>${titulo}</h3>
            <p>${valor}</p>
            <a class="btn" href="${waLink}" target="_blank">Reservar Vaga pelo WhatsApp</a>
        `;

        container.appendChild(card);
    });
}
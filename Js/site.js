const apiBase = "http://marcelompm.somee.com/PagtoMercadoPago"; // ajuste se necessário

// Tipo de agenda que você quer filtrar
const tipoAgenda = 1; 
carregarAgendamentos(tipoAgenda);

async function carregarAgendamentos(tipo) { 
    const container = document.getElementById("agendamentosCards");
    container.innerHTML = "<p>Carregando agendamentos...</p>";

    try {
        const response = await fetch(`${apiBase}/api/agenda?tipo=${tipo}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
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
        container.innerHTML = "<p>Erro ao carregar agendamentos.</p>";
    }
}

function renderAgendamentos(agendamentos) {
    const container = document.getElementById("agendamentosCards");
    container.innerHTML = ""; // limpa o conteúdo antes de renderizar

    agendamentos.forEach(a => {
        const card = document.createElement("div");
        card.classList.add("card");

        // Formatar a data para formato legível (DD/MM/YYYY)
        const dataObj = new Date(a.data);
        const dataFormatada = dataObj.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "long",
            year: "numeric"
        });

        const titulo = a.evento || "Evento sem título";
        const hora = a.hora ? ` - ${a.hora}` : "";
        const valor = a.valor !== undefined ? `Valor: R$ ${a.valor}` : "";

        card.innerHTML = `
            <span class="date-badge">${dataFormatada}${hora}</span>
            <h3>${titulo}</h3>
            <p>${valor}</p>
            <a class="btn" href="https://wa.me/5511930692059" target="_blank">Reservar Vaga pelo WhatsApp</a>
        `;

        container.appendChild(card);
    });
}
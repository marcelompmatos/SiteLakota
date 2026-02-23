const apiBase = "http://marcelompm.somee.com/PagtoMercadoPago"; // ajuste se necessário

// Exemplo de token de autenticação
const token = localStorage.getItem("token"); // ou outro método que você use

// Tipo de agenda que você quer filtrar
const tipoAgenda = 1; 
carregarAgendamentos(tipoAgenda);

async function carregarAgendamentos(tipo) { 
    const container = document.getElementById("agendamentosCards");
    container.innerHTML = "<p>Carregando agendamentos...</p>";

    if (!token) {
        container.innerHTML = "<p>Usuário não autenticado.</p>";
        console.warn("Token não encontrado. Redirecionando para login.");
        // window.location.href = "login.html"; // descomente se quiser redirecionar
        return;
    }

    try {
        const response = await fetch(`${apiBase}/api/agenda?tipo=${tipo}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
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

        // Garantir campos opcionais
        const data = a.data || "Data não informada";
        const titulo = a.titulo || "Título não informado";
        const descricao = a.descricao || "";
        const vagas = a.vagas ?? "N/A"; // se for zero ou undefined
        const telefone = a.telefone || "551100000000";

        card.innerHTML = `
            <span class="date-badge">${data}</span>
            <h3>${titulo}</h3>
            <p>${descricao}</p>
            <p><strong>Vagas Limitadas: ${vagas}</strong></p>
            <a class="btn" href="https://wa.me/${telefone}" target="_blank">Reservar Vaga pelo WhatsApp</a>
        `;

        container.appendChild(card);
    });
}
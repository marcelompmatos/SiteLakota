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

        const response = await fetch(`${apiBase}/api/agenda?tipo=${tipo}`, {
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

    // Ordena por data (mais próximo primeiro)
    agendamentos.sort((a, b) => {
        const da = parseDateTime(a.data, a.hora);
        const db = parseDateTime(b.data, b.hora);
        return da - db;
    });

    agendamentos.forEach(a => {

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
            ? `R$ ${Number(a.valor).toFixed(2)}`
            : null;

        const mensagemWhatsApp = encodeURIComponent(
            `Olá, quero reservar vaga para "${titulo}" em ${dataFormatada}`
        );

        const waLink = `https://wa.me/5511930692059?text=${mensagemWhatsApp}`;

        const card = document.createElement("div");

        card.innerHTML = `
            <div style="
                background: rgba(255,255,255,0.05);
                padding:28px;
                border-radius:16px;
                margin-bottom:28px;
                border:1px solid rgba(255,255,255,0.08);
                backdrop-filter: blur(4px);
                transition:0.3s ease;
            ">

                <div style="
                    font-size:14px;
                    letter-spacing:1px;
                    color:#bdbdbd;
                    margin-bottom:10px;">
                    ${dataFormatada}
                </div>

                <h3 style="
                    font-size:22px;
                    color:#ffffff;
                    margin-bottom:12px;
                    font-weight:500;">
                    ${titulo}
                </h3>

                ${valor ? `
                    <div style="
                        font-size:18px;
                        font-weight:600;
                        color:#e8d9a0;
                        margin-bottom:18px;">
                        Valor: ${valor}
                    </div>
                ` : ""}

                <a href="${waLink}" target="_blank"
                   style="
                   display:inline-block;
                   padding:12px 26px;
                   border-radius:40px;
                   background:#25D366;
                   color:#ffffff;
                   text-decoration:none;
                   font-weight:500;
                   letter-spacing:0.5px;
                   transition:0.3s ease;">
                   Reservar Vaga pelo WhatsApp
                </a>

            </div>
        `;

        // efeito hover elegante
        card.firstElementChild.onmouseenter = function () {
            this.style.transform = "translateY(-4px)";
            this.style.background = "rgba(255,255,255,0.08)";
        };

        card.firstElementChild.onmouseleave = function () {
            this.style.transform = "translateY(0)";
            this.style.background = "rgba(255,255,255,0.05)";
        };

        container.appendChild(card);
    });

    // Caso não tenha eventos
    if (agendamentos.length === 0) {
        container.innerHTML = `
            <div style="
                text-align:center;
                color:#cfcfcf;
                padding:30px;">
                Nenhum evento disponível no momento.
            </div>
        `;
    }
}

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

    if (!agendamentos || agendamentos.length === 0) {
        container.innerHTML = `
            <div style="
                text-align:center;
                color:#cfcfcf;
                padding:40px;
                font-size:15px;">
                Nenhum evento disponível no momento.
            </div>
        `;
        return;
    }

    // Ordena por data (mais próximo primeiro)
    agendamentos.sort((a, b) => {
        const da = parseDateTime(a.data, a.hora);
        const db = parseDateTime(b.data, b.hora);
        return (da || 0) - (db || 0);
    });

    const fragment = document.createDocumentFragment();

    agendamentos.forEach(a => {

        const dataObj = parseDateTime(a.data, a.hora);

        // 🔹 FORMATAÇÕES
        const dia = dataObj
            ? dataObj.getDate().toString().padStart(2, '0')
            : "--";

        const mes = dataObj
            ? dataObj.toLocaleString("pt-BR", { month: "short" }).toUpperCase()
            : "---";

        const ano = dataObj
            ? dataObj.getFullYear()
            : "";

        const hora = dataObj
            ? dataObj.toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit"
            })
            : "";

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

        const valor = a.valor !== undefined && a.valor !== null
            ? `R$ ${Number(a.valor).toFixed(2)}`
            : null;

        const mensagemWhatsApp = encodeURIComponent(
            `Olá, quero reservar vaga para "${titulo}" em ${dataFormatada}`
        );

        const waLink = `https://wa.me/5511930692059?text=${mensagemWhatsApp}`;

        const wrapper = document.createElement("div");

        wrapper.innerHTML = `
            <div style="
                background: rgba(255,255,255,0.05);
                padding:28px;
                border-radius:16px;
                margin-bottom:22px;
                border:1px solid rgba(255,255,255,0.08);
                backdrop-filter: blur(4px);
                transition:all 0.25s ease;
            ">

                <!-- DATA DESTACADA -->
                <div style="
                    display:flex;
                    align-items:center;
                    gap:16px;
                    margin-bottom:18px;
                ">

                    <div style="
                        min-width:60px;
                        text-align:center;
                        padding:12px 8px;
                        border-radius:14px;
                        background:#e8d9a0;
                        color:#000;
                        font-weight:700;
                        line-height:1.2;
                        box-shadow:0 6px 18px rgba(0,0,0,0.3);
                    ">
                        <div style="font-size:22px;">${dia}</div>
                        <div style="font-size:11px; letter-spacing:1px;">
                            ${mes}
                        </div>
                    </div>

                    <div>
                        <div style="
                            font-size:13px;
                            color:#cfcfcf;
                            letter-spacing:1px;
                        ">
                            ${ano}
                        </div>

                        <div style="
                            font-size:14px;
                            color:#e8d9a0;
                            font-weight:500;
                            margin-top:2px;
                        ">
                            ${hora}
                        </div>
                    </div>

                </div>

                <!-- TÍTULO -->
                <h3 style="
                    font-size:22px;
                    color:#ffffff;
                    margin-bottom:12px;
                    font-weight:500;">
                    ${titulo}
                </h3>

                <!-- VALOR -->
                ${valor ? `
                    <div style="
                        font-size:18px;
                        font-weight:600;
                        color:#e8d9a0;
                        margin-bottom:18px;">
                        Valor: ${valor}
                    </div>
                ` : ""}

                <!-- BOTÃO -->
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
                   transition:0.25s;">
                   Reservar Vaga pelo WhatsApp
                </a>

            </div>
        `;

        const card = wrapper.firstElementChild;

        // 🔥 HOVER MAIS SUAVE
        card.onmouseenter = () => {
            card.style.transform = "translateY(-6px) scale(1.01)";
            card.style.background = "rgba(255,255,255,0.08)";
        };

        card.onmouseleave = () => {
            card.style.transform = "translateY(0) scale(1)";
            card.style.background = "rgba(255,255,255,0.05)";
        };

        fragment.appendChild(wrapper);
    });

    container.appendChild(fragment);
}

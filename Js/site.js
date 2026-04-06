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
                color:#aaa;
                padding:60px 20px;
                font-size:16px;">
                Nenhum evento disponível no momento.
            </div>
        `;
        return;
    }

    agendamentos.sort((a, b) => {
        const da = parseDateTime(a.data, a.hora);
        const db = parseDateTime(b.data, b.hora);
        return (da || 0) - (db || 0);
    });

    const fragment = document.createDocumentFragment();

    agendamentos.forEach(a => {

        const dataObj = parseDateTime(a.data, a.hora);

        const dia = dataObj ? dataObj.getDate().toString().padStart(2, '0') : "--";
        const mes = dataObj ? dataObj.toLocaleString("pt-BR", { month: "short" }).toUpperCase() : "---";
        const ano = dataObj ? dataObj.getFullYear() : "";
        const hora = dataObj
            ? dataObj.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
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
                background: linear-gradient(145deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02));
                padding:30px;
                border-radius:18px;
                margin-bottom:24px;
                border:1px solid rgba(255,255,255,0.08);
                backdrop-filter: blur(8px);
                transition:all 0.35s ease;
                box-shadow:0 10px 30px rgba(0,0,0,0.4);
                position:relative;
                overflow:hidden;
            ">

                <!-- HEADER -->
                <div style="display:flex; align-items:center; gap:18px; margin-bottom:20px;">

                    <!-- DATA BOX -->
                    <div style="
                        min-width:65px;
                        text-align:center;
                        padding:14px 10px;
                        border-radius:14px;
                        background: linear-gradient(135deg, #f5e6a8, #d6b85c);
                        color:#000;
                        font-weight:700;
                        box-shadow:0 6px 20px rgba(0,0,0,0.4);
                    ">
                        <div style="font-size:24px;">${dia}</div>
                        <div style="font-size:11px; letter-spacing:1px;">
                            ${mes}
                        </div>
                    </div>

                    <!-- INFO -->
                    <div>
                        <div style="font-size:12px; color:#aaa;">
                            ${ano}
                        </div>
                        <div style="font-size:14px; color:#f5e6a8; margin-top:3px;">
                            ${hora}
                        </div>
                    </div>

                </div>

                <!-- TÍTULO -->
                <h3 style="
                    font-size:22px;
                    color:#fff;
                    margin-bottom:14px;
                    font-weight:600;">
                    ${titulo}
                </h3>

                <!-- VALOR -->
                ${valor ? `
                    <div style="
                        font-size:20px;
                        font-weight:700;
                        color:#f5e6a8;
                        margin-bottom:20px;">
                        ${valor}
                    </div>
                ` : ""}

                <!-- BOTÃO -->
                <a href="${waLink}" target="_blank"
                   style="
                   display:inline-block;
                   padding:14px 28px;
                   border-radius:50px;
                   background: linear-gradient(135deg, #25D366, #1ebe5d);
                   color:#fff;
                   text-decoration:none;
                   font-weight:600;
                   letter-spacing:0.5px;
                   transition:0.25s;
                   box-shadow:0 6px 20px rgba(37,211,102,0.4);
                ">
                   💬 Reservar no WhatsApp
                </a>

            </div>
        `;

        const card = wrapper.firstElementChild;

        // 🔥 HOVER PREMIUM
        card.onmouseenter = () => {
            card.style.transform = "translateY(-8px) scale(1.02)";
            card.style.boxShadow = "0 20px 50px rgba(0,0,0,0.6)";
        };

        card.onmouseleave = () => {
            card.style.transform = "translateY(0) scale(1)";
            card.style.boxShadow = "0 10px 30px rgba(0,0,0,0.4)";
        };

        // 🔥 CLICK NO BOTÃO
        const btn = card.querySelector("a");
        btn.onmousedown = () => {
            btn.style.transform = "scale(0.95)";
        };
        btn.onmouseup = () => {
            btn.style.transform = "scale(1)";
        };

        fragment.appendChild(wrapper);
    });

    container.appendChild(fragment);
}

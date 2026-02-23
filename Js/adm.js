 const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "index.html";
}

const apiBase = "http://marcelompm.somee.com/PagtoMercadoPago"; // ajuste se necessário

function ocultarTodasViews() {
    document.getElementById("dashboardView").style.display = "none";
    document.getElementById("usuariosView").style.display = "none";
    document.getElementById("agendamentosView").style.display = "none";
    document.getElementById("eventosView").style.display = "none";
    document.getElementById("kamboView").style.display = "none";
    document.getElementById("barrasView").style.display = "none";
}

function mostrarDashboard() {
    ocultarTodasViews();
    document.getElementById("dashboardView").style.display = "block";
    document.getElementById("pageTitle").innerText = "Dashboard";
    carregarResumo();
    document.getElementById("sidebar").classList.remove("active");
}

function mostrarUsuarios() {
    ocultarTodasViews();
    document.getElementById("usuariosView").style.display = "block";
    document.getElementById("pageTitle").innerText = "Usuários";
    carregarUsuarios();
    document.getElementById("sidebar").classList.remove("active");
}

function mostrarAgendamentos() {
    ocultarTodasViews();
    document.getElementById("agendamentosView").style.display = "block";
    document.getElementById("pageTitle").innerText = "Agendamentos";
    carregarAgendamentos();
    document.getElementById("sidebar").classList.remove("active");
}

function mostrarEventos() {
    ocultarTodasViews();
    document.getElementById("eventosView").style.display = "block";
    document.getElementById("pageTitle").innerText = "Eventos";
    document.getElementById("sidebar").classList.remove("active");
}

function mostrarKambo() {
    ocultarTodasViews();
    document.getElementById("kamboView").style.display = "block";
    document.getElementById("pageTitle").innerText = "Kambo";
    document.getElementById("sidebar").classList.remove("active");
}

function mostrarBarras() {
    ocultarTodasViews();
    document.getElementById("barrasView").style.display = "block";
    document.getElementById("pageTitle").innerText = "Barras Access";
    document.getElementById("sidebar").classList.remove("active");
}

// =================== USUÁRIOS ===================

async function carregarUsuarios() {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("Usuário não autenticado. Faça login novamente.");
        window.location.href = "login.html";
        return;
    }

    try {
        const res = await fetch(`${apiBase}/api/GetTodosUsuarios`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!res.ok) throw new Error("Erro ao carregar usuários.");

        const dados = await res.json();

        document.getElementById("totalUsuarios").innerText = dados.length;

        // 👉 Agora passa lista de objetos { nome, telefone }
        renderUsuarios(dados);

    } catch (err) {
        console.error("Erro ao carregar usuários:", err);
        alert("Sessão expirada ou erro de acesso. Faça login novamente.");
        localStorage.removeItem("token");
        window.location.href = "login.html";
    }
}


// =================== RESUMO DASHBOARD ===================

async function carregarResumo() {
    const usuarios = await fetch(`${apiBase}/api/GetTodosUsuarios`).then(r => r.json());
    document.getElementById("totalUsuarios").innerText = usuarios.length;

    document.getElementById("totalAgendamentos").innerText = 0;
    document.getElementById("totalEventos").innerText = 0;
    document.getElementById("totalKambo").innerText = 0;
    document.getElementById("totalBarras").innerText = 0;
}

// =================== AGENDAMENTOS (placeholder) ===================

async function carregarAgendamentos() {
    const tbody = document.getElementById("agendamentosTabela");
    tbody.innerHTML = `
        <tr>
            <td colspan="5">Carregando agendamentos...</td>
        </tr>
    `;

    if (!token) {
        alert("Usuário não autenticado.");
        window.location.href = "login.html";
        return;
    }

    try {
        const response = await fetch(`${apiBase}/api/agendamentos/AgendaUsuario`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error("Erro ao buscar agendamentos.");
        }

        const agendamentos = await response.json();

        if (!agendamentos || agendamentos.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5">Nenhum agendamento cadastrado ainda.</td>
                </tr>
            `;
            document.getElementById("agendamentosCards").innerHTML = "";
            return;
        }

        // 👉 AQUI você chama a função de renderização
        renderAgendamentos(agendamentos);

    } catch (error) {
        console.error("Erro ao carregar agendamentos:", error);
        tbody.innerHTML = `
            <tr>
                <td colspan="5">Erro ao carregar agendamentos.</td>
            </tr>
        `;
        document.getElementById("agendamentosCards").innerHTML = "";
    }
}


// =================== MENU MOBILE ===================

function toggleMenu() {
    const sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("active");
}

// =================== LOGOUT ===================

function logout(event) {
    event.preventDefault();
    localStorage.removeItem("token");
    window.location.href = "index.html";
}

// Inicializa no dashboard
mostrarDashboard();

// =================== RENDERIZAR AGENDAMENTO ===================
let agendamentosOriginais = [];

function renderAgendamentos(lista) {
    agendamentosOriginais = lista;

    const tabela = document.getElementById("agendamentosTabela");
    const cards = document.getElementById("agendamentosCards");

    tabela.innerHTML = "";
    cards.innerHTML = "";

    lista.forEach(a => {
        const statusClasse = a.statusPagamento.toLowerCase();

        // Tabela (Desktop)
        tabela.innerHTML += `
            <tr>
                <td>${a.nomeUsuario}</td>
                <td>${new Date(a.dataEvento).toLocaleDateString("pt-BR")}</td>
                <td>R$ ${a.valorPago.toFixed(2)}</td>
                <td class="status ${statusClasse}">${a.statusPagamento}</td>
                <td>
                    <button onclick="confirmarAgendamento('${a.id}')" class="btn-confirmar">✔</button>
                    <button onclick="cancelarAgendamento('${a.id}')" class="btn-cancelar">✖</button>
                    <button onclick="verDetalhes('${a.id}')" class="btn-detalhes">👁</button>
                </td>
            </tr>
        `;

        // Cards (Mobile)
        cards.innerHTML += `
            <div class="agendamento-card">
                <div class="cliente">${a.nomeUsuario}</div>
                <div class="linha"><span>📅 Data</span><span>${new Date(a.dataEvento).toLocaleDateString("pt-BR")}</span></div>
                <div class="linha"><span>💰 Valor</span><span>R$ ${a.valorPago.toFixed(2)}</span></div>
                <div class="linha"><span>📌 Status</span><span class="status ${statusClasse}">${a.statusPagamento}</span></div>
                <div class="acoes">
                    <button class="btn-confirmar" onclick="confirmarAgendamento('${a.id}')">Confirmar</button>
                    <button class="btn-cancelar" onclick="cancelarAgendamento('${a.id}')">Cancelar</button>
                    <button class="btn-detalhes" onclick="verDetalhes('${a.id}')">Detalhes</button>
                </div>
            </div>
        `;
    });
}

// =================== RENDERIZAR USUARIO ===================
let usuariosOriginais = [];

function renderUsuarios(lista) {
    usuariosOriginais = lista;

    const tabela = document.getElementById("usuariosTabela");
    const cards = document.getElementById("usuariosCards");

    tabela.innerHTML = "";
    cards.innerHTML = "";

    lista.forEach((usuario) => {
        // Tabela (Desktop)
        tabela.innerHTML += `
            <tr>
                <td>${usuario.nome}</td>
                <td>${usuario.telefone}</td>
                <td>
                    <button class="btn-excluir" onclick="excluirUsuario('${usuario.nome}')">Excluir</button>
                </td>
            </tr>
        `;

        // Card (Mobile)
        cards.innerHTML += `
            <div class="usuario-card">
                <div class="nome">${usuario.nome}</div>
                <div class="telefone">${usuario.telefone}</div>
                <div class="acoes">
                    <button class="btn-excluir" onclick="excluirUsuario('${usuario.nome}')">Excluir</button>
                </div>
            </div>
        `;
    });
}

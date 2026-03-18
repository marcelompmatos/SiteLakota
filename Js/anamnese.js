/* EXPANDER */
function toggleExpander() {
    const el = document.getElementById("expander");
    if (!el) return;

    if (el.classList.contains("open")) {
        fecharExpander(el);
    } else {
        abrirExpander(el);
    }
}

function abrirExpander(el) {
    el.classList.add("open");
    el.style.maxHeight = el.scrollHeight + "px";
}

function fecharExpander(el) {
    el.style.maxHeight = el.scrollHeight + "px";

    requestAnimationFrame(() => {
        el.style.maxHeight = "0px";
        el.classList.remove("open");
    });
}

/* DROGAS */
function toggleDrogas() {
    const select = document.getElementById("selectDroga");
    const area = document.getElementById("areaDrogas");
    const expander = document.getElementById("expander");

    if (!select || !area) return;

    area.style.display = (select.value === "Sim") ? "block" : "none";

    atualizarAlturaExpander(expander);
}

/* CHECKBOX */
function toggleCampo(el, tipo) {

    const checked = el.checked;

    const desde = document.getElementById(tipo + "_desde");
    const ultima = document.getElementById(tipo + "_ultima");
    const nome = document.getElementById(tipo + "_nome");
    const expander = document.getElementById("expander");

    if (desde) desde.style.display = checked ? "block" : "none";
    if (ultima) ultima.style.display = checked ? "block" : "none";
    if (nome) nome.style.display = checked ? "block" : "none";

    atualizarAlturaExpander(expander);
}

/* AJUSTE ALTURA */
function atualizarAlturaExpander(el) {
    if (!el || !el.classList.contains("open")) return;

    el.style.maxHeight = "auto";
    el.style.maxHeight = el.scrollHeight + "px";
}
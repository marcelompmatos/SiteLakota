/* EXPANDER SUAVE */
function toggleExpander() {
    const el = document.getElementById("expander");

    if (!el) return;

    if (el.style.maxHeight) {
        el.style.maxHeight = null;
    } else {
        el.style.maxHeight = el.scrollHeight + "px";
    }
}

/* MOSTRAR DROGAS */
function toggleDrogas() {
    const select = document.getElementById("selectDroga");
    const area = document.getElementById("areaDrogas");
    const expander = document.getElementById("expander");

    if (!select || !area) return;

    if (select.value === "Sim") {
        area.style.display = "block";
    } else {
        area.style.display = "none";
    }

    atualizarAltura(expander);
}

/* CHECKBOX */
function toggleCampo(el, tipo) {

    if (!el || !tipo) return;

    const checked = el.checked;

    const desde = document.getElementById(tipo + "_desde");
    const ultima = document.getElementById(tipo + "_ultima");
    const nome = document.getElementById(tipo + "_nome");
    const expander = document.getElementById("expander");

    if (desde) desde.style.display = checked ? "block" : "none";
    if (ultima) ultima.style.display = checked ? "block" : "none";
    if (nome) nome.style.display = checked ? "block" : "none";

    atualizarAltura(expander);
}

/* AJUSTAR ALTURA DO EXPANDER */
function atualizarAltura(el) {
    if (!el) return;

    setTimeout(() => {
        el.style.maxHeight = el.scrollHeight + "px";
    }, 100);
}
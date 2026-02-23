// 🔹 Base da API (prefira HTTPS em produção)
const apiBase = "http://marcelompm.somee.com/PagtoMercadoPago";

async function login() {
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value.trim();
    const errorDiv = document.getElementById("loginError");
    errorDiv.textContent = "";

    if (!email || !senha) {
        errorDiv.textContent = "Informe email e senha.";
        return;
    }

    try {
        const response = await fetch(`${apiBase}/login`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json" 
            },
            body: JSON.stringify({ email, password: senha })
        });

        if (!response.ok) {
            const erro = await response.text();
            throw new Error(erro || "Email ou senha inválidos.");
        }

        const data = await response.json();

        if (!data?.token) {
            throw new Error("Token JWT não retornado pela API.");
        }

        // 🔹 Salva token no navegador
        localStorage.setItem("token", data.token);

        // 🔹 Redireciona para o painel
        window.location.href = "Home.html";

    } catch (err) {
        console.error("Erro no login:", err);
        errorDiv.textContent = err.message || "Erro ao conectar com o servidor.";
    }
}



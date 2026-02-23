import fetch from "node-fetch";

export async function handler(event, context) {
  const tipo = event.queryStringParameters.tipo || 1;

  try {
    const response = await fetch(`http://marcelompm.somee.com/PagtoMercadoPago/api/agenda?tipo=${tipo}`);
    if (!response.ok) {
      return { statusCode: response.status, body: "Erro ao acessar API" };
    }
    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" }
    };
  } catch (err) {
    return { statusCode: 500, body: "Erro interno: " + err.message };
  }
}
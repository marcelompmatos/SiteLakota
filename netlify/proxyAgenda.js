// netlify/functions/proxyAgenda.js
const fetch = require("node-fetch");

exports.handler = async function(event, context) {
  const tipo = event.queryStringParameters.tipo || 1;

  try {
    // Chamada para sua API HTTP
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
};
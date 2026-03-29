export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);

        // Configuración del destino (VPS)
        const VPS_ENDPOINT = "http://207.180.243.41:5005";

        // Manejo de Preflight CORS (OPTIONS)
        if (request.method === "OPTIONS") {
            return new Response(null, {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, DELETE",
                    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
                    "Access-Control-Max-Age": "86400",
                },
            });
        }

        // Construir la URL de destino preservando el path y query
        const targetUrl = `${VPS_ENDPOINT}${url.pathname}${url.search}`;

        // Clonar las cabeceras originales
        const headers = new Headers(request.headers);
        // Eliminar cabeceras que puedan causar problemas de ruteo interno en Cloudflare
        headers.delete("cf-connecting-ip");
        headers.delete("cf-ray");
        headers.delete("cf-visitor");

        try {
            // Realizar la petición al VPS
            const response = await fetch(targetUrl, {
                method: request.method,
                headers: headers,
                body: ["GET", "HEAD"].includes(request.method) ? null : await request.arrayBuffer(),
                redirect: "follow",
            });

            // Clonar la respuesta para añadir cabeceras CORS
            const newResponse = new Response(response.body, response);
            newResponse.headers.set("Access-Control-Allow-Origin", "*");
            newResponse.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
            newResponse.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

            return newResponse;

        } catch (err) {
            return new Response(JSON.stringify({
                status: "error",
                message: "Proxy Error: No se pudo contactar con el VPS",
                debug: err.message
            }), {
                status: 502,
                headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
            });
        }
    },
};

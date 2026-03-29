export async function onRequest(context) {
    const { request, params } = context;
    const url = new URL(request.url);

    // Configuración del destino (Tunnel)
    const VPS_ENDPOINT = "http://516e8377-3499-482e-ba4b-092d96b49170.cfargotunnel.com";

    // Re-emitir la petición al VPS
    // El path capturado en [[path]] comienza DESPUÉS de /api/
    const apiPath = params.path ? params.path.join('/') : '';
    const targetUrl = `${VPS_ENDPOINT}/api/${apiPath}${url.search}`;

    console.log(`Proxying Page Function: ${url.pathname} -> ${targetUrl}`);

    // Clonar las cabeceras originales pero quitar las de Cloudflare que causan conflictos
    const headers = new Headers(request.headers);
    headers.delete("cf-connecting-ip");
    headers.delete("cf-ray");
    headers.delete("cf-visitor");
    // Importante: No forzar el Host aquí, dejar que fetch lo maneje o forzar el del VPS
    headers.set("Host", "api.websopen.com");

    try {
        const response = await fetch(targetUrl, {
            method: request.method,
            headers: headers,
            body: ["GET", "HEAD"].includes(request.method) ? null : await request.arrayBuffer(),
            redirect: "follow",
        });

        // Añadir cabeceras CORS básicas para permitir el uso desde el propio Page
        const newResponse = new Response(response.body, response);
        newResponse.headers.set("Access-Control-Allow-Origin", "*");
        newResponse.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
        newResponse.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

        return newResponse;
    } catch (err) {
        return new Response(JSON.stringify({
            status: "error",
            message: "Proxy Function Error: No se pudo contactar con el VPS",
            debug: err.message,
            target: targetUrl
        }), {
            status: 502,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
    }
}

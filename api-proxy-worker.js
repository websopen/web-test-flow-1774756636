export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);

        // Proxy ALL /api/v1/* requests to the VPS IP on port 5005
        // Using HTTP since the VPS doesn't listen on 443 with valid certs
        const targetUrl = `http://207.180.243.41:5005${url.pathname}${url.search}`;

        console.log(`Proxying: ${request.url} -> ${targetUrl}`);

        // Copy the original request but with the new URL
        const newRequest = new Request(targetUrl, {
            method: request.method,
            headers: request.headers,
            body: request.body,
            redirect: 'follow'
        });

        try {
            const response = await fetch(newRequest);

            // Return response with original status and headers
            // (Except for some Cloudflare specific ones if needed)
            return response;
        } catch (err) {
            return new Response(`Proxy Error: ${err.message}`, { status: 502 });
        }
    },
};

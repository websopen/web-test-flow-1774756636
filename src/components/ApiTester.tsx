import React, { useState, useEffect } from 'react';
import { Loader2, PlayCircle } from 'lucide-react';

interface ApiTesterProps {
    endpoint: string;
    method: string;
    defaultPayload: any;
    syncGlobal?: any; // Keys that should be synced with global state
}

const ApiTester: React.FC<ApiTesterProps> = ({ endpoint, method, defaultPayload, syncGlobal }) => {
    const [payload, setPayload] = useState(defaultPayload);
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    // Sync global props into the local payload
    useEffect(() => {
        if (syncGlobal) {
            setPayload((prev: any) => ({ ...prev, ...syncGlobal }));
        }
    }, [syncGlobal]);

    const handleSend = async () => {
        setLoading(true);
        setError(null);
        setResponse(null);

        try {
            const res = await fetch(endpoint, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: (method !== 'GET' && method !== 'HEAD') ? JSON.stringify(payload) : undefined,
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || `HTTP Error ${res.status}`);
            }
            setResponse(data);
        } catch (err: any) {
            setError(err.message || 'Unknown error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="mb-4">
                <label className="block text-xs font-semibold text-apple-textMuted uppercase tracking-wider mb-2">Payload (JSON)</label>
                <textarea
                    value={JSON.stringify(payload, null, 2)}
                    onChange={(e) => {
                        try {
                            setPayload(JSON.parse(e.target.value));
                        } catch (err) {
                            // Let them type invalid JSON, just don't update state if it fails parsing completely 
                            // (In a real app, we'd use a better raw string state, but this is okay for a quick lab)
                        }
                    }}
                    className="w-full h-32 bg-black/50 border border-apple-border rounded-lg p-3 text-sm font-mono text-gray-300 focus:outline-none focus:border-apple-blue transition-colors"
                    spellCheck={false}
                />
                <p className="text-[10px] text-gray-500 mt-1">Edita el JSON directamente si quieres sobreescribir variables (ej. `vars`).</p>
            </div>

            <div className="mt-auto">
                {error && (
                    <div className="mb-3 p-3 bg-red-900/30 border border-red-500/50 rounded-lg text-red-200 text-sm">
                        ❌ {error}
                    </div>
                )}

                {response && (
                    <div className="mb-3 p-3 bg-green-900/30 border border-green-500/50 rounded-lg text-green-200 text-sm overflow-x-auto">
                        ✅ <pre className="inline text-xs">{JSON.stringify(response, null, 2)}</pre>
                    </div>
                )}

                <button
                    onClick={handleSend}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-apple-blue hover:bg-blue-600 active:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            <PlayCircle className="w-5 h-5" />
                            <span>Ejecutar {method}</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default ApiTester;

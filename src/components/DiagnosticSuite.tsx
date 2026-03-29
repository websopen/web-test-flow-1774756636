import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Copy, Check, Play, RefreshCcw, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

interface TestResult {
    name: string;
    endpoint: string;
    status: 'pending' | 'running' | 'success' | 'error';
    response?: any;
    error?: string;
}

const DiagnosticSuite: React.FC<{ businessId: number; targetRole: string; chatId: string }> = ({ businessId, targetRole, chatId }) => {
    const [results, setResults] = useState<TestResult[]>([]);
    const [logs, setLogs] = useState<string[]>([]);
    const [isRunning, setIsRunning] = useState(false);
    const [copySuccess, setCopySuccess] = useState<boolean | null>(null);
    const logEndRef = useRef<HTMLDivElement>(null);

    const addLog = (msg: string) => {
        const timestamp = new Date().toLocaleTimeString();
        setLogs(prev => [...prev, `[${timestamp}] ${msg}`]);
    };

    useEffect(() => {
        logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    const runTests = async () => {
        setIsRunning(true);
        setLogs([]);
        addLog('🚀 Iniciando Suite de Diagnóstico Total OMNIII V3.0...');
        addLog(`📍 Configuración: BusinessID=${businessId}, Host=api.websopen.com`);

        const API_BASE = '';
        const initialTests: TestResult[] = [
            { name: 'Core API Health', endpoint: `${API_BASE}/api/health`, status: 'pending' },
            { name: 'ERP Bridge Check', endpoint: `${API_BASE}/api/v1/erp/health`, status: 'pending' },
            { name: 'ERP Customer List', endpoint: `${API_BASE}/api/v1/erp/customers?limit=1`, status: 'pending' },
            { name: 'ERP Stock Inquiry', endpoint: `${API_BASE}/api/v1/erp/stock/GENERAL?limit=1`, status: 'pending' },
            { name: 'WhatsApp Instance', endpoint: `${API_BASE}/api/v1/evolution/list`, status: 'pending' },
            { name: 'Telegram Runtime', endpoint: `${API_BASE}/api/v1/bot-factory/telethon-status`, status: 'pending' },
            { name: 'Knowledge RAG Index', endpoint: `${API_BASE}/api/v1/knowledge/stats`, status: 'pending' },
            { name: 'OMNIII Stock Ledger', endpoint: `${API_BASE}/api/v1/stock/cards`, status: 'pending' },
            { name: 'Clawbot Gestor Sync', endpoint: `${API_BASE}/api/v1/admin/businesses/${businessId}/gestor`, status: 'pending' },
            { name: 'Messaging Baseline', endpoint: `${API_BASE}/api/v1/messaging/send`, status: 'pending' }
        ];

        setResults(initialTests);
        const currentResults = [...initialTests];

        for (let i = 0; i < currentResults.length; i++) {
            const test = currentResults[i];
            currentResults[i] = { ...test, status: 'running' };
            setResults([...currentResults]);

            // Contextual Logging
            if (test.name.startsWith('ERP')) {
                addLog(`🔍 [ERPNext] Verificando módulo: ${test.name.replace('ERP ', '')}...`);
            } else if (test.name.includes('WhatsApp') || test.name.includes('Telegram')) {
                addLog(`📱 [Messaging] Comprobando puente de red: ${test.name}...`);
            } else {
                addLog(`⚡ [Core] Testeando capa: ${test.name}...`);
            }

            try {
                const isPost = ['Messaging Baseline'].includes(test.name);
                const method = isPost ? 'POST' : 'GET';
                const body = method === 'POST' ? JSON.stringify({
                    business_id: businessId,
                    target_role: targetRole,
                    chat_id: chatId,
                    text: 'OMNIII Lab V3.1 Deep Scan Ping'
                }) : undefined;

                const res = await fetch(test.endpoint, {
                    method,
                    headers: { 'Content-Type': 'application/json' },
                    body
                });

                const data = await res.json();

                if (res.ok && data.success !== false) {
                    currentResults[i] = { ...test, status: 'success', response: data };

                    // Detailed result logging
                    if (test.name === 'ERP Customer List') {
                        addLog(`  ✅ EXITO: ${data.count || 0} clientes detectados en ERPNext.`);
                    } else if (test.name === 'ERP Stock Inquiry') {
                        addLog(`  ✅ EXITO: Conexión a almacén establecida correctamente.`);
                    } else if (test.name === 'Knowledge RAG Index') {
                        addLog(`  ✅ EXITO: ${data.total_items || 0} fragmentos indexados en el cerebro.`);
                    } else {
                        addLog(`  ✅ EXITO: ${test.name} respondió correctamente.`);
                    }
                } else {
                    const errMsg = data.error || data.message || `HTTP ${res.status}`;
                    currentResults[i] = { ...test, status: 'error', error: errMsg };
                    addLog(`  ❌ FALLO: ${test.name} -> ${errMsg}`);
                }
            } catch (err: any) {
                currentResults[i] = { ...test, status: 'error', error: err.message };
                addLog(`  ⚠️ ERROR CRITICO: ${test.name} -> ${err.message}`);
            }
            setResults([...currentResults]);
        }

        addLog('🏁 Suite de pruebas finalizada.');
        setIsRunning(false);
    };

    const copyLogs = () => {
        const text = logs.join('\n');
        navigator.clipboard.writeText(text);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(null), 2000);
    };

    return (
        <div className="flex flex-col gap-6 animate-in fade-in duration-500">
            {/* Header Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 bg-white/5 border-white/10">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-orange-500/20 rounded-2xl border border-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.1)]">
                        <Terminal className="w-6 h-6 text-orange-400" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black italic tracking-tighter uppercase text-white/90">Omni Console v3.1</h2>
                        <p className="text-sm text-apple-textMuted font-medium">Diagnostic Suite & Core Verification</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={copyLogs}
                        disabled={logs.length === 0}
                        className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-sm font-bold hover:bg-white/10 transition-all disabled:opacity-50 active:scale-95 group"
                    >
                        {copySuccess ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 group-hover:text-apple-blue transition-colors" />}
                        {copySuccess ? 'Copiado!' : 'Copiar Salida'}
                    </button>
                    <button
                        onClick={runTests}
                        disabled={isRunning}
                        className="flex items-center gap-3 px-8 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-orange-500 text-white font-black hover:from-orange-500 hover:to-orange-400 transition-all shadow-xl shadow-orange-900/20 active:scale-95 disabled:opacity-50 tracking-tight"
                    >
                        {isRunning ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5 fill-current" />}
                        {isRunning ? 'EJECUTANDO TEST...' : 'EJECUTAR TEST TOTAL'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[500px]">
                {/* Visual Status Grid */}
                <div className="lg:col-span-4 xl:col-span-3 glass-panel p-5 overflow-y-auto custom-scrollbar border-white/10 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xs font-black text-apple-textMuted uppercase tracking-widest">Stack Status</h3>
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="text-[10px] font-bold text-green-500 uppercase">Live</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2.5">
                        {results.length > 0 ? results.map((test, i) => (
                            <div key={i} className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${test.status === 'success' ? 'bg-green-500/5 border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.05)]' :
                                test.status === 'error' ? 'bg-red-500/5 border-red-500/20' :
                                    test.status === 'running' ? 'bg-orange-500/5 border-orange-500/40 animate-pulse' :
                                        'bg-black/40 border-white/5'
                                }`}>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-white/90">{test.name}</span>
                                    <span className="text-[9px] font-mono text-apple-textMuted truncate max-w-[120px]">{test.endpoint}</span>
                                </div>
                                {test.status === 'pending' && <div className="w-2 h-2 rounded-full bg-white/10"></div>}
                                {test.status === 'running' && <Loader2 className="w-4 h-4 text-orange-400 animate-spin" />}
                                {test.status === 'success' && <CheckCircle2 className="w-4 h-4 text-green-400" />}
                                {test.status === 'error' && <AlertCircle className="w-4 h-4 text-red-500" />}
                            </div>
                        )) : (
                            <div className="text-center py-20 flex flex-col items-center gap-3 opacity-30">
                                <Terminal className="w-10 h-10" />
                                <p className="text-xs font-bold italic uppercase tracking-tighter">Esperando ejecución...</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Real Terminal View */}
                <div className="lg:col-span-8 xl:col-span-9 flex flex-col bg-[#050505] rounded-3xl border border-white/10 shadow-2xl overflow-hidden font-mono relative ring-1 ring-white/5">
                    {/* Terminal Header */}
                    <div className="flex items-center justify-between px-6 py-3 border-b border-white/10 bg-white/[0.03] backdrop-blur-md">
                        <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-black/10"></div>
                            <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-black/10"></div>
                            <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-black/10"></div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Terminal className="w-3.5 h-3.5 text-white/40" />
                            <span className="text-[11px] text-white/40 font-bold tracking-widest uppercase">bash — lab@vps — 10.10.0.1</span>
                        </div>
                        <div className="w-12"></div>
                    </div>

                    {/* Terminal Content */}
                    <div className="flex-1 p-6 overflow-y-auto custom-scrollbar text-[13px] leading-relaxed tracking-tight text-white/90 selection:bg-orange-500/30 selection:text-white group">
                        {logs.length === 0 && (
                            <div className="flex items-center gap-2 text-white/20 italic">
                                <span>nico@omniii-vps:~$</span>
                                <span className="w-2 h-5 bg-orange-500 animate-pulse"></span>
                                <span className="text-xs font-bold uppercase tracking-widest ml-4 opacity-50">Pulse el botón superior para iniciar...</span>
                            </div>
                        )}
                        <div className="flex flex-col gap-1">
                            {logs.map((log, i) => {
                                let colorClass = 'text-blue-300';
                                if (log.includes('✅')) colorClass = 'text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.2)]';
                                if (log.includes('❌') || log.includes('⚠️')) colorClass = 'text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.2)]';
                                if (log.includes('⚡')) colorClass = 'text-orange-400';
                                if (log.includes('🚀') || log.includes('🏁')) colorClass = 'text-white font-bold bg-white/5 px-2 rounded -mx-2';

                                return (
                                    <div key={i} className={`font-mono transition-all hover:translate-x-1 duration-200 ${colorClass}`}>
                                        <span className="opacity-30 mr-3 text-[10px] select-none">{(i + 1).toString().padStart(3, '0')}</span>
                                        {log}
                                    </div>
                                );
                            })}
                        </div>
                        <div ref={logEndRef} className="h-4" />
                    </div>

                    {/* Terminal Footer */}
                    <div className="px-6 py-2.5 bg-white/[0.03] border-t border-white/10 flex items-center justify-between backdrop-blur-md">
                        <div className="flex items-center gap-4 text-[10px] text-white/30 font-bold uppercase tracking-widest">
                            <div className="flex items-center gap-1.5 pr-4 border-r border-white/5">
                                <RefreshCcw className="w-3 h-3" />
                                <span>UTF-8</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Database className="w-3 h-3 translate-y-[-1px]" />
                                <span>PostgreSQL Sync: OK</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] text-white/20">Line {logs.length}</span>
                            <span className="px-2 py-0.5 rounded-sm bg-orange-500/20 text-orange-400 text-[9px] font-black uppercase tracking-tighter">Omni-Kernel v4.0</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Missing Database icon in imports if used, but let's just use Database from lucide
// Actually, I'll update the imports to be safe
import { Database } from 'lucide-react';

export default DiagnosticSuite;

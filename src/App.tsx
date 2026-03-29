import { useState } from 'react';
import ApiTester from './components/ApiTester';
import DiagnosticSuite from './components/DiagnosticSuite';
import ApiCatalog from './components/ApiCatalog';
import {
    Settings, Send, Users, Truck, ShoppingBag, PackageCheck,
    Brain, Terminal, LayoutGrid, Activity,
    ShieldCheck, Cpu, MessageSquare, HeartPulse, BookOpen
} from 'lucide-react';

function App() {
    const [businessId, setBusinessId] = useState<number>(33);
    const [activeTab, setActiveTab] = useState<string>('system');
    const [targetRole, setTargetRole] = useState<string>('cliente');
    const [defaultChatId, setDefaultChatId] = useState<string>('7616797355');
    const API_BASE = '';
    const API_PING_URL = '/api/v1/messaging/ping';

    const TabButton = ({ id, icon: Icon, label, color }: any) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${activeTab === id
                ? `bg-${color}-500/20 text-${color}-400 border border-${color}-500/50 shadow-[0_0_15px_rgba(0,0,0,0.2)]`
                : 'text-apple-textMuted hover:text-white hover:bg-white/5 border border-transparent'
                }`}
        >
            <Icon className="w-4 h-4" />
            <span className="text-sm font-medium">{label}</span>
        </button>
    );

    return (
        <div className="min-h-screen p-4 md:p-8 max-w-[1600px] mx-auto">
            <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-apple-blue via-purple-500 to-teal-400 bg-clip-text text-transparent tracking-tight">
                        OMNIII Full System Lab
                    </h1>
                    <p className="text-apple-textMuted mt-1 font-medium italic">V3.0 • Live Documentation & Test Environment</p>
                </div>

                <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/10 backdrop-blur-xl">
                    <div className="flex flex-col px-3">
                        <span className="text-[10px] uppercase font-bold text-apple-textMuted">Status</span>
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse"></div>
                            <span className="text-xs font-mono text-green-400">api-proxy (workers)</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Global Configuration */}
            <section className="glass-panel p-6 mb-8 border-l-4 border-l-apple-blue bg-gradient-to-br from-white/[0.03] to-transparent">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Settings className="w-5 h-5 text-apple-blue" />
                        <h2 className="text-xl font-semibold italic text-apple-blue uppercase tracking-tighter">Entorno Global</h2>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="group">
                        <label className="block text-xs font-bold text-apple-textMuted uppercase mb-2 group-hover:text-apple-blue transition-colors">Business ID / Owner ID</label>
                        <input
                            type="number"
                            value={businessId}
                            onChange={e => setBusinessId(parseInt(e.target.value))}
                            className="w-full bg-black/50 border border-apple-border rounded-xl px-4 py-3 focus:outline-none focus:border-apple-blue transition-all font-mono text-apple-blue text-lg"
                            placeholder="Ej. 33"
                        />
                    </div>
                    <div className="group">
                        <label className="block text-xs font-bold text-apple-textMuted uppercase mb-2 group-hover:text-apple-blue transition-colors">Target Role</label>
                        <select
                            value={targetRole}
                            onChange={e => setTargetRole(e.target.value)}
                            className="w-full bg-black/50 border border-apple-border rounded-xl px-4 py-3 focus:outline-none focus:border-apple-blue transition-all appearance-none cursor-pointer"
                        >
                            <option value="cliente">Cliente</option>
                            <option value="repartidor">Repartidor</option>
                            <option value="empleado">Empleado</option>
                            <option value="dueno">Dueño</option>
                        </select>
                    </div>
                    <div className="group">
                        <label className="block text-xs font-bold text-apple-textMuted uppercase mb-2 group-hover:text-apple-blue transition-colors">Test Chat ID / Telefono</label>
                        <input
                            type="text"
                            value={defaultChatId}
                            onChange={e => setDefaultChatId(e.target.value)}
                            className="w-full bg-black/50 border border-apple-border rounded-xl px-4 py-3 focus:outline-none focus:border-apple-blue transition-all font-mono"
                            placeholder="ID de Telegram o WhatsApp"
                        />
                    </div>
                </div>
            </section>

            {/* Tabs Navigation */}
            <div className="flex flex-wrap gap-2 mb-8 bg-black/40 p-2 rounded-2xl backdrop-blur-md border border-white/5 shadow-inner">
                <TabButton id="catalog" icon={BookOpen} label="Catálogo de Funciones" color="blue" />
                <TabButton id="messaging" icon={MessageSquare} label="Mensajería Rápida" color="teal" />
                <TabButton id="clawbot" icon={Brain} label="Cerebro / RAG" color="purple" />
                <TabButton id="system" icon={Terminal} label="Diagnóstico & Core" color="orange" />
            </div>

            <div className="space-y-8 animate-in mt-4">
                {activeTab === 'catalog' && (
                    <ApiCatalog
                        businessId={businessId}
                        targetRole={targetRole}
                        defaultChatId={defaultChatId}
                    />
                )}

                {activeTab === 'messaging' && (
                    <>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <section className="glass-panel p-6 shadow-xl shadow-green-500/5">
                                <div className="flex items-center gap-2 mb-4">
                                    <Send className="w-5 h-5 text-green-500" />
                                    <h2 className="text-xl font-semibold italic text-green-500 uppercase tracking-tighter">Envío Genérico</h2>
                                </div>
                                <ApiTester
                                    endpoint={`${API_BASE}/api/v1/messaging/send`}
                                    method="POST"
                                    defaultPayload={{
                                        business_id: businessId,
                                        target_role: targetRole,
                                        chat_id: defaultChatId,
                                        text: "Prueba desde OMNIII Lab."
                                    }}
                                    syncGlobal={{ business_id: businessId, target_role: targetRole, chat_id: defaultChatId }}
                                />
                            </section>

                            <section className="glass-panel p-6 shadow-xl shadow-yellow-500/5">
                                <div className="flex items-center gap-2 mb-4">
                                    <Users className="w-5 h-5 text-yellow-500" />
                                    <h2 className="text-xl font-semibold italic text-yellow-500 uppercase tracking-tighter">Broadcast Masivo</h2>
                                </div>
                                <ApiTester
                                    endpoint={`${API_BASE}/api/v1/messaging/send-bulk`}
                                    method="POST"
                                    defaultPayload={{
                                        business_id: businessId,
                                        target_role: targetRole,
                                        chat_ids: [defaultChatId],
                                        text: "⚠️ Broadcast masivo!"
                                    }}
                                    syncGlobal={{ business_id: businessId, target_role: targetRole }}
                                />
                            </section>
                        </div>

                        <h2 className="text-xl font-black flex items-center gap-2 mt-8 mb-4 italic text-apple-textMuted uppercase tracking-widest">
                            <Activity className="w-5 h-5 text-apple-blue" /> Webhook Triggering (Legacy Flows)
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <section className="glass-panel p-5 bg-indigo-500/5">
                                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-indigo-400 italic">
                                    <Truck className="w-5 h-5" /> Ruta Lista
                                </h3>
                                <ApiTester
                                    endpoint={`${API_BASE}/api/v1/messaging/flow/repartidor/asignar-ruta`}
                                    method="POST"
                                    defaultPayload={{ business_id: businessId, repartidor_chat_id: defaultChatId, repartidor_nombre: "Lab User", cantidad_pedidos: 3 }}
                                    syncGlobal={{ business_id: businessId, repartidor_chat_id: defaultChatId }}
                                />
                            </section>
                            <section className="glass-panel p-5 bg-orange-500/5">
                                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-orange-400 italic">
                                    <ShoppingBag className="w-5 h-5 " /> En Camino
                                </h3>
                                <ApiTester
                                    endpoint={`${API_BASE}/api/v1/messaging/flow/cliente/pedido-en-camino`}
                                    method="POST"
                                    defaultPayload={{ business_id: businessId, cliente_chat_id: defaultChatId, id_pedido: "TEST-001" }}
                                    syncGlobal={{ business_id: businessId, cliente_chat_id: defaultChatId }}
                                />
                            </section>
                            <section className="glass-panel p-5 bg-teal-500/5">
                                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-teal-400 italic">
                                    <PackageCheck className="w-5 h-5" /> Retiro Listo
                                </h3>
                                <ApiTester
                                    endpoint={`${API_BASE}/api/v1/messaging/flow/cliente/pedido-listo`}
                                    method="POST"
                                    defaultPayload={{ business_id: businessId, cliente_chat_id: defaultChatId, id_pedido: "TEST-002", tipo_entrega: "retiro" }}
                                    syncGlobal={{ business_id: businessId, cliente_chat_id: defaultChatId }}
                                />
                            </section>
                        </div>
                    </>
                )}

                {activeTab === 'clawbot' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <section className="glass-panel p-6 border-t-2 border-t-purple-500">
                            <div className="flex items-center gap-2 mb-4">
                                <Brain className="w-5 h-5 text-purple-400" />
                                <h2 className="text-xl font-semibold italic text-purple-400 uppercase tracking-tighter">Cerebro / Gestor Lookup</h2>
                            </div>
                            <ApiTester
                                endpoint={`${API_BASE}/api/v1/admin/businesses/${businessId}/gestor`}
                                method="GET"
                                defaultPayload={{}}
                                syncGlobal={{ business_id: businessId }}
                            />
                        </section>

                        <section className="glass-panel p-6 border-t-2 border-t-purple-500">
                            <div className="flex items-center gap-2 mb-4">
                                <LayoutGrid className="w-5 h-5 text-blue-400" />
                                <h2 className="text-xl font-semibold italic text-blue-400 uppercase tracking-tighter">Profile Tags (Long-Term Memory)</h2>
                            </div>
                            <ApiTester
                                endpoint={`${API_BASE}/api/v1/admin/gestors/33/tags`}
                                method="GET"
                                defaultPayload={{}}
                            />
                        </section>

                        <section className="glass-panel p-6 border-t-2 border-t-purple-500 col-span-1 lg:col-span-2">
                            <div className="flex items-center gap-2 mb-4">
                                <Brain className="w-5 h-5 text-purple-400" />
                                <h2 className="text-xl font-semibold italic text-purple-400 uppercase tracking-tighter">RAG Search (Knowledge base)</h2>
                            </div>
                            <ApiTester
                                endpoint={`${API_BASE}/api/v1/knowledge/search`}
                                method="GET"
                                defaultPayload={{ q: "ventas", method: "auto", limit: 5 }}
                            />
                        </section>
                    </div>
                )}

                {activeTab === 'system' && (
                    <div className="space-y-8">
                        <section className="glass-panel p-6 border-t-2 border-t-red-500 shadow-[0_0_30px_rgba(239,68,68,0.1)]">
                            <div className="flex items-center gap-2 mb-6 text-red-400">
                                <HeartPulse className="w-6 h-6 animate-pulse" />
                                <h2 className="text-2xl font-bold">Suite de Diagnóstico</h2>
                            </div>
                            <DiagnosticSuite businessId={businessId} targetRole={targetRole} chatId={defaultChatId} />
                        </section>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <section className="glass-panel p-6 border-t-2 border-t-orange-500">
                                <div className="flex items-center gap-2 mb-4">
                                    <Activity className="w-5 h-5 text-orange-400" />
                                    <h2 className="text-xl font-semibold">Salud del Core</h2>
                                </div>
                                <ApiTester
                                    endpoint={`${API_BASE}/api/health`}
                                    method="GET"
                                    defaultPayload={{}}
                                />
                            </section>

                            <section className="glass-panel p-6 border-t-2 border-t-orange-500">
                                <div className="flex items-center gap-2 mb-4">
                                    <ShieldCheck className="w-5 h-5 text-green-400" />
                                    <h2 className="text-xl font-semibold">Reportes de Test (Chaos)</h2>
                                </div>
                                <ApiTester
                                    endpoint={`${API_BASE}/api/internal/tests/reports`}
                                    method="GET"
                                    defaultPayload={{}}
                                />
                            </section>

                            <section className="glass-panel p-6 border-t-2 border-t-orange-500">
                                <div className="flex items-center gap-2 mb-4">
                                    <Cpu className="w-5 h-5 text-red-400" />
                                    <h2 className="text-xl font-semibold">Inyección Directa Cerebro</h2>
                                </div>
                                <ApiTester
                                    endpoint={`${API_BASE}/api/internal/send_message`}
                                    method="POST"
                                    defaultPayload={{
                                        platform: "telegram",
                                        recipient: defaultChatId,
                                        message: "🚀 Mensaje inyectado directamente a Cerebro actions via Web Lab."
                                    }}
                                    syncGlobal={{ recipient: defaultChatId }}
                                />
                            </section>
                        </div>
                    </div>
                )}
            </div>

            <footer className="mt-20 py-8 border-t border-apple-border text-center">
                <p className="text-sm text-apple-textMuted font-medium">
                    OMNIII Full System Lab • Business ID: {businessId} • V3.1 (Omni Console)
                </p>
                <div className="flex justify-center gap-4 mt-4 opacity-50">
                    <div className="flex items-center gap-1 text-[10px] uppercase tracking-tighter">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        Vite
                    </div>
                    <div className="flex items-center gap-1 text-[10px] uppercase tracking-tighter">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        Tailwind
                    </div>
                    <div className="flex items-center gap-1 text-[10px] uppercase tracking-tighter">
                        <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                        Cloudflare
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default App;

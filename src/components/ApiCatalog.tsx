import { useState } from 'react';
import { Search, Database, MessageSquare, Brain, Phone, Shield, ChevronRight, Copy, Check, PlayCircle } from 'lucide-react';
import ApiTester from './ApiTester';

interface Endpoint {
    id: string;
    category: 'erp' | 'messaging' | 'evolution' | 'telethon' | 'knowledge' | 'system';
    name: string;
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
    path: string;
    description: string;
    payload: any;
}

const ENDPOINTS: Endpoint[] = [
    // ERPNext - Companies & Customers
    {
        id: 'erp-health',
        category: 'erp',
        name: 'ERP Health',
        method: 'GET',
        path: '/api/v1/erp/health',
        description: 'Verifica conexión con ERPNext y base_url.',
        payload: {}
    },
    {
        id: 'erp-list-customers',
        category: 'erp',
        name: 'Listar Clientes',
        method: 'GET',
        path: '/api/v1/erp/customers?limit=10',
        description: 'Obtiene lista de clientes de ERPNext.',
        payload: {}
    },
    {
        id: 'erp-create-customer',
        category: 'erp',
        name: 'Crear Cliente',
        method: 'POST',
        path: '/api/v1/erp/customers',
        description: 'Crea un nuevo cliente en ERPNext.',
        payload: { customer_name: "Cliente Nuevo Lab", customer_type: "Individual", territory: "Argentina" }
    },
    // ERPNext - Invoices
    {
        id: 'erp-list-invoices',
        category: 'erp',
        name: 'Listar Facturas',
        method: 'GET',
        path: '/api/v1/erp/invoices?limit=5',
        description: 'Obtiene facturas de venta recientes.',
        payload: {}
    },
    {
        id: 'erp-create-invoice',
        category: 'erp',
        name: 'Crear Factura',
        method: 'POST',
        path: '/api/v1/erp/invoices',
        description: 'Crea una factura de venta (Sales Invoice).',
        payload: {
            customer: "Cliente General",
            items: [{ item_code: "ITEM-GENERIC", qty: 1, rate: 1500.00 }]
        }
    },
    // ERPNext - Stock
    {
        id: 'erp-get-stock',
        category: 'erp',
        name: 'Consultar Stock',
        method: 'GET',
        path: '/api/v1/erp/stock/ITEM-CODE',
        description: 'Consulta balance de stock para un item.',
        payload: {}
    },
    {
        id: 'erp-stock-entry',
        category: 'erp',
        name: 'Entrada de Stock',
        method: 'POST',
        path: '/api/v1/erp/stock-entry',
        description: 'Registra un movimiento de stock (Material Receipt).',
        payload: {
            stock_entry_type: "Material Receipt",
            items: [{ item_code: "ITEM-GENERIC", qty: 10, t_warehouse: "Stores - OMNI" }]
        }
    },
    // ERPNext - Expenses
    {
        id: 'erp-create-expense',
        category: 'erp',
        name: 'Registrar Gasto',
        method: 'POST',
        path: '/api/v1/erp/expenses',
        description: 'Registra un gasto operativo (alquiler, luz, etc).',
        payload: {
            owner_id: "33",
            expense_type: "servicios",
            amount: 5000,
            description: "Pago de luz Lab",
            payment_method: "efectivo"
        }
    },
    // WhatsApp (Evolution)
    {
        id: 'evo-list',
        category: 'evolution',
        name: 'Listar Instancias',
        method: 'GET',
        path: '/api/v1/evolution/list',
        description: 'Lista todas las instancias conectadas al host Evolution.',
        payload: {}
    },
    {
        id: 'evo-status',
        category: 'evolution',
        name: 'Estado de Instancia',
        method: 'GET',
        path: '/api/v1/evolution/instance/33/status',
        description: 'Verifica si la instancia del negocio está conectada.',
        payload: {}
    },
    // Telegram (Bot Factory)
    {
        id: 'tele-status',
        category: 'telethon',
        name: 'Estado Telethon',
        method: 'GET',
        path: '/api/v1/bot-factory/telethon-status',
        description: 'Estado de las sesiones de Telegram en el VPS.',
        payload: {}
    },
    {
        id: 'tele-inventory',
        category: 'telethon',
        name: 'Inventario de Bots',
        method: 'GET',
        path: '/api/v1/bot-factory/inventory',
        description: 'Bots disponibles y asignados en el sistema.',
        payload: {}
    },
    // Knowledge (Clawbot)
    {
        id: 'kb-stats',
        category: 'knowledge',
        name: 'Knowledge Stats',
        method: 'GET',
        path: '/api/v1/knowledge/stats',
        description: 'Estadísticas de la base de conocimiento RAG.',
        payload: {}
    },
    {
        id: 'kb-search',
        category: 'knowledge',
        name: 'Búsqueda RAG',
        method: 'GET',
        path: '/api/v1/knowledge/search?q=IA',
        description: 'Búsqueda híbrida en la base de conocimiento.',
        payload: {}
    },
    // System
    {
        id: 'sys-health',
        category: 'system',
        name: 'Core Health',
        method: 'GET',
        path: '/api/health',
        description: 'Estado global del servidor (Redis, DB, Uptime).',
        payload: {}
    },
    {
        id: 'sys-stock-cards',
        category: 'system',
        name: 'Cartas de Stock',
        method: 'GET',
        path: '/api/v1/stock/cards',
        description: 'Negocios disponibles en stock y activos.',
        payload: {}
    }
];

const ApiCatalog = ({ businessId, targetRole, defaultChatId }: any) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [copySuccess, setCopySuccess] = useState<string | null>(null);

    const filteredEndpoints = ENDPOINTS.filter(e =>
        e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const activeEndpoint = ENDPOINTS.find(e => e.id === selectedId);

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopySuccess(id);
        setTimeout(() => setCopySuccess(null), 2000);
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'erp': return <Database className="w-4 h-4 text-green-400" />;
            case 'messaging': return <MessageSquare className="w-4 h-4 text-blue-400" />;
            case 'evolution': return <Phone className="w-4 h-4 text-teal-400" />;
            case 'telethon': return <Shield className="w-4 h-4 text-orange-400" />;
            case 'knowledge': return <Brain className="w-4 h-4 text-purple-400" />;
            default: return <Shield className="w-4 h-4 text-gray-400" />;
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[700px]">
            {/* Sidebar: List */}
            <div className="lg:col-span-4 flex flex-col glass-panel p-0 overflow-hidden border-white/10">
                <div className="p-4 border-b border-white/10 bg-white/5">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-apple-textMuted" />
                        <input
                            type="text"
                            placeholder="Buscar endpoint o servicio..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-apple-blue transition-all"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {filteredEndpoints.map(endpoint => (
                        <button
                            key={endpoint.id}
                            onClick={() => setSelectedId(endpoint.id)}
                            className={`w-full text-left p-4 flex items-center gap-3 transition-colors border-b border-white/5 ${selectedId === endpoint.id ? 'bg-apple-blue/10 border-r-2 border-r-apple-blue' : 'hover:bg-white/5'
                                }`}
                        >
                            {getCategoryIcon(endpoint.category)}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                    <span className={`text-[10px] font-bold uppercase tracking-tighter ${endpoint.method === 'GET' ? 'text-green-400' : 'text-orange-400'
                                        }`}>
                                        {endpoint.method}
                                    </span>
                                    <span className="text-[10px] text-apple-textMuted truncate">{endpoint.category}</span>
                                </div>
                                <div className="text-sm font-semibold truncate leading-tight">{endpoint.name}</div>
                            </div>
                            <ChevronRight className={`w-4 h-4 text-apple-textMuted transition-transform ${selectedId === endpoint.id ? 'rotate-90 text-apple-blue' : ''}`} />
                        </button>
                    ))}
                    {filteredEndpoints.length === 0 && (
                        <div className="p-8 text-center text-apple-textMuted text-sm italic">
                            No se encontraron endpoints.
                        </div>
                    )}
                </div>
            </div>

            {/* Content: Tester + Documentation */}
            <div className="lg:col-span-8 flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-2">
                {activeEndpoint ? (
                    <>
                        <section className="glass-panel p-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-2xl font-bold flex items-center gap-2">
                                        {getCategoryIcon(activeEndpoint.category)}
                                        {activeEndpoint.name}
                                    </h3>
                                    <p className="text-apple-textMuted mt-1">{activeEndpoint.description}</p>
                                </div>
                                <div className="bg-white/5 rounded-lg px-3 py-1 text-xs font-mono text-apple-blue border border-white/10">
                                    {activeEndpoint.path}
                                </div>
                            </div>

                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className="text-xs font-bold uppercase text-apple-textMuted tracking-widest">Ejemplo de URL</h4>
                                    <button
                                        onClick={() => copyToClipboard(`${activeEndpoint.path}`, 'url')}
                                        className="text-xs text-apple-blue hover:underline flex items-center gap-1"
                                    >
                                        {copySuccess === 'url' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                        Copiar URL
                                    </button>
                                </div>
                                <div className="bg-black/60 p-3 rounded-lg border border-white/5 font-mono text-xs break-all text-blue-300">
                                    fetch("<span className="text-green-400">{activeEndpoint.path}</span>", {"{"} method: "{activeEndpoint.method}" {"}"})
                                </div>
                            </div>

                            <div className="border-t border-white/10 pt-6">
                                <h4 className="text-xs font-bold uppercase text-apple-textMuted tracking-widest mb-4">Probador en Vivo</h4>
                                <ApiTester
                                    endpoint={`${activeEndpoint.path}`}
                                    method={activeEndpoint.method}
                                    defaultPayload={activeEndpoint.payload}
                                    syncGlobal={{
                                        business_id: businessId,
                                        target_role: targetRole,
                                        chat_id: defaultChatId,
                                        owner_id: String(businessId)
                                    }}
                                />
                            </div>
                        </section>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center glass-panel border-dashed border-2 opacity-50">
                        <PlayCircle className="w-16 h-16 text-apple-textMuted mb-4 animate-pulse" />
                        <h3 className="text-xl font-medium">Selecciona una función del catálogo</h3>
                        <p className="text-apple-textMuted mt-2">Prueba endpoints de ERPNext, WhatsApp, Telegram y más en tiempo real.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ApiCatalog;

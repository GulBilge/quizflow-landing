import { createClient } from "@/utils/supabase/server";
import { 
    Layers, 
    Search, 
    Filter, 
    Terminal, 
    Clock, 
    AlertCircle, 
    CheckCircle2, 
    ExternalLink,
    Zap,
    Cpu,
    Timer
} from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";

export default async function AdminLogsPage({
    params: { locale }
}: {
    params: { locale: string }
}) {
    const supabase = await createClient();

    const { data: logs, error } = await supabase
        .from("pipeline_logs")
        .select(`
            *,
            campaigns (
                title
            )
        `)
        .order("created_at", { ascending: false })
        .limit(50);

    if (error) {
        console.error("Logs fetch error:", error);
    }

    return (
        <div className="p-6 md:p-10 space-y-8 bg-slate-50/50 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                        <Layers className="text-indigo-600 w-8 h-8" />
                        Sistem & Pipeline Logları
                    </h1>
                    <p className="text-slate-500 mt-1">AI ajanlarının ve n8n iş akışlarının anlık çalışma geçmişi.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="gap-2 bg-white h-11 px-6 rounded-xl border-slate-200">
                        <Filter className="w-4 h-4" /> Filtrele
                    </Button>
                    <Button className="gap-2 bg-slate-900 hover:bg-slate-800 h-11 px-6 rounded-xl text-white">
                        <Terminal className="w-4 h-4" /> Arşivlenmiş Loglar
                    </Button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3 text-emerald-600 mb-2 font-bold text-sm uppercase tracking-wider">
                        <CheckCircle2 className="w-4 h-4" /> Başarılı İşlemler
                    </div>
                    <p className="text-3xl font-bold text-slate-900">4,102</p>
                    <p className="text-xs text-slate-400 mt-1">Son 24 saat içinde</p>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3 text-rose-600 mb-2 font-bold text-sm uppercase tracking-wider">
                        <AlertCircle className="w-4 h-4" /> Hatalar
                    </div>
                    <p className="text-3xl font-bold text-slate-900">12</p>
                    <p className="text-xs text-slate-400 mt-1">Kritik müdahale gerekiyor</p>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3 text-blue-600 mb-2 font-bold text-sm uppercase tracking-wider">
                        <Timer className="w-4 h-4" /> Ort. Gecikme
                    </div>
                    <p className="text-3xl font-bold text-slate-900">1.8s</p>
                    <p className="text-xs text-slate-400 mt-1">Model yanıt süresi</p>
                </div>
            </div>

            {/* Logs List */}
            <div className="bg-slate-950 rounded-[2.5rem] border border-slate-800 shadow-2xl overflow-hidden min-h-[500px]">
                <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Real-time Output</span>
                    </div>
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-slate-800"></div>
                        <div className="w-3 h-3 rounded-full bg-slate-800"></div>
                        <div className="w-3 h-3 rounded-full bg-slate-800"></div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-900/30 border-b border-slate-800">
                                <th className="px-8 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Timestamp</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Stage & Agent</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Campaign</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Meta</th>
                                <th className="px-8 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Details</th>
                            </tr>
                        </thead>
                        <tbody className="font-mono text-xs">
                            {logs && logs.length > 0 ? (logs as any[]).map((log: any) => (
                                <tr key={log.id} className="border-b border-slate-900 hover:bg-slate-900/50 transition-colors group">
                                    <td className="px-8 py-4 whitespace-nowrap text-slate-500">
                                        {format(new Date(log.created_at), "HH:mm:ss.SS")}
                                    </td>
                                    <td className="px-8 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-indigo-400 font-bold uppercase tracking-tight">{log.stage}</span>
                                            <span className="text-slate-400 opacity-60 flex items-center gap-1">
                                                <Cpu className="w-3 h-3" />
                                                {log.agent_name || 'System Orchestrator'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-4">
                                        <span className={cn(
                                            "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md font-bold uppercase tracking-tighter text-[10px]",
                                            log.status === 'success' ? "bg-emerald-500/10 text-emerald-500" :
                                            log.status === 'error' ? "bg-rose-500/10 text-rose-500" : "bg-amber-500/10 text-amber-500"
                                        )}>
                                            {log.status === 'success' ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                                            {log.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-4 text-slate-300">
                                        {(log.campaigns as any)?.title || '-'}
                                    </td>
                                    <td className="px-8 py-4">
                                        <div className="flex gap-4">
                                            <div className="flex flex-col">
                                                <span className="text-[9px] text-slate-500 uppercase">Tokens</span>
                                                <span className="text-slate-300">{(log.input_tokens || 0) + (log.output_tokens || 0)}</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[9px] text-slate-500 uppercase">Latency</span>
                                                <span className="text-slate-300">{log.latency_ms}ms</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-4 text-right">
                                        <button className="p-2 text-slate-600 hover:text-indigo-400 transition-colors">
                                            <ExternalLink className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={6} className="px-8 py-20 text-center text-slate-600 italic">
                                        Log kaydı bulunamadı.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

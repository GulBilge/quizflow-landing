import { cn } from "@/utils/cn";
import { 
    Clock, 
    CheckCircle2, 
    AlertCircle, 
    FileText, 
    Send, 
    Archive,
    XCircle
} from "lucide-react";

export type ContentStatus = 
    | 'draft'
    | 'pending_review'
    | 'approved'
    | 'publishing'
    | 'published'
    | 'rejected'
    | 'archived';

interface CampaignStatusBadgeProps {
    status: ContentStatus | string;
    className?: string;
}

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
    draft: { 
        label: "Taslak", 
        color: "bg-slate-100 text-slate-700 border-slate-200", 
        icon: FileText 
    },
    pending_review: { 
        label: "İnceleme Bekliyor", 
        color: "bg-amber-100 text-amber-700 border-amber-200", 
        icon: Clock 
    },
    approved: { 
        label: "Onaylandı", 
        color: "bg-blue-100 text-blue-700 border-blue-200", 
        icon: CheckCircle2 
    },
    publishing: { 
        label: "Yayınlanıyor...", 
        color: "bg-orange-100 text-orange-700 border-orange-200 animate-pulse", 
        icon: Send 
    },
    published: { 
        label: "Yayında", 
        color: "bg-emerald-100 text-emerald-700 border-emerald-200", 
        icon: CheckCircle2 
    },
    rejected: { 
        label: "Reddedildi", 
        color: "bg-rose-100 text-rose-700 border-rose-200", 
        icon: XCircle 
    },
    archived: { 
        label: "Arşiv", 
        color: "bg-gray-100 text-gray-600 border-gray-200", 
        icon: Archive 
    },
};

export function CampaignStatusBadge({ status, className }: CampaignStatusBadgeProps) {
    const config = statusConfig[status] || { 
        label: status, 
        color: "bg-gray-100 text-gray-700 border-gray-200", 
        icon: AlertCircle 
    };
    
    const Icon = config.icon;

    return (
        <span className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border shadow-sm",
            config.color,
            className
        )}>
            <Icon className="w-3.5 h-3.5" />
            {config.label}
        </span>
    );
}

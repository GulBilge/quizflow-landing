"use client";

import { createClient } from "@/utils/supabase/client";
import { Database, Bookmark, PlayCircle, Users, RefreshCw, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

// Types based on the views provided
type KPISummary = {
    total_users: number;
    pool_size: number;
    total_adoptions: number;
    total_plays: number;
    waitlist_count: number;
};

type PopularQuiz = {
    title: string;
    adoption_count: number;
    play_count: number;
};

type ContentFeedItem = {
    quiz_title: string;
    created_at: string;
    question_count: number;
    creator_email: string;
};

type AttemptFeedItem = {
    id: string;
    email: string;
    quiz_title: string;
    status: string;
    score: number | null;
    started_at: string;
    completed_at: string | null;
};

// --- Components ---

function KpiCard({
    label,
    value,
    icon: Icon,
    colorClass,
}: {
    label: string;
    value: number | string;
    icon: any;
    colorClass: string;
}) {
    return (
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className={`p-3 rounded-lg ${colorClass} bg-opacity-10`}>
                <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${colorClass.replace("bg-", "text-")}`} />
            </div>
            <div>
                <p className="text-xs sm:text-sm font-medium text-gray-500">{label}</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{value}</p>
            </div>
        </div>
    );
}

function SkeletonCard() {
    return <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-24 animate-pulse bg-gray-50"></div>;
}

function SectionTitle({ title }: { title: string }) {
    return <h3 className="text-lg font-bold text-gray-800 mb-4">{title}</h3>;
}

const getInitials = (email: string) => {
    if (!email) return "?";
    return email.charAt(0).toUpperCase();
};

const ITEMS_PER_PAGE = 10;

export default function AdminDashboard() {
    const [kpi, setKpi] = useState<KPISummary | null>(null);
    const [popularQuizzes, setPopularQuizzes] = useState<PopularQuiz[]>([]);
    const [contentFeed, setContentFeed] = useState<ContentFeedItem[]>([]);
    const [attemptsFeed, setAttemptsFeed] = useState<AttemptFeedItem[]>([]);

    // Pagination states
    const [attemptsPage, setAttemptsPage] = useState(0);
    const [contentPage, setContentPage] = useState(0);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const supabase = createClient();

    const fetchKpiAndPopular = useCallback(async () => {
        try {
            const { data: kpiData, error: kpiError } = await supabase
                .from("admin_kpi_summary")
                .select("*")
                .single();
            if (kpiError) throw kpiError;
            setKpi(kpiData);

            const { data: popularData, error: popularError } = await supabase
                .from("admin_popular_quizzes")
                .select("*")
                .limit(10); // Still limit popular quizzes to top 10 for the summary widget
            if (popularError) throw popularError;
            setPopularQuizzes(popularData || []);
        } catch (err: any) {
            console.error("Error fetching KPI/Popular:", err);
            setError(err.message);
        }
    }, [supabase]);

    const fetchContentFeed = useCallback(async (page: number) => {
        try {
            const from = page * ITEMS_PER_PAGE;
            const to = from + ITEMS_PER_PAGE - 1;
            const { data, error } = await supabase
                .from("admin_content_feed")
                .select("*")
                .range(from, to);

            if (error) throw error;
            setContentFeed(data || []);
        } catch (err: any) {
            console.error("Error fetching Content Feed:", err);
        }
    }, [supabase]);

    const fetchAttemptsFeed = useCallback(async (page: number) => {
        try {
            const from = page * ITEMS_PER_PAGE;
            const to = from + ITEMS_PER_PAGE - 1;
            const { data, error } = await supabase
                .from("admin_attempts_feed")
                .select("*")
                .range(from, to);

            if (error) throw error;
            setAttemptsFeed(data || []);
        } catch (err: any) {
            console.error("Error fetching Attempts Feed:", err);
        }
    }, [supabase]);

    const fetchAllData = useCallback(async () => {
        setLoading(true);
        await Promise.all([
            fetchKpiAndPopular(),
            fetchContentFeed(contentPage),
            fetchAttemptsFeed(attemptsPage)
        ]);
        setLoading(false);
    }, [fetchKpiAndPopular, fetchContentFeed, fetchAttemptsFeed, contentPage, attemptsPage]);

    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);

    // Handlers for pagination
    const nextAttempts = () => setAttemptsPage(p => p + 1);
    const prevAttempts = () => setAttemptsPage(p => Math.max(0, p - 1));

    const nextContent = () => setContentPage(p => p + 1);
    const prevContent = () => setContentPage(p => Math.max(0, p - 1));

    const currentDate = new Date().toLocaleDateString("tr-TR", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    return (
        <div className="min-h-screen bg-gray-50 pb-12 font-sans md:p-8 p-4">
            {/* 1. Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">QuizFlow Admin</h1>
                    <p className="text-gray-500 mt-1 text-sm md:text-base">Topluluk Büyüme ve Etkileşim Raporu</p>
                </div>
                <div className="flex items-center space-x-3 md:space-x-4">
                    <span className="hidden md:inline-block text-sm font-medium text-gray-500 bg-white px-3 py-1 rounded-md border border-gray-200 shadow-sm">
                        {currentDate}
                    </span>
                    <button
                        onClick={fetchAllData}
                        className="flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm w-full md:w-auto"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                        <span>Yenile</span>
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-r-lg flex items-start">
                    <AlertCircle className="w-5 h-5 text-red-500 mr-2 mt-0.5" />
                    <div>
                        <h3 className="text-red-800 font-medium">Hata</h3>
                        <p className="text-red-700 text-sm mt-1">{error}</p>
                    </div>
                </div>
            )}

            {/* 2. KPI Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-8">
                {loading && !kpi ? (
                    Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)
                ) : (
                    <>
                        <KpiCard
                            label="Global Havuz"
                            value={kpi?.pool_size || 0}
                            icon={Database}
                            colorClass="text-blue-600 bg-blue-100"
                        />
                        <KpiCard
                            label="Kütüphane"
                            value={kpi?.total_adoptions || 0}
                            icon={Bookmark}
                            colorClass="text-green-600 bg-green-100"
                        />
                        <KpiCard
                            label="Çözülme"
                            value={kpi?.total_plays || 0}
                            icon={PlayCircle}
                            colorClass="text-purple-600 bg-purple-100"
                        />
                        <KpiCard
                            label="Kullanıcılar"
                            value={kpi?.total_users || 0}
                            icon={Users}
                            colorClass="text-slate-600 bg-slate-100"
                        />
                    </>
                )}
            </div>

            {/* 3. Split Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

                {/* Left Panel: Top Hits */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
                    <div className="p-4 md:p-6 border-b border-gray-100">
                        <SectionTitle title="Kütüphanelere En Çok Eklenen Sınavlar" />
                    </div>
                    <div className="overflow-x-auto">
                        {loading && popularQuizzes.length === 0 ? (
                            <div className="p-6 space-y-4">
                                <div className="h-8 bg-gray-100 rounded w-full animate-pulse"></div>
                                <div className="h-8 bg-gray-100 rounded w-full animate-pulse"></div>
                            </div>
                        ) : (
                            <table className="w-full text-left border-collapse min-w-[300px]">
                                <tbody>
                                    {popularQuizzes.map((quiz, index) => (
                                        <tr key={index} className="border-b border-gray-50 hover:bg-gray-50 transition-colors last:border-0">
                                            <td className="p-3 md:p-4 w-10 text-center text-gray-400 font-bold text-sm">{index + 1}</td>
                                            <td className="p-3 md:p-4">
                                                <p className="font-semibold text-gray-800 line-clamp-1 text-sm md:text-base">{quiz.title}</p>
                                            </td>
                                            <td className="p-3 md:p-4 text-right">
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 whitespace-nowrap">
                                                    {quiz.adoption_count} adet
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {popularQuizzes.length === 0 && !loading && (
                                        <tr><td colSpan={3} className="p-8 text-center text-gray-400">Veri bulunamadı.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* Right Panel: Production Feed */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
                    <div className="p-4 md:p-6 border-b border-gray-100 flex justify-between items-center">
                        <SectionTitle title="Son Üretilenler" />
                        <div className="flex space-x-2">
                            <button onClick={prevContent} disabled={contentPage === 0} className="p-1 rounded hover:bg-gray-100 disabled:opacity-30">
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button onClick={nextContent} disabled={contentFeed.length < ITEMS_PER_PAGE} className="p-1 rounded hover:bg-gray-100 disabled:opacity-30">
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                    <div className="overflow-y-auto">
                        {loading && contentFeed.length === 0 ? (
                            <div className="p-6 space-y-4">
                                <div className="h-12 bg-gray-100 rounded w-full animate-pulse"></div>
                                <div className="h-12 bg-gray-100 rounded w-full animate-pulse"></div>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {contentFeed.map((item, index) => (
                                    <div key={index} className="p-4 hover:bg-gray-50 transition-colors flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                                        <div>
                                            <p className="font-medium text-gray-900 text-sm md:text-base line-clamp-2">{item.quiz_title}</p>
                                            <div className="flex flex-wrap items-center text-xs text-gray-500 mt-1 gap-2">
                                                <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-700">{item.creator_email}</span>
                                                <span>•</span>
                                                <span>{item.question_count} P.</span>
                                            </div>
                                        </div>
                                        <span className="text-xs text-gray-400 whitespace-nowrap">
                                            {formatDistanceToNow(new Date(item.created_at), { addSuffix: true, locale: tr })}
                                        </span>
                                    </div>
                                ))}
                                {contentFeed.length === 0 && !loading && (
                                    <div className="p-8 text-center text-gray-400">Veri bulunamadı.</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 4. Bottom Section: Live Attempts Feed */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 md:p-6 border-b border-gray-100 flex justify-between items-center">
                    <SectionTitle title="Canlı Çözüm Hareketleri" />
                    <div className="flex space-x-2">
                        <button onClick={prevAttempts} disabled={attemptsPage === 0} className="p-1 rounded hover:bg-gray-100 disabled:opacity-30">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button onClick={nextAttempts} disabled={attemptsFeed.length < ITEMS_PER_PAGE} className="p-1 rounded hover:bg-gray-100 disabled:opacity-30">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[600px] md:min-w-full">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                            <tr>
                                <th className="px-4 md:px-6 py-4">Kullanıcı</th>
                                <th className="px-4 md:px-6 py-4">Quiz</th>
                                <th className="px-4 md:px-6 py-4">Durum</th>
                                <th className="px-4 md:px-6 py-4">Skor</th>
                                <th className="px-4 md:px-6 py-4 text-right">Zaman</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading && attemptsFeed.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-6">
                                        <div className="space-y-4">
                                            <div className="h-10 bg-gray-100 rounded w-full animate-pulse"></div>
                                            <div className="h-10 bg-gray-100 rounded w-full animate-pulse"></div>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                attemptsFeed.map((attempt) => (
                                    <tr key={attempt.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 md:px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs mr-3 shrink-0">
                                                    {getInitials(attempt.email)}
                                                </div>
                                                <span className="text-xs md:text-sm text-gray-700 font-medium font-mono break-all">
                                                    {attempt.email}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 md:px-6 py-4">
                                            <span className="text-xs md:text-sm text-gray-900 font-medium line-clamp-2 max-w-[150px] md:max-w-xs">{attempt.quiz_title}</span>
                                        </td>
                                        <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                                            {attempt.status === 'completed' ? (
                                                <span className="inline-flex items-center px-2 md:px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    Tamamlandı
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2 md:px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                    Çözüyor...
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                                            {attempt.status === 'completed' && attempt.score !== null ? (
                                                <span className="text-sm font-bold text-gray-900">{attempt.score}/100</span>
                                            ) : (
                                                <span className="text-sm text-gray-400 font-bold">-</span>
                                            )}
                                        </td>
                                        <td className="px-4 md:px-6 py-4 whitespace-nowrap text-right text-xs md:text-sm text-gray-500">
                                            {formatDistanceToNow(new Date(attempt.started_at), { addSuffix: true, locale: tr })}
                                        </td>
                                    </tr>
                                ))
                            )}
                            {attemptsFeed.length === 0 && !loading && (
                                <tr><td colSpan={5} className="p-8 text-center text-gray-400">Veri bulunamadı.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

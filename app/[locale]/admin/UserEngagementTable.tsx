"use client";

import { useState } from "react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Users } from "lucide-react";

export type UserEngagement = {
    full_name: string;
    email: string;
    participation_rate: number;
    active_days: string[]; // dates in string format
    missed_days: string[]; // dates in string format
};

interface UserEngagementTableProps {
    data: UserEngagement[];
    loading: boolean;
}

export default function UserEngagementTable({ data, loading }: UserEngagementTableProps) {
    if (loading && data.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
                <div className="h-8 bg-gray-50 rounded w-1/4 animate-pulse"></div>
                <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-12 bg-gray-50 rounded w-full animate-pulse"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 md:p-6 border-b border-gray-100 flex items-center space-x-2">
                <Users className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-bold text-gray-800">Kullanıcı Katılım Takibi (Son 2 Hafta)</h3>
            </div>

            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[150px] sm:w-[200px]">Kullanıcı</TableHead>
                            <TableHead className="w-[100px] sm:w-[150px]">Katılım</TableHead>
                            <TableHead className="min-w-[200px]">Aktif Günler</TableHead>
                            <TableHead className="min-w-[200px]">Kaçırılan Günler</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((user) => (
                            <TableRow key={user.email}>
                                <TableCell className="font-medium">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-gray-900">
                                            {user.full_name || "İsimsiz Kullanıcı"}
                                        </span>
                                        <span className="text-xs text-gray-500">{user.email}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center space-x-2">
                                        <Progress value={user.participation_rate} className="w-[60px]" />
                                        <span className="text-xs font-medium text-gray-600">
                                            %{user.participation_rate?.toFixed(0)}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <TooltipProvider delayDuration={0}>
                                        <ScrollArea className="w-full whitespace-nowrap">
                                            <div className="flex space-x-1 pb-2">
                                                {user.active_days && user.active_days.length > 0 ? (
                                                    user.active_days.map((date, idx) => (
                                                        <Tooltip key={idx}>
                                                            <TooltipTrigger>
                                                                <Badge
                                                                    variant="secondary"
                                                                    className="bg-green-100 text-green-700 hover:bg-green-200 cursor-default px-1.5 py-0.5 text-[10px]"
                                                                >
                                                                    {format(new Date(date), "d MMM", { locale: tr })}
                                                                </Badge>
                                                            </TooltipTrigger>
                                                            <TooltipContent side="top">
                                                                {format(new Date(date), "d MMMM yyyy", { locale: tr })}
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    ))
                                                ) : (
                                                    <span className="text-xs text-gray-400">-</span>
                                                )}
                                            </div>
                                            <ScrollBar orientation="horizontal" className="h-1.5" />
                                        </ScrollArea>
                                    </TooltipProvider>
                                </TableCell>
                                <TableCell>
                                    <TooltipProvider delayDuration={0}>
                                        <ScrollArea className="w-full whitespace-nowrap">
                                            <div className="flex space-x-1 pb-2">
                                                {user.missed_days && user.missed_days.length > 0 ? (
                                                    user.missed_days.map((date, idx) => (
                                                        <Tooltip key={idx}>
                                                            <TooltipTrigger>
                                                                <Badge
                                                                    variant="secondary"
                                                                    className="bg-red-50 text-red-600 hover:bg-red-100 cursor-default px-1.5 py-0.5 text-[10px]"
                                                                >
                                                                    {format(new Date(date), "d MMM", { locale: tr })}
                                                                </Badge>
                                                            </TooltipTrigger>
                                                            <TooltipContent side="top">
                                                                {format(new Date(date), "d MMMM yyyy", { locale: tr })}
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    ))
                                                ) : (
                                                    <span className="text-xs text-gray-400">Hiç yok</span>
                                                )}
                                            </div>
                                            <ScrollBar orientation="horizontal" className="h-1.5" />
                                        </ScrollArea>
                                    </TooltipProvider>
                                </TableCell>
                            </TableRow>
                        ))}
                        {data.length === 0 && !loading && (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center text-gray-500">
                                    Veri bulunamadı.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

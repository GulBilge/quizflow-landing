

export default async function QuizLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // We allow guests in this layout, specific pages (like QuizPage) 
    // will handle their own authorization logic based on searchParams.
    return (
        <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
            {children}
        </div>
    );
}

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
            {/* 
        We could add a sidebar here later, 
        but for now the dashboard is a single page as requested.
      */}
            <main>{children}</main>
        </div>
    );
}

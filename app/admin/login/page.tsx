"use client";

import { createClient } from "@/utils/supabase/client";
import { Loader2 } from "lucide-react";
import { useState } from "react";

const supabase = createClient();

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        setIsLoading(true);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo: `${window.location.origin}/auth/callback?next=/admin`,
                    queryParams: {
                        access_type: "offline",
                        prompt: "select_account",
                    },
                },
            });
            if (error) {
                console.error("Login error:", error);
                alert("Login failed: " + error.message);
                setIsLoading(false);
            }
        } catch (err) {
            console.error("Unexpected error:", err);
            alert("An unexpected error occurred.");
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        Quizyen Admin
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Yönetim paneline erişmek için giriş yapın
                    </p>
                </div>

                <div className="mt-8 space-y-6">
                    <button
                        onClick={handleLogin}
                        disabled={isLoading}
                        className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200"
                    >
                        {isLoading ? (
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        ) : (
                            <svg
                                className="mr-2 h-5 w-5"
                                aria-hidden="true"
                                focusable="false"
                                data-prefix="fab"
                                data-icon="google"
                                role="img"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 488 512"
                            >
                                <path
                                    fill="currentColor"
                                    d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                                ></path>
                            </svg>
                        )}
                        {isLoading ? "Yönlendiriliyor..." : "Google ile Giriş Yap"}
                    </button>
                </div>
            </div>
        </div>
    );
}

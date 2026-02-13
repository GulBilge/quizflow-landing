'use client';

import { motion } from 'framer-motion';
import { Trash2, ArrowLeft, AlertTriangle, Smartphone, Mail } from 'lucide-react';
import Link from 'next/link';

export default function DeleteAccount() {
    return (
        <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-indigo-500 selection:text-white overflow-hidden">

            {/* Background Gradients */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-red-600/10 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-orange-600/10 rounded-full blur-[100px]"></div>
            </div>

            {/* Navbar */}
            <nav className="fixed w-full z-50 bg-neutral-950/80 backdrop-blur-md border-b border-white/5">
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tighter hover:opacity-80 transition-opacity">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg" style={{ backgroundColor: 'rgb(44 63 113)', boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)' }}>
                            <img src="/webicon.jpg" alt="QuizFlow Logo" className="w-7 h-7" />
                        </div>
                        QuizFlow
                    </Link>
                    <Link href="/" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors flex items-center gap-2">
                        <ArrowLeft size={16} />
                        Ana Sayfaya Dön
                    </Link>
                </div>
            </nav>

            <main className="relative z-10 pt-32 pb-20 px-4">
                <div className="max-w-4xl mx-auto">

                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-16"
                    >
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600/10 border border-red-500/20 rounded-2xl mb-6">
                            <Trash2 className="text-red-400" size={32} />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                            <span className="bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">Hesabınızı Silin</span>
                        </h1>
                        <p className="text-neutral-400 max-w-2xl mx-auto">
                            Ayrıldığınızı görmek bizi üzüyor. QuizFlow hesabınızı ve ilişkili tüm verileri kalıcı olarak silmek için aşağıdaki talimatları izleyin.
                        </p>
                    </motion.div>

                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="space-y-8"
                    >

                        {/* Warning Notice */}
                        <section className="bg-gradient-to-br from-red-900/20 to-orange-900/20 border border-red-500/30 p-8 rounded-2xl">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0">
                                    <AlertTriangle className="text-red-400" size={28} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white mb-2">⚠️ Önemli Uyarı</h2>
                                    <p className="text-neutral-300 leading-relaxed mb-3">
                                        Hesabınızı silmek <strong className="text-white">kalıcıdır ve geri alınamaz</strong>. Silindikten sonra şunlara erişiminizi kaybedersiniz:
                                    </p>
                                    <ul className="space-y-2 list-disc list-inside ml-4 text-neutral-300">
                                        <li>Tüm oluşturduğunuz quizler ve geçmişiniz</li>
                                        <li>Kaydedilen PDF'leriniz ve yüklenen belgeler</li>
                                        <li>Hesap ayarlarınız ve tercihleriniz</li>
                                        <li>Varsa kalan abonelik avantajlarınız</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* How to Delete - Mobile App */}
                        <section className="bg-neutral-900/40 border border-white/5 p-8 rounded-2xl">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-neutral-800 rounded-xl flex items-center justify-center">
                                    <Smartphone className="text-indigo-400" size={24} />
                                </div>
                                <h2 className="text-2xl font-bold text-white">Mobil Uygulama Üzerinden Silme</h2>
                            </div>

                            <p className="text-neutral-300 leading-relaxed mb-6">
                                Hesabınızı doğrudan QuizFlow mobil uygulamasından silmek için:
                            </p>

                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 bg-indigo-600/20 border border-indigo-500/30 rounded-full flex items-center justify-center text-indigo-400 font-bold text-sm">
                                        1
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-white mb-1">QuizFlow Uygulamasını Açın</h3>
                                        <p className="text-neutral-400 text-sm">Mobil cihazınızda QuizFlow uygulamasını başlatın</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 bg-indigo-600/20 border border-indigo-500/30 rounded-full flex items-center justify-center text-indigo-400 font-bold text-sm">
                                        2
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-white mb-1">Menü Simgesine Dokunun</h3>
                                        <p className="text-neutral-400 text-sm">Ekranın sağ üst köşesindeki menü simgesine (☰) dokunun</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 bg-indigo-600/20 border border-indigo-500/30 rounded-full flex items-center justify-center text-indigo-400 font-bold text-sm">
                                        3
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-white mb-1">"Profilim"i Seçin</h3>
                                        <p className="text-neutral-400 text-sm">Menüden profil ayarlarınıza erişmek için "Profilim" seçeneğine dokunun</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 bg-indigo-600/20 border border-indigo-500/30 rounded-full flex items-center justify-center text-indigo-400 font-bold text-sm">
                                        4
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-white mb-1">"Hesabımı Sil"e Dokunun</h3>
                                        <p className="text-neutral-400 text-sm">Aşağı kaydırın ve kırmızı ile gösterilen "Hesabımı Sil" butonuna dokunun</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 bg-indigo-600/20 border border-indigo-500/30 rounded-full flex items-center justify-center text-indigo-400 font-bold text-sm">
                                        5
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-white mb-1">Silme İşlemini Onaylayın</h3>
                                        <p className="text-neutral-400 text-sm">Uyarı mesajını okuyun ve hesabınızı kalıcı olarak silme kararınızı onaylayın</p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 bg-green-600/20 border border-green-500/30 rounded-full flex items-center justify-center text-green-400 font-bold text-sm">
                                        ✓
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-white mb-1">Hesap Silindi</h3>
                                        <p className="text-neutral-400 text-sm">Hesabınız ve ilişkili tüm veriler 24-48 saat içinde kalıcı olarak silinecektir</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Alternative: Contact Support */}
                        <section className="bg-neutral-900/40 border border-white/5 p-8 rounded-2xl">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-neutral-800 rounded-xl flex items-center justify-center">
                                    <Mail className="text-indigo-400" size={24} />
                                </div>
                                <h2 className="text-2xl font-bold text-white">Alternatif: Destek ile İletişime Geçin</h2>
                            </div>

                            <p className="text-neutral-300 leading-relaxed mb-6">
                                Hesabınızı uygulama üzerinden silemiyorsanız veya yardıma ihtiyacınız varsa, lütfen bize ulaşın:
                            </p>

                            <div className="space-y-4">
                                <div className="bg-neutral-800/50 border border-white/5 p-6 rounded-xl text-center">
                                    <p className="text-sm text-neutral-400 mb-3">X (Twitter) üzerinden ulaşın:</p>
                                    <a href="https://x.com/bilgegulko1" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium text-xl">
                                        @bilgegulko1
                                    </a>
                                </div>

                                <div className="mt-6 p-4 bg-indigo-900/20 border border-indigo-500/20 rounded-xl">
                                    <p className="text-sm text-neutral-300">
                                        <strong className="text-white">Lütfen şunları içerin:</strong> Kayıtlı e-posta adresiniz ve silme nedeniniz (isteğe bağlı).
                                        Talebinizi 48 saat içinde işleme alacağız.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* What Happens After Deletion */}
                        <section className="bg-neutral-900/40 border border-white/5 p-8 rounded-2xl">
                            <h2 className="text-2xl font-bold text-white mb-4">Silme İşleminden Sonra Ne Olur?</h2>
                            <div className="space-y-3 text-neutral-300">
                                <p className="leading-relaxed">
                                    Hesap silme işlemini onayladığınızda:
                                </p>
                                <ul className="space-y-2 list-disc list-inside ml-4">
                                    <li>Hesabınız derhal devre dışı bırakılır</li>
                                    <li>Tüm kişisel veriler sunucularımızdan 48 saat içinde kalıcı olarak silinir</li>
                                    <li>E-posta adresiniz bekleme listesinden ve posta listelerinden kaldırılır</li>
                                    <li>Yüklenen PDF'ler ve oluşturulan quizler kalıcı olarak silinir</li>
                                    <li>Silme işlemi tamamlandığında bir onay e-postası alırsınız</li>
                                </ul>
                                <p className="leading-relaxed mt-4">
                                    <strong className="text-white">Not:</strong> Bazı anonim kullanım verileri analiz amacıyla saklanabilir,
                                    ancak bu veriler hiçbir şekilde kimliğinizle ilişkilendirilmez.
                                </p>
                            </div>
                        </section>

                        {/* Changed Your Mind? */}
                        <section className="bg-gradient-to-br from-indigo-900/20 to-neutral-900 border border-indigo-500/20 p-8 rounded-2xl text-center">
                            <h2 className="text-2xl font-bold text-white mb-4">Fikrinizi mi Değiştirdiniz?</h2>
                            <p className="text-neutral-300 leading-relaxed mb-6">
                                Sizi QuizFlow topluluğunun bir parçası olarak görmekten mutluluk duyarız! Sorun yaşıyorsanız veya geri bildiriminiz varsa,
                                lütfen hesabınızı silmeden önce bize ulaşın. Yardımcı olmak için buradayız!
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    href="/"
                                    className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20"
                                >
                                    <ArrowLeft size={18} />
                                    Ana Sayfaya Dön
                                </Link>
                                <a
                                    href="https://x.com/bilgegulko1"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white px-6 py-3 rounded-xl font-bold transition-all border border-white/10"
                                >
                                    <Mail size={18} />
                                    X'te İletişime Geç
                                </a>
                            </div>
                        </section>

                    </motion.div>

                </div>
            </main>

            {/* Footer */}
            <footer className="py-10 text-center text-neutral-600 text-sm border-t border-white/5">
                <div className="flex flex-col items-center gap-4">
                    <p>© 2026 QuizFlow. Tüm hakları saklıdır.</p>
                    <div className="flex items-center gap-4">
                        <Link href="/privacy" className="text-neutral-500 hover:text-indigo-400 transition-colors">
                            Gizlilik Politikası
                        </Link>
                        <span className="text-neutral-700">•</span>
                        <Link href="/delete-account" className="text-neutral-500 hover:text-red-400 transition-colors">
                            Hesabı Sil
                        </Link>
                        <span className="text-neutral-700">•</span>
                        <Link href="/" className="text-neutral-500 hover:text-indigo-400 transition-colors">
                            Ana Sayfa
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}

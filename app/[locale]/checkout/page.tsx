'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard,
  Send,
  CheckCircle2,
  ArrowLeft,
  Copy,
  Check,
  Info,
  Loader2,
  ShieldCheck,
  Star
} from 'lucide-react';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { createClient } from '@/utils/supabase/client';

export default function CheckoutPage() {
  const t = useTranslations('Checkout');
  const router = useRouter();
  const supabase = createClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const iban = "TR28 0001 2009 8160 0001 1423 54";
  const receiver = "Bilge Gül Koç";

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleBankPaymentDone = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");

      const { error } = await (supabase as any)
        .from('profiles')
        .update({
          subscription_status: 'pending_approval',
          payment_method: 'havale'
        } as any)
        .eq('id', user.id);

      if (error) throw error;

      setIsSuccess(true);
      setTimeout(() => {
        setIsModalOpen(false);
        router.push('/dashboard');
      }, 3000);
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShopierPay = () => {
    window.location.href = 'https://www.shopier.com/quizyen/45161446';
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-8 transition-colors font-medium group"
        >
          <div className="p-2 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30">
            <ArrowLeft size={18} />
          </div>
          <span>Geri Dön</span>
        </button>

        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm font-bold mb-4"
          >
            <Star size={16} fill="currentColor" />
            <span>Quizyen Premium</span>
          </motion.div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
            {t('title')}
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        {/* Payment Options Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Shopier Option */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 flex flex-col relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-all duration-700" />

            <div className="relative z-10 flex-1">
              <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6 group-hover:scale-110 transition-transform duration-300">
                <CreditCard size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                {t('shopier_title')}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">
                {t('shopier_desc')}
              </p>

              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-black text-slate-900 dark:text-white">99 TL</span>
                <span className="text-slate-400 font-medium">/ aylık</span>
              </div>
            </div>

            <button
              onClick={handleShopierPay}
              disabled={isLoading}
              className="relative z-10 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-5 rounded-2xl font-bold shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <ShieldCheck size={20} />
                  {t('shopier_btn')}
                </>
              )}
            </button>
          </motion.div>

          {/* Bank Transfer Option */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 flex flex-col relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl group-hover:bg-amber-500/10 transition-all duration-700" />

            <div className="relative z-10 flex-1">
              <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center text-amber-600 dark:text-amber-400 mb-6 group-hover:scale-110 transition-transform duration-300">
                <Send size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                {t('bank_title')}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">
                {t('bank_desc')}
              </p>

              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-black text-slate-900 dark:text-white">99 TL</span>
                <span className="text-slate-400 font-medium">/ aylık</span>
              </div>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="relative z-10 w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-5 rounded-2xl font-bold shadow-lg transition-all flex items-center justify-center gap-3 hover:bg-slate-800 dark:hover:bg-slate-100"
            >
              <Info size={20} />
              {t('bank_btn')}
            </button>
          </motion.div>
        </div>

        {/* Secure Payment Badge */}
        <div className="flex flex-col items-center gap-4 text-slate-400 dark:text-slate-500">
          <div className="flex items-center gap-6">
            <ShieldCheck size={48} className="opacity-20" />
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-700" />
            <div className="text-sm font-semibold max-w-[200px] leading-tight">
              Güvenli Ödeme Altyapısı ile 256-bit SSL Koruma
            </div>
          </div>
        </div>
      </div>

      {/* Bank Transfer Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isLoading && setIsModalOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100]"
            />
            <div className="fixed inset-0 flex items-center justify-center z-[110] p-4 pointer-events-none">
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-[2.5rem] shadow-2xl p-8 pointer-events-auto border border-slate-100 dark:border-slate-700"
              >
                {!isSuccess ? (
                  <div className="space-y-6">
                    <div className="text-center">
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{t('modal_title')}</h2>
                      <p className="text-slate-500 dark:text-slate-400 font-medium">
                        {t('modal_desc')}
                      </p>
                    </div>

                    <div className="space-y-4">
                      {/* Info Box */}
                      <div className="bg-emerald-50 dark:bg-emerald-900/30 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-800/50 flex gap-3">
                        <div className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
                          <Info size={18} />
                        </div>
                        <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200 leading-relaxed">
                          <span className="font-bold block mb-1">Bilgi:</span>
                          {t('bank_info_note')}
                        </p>
                      </div>

                      {/* IBAN */}
                      <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-3xl border border-slate-100 dark:border-slate-700 group relative">
                        <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1 block">
                          {t('iban_label')}
                        </label>
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-sm sm:text-base font-bold text-slate-700 dark:text-slate-300">
                            {iban}
                          </span>
                          <button
                            onClick={() => handleCopy(iban, 'iban')}
                            className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-all text-indigo-600"
                          >
                            {copied === 'iban' ? <Check size={20} /> : <Copy size={20} />}
                          </button>
                        </div>
                      </div>

                      {/* Receiver */}
                      <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-3xl border border-slate-100 dark:border-slate-700 group relative">
                        <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1 block">
                          {t('receiver_label')}
                        </label>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-700 dark:text-slate-300">
                            {receiver}
                          </span>
                          <button
                            onClick={() => handleCopy(receiver, 'receiver')}
                            className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-all text-indigo-600"
                          >
                            {copied === 'receiver' ? <Check size={20} /> : <Copy size={20} />}
                          </button>
                        </div>
                      </div>

                      {/* Account Holder Info (Specific to the image provided) */}
                      <div className="pt-2">
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Banka hesap sahibi:</p>
                        <p className="text-xl font-bold text-slate-900 dark:text-white">{receiver}</p>
                      </div>

                      {/* Amount */}
                      <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-3xl border border-slate-100 dark:border-slate-700">
                        <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1 block">
                          {t('amount_label')}
                        </label>
                        <span className="text-xl font-black text-indigo-600 dark:text-indigo-400">
                          {t('amount_value')}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={handleBankPaymentDone}
                      disabled={isLoading}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-5 rounded-2xl font-bold shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isLoading ? <Loader2 className="animate-spin" size={24} /> : t('payment_done')}
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-12 space-y-6">
                    <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 mx-auto animate-bounce">
                      <CheckCircle2 size={48} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{t('success_title')}</h2>
                      <p className="text-slate-500 dark:text-slate-400 font-medium">
                        {t('success_desc')}
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

import type { Metadata } from 'next';
import MobileClientPage from './MobileClientPage';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const isTr = locale === 'tr';

    const title = isTr ? "Quizyen Mobil: İstediğin Yerde Çalış" : "Quizyen Mobile: Study Anywhere";
    const description = isTr
        ? "PDF'lerini saniyeler içinde interaktif quizlere dönüştür ve dilediğin zaman, dilediğin yerde çöz. Quizyen mobil uygulaması şimdi Google Play'de!"
        : "Convert your PDFs into interactive quizzes in seconds and solve them anytime, anywhere. Quizyen mobile app is now on Google Play!";

    return {
        title,
        description,
        keywords: isTr
            ? ["quiz mobil", "PDF test çöz", "ders çalışma uygulaması", "AÖF çıkmış sorular", "interaktif sınav", "test çözme"]
            : ["quiz mobile", "solve PDF tests", "study app", "exam prep app", "interactive quiz", "mobile learning"],
        openGraph: {
            title,
            description,
            type: "website",
        }
    };
}

export default function MobileDownloadPage({ params }: { params: Promise<{ locale: string }> }) {
    return <MobileClientPage params={params} />;
}

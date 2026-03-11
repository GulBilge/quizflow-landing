/**
 * Calculates the quiz score (0-100)
 */
export const calculateQuizScore = (correctCount: number, wrongCount: number, totalQuestions: number): number => {
    if (totalQuestions === 0) return 0;
    return Math.round((correctCount / totalQuestions) * 100);
};

/**
 * Generates a SHA-256 hash for a file buffer or string
 */
export const generateFileHash = async (data: ArrayBuffer | string): Promise<string> => {
    const encoder = new TextEncoder();
    const buffer = typeof data === 'string' ? encoder.encode(data) : data;
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
};

/**
 * Standart Fisher-Yates karıştırma algoritması
 */
const shuffleArray = <T>(array: T[]): T[] => {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
};

/**
 * Karıştırılmış sınav verisi oluşturur (sorular ve şıklar)
 */
export const randomizeQuizData = (questions: any[]): any[] => {
    // 1. Önce soruların kendi sırasını karıştır
    const shuffledQuestions = shuffleArray(questions);

    // 2. Şimdi her sorunun içindeki şıkların yerini değiştir
    return shuffledQuestions.map((q) => {
        // Mevcut doğru cevabın metnini bul
        const correctOptionText = q.options[q.correctAnswer];

        // Şıkları karıştır
        const shuffledOptions = shuffleArray(q.options);

        // Doğru cevabın yeni index'ini bul
        const newCorrectAnswerIndex = shuffledOptions.findIndex(
            (opt: any) => (opt as string) === correctOptionText
        );

        return {
            ...q,
            options: shuffledOptions,
            correctAnswer: newCorrectAnswerIndex,
        };
    });
};

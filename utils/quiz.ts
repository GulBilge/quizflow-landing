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

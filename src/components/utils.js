export function sampling(arr, sampleSize) {
    // Create a copy of the array to avoid modifying the original array
    const shuffled = arr.slice();

    // Shuffle the array using Fisher-Yates (aka Knuth) Shuffle
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // Return the first 'sampleSize' elements from the shuffled array
    return shuffled.slice(0, sampleSize);
}

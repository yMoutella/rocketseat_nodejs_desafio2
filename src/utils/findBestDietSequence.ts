export function findBestDietSequence(meals: any[]): number {
    const sequenceMap: Map<number, any[]> = new Map()
    let currentSequence: any[] = []
    let bestSequenceLength: number = 0

    for (const meal of meals) {
        if (meal.diet === 1) {
            currentSequence.push(meal)
            continue
        }

        if (currentSequence.length > 0) {
            sequenceMap.set(currentSequence.length, currentSequence)
            bestSequenceLength = currentSequence.length > bestSequenceLength ? currentSequence.length : bestSequenceLength
            currentSequence = []
        }
    }

    if (currentSequence.length > 0) {
        sequenceMap.set(currentSequence.length, currentSequence)
        bestSequenceLength = currentSequence.length > bestSequenceLength ? currentSequence.length : bestSequenceLength

    }

    const bestSequence = sequenceMap.get(bestSequenceLength) || []

    return bestSequence.length
}
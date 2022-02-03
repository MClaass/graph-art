export function getRandomArbitrary(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}

export function getRandomFromArray<T>(arr: T[]): T {
    const max = Math.floor(arr.length - 1);
    const index = Math.floor(Math.random() * max);
    return arr[index];
}

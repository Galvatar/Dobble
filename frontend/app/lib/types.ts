interface Player {
    name: string,
    score: number,
    connected: boolean,
    host: boolean,
    card: number,
}

interface Card {
    symbols: number[]
    sizes: number[]
}
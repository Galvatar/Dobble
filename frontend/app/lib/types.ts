export interface Player {
    name: string,
    score: number,
    connected: boolean,
    host: boolean,
    card: number,
}

export interface Card {
    symbols: number[]
    sizes: number[]
}

export interface Message {
    command: ClientAction | ServerAction,
    payload: string,
}

export enum ClientAction {
    JOIN_GAME="join_game",
    SUBMIT_SYMBOL="submit_symbol",
    KICK_PLAYER="kick_player",
    START_GAME="start_game",
    SET_NAME="set_name"
}

export enum ServerAction {
    JOIN_GAME="join_game",
    SUBMIT_SYMBOL="submit_symbol",
    LOBBY_UPDATE="lobby_update",
    KICK_PLAYER="kick_player",
    START_GAME="start_game",
    SET_NAME="set_name",
    SET_PILE="set_pile",
    SET_HAND="set_hand",
    GAME_OVER="game_over",
    SET_DECK="set_deck"
}
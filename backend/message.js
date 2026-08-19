class Message {
    /**
     * 
     * @param {ClientAction | ServerAction} command 
     * @param {string} payload 
     * @param {Set()} players
     */
    constructor(command, payload) {
        this.command = command;
        this.payload = payload;
        this.players = new Set();
    }

    addPlayer(name) {
        this.players.add(name);
    }

    /**
     * 
     * @returns {string}
     */
    getFirstPlayer() {
        return this.players.values().next().value;
    }

    /**
     * 
     * @param {string} json
     * @returns {Message}
     */
    static fromJSON(json) {
        if (!json) return null;
        
        const data = typeof json === 'string' ? JSON.parse(json) : json;
        const validCommand = Object.values(allActions).find(val => val === data?.command);

        if (!validCommand) {
            console.warn(`Unknown command: ${data?.command}`);
            return null;
        }

        return new Message(data?.command, data?.payload);
    }

    toJSON() {
        return {
            command: this.command,
            payload: this.payload
        };
    }
}

export const ClientAction = Object.freeze({
  JOIN_GAME: "join_game",
  SUBMIT_SYMBOL: "submit_symbol",
  KICK_PLAYER: "kick_player",
  START_GAME: "start_game",
  SET_NAME: "set_name",
  CLIENT_DISCONNECT: "client_disconnect"
});

export const ServerAction = Object.freeze({
  SET_NAME: "set_name",
  JOIN_GAME: "join_game",
  LOBBY_UPDATE: "lobby_update",
  KICK_PLAYER: "kick_player",
  SUBMIT_SYMBOL: "submit_symbol",
  START_GAME: "start_game",
  SET_PILE: "set_pile",
  SET_HAND: "set_hand",
  GAME_OVER: "game_over",
  SET_DECK: "set_deck"
});


const allActions = [
    ...Object.values(ClientAction), 
    ...Object.values(ServerAction)
];

export default Message;
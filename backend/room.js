import Game from "./game.js";
import Message, { ClientAction, ServerAction } from "./message.js";
import Player from "./player.js";

class Room {
    /** @type {string} */
    #name;
    /** @type {string} */
    #host;
    /** @type {Game} */
    #game;
    /** @type {Map()} */
    #players;
    #handleServerMessage;

    constructor(name, handleServerMessage, host) {
        this.name = name;
        this.#host = host;
        this.#game = null;
        this.#players = new Map();
        this.#handleServerMessage = handleServerMessage;
    }

    /**
     * 
     * @param {Message} message 
     */
    handleClientMessage(message) {
        var resp = message;
        if (message.command == ClientAction.JOIN_GAME) {
            this.#players.set(message.getFirstPlayer(), 0);
            this.updateLobby();
        } else if (message.command == ClientAction.KICK_PLAYER) {
            this.#players.delete(message.payload);
            resp = new Message(ServerAction.KICK_PLAYER, message.payload);
            resp.addPlayer(message.payload);
            this.updateLobby();
        } else if (message.command == ClientAction.START_GAME) {
            this.#game = new Game(
                Number(message.payload),
                (msg) => this.handleServerMessage(msg),
                [...this.#players.keys()]
            )
            resp = this.#game.handleMessage(message);
        } else if (message.command == ClientAction.SUBMIT_SYMBOL) {
            resp = this.#game.handleMessage(message);
        }
        if (resp.command == ServerAction.GAME_OVER) {
            const scores = JSON.parse(resp.payload);
            for (const obj of scores) {
                const newScore = this.#players.get(obj.player)+obj.score
                this.#players.set(obj.player, newScore);
            }
            this.updateLobby();
        }
        if (resp != null || resp != undefined) return resp;
    }

    /**
     * 
     * @param {Message} message 
     */
    handleServerMessage(message) {
        if (message == null || message == undefined) return;
        if (message.command == ServerAction.LOBBY_UPDATE) {
            this.updateLobby(JSON.parse(message.payload));
        } else {
            this.#handleServerMessage(message);
        }
    }

    /**
     * 
     * @param {Player[]} players 
     */
    updateLobby(players) {
        if (players == undefined) players = []
        if (players.length == 0) {
            for (const [player, score] of this.#players) {
                var playerDTO = new Player();
                playerDTO.name = player
                playerDTO.score = score
                playerDTO.host = this.#host == player;
                players.push(playerDTO)
            }
        } else {
            for (var player of players) {
                player.host = this.#host == player;
            }
        }
        const message = new Message(
            ServerAction.LOBBY_UPDATE,
            JSON.stringify(players)
        )
        for (const player of players) message.addPlayer(player.name);
        this.#handleServerMessage(message);
    }
}

export default Room;
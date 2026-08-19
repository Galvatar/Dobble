import Message, { ClientAction } from "./message.js";

export const Status = Object.freeze({
  ONLINE: "ONLINE",
  OFFLINE: "OFFLINE"
});

class SessionManager {
    /** @type {Map()} */
    #players;

    constructor() {
        this.#players = new Map();
    }

    /**
     * 
     * @param {string} name 
     * @returns {boolean} connection status
     */
    isConnected(name) {
        return this.#players.get(name) == Status.ONLINE;
    }

    /**
     * 
     * @param {Message} message 
     */
    handleMessage(message) {
        if (message.command == ClientAction.SET_NAME) {
            const name = this.createPlayer(message.payload);
            message.payload = name;
            message.addPlayer(name);
            return message;
        } else if (message.command == ClientAction.CLIENT_DISCONNECT) {
            this.playerDisconnected(message.payload);
        }
        return null;
    }

    createPlayer(name) {
        var count = 0;
        var validName = name;
        while (this.#players.has(validName)) {
            if (this.#players.get(validName) == Status.OFFLINE) break;
            count++;
            validName = name + count;
        }
        this.#players.set(validName, Status.ONLINE);
        return validName;
    }

    playerDisconnected(name) {
        var player = this.#players.get(name);
        if (player == undefined) return;
        this.#players.set(name, Status.OFFLINE);
    }
}

export default SessionManager;
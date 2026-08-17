import Game from "./game.js";
import Player from "./player.js";

class Room {
    #name;
    #mode;
    #connections = new Map();
    #deleteRoom;
    /** @type {Game} */
    #game;

    constructor(name, deleteRoom) {
        this.#name = name;
        this.#deleteRoom = deleteRoom;
        this.#game = null;
    }

    join(ws) {
        this.handleConnection(ws)
        ws.send(`room|${this.#name}`);
        ws.on('message', (data) => {
            this.handleMessage(data, ws);
        })
        ws.on('close', () => {
            this.handleDisconnection(ws);
        });
    }

    handleDisconnection(ws) {
        var player = this.#connections.get(ws)
        player.connected = false;
        this.#connections.set(ws, player)
        if (player.isHost()) {
            player.setHost(false);
            var set = false;
            for (const [ws, player] of this.#connections) {
                if (player.connected) {
                    player.setHost(true);
                    this.#connections.set(ws, player);
                    set = true;
                    break;
                }
            }
            if (!set) {
                console.log(`Deleted room: ${this.#name}`)
                this.#deleteRoom(this.#name);
            }
        }
        this.notifyLobby()
    }

    handleConnection(ws) {
        ws.send(`room|${this.#name}`);
        var player = new Player(ws);
        if (this.#connections.size == 0) player.setHost(true);
        this.#connections.set(ws, player)
    }

    handleMessage(message, ws) {
        const parts = message.toString().split('|');
        const command = parts[0].trim();
        const payload = parts[1].trim();

        if (this.#game != null) {
            this.handleGame(ws, command, payload);
            return;
        }

        if (command == "send") {
            this.broadcast(payload);
        } else if (command == "name") {
            const name = this.checkReconnectAndName(payload, ws);
            this.#connections.get(ws).setName(name)
            this.notifyLobby()
        } else if (command == "kick") {
            for (const [ws,player] of this.#connections) {
                if (player.name === payload) {
                    player.send("kick|");
                    this.#connections.delete(ws);
                }
            }
            this.notifyLobby()
        } else if (command == "game") {
            this.startGame(payload);
        }
    }

    startGame(payload) {
        this.#game = new Game(payload)
        const deck = this.#game.getDeck();
        this.broadcast(`deck|${JSON.stringify(deck)}`);
        for (const [ws, player] of this.#connections) {
            player.card = this.#game.getNext(-1);
            this.#connections.set(ws, player);
        }
        this.notifyLobby()
    }

    /**
     * 
     * @param {string} command 
     * @param {string} payload 
     */
    handleGame(ws, command, payload) {
        if (Number(command) == NaN) return;
        const pile = Number(command)
        const symbol = Number(payload)
        var player = this.#connections.get(ws);

        if (this.#game.isPileTop(pile)) {
            const playerCardIdx = player.card;
            if (this.#game.validMatch(playerCardIdx, symbol)) {
                player.score++;
                const newCard = this.#game.getNext(playerCardIdx);
                if (newCard == -1) {
                    this.handleGameOver();
                    return;
                }
                player.card = newCard;
                this.broadcast(`pile|${this.#game.getPile()}`);
            } else {
                player.score--;
            }
            this.#connections.set(ws, player);
            this.notifyLobby();
        }
    }

    handleGameOver() {
        this.notifyLobby();
        this.broadcast("gameOver|");
        this.#game == null;
    }

    notifyLobby() {
        const valuesArray = [...this.#connections.values()];

        const jsonString = JSON.stringify(valuesArray, null, 2);
        this.broadcast(`lobby|${jsonString}`);
    }

    printRoom() {
        for (const [ws, player] of this.#connections) {
            console.log(player.name + " " + player.connected);
        }
    }

    /**
     * @param {string} name 
     */
    checkReconnectAndName(name, conn) {
        var count = 0;
        const size = name.length;
        for (const [ws, player] of this.#connections) {
            if (player.name != null) {
                if (player.name.substring(0, size) === name) {
                    count++;
                }
                if (player.name === name && !player.connected) {
                    player.connected = true;
                    player.setWs(conn);

                    this.#connections.delete(conn);
                    this.#connections.delete(ws);

                    this.#connections.set(conn, player);
                    return player.name;
                }
            }
        }
        if (count > 0) return name + count;
        return name;
    }

    /**
     * @param {string} name 
     */
    checkName(name) {
        var count = 0;
        const size = name.length;
        for (const [ws, player] of this.#connections) {
            if (player.name != null) {
                if (player.name.substring(0, size) === name) {
                    count++;
                }
            }
        }
        return count;
    }

    broadcast(message) {
        for (const [ws, player] of this.#connections) {
            player.send(message)
        }
    }
}

export default Room;
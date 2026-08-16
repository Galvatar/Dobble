import Player from "./player.js";

class Room {
    #name;
    #mode;
    #connections = new Map();

    constructor(name) {
        this.#name = name;
    }

    join(ws) {
        this.#connections.set(ws, new Player(ws));
        ws.send(`room:${this.#name}`);
        ws.on('message', (data) => {
            this.handleMessage(data, ws);
        })
    }

    handleMessage(message, ws) {
        const parts = message.toString().split(':');
        if (parts[0] == "send") {
            this.broadcast(parts[1]);
        } else if (parts[0] == "name") {
            this.#connections.get(ws).setName(parts[1])
        }
    }

    broadcast(message) {
        for (const [ws, player] of this.#connections) {
            player.send(message)
        }
    }
}

export default Room;
class Player {
    #ws;
    #host;
    // score, name, connected, card

    constructor(ws) {
        this.#ws = ws;
        this.score = 0;
        this.#host = false;
        this.connected = true;
        this.card = 0;
    }

    setWs(ws) {
        this.#ws = ws;
    }

    setName(name) {
        this.name = name;
        this.send(`user|${name}`);
    }

    setHost(host) {
        this.#host = host;
    }

    isHost() {
        return this.#host;
    }

    send(message) {
        this.#ws.send(message);
    }

    toJSON() {
        return {
            name: this.name,
            host: this.#host,
            score: this.score, 
            connected: this.connected,
            card: this.card,
        };
    }
}

export default Player;
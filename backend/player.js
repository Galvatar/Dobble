class Player {
    #ws;
    #score;
    #host;
    // name, connected

    constructor(ws) {
        this.#ws = ws;
        this.#score = 0;
        this.#host = false;
        this.connected = true;
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

    addPoint() {
        this.#score++;
    }

    getScore() {
        return this.#score;
    }

    send(message) {
        this.#ws.send(message);
    }

    toJSON() {
        return {
            name: this.name,
            host: this.#host,
            score: this.#score, 
            connected: this.connected,
        };
    }
}

export default Player;
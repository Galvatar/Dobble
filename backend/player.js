class Player {
    #name;
    #ws;

    constructor(ws) {
        this.#ws = ws;
    }

    setName(name) {
        this.#name = name;
        this.send(`Set your name to: ${name}`);
    }

    send(message) {
        this.#ws.send(message);
    }
}

export default Player;
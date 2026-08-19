class Player {
    constructor() {
        this.name = ""
        this.score = 0;
        this.connected = false;
        this.host = false;
        this.card = 0;
    }

    /**
     * 
     * @returns JSON string for this player
     */
    toJSON() {
        return {
            name: this.name,
            score: this.score,
            connected: this.connected,
            host: this.host,
            card: this.card
        }
    }

    /**
     * @param {string|Buffer|object} json 
     * @returns {Player|null}
     */
    static fromJSON(json) {
        if (!json) return null;

        let data = json;
    
        // Only parse if it's a JSON string
        if (typeof json === 'string') {
            data = JSON.parse(json);
        } 
        // Handle Node.js Buffers specifically without calling toString() on plain objects
        else if (typeof Buffer !== 'undefined' && Buffer.isBuffer(json)) {
            data = JSON.parse(json.toString());
        }

        const player = new Player();
        player.name = data.name ?? "";
        player.score = data.score ?? 0;
        player.connected = data.connected ?? false;
        player.host = data.host ?? false;
        player.card = data.card ?? 0;

        return player;
    }
}

export default Player;
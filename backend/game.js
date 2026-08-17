import Card from "./card.js";
import { createDeck } from "./deckMaker.js";

class Game {
    #deck;
    #mode;
    #pile;
    #top;
    #max;

    constructor(mode) {
        this.#max = 0;
        this.#pile = 0;
        this.#top = 1;
        this.#mode = mode;
        this.#deck = [];
        this.createCards();
    }

    isPileTop(idx) {
        return this.#pile == idx;
    }

    validMatch(cardIdx, symbol) {
        const playerCard = this.#deck.at(cardIdx);
        const pileCard = this.#deck.at(this.#pile);
        const n = pileCard.symbols.length;
        var player = false;
        var pile = false;
        for (let i = 0; i < n; i++) {
            if (playerCard.symbols[i] == symbol) {
                player = true;
            }
            if (pileCard.symbols[i] == symbol) {
                pile = true;
            }
        }
        return pile && player;
    }

    getNext(userCardIdx) {
        if (this.#top == this.#max) return -1;
        if (userCardIdx == -1) {
            return this.#top++;
        }
        if (this.#mode == 0) {
            this.#pile = userCardIdx;
            return this.#top++;
        } else {
            const pile = this.#pile;
            this.#pile = this.#top++;
            return pile;
        }
    }

    getPile(idx) {
        return this.#pile;
    }

    createCards() {
        const order = 7
        this.#max = (order*order)+order;
        const cards = createDeck(order);
        const m = cards[0].length;
        var deck = [];
        for (let i = 0; i < m; i++) {
            const symbols = this.shuffle(cards[0][i])
            const curr = new Card(symbols, cards[1][i]);
            deck.push(curr);
        }
        this.#deck = this.shuffle(deck);
    }

    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    getDeck() {
        return this.#deck;
    }
}

export default Game;
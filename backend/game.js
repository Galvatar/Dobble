import { json } from "node:stream/consumers";
import Card from "./card.js";
import { createCards } from "./deckMaker.js";
import Message, { ClientAction, ServerAction } from "./message.js";
import Player from "./player.js";
import { CARDS } from "./constants.js";

class Game {
    /** @type {Number} */
    #mode;
    /** @type {Number[]} */
    #scores;
    /** @type {Number[]} */
    #card;
    /** @type {Map()} */
    #playerIdx;
    /** @type {Number} */
    #top;
    /** @type {Number} */
    #pile;
    /** @type {Card[]} */
    #deck;
    #handleServerMessage;

    /**
     * 
     * @param {Number} mode 
     * @param {*} handleServerMessage 
     * @param {string[]} players 
     */
    constructor(mode, handleServerMessage, players) {
        this.#mode = mode;
        this.#scores = new Array(players.length).fill(0);
        this.#card = new Array(players.length).fill(0);
        this.#playerIdx = new Map();
        this.#handleServerMessage = handleServerMessage;
        this.#top = 0;
        this.#pile = 0;
        var idx = 0;
        for (const player of players) {
            this.#playerIdx.set(player, idx++);
        }
        this.#deck = createCards();
    }

    /**
     * 
     * @param {Message} message 
     */
    validateSymbol(message) {
        const pileCard = this.#deck[this.#pile];
        const playerCardIdx = this.#playerIdx.get(message.getFirstPlayer());
        const playerCard = this.#deck[this.#card[playerCardIdx]];

        const symbol = Number(message.payload);

        return pileCard.symbols.includes(symbol) && playerCard.symbols.includes(symbol);
    }

    /**
     * 
     * @param {Message} message 
     */
    handleMessage(message) {
        if (message.command == ClientAction.START_GAME) {
            this.handleGameStart();
            const resp = new Message(
                ServerAction.START_GAME,
                ""
            )
            for (const [player,idx] of this.#playerIdx) resp.addPlayer(player);
            return resp;
        } else if (message.command == ClientAction.SUBMIT_SYMBOL) {
            const resp = this.handleSymbolSubmit(message);
            if (resp != null || resp != undefined) return resp;
        }
    }

    /**
     * 
     * @param {Message} message 
     * @returns {Message | null}
     */
    handleSymbolSubmit(message) {
        const playerIdx = this.#playerIdx.get(message.getFirstPlayer());
        if (this.validateSymbol(message)) {
            this.#scores[playerIdx]++;
            this.#top++;
            const pileTop = this.#pile;
            this.#pile = this.#mode == 0 ? this.#card[playerIdx] : this.#top;

            const pile = new Message(
                ServerAction.SET_PILE,
                String(this.#pile)
            )
            for (const [player,idx] of this.#playerIdx) pile.addPlayer(player);
            this.#handleServerMessage(pile);

            if (this.#top < CARDS) {
                this.#card[playerIdx] = this.#mode == 0 ? this.#top : pileTop;
                const hand = new Message(
                    ServerAction.SET_HAND,
                    String(this.#card[playerIdx])
                )
                hand.addPlayer(message.getFirstPlayer());
                this.updateLobby();
                return hand;
            } else {
                var scores = [];
                for (const [player, idx] of this.#playerIdx) {
                    const obj = {
                        player: player,
                        score: this.#scores[idx]
                    }
                    scores.push(obj)
                }
                const over = new Message(
                    ServerAction.GAME_OVER,
                    JSON.stringify(scores)
                )
                for (const [player, idx] of this.#playerIdx) over.addPlayer(player);
                return over;
            }
        } else {
            this.#scores[playerIdx]--;
            return null;
        }
    }

    handleGameStart() {
        const deck = new Message(
            ServerAction.SET_DECK,
            JSON.stringify(this.#deck)
        )
        const pile = new Message(
            ServerAction.SET_PILE,
            String(this.#top++)
        )
        for (const [player,idx] of this.#playerIdx) {
            deck.addPlayer(player);
            pile.addPlayer(player);
        }
        this.#handleServerMessage(deck);
        this.#handleServerMessage(pile);
        for (const [player,idx] of this.#playerIdx) {
            const cardIdx = this.#top++;
            const hand = new Message(
                ServerAction.SET_HAND,
                String(cardIdx)
            )
            this.#card[idx] = cardIdx;
            hand.addPlayer(player);
            this.#handleServerMessage(hand)
        }
        this.#top--;
    }

    updateLobby() {
        var players = [];
        for (const [player,idx] of this.#playerIdx) {
            const playerDTO = new Player()
            playerDTO.name = player;
            playerDTO.card = this.#card[idx];
            playerDTO.score = this.#scores[idx];
            players.push(playerDTO);
        }
        const msg = new Message(
            ServerAction.LOBBY_UPDATE,
            JSON.stringify(players)
        )
        this.#handleServerMessage(msg)
    }
}

export default Game;
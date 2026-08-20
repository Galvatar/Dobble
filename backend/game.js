import { json } from "node:stream/consumers";
import Card from "./card.js";
import { createCards } from "./deckMaker.js";
import Message, { ClientAction, ServerAction } from "./message.js";
import Player from "./player.js";
import { CARDS } from "./constants.js";
import GameParticipant from "./gameParticipant.js";

class Game {
    /** @type {Number} */
    #mode;
    /** @type {Map()} */
    #playerParticipants;
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
        this.#playerParticipants = new Map();
        this.#handleServerMessage = handleServerMessage;
        this.#top = 0;
        this.#pile = 0;
        var idx = 0;
        for (const player of players) {
            this.#playerParticipants.set(player, new GameParticipant(player));
        }
        this.#deck = createCards();
    }

    /**
     * 
     * @param {Message} message 
     */
    validateSymbol(message) {
        const pileCard = this.#deck[this.#pile];
        const playerCardIdx = this.#playerParticipants.get(message.getFirstPlayer()).card
        const playerCard = this.#deck[playerCardIdx];;

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
            for (const [player,participant] of this.#playerParticipants) resp.addPlayer(player);
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
        /** @type {GameParticipant} */
        const gameParticipant = this.#playerParticipants.get(message.getFirstPlayer());
        if (this.validateSymbol(message)) {
            gameParticipant.score++;
            this.#top++;
            const pileTop = this.#pile;
            this.#pile = this.#mode == 0 ? gameParticipant.card : this.#top;

            const pile = new Message(
                ServerAction.SET_PILE,
                String(this.#pile)
            )
            for (const [player,participant] of this.#playerParticipants) pile.addPlayer(player);
            this.#handleServerMessage(pile);

            if (this.#top < CARDS) {
                gameParticipant.card = this.#mode == 0 ? this.#top : pileTop;
                const hand = new Message(
                    ServerAction.SET_HAND,
                    String(gameParticipant.card)
                )
                hand.addPlayer(message.getFirstPlayer());
                this.updateLobby();
                return hand;
            } else {
                var scores = [...this.#playerParticipants.values()];
                const over = new Message(
                    ServerAction.GAME_OVER,
                    JSON.stringify(scores)
                )
                for (const [player,participant] of this.#playerParticipants) over.addPlayer(player);
                return over;
            }
        } else {
            gameParticipant.score--;
            return null;
        }
        this.#playerParticipants.set(message.getFirstPlayer(), gameParticipant);
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
        for (const [player,participant] of this.#playerParticipants) {
            deck.addPlayer(player);
            pile.addPlayer(player);
        }
        this.#handleServerMessage(deck);
        this.#handleServerMessage(pile);
        for (const [player,participant] of this.#playerParticipants) {
            const cardIdx = this.#top++;
            const hand = new Message(
                ServerAction.SET_HAND,
                String(cardIdx)
            )
            participant.card = cardIdx;
            this.#playerParticipants.set(player, participant);
            hand.addPlayer(player);
            this.#handleServerMessage(hand)
        }
        this.#top--;
    }

    updateLobby() {
        var players = [...this.#playerParticipants.values()];
        const msg = new Message(
            ServerAction.LOBBY_UPDATE,
            JSON.stringify(players)
        )
        this.#handleServerMessage(msg)
    }
}

export default Game;
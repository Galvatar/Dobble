import Message, { ClientAction, ServerAction } from "./message.js";
import Room from "./room.js";
import { EventEmitter } from 'events';
import SessionManager from "./sessionManager.js";
import Player from "./player.js";

export class RoomManager extends EventEmitter {
    /** @type {Map()} */
    #rooms;
    /** @type {Map()} */
    #playerRoom;
    /** @type {SessionManager} */
    #sessionManager;

    constructor(sessionManager) {
        super();
        this.#rooms = new Map();
        this.#playerRoom = new Map();
        this.#sessionManager = sessionManager;
    }

    /**
     * 
     * @param {Message} message 
     * @returns 
     */
    joinOrCreateRoom(message) {
        /** @type {Room} */
        var room = this.#rooms.get(message.payload);
        if (room == undefined) {
            room = new Room(
                message.payload, // Name of the room
                (msg) => this.handleServerMessage(msg), // Callback
                message.getFirstPlayer() // Host player
            );
            this.#rooms.set(message.payload, room);
        }
        this.#playerRoom.set(message.getFirstPlayer(), message.payload);
        return room;
    }

    /**
     * 
     * @param {string} name 
     * @returns the room that player is in
     */
    fetchPlayerRoom(name) {
        return this.#rooms.get(this.#playerRoom.get(name));
    }

    /**
     * 
     * @param {Message} message 
     */
    handleClientMessage(message) {
        if (message.command == ClientAction.JOIN_GAME) {
            const room = this.joinOrCreateRoom(message);
            this.#rooms.set(message.payload, room);
        } else if (message.command == ClientAction.KICK_PLAYER) {
            this.#playerRoom.delete(message.payload);
        }
        /** @type {Room} */
        const room = this.fetchPlayerRoom(message.getFirstPlayer());
        if (room != null && room != undefined) {
            if (message.command == ClientAction.CLIENT_DISCONNECT) {
                const players = room.handleClientMessage(message);
                this.handleRoomCleanup(players);
                return null;
            }
            const resp = room.handleClientMessage(message);
            return resp;
        } else {
            return null;
        }
    }

    /**
     * 
     * @param {string[]} players 
     */
    handleRoomCleanup(players) {
        var connected = false;
        for (const player of players) {
            connected = connected || this.#sessionManager.isConnected(player);
        }
        if (!connected) {
            const room = this.#playerRoom.get(players[0])
            this.#rooms.delete(room);
        }
    }

    /**
     * 
     * @param {string} roomName 
     * @param {Message} message 
     */
    handleServerMessage(message) {
        if (message.command == ServerAction.LOBBY_UPDATE) {
            const rawArray = typeof message.payload === 'string' 
                ? JSON.parse(message.payload) 
                : message.payload;
            /** @type {Player[]} */
            const players = rawArray.map(p => Player.fromJSON(p));
            for (var player of players) {
                player.connected = this.#sessionManager.isConnected(player.name);
            }
            message.payload = JSON.stringify(players);
        }
        this.emit('broadcast', {
            message: JSON.stringify(message),
            players: message.players ? [...message.players] : []
        })
    }
}

export default RoomManager;
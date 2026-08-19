import RoomHandler, { RoomManager } from "./roomManager.js";
import express from 'express';
import http from 'http';
import { WebSocketServer } from "ws";
import Message, { ClientAction, ServerAction } from "./message.js";
import SessionManager from "./sessionManager.js";

export class WebSocketHandler {
    /** @type {RoomManager} */
    #roomManager;
    /** @type {SessionManager} */
    #sessionManager;
    /** @type {Map()} */
    #sessions;

    /**
     * 
     * @param {RoomManager} roomManager
     * @param {SessionManager} sessionManager 
     */
    constructor(roomManager, sessionManager) {
        this.#roomManager = roomManager;
        this.#sessionManager = sessionManager;
        this.#sessions = new Map();
        this.startWS();

        // listens for internal updates to be broadcasted out
        this.#roomManager.on('broadcast', ({ 
            message, 
            players 
        }) => {
            var msg = Message.fromJSON(message);
            msg.players = new Set(players);
            this.sendMessage(msg);
        });
    }

    /**
     * 
     * @param {Message} message 
     * @param {WebSocket} ws 
     */
    handleClientMessage(message, ws) {
        var resp = undefined;
        if (message.command == ClientAction.CLIENT_DISCONNECT) {
            this.#sessionManager.handleMessage(message);
            this.#roomManager.handleClientMessage(message);
        } else if (message.command == ClientAction.SET_NAME) {
            /** @type {Message} */
            resp = this.#sessionManager.handleMessage(message);
            this.#sessions.set(ws, resp.payload);
        } else if (
            message.command == ClientAction.JOIN_GAME ||
            message.command == ClientAction.KICK_PLAYER ||
            message.command == ClientAction.START_GAME ||
            message.command == ClientAction.SUBMIT_SYMBOL
        ) {
            resp = this.#roomManager.handleClientMessage(message);
        }
        if (resp != null || resp != undefined) this.sendMessage(resp);
    }

    /**
     * 
     * @param {Message} message 
     */
    sendMessage(message) {
        const msgString = JSON.stringify(message);
        for (const [ws, playerName] of this.#sessions) {
            if (message.players.has(playerName)) {
                ws.send(msgString);
            }
        }
    }

    /**
     * Startup the WebSocket on port 4000 and start listening for inbound connections
     */
    startWS() {
        const app = express();
        const server = http.createServer(app);
        const wss = new WebSocketServer({ server });
        
        wss.on('connection', (ws) => {
            console.log('Client connected!');

            ws.on('message', (data) => {
                const msg = Message.fromJSON(data.toString());
                if (!msg) return; // Guard against null/invalid payloads

                if (this.#sessions.has(ws)) {
                    msg.players.add(this.#sessions.get(ws));
                }

                this.handleClientMessage(msg, ws);
            });

            ws.on('close', () => {
                const message = new Message(
                    ClientAction.CLIENT_DISCONNECT,
                    this.#sessions.get(ws)
                )
                message.addPlayer(this.#sessions.get(ws));
                this.handleClientMessage(message)
                this.#sessions.delete(ws);
            });
        });

        server.listen(4000, () => {
            console.log('Server running on port 4000');
        });
    }
}

export default WebSocketHandler;
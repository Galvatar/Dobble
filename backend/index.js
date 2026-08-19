import RoomManager from "./roomManager.js"
import SessionManager from "./sessionManager.js";
import WebSocketHandler from "./webSocketHandler.js";

const sessionManager = new SessionManager();
const roomManager = new RoomManager(sessionManager);
const wsHandler = new WebSocketHandler(roomManager, sessionManager);
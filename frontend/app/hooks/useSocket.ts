import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Card, Message, Player, ServerAction } from "../lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "ws://localhost:4000"

export function useSocket() {
  const [status, setStatus] = useState<"connecting" | "connected" | "disconnected">("connecting");
  const [room, setRoom] = useState("");
  const [name, setName] = useState("");
  const [pile, setPile] = useState(0);
  const [hand, setHand] = useState(0);
  const [deck, setDeck] = useState([] as Card[]);
  const [players, setPlayers] = useState([] as Player[]);
  const wsRef = useRef<WebSocket | null>(null);
  const router = useRouter();

  const player = players.filter((p) => p.name == name).at(0)!;
  const cardsPlayed = Math.max(Math.max(...players.map((p) => p.card)), pile)+1;

  useEffect(() => {
    const ws = new WebSocket(API_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      router.push('/');
      setStatus("connected");
    }
    ws.onclose = () => {
      router.push('/');
      resetVars();
      setStatus("disconnected");
    }
    ws.onmessage = (event) => {
      const msg: Message = JSON.parse(event.data);
      handleMessage(msg);
    }

    return () => {
      ws.close();
    };
  }, []);

  const resetVars = () => {
    setRoom('');
    setName('');
  }

  const sendMessage = (message: Message) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    }
  };

  const handleMessage = (message: Message) => {
    if (message.command == ServerAction.SET_NAME) {
      setName(message.payload);
      router.push('/room');
    } else if (message.command == ServerAction.JOIN_GAME) {
      setRoom(message.payload);
      router.push('/lobby');
    } else if (message.command == ServerAction.LOBBY_UPDATE) {
      setPlayers(JSON.parse(message.payload));
    } else if (message.command == ServerAction.KICK_PLAYER) {
      resetVars();
      router.push('/');
    } else if (message.command == ServerAction.SET_DECK) {
      setDeck(JSON.parse(message.payload));
    } else if (message.command == ServerAction.SET_HAND) {
      setHand(Number(message.payload));
    } else if (message.command == ServerAction.SET_PILE) {
      setPile(Number(message.payload));
    } else if (message.command == ServerAction.START_GAME) {
      router.push('/game')
    } else if (message.command == ServerAction.GAME_OVER) {
      router.push('/lobby')
    }
    console.log(message);
  };

  return { 
    cardsPlayed,
    pile, 
    hand, 
    deck, 
    players, 
    player, 
    room, 
    name, 
    status, 
    sendMessage };
}
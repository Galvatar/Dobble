import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "ws://localhost:4000"

export function useSocket() {
  const [status, setStatus] = useState<"connecting" | "connected" | "disconnected">("connecting");
  const [room, setRoom] = useState("");
  const [name, setName] = useState("");
  const [pile, setPile] = useState(0);
  const [deck, setDeck] = useState([] as Card[]);
  const [players, setPlayers] = useState([] as Player[]);
  const wsRef = useRef<WebSocket | null>(null);
  const router = useRouter();

  const player = players.filter((p) => p.name == name).at(0)!;

  useEffect(() => {
    const ws = new WebSocket(API_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      // router.push('/');
      setStatus("connected");
    }
    ws.onclose = () => {
      router.push('/');
      resetVars();
      setStatus("disconnected");
    }
    ws.onmessage = (event) => handleMessage(event.data);

    return () => {
      ws.close();
    };
  }, []);

  const resetVars = () => {
    setRoom('');
    setName('');
  }

  const sendMessage = (data: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(data);
    }
  };

  const handleMessage = (message: string) => {
    const parts = message.split('|');
    const command = parts[0].trim();
    const payload = parts[1].trim();
    if (command == "room") {
      setRoom(payload);
      router.push('/name');
    } else if (command == "user") {
      setName(payload);
      router.push('/lobby');
    } else if (command == "lobby") {
      setPlayers(JSON.parse(payload));
    } else if (command == "kick") {
      resetVars();
      router.push('/');
    } else if (command == "deck") {
      setDeck(JSON.parse(payload));
      router.push('/game');
    } else if (command == "pile") {
      setPile(Number(payload));
    } else if (command == "gameOver") {
      router.push('/lobby');
    }
    console.log(message);
  };

  return { 
    ws: wsRef.current,
    pile, 
    deck,
    players, 
    player, 
    room, 
    name, 
    status, 
    sendMessage };
}
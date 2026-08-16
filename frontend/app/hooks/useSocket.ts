import { useEffect, useRef, useState } from "react";

export function useSocket() {
  const [status, setStatus] = useState<"connecting" | "connected" | "disconnected">("connecting");
  const [room, setRoom] = useState("");
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:4000");
    wsRef.current = ws;

    ws.onopen = () => setStatus("connected");
    ws.onclose = () => setStatus("disconnected");
    ws.onmessage = (event) => handleMessage(event.data);

    return () => {
      ws.close();
    };
  }, []);

  const sendMessage = (data: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(data);
    }
  };

  const handleMessage = (message: string) => {
    const parts = message.split(':');
    const command = parts[0];
    const payload = parts[1];
    if (command == "room") {
        setRoom(payload);
    }
    console.log(message);
  };

  return { ws: wsRef.current, room, status, sendMessage };
}
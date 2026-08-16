"use client"

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useSocket } from "./hooks/useSocket";

export default function Home() {
  const [input, setInput] = useState("");
  const socket = useSocket();

  function handleSubmit() {
    socket.sendMessage(`join:${input}`);
    setInput("");
  }

  return (
    <div className="flex flex-col flex-1 items-center pt-30 bg-yellow-300 font-sans gap-3">
      <Image src={'/Dobble_logo.png'} alt="Dobble logo" width={150} height={150} />
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Room name"
        className="bg-white font-medium border-2 rounded-md border-black outline-none text-black p-2"
      />
      <button 
      className="bg-purple-300 p-3 font-bold rounded-lg border-2 border-black text-black"
      onClick={() => handleSubmit()}>
        Join/Create
      </button>
    </div>
  );
}

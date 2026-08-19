"use client";

import Image from "next/image";
import { useState } from "react";
import { useSharedSocket } from "./components/socketContext";
import { ClientAction, Message } from "./lib/types";

export default function Home() {
  const [input, setInput] = useState("");
  const { sendMessage } = useSharedSocket();

  function handleSubmit() {
    const submit = input.trim();
    if (submit.length > 0) {
      const message: Message = {
        command: ClientAction.SET_NAME,
        payload: submit
      }
      sendMessage(message);
    };
    setInput("");
  }

  return (
    <div className="flex flex-col flex-1 items-center pt-30 bg-yellow-300 font-sans gap-3">
      <Image
        src={"/Dobble_logo.png"}
        alt="Dobble logo"
        width={150}
        height={150}
      />
      <input
        value={input}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSubmit();
          }
        }}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Player Name"
        className="bg-white font-medium border-2 rounded-md border-black outline-none text-black p-2"
      />
      <button
        className="bg-purple-300 p-3 font-bold rounded-lg border-2 border-black text-black"
        onClick={() => handleSubmit()}
      >
        SET NAME
      </button>
    </div>
  );
}

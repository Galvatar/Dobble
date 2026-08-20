"use client"

import Image from "next/image";
import { useState } from "react";
import { useSharedSocket } from "../components/socketContext";
import PlayerCard from "./components/playerCard";
import HostPanel from "./components/hostPanel";
import { ClientAction, Message, Player } from "../lib/types";

export default function Lobby() {
    const  { players, player: me, sendMessage } = useSharedSocket();

    const connected = players.filter((p) => p.connected).length;

    function handleKick(player: Player) {
        const message: Message = {
            command: ClientAction.KICK_PLAYER,
            payload: player.name
        }
        sendMessage(message);
    }

    function handleStart(mode: number) {
        const message: Message = {
            command: ClientAction.START_GAME,
            payload: String(mode)
        }
        sendMessage(message);
    }

    return (
        <div className="flex flex-col flex-1 items-center justify-center bg-yellow-300 font-sans gap-3 p-5">
            {me && me.host &&
                <HostPanel onStart={(s) => handleStart(s)} />
            }
            <h2 className="text-black font-bold uppercase">
                {connected}/{players.length} connected
            </h2>
            <div className="flex flex-col border-2 border-black rounded-xl h-full w-full bg-purple-300 p-3 gap-2">
                {players.sort((a,b) => b.score - a.score).map((player, idx) => (
                    <div key={idx}>
                        <PlayerCard player={player} isHost={me != null && me.host} onKick={(p) => handleKick(p)} />
                    </div>
                ))}
            </div>
        </div>
    );
}
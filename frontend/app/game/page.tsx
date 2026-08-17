"use client"

import Card from "../components/card";
import { useSharedSocket } from "../components/socketContext";

export default function GameScreen() {
    const { ws, deck, pile, player } = useSharedSocket();

    function handleClick(symbol: number) {
        ws!.send(`${pile}|${symbol}`)
    }

    return (
        <div className="flex flex-col h-screen items-center bg-yellow-300 font-sans gap-5">
            <div className="flex flex-col gap-1 items-center h-full">
                <h1 className="font-bold text-lg text-black">
                    Game Pile ▼
                </h1>
                <Card card={deck[pile]} faded={true} />
            </div>
            <div className="flex flex-col gap-1 items-center h-full">
                <h1 className="font-bold text-lg text-black">
                    Your Hand ▼
                </h1>
                <Card card={deck[player.card]} faded={false} onClicked={(s) => handleClick(s)} />
            </div>
        </div>
    )
}
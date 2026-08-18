"use client"

import Card from "../components/card";
import { useSharedSocket } from "../components/socketContext";

export default function GameScreen() {
    const { ws, deck, cardsPlayed, pile, player } = useSharedSocket();

    function handleClick(symbol: number) {
        ws!.send(`${pile}|${symbol}`)
    }

    return (
        <div className="flex flex-col h-screen items-center bg-yellow-300 font-sans gap-5">
            <div className="flex flex-col gap-1 items-center w-full h-full">
                <span className="flex w-full justify-between items-center px-3">
                    <h2 className="font-bold text-lg text-black">
                        {cardsPlayed}/57
                    </h2>
                    <h1 className="font-bold text-lg text-black">
                        Game Pile ▼
                    </h1>
                    <h2 className="font-bold text-lg text-black">
                        {player?.score ?? 0}
                    </h2>
                </span>
                <Card card={deck[pile ?? 0]} bottom={false} />
            </div>
            <div className="flex flex-col gap-1 items-center h-full bg-purple-300 w-full pb-5 border-t-2 border-black">
                <h1 className="font-bold text-lg text-black">
                    Your Hand ▼
                </h1>
                <Card card={deck[player?.card ?? 0]} bottom={true} onClicked={(s) => handleClick(s)} />
            </div>
        </div>
    )
}
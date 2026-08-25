"use client"

import CardView from "../components/card";
import { useSharedSocket } from "../components/socketContext";
import { NUM_CARDS } from "../lib/constants";
import { ClientAction, Message } from "../lib/types";

export default function GameScreen() {
    const { deck, cardsPlayed, pile, hand, player, sendMessage } = useSharedSocket();

    function handleClick(symbol: number) {
        const message: Message = {
            command: ClientAction.SUBMIT_SYMBOL,
            payload: String(symbol)
        }
        sendMessage(message);
    }

    return (
        <div className="flex flex-col h-dvh items-center bg-yellow-300 font-sans gap-5">
            <div className="flex flex-col flex-1 gap-1 items-center w-full min-h-0">
                <span className="flex w-full justify-between items-center px-3">
                    <h2 className="font-bold text-lg text-black">
                        {cardsPlayed}/{NUM_CARDS}
                    </h2>
                    <h1 className="font-bold text-lg text-black">
                        Game Pile ▼
                    </h1>
                    <h2 className="font-bold text-lg text-black">
                        {player?.score ?? 0}
                    </h2>
                </span>
                <CardView card={deck[pile ?? 0]} bottom={false} />
            </div>
            <div className="flex flex-col flex-1 gap-1 items-center min-h-0 bg-purple-300 w-full border-t-2 border-black">
                <h1 className="font-bold text-lg text-black">
                    Your Hand ▼
                </h1>
                <CardView card={deck[hand ?? 0]} bottom={true} onClicked={(s) => handleClick(s)} />
            </div>
        </div>
    )
}
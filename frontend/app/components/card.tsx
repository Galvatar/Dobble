"use client"

import { cardLayout } from "../lib/constants";
import { symbols } from "../lib/symbols";
import { Card } from "../lib/types";

interface CardProps {
    card: Card,
    bottom: boolean
    onClicked?(symbol: number): void
}

export default function CardView({ card, bottom, onClicked }: CardProps) {
    if (card == null) return null;

    return (
        <div className="relative h-full aspect-square overflow-visible">
            <div className={`absolute inset-0 rounded-full bg-white`} />

            {card.symbols.map((num, idx) => (
                <div 
                    key={`'card'}-${idx}-${num}`}
                    onClick={() => {
                        if (onClicked) {
                            onClicked(num);
                        }
                    }}
                    className="flex absolute z-10 aspect-square items-center justify-center overflow-visible"
                    style={{ 
                        bottom: cardLayout[idx+1].bottom, 
                        left: cardLayout[idx+1].left, 
                        transform: `translate(-50%, 50%) rotate(${cardLayout[idx+1].rotation})`,
                        width: `${card.sizes[idx]}%`
                    }}
                >
                    <img 
                        src={symbols[num]}
                        alt=""
                        decoding="sync"
                        className={`w-full h-full object-contain p-[5%]`}
                    />
                </div>
            ))}
        </div>
    )
}
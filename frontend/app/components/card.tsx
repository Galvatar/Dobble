import Image from "next/image";
import { symbols } from "../lib/symbols";
import { useEffect, useState } from "react";

type ObjectProps = {
  color: string;
  bottom: string;
  left: string;
  rotation: string;
};

const objectDictionary: Record<number, ObjectProps> = {
  1: { color: "#ef4444", bottom: "82%", left: "50%", rotation: "180deg" }, // Top
  2: { color: "#f97316", bottom: "70%", left: "75%", rotation: "231deg" }, // Top-Right
  3: { color: "#eab308", bottom: "43%", left: "81%", rotation: "283deg" }, // Mid-Right
  4: { color: "#22c55e", bottom: "21%", left: "64%", rotation: "334deg" }, // Bottom-Right
  5: { color: "#06b6d4", bottom: "21%", left: "36%", rotation: "26deg" },  // Bottom-Left
  6: { color: "#3b82f6", bottom: "43%", left: "19%", rotation: "77deg" },  // Mid-Left
  7: { color: "#a855f7", bottom: "70%", left: "25%", rotation: "129deg" }, // Top-Left
  8: { color: "#ec4899", bottom: "50%", left: "50%", rotation: "0deg" }    // Center
};

interface CardProps {
    card: Card,
    faded: boolean
    onClicked?(symbol: number): void
}

export default function Card({ card, faded, onClicked }: CardProps) {
    return (
        <div className={`relative h-full aspect-square rounded-full ${faded ? 'bg-white' : 'bg-white'}`}>
            {card.symbols.map((num, idx) => (
                <div 
                key={idx}
                onClick={() => {
                    if (onClicked) {
                        onClicked(num);
                    }
                }}
                className="flex absolute z-5 aspect-square rounded-full items-center justify-center"
                style={{ 
                    bottom:objectDictionary[idx+1].bottom, 
                    left:objectDictionary[idx+1].left, 
                    transform: `translate(-50%, 50%) rotate(${objectDictionary[idx+1].rotation})`,
                    width: `${card.sizes[idx]}%`
                }}>
                    <Image 
                        src={symbols[num]}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-contain rounded-full p-1 overflow-visible"
                        alt={symbols[num]} />
                </div>
            ))}
        </div>
    )
}
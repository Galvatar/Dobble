import { useState } from "react";
import Dropdown from "../../components/dropdown";

interface HostPanelProps {
    onStart(selected: number): void
}

export default function HostPanel({ onStart }: HostPanelProps) {
    const [selected, setSelected] = useState(0);
    const MODES = ["The Well", "The Tower", "Hot Potato (WIP)"];

    return (
        <div className="flex w-full justify-between">
            <Dropdown values={MODES} selected={selected} onChange={(s) => setSelected(s)} />
            <button 
                onClick={() => onStart(selected)}
                className="bg-purple-300 px-4 rounded-md text-black font-semibold border-2 border-black">
                Start
            </button>
        </div>
    )
}
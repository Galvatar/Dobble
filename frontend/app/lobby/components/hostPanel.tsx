import { useState } from "react";
import Dropdown from "../../components/dropdown";

export default function HostPanel() {
    const [selected, setSelected] = useState(0);
    const MODES = ["Well", "Volcano", "Hot Potato"];

    return (
        <div className="flex w-full justify-between">
            <Dropdown values={MODES} selected={selected} onChange={(s) => setSelected(s)} />
            <button className="bg-purple-300 px-4 rounded-md text-black font-semibold border-2 border-black">
                Start
            </button>
        </div>
    )
}
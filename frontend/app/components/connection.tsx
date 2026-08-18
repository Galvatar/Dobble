"use client"

import { useEffect, useRef, useState } from "react";
import { useSharedSocket } from "./socketContext";

export default function Connection() {
    const { status, room, name } = useSharedSocket();

    return (
        <div className="flex justify-between bg-white p-2 border-b-2 border-black">
            {status == "connected" ?
            <span className="flex items-center gap-1 font-bold text-green-500">
                <span className="bg-green-500 rounded-full h-3 w-3" />
                Online
            </span>
            :
            <span className="flex items-center gap-1 font-bold text-red-500">
                <div className="bg-red-500 rounded-full h-3 w-3" />
                Offline
            </span>
            }
            {name != "" && 
            <span className="font-bold text-black">
                {name}
            </span>}
            {room != "" && 
            <span className="font-bold text-black">
                Room: {room}
            </span>}
        </div>
    )
}
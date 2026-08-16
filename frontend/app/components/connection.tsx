"use client"

import { useEffect, useRef, useState } from "react";
import { useSocket } from "../hooks/useSocket";

export default function Connection() {
    const { status, room } = useSocket();

    return (
        <div className="flex justify-between bg-yellow-300 p-3">
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
            {room != "" && 
            <span className="font-bold text-black">
                Room: {room}
            </span>}
        </div>
    )
}
"use client"
import { createContext, useContext } from "react";
import { useSocket } from "../hooks/useSocket";

const SocketContext = createContext<ReturnType<typeof useSocket> | null>(null);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const socketState = useSocket(); 
  
  return (
    <SocketContext.Provider value={socketState}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSharedSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSharedSocket must be used within a SocketProvider");
  }
  return context;
}
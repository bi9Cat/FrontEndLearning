import { create } from "zustand";

interface GameStatus {
    success: boolean,
    gameSize: number,
    setSuccess: (success: boolean) => void,
    setGameSize: (size: number) => void
}

export const useGameStore = create<GameStatus>((set) => ({
    success: false,
    setSuccess: (success) => set((state) => ({ success: success })),
    
    gameSize: 3,
    setGameSize: (size) => set((state) => ({ gameSize: size })),
}))
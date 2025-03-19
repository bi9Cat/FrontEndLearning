import { create } from "zustand";

interface GameStatus {
    success: boolean,
    gameSize: number,
    setSuccess: () => void,
    setGameSize: (size: number) => void
}

export const useGameStore = create<GameStatus>((set) => ({
    success: false,
    setSuccess: () => set((state) => ({ success: true })),
    gameSize: 3,
    setGameSize: (size) => set((state) => ({ gameSize: size })),
}))
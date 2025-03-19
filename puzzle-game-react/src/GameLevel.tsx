import React, { ChangeEventHandler } from 'react'
import './puzzlegame.css';
import { useGameStore } from './GameStore';

type Props = {
    restartGame: () => void
}

export default function GameLevel({ restartGame }: Props) {

    const setGameSize = useGameStore((state) => state.setGameSize);


    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setGameSize(Number(event.target.value));
        restartGame();
    }


    return (
        <div className='levelSelect'>
            <span>难度等级</span>
            <select name="level" id="level" onChange={handleSelectChange}>
                <option value="3">3x3</option>
                <option value="4">4X4</option>
                <option value="5">5X5</option>
            </select>
        </div>
    )
}
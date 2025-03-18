import React, { useEffect, useRef, useState } from "react";

import ImageSlice from "./ImageSlice";


interface GamePannelProps {
    imageUrl: string;
    gameSize: number;
}

export type ImgPosition = {
    id: number;
    positionX: number;
    positionY: number;
}

const GamePannel = ({ imageUrl, gameSize }: GamePannelProps) => {

    let maxX: number = 1500;
    let maxY: number = 700;

    const initImageSlicePositions: ImgPosition[] = Array.from({ length: gameSize * gameSize }, (_, index) => ({
        id: index,
        positionX: Math.floor(Math.random() * maxX),
        positionY: Math.floor(Math.random() * maxY),
    }));

    const [imageSlicePositions, setImageSlicePositions] = useState(initImageSlicePositions);

    const handleMoveImageSlice = (id: number, newPositionX: number, newPositionY: number) => {
        const newPositionList = imageSlicePositions.map((position) => {
            if (position.id === id) {
                return {
                    ...position,
                    positionX: newPositionX,
                    positionY: newPositionY
                }
            }
            return position;
        });
        setImageSlicePositions(newPositionList);
    }

    const imageSlices = imageSlicePositions.map((_, index) => {
        return <ImageSlice
            key={index}
            id={index}
            imageUrl={imageUrl}
            gameSize={gameSize}
            piecesSize={100}
            onUpdate={handleMoveImageSlice}
            imageSlicePositions={imageSlicePositions}
        />
    });

    return (
        <div>
            {imageSlices}
        </div>
    );
}


export default GamePannel;
import React, { useEffect, useRef } from "react";

import ImageSlice from "./ImageSlice";


interface GamePannelProps {
    imageUrl: string;
    gameSize: number;
}

const GamePannel: React.FC<GamePannelProps> = ({ imageUrl, gameSize }) => {

    const ref = useRef<HTMLDivElement>(null);

    let maxX: number = 1500;
    let maxY: number = 800;

    // TODO
    // useEffect(() => {
    //     if (ref.current) {
    //         const { width: rectWidth, height: rectHeight } = ref.current.getBoundingClientRect();
    //         maxX = rectWidth;
    //         maxY = rectHeight;
    //         console.log(maxX + "," + maxY);
    //     }
    // }, []);

    const imageSlices = [];
    for (let i = 0; i < gameSize * gameSize; i++) {
        imageSlices[i] = <ImageSlice
            key={i}
            id={i}
            imageUrl={imageUrl}
            gameSize={gameSize}
            maxX={maxX}
            maxY={maxY}
        />
    }

    return (
        <div ref={ref}>
            {imageSlices}
        </div>
    );
}


export default GamePannel;
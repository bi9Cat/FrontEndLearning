import { useState } from "react";

import ImageSlice from "./ImageSlice";
import { useGameStore } from "./GameStore";
import { PannelClientRect } from "./PuzzleGame";

interface GamePannelProps {
    imageUrl: string;
    gameSize: number;
    pannelClientRect: PannelClientRect | undefined;
}

export interface ImgPosition {
    id: number;
    positionX: number;
    positionY: number;
}

const GamePannel = ({ imageUrl, gameSize, pannelClientRect }: GamePannelProps) => {

    const piecesSize = 100;

    const initImageSlicePositions = () => {
        if (!pannelClientRect) {
            return [];
        }
        const { width, height, top } = pannelClientRect;
        const maxX = width - piecesSize;
        const maxY = height - piecesSize;
        const initImageSlicePositions: ImgPosition[] = Array.from({ length: gameSize * gameSize }, (_, index) => ({
            id: index,
            positionX: Math.floor(Math.random() * maxX),
            positionY: top + Math.floor(Math.random() * maxY),
        }));
        return initImageSlicePositions;
    }

    const setSuccess = useGameStore((state) => (state.setSuccess));

    const [imageSlicePositions, setImageSlicePositions] = useState(initImageSlicePositions());

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

        // 每次都判断性能有问题，可以只在mouseup回调的时候判断下
        if (isSuccess(newPositionList)) {
            console.log("SUCCESS");
            setSuccess(true);
        }
        setImageSlicePositions(newPositionList);
    }

    const isSuccess = (newPositionList: Array<ImgPosition>): boolean => {
        if (isRightGrid(newPositionList)) {
            return isRightOrder(newPositionList);
        }
        return false;
    }

    const isRightGrid = (newPositionList: Array<ImgPosition>): boolean => {
        const rowSet = new Set();
        const colSet = new Set();

        newPositionList.forEach(img => {
            rowSet.add(img.positionX);
            colSet.add(img.positionY);
        });

        return rowSet.size === gameSize && colSet.size === gameSize;
    }

    const isRightOrder = (newPositionList: Array<ImgPosition>): boolean => {
        const imageSlicePositionsCopy = [...newPositionList];
        imageSlicePositionsCopy.sort((a, b) => {
            if (a.positionY === b.positionY) {
                return a.positionX - b.positionX;
            }
            return a.positionY - b.positionY;
        });

        for (let index = 0; index < gameSize * gameSize; index++) {
            if (imageSlicePositionsCopy[index].id != index) {
                return false;
            }
        }
        return true;
    }

    const imageSlices = imageSlicePositions.map((_, index) => {
        return <ImageSlice
            key={index}
            id={index}
            imageUrl={imageUrl}
            gameSize={gameSize}
            piecesSize={piecesSize}
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
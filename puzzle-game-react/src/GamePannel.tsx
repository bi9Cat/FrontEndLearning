import { useRef, useState } from "react";

import ImageSlice from "./ImageSlice";
import { useGameStore } from "./GameStore";
import { PannelClientRect } from "./PuzzleGame";

interface GamePannelProps {
    imageUrl: string;
    gameSize: number;
    pannelClientRect: PannelClientRect | undefined;
}

// 图片位置
export interface ImgPosition {
    id: number;
    positionX: number;
    positionY: number;
}

// 鼠标选中的图片
export interface DraggingImg {
    id: number;
    startPositionX: number; // 点击时点击位置与图片左上角的偏移量
    startPositionY: number;
}

const GamePannel = ({ imageUrl, gameSize, pannelClientRect }: GamePannelProps) => {

    const piecesSize = 100;

    /**
     * 初始化所有的图片的位置，根据面板的宽高生成随机位置，确保生成的图片位置不会超出区域
     * @returns 
     */
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

    const [imageSlicePositions, setImageSlicePositions] = useState(initImageSlicePositions()); // 所有图片信息
    const [draggingImg, setDraggingImg] = useState<DraggingImg | null>(null);  // 鼠标点击图片信息

    /**
     * 处理鼠标移动事件，鼠标移动时更新选中图片的位置信息
     * @param event 
     */
    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        console.log('moving');
        if (draggingImg) {
            const newX = event.clientX - draggingImg.startPositionX;
            const newY = event.clientY - draggingImg.startPositionY;
            handleMoveImageSlice(draggingImg.id, newX, newY);
        }
    }

    // 更新位置信息并判断游戏是否结束
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

    /**
     * 鼠标按下或抬起时更新 被选中图片信息
     * @param draggingImg 
     */
    const handleDraggingImg = (draggingImg: DraggingImg | null) => {
        if (draggingImg) {
            const { id, startPositionX, startPositionY } = draggingImg;
            setDraggingImg({
                id: id,
                startPositionX: startPositionX,
                startPositionY: startPositionY,
            });
        } else {
            setDraggingImg(null);
        }
    }

    /**
     * 判断游戏是否成功
     * @param newPositionList 更新后的图片位置
     * @returns 游戏是否成功结果
     */
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
            onDragging={handleDraggingImg}
            imageSlicePositions={imageSlicePositions}
            isDragging={draggingImg ? draggingImg.id === index : false}
        />
    });

    return (
        <div
            className='gamepannel'
            onMouseMove={handleMouseMove}>
            {imageSlices}
        </div>
    );
}


export default GamePannel;
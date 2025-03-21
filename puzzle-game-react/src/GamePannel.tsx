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

export interface NeedClingResult {
    clingImage: ImgPosition;
    dir: string;
}
const piecesSize = 100;
const GamePannel = ({ imageUrl, gameSize, pannelClientRect }: GamePannelProps) => {
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

    const [imageSlicePositions, setImageSlicePositions] = useState<Array<ImgPosition>>(() => initImageSlicePositions()); // 所有图片信息
    const [draggingImg, setDraggingImg] = useState<DraggingImg | null>(null);  // 鼠标点击图片信息

    /**
     * 处理鼠标移动事件，鼠标移动时更新选中图片的位置信息
     * @param event 
     */
    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        if (draggingImg) {
            const newX = event.clientX - draggingImg.startPositionX;
            const newY = event.clientY - draggingImg.startPositionY;
            handleMoveImageSlice(draggingImg.id, newX, newY);
        }
    }

    // 更新位置信息并判断游戏是否结束
    const handleMoveImageSlice = (id: number, newPositionX: number, newPositionY: number): Array<ImgPosition> => {
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
        return newPositionList;
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

    const needClingHere = (): NeedClingResult | null => {
        if (!draggingImg) {
            return null;
        }
        const draggingImgPositon = imageSlicePositions.find(i => i.id === draggingImg.id);
        if (!draggingImgPositon) {
            return null;
        }
        const centerX = draggingImgPositon.positionX + piecesSize / 2;
        const centerY = draggingImgPositon.positionY + piecesSize / 2;

        let clingImage: ImgPosition | undefined;
        let minDistance = Number.MAX_SAFE_INTEGER;
        imageSlicePositions.forEach(imgPosition => {
            if (imgPosition.id !== draggingImgPositon.id) {
                const imgPositionCenterX = imgPosition.positionX + piecesSize / 2;
                const imgPositionCenterY = imgPosition.positionY + piecesSize / 2;

                const dx = Math.abs(centerX - imgPositionCenterX);
                const dy = Math.abs(centerY - imgPositionCenterY);

                if (dx <= (piecesSize + 50) && dy <= (piecesSize + 50)) {
                    const distance = calculateDistance(centerX, centerY, imgPositionCenterX, imgPositionCenterY);
                    if (distance < minDistance) {
                        minDistance = distance;
                        clingImage = imgPosition;
                    }
                }
            }
        });

        if (!clingImage) {
            return null;
        }

        const imgPositionCenterX = clingImage.positionX + piecesSize / 2;
        const imgPositionCenterY = clingImage.positionY + piecesSize / 2;

        const dx = Math.abs(centerX - imgPositionCenterX);
        const dy = Math.abs(centerY - imgPositionCenterY);
        let dir;
        if (dx > dy) {
            dir = centerX < imgPositionCenterX ? "A" : "D";
        } else {
            dir = centerY < imgPositionCenterY ? "W" : "S";
        }

        return {
            clingImage: clingImage,
            dir: dir
        };
    }

    const calculateDistance = (x1: number, y1: number, x2: number, y2: number) => {
        return Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
    }


    const handleSuccess = (newPositionList: Array<ImgPosition>) => {
        console.log('handleSuccess');
        if (isSuccess(newPositionList)) {
            console.log("SUCCESS");
            setSuccess(true);
        }
    }

    const imageSlices = imageSlicePositions.map((p, index) => {
        return <ImageSlice
            key={index}
            sliceInfo={{
                id: index,
                imageUrl: imageUrl,
                piecesSize: piecesSize,
                positionX: p.positionX,
                positionY: p.positionY,
            }}
            gameSize={gameSize}
            onUpdate={handleMoveImageSlice}
            onDragging={handleDraggingImg}
            isDragging={draggingImg ? draggingImg.id === index : false}
            needClingHere={needClingHere}
            handleSuccess={handleSuccess}
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
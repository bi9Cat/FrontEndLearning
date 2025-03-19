import React, { useEffect, useRef, useState } from "react";
import './puzzlegame.css';
import { ImgPosition } from "./GamePannel";

interface ImageSliceProps {
    id: number;
    imageUrl: string;
    gameSize: number;
    piecesSize: number;
    imageSlicePositions: Array<ImgPosition>

    onUpdate: (id: number, newPositionX: number, newPositionY: number) => void
}

interface NeedClingResult {
    clingImage: ImgPosition;
    dir: string;
}

const ImageSlice = ({ imageUrl, id, gameSize, piecesSize, onUpdate, imageSlicePositions, ...rest }: ImageSliceProps) => {

    const [isDragging, setIsDragging] = useState(false); // 用来标记是否被选中
    const startPosition = useRef({ startPositionX: 0, startPositionY: 0 }); // 点击时点击位置与图片左上角的偏移量

    const imgPosition = (): ImgPosition | undefined => {
        const currentImgPosition: ImgPosition | undefined = imageSlicePositions.find(p => p.id === id);
        return currentImgPosition;
    }

    const initStyle = () => {
        const currentImgPsotion = imgPosition();
        let i = Math.floor(id / gameSize);
        let j = id % gameSize;
        const imageStyle = {
            backgroundSize: `${piecesSize * gameSize}px ${piecesSize * gameSize}px`,
            backgroundImage: `url(${imageUrl})`,
            backgroundPosition: `-${j * piecesSize}px -${i * piecesSize}px`,
            left: `${currentImgPsotion && currentImgPsotion.positionX}px`,
            top: `${currentImgPsotion && currentImgPsotion.positionY}px`
        }
        return imageStyle;
    }

    const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
        const currentImgPsotion = imgPosition();
        if (!currentImgPsotion) {
            return;
        }
        startPosition.current = {
            startPositionX: event.clientX - currentImgPsotion.positionX,
            startPositionY: event.clientY - currentImgPsotion.positionY
        };
        setIsDragging(true);
    }

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        if (isDragging) {
            const newX = event.clientX - startPosition.current.startPositionX;
            const newY = event.clientY - startPosition.current.startPositionY;
            onUpdate(id, newX, newY);
        }
    }

    const handleMouseUp = () => {
        doClingImg();
        setIsDragging(false);
    }

    const doClingImg = () => {
        const clingResult = needClingHere();
        if (clingResult) {
            const { dir, clingImage } = clingResult;
            if (dir === 'D') {
                onUpdate(id, clingImage.positionX + piecesSize + 2, clingImage.positionY);
            } else if (dir === 'A') {
                onUpdate(id, clingImage.positionX - piecesSize - 2, clingImage.positionY);
            } else if (dir === 'W') {
                onUpdate(id, clingImage.positionX, clingImage.positionY - piecesSize - 2);
            } else if (dir === 'S') {
                onUpdate(id, clingImage.positionX, clingImage.positionY + piecesSize + 2);
            }
        }
    }

    const needClingHere = (): NeedClingResult | null => {
        const currentImgPsotion = imgPosition();

        if (!currentImgPsotion) {
            return null;
        }
        const centerX = currentImgPsotion.positionX + piecesSize / 2;
        const centerY = currentImgPsotion.positionY + piecesSize / 2;

        let clingImage: ImgPosition | undefined;
        let minDistance = Number.MAX_SAFE_INTEGER;
        imageSlicePositions.forEach(imgPosition => {
            if (imgPosition.id !== id) {
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

    return (
        <div
            key={id}
            className={`image-piece ${isDragging ? 'selectImage' : ''}`}
            style={initStyle()}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        ></div>
    );
}

export default ImageSlice;
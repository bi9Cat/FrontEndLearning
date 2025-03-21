import React, { useEffect, useRef, useState } from "react";
import './puzzlegame.css';
import { ImgPosition } from "./GamePannel";
import { DraggingImg } from "./GamePannel";

interface ImageSliceProps {
    id: number;
    imageUrl: string;
    gameSize: number;
    piecesSize: number;
    imageSlicePositions: Array<ImgPosition>;
    isDragging: boolean;

    onUpdate: (id: number, newPositionX: number, newPositionY: number) => void
    onDragging: (draggingImg: DraggingImg | null) => void;
}

interface NeedClingResult {
    clingImage: ImgPosition;
    dir: string;
}

const ImageSlice = ({ imageUrl, id, gameSize, piecesSize, imageSlicePositions, isDragging, onUpdate, onDragging, ...rest }: ImageSliceProps) => {

    const imgPosition = (): ImgPosition | undefined => {
        const currentImgPosition: ImgPosition | undefined = imageSlicePositions.find(p => p.id === id);
        return currentImgPosition;
    }

    /**
     * 初始化图片切片样式
     * @returns 样式
     */
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

    /**
     * 处理鼠标点击事件，计算出鼠标点击位置与当前图片位置的偏移量，并调父组件方法更新状态 设置当前图片为选中图片
     * @param event 鼠标点击事件
     * @returns 
     */
    const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
        const currentImgPsotion = imgPosition();
        if (!currentImgPsotion) {
            return;
        }
        onDragging({
            id: id,
            startPositionX: event.clientX - currentImgPsotion.positionX,
            startPositionY: event.clientY - currentImgPsotion.positionY,
        });
    }

    /**
     * 处理鼠标抬起事件，
     * 1.判断是否需要吸附并执行吸附
     * 2.调父组件方法清除被选中图片状态
     */
    const handleMouseUp = () => {
        doClingImg();
        onDragging(null);
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
            className={`image-piece ${isDragging ? 'image-piece' : ''}`}
            style={initStyle()}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
        ></div>
    );
}

export default ImageSlice;
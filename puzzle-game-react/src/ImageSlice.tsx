import React, { useEffect, useMemo, useRef, useState } from "react";
import './puzzlegame.css';
import { DraggingImg, ImgPosition, NeedClingResult } from "./GamePannel";

interface ImageSliceProps {
    sliceInfo: ScliceInfo
    gameSize: number;
    onUpdate: (id: number, newPositionX: number, newPositionY: number) => Array<ImgPosition>
    onDragging: (draggingImg: DraggingImg | null) => void;
    needClingHere: () => NeedClingResult | null;
}

interface ScliceInfo {
    id: number;
    imageUrl: string;
    piecesSize: number;
    positionX: number;
    positionY: number;
}

const ImageSlice = ({ sliceInfo, gameSize, onUpdate, onDragging, needClingHere, ...rest }: ImageSliceProps) => {

    /**
     * 初始化图片切片样式
     * @returns 样式
     */

    const { id, imageUrl, piecesSize, positionX, positionY } = sliceInfo;
    const initStyle = useMemo(() => {
        let i = Math.floor(id / gameSize);
        let j = id % gameSize;

        const imageStyle = {
            backgroundSize: `${piecesSize * gameSize}px ${piecesSize * gameSize}px`,
            backgroundImage: `url(${imageUrl})`,
            backgroundPosition: `-${j * piecesSize}px -${i * piecesSize}px`,
            left: `${positionX}px`,
            top: `${positionY}px`,
        }
        return imageStyle;
    }, [id, imageUrl, piecesSize, positionX, positionY, gameSize]);

    /**
     * 处理鼠标点击事件，计算出鼠标点击位置与当前图片位置的偏移量，并调父组件方法更新状态 设置当前图片为选中图片
     * @param event 鼠标点击事件
     * @returns 
     */
    const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
        if (!sliceInfo) {
            return;
        }
        const { id, positionX, positionY } = sliceInfo;
        onDragging({
            id: id,
            startPositionX: event.clientX - positionX,
            startPositionY: event.clientY - positionY,
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
            const { id, piecesSize } = sliceInfo;
            if (dir === 'D') {
                (onUpdate(id, clingImage.positionX + piecesSize + 2, clingImage.positionY));
            } else if (dir === 'A') {
                (onUpdate(id, clingImage.positionX - piecesSize - 2, clingImage.positionY));
            } else if (dir === 'W') {
                (onUpdate(id, clingImage.positionX, clingImage.positionY - piecesSize - 2));
            } else if (dir === 'S') {
                (onUpdate(id, clingImage.positionX, clingImage.positionY + piecesSize + 2));
            }
        }
    }

    return (
        <div
            key={sliceInfo.id}
            className='image-piece'
            style={initStyle}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
        ></div>
    );
}

export default ImageSlice;
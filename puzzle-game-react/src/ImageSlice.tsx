import React, { useEffect, useRef, useState } from "react";
import './puzzlegame.css';

interface ImageSliceProps {
    imageUrl: string;
    id: number;
    gameSize: number;
    maxX: number;
    maxY: number;
}

const ImageSlice: React.FC<ImageSliceProps> = ({ imageUrl, id, gameSize, maxX, maxY }) => {

    const piecesSize = 100;
    let i = Math.floor(id / gameSize);
    let j = id % gameSize;

    let randomX = Math.floor(Math.random() * maxX);
    let randomY = Math.floor(Math.random() * maxY);


    const imageRef = useRef<HTMLImageElement>(null);
    const [isDragging, setIsDragging] = useState(false); // 是否选中
    const [position, setPosition] = useState({ positionX: randomX, positionY: randomY }); // 图片初始位置
    const [startPosition, setStartPosition] = useState({ startPositionX: 0, startPositionY: 0 }); // 点击时点击位置与图片左上角的偏移量

 
    const imageStyle = {
        backgroundSize: `${piecesSize * gameSize}px ${piecesSize * gameSize}px`,
        backgroundImage: `url(${imageUrl})`,
        backgroundPosition: `-${j * piecesSize}px -${i * piecesSize}px`,
        left: `${position.positionX}px`,
        top: `${position.positionY}px`
    }


    const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
        setIsDragging(true);
        setStartPosition({
            startPositionX: event.clientX - position.positionX,
            startPositionY: event.clientY - position.positionY
        })
    }

    const handleMouseMove = (event: MouseEvent) => {
        if (isDragging && imageRef.current) {
            const newX = event.clientX - startPosition.startPositionX;
            const newY = event.clientY - startPosition.startPositionY;
            setPosition({
                positionX: newX,
                positionY: newY
            });

            console.log("newX:" + newX + ",newY:" + newY);
        }
    }

    const handleMouseUp = () => {
        setIsDragging(false);
    }

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        } else {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    

    return (
        <div
            ref={imageRef}
            key={id}
            className="image-piece"
            style={imageStyle}
            onMouseDown={handleMouseDown}
        />
    );
}

export default ImageSlice;
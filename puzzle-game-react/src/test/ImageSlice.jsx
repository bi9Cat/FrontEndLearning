import React, { useState, useRef } from "react";

const SNAP_DISTANCE = 20; // 吸附距离

const ImageSlice = ({ id, src, x, y, onDragEnd }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [startY, setStartY] = useState(0);
    const [offsetX, setOffsetX] = useState(0);
    const [offsetY, setOffsetY] = useState(0);
    const imageRef = useRef(null);

    const handleDragStart = (e) => {
        setIsDragging(true);
        setStartX(e.clientX);
        setStartY(e.clientY);
        setOffsetX(x);
        setOffsetY(y);
        // 阻止默认行为，防止选中图片等情况
        e.preventDefault();
    };

    const handleDrag = (e) => {
        if (isDragging) {
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            const newX = offsetX + dx;
            const newY = offsetY + dy;

            // 吸附逻辑
            const snappedX = snapToGrid(newX);
            const snappedY = snapToGrid(newY);

            if (imageRef.current) {
                imageRef.current.style.left = `${snappedX}px`;
                imageRef.current.style.top = `${snappedY}px`;
            }
        }
    };

    const handleDragEnd = () => {
        if (isDragging) {
            setIsDragging(false);
            if (imageRef.current) {
                const newX = parseInt(imageRef.current.style.left, 10);
                const newY = parseInt(imageRef.current.style.top, 10);
                onDragEnd(id, newX, newY);
            }
        }
    };

    const snapToGrid = (value) => {
        const gridSize = 50; // 网格大小
        const remainder = value % gridSize;
        if (remainder < SNAP_DISTANCE) {
            return value - remainder;
        } else if (gridSize - remainder < SNAP_DISTANCE) {
            return value + (gridSize - remainder);
        }
        return value;
    };

    return (
        <div
            className="image-slice"
            ref={imageRef}
            style={{ left: `${x}px`, top: `${y}px` }}
            onMouseDown={handleDragStart}
            onMouseMove={handleDrag}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
        >
            <img src={src} alt={`Image ${id}`} />
        </div>
    );
};

export default ImageSlice;    
import React, { useState } from "react";
import ImageSlice from "./ImageSlice";

const Pannel = () => {
    const [images, setImages] = useState([
        { id: 1, src: "https://dummyimage.com/200x200/000/fff", x: 0, y: 0 },
        { id: 2, src: "https://dummyimage.com/200x200/ff0000/fff", x: 250, y: 0 },
        { id: 3, src: "https://dummyimage.com/200x200/00ff00/fff", x: 500, y: 0 },
    ]);

    const handleDragEnd = (id, newX, newY) => {
        const newImages = images.map((image) => {
            if (image.id === id) {
                return { ...image, x: newX, y: newY };
            }
            return image;
        });
        setImages(newImages);
    };

    return (
        <div className="pannel">
            {images.map((image) => (
                <ImageSlice
                    key={image.id}
                    id={image.id}
                    src={image.src}
                    x={image.x}
                    y={image.y}
                    onDragEnd={handleDragEnd}
                />
            ))}
        </div>
    );
};

export default Pannel;    
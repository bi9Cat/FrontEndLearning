import { useRef } from 'react';
import './puzzlegame.css';
import { GameFileInfo } from './PuzzleGame';

interface ImageInputProps {
    filePath: string;
    started: boolean;
    updateImage: (fileImageInfo: GameFileInfo) => void;
    restartGame: () => void
}

const ImageInput = ({ filePath, updateImage, started, restartGame }: ImageInputProps) => {

    const inputFileRef = useRef<HTMLInputElement>(null);

    const handleUploadBtnClick = () => {
        if (inputFileRef.current) {
            return inputFileRef.current.click();
        }
    }

    const handleUploadFileOnChange = () => {
        // 读取到图片信息，图片信息要回调父组件的方法设置
        if (inputFileRef.current && inputFileRef.current.files) {
            const filePath = inputFileRef.current.value;
            const file = inputFileRef.current.files[0];
            const url = URL.createObjectURL(file);

            updateImage({
                filePath: filePath,
                fileUrl: url,
            });

            restartGame();
        }
    }

    return (
        <div className='imageUpload'>
            <input
                className='imagePath'
                type="text"
                disabled
                value={filePath}
            >
            </input>
            <button
                className="imageSelect"
                onClick={handleUploadBtnClick}
                disabled={!started}
            >选择图片
            </button>
            <input ref={inputFileRef}
                className='upladImage'
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                onChange={handleUploadFileOnChange}
            />
        </div>
    );
}

export default ImageInput;
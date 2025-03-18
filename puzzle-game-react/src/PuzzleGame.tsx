import { useState } from 'react';
import GamePannel from './GamePannel';
import ImageInput from './ImageInput';
import './puzzlegame.css';

export type GameFileInfo = {
  filePath: string;
  fileUrl: string;
}

function PuzzleGame() {

  const [imageFileInfo, setImageFileInfo] = useState<GameFileInfo>({
    filePath: 'https://i.imgur.com/MK3eW3Am.jpg',
    fileUrl: 'https://i.imgur.com/MK3eW3Am.jpg',
  });

  const [isStart, setIsStart] = useState(false);

  const updateImageUrl = (imageFileInfo: GameFileInfo) => {
    setImageFileInfo({
      filePath: imageFileInfo.filePath,
      fileUrl: imageFileInfo.fileUrl
    });
  }

  const startGame = () => {
    setIsStart(true);
  }

  return (
    <div className='container'>
      <div className='gameAction'>
        <ImageInput
          filePath={imageFileInfo.filePath}
          updateImage={updateImageUrl}
          started
        />
        <button
          className='start'
          onClick={startGame}
        >开始</button>
      </div>
      <div className='gamepannel'>
        {isStart ? <GamePannel
          gameSize={3}
          imageUrl={imageFileInfo.fileUrl}
        /> : <div />}
      </div>
    </div>
  );
}

export default PuzzleGame;
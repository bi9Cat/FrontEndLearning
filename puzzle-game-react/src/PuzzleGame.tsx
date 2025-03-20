import { useRef, useState } from 'react';
import GamePannel from './GamePannel';
import ImageInput from './ImageInput';
import './puzzlegame.css';
import { useGameStore } from './GameStore';
import GameLevel from './GameLevel';
import Timer from './Timer';
import { start } from 'repl';

export interface GameFileInfo {
  filePath: string;
  fileUrl: string;
}

export interface PannelClientRect {
  width: number;
  height: number;
  top: number;
}

function PuzzleGame() {

  const [imageFileInfo, setImageFileInfo] = useState<GameFileInfo>({
    filePath: 'https://i.imgur.com/MK3eW3Am.jpg',
    fileUrl: 'https://i.imgur.com/MK3eW3Am.jpg',
  });

  const [isStart, setIsStart] = useState(false);
  const gameSuccess = useGameStore((state) => state.success);
  const gameSize = useGameStore((state) => state.gameSize);
  const setSuccess = useGameStore((state) => (state.setSuccess));

  const gemePannelRef = useRef<HTMLDivElement>(null);

  const updateImageUrl = (imageFileInfo: GameFileInfo) => {
    setImageFileInfo({
      filePath: imageFileInfo.filePath,
      fileUrl: imageFileInfo.fileUrl
    });
  }

  const startGame = () => {
    setIsStart(true);
  }

  const restartGame = () => {
    setIsStart(false);
    setSuccess(false);
  }

  const pannelClientRect = (): PannelClientRect | undefined => {
    if (gemePannelRef.current) {
      const { clientWidth, clientHeight, offsetTop } = gemePannelRef.current;
      return {
        width: clientWidth,
        height: clientHeight,
        top: offsetTop,
      }
    }
  }

  return (
    <div className='container'>
      <div className='gamenav'>
        <div className='gameAction'>
          <ImageInput
            filePath={imageFileInfo.filePath}
            started={isStart}
            updateImage={updateImageUrl}
            restartGame={restartGame}
          />
          <GameLevel
            restartGame={restartGame}
          />
          <button
            className={isStart ? 'start startDisable' : 'start'}
            onClick={startGame}
            disabled={isStart}
          >开始</button>
        </div>
        <div className='gameData'>
          <span className='gameSuccess'>{gameSuccess && isStart ? 'SUCCESS!' : ''}</span>
          {isStart?<Timer
            isSuccess={gameSuccess}
          />:<div/>}
        </div>
      </div>

      <div
        ref={gemePannelRef}
        className='gamepannel'>
        {isStart ? <GamePannel
          gameSize={gameSize}
          imageUrl={imageFileInfo.fileUrl}
          pannelClientRect={pannelClientRect()}
        /> : <div />}
      </div>
    </div>
  );
}

export default PuzzleGame;
import GamePannel from './GamePannel';

function PuzzleGame() {
    return (
      <div>
        <GamePannel 
        gameSize={3}
        imageUrl='https://i.imgur.com/MK3eW3Am.jpg'
        />
      </div>
    );
  }
  
  export default PuzzleGame;
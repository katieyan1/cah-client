import React, { useState } from 'react';
function Game({ name, socket }) {
  // diff for everyone
  const [myCards, setMyCards] = useState([]);
  const [me, setMe] = useState('');
  const [myColor, setMyColor] = useState([]);

  // same for everyone
  const [names, setNames] = useState([]);
  const [blackCard, setBlackCard] = useState('');
  const [judge, setJudge] = useState('');
  const [judgeCards, setJudgeCards] = useState([]);
  const [sentCard, setSentCard] = useState(false);
  const [from, setFrom] = useState([]);
  const [winnerRevealed, setWinnerRevealed] = useState(false);
  const [winner, setWinner] = useState('');
  const [winningCard, setWinningCard] = useState('');
  const [points, setPoints] = useState([0, 0, 0, 0, 0, 0, 0]);
  socket.off('g-updatePlayers').on('g-updatePlayers', (players) => {
    let namearr = players.map((player) => {
      return player.name;
    });
    let pointsarr = players.map((player) => {
      return player.points;
    });
    setNames(namearr);
    setPoints(pointsarr);
  });
  socket.off('g-cardUpdate').on('g-cardUpdate', (player) => {
    let cardarr = player.cards;
    setMyCards(cardarr);
    setMe(player.name);
    setMyColor(player.color);
  });
  socket.off('g-newJudge').on('g-newJudge', (judge, card) => {
    setBlackCard(card);
    setJudge(judge.name);
    setSentCard(false);
  });
  // only for judges
  socket.off('g-receiveCards').on('g-receiveCards', (cards, pfrom) => {
    setJudgeCards(cards);
    let pfromarr = from;
    pfromarr.push(pfrom);
    setFrom(pfromarr);
  });
  const judgeDone = (card) => {
    let i = judgeCards.indexOf(card);
    let winner = from[i];
    socket.emit('g-judgeDone', card, winner);
  };

  socket.off('g-revealWinner').on('g-revealWinner', (card, winner) => {
    setWinnerRevealed(true);
    setWinner(winner);
    setWinningCard(card);
    setJudgeCards([]);
    setFrom([]);
  });
  const nextRound = () => {
    socket.emit('g-nextRound');
  };
  socket.off('g-startNextRound').on('g-startNextRound', () => {
    setWinnerRevealed(false);
  });

  // only for players
  const sendCard = (card) => {
    socket.emit('g-sendCard', card, me);
    let index = myCards.indexOf(card);
    let array = myCards;
    if (index > -1) {
      array.splice(index, 1);
      setMyCards([...array]);
    }
    setSentCard(true);
    console.log(myCards);
    socket.emit('g-newCard', myCards);
  };
  const getFaviconEl = () => {
    return document.getElementById('favicon');
  };
  let showJudge = null;
  let showBlackCard = null;
  let showReceived = null;
  let showWinner = null;
  let showNextRound = null;
  if (judge !== '') {
    showJudge = <h3 className='judge'>The judge is {judge}</h3>;
  }
  if (blackCard !== '') {
    showBlackCard = <div className='blackCard'>{blackCard}</div>;
  }
  if (judge === me) {
    const favicon = getFaviconEl();
    favicon.href = 'black_favicon.ico';
    showReceived = (
      <div>
        <h3 style={{ textAlign: 'center' }}>Received Cards: </h3>
        <div className='cardContainer'>
          {judgeCards.map((card, i) => {
            return (
              <button
                className='whiteCard'
                key={i}
                onClick={() => judgeDone(card)}
              >
                {card}
              </button>
            );
          })}
        </div>
      </div>
    );
  } else {
    const favicon = getFaviconEl();
    favicon.href = 'white_favicon.ico';
    showReceived = null;
  }
  if (winnerRevealed) {
    showWinner = (
      <b style={{ marginRight: '20px' }}>
        {winner} won with '{winningCard}'!
      </b>
    );
    if (judge === me) {
      showNextRound = (
        <button className='btn btn-light' onClick={() => nextRound()}>
          Next Round
        </button>
      );
    } else {
      showNextRound = null;
    }
  }

  return (
    <div>
      <ul className='playerPointList'>
        <h3>Players</h3>
        {names.map((name, i) => {
          return (
            <li
              key={i}
              style={{
                fontWeight: name === me ? 'bold' : 'normal',
                color: name === judge ? 'red' : 'black',
              }}
            >
              {name}, points: {points[i].toString()}
            </li>
          );
        })}
      </ul>
      <div className='gameContainer'>
        <div>{showBlackCard}</div>
        <div>
          {showWinner}
          {showNextRound}
        </div>

        <div className='cardContainer'>
          {myCards.map((card, i) => {
            return (
              <div key={i}>
                <button
                  className='whiteCard'
                  onClick={() => sendCard(card)}
                  disabled={sentCard || judge === me}
                >
                  {card}
                </button>
              </div>
            );
          })}
        </div>
        <div>{showJudge}</div>
        <div>{showReceived}</div>
      </div>
    </div>
  );
}

export default Game;

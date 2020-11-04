import React, { useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import Game from './game';
const baseURL = `https://kah-server.herokuapp.com`;

function Create(props) {
  const [name, setName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [players, setPlayers] = useState([]);
  const [inRoom, setInRoom] = useState(false);
  const [canStart, setCanStart] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [socket, setSocket] = useState(null);
  const onNameChange = (name) => {
    setName(name);
  };
  const joinParty = (code) => {
    console.log('joined party with code:  ', code);
    const socket = io.connect(`${baseURL}/${code}`);
    setSocket(socket);
    socket.emit('setName', name);
    socket.on('joinSuccess', () => {
      setInRoom(true);
      console.log('joinsuccess function');
    });
    socket.on('partyUpdate', (players) => {
      setPlayers(players);
      if (
        players.length >= 1 &&
        players.map((x) => x.isReady).filter((x) => x === true).length ===
          players.length
      ) {
        setCanStart(true);
      } else {
        setCanStart(false);
      }
    });
  };
  const createParty = () => {
    console.log(baseURL);
    axios.get(`${baseURL}/createNamespace`).then((res) => {
      console.log('inside create namespace');
      setRoomCode(res.data.namespace);
      joinParty(res.data.namespace);
    });
  };
  const startGame = () => {
    socket.emit('startGameSignal', players);
    socket.on('startGame', () => {
      setGameStarted(true);
    });
  };
  const copy = () => {
    let copiedText = document.createElement('textarea');
    document.body.appendChild(copiedText);
    copiedText.value = roomCode;
    copiedText.select();
    document.execCommand('copy');
    document.body.removeChild(copiedText);
  };
  let createButton = null;
  let startButton = null;
  let roomInfo = null;
  if (gameStarted) {
    return <Game name={name} socket={socket}></Game>;
  }
  if (!inRoom) {
    createButton = (
      <button className='btn btn-success' onClick={() => createParty()}>
        Create
      </button>
    );
  }
  if (canStart) {
    startButton = (
      <button className='btn btn-success' onClick={() => startGame()}>
        Start game
      </button>
    );
  }
  if (inRoom) {
    roomInfo = (
      <div className='room-info'>
        <h5>
          Room Code:
          <div>
            <button
              className='btn btn-light'
              onClick={() => copy()}
              id='roomCode'
            >
              {roomCode}
            </button>
          </div>
        </h5>
        <h2>Players</h2>
        <ul className='list-group'>
          {players.map((item, index) => {
            let readyUnitColor = '#E46258';
            if (item.isReady) {
              readyUnitColor = '#73C373';
            }
            return (
              <li
                key={index}
                className='list-group-item'
                style={{ color: readyUnitColor }}
              >
                {item.name}
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
  return (
    <div className='joinCreateContainer'>
      <h1>Create Game</h1>
      <div>
        <input
          className='input-group-text'
          placeholder='Name'
          type='text'
          value={name}
          disabled={inRoom}
          onChange={(e) => {
            onNameChange(e.target.value);
          }}
        ></input>
      </div>
      {createButton}
      <br></br>
      {roomInfo}
      <br></br>
      {startButton}
    </div>
  );
}

export default Create;

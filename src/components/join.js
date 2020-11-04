import React, { useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import Game from './game';
const baseURL = `https://kah-server.herokuapp.com`;
function Join(props) {
  const [name, setName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [players, setPlayers] = useState([]);
  const [inRoom, setInRoom] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [socket, setSocket] = useState(null);

  const onNameChange = (name) => {
    setName(name);
  };
  const onCodeChange = (roomCode) => {
    setRoomCode(roomCode);
  };
  const joinParty = () => {
    const socket = io.connect(`${baseURL}/${roomCode}`);
    setSocket(socket);
    socket.emit('setName', name);
    socket.on('joinSuccess', () => {
      setInRoom(true);
    });
    socket.on('startGame', () => {
      setGameStarted(true);
    });
    socket.on('partyUpdate', (players) => {
      setPlayers(players);
    });
  };
  const attemptJoinParty = () => {
    axios
      .get(`${baseURL}/exists/${roomCode}`)
      .then((res) => {
        if (res.data.exists) {
          joinParty();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const reportReady = () => {
    socket.emit('setReady', true);
    socket.on('readyConfirm', () => {
      setIsReady(true);
    });
  };
  let joinReady = null;
  let ready = null;
  let roomInfo = null;
  if (gameStarted) {
    return <Game name={name} socket={socket}></Game>;
  }
  if (inRoom) {
    joinReady = (
      <button
        className='btn btn-success'
        onClick={() => reportReady()}
        disabled={isReady}
      >
        Ready
      </button>
    );
    roomInfo = (
      <div className='room-info'>
        <h2 style={{ marginTop: '5px' }}>Players</h2>
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
  } else {
    joinReady = (
      <button className='btn btn-success' onClick={() => attemptJoinParty()}>
        Join
      </button>
    );
  }
  if (isReady) {
    ready = <b style={{ marginTop: '10px' }}>You are ready!</b>;
    joinReady = null;
  }
  return (
    <div className='joinCreateContainer'>
      <h1>Join Game</h1>
      <div>
        <input
          className='input-group-text'
          disabled={inRoom}
          placeholder='Name'
          type='text'
          onChange={(e) => {
            onNameChange(e.target.value);
          }}
        ></input>
      </div>
      <div>
        <input
          className='input-group-text'
          disabled={inRoom}
          placeholder='Room Code'
          type='text'
          onChange={(e) => {
            onCodeChange(e.target.value);
          }}
        ></input>
      </div>
      {joinReady}
      {ready}
      {roomInfo}
    </div>
  );
}

export default Join;

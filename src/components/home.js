import React from 'react';
import { Link } from 'react-router-dom';
function Home() {
  return (
    <div>
      <div className='homeContainer'>
        <h1>Kards Against Humanity</h1>
        <div>
          <Link className='btn btn-primary btn-block' to='/join'>
            Join
          </Link>
        </div>
        <div>
          <Link className='btn btn-primary btn-block' to='/create'>
            Create
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;

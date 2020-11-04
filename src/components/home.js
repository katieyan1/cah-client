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
      <footer>
        Made by Katie :)
        <span>
          <a
            href='https://github.com/katieyan1'
            class='fab fa-github fa-lg'
          ></a>
        </span>
      </footer>
    </div>
  );
}

export default Home;

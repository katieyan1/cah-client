import React from 'react';
import './App.css';
import Create from './components/create';
import Join from './components/join';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './components/home';
function App() {
  return (
    <div className='App'>
      <Router>
        <Switch>
          <Route path='/' exact component={Home}></Route>
          <Route path='/join' exact component={Join} />
          <Route path='/create' exact component={Create} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;

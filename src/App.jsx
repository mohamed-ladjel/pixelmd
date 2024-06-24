import React, { useState, useEffect } from 'react';
import './App.css';
import LandingPage from './components/landing-page/LandingPage';
import axios from 'axios';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Vue from './vue';

function App() {
  const [count, setCount] = useState(0);
  const imageUrl2 = "assets\\bone_label.nii.gz"; // Provide the URL of the image to display
  const [data, setData] = useState([{}]);

  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <LandingPage />
        </Route>
        <Route path="/vue">
          <Vue />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;

import ReactDOM from 'react-dom'
import Paperbase from './Paperbase'
import React from 'react'
import axios from "axios";

const api = axios.create({
  headers: {
    '_csrf': csrf_token,
    'Content-Type': 'application/json',
  },
});

ReactDOM.render(
  <Paperbase api={api}/>,
  document.getElementById('react-container')
);
import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import './interfaces/augment-api';
import './interfaces/augment-types';
import './interfaces/types-lookup'

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)

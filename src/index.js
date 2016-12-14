import 'bootstrap/dist/css/bootstrap'
import './style'

import React from 'react'
import ReactDOM from 'react-dom'
import socketConnect from 'socket.io-client'
import Chat from './Chat'


ReactDOM.render(
    <Chat
        conn={socketConnect('http://localhost:3010')}
    />, document.getElementById('root')
)
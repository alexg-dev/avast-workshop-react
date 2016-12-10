import React from 'react'
import socketConnect from 'socket.io-client'
import LoginForm from './Login'

let conn = null

export default class Chat extends React.Component {

    constructor () {
        super()
        this.state = {
            username: null
        }
    }

    componentWillMount () {
        conn = socketConnect('http://localhost:3010')
        conn.on('username', payload => {
            console.log('username payload', payload)
        })
        conn.emit('username', { username: 'azaza' })
    }

    render () {
        if (this.state.username) {
            return <div>chat</div>
        }
        return <LoginForm
                    onChange={username => this.setState({ username })}
               />
    }

}
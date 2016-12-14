import React from 'react'
import cls from 'classnames'
import ls from 'local-storage'
import LoginForm from './Login'
import OnlineList from './OnlineList'
import Messager from './Messager'


export default class Chat extends React.Component {

    constructor () {
        super()
        this.state = {
            loading: false,
            username: null,
            loginError: null,
            online: null,
            messages: []
        }
    }

    componentWillMount () {
        let auth = ls('auth')
        if (auth) {
            this.setState({ loading: true })
            this.props.conn.emit('login', JSON.parse(auth))
        }

        this.props.conn.on('login', payload => {
            let nextState = { loading: false }

            if (payload.result) {
                if (payload.username) {
                    ls('auth', JSON.stringify({ username: payload.username, password: payload.password }))
                } else {
                    ls('auth', null)
                }
                nextState.username = payload.username
                nextState.loginError = null
            } else {
                nextState.username = null
                nextState.loginError = payload.err
            }

            this.setState(nextState)
        })

        this.props.conn.on('online', payload => {
            this.setState({ online: payload })
        })

        this.props.conn.on('say', payload => {
            this.setState({ messages: this.state.messages.concat(payload.message) })
        })

        this.props.conn.on('history', payload => {
            this.setState({ 'messages': JSON.parse(payload) })
        })
    }

    render () {
        if (this.state.loading) {
            return (
                <div className='center-block loader'>
                    <div>Loading...</div>
                    <i className='glyphicon glyphicon-hourglass'></i>
                </div>
            )
        }
        return (
            <div className='center-block row'>
                <div className='col-md-10'>
                    {this._renderMainArea()}
                </div>
                <div className='col-md-2 well'>
                    {this._renderUsername()}
                    <OnlineList
                        online={this.state.online}
                    />
                </div>
            </div>
        )
    }

    _renderUsername () {
        return null
    }

    _renderMainArea () {
        return null
    }

}
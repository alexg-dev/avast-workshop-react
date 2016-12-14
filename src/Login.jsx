import React from 'react'


export default class Login extends React.Component {

    constructor () {
        super()
        this.state = {
            username: '',
            password: '',
            passwordRequired: false,
            error: null
        }
    }

    componentWillMount () {
        this.componentWillReceiveProps(this.props)
    }

    componentWillReceiveProps (nextProps) {
        let nextState = { error: null }
        switch (nextProps.error) {

            case 'USERNAME_REQUIRED':
                nextState.error = 'Username is not specified'
                break

            case 'PASSWORD_REQUIRED':
                nextState.passwordRequired = true
                nextState.error = 'Password required'
                break

            case 'WRONG_PASSWORD':
                nextState.error = 'Password is wrong'
                break

        }
        this.setState(nextState)
    }

    _onUsernameInput (e) {
        this.setState({ username: e.target.value, error: null })
    }

    _onPasswordInput (e) {
        this.setState({ password: e.target.value, error: null })
    }

    _onSubmit (e) {
        e.preventDefault()
        if (this.state.username.length > 2) {
            this.props.onChange(this.state.username, this.state.password)   
        } else {
            this.setState({ error: 'Username is too short' })
        }
    }

    render () {
        return (
            <form
                className='login-form center-block well'
                onSubmit={this._onSubmit.bind(this)}
            >

                {this._renderError()}

                <div className='form-group'>
                    {this._renderInput()}
                </div>

                <button
                    type='submit'
                    className='btn btn-default center-block'
                >Login</button>
            </form>
        )
    }

    _renderInput () {
        if (this.state.passwordRequired) {
            return (
                <input
                    type='password'
                    className='form-control'
                    placeholder='Password'
                    value={this.state.password}
                    onChange={this._onPasswordInput.bind(this)}
                />
            )
        }
        return (
            <input
                type='text'
                className='form-control'
                placeholder='Username'
                value={this.state.username}
                onChange={this._onUsernameInput.bind(this)}
            />
        )
    }

    _renderError () {
        if (this.state.error) {
            return (
                <p className='alert alert-danger'>{this.state.error}</p>
            )
        }
        return null
    }

}
import React, { Component } from 'react';
import Message from './components/Message.js';
import io from 'socket.io-client';
import './index.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
        };
    }

    componentDidMount() {
        this.socket = io();
        this.socket.on('message', (message) => {
            this.setState({
                messages: this.state.messages.concat([
                    <Message
                        message={message}
                        key={this.state.messages.length}
                    ></Message>,
                ]),
            });
        });
    }

    onType(event) {
        if (event.which == 13) {
            this.socket.emit('message', event.target.value);
            event.target.value = '';
            return;
        }
    }

    render() {
        return (
            <div>
                <div className='messages'>{this.state.messages}</div>
                <div className='chat-box'>
                    <input
                        className='chat-input'
                        onKeyPress={this.onType.bind(this)}
                    ></input>
                </div>
            </div>
        );
    }
}

export default App;

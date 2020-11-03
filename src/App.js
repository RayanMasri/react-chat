import React, { Component } from 'react';
import Message from './components/Message.js';
import Field from './components/Field.js';
import io from 'socket.io-client';
import './index.css';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
        };
        // this.field = React.createRef();
    }

    componentDidMount() {
        // production
        this.socket = io();

        // this.socket = io('http://localhost:4001/');

        this.socket.on('message', (object) => {
            this.setState({
                messages: this.state.messages.concat([
                    <Message
                        message={object.message}
                        key={this.state.messages.length}
                        you={object.id == this.socket.id}
                        sender={object.sender}
                    ></Message>,
                ]),
            });
        });

        // event.target.getBoundingClientRect()
        // this.field.current.style.width = this.field.current.value.length + 'ch';
        // localStorage.getItem('user').length + 'ch';
    }

    onSendMessage(event) {
        event.preventDefault();

        this.socket.emit('message', {
            message: event.target['message-field'].value,
            id: this.socket.id,
            sender: 'master',
        });
        event.target['message-field'].value = '';
    }

    onChangeName(value) {
        localStorage.setItem('user', value);
    }

    render() {
        return (
            <div className='app'>
                <div className='chat-panel'>
                    <div className='messages'>{this.state.messages}</div>
                    <div className='chat-box'>
                        <form onSubmit={this.onSendMessage.bind(this)}>
                            <input
                                type='text'
                                className='message-field'
                                name='message-field'
                                autoComplete='off'
                                placeholder='Type a message'
                            />
                        </form>
                    </div>
                </div>
                {/* <div className='user-panel'>
                    <Field
                        onSubmit={this.onChangeName.bind(this)}
                        default={localStorage.getItem('user')}
                        name='name-field'
                        autosize
                    />
                </div> */}
            </div>
        );
    }
}

export default App;

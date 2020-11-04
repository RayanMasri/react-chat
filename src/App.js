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
            waiting: [],
        };
        // this.field = React.createRef();
    }

    componentDidMount() {
        this.socket = io();
        // this.socket = io('http://localhost:4001/');

        this.socket.on('message', (object) => {
            // fire received event for message
            if (object.object.id !== this.socket.id) {
                this.socket.emit('chat.received', object.id);
                if (document.hasFocus()) {
                    console.log('focused');
                    this.socket.emit('chat.read', object.id);
                } else {
                    this.setState({
                        messages: this.state.messages,
                        waiting: this.state.waiting.concat([object.id]),
                    });
                }
            }

            var reference = React.createRef();
            this.setState({
                messages: this.state.messages.concat([
                    {
                        element: (
                            <Message
                                message={object.object.message}
                                key={this.state.messages.length}
                                you={object.object.id === this.socket.id}
                                sender={object.object.sender}
                                ref={reference}
                                id={object.id}
                            ></Message>
                        ),
                        reference: reference,
                    },
                ]),
            });
        });

        this.socket.on('chat.received', (id) => {
            const message = this.state.messages.find(
                (message) => message.reference.current.props.id === id
            );

            if (message) {
                message.reference.current.receive();
            }
        });

        this.socket.on('chat.read', (id) => {
            const message = this.state.messages.find(
                (message) => message.reference.current.props.id === id
            );

            if (message) {
                message.reference.current.read();
            }
        });

        window.onfocus = () => {
            this.state.waiting.map((id) => {
                this.socket.emit('chat.read', id);
            });
            this.setState({
                messages: this.state.messages,
                waiting: [],
            });
        };
    }

    onSendMessage(event) {
        event.preventDefault();

        // fire sent event for message
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
                    <div className='messages'>
                        {this.state.messages.map((message) => message.element)}
                    </div>
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

import React, { Component } from 'react';
import Message from './components/Message.js';
import Field from './components/Field.js';
import io from 'socket.io-client';
import './index.css';
import data from 'emoji-mart/data/twitter.json';
import { NimblePicker } from 'emoji-mart';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            waiting: [],
            picking: false,
        };
        this.nameField = React.createRef();
        this.messages = React.createRef();
        this.emojiToggle = React.createRef();
        this.messageField = React.createRef();
        this.name = localStorage.getItem('user');
        // this.field = React.createRef();
    }

    componentDidMount() {
        this.socket = io();
        // this.socket = io('http://localhost:4001/');
        this.nameField.current.value = this.name;
        this.emojiToggle.current.addEventListener('click', () => {
            this.setState({
                messages: this.state.messages,
                waiting: this.state.waiting,
                picking: !this.state.picking,
            });
        });

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

            this.messages.current.scrollTop = this.messages.current.scrollHeight;
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
            sender: this.name,
        });
        event.target['message-field'].value = '';
    }

    onChangeName(event) {
        event.preventDefault();

        const value = event.target['name-field'].value;

        this.name = value;
        localStorage.setItem('user', value);
        // localStorage.setItem('user', value);
    }

    addEmoji(emoji) {
        this.messageField.current.value += `&#${emoji.unified};`;
    }

    render() {
        return (
            <div className='app'>
                <NimblePicker
                    set='twitter'
                    data={data}
                    onSelect={this.addEmoji.bind(this)}
                    style={{
                        display: this.state.picking ? 'block' : 'none',
                    }}
                ></NimblePicker>
                <div className='chat-panel'>
                    <div className='messages' ref={this.messages}>
                        {this.state.messages.map((message) => message.element)}
                    </div>
                    <div className='chat-box'>
                        <div ref={this.emojiToggle}>Emoji</div>
                        <form onSubmit={this.onSendMessage.bind(this)}>
                            <input
                                type='text'
                                className='message-field'
                                name='message-field'
                                ref={this.messageField}
                                autoComplete='off'
                                placeholder='Type a message'
                            />
                        </form>
                    </div>
                </div>
                <form onSubmit={this.onChangeName.bind(this)}>
                    <input
                        type='text'
                        name='name-field'
                        autoComplete='off'
                        ref={this.nameField}
                        placeholder='Change your name'
                    />
                </form>
            </div>
        );
    }
}

export default App;

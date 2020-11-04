import React, { Component } from 'react';
import sentSvg from '../assets/sent.svg';
import readSvg from '../assets/read.svg';
import receivedSvg from '../assets/received.svg';

class Message extends Component {
    constructor(props) {
        super(props);

        this.state = {
            icon: sentSvg,
        };
    }

    receive() {
        this.setState({
            icon: receivedSvg,
        });
    }

    read() {
        this.setState({
            icon: readSvg,
        });
    }

    now() {
        const date = new Date();
        return `${
            date.getHours() >= 12 ? date.getHours() - 12 : date.getHours()
        }:${date.getMinutes().toString().padStart(2, '0')} ${
            date.getHours() >= 12 ? 'PM' : 'AM'
        }`;
    }

    render() {
        return (
            <div className={this.props.you ? 'message you' : 'message'}>
                <div className='message-text'>
                    <div className='message-sender'>{this.props.sender}</div>
                    {this.props.message}
                    <div
                        className='message-info'
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginLeft: 'auto',
                        }}
                    >
                        <div
                            className='message-date'
                            style={{
                                marginRight: 3,
                            }}
                        >
                            {this.now()}
                        </div>
                        <img
                            src={this.state.icon}
                            style={{
                                width: 16,
                                height: 16,
                            }}
                        ></img>
                    </div>
                </div>
            </div>
        );
    }
}

export default Message;

import React, { Component } from 'react';

class Message extends Component {
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
                    <div className='message-date'>{this.now()}</div>
                </div>
                {/* <div className='message-info'> */}
                {/* </div> */}
            </div>
        );
    }
}

export default Message;

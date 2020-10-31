import React, { Component } from 'react';
import io from 'socket.io-client';
import './index.css';

class App extends Component {
    componentDidMount() {
        const socket = io();

        socket.on('connect', () => {
            console.log(socket.id);
        });
    }

    render() {
        return (
            <div className='app'>
                <div>hi</div>
            </div>
        );
    }
}

export default App;

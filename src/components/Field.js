import React from 'react';

class Field extends React.Component {
    constructor(props) {
        super(props);
        this.field = React.createRef();
        this.canvas = React.createRef();
    }

    componentDidMount() {
        this.context = this.canvas.current.getContext('2d');
        this.field.current.style.width =
            this.measureTextWidth(
                this.field.current.value,
                this.field.current.style.fontFamily,
                this.field.current.style.fontSize
            ) + 'px';
        // this.field.current.style.width = this.field.current.value.length + 'ch';
    }

    measureTextWidth(text, font, size) {
        this.context.font = `${font} ${size}`;
        return this.context.measureText(text).width;
    }

    onSubmit(event) {
        event.preventDefault();
        this.props.onSubmit(this.field.current.value);
    }

    onKeyDown(event) {
        // console.log(event.target.form);
        // event.preventDefault();
        // this.field.current.form.submit();
        // event.target.submit();

        if (!this.props.autosize) return;
        this.field.current.style.width =
            this.measureTextWidth(
                this.field.current.value,
                this.field.current.style.fontFamily,
                this.field.current.style.fontSize
            ) + 'px';
    }

    render() {
        return (
            <form onSubmit={this.onSubmit.bind(this)}>
                <input
                    type='text'
                    className={this.props.name}
                    name={this.props.name}
                    defaultValue={this.props.default}
                    ref={this.field}
                    onKeyDown={this.onKeyDown.bind(this)}
                    autoComplete='new-password'
                />
                <canvas className='field-canvas' ref={this.canvas}></canvas>
            </form>
        );
    }
}

export default Field;

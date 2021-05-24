import React, { Component } from 'react';
import ReactSlider from 'react-slider';
import styles from '../styles/Slider.module.scss'

export interface SliderProps {
    begin: number | number[];
    min: number;
    max: number;
    onUpdateSlider?: (val: number | number[]) => void;
    double?: boolean;
    suffix?: string;
}

export interface SliderState {
    value: number | number[];
}

class Slider extends React.Component<SliderProps, SliderState> {
    constructor(props: SliderProps) {
        super(props);
        this.state = { value: this.props.begin };
    }

    onUpdateSlider = (val: number | number[]) => {
        this.setState({
            value: val
        })
        if(this.props.onUpdateSlider != undefined)
            this.props.onUpdateSlider(val);
    }

    render() {
        return (<div className={styles.sliderContainer}>
            <div className={styles.sliderTextLeft}>{this.props.double? this.state.value[0] : this.state.value} {this.props.suffix}</div>
            <ReactSlider
                className={styles.slider}
                thumbClassName={styles.sliderThumb}
                trackClassName={styles.sliderTrack}
                defaultValue={this.props.begin}
                max={this.props.max}
                min={this.props.min}
                onChange={this.onUpdateSlider}
                ariaLabel={['Lower thumb', 'Upper thumb']}
                ariaValuetext={state => `Thumb value ${state.valueNow}`}
                renderTrack={(props) => {
                    if ((props.key as string).endsWith("-1") && this.props.double)
                        props.className += ' ' + styles.sliderTrackBetween
                    else if((props.key as string).endsWith("-0") && !this.props.double)
                        props.className += ' ' + styles.sliderTrackBetween
                    return (
                        <div {...props}></div>
                    )
                }}
                renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
                pearling
            />
            {this.props.double?  <div className={styles.sliderTextRight}>{this.state.value[1]} {this.props.suffix}</div> : <></>}
        </div>);
    }
}

export default Slider;
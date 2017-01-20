// @flow
import React from 'react';
import { connect } from 'react-redux';

import { createCompetition, deleteCompetition, setCurrentCompetition } from 'actions/config';
import { shuffle } from 'utils/';
import cx from 'styles/landing/FancyBackground';
import background0 from 'assets/images/backgrounds/dancers_pixel_0.jpg';
import background1 from 'assets/images/backgrounds/dancers_pixel_1.jpg';
import background2 from 'assets/images/backgrounds/dancers_pixel_2.jpg';
import background3 from 'assets/images/backgrounds/dancers_pixel_3.jpg';
import background4 from 'assets/images/backgrounds/dancers_pixel_4.jpg';
import background5 from 'assets/images/backgrounds/dancers_pixel_5.jpg';

import type { Id, ById, Competition } from 'types/state';

const backgrounds = shuffle([
  background0,
  background1,
  background2,
  background3,
  background4,
  background5,
]);

class Background extends React.Component {
  props :{
    width :number,
    period :number,
    children :React.Children,
  };
  state :{
    backgroundIndex :number,
  } = {
    backgroundIndex: 0,
  }

  render() {
    const backgroundImageStyle = {
      backgroundImage: `url(${backgrounds[this.state.backgroundIndex]})`,
    };

    return (
      <div className={cx('root')}>
        <div
          className={cx('clear-background')}
          style={backgroundImageStyle}
        />
        <div
          className={cx('blurred-background-container')}
          style={{maxWidth: `${this.props.width}px`}}
        >
          <div
            className={cx('blurred-background')}
            style={backgroundImageStyle}
          />
        </div>
        <div
          className={cx('content-container')}
        >
          <div
            className={cx('content')}
            style={{maxWidth: `${this.props.width}px`}}
          >
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }

  _backgroundTimeoutId = null;
  _timeoutCallback = () => {
    this.setState({
      backgroundIndex: (this.state.backgroundIndex + 1) % backgrounds.length
    }, () => {
      this._startBackgroundTimeout();
    });
  };
  _startBackgroundTimeout = () => {
    this._clearTimeout();
    this._backgroundTimeoutId = window.setTimeout(
      this._timeoutCallback,
      this.props.period
    );
  };
  _clearTimeout = () => {
    window.clearTimeout(this._backgroundTimeoutId);
  };
  componentDidUpdate() {
    this._startBackgroundTimeout();
  }
  componentDidMount() {
    this._startBackgroundTimeout();
  }
  componentWillUnmount() {
    this._clearTimeout();
  }
}

export default connect(
  function mapStateToProps(state) {
    return {
      competitions: state.competitions,
    };
  },
  function mapDispatchToProps(dispatch) {
    return {
      createCompetition: () => {
        const createCompetitionAction = createCompetition();
        dispatch(createCompetitionAction);
        dispatch(setCurrentCompetition(createCompetitionAction.id));
      },
      setCurrentCompetition: (id) => dispatch(setCurrentCompetition(id)),
      deleteCompetition: (id) => dispatch(deleteCompetition(id)),
    }
  }
)(Background);

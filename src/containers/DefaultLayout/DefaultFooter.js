import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment'

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class DefaultFooter extends Component {
  render() {

    // eslint-disable-next-line
    const { children, ...attributes } = this.props;

    return (
      <React.Fragment>
        <span> &copy; {moment().format('YYYY')} <a href="https://portadoor.com">Porta Door Co. Inc.</a></span>
        <span className="ml-auto">Developed by <a href="https://thinkthoughtmedia.com" target="_blank" rel="noopener noreferrer">Think Thought Media LLC.</a></span>
      </React.Fragment>
    );
  }
}

DefaultFooter.propTypes = propTypes;
DefaultFooter.defaultProps = defaultProps;

export default DefaultFooter;

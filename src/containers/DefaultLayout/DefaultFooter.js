import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import axios from 'axios';


const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class DefaultFooter extends Component {

  state = {
    last_updated: ''
  }

  componentDidMount(){
    axios
      .get('https://api.github.com/repos/PortaDoorCo/Office-Dashboard/branches/master')
      .then(response => {
        this.setState({ last_updated: response?.data?.commit?.commit?.committer?.date});
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  render() {

    // eslint-disable-next-line
    const { children, ...attributes } = this.props;
    const { last_updated } = this.state;

    return (
      <React.Fragment>
        <span> &copy; {moment().format('YYYY')} <a href="https://portadoor.com">Porta Door Co. Inc.</a> - Version: {moment(last_updated).format('YY.M.D.hhmm')}</span>
        <span className="ml-auto">Developed by <a href="https://thinkthoughtmedia.com" target="_blank" rel="noopener noreferrer">Think Thought Media LLC.</a></span>
      </React.Fragment>
    );
  }
}

DefaultFooter.propTypes = propTypes;
DefaultFooter.defaultProps = defaultProps;

export default DefaultFooter;

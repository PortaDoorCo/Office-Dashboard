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
    repoInfo: []
  }

  componentDidMount(){
    axios
      .get('https://api.github.com/orgs/portadoorco/repos')
      .then(response => {
        this.setState({ repoInfo: response.data });
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  render() {

    // eslint-disable-next-line
    const { children, ...attributes } = this.props;
    const { repoInfo } = this.state;

    console.log({repo: this.state.repoInfo});

    return (
      <React.Fragment>
        <span> &copy; {moment().format('YYYY')} <a href="https://portadoor.com">Porta Door Co. Inc.</a> - Last Updated: {moment(repoInfo[0]?.pushed_at).format('ddd MMM D YYYY h:mm a')}</span>
        <span className="ml-auto">Developed by <a href="https://thinkthoughtmedia.com" target="_blank" rel="noopener noreferrer">Think Thought Media LLC.</a></span>
      </React.Fragment>
    );
  }
}

DefaultFooter.propTypes = propTypes;
DefaultFooter.defaultProps = defaultProps;

export default DefaultFooter;

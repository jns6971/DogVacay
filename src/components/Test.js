import React, { Component } from 'react';
import shallowCompare from 'react-addons-shallow-compare';

class Test extends Component {

  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);
  }

  getPluraizedFormat() {
    const { value, one } = this.props;
    const defaultMessage = this.props.default;

    let message = defaultMessage || '';

    if (value === 1) {
      message = one;
    }

    return message;
  }

  render() {
    const formattedPlural = this.getPluraizedFormat();
    return (
      <span>
        {formattedPlural}
      </span>
    );
  }
}

Test.propTypes = {
  value: React.PropTypes.number.isRequired,
  one: React.PropTypes.string,
  default: React.PropTypes.string.isRequired,
};

export default Test;

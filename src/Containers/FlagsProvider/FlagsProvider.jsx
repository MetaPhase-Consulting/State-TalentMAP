import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FlagsProvider } from 'flag';
// eslint-disable-next-line
class Flags extends Component {
  render() {
    const { children, flags } = this.props;
    return (
      <FlagsProvider flags={flags}>
        {children}
      </FlagsProvider>
    );
  }
}

Flags.propTypes = {
  children: PropTypes.node.isRequired,
  flags: PropTypes.shape({}),
};

Flags.defaultProps = {
  children: false,
  flags: {},
};

export default Flags;

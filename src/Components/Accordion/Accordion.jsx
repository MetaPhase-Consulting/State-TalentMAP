import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import { EMPTY_FUNCTION } from '../../Constants/PropTypes';


// use role="tablist" for use with aria-multiselectable
// https://www.w3.org/TR/wai-aria-1.1/#aria-multiselectable
class Accordion extends Component {
  constructor(props) {
    super(props);
    this.BBB = this.BBB.bind(this);
    this.state = {
      expandAll: false,
      acItems: {
      },
    };
  }

  BBB(acID, acState) {
    console.log('in BBB()');
    console.log(acID);
    console.log(acState);
    const { acItems } = this.state;
    acItems[acID] = acState;
    this.setState({ acItems });
    const accStates = Object.values(this.state.acItems);
    const isAllFalse = a => a === false;
    const isAllTrue = a => a === true;

    const numChildren = React.Children.count(this.props.children);

    if (accStates.every(isAllFalse) && accStates.length === numChildren) {
      // want to call updateFromAcc in BidderPortfolioGridList
      // this.props.updateFromAcc(true);
      this.setState({ expandAll: true });
    } else if (accStates.every(isAllTrue) && accStates.length === numChildren) {
      // want to call updateFromAcc in BidderPortfolioGridList
      // this.props.updateFromAcc(false);
      this.setState({ expandAll: false });
    }
  }

  toggle() {
    /*
    * DONE: Call function toggle(), in Accordion, from the button on the same
    *       level as accordion component.
    * DONE: In toggle() update the state of the expandAll var
    * DONE: Send a prop with expandAll value to children. line75
    * KINDA: In Children, when expandAll sent, call a function shouldComponentUpdate()
    * KINDA: In children, if expandAll is different than expanded,
    *     update expanded. shouldComponentUpdate()
    * DONE: In children, every time expanded state changes [myAccordion()], send state
    *  to a function in Accordion. This function will check if all the
    *  children are the same state. BBB()
    * DONE: expandAll will ONLY ever update if ALL of the children have the same expanded state AND
    *  that state is opposite current expandAll. BBB()
    *
    * While expanded gets resolved, myFakeExpanded is proxying
    *
    * DONE: When expandAll updates, children get notified
    * DO: When expandAll updates, bidderPortfoliGridList needs new state. updateFromAcc()
    * */
    this.setState({ expandAll: !this.state.expandAll });
    return !this.state.expandAll;
  }

  render() {
    // eslint-disable-next-line no-unused-vars
    const { children, isMultiselectable, className } = this.props;
    const childrenWithExtraProp = React.Children.map(this.props.children, child =>
        React.cloneElement(child, {
          expandAll: this.state.expandAll,
          BBB: this.BBB,
        }));

    return (
      <div>
        <div>
          expandAll: {this.state.expandAll.toString()}
        </div>
        <ul role="tablist" className={`usa-accordion ${className}`} aria-multiselectable={isMultiselectable}>
          {childrenWithExtraProp}
        </ul>
      </div>
    );
  }
}

Accordion.propTypes = {
  children: PropTypes.node.isRequired,
  isMultiselectable: PropTypes.bool,
  className: PropTypes.string,
  // updateFromAcc: PropTypes.func,
};

Accordion.defaultProps = {
  isMultiselectable: false,
  className: '',
  // updateFromAcc: EMPTY_FUNCTION,
};

export default Accordion;

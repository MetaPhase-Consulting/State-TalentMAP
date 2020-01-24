import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isEqual } from 'lodash';
import { EMPTY_FUNCTION } from '../../../Constants/PropTypes';
import { formatIdSpacing } from '../../../utilities';

class AccordionItem extends Component {
  constructor(props) {
    super(props);
    this.myAccordion = this.myAccordion.bind(this);
    this.state = {
      // expandAll: this.props.expandAll,
      myFakeExpanded: false,
    };
  }

  shouldComponentUpdate(nextProps) {
    console.log('in shouldComponentUpdate');
    // when expanded prop, updates
    // it doesnt re-render component, so
    // this.props and next props still remain equal
    console.log(!isEqual(this.props, nextProps));
    // return !isEqual(this.props.expanded, nextProps.expandAll);
    // if !isEqual, update expanded
    // forcing until can read expanded changes
    return true;
  }

  myAccordion() {
    // console.log(this.props.expanded); // this never updates!
    const temp = !this.state.myFakeExpanded;
    this.setState({ myFakeExpanded: temp });
    this.props.BBB(this.props.id, temp);
    return (this.props.expanded || !this.props.title ? '' : this.props.title);
  }

  render() {
    const { id, title, expanded, children, className, useIdClass,
      buttonClass, childClass, preContent, expandAll } = this.props;
    const formattedId = formatIdSpacing(id);
    const idClass = useIdClass ? `accordion-${(formattedId || 'accordion').toLowerCase()}` : '';
    return (
      <li className={className}>
        {preContent}
        <button
          id={`${id}-button`}
          className={`usa-accordion-button ${buttonClass} ${preContent ? 'has-pre-content' : ''}`}
          aria-expanded={expanded}
          aria-controls={formattedId}
          onClick={() => this.myAccordion()}
        >
          <div className="accordion-item-title">{title} {expanded.toString()}
            myFakeExpanded: {this.state.myFakeExpanded.toString()}</div>
        </button>
        <div id={formattedId} className={`usa-accordion-content ${childClass} ${idClass}`} aria-hidden={!expanded}>
          {children}
        </div>
      </li>
    );
  }
}

AccordionItem.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string,
  expanded: PropTypes.bool,
  BBB: PropTypes.func,
  children: PropTypes.node,
  className: PropTypes.string,
  useIdClass: PropTypes.bool,
  buttonClass: PropTypes.string,
  childClass: PropTypes.string,
  preContent: PropTypes.node,
  expandAll: PropTypes.bool,
};

AccordionItem.defaultProps = {
  title: '',
  BBB: EMPTY_FUNCTION,
  expanded: false,
  children: null,
  className: '',
  useIdClass: true,
  buttonClass: '',
  childClass: '',
  preContent: undefined,
  expandAll: true,
};

export default AccordionItem;

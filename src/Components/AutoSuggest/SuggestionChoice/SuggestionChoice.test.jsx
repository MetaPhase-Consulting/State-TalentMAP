import React from 'react';
// import { render } from '@testing-library/react';
import ReactDOM from 'react-dom';

import SuggestionChoice from './SuggestionChoice';

test('renders', () => {
  const suggestion = {
    short_name: 'name',
    code: 'code',
  };
  ReactDOM.render(<SuggestionChoice suggestion={suggestion} />);
});
/*
import { shallow } from 'enzyme';
import React from 'react';
import toJSON from 'enzyme-to-json';
import SuggestionChoice from './SuggestionChoice';

describe('SuggestionChoiceComponent', () => {
  const suggestion = {
    short_name: 'name',
    code: 'code',
  };
  it('is defined', () => {
    const wrapper = shallow(
      <SuggestionChoice
        suggestion={suggestion}
      />,
    );
    expect(wrapper).toBeDefined();
  });

  it('matches snapshot', () => {
    const wrapper = shallow(
      <SuggestionChoice
        suggestion={suggestion}
      />,
    );
    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
*/

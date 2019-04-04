import { shallow } from 'enzyme';
import React from 'react';
import { createBrowserHistory } from 'history';
import { PageMetaContainer } from './PageMetaContainer';

const history = createBrowserHistory();

describe('PageMetaContainer', () => {
  it('is defined', () => {
    const wrapper = shallow(
      <PageMetaContainer history={history} />,
    );
    expect(wrapper).toBeDefined();
  });
});

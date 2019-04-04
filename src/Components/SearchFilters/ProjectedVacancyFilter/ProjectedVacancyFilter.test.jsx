import { shallow } from 'enzyme';
import React from 'react';
import ProjectedVacancyFilter from './ProjectedVacancyFilter';

describe('ProjectedVacancyFilter', () => {
  it('is defined', () => {
    const wrapper = shallow(
      <ProjectedVacancyFilter />,
    );
    expect(wrapper).toBeDefined();
  });
});

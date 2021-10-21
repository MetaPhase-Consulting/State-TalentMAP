import { shallow } from 'enzyme';
import CriticalNeed from './CriticalNeed';
import toJSON from 'enzyme-to-json';

describe('CriticalNeedComponent', () => {
  it('is defined', () => {
    const wrapper = shallow(<CriticalNeed shortName />);
    expect(wrapper).toBeDefined();
  });

  it('matches snapshot', () => {
    const wrapper = shallow(<CriticalNeed />);
    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});

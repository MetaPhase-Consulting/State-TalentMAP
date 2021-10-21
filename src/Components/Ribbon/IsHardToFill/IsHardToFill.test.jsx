import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import IsHardToFill from './IsHardToFill';

describe('IsHardToFillComponent', () => {
  it('is defined', () => {
    const wrapper = shallow(<IsHardToFill shortName />);

    expect(wrapper).toBeDefined();
  });

  it('matches snapshot', () => {
    const wrapper = shallow(<IsHardToFill />);
    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});

import { shallow } from 'enzyme';
import IsHardToFill from './IsHardToFill';
import toJSON from 'enzyme-to-json';

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

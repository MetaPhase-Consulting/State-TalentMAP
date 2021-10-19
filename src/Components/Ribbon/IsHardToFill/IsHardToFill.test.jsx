import { shallow } from 'enzyme';
import IsHardToFill from './IsHardToFill';

describe('IsHardToFillComponent', () => {
  it('is defined', () => {
    const wrapper = shallow(<IsHardToFill />);

    expect(wrapper).toBeDefined();
  });
});

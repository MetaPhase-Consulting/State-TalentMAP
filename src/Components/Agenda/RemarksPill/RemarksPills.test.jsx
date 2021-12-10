import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import RemarksPill from './RemarksPill';

describe('RemarksPill', () => {
  it('is defined', () => {
    const wrapper = shallow(<RemarksPill />);
    expect(wrapper).toBeDefined();
  });

  it('matches snapshot', () => {
    const wrapper = shallow(<RemarksPill />);
    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});

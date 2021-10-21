import { shallow } from 'enzyme';
import HistDiffToStaff from './HistDiffToStaff';
import toJSON from 'enzyme-to-json';

describe('HistDiffToStaffComponent', () => {
  it('is defined', () => {
    const wrapper = shallow(<HistDiffToStaff shortName />);
    expect(wrapper).toBeDefined();
  });

   it('matches snapshot', () => {
    const wrapper = shallow(<HistDiffToStaff />);
    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});

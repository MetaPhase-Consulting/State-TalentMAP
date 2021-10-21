import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import ServiceNeedDifferential from './ServiceNeedDifferential';


describe('ServiceNeedDifferentialComponent', () => {
  it('is defined', () => {
    const wrapper = shallow(<ServiceNeedDifferential shortName />);
    expect(wrapper).toBeDefined();
  });

  it('matches snapshot', () => {
    const wrapper = shallow(<ServiceNeedDifferential />);
    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});

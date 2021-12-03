import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import EmployeeAgendaSearchCards from './EmployeeAgendaSearchCards';

describe('EmployeeAgendaSearchCards', () => {
  it('is defined', () => {
    const wrapper = shallow(<EmployeeAgendaSearchCards />);
    expect(wrapper).toBeDefined();
  });

  it('matches snapshot', () => {
    const wrapper = shallow(<EmployeeAgendaSearchCards />);
    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});

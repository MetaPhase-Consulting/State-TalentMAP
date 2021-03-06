import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import ExternalUserStatus from './ExternalUserStatus';

describe('ExternalUserStatusComponent', () => {
  const props = {
    type: 'cdo',
    initials: 'JD',
    firstName: 'John',
    lastName: 'Doe',
  };

  it('is defined', () => {
    const wrapper = shallow(<ExternalUserStatus {...props} />);
    expect(wrapper).toBeDefined();
  });

  it('matches snapshot', () => {
    const wrapper = shallow(<ExternalUserStatus {...props} />);
    expect(toJSON(wrapper)).toMatchSnapshot();
  });

  it('matches snapshot when showMail is true', () => {
    const wrapper = shallow(<ExternalUserStatus {...props} showMail />);
    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});

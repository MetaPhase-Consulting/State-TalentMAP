import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import SuggestionChoicePost from './SuggestionChoicePost';
import resultsObject from '../../../__mocks__/resultsObject';

describe('SuggestionChoicePostComponent', () => {
  const suggestion = resultsObject.results[0].position.post;
  it('is defined', () => {
    const wrapper = shallow(<SuggestionChoicePost suggestion={suggestion} />);
    expect(wrapper).toBeDefined();
  });

  it('matches snapshot', () => {
    const wrapper = shallow(<SuggestionChoicePost suggestion={suggestion} />);
    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});

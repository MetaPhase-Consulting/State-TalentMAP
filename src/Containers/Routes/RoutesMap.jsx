import Home from '../Home/Home';
import Profile from '../Profile';
import Results from '../Results/Results';
import Position from '../Position';
import Login from '../../login';
import Logout from '../../login/Components/Logout';
import LoginRedirect from '../LoginRedirect';
import Compare from '../Compare/Compare';
import About from '../About';
import RoutesArray from '../../routes';
import TokenValidation from '../../login/Components/TokenValidation';
import Faq from '../../Components/Faq';

const Components = {
  Home,
  Profile,
  Results,
  Position,
  Login,
  Logout,
  LoginRedirect,
  About,
  Compare,
  TokenValidation,
  Faq,
};

const mappedRoutesArray = RoutesArray.map((Route) => {
  const Component = Components[Route.componentName];
  const props$ = Route.props || {};
  return {
    ...Route,
    component: (props) => <Component {...props} {...props$} />,
  };
});

export default mappedRoutesArray;

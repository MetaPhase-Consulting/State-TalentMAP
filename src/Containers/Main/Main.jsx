import React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { Switch } from 'react-router-dom';
import { ScrollContext } from 'react-router-scroll-4';
import Routes from '../../Containers/Routes/Routes';
import FlagsProvider from '../FlagsProvider';
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';
import Glossary from '../../Containers/Glossary';
import AuthorizedWrapper from '../../Containers/AuthorizedWrapper';
import checkIndexAuthentication from '../../lib/check-auth';
import { store, history } from '../../store';
import PageMeta from '../../Containers/PageMeta';
import Toast from '../Toast';

const isAuthorized = () => checkIndexAuthentication(store);

const Main = props => (
  <Provider store={store} history={history}>
    <ConnectedRouter history={history}>
      <div>
        <Switch {...props}>
          <Routes {...props} isAuthorized={isAuthorized} type="auth" />
        </Switch>
        <ScrollContext>
          <FlagsProvider isAuthorized={isAuthorized}>
            <div>
              <PageMeta history={history} />
              <Header {...props} isAuthorized={isAuthorized} />
              <main id="main-content">
                <Routes {...props} isAuthorized={isAuthorized} typeIsNot type="auth" />
              </main>
              <Footer />
              <AuthorizedWrapper {...props} isAuthorized={isAuthorized}>
                <Glossary />
              </AuthorizedWrapper>
              <Toast />
            </div>
          </FlagsProvider>
        </ScrollContext>
      </div>
    </ConnectedRouter>
  </Provider>
  );

export default Main;

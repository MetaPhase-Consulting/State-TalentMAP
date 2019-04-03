import React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { ScrollContext } from 'react-router-scroll-4';
import { FlagsProvider } from 'flag';
import Routes from '../../Containers/Routes/Routes';
import Header from '../../Components/Header/Header';
import Footer from '../../Components/Footer/Footer';
import Glossary from '../../Containers/Glossary';
import AuthorizedWrapper from '../../Containers/AuthorizedWrapper';
import checkIndexAuthentication from '../../lib/check-auth';
import { store, history } from '../../store';
import PageMeta from '../../Containers/PageMeta';
import Toast from '../Toast';
import getFlags from '../../flags';

const isAuthorized = () => checkIndexAuthentication(store);

const flags = () => getFlags();

const Main = props => (
  <FlagsProvider flags={flags()}>
    <Provider store={store} history={history}>
      <ConnectedRouter history={history}>
        <ScrollContext>
          <div>
            <PageMeta history={history} />
            <Header {...props} isAuthorized={isAuthorized} />
            <main id="main-content">
              <Routes {...props} isAuthorized={isAuthorized} />
            </main>
            <Footer />
            <AuthorizedWrapper {...props} isAuthorized={isAuthorized}>
              <Glossary />
            </AuthorizedWrapper>
            <Toast />
          </div>
        </ScrollContext>
      </ConnectedRouter>
    </Provider>
  </FlagsProvider>
);

export default Main;

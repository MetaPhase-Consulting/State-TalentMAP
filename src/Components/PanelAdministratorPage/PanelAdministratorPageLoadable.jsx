import createLoader from '../Loadable';

export const path = () => import('./PanelAdministratorPage');

const PanelAdministratorPage = createLoader({ path, shouldPreload: false });

const PanelAdministratorPageLoadable = ({ ...rest }) => (
  <PanelAdministratorPage {...rest} />
);

export default PanelAdministratorPageLoadable;

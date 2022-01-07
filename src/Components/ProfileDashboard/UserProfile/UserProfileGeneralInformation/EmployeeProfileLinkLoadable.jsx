import createLoader from '../../../Loadable';

export const path = () => import('./EmployeeProfileLink');

const PostPage = createLoader({ path, shouldPreload: false, usePlaceholder: false });

const EPLLoadable = ({ ...rest }) => (
  <PostPage {...rest} />
);

export default EPLLoadable;

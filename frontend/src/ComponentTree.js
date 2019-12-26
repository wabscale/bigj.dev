import FileContent from './File/FileGrid';
import LoginContent from './Login/LoginContent';
import Upload from "./Upload/Upload";
import Settings from "./Settings/Settings";
import Logout from "./Login/Logout";


/**
 * This is where you can define new components in
 * the navigation tree. It is primarily used in
 * ./Paperbase.js for creating the react router dom.
 * Other files can freely import this to read the
 * router dom state.
 *
 * view:      name of the view
 * path:      react router path for element
 * component: react class or function to render
 * auth:      true if component should require authentication
 * options:   extra attributes to add to component when rendered
 */
export default [
  {
    view: 'Sign In',
    path: '/signin',
    component: LoginContent,
    auth: false,
    options: {}
  },
  {
    view: 'Sign Out',
    path: '/signout',
    component: Logout,
    auth: false,
    options: {}
  },
  {
    view: 'Upload',
    path: '/upload',
    component: Upload,
    auth: true,
    options: {}
  },
  {
    view: 'Settings',
    path: '/settings',
    component: Settings,
    auth: true,
    options: {}
  },
  {
    view: 'View',
    path: '/view',
    component: FileContent,
    auth: true,
    options: {
      displayCount: 9
    }
  },
];
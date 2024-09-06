import { merge } from 'lodash';
import queryString from 'query-string';
import { checkFlag } from '../flags';

/**
 * Interface for Profile Menu Configuration

 * @interface MenuItem
 *  interface MenuConfig {
 *    text: string;
 *    icon?: string;
 *    route?: string;
 *    params?: { [key: string]: string; };
 *    toggleMenuSection?: boolean;
 *    expandedSection?: boolean;
 *    roles?: Array<string>;
 *    isGlossaryEditor?: boolean;
 *    children?: Array<MenuItem>;
 *  }
 */
function MenuConfig(config) {
  return config.map((item) => {
    const item$ = merge({
      toggleMenuSection: false,
      expandedSection: false,
      roles: [],
      isGlossaryEditor: false,
    }, item);

    if (item$.params) {
      item$.params = `?${queryString.stringify(item$.params)}`;
    }

    if (item$.children) {
      item$.children = MenuConfig(item$.children);
    }
    return item$;
  });
}

// this is a function so that flags aren't checked until render
export const GET_PROFILE_MENU = () => MenuConfig([
  {
    text: 'Profile',
    icon: 'user',
    toggleMenuSection: true,
    expandedSection: true,
    children: [
      {
        text: 'Dashboard',
        route: '/profile/dashboard',
        icon: 'tachometer',
      },
      {
        text: 'Notifications',
        route: '/profile/notifications',
        icon: 'globe',
      },
      {
        text: 'Favorites',
        route: '/profile/favorites/',
        icon: 'star',
      },
      {
        text: 'Saved Searches',
        route: '/profile/searches/',
        icon: 'clock-o',
      },
      {
        text: 'Bid Tracker',
        route: '/profile/bidtracker/',
        icon: 'clipboard',
        roles: [
          'bidder',
        ],
      },
      checkFlag('flags.settings') ?
        {
          text: 'Settings',
          route: '/profile/settings/',
          icon: 'cogs',
        } : null,
      checkFlag('flags.bidding_tool') ?
        {
          text: 'Bidding Tool',
          route: '/profile/biddingtool/',
          icon: 'cog',
          roles: [
            'superuser',
            'post_user',
            'ao_user',
            'bureau_user',
            'cdo',
          ],
        } : null,
    ],
  },
  checkFlag('flags.fsbid_admin') ?
    {
      text: 'FSBid Admin',
      icon: 'sitemap',
      toggleMenuSection: true,
      expandedSection: true,
      roles: [
        'superuser',
        'fsbid_admin',
      ],
      children: [
        {
          text: 'Panel',
          route: '/profile/fsbid_admin/',
          icon: 'calendar',
          roles: [
            'superuser',
            'fsbid_admin',
          ],
        },
      ],
    } : null,
  {
    text: 'TalentMAP Admin',
    icon: 'sitemap',
    toggleMenuSection: true,
    expandedSection: true,
    roles: [
      'superuser',
      'glossary_editors',
    ],
    children: [
      {
        text: 'Dashboard',
        route: '/profile/administrator/dashboard/',
        icon: 'tachometer',
        roles: [
          'superuser',
        ],
      },
      {
        text: 'Logs',
        route: '/profile/administrator/logs/',
        icon: 'sitemap',
        roles: [
          'superuser',
        ],
      },
      {
        text: 'Statistics',
        route: '/profile/administrator/stats/',
        icon: 'bar-chart',
        roles: [
          'superuser',
        ],
      },
      {
        text: 'User Roles',
        route: '/profile/administrator/userroles/',
        icon: 'users',
        roles: [
          'superuser',
        ],
      },
      {
        text: 'Feature Flags',
        route: '/profile/administrator/featureflags/',
        icon: 'flag',
        roles: [
          'superuser',
        ],
      },
      {
        text: 'Bid Cycles',
        route: '/profile/administrator/cycles/',
        icon: 'hourglass-start',
        roles: [
          'superuser',
          'bidcycle_admin',
        ],
      },
      {
        text: 'Glossary Editor',
        route: '/profile/glossaryeditor/',
        icon: 'book',
        roles: [
          'glossary_editors',
        ],
      },
      checkFlag('flags.bid_audit') ?
        {
          text: 'Bid Audit',
          route: '/profile/administrator/bidaudit/',
          icon: 'users',
          roles: [
            'superuser',
          ],
        } : null,
      checkFlag('flags.bureau_exceptions') ?
        {
          text: 'Bureau Exceptions',
          route: '/profile/administrator/bureauexceptions/',
          icon: 'users',
          roles: [
            'superuser',
          ],
        } : null,
      checkFlag('flags.cycle_job_categories') ?
        {
          text: 'Cycle Job Categories',
          route: '/profile/administrator/cyclejobcategories/',
          icon: 'cogs',
          roles: [
            'superuser',
          ],
        } : null,
      checkFlag('flags.org_stats') ?
        {
          text: 'Org Stats',
          route: '/profile/administrator/orgstats/',
          icon: 'building',
          roles: [
            'superuser',
          ],
        } : null,
      checkFlag('flags.cycle_management') ?
        {
          text: 'Cycle Management',
          route: '/profile/administrator/cyclemanagement',
          icon: 'database',
          roles: [
            'superuser',
            'fsbid_admin',
          ],
        } : null,
      checkFlag('flags.manage_entry_level') ?
        {
          text: 'Manage Entry Level',
          route: '/profile/administrator/manageentrylevel/',
          icon: ' fa-keyboard-o',
          roles: [
            'superuser',
          ],
        } : null,
      checkFlag('flags.bid_season_management') ?
        {
          text: 'Bid Season Management',
          route: '/profile/administrator/managebidseasons/',
          icon: 'calendar',
          roles: [
            'superuser',
          ],
        } : null,
      checkFlag('flags.panel_admin') ?
        {
          text: 'Panel',
          route: '/profile/administrator/panel/',
          icon: 'calendar',
          roles: [
            'superuser',
          ],
        } : null,
      checkFlag('flags.job_categories') ?
        {
          text: 'Job Categories',
          route: '/profile/administrator/jobcategories/',
          icon: 'cogs',
          roles: [
            'superuser',
          ],
        } : null,
      checkFlag('flags.bidding_tool') ?
        {
          text: 'Bidding Tool',
          route: '/profile/administrator/biddingtool/',
          icon: 'cog',
          roles: [
            'superuser',
          ],
        } : null,
    ],
  },
  {
    text: 'Bureau',
    icon: 'building',
    toggleMenuSection: true,
    expandedSection: true,
    roles: [
      'superuser',
      'bureau_user',
    ],
    children: [
      {
        text: 'Position Management',
        route: '/profile/bureau/positionmanager',
        icon: 'map',
        roles: [
          'superuser',
          'bureau_user',
        ],
      },
      {
        text: 'Available Bidders',
        route: '/profile/bureau/availablebidders',
        icon: 'users',
        roles: [
          'superuser',
          'bureau_user',
        ],
      },
      checkFlag('flags.projected_vacancy') ?
        {
          text: 'Projected Vacancy Management',
          route: '/profile/bureau/projectedvacancy',
          icon: ' fa-keyboard-o',
          roles: [
            'superuser',
            'bureau_user',
          ],
        } : null,
      checkFlag('flags.manage_post_access') ?
        {
          text: 'Manage Post Access',
          route: '/profile/bureau/managepostaccess',
          icon: 'building',
          roles: [
            'superuser',
            'bureau_user',
          ],
        } : null,
      checkFlag('flags.publishable_positions') ?
        {
          text: 'Publishable Positions',
          route: '/profile/bureau/publishablepositions',
          icon: ' fa-newspaper-o',
          roles: [
            'superuser',
            'bureau_user',
          ],
        } : null,
      checkFlag('flags.search_post_access') ?
        {
          text: 'Search Post Access',
          route: '/profile/bureau/searchpostaccess',
          icon: ' fa-search-minus',
          roles: [
            'superuser',
            'bureau_user',
          ],
        } : null,
      checkFlag('flags.bidding_tool') ?
        {
          text: 'Bidding Tool',
          route: '/profile/bureau/biddingtool/',
          icon: 'cog',
          roles: [
            'superuser',
            'bureau_user',
          ],
        } : null,
    ],
  },
  {
    text: 'Post',
    icon: 'building',
    toggleMenuSection: true,
    expandedSection: true,
    roles: [
      'superuser',
      'post_user',
    ],
    children: [
      {
        text: 'Position Management',
        route: '/profile/post/positionmanager',
        icon: 'map',
        roles: [
          'superuser',
          'post_user',
        ],
      },
      {
        text: 'Available Bidders',
        route: '/profile/post/availablebidders',
        icon: 'users',
        roles: [
          'superuser',
          'post_user',
        ],
      },
      checkFlag('flags.publishable_positions') ?
        {
          text: 'Publishable Positions',
          route: '/profile/post/publishablepositions',
          icon: ' fa-newspaper-o',
          roles: [
            'superuser',
            'post_user',
          ],
        } : null,
      checkFlag('flags.bidding_tool') ?
        {
          text: 'Bidding Tool',
          route: '/profile/post/biddingtool/',
          icon: 'cog',
          roles: [
            'superuser',
            'post_user',
          ],
        } : null,
    ],
  },
  checkFlag('flags.panel_admin_menu') ?
    {
      text: 'Panel Administrator',
      icon: 'sitemap',
      toggleMenuSection: true,
      expandedSection: true,
      roles: [
        'superuser',
        'panel_admin',
      ],
      children: [
        {
          text: 'Panel',
          route: '/profile/panel_admin/panel',
          icon: 'calendar',
          roles: [
            'panel_admin',
            'superuser',
          ],
        },
      ],
    } : null,
  {
    text: 'AO',
    icon: 'building-o',
    toggleMenuSection: true,
    expandedSection: true,
    roles: [
      'superuser',
      'ao_user',
    ],
    children: [
      {
        text: 'Client Profiles', // aka Bidder Portfolio
        route: '/profile/ao/bidderportfolio',
        icon: 'address-book',
        roles: [
          'ao_user',
          'superuser',
        ],
        params: {
          type: 'all',
        },
      },
      checkFlag('flags.agenda_search') ?
        {
          text: 'Employees and Panel Agendas',
          route: '/profile/ao/employeeagendas',
          icon: 'sticky-note',
          roles: [
            'ao_user',
            'superuser',
          ],
        } : null,
      checkFlag('flags.panel_meetings_search') ?
        {
          text: 'Panel Meetings',
          route: '/profile/ao/panelmeetings',
          icon: 'calendar',
          roles: [
            'ao_user',
            'superuser',
          ],
        } : null,
      checkFlag('flags.projected_vacancy') ?
        {
          text: 'Projected Vacancy Management',
          route: '/profile/ao/projectedvacancy',
          icon: ' fa-keyboard-o',
          roles: [
            'superuser',
            'ao_user',
          ],
        } : null,
      {
        text: 'Available Bidders',
        route: '/profile/ao/availablebidders',
        icon: 'users',
        roles: [
          'ao_user',
          'superuser',
        ],
      },
      checkFlag('flags.bidding_tool') ?
        {
          text: 'Bidding Tool',
          route: '/profile/ao/biddingtool/',
          icon: 'cog',
          roles: [
            'superuser',
            'ao_user',
          ],
        } : null,
      checkFlag('flags.publishable_positions') ?
        {
          text: 'Publishable Positions',
          route: '/profile/ao/publishablepositions',
          icon: ' fa-newspaper-o',
          roles: [
            'superuser',
            'ao_user',
          ],
        } : null,
    ],
  },
  {
    text: 'CDO',
    icon: 'street-view',
    toggleMenuSection: true,
    expandedSection: true,
    roles: [
      'superuser',
      'cdo',
    ],
    children: [
      {
        text: 'Client Profiles', // aka Bidder Portfolio
        route: '/profile/cdo/bidderportfolio',
        icon: 'address-book',
        roles: [
          'cdo',
          'superuser',
        ],
        params: {
          type: 'all',
        },
      },
      {
        text: 'Available Bidders',
        route: '/profile/cdo/availablebidders',
        icon: 'users',
        roles: [
          'cdo',
        ],
      },
      checkFlag('flags.agenda_search') ?
        {
          text: 'Employees and Panel Agendas',
          route: '/profile/cdo/employeeagendas',
          icon: 'sticky-note',
          roles: [
            'cdo',
            'superuser',
          ],
        } : null,
      checkFlag('flags.panel_meetings_search') ?
        {
          text: 'Panel Meetings',
          route: '/profile/cdo/panelmeetings',
          icon: 'calendar',
          roles: [
            'cdo',
            'superuser',
          ],
        } : null,
      checkFlag('flags.bidding_tool') ?
        {
          text: 'Bidding Tool',
          route: '/profile/cdo/biddingtool/',
          icon: 'cog',
          roles: [
            'superuser',
            'cdo',
          ],
        } : null,
    ],
  },
  {
    text: 'Entry Level',
    icon: 'street-view',
    toggleMenuSection: true,
    expandedSection: true,
    roles: [
      'superuser',
      'el_cdo',
      'fsbid_admin',
    ],
    children: [],
  },
].filter(x => x));

export default GET_PROFILE_MENU;

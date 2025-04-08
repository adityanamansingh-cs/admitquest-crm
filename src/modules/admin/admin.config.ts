import AdminJS from 'adminjs';
import { Database, Resource } from '@adminjs/sequelize';
import AdminJSExpress from '@adminjs/express';
import { DB } from '../../database';
import path from 'path';
import session from 'express-session';
import { Request, Response } from 'express';
import { AdminJSOptions } from 'adminjs';

// Register Sequelize adapter
AdminJS.registerAdapter({ Database, Resource });

// Define resource groups
const studentGroup = {
  name: 'Students',
  icon: 'User',
};

const instituteGroup = {
  name: 'Institutes',
  icon: 'School',
};

const paymentGroup = {
  name: 'Payments',
  icon: 'CreditCard',
};

const referenceGroup = {
  name: 'Reference Data',
  icon: 'Database',
};

const systemGroup = {
  name: 'System',
  icon: 'Settings',
};

export const adminOptions: AdminJSOptions = {
  rootPath: '/admin',
  resources: [
    {
      resource: DB.Application,
      options: {
        navigation: studentGroup,
        sort: {
          sortBy: 'created_at',
          direction: 'desc',
        },
      },
    },
    {
      resource: DB.Student,
      options: {
        navigation: studentGroup,
        sort: {
          sortBy: 'created_at',
          direction: 'desc',
        },
      },
    },
    {
      resource: DB.Institute,
      options: {
        navigation: instituteGroup,
        sort: {
          sortBy: 'created_at',
          direction: 'desc',
        },
      },
    },
    {
      resource: DB.InstituteProgram,
      options: {
        navigation: instituteGroup,
        sort: {
          sortBy: 'created_at',
          direction: 'desc',
        },
      },
    },
    {
      resource: DB.InstituteFeature,
      options: {
        navigation: instituteGroup,
        sort: {
          sortBy: 'created_at',
          direction: 'desc',
        },
      },
    },
    {
      resource: DB.InstituteRanking,
      options: {
        navigation: instituteGroup,
        sort: {
          sortBy: 'created_at',
          direction: 'desc',
        },
      },
    },
    {
      resource: DB.InstituteCourseSummary,
      options: {
        navigation: instituteGroup,
        sort: {
          sortBy: 'created_at',
          direction: 'desc',
        },
      },
    },
    {
      resource: DB.Cart,
      options: {
        navigation: paymentGroup,
        sort: {
          sortBy: 'created_at',
          direction: 'desc',
        },
      },
    },
    {
      resource: DB.Coupon,
      options: {
        navigation: paymentGroup,
        sort: {
          sortBy: 'created_at',
          direction: 'desc',
        },
      },
    },
    {
      resource: DB.City,
      options: {
        navigation: referenceGroup,
        sort: {
          sortBy: 'created_at',
          direction: 'desc',
        },
      },
    },
    {
      resource: DB.Course,
      options: {
        navigation: referenceGroup,
        sort: {
          sortBy: 'created_at',
          direction: 'desc',
        },
      },
    },
    {
      resource: DB.Degree,
      options: {
        navigation: referenceGroup,
        sort: {
          sortBy: 'created_at',
          direction: 'desc',
        },
      },
    },
    {
      resource: DB.Feature,
      options: {
        navigation: referenceGroup,
        sort: {
          sortBy: 'created_at',
          direction: 'desc',
        },
      },
    },
    {
      resource: DB.Program,
      options: {
        navigation: referenceGroup,
        sort: {
          sortBy: 'created_at',
          direction: 'desc',
        },
      },
    },
    {
      resource: DB.Exam,
      options: {
        navigation: referenceGroup,
        sort: {
          sortBy: 'created_at',
          direction: 'desc',
        },
      },
    },
    {
      resource: DB.User,
      options: {
        navigation: systemGroup,
        sort: {
          sortBy: 'created_at',
          direction: 'desc',
        },
      },
    },
    {
      resource: DB.State,
      options: {
        navigation: referenceGroup,
        sort: {
          sortBy: 'name',
          direction: 'asc',
        },
      },
    },
    {
      resource: DB.Stream,
      options: {
        navigation: {
          name: 'Streams',
          icon: 'Stream',
        },
        sort: {
          direction: 'desc',
          sortBy: 'created_at',
        },
      },
    },
    {
      resource: DB.Specialization,
      options: {
        navigation: {
          name: 'Specializations',
          icon: 'Book',
        },
        sort: {
          direction: 'desc',
          sortBy: 'created_at',
        },
        properties: {
          description: {
            type: 'richtext',
          },
        },
      },
    },
  ],
  branding: {
    companyName: 'AdmitQuest AI',
    logo: '/assets/logo.svg',
    favicon: '/assets/logo.svg',
    theme: {
      colors: {
        primary100: '#7D1D38',
        primary80: '#1F3A60',
        sidebar: 'white',
      },
    },
  },
  dashboard: {
    component: './components/dashboard',
    handler: async (request: Request, response: Response, context: any) => {
      return {
        welcomeMessage: 'Welcome to AdmitQuest Admin',
        subtitle: 'Manage your resources and settings',
        cards: [
          {
            title: 'Students',
            icon: 'User',
            description: 'Manage student applications and profiles',
            stats: {
              total: '1,234',
              new: '45',
              active: '1,189'
            }
          },
          {
            title: 'Institutes',
            icon: 'School',
            description: 'Manage institute profiles and programs',
            stats: {
              total: '89',
              featured: '12',
              active: '77'
            }
          },
          {
            title: 'Payments',
            icon: 'CreditCard',
            description: 'View and manage payment records',
            stats: {
              total: '$45,678',
              pending: '$2,345',
              completed: '$43,333'
            }
          },
          {
            title: 'Settings',
            icon: 'Settings',
            description: 'Configure system settings and preferences',
            stats: {
              features: '24',
              active: '18',
              pending: '6'
            }
          }
        ]
      };
    }
  },
  pages: {
    customPage: {
      handler: async (request, response, context) => {
        return {
          text: 'I am fetched from the backend',
        };
      },
      component: './components/custom-page',
    },
  },
  loginPath: '/admin/login',
  logoutPath: '/admin/auth/logout',
  assets: {
    styles: [],
    scripts: [],
  },
  env: {
    ADMIN_IS_AUTHENTICATED: 'false',
  },
};

const adminJs = new AdminJS(adminOptions);

// Create router without authentication (we'll handle it separately)
const adminRouter = AdminJSExpress.buildRouter(adminJs);

// Export the admin instance and router
export { adminJs, adminRouter }; 
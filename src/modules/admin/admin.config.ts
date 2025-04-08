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
        // Main colors
        primary100: '#0A192F',  // Darkest - Main background
        primary80: '#112240',   // Darker - Sidebar
        primary60: '#1F3A60',   // Dark - Header
        primary40: '#FF4B6E',   // Brand color - Accent
        primary20: '#FF6B88',   // Light brand color
        primary: '#FF4B6E',     // Primary brand color

        // Text colors
        grey100: '#FFFFFF',     // White text
        grey80: 'rgba(255, 255, 255, 0.8)',
        grey60: 'rgba(255, 255, 255, 0.6)',
        grey40: 'rgba(255, 255, 255, 0.4)',
        grey20: 'rgba(255, 255, 255, 0.2)',
        
        // UI colors
        accent: '#FF4B6E',      // Accent color
        love: '#FF4B6E',        // Heart icon color
        
        // Filter colors
        filterBg: '#112240',    // Filter background
        hoverBg: '#1F3A60',     // Hover background
        
        // Border colors
        border: '#1F3A60',
        separator: '#1F3A60',

        // Content colors
        content: '#FFFFFF',           // Main content text
        contentHeader: '#FFFFFF',     // Header text
        navigation: '#FFFFFF',        // Navigation text
        label: '#FFFFFF',             // Label text - Changed to white for better visibility
        placeholder: 'rgba(255, 255, 255, 0.5)', // Placeholder text
        link: '#FFFFFF',              // Link text
        linkHover: '#FF4B6E',         // Link hover
        text: '#FFFFFF',              // General text
        textSecondary: 'rgba(255, 255, 255, 0.7)', // Secondary text
        background: '#0A192F',       // Main background
        sidebar: '#112240',          // Sidebar background
        sidebarText: '#FFFFFF',      // Sidebar text
        inputBackground: '#1F3A60',  // Input background
        inputText: '#FFFFFF',        // Input text
        tableHeader: '#FFFFFF',      // Table header text
        tableCell: '#FFFFFF',        // Table cell text - Changed to solid white
        
        // Status colors
        success: '#52C41A',
        info: '#1890FF',
        warning: '#FAAD14',
        error: '#F5222D',

        // Card colors
        card: '#112240',            // Card background
        cardText: '#FFFFFF',        // Card text
        cardBorder: '#1F3A60',      // Card border
        
        // Button colors
        buttonBg: '#FF4B6E',        // Button background
        buttonText: '#FFFFFF',      // Button text
        
        // List colors
        listBg: '#0A192F',          // List background
        listItemBg: '#112240',      // List item background
        listItemHoverBg: '#1F3A60', // List item hover background
        listItemSelectedBg: '#1F3A60', // List item selected background
        listItemTextHover: '#FFFFFF', // List item text hover
        listItemSelectedText: '#FFFFFF', // List item selected text
        
        // Breadcrumb colors
        breadcrumbsBg: 'transparent',   // Breadcrumbs background
        breadcrumbsText: '#FFFFFF',     // Breadcrumbs text
        breadcrumbsLinkText: '#FFFFFF', // Breadcrumbs link text
        breadcrumbsLinkHover: '#FF4B6E', // Breadcrumbs link hover
      },
      borders: {
        default: '1px solid #1F3A60',
        input: '1px solid #1F3A60',
        card: '1px solid #1F3A60',
        sidebar: '1px solid #1F3A60',
        table: '1px solid #1F3A60',
      },
      shadows: {
        login: '0 4px 12px rgba(0, 0, 0, 0.3)',
        cardHover: '0 4px 12px rgba(0, 0, 0, 0.3)',
        drawer: '0 4px 12px rgba(0, 0, 0, 0.3)',
        sidebar: '2px 0 8px rgba(0, 0, 0, 0.3)',
      },
      spacing: {
        sidebarWidth: '300px',
        padding: '24px',
        margin: '16px',
        gap: '16px',
        borderRadius: '8px',
      },
      font: {
        family: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        base: '14px',
        lineHeight: '1.5',
        weight: {
          light: '300',
          regular: '400',
          medium: '500',
          bold: '600',
        }
      }
    },
  },
  dashboard: {
    component: './components/dashboard',
    handler: async (request: Request, response: Response, context: any) => {
      return {
        welcomeMessage: 'Welcome to AdmitQuest Admin',
        subtitle: 'Manage your resources and settings',
        style: {
          header: {
            color: '#FFFFFF',
            fontSize: '28px',
            fontWeight: '600',
            marginBottom: '8px',
          },
          subtitle: {
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '16px',
            marginBottom: '32px',
          }
        },
        cards: [
          {
            title: 'Students',
            icon: 'User',
            description: 'Manage student applications and profiles',
            color: '#FF4B6E',
            gradient: 'linear-gradient(135deg, #FF4B6E 0%, #FF6B88 100%)',
            style: {
              card: {
                background: '#112240',
                border: '1px solid #1F3A60',
                borderRadius: '8px',
                padding: '24px',
              },
              title: {
                color: '#FFFFFF',
                fontSize: '18px',
                fontWeight: '600',
              },
              description: {
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '14px',
              },
              stats: {
                color: '#FFFFFF',
                fontSize: '24px',
                fontWeight: '600',
              },
              label: {
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: '12px',
              }
            },
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
            color: '#FF4B6E',
            gradient: 'linear-gradient(135deg, #FF4B6E 0%, #FF6B88 100%)',
            style: {
              card: {
                background: '#112240',
                border: '1px solid #1F3A60',
                borderRadius: '8px',
                padding: '24px',
              },
              title: {
                color: '#FFFFFF',
                fontSize: '18px',
                fontWeight: '600',
              },
              description: {
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '14px',
              },
              stats: {
                color: '#FFFFFF',
                fontSize: '24px',
                fontWeight: '600',
              },
              label: {
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: '12px',
              }
            },
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
            color: '#FF4B6E',
            gradient: 'linear-gradient(135deg, #FF4B6E 0%, #FF6B88 100%)',
            style: {
              card: {
                background: '#112240',
                border: '1px solid #1F3A60',
                borderRadius: '8px',
                padding: '24px',
              },
              title: {
                color: '#FFFFFF',
                fontSize: '18px',
                fontWeight: '600',
              },
              description: {
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '14px',
              },
              stats: {
                color: '#FFFFFF',
                fontSize: '24px',
                fontWeight: '600',
              },
              label: {
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: '12px',
              }
            },
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
            color: '#FF4B6E',
            gradient: 'linear-gradient(135deg, #FF4B6E 0%, #FF6B88 100%)',
            style: {
              card: {
                background: '#112240',
                border: '1px solid #1F3A60',
                borderRadius: '8px',
                padding: '24px',
              },
              title: {
                color: '#FFFFFF',
                fontSize: '18px',
                fontWeight: '600',
              },
              description: {
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '14px',
              },
              stats: {
                color: '#FFFFFF',
                fontSize: '24px',
                fontWeight: '600',
              },
              label: {
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: '12px',
              }
            },
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
    styles: ['/admin.css'],
    scripts: ['/custom-styles.js'],
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
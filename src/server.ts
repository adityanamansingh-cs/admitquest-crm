import './config'; // Load environment variables first
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import router from '@routes/routes';
import logger from '@utils/logger';
import { DB } from '@/database';
import { PORT } from './config';
import { errorHandler } from '@utils/error-handler';
import session from 'express-session';
import passport from './utils/passport';
import { setupAdminRouter } from './modules/admin';
import formidable from 'express-formidable';
import path from 'path';

const appServer = express();
const port = PORT;

const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200,
};

appServer.use((req, res, next) => {
    const startTime = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - startTime;
        const message = `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`;

        if (res.statusCode >= 500) {
            logger.error(message);
        } else if (res.statusCode >= 400) {
            logger.warn(message);
        } else {
            logger.info(message);
        }
    });

    next();
});

// Enable CORS
appServer.use(cors(corsOptions));
appServer.options('*', cors(corsOptions));

// Serve static files from public directory
appServer.use(express.static('public'));

// Serve admin CSS
appServer.use('/admin.css', express.static(path.join(__dirname, 'modules/admin/components/admin.css')));

// Serve admin custom script
appServer.use('/custom-styles.js', express.static(path.join(__dirname, 'modules/admin/components/custom-styles.js')));

// Session configuration for OAuth
appServer.use(
    session({
        secret: process.env.JWT_ACCESS_TOKEN_SECRET || 'secret',
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
        },
    })
);

// Initialize Passport
appServer.use(passport.initialize());
appServer.use(passport.session());

// Google OAuth routes for general authentication
appServer.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
appServer.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/admin/login?error=authentication_failed' }),
    (req, res) => {
        res.redirect('/admin');
    }
);

// Initialize and connect to database, then start the server
DB.sequelize
    .authenticate()
    .then(async () => {
        logger.info('Database connected successfully!');
        
        try {
            // Setup Admin panel first (before body-parser middleware)
            const adminRouter = await setupAdminRouter();
            appServer.use('/admin', adminRouter);
            logger.info('Admin panel initialized at /admin');

            // Add body-parser middleware after AdminJS
            appServer.use(express.json());
            appServer.use(express.urlencoded({ extended: true }));

            // Use the router with the /api prefix
            appServer.use('/api', router);
            
            // Add error handler after all routes
            appServer.use(errorHandler);
            
            // Catch-all route must be after all other routes
            appServer.all('*', (req, res) => {
                res.status(404).json({ message: 'Sorry! Page not found' });
            });
            
            // Start the server
            appServer.listen(port, () => {
                logger.info(`Server is running on http://localhost:${port}`);
            });
        } catch (error) {
            logger.error('Failed to initialize admin panel:', error);
        }
    })
    .catch(error => {
        logger.error('Unable to connect to the database:', error);
    });

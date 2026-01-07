import express, { Application, Request, Response, NextFunction } from 'express';
import path from 'path';
import mongoose from 'mongoose';
import session from 'express-session';
import cors from 'cors';
import dotenv from 'dotenv';
import expressEjsLayouts from 'express-ejs-layouts'; // Add this import

import routes from './routes';
import { DatabaseService } from './services/database.service';

// Load environment variables
dotenv.config();

class App {
  public app: Application;
  private dbService: DatabaseService;

  constructor() {
    this.app = express();
    this.dbService = DatabaseService.getInstance();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    // CORS configuration
    this.app.use(cors({
      origin: process.env.NODE_ENV === 'production' 
        ? ['https://yourdomain.com'] 
        : ['http://localhost:3000'],
      credentials: true
    }));

    // Body parsing middleware
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // Session configuration
    this.app.use(session({
      secret: process.env.SESSION_SECRET || 'your-secret-key',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      }
    }));

    // Static files
    this.app.use(express.static(path.join(__dirname, 'public')));

    // View engine setup with layouts
    this.app.use(expressEjsLayouts); // Enable EJS layouts
    this.app.set('view engine', 'ejs');
    this.app.set('views', path.join(__dirname, 'views'));
    this.app.set('layout', 'layouts/main'); // Default layout

    // Global variables for views
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      res.locals.currentPath = req.path;
      res.locals.NODE_ENV = process.env.NODE_ENV;
      res.locals.year = new Date().getFullYear();
      next();
    });
  }

  private initializeRoutes(): void {
    this.app.use('/', routes);

    // Health check endpoint
    this.app.get('/health', (req: Request, res: Response) => {
      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
      });
    });
  }

  private initializeErrorHandling(): void {
    // 404 handler
    this.app.use((req: Request, res: Response) => {
      res.status(404).render('error', {
        title: 'Page Not Found',
        message: 'The page you are looking for does not exist.',
        error: {},
        layout: 'layouts/error' // Use error layout
      });
    });

    // Global error handler
    this.app.use((err: any, req: Request, res: Response, next: NextFunction) => {
      console.error('Global error handler:', err);

      const statusCode = err.status || 500;
      const message = process.env.NODE_ENV === 'production' 
        ? 'Something went wrong!'
        : err.message;

      res.status(statusCode).render('error', {
        title: 'Error',
        message,
        error: process.env.NODE_ENV === 'development' ? err : {},
        layout: 'layouts/error' // Use error layout
      });
    });
  }

  async start(): Promise<void> {
    try {
      // Connect to database
      await this.dbService.connect();
      
      // Seed data if needed
      if (process.env.NODE_ENV !== 'production') {
        await this.dbService.seedData();
      }

      const PORT = process.env.PORT || 3000;
      this.app.listen(PORT, () => {
        console.log(`🚀 Server is running on http://localhost:${PORT}`);
        console.log(`📁 Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`🗄️  Database: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
      });
    } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
    }
  }

  async stop(): Promise<void> {
    await this.dbService.disconnect();
    process.exit(0);
  }
}

// Create and start the application
const app = new App();
app.start();

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Received SIGINT signal');
  await app.stop();
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Received SIGTERM signal');
  await app.stop();
});

export default app;
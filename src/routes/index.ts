import { Router } from 'express';
import { ProjectController } from '../controllers/project.controller';
import { ApiController } from '../controllers/api.controller';

const router = Router();
const projectController = new ProjectController();
const apiController = new ApiController();

// Web routes
router.get('/', projectController.getHomePage);
router.get('/projects', projectController.getAllProjects);
router.get('/projects/hng', projectController.getHngProjects);
router.get('/projects/technology/:technology', projectController.getTechnologyProjects);
router.get('/projects/:slug', projectController.getProjectBySlug);
router.get('/api-docs', projectController.getApiPage);
router.get('/contact', projectController.getContactPage);
router.post('/contact', projectController.submitContactForm); // Add POST route for contact form
router.get('/about', projectController.getAboutPage);

// API routes
router.get('/api/me', apiController.getProfile);
router.get('/api/projects', apiController.getProjectsApi);
router.get('/api/projects/:slug', apiController.getProjectApi);
router.get('/api/technologies', apiController.getTechnologiesApi);
router.get('/test', projectController.getTestPage);
router.get('/api/stats', apiController.getStatsApi);

export default router;
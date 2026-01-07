import { Request, Response } from 'express';
import { ProjectService } from '../services/project.service';
import { TechnologyService } from '../services/technology.service';

export class ApiController {
  private projectService: ProjectService;
  private technologyService: TechnologyService;

  constructor() {
    this.projectService = new ProjectService();
    this.technologyService = new TechnologyService();
  }

  getProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      // Get a dynamic fact from an external API
      const factResponse = await fetch('https://catfact.ninja/fact');
      const factData: any = await factResponse.json();

      res.json({
        status: 'success',
        user: {
          email: 'developer@example.com',
          name: 'PearlPerfect',
          stack: 'Backend Developer'
        },
        timestamp: new Date().toISOString(),
        fact: factData.fact || 'Cats are awesome!'
      });
    } catch (error) {
      res.json({
        status: 'success',
        user: {
          email: 'developer@example.com',
          name: 'PearlPerfect',
          stack: 'Backend Developer'
        },
        timestamp: new Date().toISOString(),
        fact: 'Cats are awesome! (Fallback fact)'
      });
    }
  };

  getProjectsApi = async (req: Request, res: Response): Promise<void> => {
    try {
      const filters = {
        category: req.query.category as string,
        type: req.query.type as string,
        status: req.query.status as string,
        technologies: req.query.technologies ? (req.query.technologies as string).split(',') : [],
        search: req.query.search as string
      };

      const projects = await this.projectService.getAllProjects(filters);
      
      res.json({
        success: true,
        count: projects.length,
        data: projects
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch projects'
      });
    }
  };

  getProjectApi = async (req: Request, res: Response): Promise<void> => {
    try {
      const { slug } = req.params;
      const project = await this.projectService.getProjectBySlug(slug);

      if (!project) {
        res.status(404).json({
          success: false,
          error: 'Project not found'
        });
        return;
      }

      res.json({
        success: true,
        data: project
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch project'
      });
    }
  };

  getTechnologiesApi = async (req: Request, res: Response): Promise<void> => {
    try {
      const technologies = await this.technologyService.getAllTechnologies();
      
      res.json({
        success: true,
        count: technologies.length,
        data: technologies
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch technologies'
      });
    }
  };

  getStatsApi = async (req: Request, res: Response): Promise<void> => {
    try {
      const [projectStats, techStats, recentProjects] = await Promise.all([
        this.projectService.getTechnologyStats(),
        this.technologyService.getTechnologyStats(),
        this.projectService.getRecentProjects(5)
      ]);

      res.json({
        success: true,
        data: {
          projectStats,
          techStats,
          recentProjects
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Failed to fetch stats'
      });
    }
  };
}
import { Request, Response } from 'express';
import { ProjectService } from '../services/project.service';
import { TechnologyService } from '../services/technology.service';
import { ContactService } from '../services/contact.service';
import { projects as seedProjects, technologies as seedTechnologies } from '../data/projects.seed';
import { IProject } from '../models/project.model';
import { ITechnology } from '../models/technology.model';

export class ProjectController {
  private projectService: ProjectService;
  private technologyService: TechnologyService;
  private contactService: ContactService;

  constructor() {
    this.projectService = new ProjectService();
    this.technologyService = new TechnologyService();
    this.contactService = new ContactService();
  }

  getHomePage = async (req: Request, res: Response): Promise<void> => {
    try {
      let recentProjects: IProject[] = [];
      let featuredProjects: IProject[] = [];
      let technologies: ITechnology[] = [];
      let stats = {
        totalProjects: 0,
        hngProjects: 0,
        personalProjects: 0,
        completedProjects: 0,
        inProgressProjects: 0,
        technologiesByCategory: {}
      };

      try {
        // Try to get data from database
        recentProjects = await this.projectService.getRecentProjects(6).catch(() => []);
        featuredProjects = await this.projectService.getFeaturedProjects().catch(() => []);
        technologies = await this.technologyService.getAllTechnologies().catch(() => []);
        
        // Get actual stats from database
        const dbStats = await this.projectService.getTechnologyStats().catch(() => []);
        
        // Count projects from database or seed data
        const allProjects = await this.projectService.getAllProjects().catch(() => []);
        const hngProjects = allProjects.filter(p => p.type === 'hng');
        const personalProjects = allProjects.filter(p => p.type === 'personal');
        const completedProjects = allProjects.filter(p => p.status === 'completed');
        const inProgressProjects = allProjects.filter(p => p.status === 'in-progress');
        
        stats = {
          totalProjects: allProjects.length || seedProjects.length,
          hngProjects: hngProjects.length || seedProjects.filter(p => p.type === 'hng').length,
          personalProjects: personalProjects.length || seedProjects.filter(p => p.type === 'personal').length,
          completedProjects: completedProjects.length || seedProjects.filter(p => p.status === 'completed').length,
          inProgressProjects: inProgressProjects.length || seedProjects.filter(p => p.status === 'in-progress').length,
          technologiesByCategory: {}
        };

      } catch (dbError) {
        console.log('⚠️ Database not available, using seed data for stats');
        
        // Use fallback data from seed file
        recentProjects = seedProjects.slice(0, 6) as IProject[];
        featuredProjects = seedProjects.filter(p => p.highlights && p.highlights.length > 0).slice(0, 3) as IProject[];
        technologies = seedTechnologies as ITechnology[];
        
        // Calculate stats from seed data
        stats = {
          totalProjects: seedProjects.length,
          hngProjects: seedProjects.filter(p => p.type === 'hng').length,
          personalProjects: seedProjects.filter(p => p.type === 'personal').length,
          completedProjects: seedProjects.filter(p => p.status === 'completed').length,
          inProgressProjects: seedProjects.filter(p => p.status === 'in-progress').length,
          technologiesByCategory: {}
        };
      }

      res.render('home', {
        title: 'Home',
        recentProjects,
        featuredProjects,
        technologies,
        stats
      });
    } catch (error) {
      console.error('Error in getHomePage:', error);
      res.status(500).render('error', {
        title: 'Error',
        message: 'Failed to load home page',
        error: process.env.NODE_ENV === 'development' ? error : {},
        layout: 'layouts/error'
      });
    }
  };

  getAllProjects = async (req: Request, res: Response): Promise<void> => {
    try {
      const filters = {
        category: req.query.category as string,
        type: req.query.type as string,
        status: req.query.status as string,
        technologies: req.query.technologies ? (req.query.technologies as string).split(',') : [],
        search: req.query.search as string
      };

      let projects: IProject[] = [];
      let categories: string[] = [];
      let types: string[] = [];
      let technologies: ITechnology[] = [];

      try {
        [projects, categories, types, technologies] = await Promise.all([
          this.projectService.getAllProjects(filters).catch(() => []),
          this.projectService.getProjectCategories().catch(() => []),
          this.projectService.getProjectTypes().catch(() => []),
          this.technologyService.getAllTechnologies().catch(() => [])
        ]);

        // If no projects from database, use seed data
        if (projects.length === 0) {
          console.log('⚠️ No projects from database, using seed data');
          projects = this.filterSeedProjects(filters);
          categories = Array.from(new Set(seedProjects.map(p => p.category).filter(Boolean))) as string[];
          types = Array.from(new Set(seedProjects.map(p => p.type).filter(Boolean))) as string[];
          technologies = seedTechnologies as ITechnology[];
        }

      } catch (error) {
        console.log('⚠️ Database query failed, using seed data');
        projects = this.filterSeedProjects(filters);
        categories = Array.from(new Set(seedProjects.map(p => p.category).filter(Boolean))) as string[];
        types = Array.from(new Set(seedProjects.map(p => p.type).filter(Boolean))) as string[];
        technologies = seedTechnologies as ITechnology[];
      }

      res.render('projects/index', {
        title: 'Projects',
        projects,
        categories,
        types,
        technologies,
        filters
      });
    } catch (error) {
      console.error('Error in getAllProjects:', error);
      res.status(500).render('error', {
        title: 'Error',
        message: 'Failed to load projects',
        error: process.env.NODE_ENV === 'development' ? error : {},
        layout: 'layouts/error'
      });
    }
  };

  private filterSeedProjects(filters: any): IProject[] {
    let filteredProjects = [...seedProjects] as IProject[];

    if (filters?.category) {
      filteredProjects = filteredProjects.filter(p => p.category === filters.category);
    }

    if (filters?.type) {
      filteredProjects = filteredProjects.filter(p => p.type === filters.type);
    }

    if (filters?.status) {
      filteredProjects = filteredProjects.filter(p => p.status === filters.status);
    }

    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      filteredProjects = filteredProjects.filter(p => 
        (p.title?.toLowerCase() || '').includes(searchLower) ||
        (p.description?.toLowerCase() || '').includes(searchLower) ||
        (p.longDescription?.toLowerCase() || '').includes(searchLower)
      );
    }

    if (filters?.technologies && filters.technologies.length > 0) {
      filteredProjects = filteredProjects.filter(p =>
        p.technologies?.some(tech => filters.technologies!.includes(tech))
      );
    }

    return filteredProjects.sort((a, b) => 
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }

  getProjectBySlug = async (req: Request, res: Response): Promise<void> => {
    try {
      const { slug } = req.params;
      let project: IProject | null = null;
      let relatedProjects: IProject[] = [];

      try {
        project = await this.projectService.getProjectBySlug(slug).catch(() => null);
        
        if (!project) {
          // Try to find in seed data
          project = seedProjects.find(p => p.slug === slug) as IProject || null;
        }

        if (project) {
          // Get related projects
          if (project.technologies && project.technologies.length > 0) {
            relatedProjects = await this.projectService.getProjectsByTechnology(
              project.technologies[0]
            ).then(projects =>
              projects.filter(p => p.slug !== slug).slice(0, 3)
            ).catch(() => []);
            
            // If no related projects from database, use seed data
            if (relatedProjects.length === 0) {
              relatedProjects = seedProjects
                .filter(p => p.slug !== slug && p.technologies?.some(t => project!.technologies?.includes(t)))
                .slice(0, 3) as IProject[];
            }
          }
        }

      } catch (error) {
        console.log('⚠️ Database query failed, using seed data');
        project = seedProjects.find(p => p.slug === slug) as IProject || null;
        if (project && project.technologies) {
          relatedProjects = seedProjects
            .filter(p => p.slug !== slug && p.technologies?.some(t => project!.technologies?.includes(t)))
            .slice(0, 3) as IProject[];
        }
      }

      if (!project) {
        res.status(404).render('error', {
          title: 'Project Not Found',
          message: 'The requested project was not found',
          error: {},
          layout: 'layouts/error'
        });
        return;
      }

      res.render('projects/detail', {
        title: project.title || 'Project Details',
        project,
        relatedProjects
      });
    } catch (error) {
      console.error('Error in getProjectBySlug:', error);
      res.status(500).render('error', {
        title: 'Error',
        message: 'Failed to load project',
        error: process.env.NODE_ENV === 'development' ? error : {},
        layout: 'layouts/error'
      });
    }
  };

  getHngProjects = async (req: Request, res: Response): Promise<void> => {
    try {
      let projects: IProject[] = [];
      let stages: number[] = [];

      try {
        projects = await this.projectService.getProjectsByType('hng').catch(() => []);
        
        // If no projects from database, use seed data
        if (projects.length === 0) {
          console.log('⚠️ No HNG projects from database, using seed data');
          projects = seedProjects.filter(p => p.type === 'hng') as IProject[];
        }
        
        stages = Array.from(new Set(projects.map(p => p.stage).filter(Boolean))) as number[];
        stages.sort((a, b) => a - b);

      } catch (error) {
        console.log('⚠️ Database query failed, using seed data');
        projects = seedProjects.filter(p => p.type === 'hng') as IProject[];
        stages = Array.from(new Set(projects.map(p => p.stage).filter(Boolean))) as number[];
        stages.sort((a, b) => a - b);
      }

      res.render('projects/hng', {
        title: 'HNG Internship Projects',
        projects,
        stages
      });
    } catch (error) {
      console.error('Error in getHngProjects:', error);
      res.status(500).render('error', {
        title: 'Error',
        message: 'Failed to load HNG projects',
        error: process.env.NODE_ENV === 'development' ? error : {},
        layout: 'layouts/error'
      });
    }
  };

  getTechnologyProjects = async (req: Request, res: Response): Promise<void> => {
    try {
      const { technology } = req.params;
      let projects: IProject[] = [];
      let techDetails: ITechnology | null = null;

      try {
        [projects, techDetails] = await Promise.all([
          this.projectService.getProjectsByTechnology(technology).catch(() => []),
          this.technologyService.getTechnologyByName(technology).catch(() => null)
        ]);

        // If no projects from database, use seed data
        if (projects.length === 0) {
          projects = seedProjects.filter(p => p.technologies?.includes(technology)) as IProject[];
        }

        // If no tech details from database, find in seed data
        if (!techDetails) {
          techDetails = seedTechnologies.find(t => t.name === technology) as ITechnology || null;
        }

      } catch (error) {
        console.log('⚠️ Database query failed, using seed data');
        projects = seedProjects.filter(p => p.technologies?.includes(technology)) as IProject[];
        techDetails = seedTechnologies.find(t => t.name === technology) as ITechnology || null;
      }

      if (!techDetails) {
        res.status(404).render('error', {
          title: 'Technology Not Found',
          message: 'The requested technology was not found',
          error: {},
          layout: 'layouts/error'
        });
        return;
      }

      res.render('projects/technology', {
        title: `${technology} Projects`,
        projects,
        technology: techDetails
      });
    } catch (error) {
      console.error('Error in getTechnologyProjects:', error);
      res.status(500).render('error', {
        title: 'Error',
        message: 'Failed to load technology projects',
        error: process.env.NODE_ENV === 'development' ? error : {},
        layout: 'layouts/error'
      });
    }
  };

  getApiPage = (req: Request, res: Response): void => {
    res.render('api', {
      title: 'API Documentation'
    });
  };

  getContactPage = async (req: Request, res: Response): Promise<void> => {
    try {
      res.render('contact', {
        title: 'Contact',
        success: req.query.success as string,
        error: req.query.error as string,
        formData: {}
      });
    } catch (error) {
      console.error('Error in getContactPage:', error);
      res.status(500).render('error', {
        title: 'Error',
        message: 'Failed to load contact page',
        error: process.env.NODE_ENV === 'development' ? error : {},
        layout: 'layouts/error'
      });
    }
  };

  submitContactForm = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, email, subject, message } = req.body;

      // Basic validation
      if (!name || !email || !subject || !message) {
        return res.redirect('/contact?error=All fields are required');
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.redirect('/contact?error=Please enter a valid email address');
      }

      // Get IP address and user agent
      const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      const userAgent = req.headers['user-agent'];

      // Save to database
      await this.contactService.createContact({
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim(),
        message: message.trim(),
        ipAddress: ipAddress as string,
        userAgent: userAgent as string
      });

      // Redirect with success message
      res.redirect('/contact?success=Thank you for your message! I will get back to you soon.');
    } catch (error) {
      console.error('Error submitting contact form:', error);
      res.redirect('/contact?error=Failed to send message. Please try again later.');
    }
  };

  getAboutPage = async (req: Request, res: Response): Promise<void> => {
    try {
      let stats = {
        totalProjects: 0,
        hngProjects: 0,
        personalProjects: 0,
        completedProjects: 0,
        inProgressProjects: 0
      };
      let technologies: ITechnology[] = [];

      try {
        // Get actual stats
        const allProjects = await this.projectService.getAllProjects().catch(() => []);
        const techStats = await this.projectService.getTechnologyStats().catch(() => []);
        technologies = await this.technologyService.getAllTechnologies().catch(() => []);
        
        // Calculate actual counts
        stats = {
          totalProjects: allProjects.length || seedProjects.length,
          hngProjects: allProjects.filter(p => p.type === 'hng').length || seedProjects.filter(p => p.type === 'hng').length,
          personalProjects: allProjects.filter(p => p.type === 'personal').length || seedProjects.filter(p => p.type === 'personal').length,
          completedProjects: allProjects.filter(p => p.status === 'completed').length || seedProjects.filter(p => p.status === 'completed').length,
          inProgressProjects: allProjects.filter(p => p.status === 'in-progress').length || seedProjects.filter(p => p.status === 'in-progress').length
        };

        // If no technologies from database, use seed data
        if (technologies.length === 0) {
          technologies = seedTechnologies as ITechnology[];
        }

      } catch (error) {
        console.log('⚠️ Database query failed, using seed data for about page');
        
        // Use seed data for stats
        stats = {
          totalProjects: seedProjects.length,
          hngProjects: seedProjects.filter(p => p.type === 'hng').length,
          personalProjects: seedProjects.filter(p => p.type === 'personal').length,
          completedProjects: seedProjects.filter(p => p.status === 'completed').length,
          inProgressProjects: seedProjects.filter(p => p.status === 'in-progress').length
        };
        technologies = seedTechnologies as ITechnology[];
      }

      res.render('about', {
        title: 'About Me',
        stats,
        technologies
      });
    } catch (error) {
      console.error('Error in getAboutPage:', error);
      res.status(500).render('error', {
        title: 'Error',
        message: 'Failed to load about page',
        error: process.env.NODE_ENV === 'development' ? error : {},
        layout: 'layouts/error'
      });
    }
  };

  getTestPage = (req: Request, res: Response): void => {
    res.render('test', {
      title: 'Test Page'
    });
  };
}
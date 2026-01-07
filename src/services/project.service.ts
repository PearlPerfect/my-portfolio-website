import { Project, IProject } from '../models/project.model';
import { projects as seedProjects } from '../data/projects.seed';

export class ProjectService {
  private useSeedData: boolean = false;

  constructor() {
    this.useSeedData = process.env.USE_SEED_DATA === 'true' || false;
  }

  async getAllProjects(filters?: {
    category?: string;
    type?: string;
    status?: string;
    technologies?: string[];
    search?: string;
  }): Promise<IProject[]> {
    const query: any = {};

    if (filters?.category) {
      query.category = filters.category;
    }

    if (filters?.type) {
      query.type = filters.type;
    }

    if (filters?.status) {
      query.status = filters.status;
    }

    if (filters?.technologies && filters.technologies.length > 0) {
      query.technologies = { $in: filters.technologies };
    }

    if (filters?.search) {
      query.$or = [
        { title: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } },
        { longDescription: { $regex: filters.search, $options: 'i' } }
      ];
    }

    return await Project.find(query)
      .sort({ createdAt: -1 })
      .exec();
  }

  async getProjectById(id: number): Promise<IProject | null> {
    return await Project.findOne({ id }).exec();
  }

  async getProjectBySlug(slug: string): Promise<IProject | null> {
    return await Project.findOne({ slug }).exec();
  }

  async getProjectsByStage(stage: number): Promise<IProject[]> {
    return await Project.find({ stage, type: 'hng' })
      .sort({ createdAt: 1 })
      .exec();
  }

  async getProjectsByTechnology(techName: string): Promise<IProject[]> {
    return await Project.find({ technologies: techName })
      .sort({ createdAt: -1 })
      .exec();
  }

  async getProjectsByType(type: string): Promise<IProject[]> {
    return await Project.find({ type })
      .sort({ createdAt: -1 })
      .exec();
  }

  async getProjectCategories(): Promise<string[]> {
    const categories = await Project.distinct('category');
    return categories.filter(Boolean);
  }

  async getProjectTypes(): Promise<string[]> {
    return await Project.distinct('type');
  }

  async getTechnologyStats(): Promise<any> {
    const allProjects = await Project.find();
    const techStats: { [key: string]: number } = {};

    allProjects.forEach(project => {
      if (project.technologies) {
        project.technologies.forEach(tech => {
          techStats[tech] = (techStats[tech] || 0) + 1;
        });
      }
    });

    return Object.entries(techStats)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }

  async getRecentProjects(limit: number = 4): Promise<IProject[]> {
    return await Project.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  async getFeaturedProjects(): Promise<IProject[]> {
    return await Project.find({
      $or: [
        { highlights: { $exists: true, $ne: [] } },
        { 'highlights.0': { $exists: true } }
      ]
    })
      .sort({ updatedAt: -1 })
      .limit(3)
      .exec();
  }

  async createProject(projectData: Partial<IProject>): Promise<IProject> {
    // Get the next ID
    const lastProject = await Project.findOne().sort('-id').exec();
    const nextId = lastProject ? lastProject.id + 1 : 1;

    const project = new Project({
      ...projectData,
      id: nextId,
      slug: projectData.slug || this.generateSlug(projectData.title || '')
    });

    return await project.save();
  }

  async updateProject(id: number, updateData: Partial<IProject>): Promise<IProject | null> {
    return await Project.findOneAndUpdate(
      { id },
      { ...updateData, updatedAt: new Date() },
      { new: true }
    ).exec();
  }

  async deleteProject(id: number): Promise<boolean> {
    const result = await Project.deleteOne({ id }).exec();
    return result.deletedCount > 0;
  }

  async getProjectCounts(): Promise<{
    total: number;
    hng: number;
    personal: number;
    completed: number;
    inProgress: number;
  }> {
    if (this.useSeedData) {
      return {
        total: seedProjects.length,
        hng: seedProjects.filter((p: any) => p.type === 'hng').length,
        personal: seedProjects.filter((p: any) => p.type === 'personal').length,
        completed: seedProjects.filter((p: any) => p.status === 'completed').length,
        inProgress: seedProjects.filter((p: any) => p.status === 'in-progress').length
      };
    }

    try {
      const [total, hng, personal, completed, inProgress] = await Promise.all([
        Project.countDocuments(),
        Project.countDocuments({ type: 'hng' }),
        Project.countDocuments({ type: 'personal' }),
        Project.countDocuments({ status: 'completed' }),
        Project.countDocuments({ status: 'in-progress' })
      ]);

      return { total, hng, personal, completed, inProgress };
    } catch (error) {
      console.log('⚠️ Database count failed, using seed data');
      return {
        total: seedProjects.length,
        hng: seedProjects.filter((p: any) => p.type === 'hng').length,
        personal: seedProjects.filter((p: any) => p.type === 'personal').length,
        completed: seedProjects.filter((p: any) => p.status === 'completed').length,
        inProgress: seedProjects.filter((p: any) => p.status === 'in-progress').length
      };
    }
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();
  }
}
import mongoose from 'mongoose';
import { Project, IProject } from '../models/project.model';
import { Technology, ITechnology } from '../models/technology.model';
import { Contact } from '../models/contact.model'; // Add this import
import { projects, technologies } from '../data/projects.seed';

export class DatabaseService {
  private static instance: DatabaseService;
  private isConnected = false;

  private constructor() {}

  static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  async connect(): Promise<void> {
    if (this.isConnected) return;

    try {
      let mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio_db';
      
      // Clean up the URI if it has formatting issues
      mongoUri = this.cleanMongoUri(mongoUri);
      
      // Log connection attempt (without password)
      const safeUri = this.sanitizeUri(mongoUri);
      console.log(`🔗 Attempting to connect to MongoDB: ${safeUri}`);
      
      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 10000, // Timeout after 10 seconds
        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      });
      
      this.isConnected = true;
      console.log('✅ MongoDB connected successfully');
    } catch (error: any) {
      console.error('❌ MongoDB connection error:', error.message);
      console.log('💡 Troubleshooting tips:');
      console.log('1. Check your MONGODB_URI in .env file');
      console.log('2. Make sure MongoDB Atlas cluster is running');
      console.log('3. Check if your IP is whitelisted in Atlas');
      console.log('4. Try restarting with: MONGODB_URI=mongodb://localhost:27017/portfolio_db');
      throw error;
    }
  }

  private cleanMongoUri(uri: string): string {
    // Remove any duplicate "MONGODB_URI=" prefix
    uri = uri.replace(/^MONGODB_URI=/, '');
    
    // Trim whitespace
    uri = uri.trim();
    
    // Ensure it starts with proper protocol
    if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
      // Try to fix common issues
      if (uri.includes('mongodb')) {
        if (uri.includes('srv://')) {
          uri = 'mongodb+srv://' + uri.split('srv://')[1];
        } else {
          uri = 'mongodb://' + uri.split('://')[1];
        }
      }
    }
    
    return uri;
  }

  private sanitizeUri(uri: string): string {
    // Hide password from logs
    return uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@');
  }

  async disconnect(): Promise<void> {
    if (this.isConnected) {
      await mongoose.disconnect();
      this.isConnected = false;
      console.log('✅ MongoDB disconnected');
    }
  }

  async seedData(): Promise<void> {
    try {
      // Check if data already exists
      const projectCount = await Project.countDocuments();
      const techCount = await Technology.countDocuments();
      const contactCount = await Contact.countDocuments();

      if (projectCount > 0 && techCount > 0 && contactCount >= 0) {
        console.log(`📊 Data already seeded: ${projectCount} projects, ${techCount} technologies, ${contactCount} contacts`);
        return;
      }

      console.log('🌱 Starting database seeding...');

      // Clear existing data
      if (projectCount > 0) {
        console.log('🗑️  Clearing existing projects...');
        await Project.deleteMany({});
      }
      
      if (techCount > 0) {
        console.log('🗑️  Clearing existing technologies...');
        await Technology.deleteMany({});
      }
      
      // Don't clear contacts if they exist (preserve user messages)

      // Insert projects
      console.log(`📝 Inserting ${projects.length} projects...`);
      const projectPromises = projects.map(async (projectData, index) => {
        try {
          const project = new Project({
            ...projectData,
            createdAt: projectData.createdAt || new Date(),
            updatedAt: projectData.updatedAt || new Date()
          });
          await project.save();
          console.log(`   ✅ Project ${index + 1}/${projects.length}: "${projectData.title}"`);
        } catch (error: any) {
          console.error(`   ❌ Error inserting project "${projectData.title}":`, error.message);
        }
      });
      
      await Promise.all(projectPromises);

      // Insert technologies
      console.log(`\n📝 Inserting ${technologies.length} technologies...`);
      const techPromises = technologies.map(async (techData, index) => {
        try {
          const technology = new Technology(techData);
          await technology.save();
          console.log(`   ✅ Technology ${index + 1}/${technologies.length}: "${techData.name}"`);
        } catch (error: any) {
          console.error(`   ❌ Error inserting technology "${techData.name}":`, error.message);
        }
      });
      
      await Promise.all(techPromises);

      console.log('\n✅ Database seeded successfully');
      
      // Verify the seeding
      const finalProjectCount = await Project.countDocuments();
      const finalTechCount = await Technology.countDocuments();
      const finalContactCount = await Contact.countDocuments();
      console.log(`📊 Final counts: ${finalProjectCount} projects, ${finalTechCount} technologies, ${finalContactCount} contacts`);

    } catch (error: any) {
      console.error('❌ Error seeding database:', error.message);
      throw error;
    }
  }

  async getStats(): Promise<any> {
    const stats: any = {
      totalProjects: await Project.countDocuments(),
      completedProjects: await Project.countDocuments({ status: 'completed' }),
      inProgressProjects: await Project.countDocuments({ status: 'in-progress' }),
      hngProjects: await Project.countDocuments({ type: 'hng' }),
      personalProjects: await Project.countDocuments({ type: 'personal' }),
      totalContacts: await Contact.countDocuments(),
      unreadContacts: await Contact.countDocuments({ status: 'unread' }),
      technologiesByCategory: {}
    };

    // Get technology counts by category
    const techCategories = await Technology.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          technologies: { $push: '$name' }
        }
      }
    ]);

    techCategories.forEach((cat: any) => {
      stats.technologiesByCategory[cat._id] = {
        count: cat.count,
        technologies: cat.technologies
      };
    });

    return stats;
  }
}
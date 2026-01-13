import mongoose from 'mongoose';
import { Project, IProject } from '../models/project.model';
import { Technology, ITechnology } from '../models/technology.model';
import { Contact } from '../models/contact.model';
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
      mongoUri = this.cleanMongoUri(mongoUri);
      if (!mongoUri.includes('mongodb')) {
        throw new Error('Invalid MongoDB URI format');
      }
      const safeUri = this.sanitizeUri(mongoUri);
      console.log(`🔗 Attempting to connect to MongoDB: ${safeUri}`);
      
      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        maxPoolSize: 10,
        minPoolSize: 2,
      });
      
      this.isConnected = true;
      console.log('✅ MongoDB connected successfully');
      
      // Log connection details
      const dbName = mongoose.connection.db?.databaseName;
      console.log(`📦 Database: ${dbName}`);
      
    } catch (error: any) {
      console.error('❌ MongoDB connection error:', error.message);
      console.log('\n💡 Troubleshooting tips:');
      console.log('1. Verify MONGODB_URI is set in Fly.io secrets: fly secrets list -a perfectpearl-portfolio');
      console.log('2. Check MongoDB Atlas cluster is running at https://cloud.mongodb.com');
      console.log('3. Verify IP 0.0.0.0/0 is whitelisted in Atlas Network Access');
      console.log('4. Check database user credentials are correct');
      console.log('5. Ensure connection string includes database name: /portfolio_db?retryWrites=true');
      throw error;
    }
  }

  private cleanMongoUri(uri: string): string {
    uri = uri.replace(/^MONGODB_URI=/, '');
    uri = uri.trim().replace(/^["']|["']$/g, '');
    if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
      throw new Error('MongoDB URI must start with mongodb:// or mongodb+srv://');
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

      if (projectCount > 0 && techCount > 0) {
        console.log(`📊 Data already seeded: ${projectCount} projects, ${techCount} technologies, ${contactCount} contacts`);
        return;
      }

      console.log('🌱 Starting database seeding...');

      // Clear existing data
      await Project.deleteMany({});
      await Technology.deleteMany({});

      // Insert projects
      console.log(`📝 Inserting ${projects.length} projects...`);
      const insertedProjects = await Project.insertMany(projects);
      console.log(`   ✅ Inserted ${insertedProjects.length} projects`);

      // Insert technologies
      console.log(`📝 Inserting ${technologies.length} technologies...`);
      const insertedTechs = await Technology.insertMany(technologies);
      console.log(`   ✅ Inserted ${insertedTechs.length} technologies`);

      console.log('\n✅ Database seeded successfully');
      
      // Verify the seeding
      const finalProjectCount = await Project.countDocuments();
      const finalTechCount = await Technology.countDocuments();
      console.log(`📊 Final counts: ${finalProjectCount} projects, ${finalTechCount} technologies, ${contactCount} contacts`);

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
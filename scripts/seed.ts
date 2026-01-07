import dotenv from 'dotenv';
import { DatabaseService } from '../src/services/database.service';

dotenv.config();

async function seedDatabase() {
  const dbService = DatabaseService.getInstance();
  
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to database
    await dbService.connect();
    
    // Seed data
    await dbService.seedData();
    
    // Get stats
    const stats = await dbService.getStats();
    console.log('📊 Database Stats:', JSON.stringify(stats, null, 2));
    
    console.log('✅ Database seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await dbService.disconnect();
  }
}

seedDatabase();
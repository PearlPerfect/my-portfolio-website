import { Technology, ITechnology } from '../models/technology.model';

export class TechnologyService {
  async getAllTechnologies(): Promise<ITechnology[]> {
    return await Technology.find()
      .sort({ category: 1, order: 1 })
      .exec();
  }

  async getTechnologyByName(name: string): Promise<ITechnology | null> {
    return await Technology.findOne({ name }).exec();
  }

  async getTechnologiesByCategory(category: string): Promise<ITechnology[]> {
    return await Technology.find({ category })
      .sort({ proficiency: -1 })
      .exec();
  }

  async getTechnologyStats(): Promise<any> {
    const stats = await Technology.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          averageProficiency: { $avg: '$proficiency' },
          technologies: {
            $push: {
              name: '$name',
              proficiency: '$proficiency',
              icon: '$icon'
            }
          }
        }
      },
      {
        $project: {
          category: '$_id',
          count: 1,
          averageProficiency: { $round: ['$averageProficiency', 1] },
          technologies: { $slice: ['$technologies', 5] }
        }
      }
    ]);

    return stats;
  }

  async createTechnology(techData: Partial<ITechnology>): Promise<ITechnology> {
    const technology = new Technology(techData);
    return await technology.save();
  }

  async updateTechnology(name: string, updateData: Partial<ITechnology>): Promise<ITechnology | null> {
    return await Technology.findOneAndUpdate(
      { name },
      updateData,
      { new: true }
    ).exec();
  }

  async deleteTechnology(name: string): Promise<boolean> {
    const result = await Technology.deleteOne({ name }).exec();
    return result.deletedCount > 0;
  }
}
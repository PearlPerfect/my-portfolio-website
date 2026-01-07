import { Contact, IContact } from '../models/contact.model';

export class ContactService {
  async createContact(contactData: {
    name: string;
    email: string;
    subject: string;
    message: string;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<IContact> {
    const contact = new Contact(contactData);
    return await contact.save();
  }

  async getAllContacts(): Promise<IContact[]> {
    return await Contact.find()
      .sort({ createdAt: -1 })
      .exec();
  }

  async getContactById(id: string): Promise<IContact | null> {
    return await Contact.findById(id).exec();
  }

  async updateContactStatus(id: string, status: 'unread' | 'read' | 'replied' | 'archived'): Promise<IContact | null> {
    return await Contact.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).exec();
  }

  async deleteContact(id: string): Promise<boolean> {
    const result = await Contact.deleteOne({ _id: id }).exec();
    return result.deletedCount > 0;
  }

  async getContactStats(): Promise<any> {
    const stats = await Contact.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    return stats.reduce((acc, stat) => {
      acc[stat._id] = stat.count;
      return acc;
    }, { unread: 0, read: 0, replied: 0, archived: 0 });
  }

  async getRecentContacts(limit: number = 10): Promise<IContact[]> {
    return await Contact.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }
}
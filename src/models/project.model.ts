import mongoose, { Schema, Document } from 'mongoose';

export interface IApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  description: string;
  requestBody?: any;
  response: any;
  exampleRequest?: string;
  exampleResponse?: string;
}

export interface IProject extends Document {
  id: number;
  title: string;
  slug: string;
  description: string;
  longDescription: string;
  features: string[];
  technologies: string[];
  endpoints?: IApiEndpoint[];
  status: 'completed' | 'in-progress' | 'planned';
  githubUrl?: string;
  liveDemoUrl?: string;
  documentationUrl?: string;
  category: 'api' | 'microservice' | 'ai' | 'authentication' | 'payment' | 'web' | 'mobile' | 'tool' | 'database';
  complexity: 'beginner' | 'intermediate' | 'advanced';
  stage?: number;
  type: 'hng' | 'personal' | 'client' | 'open-source';
  imageUrl?: string;
  screenshots?: string[];
  videoDemoUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  highlights?: string[];
  challenges?: string[];
  lessonsLearned?: string[];
}

const ApiEndpointSchema = new Schema({
  method: {
    type: String,
    enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    required: true
  },
  path: { type: String, required: true },
  description: { type: String, required: true },
  requestBody: { type: Schema.Types.Mixed },
  response: { type: Schema.Types.Mixed, required: true },
  exampleRequest: String,
  exampleResponse: String
});

const ProjectSchema = new Schema({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  longDescription: { type: String, required: true },
  features: [{ type: String }],
  technologies: [{ type: String }],
  endpoints: [ApiEndpointSchema],
  status: {
    type: String,
    enum: ['completed', 'in-progress', 'planned'],
    default: 'completed'
  },
  githubUrl: String,
  liveDemoUrl: String,
  documentationUrl: String,
  category: {
    type: String,
    enum: ['api', 'microservice', 'ai', 'authentication', 'payment', 'web', 'mobile', 'tool', 'database']
  },
  complexity: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced']
  },
  stage: Number,
  type: {
    type: String,
    enum: ['hng', 'personal', 'client', 'open-source']
  },
  imageUrl: String,
  screenshots: [{ type: String }],
  videoDemoUrl: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  highlights: [{ type: String }],
  challenges: [{ type: String }],
  lessonsLearned: [{ type: String }]
}, {
  timestamps: true
});
ProjectSchema.index({ slug: 1 });
ProjectSchema.index({ category: 1 });
ProjectSchema.index({ type: 1 });
ProjectSchema.index({ technologies: 1 });
ProjectSchema.index({ status: 1 });

export const Project = mongoose.model<IProject>('Project', ProjectSchema);
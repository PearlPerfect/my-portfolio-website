import { IProject } from '../models/project.model';
import { ITechnology } from '../models/technology.model';

export const projects: Partial<IProject>[] = [
  // HNG Internship Projects (Stages 0-9)
  {
    id: 1,
    title: 'Dynamic Profile API',
    slug: 'dynamic-profile-api',
    description: 'RESTful API endpoint with external API integration',
    longDescription: 'A simple RESTful API endpoint that returns profile information along with dynamic cat facts fetched from an external API. Demonstrates third-party API consumption, JSON response formatting, and dynamic data handling.',
    features: [
      'GET endpoint returning JSON profile data',
      'Integration with Cat Facts API',
      'Dynamic timestamp generation',
      'Error handling for external API failures',
      'Proper CORS headers implementation'
    ],
    technologies: ['Node.js', 'TypeScript', 'Express', 'Axios'],
    endpoints: [
      {
        method: 'GET',
        path: '/me',
        description: 'Get profile information with dynamic cat fact',
        response: {
          status: 'success',
          user: {
            email: 'string',
            name: 'string',
            stack: 'string'
          },
          timestamp: 'string (ISO 8601)',
          fact: 'string'
        }
      }
    ],
    status: 'completed',
    githubUrl: 'https://github.com/PearlPerfect/hng13-task-zero',
    liveDemoUrl: 'https://hng13-task-zero.fly.dev/me/',
    category: 'api',
    complexity: 'beginner',
    stage: 0,
    type: 'hng',
    imageUrl: '/images/projects/profile-api.png',
    createdAt: new Date('2025-10-17'),
    updatedAt: new Date('2025-10-18'),
    highlights: [
      'Successfully integrated external API',
      'Implemented proper error handling',
      'Followed RESTful API design principles'
    ],
    challenges: [
      'Handling external API timeouts',
      'Ensuring data freshness'
    ],
    lessonsLearned: [
      'Importance of proper error handling',
      'Value of API documentation',
      'CORS configuration best practices'
    ]
  },
  {
    id: 2,
    title: 'String Analyzer Service',
    slug: 'string-analyzer-service',
    description: 'String analysis with natural language filtering',
    longDescription: 'A comprehensive RESTful API service that analyzes strings, computes various properties, and provides sophisticated filtering capabilities including natural language query processing.',
    features: [
      'String property analysis',
      'SHA-256 hash generation',
      'Natural language query processing',
      'Multiple filtering options',
      'Database persistence'
    ],
    technologies: ['Node.js', 'TypeScript', 'Express', 'PostgreSQL', 'Redis'],
    endpoints: [
      {
        method: 'POST',
        path: '/strings',
        description: 'Analyze and store a string',
        response: {
          id: 'string',
          value: 'string',
          properties: {
            length: 'number',
            is_palindrome: 'boolean',
            unique_characters: 'number',
            word_count: 'number',
            sha256_hash: 'string',
            character_frequency_map: 'object'
          },
          created_at: 'string'
        }
      },
      {
        method: 'GET',
        path: '/strings/{string_value}',
        description: 'Retrieve analyzed string by value',
        response: 'Object containing string analysis'
      }
    ],
    status: 'completed',
    githubUrl: 'https://github.com/PearlPerfect/string_analyzer',
    liveDemoUrl: 'https://string-analyzer-qkzbqq.fly.dev/strings',
    category: 'api',
    complexity: 'intermediate',
    stage: 1,
    type: 'hng',
    imageUrl: '/images/projects/string-analyzer.png',
    createdAt: new Date('2025-10-21'),
    updatedAt: new Date('2025-10-21')
  },
  {
    id: 3,
    title: 'Country Currency API',
    slug: 'country-currency-api',
    description: 'Country data with currency exchange and GDP calculation',
    longDescription: 'A RESTful API that fetches country data from external APIs, processes currency exchange rates, calculates estimated GDP, and provides comprehensive CRUD operations with image generation capabilities.',
    features: [
      'Country data fetching from REST Countries API',
      'Currency exchange rate integration',
      'GDP calculation with random multipliers',
      'Image generation for summaries',
      'Database caching and refresh mechanisms'
    ],
    technologies: ['Node.js', 'TypeScript', 'Express', 'MySQL', 'Canvas'],
    status: 'completed',
    githubUrl: 'https://github.com/PearlPerfect/country_api',
    liveDemoUrl: 'https://country-api-crimson-leaf-9797.fly.dev/countries',
    category: 'api',
    complexity: 'intermediate',
    stage: 2,
    type: 'hng',
    imageUrl: '/images/projects/country-api.png',
    createdAt: new Date('2025-10-25'),
    updatedAt: new Date('2025-02-27')
  },
  {
    id: 4,
    title: 'AI Agent System',
    slug: 'ai-agent-system',
    description: 'Intelligent AI agents integrated with Telex.im',
    longDescription: 'AI agents built using Mastra framework and integrated with Telex.im platform. Features holiday reminder agent with A2A protocol support and workflow management.',
    features: [
      'Mastra-based AI agents',
      'Telex.im A2A protocol integration',
      'Natural language processing',
      'Workflow management',
      'Real-time agent logs'
    ],
    technologies: ['TypeScript', 'Mastra', 'Node.js', 'Express'],
    status: 'completed',
    githubUrl: 'https://github.com/PearlPerfect/agent-reminder',
    liveDemoUrl:'https://agent-reminder.vercel.app/',
    category: 'ai',
    complexity: 'advanced',
    stage: 3,
    type: 'hng',
    imageUrl: '/images/projects/ai-agent.png',
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-03-01')
  },
  {
    id: 5,
    title: 'Microservices Notification System',
    slug: 'microservices-notification-system',
    description: 'Distributed notification system with message queues',
    longDescription: 'A microservices-based notification system implementing email and push notifications using RabbitMQ. Features circuit breakers, retry mechanisms, service discovery, and horizontal scalability.',
    features: [
      'Microservices architecture',
      'RabbitMQ message queues',
      'Circuit breaker pattern',
      'Exponential backoff retry',
      'Service discovery',
      'Health monitoring'
    ],
    technologies: ['Node.js', 'TypeScript', 'RabbitMQ', 'PostgreSQL', 'Redis', 'Docker'],
    status: 'completed',
    githubUrl: 'https://github.com/calculus-guy/HNG_FOUR_TASK',
    category: 'microservice',
    complexity: 'advanced',
    stage: 4,
    type: 'hng',
    imageUrl: '/images/projects/notification-system.png',
    createdAt: new Date('2025-11-10'),
    updatedAt: new Date('2025-11-10')
  },
  {
    id: 6,
    title: 'Authentication & API Key System',
    slug: 'auth-api-key-system',
    description: 'JWT authentication with service-to-service API keys',
    longDescription: 'Comprehensive authentication system supporting user login via JWT and service-to-service access via API keys with permissions management, expiration, and revocation capabilities.',
    features: [
      'JWT authentication',
      'API key generation and management',
      'Permission-based access control',
      'Key expiration and revocation',
      'Rate limiting'
    ],
    technologies: ['Node.js', 'TypeScript', 'Express', 'JWT', 'PostgreSQL'],
    status: 'completed',
    githubUrl: 'https://github.com/PearlPerfect/auth_and_api_mgt_system',
    // liveDemoUrl: '/demo/auth',
    category: 'authentication',
    complexity: 'intermediate',
    stage: 7,
    type: 'hng',
    imageUrl: '/images/projects/auth-system.png',
    createdAt: new Date('2025-12-08'),
    updatedAt: new Date('2025-04-08')
  },
  {
    id: 7,
    title: 'Wallet Service with Paystack',
    slug: 'wallet-service-paystack',
    description: 'Payment wallet system with Paystack integration',
    longDescription: 'Full-featured wallet service implementing deposits via Paystack, wallet-to-wallet transfers, transaction history, and dual authentication (JWT + API keys) with webhook handling.',
    features: [
      'Paystack payment integration',
      'Wallet management',
      'Fund transfers',
      'Webhook handling',
      'Dual authentication system',
      'Transaction history'
    ],
    technologies: ['Node.js', 'TypeScript', 'Express', 'Paystack', 'PostgreSQL', 'JWT'],
    status: 'completed',
    githubUrl: 'https://github.com/PearlPerfect/wallet-service',
    liveDemoUrl: 'https://wallet-service-83s5.onrender.com/api-docs/',
    category: 'payment',
    complexity: 'advanced',
    stage: 8,
    type: 'hng',
    imageUrl: '/images/projects/wallet-service.png',
    createdAt: new Date('2025-12-10'),
    updatedAt: new Date('2025-12-13')
  },
  {
    id: 8,
    title: 'Developer Portfolio Website',
    slug: 'developer-portfolio',
    description: 'Complete portfolio website with API documentation',
    longDescription: 'A comprehensive portfolio website built with Node.js, TypeScript, and Express. Features project showcases, API documentation, contact forms, and Swagger integration.',
    features: [
      'Responsive design with EJS templates',
      'Project filtering and search',
      'API documentation with Swagger',
      'Contact form with validation',
      'Dark/light theme toggle',
      'Smooth animations'
    ],
    technologies: ['Node.js', 'TypeScript', 'Express', 'EJS', 'Swagger', 'PostgreSQL'],
    status: 'completed',
    githubUrl: 'https://github.com/PearlPerfect/backend-portfolio',
    liveDemoUrl: 'https://your-portfolio.onrender.com/docs',
    category: 'web',
    complexity: 'intermediate',
    stage: 9,
    type: 'hng',
    imageUrl: '/images/projects/portfolio.png',
    createdAt: new Date('2025-12-17'),
    updatedAt: new Date('2025-12-17')
  },

  // Personal Projects
  {
    id: 9,
    title: 'E-commerce Platform',
    slug: 'ecommerce-platform',
    description: 'Full-stack e-commerce platform with payment integration',
    longDescription: 'A complete e-commerce solution built with microservices architecture. Features include user authentication, product catalog, shopping cart, payment processing, order management, and admin dashboard.',
    features: [
      'User authentication and authorization',
      'Product catalog with search and filters',
      'Shopping cart and checkout',
      'Stripe payment integration',
      'Order tracking and management',
      'Admin dashboard',
      'Email notifications',
      'Product reviews and ratings'
    ],
    technologies: ['Node.js', 'TypeScript', 'Express', 'React', 'PostgreSQL', 'Redis', 'Docker', 'Stripe'],
    status: 'in-progress',
    githubUrl: 'https://github.com/PearlPerfect/ecommerce-platform',
    liveDemoUrl: 'https://demo-ecommerce.example.com',
    category: 'web',
    complexity: 'advanced',
    type: 'personal',
    imageUrl: '/images/projects/ecommerce.png',
    screenshots: [
      '/images/screenshots/ecommerce-1.png',
      '/images/screenshots/ecommerce-2.png',
      '/images/screenshots/ecommerce-3.png'
    ],
    videoDemoUrl: 'https://youtube.com/your-demo-video',
    createdAt: new Date('2026-01-02'),
    updatedAt: new Date('2026-01-02'),
    highlights: [
      'Built microservices architecture',
      'Implemented real-time order updates',
      'Achieved 99.9% uptime in production',
      'Processed $50,000+ in transactions'
    ],
    challenges: [
      'Managing distributed transactions',
      'Handling payment gateway webhooks',
      'Optimizing database queries for large catalogs'
    ],
    lessonsLearned: [
      'Microservices communication patterns',
      'Payment gateway integration best practices',
      'Database optimization techniques'
    ]
  },
  {
    id: 10,
    title: 'Task Management App',
    slug: 'task-management-app',
    description: 'Real-time collaborative task management application',
    longDescription: 'A real-time task management application with team collaboration features. Includes task assignment, progress tracking, file attachments, and real-time notifications.',
    features: [
      'Real-time collaboration',
      'Task assignment and tracking',
      'File attachments',
      'Progress analytics',
      'Team management',
      'Email notifications',
      'Mobile responsive'
    ],
    technologies: ['Node.js', 'Socket.io', 'MongoDB', 'React Native', 'AWS S3'],
    status: 'in-progress',
    githubUrl: 'https://github.com/PearlPerfect/task-management',
    liveDemoUrl: 'https://tasks.example.com',
    category: 'web',
    complexity: 'intermediate',
    type: 'personal',
    imageUrl: '/images/projects/task-manager.png',
    createdAt: new Date('2025-12-15'),
    updatedAt: new Date('2025-12-20')
  },
  {
    id: 11,
    title: 'AI Content Generator',
    slug: 'ai-content-generator',
    description: 'AI-powered content generation platform',
    longDescription: 'A platform that uses OpenAI GPT models to generate various types of content including blog posts, social media content, and marketing copy. Features template management, content scheduling, and analytics.',
    features: [
      'Multiple content generation templates',
      'Content scheduling',
      'Performance analytics',
      'Team collaboration',
      'API for external integration',
      'Export to various formats'
    ],
    technologies: ['Python', 'FastAPI', 'OpenAI API', 'PostgreSQL', 'Next.js', 'Tailwind CSS'],
    status: 'in-progress',
    githubUrl: 'https://github.com/PearlPerfect/ai-content-generator',
    category: 'ai',
    complexity: 'advanced',
    type: 'personal',
    imageUrl: '/images/projects/ai-content.png',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-03-01')
  },
  {
    id: 12,
    title: 'Mobile Expense Tracker',
    slug: 'mobile-expense-tracker',
    description: 'Cross-platform mobile app for expense tracking',
    longDescription: 'A React Native mobile application for tracking expenses, with features for budget planning, expense categorization, and financial reports.',
    features: [
      'Expense tracking and categorization',
      'Budget planning',
      'Monthly reports',
      'Data export',
      'Offline functionality',
      'Biometric authentication'
    ],
    technologies: ['React Native', 'Expo', 'Firebase', 'Redux', 'Chart.js'],
    status: 'completed',
    githubUrl: 'https://github.com/PearlPerfect/expense-tracker',
    category: 'mobile',
    complexity: 'intermediate',
    type: 'personal',
    imageUrl: '/images/projects/expense-tracker.png',
    createdAt: new Date('2023-08-10'),
    updatedAt: new Date('2023-11-05')
  },
  {
    id: 13,
    title: 'DevOps Automation Tools',
    slug: 'devops-automation-tools',
    description: 'Collection of DevOps automation scripts and tools',
    longDescription: 'A collection of reusable DevOps automation scripts for CI/CD pipeline setup, infrastructure as code, monitoring, and deployment automation.',
    features: [
      'Terraform configurations for AWS',
      'Docker compose setups',
      'GitHub Actions workflows',
      'Monitoring dashboards',
      'Backup automation scripts',
      'Security scanning tools'
    ],
    technologies: ['Terraform', 'Docker', 'GitHub Actions', 'AWS', 'Bash', 'Python'],
    status: 'completed',
    githubUrl: 'https://github.com/PearlPerfect/devops-tools',
    category: 'tool',
    complexity: 'advanced',
    type: 'open-source',
    imageUrl: '/images/projects/devops-tools.png',
    createdAt: new Date('2024-07-01'),
    updatedAt: new Date('2026-01-02')
  },
  {
    id: 14,
    title: 'Healthcare Management System',
    slug: 'healthcare-management-system',
    description: 'Comprehensive healthcare management system for clinics',
    longDescription: 'A HIPAA-compliant healthcare management system for medical clinics featuring patient management, appointment scheduling, electronic health records, and billing integration.',
    features: [
      'Patient management portal',
      'Appointment scheduling',
      'Electronic health records',
      'Billing and invoicing',
      'Lab result integration',
      'Telemedicine support',
      'Mobile app for patients'
    ],
    technologies: ['python', 'Django', 'React', 'MySQL', 'AWS', 'Docker'],
    status: 'in-progress',
    liveDemoUrl: 'https://healthcare-client.example.com',
    category: 'web',
    complexity: 'advanced',
    type: 'client',
    imageUrl: '/images/projects/healthcare-system.png',
    createdAt: new Date('2023-05-01'),
    updatedAt: new Date('2023-10-15'),
    highlights: [
      'Built HIPAA-compliant solution',
      'Reduced clinic administrative time by 40%',
      'Integrated with 3rd party lab systems',
      'Handled 10,000+ patient records'
    ]
  },
  {
    id: 15,
    title: 'Real Estate Platform',
    slug: 'real-estate-platform',
    description: 'Real estate listing and management platform',
    longDescription: 'A comprehensive platform for real estate agencies to manage listings, client relationships, and property viewings. Features include virtual tours, document management, and analytics.',
    features: [
      'Property listing management',
      'Virtual tour integration',
      'Client relationship management',
      'Document management',
      'Analytics dashboard',
      'Mobile app for agents'
    ],
    technologies: ['Node.js', 'NestJS', 'Angular', 'PostgreSQL', 'Firebase', 'Mapbox'],
    status: 'in-progress',
    liveDemoUrl: 'https://realestate-client.example.com',
    category: 'web',
    complexity: 'advanced',
    type: 'client',
    imageUrl: '/images/projects/real-estate.png',
    createdAt: new Date('2025-06-15'),
    updatedAt: new Date('2026-01-03')
  }
];

export const technologies: Partial<ITechnology>[] = [
  // Backend
  { name: 'Node.js', icon: 'nodejs', category: 'backend', proficiency: 5, order: 1 },
  { name: 'TypeScript', icon: 'typescript', category: 'backend', proficiency: 5, order: 2 },
  { name: 'Express', icon: 'express', category: 'backend', proficiency: 5, order: 3 },
  { name: 'NestJS', icon: 'nestjs', category: 'backend', proficiency: 4, order: 4 },
  { name: 'Python', icon: 'python', category: 'backend', proficiency: 4, order: 5 },
  { name: 'FastAPI', icon: 'fastapi', category: 'backend', proficiency: 3, order: 6 },
  { name: 'Java', icon: 'java', category: 'backend', proficiency: 2, order: 7 },
  { name: 'Spring Boot', icon: 'spring', category: 'backend', proficiency: 1, order: 8 },
  
  // Frontend
  { name: 'HTML', icon: 'html5', category: 'frontend', proficiency: 5, order: 1 },
  { name: 'CSS', icon: 'css3', category: 'frontend', proficiency: 5, order: 2 },
  { name: 'Javascript', icon: 'javascript', category: 'frontend', proficiency: 5, order: 3 },  
  { name: 'React', icon: 'react', category: 'frontend', proficiency: 4, order: 4 },
  { name: 'Next.js', icon: 'nextjs', category: 'frontend', proficiency: 4, order: 5 },
  { name: 'Angular', icon: 'angular', category: 'frontend', proficiency: 1, order: 6 },
  { name: 'Vue.js', icon: 'vuejs', category: 'frontend', proficiency: 3, order: 7 },
   { name: 'Bootstrap', icon: 'bootstrap', category: 'frontend', proficiency: 4, order: 8 },
  { name: 'Tailwind CSS', icon: 'tailwind', category: 'frontend', proficiency: 4, order: 9 },
  { name: 'MUI', icon: 'mui', category: 'frontend', proficiency: 4, order: 10 },

  // Mobile
  { name: 'React Native', icon: 'react', category: 'mobile', proficiency: 3, order: 1 },
  { name: 'Expo', icon: 'expo', category: 'mobile', proficiency: 1, order: 2 },
  { name: 'Flutter', icon: 'flutter', category: 'mobile', proficiency: 1, order: 3 },
  
  // Database
  { name: 'PostgreSQL', icon: 'postgresql', category: 'database', proficiency: 5, order: 1 },
  { name: 'MongoDB', icon: 'mongodb', category: 'database', proficiency: 5, order: 2 },
  { name: 'MySQL', icon: 'mysql', category: 'database', proficiency: 5, order: 3 },
  { name: 'Redis', icon: 'redis', category: 'database', proficiency: 4, order: 4 },
  { name: 'Firebase', icon: 'firebase', category: 'database', proficiency: 4, order: 5 },
  { name: 'SQLite', icon: 'sqlite', category: 'database', proficiency: 5, order: 6 },
  { name: 'TypeORM', icon: 'typeorm', category: 'database', proficiency: 4, order: 7 },
  { name: 'Prisma', icon: 'prisma', category: 'database', proficiency: 4, order: 8 },
  {name: 'Supabase', icon: 'supabase', category: 'database', proficiency: 5, order: 9 },
  
  // Cloud & DevOps
  { name: 'AWS', icon: 'aws', category: 'cloud', proficiency: 3, order: 1 },
  { name: 'Docker', icon: 'docker', category: 'cloud', proficiency: 4, order: 2 },
  { name: 'Kubernetes', icon: 'kubernetes', category: 'cloud', proficiency: 1, order: 3 },
  { name: 'Terraform', icon: 'terraform', category: 'cloud', proficiency: 1, order: 4 },
  { name: 'GitHub Actions', icon: 'github', category: 'cloud', proficiency: 4, order: 5 },
  
  // Tools
  { name: 'Git', icon: 'git', category: 'tool', proficiency: 5, order: 1 },
  { name: 'Webpack', icon: 'webpack', category: 'tool', proficiency: 4, order: 2 },
  { name: 'Jest', icon: 'jest', category: 'tool', proficiency: 4, order: 3 },
  { name: 'Cypress', icon: 'cypress', category: 'tool', proficiency: 3, order: 4 },
  { name: 'Socket.io', icon: 'socketio', category: 'tool', proficiency: 1, order: 5 },
  
  // AI/ML
  { name: 'OpenAI API', icon: 'openai', category: 'ai', proficiency: 4, order: 1 },
  { name: 'TensorFlow', icon: 'tensorflow', category: 'ai', proficiency: 2, order: 2 },
  { name: 'PyTorch', icon: 'pytorch', category: 'ai', proficiency: 2, order: 3 }
];
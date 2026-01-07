# Portfolio Website

A responsive portfolio website built with Node.js, TypeScript, Express, EJS, and MongoDB featuring dark/light mode toggle.

## Features

- 🌙 Light/Dark mode toggle
- 📱 Fully responsive design
- 🗄️ MongoDB database integration
- 🔍 Project filtering and search
- 📊 Technology proficiency visualization
- 🚀 RESTful API endpoints
- ⚡ Fast performance with caching
- 🔒 Secure session management

## Tech Stack

- **Backend**: Node.js, TypeScript, Express
- **Database**: MongoDB with Mongoose
- **Frontend**: EJS templates, CSS3, JavaScript
- **Styling**: Custom CSS with CSS variables
- **Icons**: Font Awesome
- **Fonts**: Google Fonts (Inter)

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd portfolio-website
Install dependencies:

bash
npm install
Configure environment variables:

bash
cp .env.example .env
# Edit .env with your configuration
Start MongoDB:

bash
# If you have MongoDB installed locally
mongod

# Or use Docker
docker-compose up mongodb
Seed the database:

bash
npm run seed
Start the development server:

bash
npm run dev
Visit http://localhost:3000 in your browser.

Project Structure
text
src/
├── controllers/     # Request handlers
├── models/         # MongoDB schemas
├── routes/         # Route definitions
├── services/       # Business logic
├── utils/          # Utility functions
├── views/          # EJS templates
├── public/         # Static assets
├── data/           # Seed data
└── app.ts          # Main application
API Endpoints
Public APIs
GET /api/me - Get profile information with cat fact

GET /api/projects - Get all projects (with filters)

GET /api/projects/:slug - Get project by slug

GET /api/technologies - Get all technologies

GET /api/stats - Get portfolio statistics

Web Pages
/ - Home page

/projects - All projects with filters

/projects/hng - HNG internship projects

/projects/:slug - Project details

/about - About page

/contact - Contact page

/api-docs - API documentation

Deployment
Render.com
Create a new Web Service

Connect your GitHub repository

Set build command: npm run build

Set start command: npm start

Add environment variables

Heroku
bash
heroku create
heroku addons:create mongolab
git push heroku main
Docker
bash
# Build and run with Docker Compose
docker-compose up -d

# Or build manually
docker build -t portfolio-website .
docker run -p 3000:3000 portfolio-website
Environment Variables
env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/portfolio_db
SESSION_SECRET=your-secret-key-change-in-production
Development
bash
# Development with hot reload
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Run tests
npm test

# Lint code
npm run lint
Contributing
Fork the repository

Create a feature branch

Commit your changes

Push to the branch

Open a Pull Request

License
MIT License - see LICENSE file for details.

Support
For support, please open an issue in the GitHub repository or contact the maintainer.

text

## Step 19: Run the Application

```bash
# Start MongoDB (if not running)
mongod

# In a new terminal
cd portfolio-website

# Install dependencies
npm install

# Seed the database with your projects
npm run seed

# Start the development server
npm run dev
Step 20: Access Your Portfolio
Open your browser

Navigate to http://localhost:3000

Your portfolio website is now running!
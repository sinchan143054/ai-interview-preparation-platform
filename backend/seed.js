const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Question = require('./models/Question');

const MONGO_URL = process.env.MONGO_URL;
const DB_NAME = process.env.DB_NAME;

const seedData = async () => {
  try {
    await mongoose.connect(`${MONGO_URL}/${DB_NAME}`);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Question.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create users with different roles
    const hashedPassword = await bcrypt.hash('password123', 10);

    const users = [
      {
        name: 'Super Admin',
        email: 'superadmin@interview.com',
        password: hashedPassword,
        role: 'superadmin',
      },
      {
        name: 'Admin User',
        email: 'admin@interview.com',
        password: hashedPassword,
        role: 'admin',
      },
      {
        name: 'Reviewer',
        email: 'reviewer@interview.com',
        password: hashedPassword,
        role: 'reviewer',
      },
      {
        name: 'Test Candidate',
        email: 'candidate@interview.com',
        password: hashedPassword,
        role: 'candidate',
      },
    ];

    await User.insertMany(users);
    console.log('👥 Created users with roles');

    // Create sample questions
    const questions = [
      // Frontend - Easy
      {
        domain: 'frontend',
        difficulty: 'easy',
        question: 'What is React and why is it popular?',
        modelAnswer:
          'React is a JavaScript library for building user interfaces, particularly single-page applications. It is popular because of its component-based architecture, virtual DOM for efficient updates, reusable components, and strong community support. React makes it easier to manage complex UIs and provides excellent performance.',
        keywords: ['javascript', 'library', 'ui', 'component', 'virtual dom', 'reusable'],
        category: 'general',
      },
      {
        domain: 'frontend',
        difficulty: 'easy',
        question: 'What is the difference between HTML and CSS?',
        modelAnswer:
          'HTML (HyperText Markup Language) is used to structure content on the web, defining elements like headings, paragraphs, and links. CSS (Cascading Style Sheets) is used to style and layout those elements, controlling colors, fonts, spacing, and positioning. HTML provides the structure while CSS provides the presentation.',
        keywords: ['html', 'css', 'structure', 'styling', 'markup', 'layout'],
        category: 'general',
      },

      // Frontend - Medium
      {
        domain: 'frontend',
        difficulty: 'medium',
        question: 'Explain the concept of state management in React.',
        modelAnswer:
          'State management in React refers to handling data that changes over time within components. useState hook manages local state, while useContext or state management libraries like Redux or Zustand handle global state. Proper state management ensures data flows predictably, components re-render efficiently, and the application remains maintainable.',
        keywords: ['state', 'useState', 'redux', 'context', 'data flow', 'hooks'],
        category: 'technical',
      },
      {
        domain: 'frontend',
        difficulty: 'medium',
        question: 'What are React hooks and why were they introduced?',
        modelAnswer:
          'React Hooks are functions that let you use state and lifecycle features in functional components. They were introduced to avoid class components complexity, enable better code reuse through custom hooks, and make React code more readable and maintainable. Common hooks include useState, useEffect, useContext, and useRef.',
        keywords: ['hooks', 'useState', 'useEffect', 'functional components', 'lifecycle'],
        category: 'technical',
      },

      // Frontend - Hard
      {
        domain: 'frontend',
        difficulty: 'hard',
        question: 'Explain Virtual DOM and reconciliation in React.',
        modelAnswer:
          'Virtual DOM is a lightweight copy of the actual DOM. When state changes, React creates a new Virtual DOM tree and compares it with the previous one using a diffing algorithm. This process is called reconciliation. React then efficiently updates only the changed parts in the real DOM, minimizing expensive DOM operations and improving performance.',
        keywords: ['virtual dom', 'reconciliation', 'diffing', 'performance', 'optimization'],
        category: 'technical',
      },

      // Backend - Easy
      {
        domain: 'backend',
        difficulty: 'easy',
        question: 'What is an API and why is it important?',
        modelAnswer:
          'API (Application Programming Interface) is a set of rules and protocols that allows different software applications to communicate with each other. APIs are important because they enable data exchange between systems, promote code reusability, allow third-party integrations, and support microservices architecture.',
        keywords: ['api', 'interface', 'communication', 'integration', 'protocol'],
        category: 'general',
      },
      {
        domain: 'backend',
        difficulty: 'easy',
        question: 'What is the difference between GET and POST HTTP methods?',
        modelAnswer:
          'GET is used to retrieve data from a server and parameters are sent in the URL. It is idempotent and can be cached. POST is used to send data to the server to create or update resources. Data is sent in the request body, it is not idempotent, and responses are not cached by default.',
        keywords: ['http', 'get', 'post', 'request', 'method', 'rest'],
        category: 'general',
      },

      // Backend - Medium
      {
        domain: 'backend',
        difficulty: 'medium',
        question: 'Explain RESTful API design principles.',
        modelAnswer:
          'RESTful APIs follow these principles: Use HTTP methods appropriately (GET, POST, PUT, DELETE), implement stateless communication, use meaningful resource URIs, return proper status codes, support JSON format, implement proper error handling, and use versioning. REST ensures scalability, simplicity, and standardization.',
        keywords: ['rest', 'http methods', 'stateless', 'uri', 'json', 'scalability'],
        category: 'technical',
      },
      {
        domain: 'backend',
        difficulty: 'medium',
        question: 'What is middleware in Express.js?',
        modelAnswer:
          'Middleware in Express.js are functions that have access to the request, response, and next middleware function. They can execute code, modify request/response objects, end the request-response cycle, or call the next middleware. Common uses include authentication, logging, error handling, and parsing request bodies.',
        keywords: ['middleware', 'express', 'request', 'response', 'authentication', 'next'],
        category: 'technical',
      },

      // Backend - Hard
      {
        domain: 'backend',
        difficulty: 'hard',
        question: 'Explain database indexing and its impact on performance.',
        modelAnswer:
          'Database indexing creates a data structure that improves the speed of data retrieval operations. Indexes work like a book index, allowing the database to find data without scanning every row. They significantly speed up SELECT queries but slow down INSERT, UPDATE, and DELETE operations. Proper indexing strategy considers query patterns, data size, and write frequency.',
        keywords: ['database', 'indexing', 'performance', 'query', 'optimization', 'btree'],
        category: 'technical',
      },

      // Full Stack - Easy
      {
        domain: 'fullstack',
        difficulty: 'easy',
        question: 'What does full-stack development mean?',
        modelAnswer:
          'Full-stack development involves working on both frontend (client-side) and backend (server-side) of web applications. A full-stack developer handles user interfaces, server logic, databases, and API integration. It requires knowledge of HTML/CSS/JavaScript for frontend and languages like Node.js, Python, or Java for backend.',
        keywords: ['fullstack', 'frontend', 'backend', 'database', 'api', 'development'],
        category: 'general',
      },

      // Full Stack - Medium
      {
        domain: 'fullstack',
        difficulty: 'medium',
        question: 'How would you implement authentication in a full-stack application?',
        modelAnswer:
          'Authentication can be implemented using JWT tokens. User credentials are verified on the backend, a signed JWT token is generated and sent to the client. The client stores it (localStorage/cookie) and includes it in subsequent requests via Authorization header. Backend middleware validates the token. For enhanced security, implement refresh tokens, HTTPS, password hashing with bcrypt, and CORS policies.',
        keywords: ['authentication', 'jwt', 'token', 'security', 'bcrypt', 'authorization'],
        category: 'technical',
      },

      // Full Stack - Hard
      {
        domain: 'fullstack',
        difficulty: 'hard',
        question: 'Design a scalable architecture for a real-time chat application.',
        modelAnswer:
          'A scalable real-time chat requires: WebSocket servers (Socket.io) for bidirectional communication, load balancers to distribute connections, Redis for pub/sub messaging between server instances, message queues for reliable delivery, MongoDB for message persistence, microservices for auth/presence/notifications, CDN for static assets, and horizontal scaling with containerization (Docker/Kubernetes).',
        keywords: ['websocket', 'scalability', 'redis', 'microservices', 'load balancer', 'real-time'],
        category: 'system-design',
      },
    ];

    await Question.insertMany(questions);
    console.log('📝 Created sample questions');

    console.log('\n✅ Seed data created successfully!');
    console.log('\n📋 Admin Credentials:');
    console.log('Super Admin: superadmin@interview.com / password123');
    console.log('Admin: admin@interview.com / password123');
    console.log('Reviewer: reviewer@interview.com / password123');
    console.log('Candidate: candidate@interview.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedData();

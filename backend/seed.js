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

      // Additional Frontend Questions
      {
        domain: 'frontend',
        difficulty: 'medium',
        question: 'What is the difference between controlled and uncontrolled components in React?',
        modelAnswer:
          'Controlled components have their state managed by React through props and state. The component value is controlled by React state and updated via event handlers. Uncontrolled components store their own state internally using refs, similar to traditional HTML form elements. Controlled components provide more control and validation, while uncontrolled components are simpler for basic forms.',
        keywords: ['controlled', 'uncontrolled', 'components', 'state', 'refs', 'forms'],
        category: 'technical',
      },
      {
        domain: 'frontend',
        difficulty: 'hard',
        question: 'Explain code splitting and lazy loading in React applications.',
        modelAnswer:
          'Code splitting breaks the application bundle into smaller chunks that are loaded on demand. React.lazy() enables dynamic imports for components, and Suspense provides a fallback UI during loading. This reduces initial bundle size, improves load time, and enhances performance. Webpack automatically handles code splitting with dynamic imports. Best practices include splitting routes, large components, and third-party libraries.',
        keywords: ['code splitting', 'lazy loading', 'React.lazy', 'Suspense', 'dynamic import', 'webpack'],
        category: 'technical',
      },

      // Additional Backend Questions  
      {
        domain: 'backend',
        difficulty: 'medium',
        question: 'What is JWT authentication and how does it work?',
        modelAnswer:
          'JWT (JSON Web Token) is a stateless authentication mechanism. After login, the server generates a signed token containing user data and sends it to the client. The client stores it and includes it in subsequent requests via the Authorization header. The server verifies the token signature without database lookups. JWTs consist of header, payload, and signature, encoded in Base64. Benefits include statelessness, scalability, and cross-domain support.',
        keywords: ['jwt', 'authentication', 'token', 'stateless', 'authorization', 'signature'],
        category: 'technical',
      },
      {
        domain: 'backend',
        difficulty: 'hard',
        question: 'Explain database transactions and ACID properties.',
        modelAnswer:
          'Database transactions are sequences of operations treated as a single unit. ACID ensures reliability: Atomicity (all or nothing execution), Consistency (valid state transitions), Isolation (concurrent transactions don\'t interfere), and Durability (committed changes persist). Transactions use BEGIN, COMMIT, and ROLLBACK. They prevent data corruption, ensure integrity, and handle concurrent access through locking mechanisms.',
        keywords: ['transactions', 'acid', 'atomicity', 'consistency', 'isolation', 'durability', 'database'],
        category: 'technical',
      },
      {
        domain: 'backend',
        difficulty: 'easy',
        question: 'What is the purpose of environment variables?',
        modelAnswer:
          'Environment variables store configuration values outside the codebase, such as API keys, database URLs, and secrets. They enable different configurations for development, staging, and production without code changes. Benefits include security (sensitive data not in code), flexibility (easy configuration changes), and portability. They are accessed via process.env in Node.js and loaded from .env files using libraries like dotenv.',
        keywords: ['environment variables', 'configuration', 'security', 'secrets', 'dotenv', 'process.env'],
        category: 'general',
      },

      // Additional Full Stack Questions
      {
        domain: 'fullstack',
        difficulty: 'medium',
        question: 'How would you handle file uploads in a full-stack application?',
        modelAnswer:
          'File uploads require frontend form with multipart/form-data encoding, backend middleware like Multer (Node.js) to parse files, validation for file type and size, storage options (local disk, cloud storage like S3), and security measures. Implementation includes: client-side preview, progress indicators, server-side validation, secure file naming, virus scanning, and CDN delivery for uploaded files. Consider chunked uploads for large files.',
        keywords: ['file upload', 'multipart', 'multer', 'storage', 's3', 'validation', 'security'],
        category: 'technical',
      },
      {
        domain: 'fullstack',
        difficulty: 'hard',
        question: 'Design a caching strategy for a high-traffic web application.',
        modelAnswer:
          'A comprehensive caching strategy includes: Browser caching (Cache-Control headers), CDN caching for static assets, Redis/Memcached for database query results and session data, API response caching with proper TTL, and cache invalidation strategies. Implement cache-aside pattern, use cache keys effectively, handle cache stampede with locks, monitor cache hit rates, and implement stale-while-revalidate for better UX. Consider different cache layers and invalidation policies.',
        keywords: ['caching', 'redis', 'cdn', 'cache-control', 'ttl', 'invalidation', 'performance'],
        category: 'system-design',
      },
      {
        domain: 'fullstack',
        difficulty: 'easy',
        question: 'What is CORS and why is it important?',
        modelAnswer:
          'CORS (Cross-Origin Resource Sharing) is a security mechanism that allows or restricts resources on a web server to be accessed from a different domain. Browsers block cross-origin requests by default for security. CORS headers (Access-Control-Allow-Origin) enable controlled access. It\'s important for API security, preventing unauthorized access, and enabling legitimate cross-domain requests. Properly configured CORS protects against CSRF attacks.',
        keywords: ['cors', 'cross-origin', 'security', 'headers', 'access-control', 'same-origin policy'],
        category: 'general',
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

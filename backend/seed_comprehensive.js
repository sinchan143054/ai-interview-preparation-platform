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

    // Create comprehensive question bank
    const questions = [];

    // =========================
    // FRONTEND DOMAIN (30 questions: 10 easy, 10 medium, 10 hard)
    // =========================
    
    // Frontend - Easy (10 questions)
    questions.push(
      {
        domain: 'frontend',
        difficulty: 'easy',
        question: 'What is HTML and what is its purpose?',
        modelAnswer: 'HTML (HyperText Markup Language) is the standard markup language for creating web pages. It structures content on the web using elements like headings, paragraphs, links, images, and forms. HTML provides the skeleton of web pages and works with CSS for styling and JavaScript for interactivity.',
        keywords: ['html', 'markup', 'structure', 'elements', 'web pages'],
        category: 'general',
      },
      {
        domain: 'frontend',
        difficulty: 'easy',
        question: 'What is CSS and how does it work?',
        modelAnswer: 'CSS (Cascading Style Sheets) is a stylesheet language used to describe the presentation of HTML elements. It controls layout, colors, fonts, spacing, and responsive design. CSS works by selecting HTML elements and applying style rules. Styles cascade from multiple sources and are applied based on specificity.',
        keywords: ['css', 'stylesheet', 'styling', 'selectors', 'cascading'],
        category: 'general',
      },
      {
        domain: 'frontend',
        difficulty: 'easy',
        question: 'What is JavaScript and why is it used?',
        modelAnswer: 'JavaScript is a programming language that enables interactive web pages. It runs in the browser and allows dynamic content updates, form validation, animations, and API calls. JavaScript is essential for modern web development, enabling rich user experiences without page reloads.',
        keywords: ['javascript', 'programming', 'interactive', 'dynamic', 'browser'],
        category: 'general',
      },
      {
        domain: 'frontend',
        difficulty: 'easy',
        question: 'What is the DOM (Document Object Model)?',
        modelAnswer: 'The DOM is a programming interface for HTML documents. It represents the page structure as a tree of objects that JavaScript can manipulate. Each HTML element becomes a node in the DOM tree. JavaScript can add, remove, or modify these nodes to dynamically update page content and structure.',
        keywords: ['dom', 'document', 'tree', 'nodes', 'javascript', 'manipulation'],
        category: 'general',
      },
      {
        domain: 'frontend',
        difficulty: 'easy',
        question: 'What is the difference between let, const, and var in JavaScript?',
        modelAnswer: 'var has function scope and can be redeclared, with hoisting behavior. let has block scope, cannot be redeclared in the same scope, and is not initialized until declaration. const also has block scope, cannot be redeclared or reassigned, and must be initialized at declaration. Modern JavaScript prefers let and const over var.',
        keywords: ['let', 'const', 'var', 'scope', 'hoisting', 'variables'],
        category: 'general',
      },
      {
        domain: 'frontend',
        difficulty: 'easy',
        question: 'What are HTML semantic tags?',
        modelAnswer: 'Semantic HTML tags clearly describe their meaning to both the browser and developer. Examples include header, nav, main, article, section, aside, and footer. They improve accessibility, SEO, and code readability compared to generic div tags. Semantic tags help screen readers and search engines understand page structure.',
        keywords: ['semantic', 'html', 'tags', 'accessibility', 'seo', 'structure'],
        category: 'general',
      },
      {
        domain: 'frontend',
        difficulty: 'easy',
        question: 'What is responsive web design?',
        modelAnswer: 'Responsive web design ensures websites adapt to different screen sizes and devices. It uses flexible layouts, media queries, flexible images, and relative units. Mobile-first approach starts with mobile design and scales up. Key techniques include CSS Grid, Flexbox, and viewport meta tags for optimal viewing across devices.',
        keywords: ['responsive', 'mobile', 'media queries', 'flexible', 'adaptive'],
        category: 'general',
      },
      {
        domain: 'frontend',
        difficulty: 'easy',
        question: 'What is an event listener in JavaScript?',
        modelAnswer: 'An event listener is a function that waits for specific events on HTML elements, like clicks, key presses, or form submissions. It is attached using addEventListener() method. When the event occurs, the listener function executes. Event listeners enable user interaction and dynamic behavior on web pages.',
        keywords: ['event', 'listener', 'click', 'addEventListener', 'interaction'],
        category: 'general',
      },
      {
        domain: 'frontend',
        difficulty: 'easy',
        question: 'What is the box model in CSS?',
        modelAnswer: 'The CSS box model describes rectangular boxes generated for elements. It consists of content, padding, border, and margin layers. Content is the innermost area, padding adds space inside the border, border surrounds padding, and margin creates space outside the border. Box-sizing property controls size calculation.',
        keywords: ['box model', 'padding', 'margin', 'border', 'content', 'css'],
        category: 'general',
      },
      {
        domain: 'frontend',
        difficulty: 'easy',
        question: 'What is the difference between == and === in JavaScript?',
        modelAnswer: '== (loose equality) compares values after type coercion, converting operands to the same type. === (strict equality) compares both value and type without conversion. For example, 5 == "5" is true, but 5 === "5" is false. Using === is recommended to avoid unexpected type coercion bugs.',
        keywords: ['equality', 'comparison', 'strict', 'loose', 'type coercion'],
        category: 'general',
      }
    );

    // Frontend - Medium (10 questions)
    questions.push(
      {
        domain: 'frontend',
        difficulty: 'medium',
        question: 'Explain the concept of state management in React.',
        modelAnswer: 'State management in React refers to handling data that changes over time within components. useState hook manages local component state, while useReducer handles complex state logic. For global state, solutions include Context API, Redux, Zustand, or Recoil. Proper state management ensures predictable data flow, efficient re-renders, and maintainable code. State should be lifted to common ancestors when shared between components.',
        keywords: ['state', 'useState', 'redux', 'context', 'data flow', 'hooks'],
        category: 'technical',
      },
      {
        domain: 'frontend',
        difficulty: 'medium',
        question: 'What are React hooks and why were they introduced?',
        modelAnswer: 'React Hooks are functions that let you use state and lifecycle features in functional components. They were introduced to avoid class component complexity, enable better code reuse through custom hooks, simplify component logic, and make React easier to learn. Common hooks include useState for state, useEffect for side effects, useContext for context consumption, and useRef for DOM references.',
        keywords: ['hooks', 'useState', 'useEffect', 'functional components', 'lifecycle'],
        category: 'technical',
      },
      {
        domain: 'frontend',
        difficulty: 'medium',
        question: 'What is the difference between controlled and uncontrolled components in React?',
        modelAnswer: 'Controlled components have their form data managed by React state through props and onChange handlers. The component value is always controlled by React. Uncontrolled components store their own state internally using refs, similar to traditional HTML. Controlled components provide more control, validation, and are recommended for most cases. Uncontrolled components are simpler for basic forms or when integrating with non-React code.',
        keywords: ['controlled', 'uncontrolled', 'components', 'state', 'refs', 'forms'],
        category: 'technical',
      },
      {
        domain: 'frontend',
        difficulty: 'medium',
        question: 'Explain CSS Flexbox and its main properties.',
        modelAnswer: 'Flexbox is a CSS layout model for arranging items in rows or columns with flexible sizing. Key properties include: display:flex on container, flex-direction for row/column layout, justify-content for main axis alignment, align-items for cross axis alignment, and flex-wrap for wrapping. Flex items can use flex-grow, flex-shrink, and flex-basis for sizing. Flexbox excels at distributing space and aligning items.',
        keywords: ['flexbox', 'layout', 'flex', 'justify-content', 'align-items'],
        category: 'technical',
      },
      {
        domain: 'frontend',
        difficulty: 'medium',
        question: 'What is the Virtual DOM and how does React use it?',
        modelAnswer: 'The Virtual DOM is a lightweight JavaScript representation of the real DOM. When state changes, React creates a new Virtual DOM tree and compares it with the previous one using a diffing algorithm (reconciliation). React then calculates the minimum changes needed and updates only those parts in the real DOM. This approach minimizes expensive DOM operations and improves performance significantly.',
        keywords: ['virtual dom', 'reconciliation', 'diffing', 'performance', 'react'],
        category: 'technical',
      },
      {
        domain: 'frontend',
        difficulty: 'medium',
        question: 'What are CSS preprocessors and why use them?',
        modelAnswer: 'CSS preprocessors like Sass, Less, and Stylus extend CSS with features like variables, nesting, mixins, functions, and imports. They compile to standard CSS. Benefits include code reusability, better organization, maintainability, and programming capabilities. Variables enable consistent theming, mixins reduce repetition, and nesting improves readability by matching HTML structure.',
        keywords: ['preprocessor', 'sass', 'less', 'variables', 'mixins', 'nesting'],
        category: 'technical',
      },
      {
        domain: 'frontend',
        difficulty: 'medium',
        question: 'Explain the concept of closures in JavaScript.',
        modelAnswer: 'A closure is a function that has access to variables from its outer (enclosing) function scope, even after the outer function has returned. Closures are created every time a function is created. They enable data privacy, function factories, and callback patterns. Closures remember their lexical environment, making them powerful for encapsulation and creating private variables in JavaScript.',
        keywords: ['closure', 'scope', 'lexical', 'encapsulation', 'private variables'],
        category: 'technical',
      },
      {
        domain: 'frontend',
        difficulty: 'medium',
        question: 'What is the difference between localStorage and sessionStorage?',
        modelAnswer: 'Both are Web Storage APIs for storing key-value pairs in the browser. localStorage persists data with no expiration until explicitly cleared, surviving browser restarts. sessionStorage data persists only for the page session and is cleared when the tab closes. Both have 5-10MB storage limits, work synchronously, and store strings only. localStorage is used for long-term data, sessionStorage for temporary session data.',
        keywords: ['localStorage', 'sessionStorage', 'web storage', 'persistence', 'browser'],
        category: 'technical',
      },
      {
        domain: 'frontend',
        difficulty: 'medium',
        question: 'What are promises in JavaScript and how do they work?',
        modelAnswer: 'Promises represent the eventual completion or failure of asynchronous operations. A promise has three states: pending, fulfilled, or rejected. They are created with new Promise() and resolved with resolve() or reject(). Promises are consumed using .then() for success, .catch() for errors, and .finally() for cleanup. Promises improve async code readability over callbacks and support chaining for sequential operations.',
        keywords: ['promise', 'async', 'then', 'catch', 'resolve', 'reject'],
        category: 'technical',
      },
      {
        domain: 'frontend',
        difficulty: 'medium',
        question: 'Explain event bubbling and event capturing in JavaScript.',
        modelAnswer: 'Event propagation has two phases: capturing (from root to target) and bubbling (from target to root). During bubbling, events trigger on the target element first, then propagate up to ancestors. Capturing is the reverse. By default, event listeners use bubbling phase. event.stopPropagation() stops propagation. Understanding this is crucial for event delegation, where a single listener on a parent handles events from multiple children.',
        keywords: ['event', 'bubbling', 'capturing', 'propagation', 'delegation'],
        category: 'technical',
      }
    );

    // Frontend - Hard (10 questions)
    questions.push(
      {
        domain: 'frontend',
        difficulty: 'hard',
        question: 'Explain code splitting and lazy loading in React applications.',
        modelAnswer: 'Code splitting breaks the application bundle into smaller chunks loaded on demand, reducing initial load time. React.lazy() enables dynamic imports for components, and Suspense provides fallback UI during loading. This improves performance by loading only necessary code. Webpack handles automatic code splitting with dynamic imports. Best practices include splitting by routes, large components, third-party libraries, and implementing preloading strategies for critical chunks.',
        keywords: ['code splitting', 'lazy loading', 'React.lazy', 'Suspense', 'dynamic import', 'webpack'],
        category: 'technical',
      },
      {
        domain: 'frontend',
        difficulty: 'hard',
        question: 'Design a scalable frontend architecture for a large React application.',
        modelAnswer: 'A scalable React architecture includes: feature-based folder structure, separation of concerns (components, hooks, utils, services), centralized state management (Redux/Context), API layer abstraction, routing strategy with code splitting, shared component library, error boundaries, performance monitoring, testing strategy (unit, integration, e2e), and CI/CD pipeline. Use TypeScript for type safety, implement design systems, lazy load routes, optimize re-renders with memo/useMemo, and establish clear data flow patterns.',
        keywords: ['architecture', 'scalability', 'structure', 'state management', 'optimization', 'typescript'],
        category: 'system-design',
      },
      {
        domain: 'frontend',
        difficulty: 'hard',
        question: 'Explain React reconciliation algorithm and how to optimize renders.',
        modelAnswer: 'React reconciliation is the diffing algorithm that updates the DOM efficiently. It compares Virtual DOM trees using heuristics: elements of different types produce different trees, lists use keys for identification. Optimization techniques include: React.memo for component memoization, useMemo for expensive calculations, useCallback for function references, proper key usage in lists, code splitting, virtualization for long lists, avoiding inline object/array creation, and using production builds. Profiler API helps identify performance bottlenecks.',
        keywords: ['reconciliation', 'optimization', 'memo', 'useMemo', 'useCallback', 'performance'],
        category: 'technical',
      },
      {
        domain: 'frontend',
        difficulty: 'hard',
        question: 'What are Web Workers and when should you use them?',
        modelAnswer: 'Web Workers run JavaScript in background threads, preventing UI blocking for CPU-intensive tasks. They communicate with the main thread via postMessage. Use cases include: image processing, data parsing, cryptography, complex calculations, and large dataset manipulation. Workers cannot access DOM directly. Types include dedicated workers (single page), shared workers (multiple tabs), and service workers (offline functionality). Consider workers when tasks take >50ms and block user interaction.',
        keywords: ['web workers', 'threading', 'performance', 'background', 'postMessage'],
        category: 'technical',
      },
      {
        domain: 'frontend',
        difficulty: 'hard',
        question: 'Explain Progressive Web Apps (PWA) and their core features.',
        modelAnswer: 'PWAs are web applications that provide app-like experiences using modern web capabilities. Core features include: service workers for offline functionality and caching, web app manifest for installability, HTTPS requirement, responsive design, app shell architecture, push notifications, and background sync. Benefits include offline access, fast loading, engaging UX, and cross-platform compatibility. PWAs bridge the gap between web and native apps without app store distribution.',
        keywords: ['pwa', 'progressive web app', 'service worker', 'manifest', 'offline', 'installable'],
        category: 'technical',
      },
      {
        domain: 'frontend',
        difficulty: 'hard',
        question: 'What is Server-Side Rendering (SSR) and when should it be used?',
        modelAnswer: 'SSR renders React components on the server, sending fully rendered HTML to the client. Benefits include improved SEO, faster initial load perception, and better performance on slow devices. Use SSR for content-heavy sites, SEO-critical pages, and slow client devices. Frameworks like Next.js simplify SSR implementation. Trade-offs include server load, complexity, and full page reloads. Consider static generation for pages that do not change frequently, or hybrid approaches combining SSR and client-side rendering.',
        keywords: ['ssr', 'server-side rendering', 'seo', 'nextjs', 'hydration', 'performance'],
        category: 'technical',
      },
      {
        domain: 'frontend',
        difficulty: 'hard',
        question: 'Explain WebSockets and their use cases in frontend development.',
        modelAnswer: 'WebSockets provide full-duplex communication channels over a single TCP connection, enabling real-time bidirectional data flow between client and server. Unlike HTTP polling, WebSockets maintain persistent connections with low latency. Use cases include: real-time chat, live notifications, collaborative editing, gaming, stock tickers, and live feeds. Implementation involves WebSocket API in browsers, libraries like Socket.io for fallbacks and features, proper error handling, reconnection logic, and heartbeat mechanisms.',
        keywords: ['websocket', 'real-time', 'bidirectional', 'socket.io', 'persistent connection'],
        category: 'technical',
      },
      {
        domain: 'frontend',
        difficulty: 'hard',
        question: 'What is micro-frontend architecture and its advantages?',
        modelAnswer: 'Micro-frontend architecture splits a frontend application into smaller, independently deployable units, each owned by separate teams. Benefits include: team autonomy, independent deployments, technology diversity, easier testing, and scalability. Implementation approaches include: iframe integration, JavaScript composition, Web Components, or module federation (Webpack 5). Challenges include: shared state management, consistent UX, bundle size, and communication between micro-apps. Best for large applications with multiple teams.',
        keywords: ['micro-frontend', 'architecture', 'modularity', 'scalability', 'module federation'],
        category: 'system-design',
      },
      {
        domain: 'frontend',
        difficulty: 'hard',
        question: 'Explain browser rendering pipeline and how to optimize it.',
        modelAnswer: 'Browser rendering pipeline consists of: parsing HTML to DOM, parsing CSS to CSSOM, combining them into render tree, layout calculation (reflow), and painting. JavaScript can block parsing. Optimizations include: minimizing DOM depth, reducing CSS selector complexity, avoiding layout thrashing, using requestAnimationFrame for animations, CSS containment, will-change property, lazy loading images, critical CSS inlining, and using CSS transforms/opacity for animations (GPU-accelerated). Understanding pipeline helps avoid forced synchronous layouts.',
        keywords: ['rendering', 'pipeline', 'reflow', 'repaint', 'optimization', 'critical path'],
        category: 'technical',
      },
      {
        domain: 'frontend',
        difficulty: 'hard',
        question: 'What are React Server Components and how do they differ from traditional components?',
        modelAnswer: 'React Server Components (RSC) run only on the server, never shipping JavaScript to the client. They can access backend resources directly, reducing client bundle size and improving performance. Server Components can seamlessly compose with Client Components. Benefits include: zero client JavaScript, direct data fetching, improved code splitting, and reduced waterfall requests. Limitations include no hooks, no browser APIs, and no interactivity. RSC represents a new paradigm for building React apps with Next.js 13+ App Router.',
        keywords: ['server components', 'rsc', 'nextjs', 'client components', 'performance'],
        category: 'technical',
      }
    );

    console.log(`📝 Created ${questions.length} questions so far...`);

    await Question.insertMany(questions);
    console.log(`✅ Inserted ${questions.length} frontend questions`);

    console.log('\n✅ Seed data created successfully!');
    console.log('\n📋 Admin Credentials:');
    console.log('Super Admin: superadmin@interview.com / password123');
    console.log('Admin: admin@interview.com / password123');
    console.log('Reviewer: reviewer@interview.com / password123');
    console.log('Candidate: candidate@interview.com / password123');
    console.log(`\n📊 Total Questions: ${questions.length}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedData();

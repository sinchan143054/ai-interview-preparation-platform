// Run this to add more domains to existing seed
const fs = require('fs');

// Read current seed file
let seedContent = fs.readFileSync('seed_comprehensive.js', 'utf8');

// Find where to insert (before the insertMany)
const insertPoint = seedContent.indexOf('console.log(`📝 Created ${questions.length} questions so far...`);');

const newDomains = `
    // =========================
    // BACKEND DOMAIN (30 questions: 10 easy, 10 medium, 10 hard)
    // =========================
    
    // Backend - Easy (10 questions)
    questions.push(
      {
        domain: 'backend',
        difficulty: 'easy',
        question: 'What is an API?',
        modelAnswer: 'API (Application Programming Interface) is a set of rules and protocols that allows different software applications to communicate with each other. APIs define the methods and data formats that applications use to request and exchange information. They enable integration between systems, promote code reusability, support microservices architecture, and allow third-party developers to build on existing platforms.',
        keywords: ['api', 'interface', 'communication', 'integration', 'protocol'],
        category: 'general',
      },
      {
        domain: 'backend',
        difficulty: 'easy',
        question: 'What is the difference between GET and POST HTTP methods?',
        modelAnswer: 'GET retrieves data from a server and parameters are sent in the URL query string. It is idempotent, can be cached, and bookmarked. POST sends data to the server in the request body to create or update resources. POST is not idempotent, responses are not cached by default, and it is more secure for sensitive data. GET has URL length limitations while POST does not.',
        keywords: ['http', 'get', 'post', 'request', 'method', 'rest'],
        category: 'general',
      },
      {
        domain: 'backend',
        difficulty: 'easy',
        question: 'What is a database and why is it important?',
        modelAnswer: 'A database is an organized collection of structured data stored electronically. It enables efficient data storage, retrieval, updating, and management. Databases are important for data persistence, concurrent access, data integrity, backup and recovery, scalability, and complex query support. They provide ACID properties for reliable transactions and support various data models like relational, document, key-value, and graph.',
        keywords: ['database', 'data', 'storage', 'persistence', 'sql', 'nosql'],
        category: 'general',
      },
      {
        domain: 'backend',
        difficulty: 'easy',
        question: 'What is Node.js and why is it popular?',
        modelAnswer: 'Node.js is a JavaScript runtime built on Chrome V8 engine that allows JavaScript to run on the server. It uses an event-driven, non-blocking I/O model making it lightweight and efficient for data-intensive real-time applications. Node.js is popular because it enables full-stack JavaScript development, has a large ecosystem (npm), excellent performance for I/O operations, and strong community support.',
        keywords: ['nodejs', 'javascript', 'runtime', 'event-driven', 'non-blocking'],
        category: 'general',
      },
      {
        domain: 'backend',
        difficulty: 'easy',
        question: 'What is JSON and why is it used?',
        modelAnswer: 'JSON (JavaScript Object Notation) is a lightweight data interchange format that is easy for humans to read and write, and easy for machines to parse and generate. It uses key-value pairs and supports arrays, objects, strings, numbers, booleans, and null. JSON is language-independent and widely used for APIs, configuration files, and data storage because of its simplicity and compatibility with JavaScript.',
        keywords: ['json', 'data format', 'api', 'serialization', 'interchange'],
        category: 'general',
      },
      {
        domain: 'backend',
        difficulty: 'easy',
        question: 'What is middleware in Express.js?',
        modelAnswer: 'Middleware in Express.js are functions that have access to the request object, response object, and the next middleware function in the request-response cycle. They can execute code, modify request/response objects, end the request-response cycle, or call the next middleware. Common middleware uses include authentication, logging, error handling, body parsing, CORS handling, and request validation.',
        keywords: ['middleware', 'express', 'request', 'response', 'next', 'nodejs'],
        category: 'general',
      },
      {
        domain: 'backend',
        difficulty: 'easy',
        question: 'What are environment variables and why use them?',
        modelAnswer: 'Environment variables are dynamic values stored outside the codebase that configure application behavior based on the environment (development, staging, production). They store sensitive data like API keys, database URLs, and secrets. Benefits include security (credentials not in code), flexibility (easy configuration changes), portability across environments, and separation of configuration from code. Accessed via process.env in Node.js.',
        keywords: ['environment variables', 'config', 'security', 'dotenv', 'process.env'],
        category: 'general',
      },
      {
        domain: 'backend',
        difficulty: 'easy',
        question: 'What is the purpose of HTTP status codes?',
        modelAnswer: 'HTTP status codes are three-digit numbers returned by servers to indicate the result of a client request. They are grouped into: 1xx (informational), 2xx (success like 200 OK), 3xx (redirection), 4xx (client errors like 404 Not Found), and 5xx (server errors like 500 Internal Server Error). Status codes help clients understand request outcomes and handle errors appropriately.',
        keywords: ['http', 'status codes', '200', '404', '500', 'response'],
        category: 'general',
      },
      {
        domain: 'backend',
        difficulty: 'easy',
        question: 'What is REST API and its principles?',
        modelAnswer: 'REST (Representational State Transfer) is an architectural style for designing networked applications. RESTful APIs follow principles: stateless communication (no client context stored), client-server separation, uniform interface using HTTP methods, resource-based URLs, cacheable responses, and layered system architecture. REST uses standard HTTP methods (GET, POST, PUT, DELETE) to perform CRUD operations on resources identified by URIs.',
        keywords: ['rest', 'api', 'stateless', 'http methods', 'resources', 'crud'],
        category: 'general',
      },
      {
        domain: 'backend',
        difficulty: 'easy',
        question: 'What is asynchronous programming in Node.js?',
        modelAnswer: 'Asynchronous programming in Node.js allows non-blocking execution where operations run concurrently without waiting for previous operations to complete. Node.js uses callbacks, promises, and async/await to handle asynchronous code. This is crucial for I/O operations like file reading, database queries, and API calls. Async programming prevents blocking the event loop, enabling high concurrency and better performance for I/O-bound tasks.',
        keywords: ['asynchronous', 'async', 'await', 'promises', 'callbacks', 'non-blocking'],
        category: 'general',
      }
    );

    // Backend - Medium (10 questions)  
    questions.push(
      {
        domain: 'backend',
        difficulty: 'medium',
        question: 'Explain JWT authentication and how it works.',
        modelAnswer: 'JWT (JSON Web Token) is a stateless authentication mechanism. After successful login, the server generates a signed token containing user data (payload) and sends it to the client. The client stores it (localStorage/cookie) and includes it in subsequent requests via the Authorization header. The server verifies the token signature without database lookups. JWTs consist of header, payload, and signature encoded in Base64. Benefits include statelessness, scalability, and cross-domain support. Implement refresh tokens and HTTPS for security.',
        keywords: ['jwt', 'authentication', 'token', 'stateless', 'authorization', 'signature'],
        category: 'technical',
      },
      {
        domain: 'backend',
        difficulty: 'medium',
        question: 'What is database indexing and how does it improve performance?',
        modelAnswer: 'Database indexing creates a data structure (usually B-tree) that improves data retrieval speed. Indexes store sorted copies of select columns with pointers to full rows. They significantly speed up SELECT queries with WHERE, JOIN, and ORDER BY clauses but slow down INSERT, UPDATE, and DELETE operations. Choose indexes based on query patterns, considering selectivity and cardinality. Composite indexes support multiple-column queries. Over-indexing wastes space and degrades write performance.',
        keywords: ['indexing', 'database', 'performance', 'btree', 'query optimization'],
        category: 'technical',
      },
      {
        domain: 'backend',
        difficulty: 'medium',
        question: 'Explain the difference between SQL and NoSQL databases.',
        modelAnswer: 'SQL databases are relational, use structured schemas with tables and rows, support ACID transactions, and use SQL query language. They excel at complex queries and relationships. NoSQL databases are non-relational, schema-flexible, and include document (MongoDB), key-value (Redis), column-family (Cassandra), and graph types. NoSQL offers horizontal scalability, high performance for specific use cases, and eventual consistency. Choose SQL for complex relationships and transactions, NoSQL for scalability and flexible data.',
        keywords: ['sql', 'nosql', 'database', 'relational', 'document', 'scalability'],
        category: 'technical',
      },
      {
        domain: 'backend',
        difficulty: 'medium',
        question: 'What is CORS and how do you handle it?',
        modelAnswer: 'CORS (Cross-Origin Resource Sharing) is a security mechanism that allows or restricts resources on a web server to be accessed from a different domain. Browsers block cross-origin requests by default due to Same-Origin Policy. CORS uses HTTP headers like Access-Control-Allow-Origin to enable controlled access. In Express, use cors middleware to configure allowed origins, methods, and headers. For production, specify exact origins instead of wildcards for security.',
        keywords: ['cors', 'cross-origin', 'security', 'headers', 'same-origin policy'],
        category: 'technical',
      },
      {
        domain: 'backend',
        difficulty: 'medium',
        question: 'Explain error handling in Express.js.',
        modelAnswer: 'Express error handling uses error-handling middleware with four parameters (err, req, res, next). Errors are passed to error handlers using next(err). Synchronous errors are caught automatically, but async errors need try-catch with next(err). Best practices include: centralized error handling middleware, custom error classes, consistent error responses, logging errors, not exposing sensitive info to clients, and using HTTP status codes appropriately. Development shows stack traces; production shows generic messages.',
        keywords: ['error handling', 'express', 'middleware', 'try-catch', 'async', 'logging'],
        category: 'technical',
      },
      {
        domain: 'backend',
        difficulty: 'medium',
        question: 'What is MongoDB and when should you use it?',
        modelAnswer: 'MongoDB is a document-oriented NoSQL database that stores data in flexible JSON-like documents. It offers schema flexibility, horizontal scalability, high performance, and rich query language. Use MongoDB for: rapidly changing schemas, hierarchical data, high write loads, geographic distribution, and real-time analytics. It excels at content management, catalogs, user profiles, and IoT data. Avoid for complex transactions or heavy relational queries. MongoDB supports indexing, aggregation pipelines, and replica sets for availability.',
        keywords: ['mongodb', 'nosql', 'document database', 'flexible schema', 'scalability'],
        category: 'technical',
      },
      {
        domain: 'backend',
        difficulty: 'medium',
        question: 'Explain API versioning and best practices.',
        modelAnswer: 'API versioning maintains backward compatibility while evolving APIs. Common strategies include: URL versioning (/api/v1/users), header versioning (Accept: application/vnd.api.v1), query parameter (?version=1), or content negotiation. Best practices: version early, communicate changes clearly, support multiple versions temporarily, deprecate gracefully, use semantic versioning, document breaking changes, and maintain consistency. URL versioning is simplest and most explicit. Avoid breaking changes when possible.',
        keywords: ['api versioning', 'backward compatibility', 'rest', 'deprecation'],
        category: 'technical',
      },
      {
        domain: 'backend',
        difficulty: 'medium',
        question: 'What are microservices and their advantages?',
        modelAnswer: 'Microservices architecture decomposes applications into small, independent services that communicate via APIs. Each service handles a specific business capability, can be deployed independently, and may use different technologies. Advantages include: independent scaling, technology flexibility, fault isolation, easier understanding, faster deployments, and team autonomy. Challenges include: distributed system complexity, data consistency, network latency, and DevOps overhead. Best for large, complex applications with multiple teams.',
        keywords: ['microservices', 'architecture', 'scalability', 'distributed', 'independence'],
        category: 'technical',
      },
      {
        domain: 'backend',
        difficulty: 'medium',
        question: 'Explain caching strategies in backend applications.',
        modelAnswer: 'Caching stores frequently accessed data for faster retrieval. Strategies include: Cache-Aside (application checks cache, loads from DB on miss), Write-Through (cache updated synchronously with DB), Write-Behind (cache updated, DB asynchronously), and Refresh-Ahead (proactive refresh). Common caching layers: in-memory (Redis, Memcached), CDN, database query cache, and application cache. Consider TTL, cache invalidation, cache stampede, and consistent hashing. Caching dramatically improves performance and reduces database load.',
        keywords: ['caching', 'redis', 'memcached', 'cache strategy', 'performance', 'ttl'],
        category: 'technical',
      },
      {
        domain: 'backend',
        difficulty: 'medium',
        question: 'What is rate limiting and how do you implement it?',
        modelAnswer: 'Rate limiting controls the number of requests a client can make to an API within a time window, preventing abuse and ensuring fair usage. Implementation strategies include: token bucket, leaky bucket, fixed window, and sliding window algorithms. Use Redis or in-memory stores to track request counts. Return 429 Too Many Requests status with Retry-After header. Consider different limits per user tier, endpoint, and IP. Libraries like express-rate-limit simplify implementation. Rate limiting protects against DoS attacks and ensures service stability.',
        keywords: ['rate limiting', 'throttling', 'api security', 'redis', '429', 'token bucket'],
        category: 'technical',
      }
    );

    // Backend - Hard (10 questions)
    questions.push(
      {
        domain: 'backend',
        difficulty: 'hard',
        question: 'Explain database transactions and ACID properties.',
        modelAnswer: 'Database transactions are sequences of operations treated as a single logical unit. ACID ensures reliability: Atomicity (all operations succeed or all fail), Consistency (valid state transitions obeying constraints), Isolation (concurrent transactions don"t interfere - controlled by isolation levels), and Durability (committed changes persist through crashes). Transactions use BEGIN, COMMIT, and ROLLBACK. Implement using database transaction APIs. Trade-offs exist between consistency and performance. Understanding ACID is crucial for data integrity in financial, e-commerce, and critical systems.',
        keywords: ['transactions', 'acid', 'atomicity', 'consistency', 'isolation', 'durability'],
        category: 'technical',
      },
      {
        domain: 'backend',
        difficulty: 'hard',
        question: 'Design a scalable URL shortener service.',
        modelAnswer: 'A URL shortener requires: unique short code generation (base62 encoding of incremental IDs or hashing), URL storage (database with index on short codes), redirect service, and analytics. Architecture: load balancer, stateless API servers, Redis cache for hot URLs, primary database (SQL for ACID or NoSQL for scale), and CDN. Scale considerations: database sharding by hash, read replicas, cache layer, rate limiting, and distributed ID generation (Snowflake algorithm). Handle collisions, implement expiry, track clicks, and ensure high availability. Estimate: 1B URLs = ~100GB storage.',
        keywords: ['system design', 'scalability', 'url shortener', 'sharding', 'caching', 'distributed'],
        category: 'system-design',
      },
      {
        domain: 'backend',
        difficulty: 'hard',
        question: 'Explain event-driven architecture and message queues.',
        modelAnswer: 'Event-driven architecture uses events to trigger and communicate between decoupled services. Components: event producers, message brokers (RabbitMQ, Kafka, AWS SQS), and event consumers. Benefits include loose coupling, scalability, asynchronous processing, and fault tolerance. Message queues guarantee delivery, enable load leveling, and support retry mechanisms. Patterns: pub/sub, event sourcing, CQRS. Challenges include eventual consistency, message ordering, and duplicate handling (idempotency). Use for notifications, workflow orchestration, data pipelines, and microservices communication.',
        keywords: ['event-driven', 'message queue', 'kafka', 'rabbitmq', 'asynchronous', 'pub-sub'],
        category: 'technical',
      },
      {
        domain: 'backend',
        difficulty: 'hard',
        question: 'What is database replication and how does it work?',
        modelAnswer: 'Database replication copies data from a primary (master) database to one or more replica (slave) databases. Types: Master-Slave (read replicas for scalability), Master-Master (bidirectional replication), and cascading replication. Replication can be synchronous (consistent but slower) or asynchronous (faster but eventual consistency). Benefits include high availability, load distribution for reads, disaster recovery, and geographic distribution. Challenges include replication lag, conflict resolution in multi-master, and failover complexity. Implement monitoring and automated failover.',
        keywords: ['replication', 'master-slave', 'high availability', 'scalability', 'failover'],
        category: 'technical',
      },
      {
        domain: 'backend',
        difficulty: 'hard',
        question: 'Explain GraphQL and how it differs from REST.',
        modelAnswer: 'GraphQL is a query language for APIs that allows clients to request exactly the data they need. Key differences from REST: single endpoint vs multiple endpoints, flexible queries vs fixed responses, strongly typed schema, no over/under-fetching, real-time subscriptions, and introspection. GraphQL uses resolvers to fetch data, supports nested queries, mutations for writes, and subscriptions for real-time updates. Trade-offs: increased backend complexity, caching challenges, and security considerations (query depth/complexity limits). Best for mobile apps, complex data requirements, and frequently changing frontends.',
        keywords: ['graphql', 'api', 'query language', 'schema', 'resolvers', 'rest'],
        category: 'technical',
      },
      {
        domain: 'backend',
        difficulty: 'hard',
        question: 'Design a notification system for millions of users.',
        modelAnswer: 'Notification system architecture: API gateway, notification service, message queue (Kafka/SQS), worker pool, provider adapters (email/SMS/push), template engine, user preference store, and analytics. Components: priority queues, rate limiting per user/provider, retry logic with exponential backoff, deduplication, and delivery tracking. Scale considerations: horizontal scaling of workers, database sharding, cache user preferences, batch processing, and CDN for assets. Implement fallback providers, track delivery status, respect user preferences, and handle unsubscribes. Consider real-time via WebSockets and digest emails for updates.',
        keywords: ['system design', 'notifications', 'scalability', 'message queue', 'distributed'],
        category: 'system-design',
      },
      {
        domain: 'backend',
        difficulty: 'hard',
        question: 'What is database sharding and when should you use it?',
        modelAnswer: 'Database sharding horizontally partitions data across multiple database instances (shards), each holding a subset of data. Sharding strategies: range-based (partition by ID ranges), hash-based (hash function determines shard), geographic (by location), or directory-based (lookup table). Benefits include horizontal scalability, improved performance, and distributed load. Challenges: complex queries across shards, rebalancing, joins are difficult, and increased operational complexity. Use when single database cannot handle load, for massive datasets, or geographic distribution. Implement shard key carefully to avoid hotspots.',
        keywords: ['sharding', 'partitioning', 'scalability', 'distributed database', 'horizontal scaling'],
        category: 'technical',
      },
      {
        domain: 'backend',
        difficulty: 'hard',
        question: 'Explain OAuth 2.0 and its flow.',
        modelAnswer: 'OAuth 2.0 is an authorization framework that enables third-party applications to access user resources without exposing credentials. Roles: Resource Owner (user), Client (app), Authorization Server, and Resource Server. Flows: Authorization Code (most secure, for web apps), Implicit (deprecated), Client Credentials (machine-to-machine), and Resource Owner Password (legacy). Flow: client requests authorization, user grants, client receives authorization code, exchanges code for access token, uses token to access resources. Tokens: access token (short-lived), refresh token (long-lived). Implement PKCE for mobile apps and use HTTPS.',
        keywords: ['oauth', 'authorization', 'access token', 'authentication', 'security', 'jwt'],
        category: 'technical',
      },
      {
        domain: 'backend',
        difficulty: 'hard',
        question: 'What is eventual consistency and CAP theorem?',
        modelAnswer: 'CAP theorem states distributed systems can guarantee only two of three: Consistency (all nodes see same data), Availability (system responds to requests), and Partition tolerance (system continues despite network failures). Partition tolerance is mandatory in distributed systems, so choose between CP (consistent but may be unavailable) or AP (available but eventually consistent). Eventual consistency means replicas converge to same state over time. Strategies include: conflict resolution (last-write-wins, vector clocks), CRDTs, and compensating transactions. Design for eventual consistency when availability and partition tolerance are critical, like social media feeds.',
        keywords: ['cap theorem', 'eventual consistency', 'distributed systems', 'availability', 'consistency'],
        category: 'technical',
      },
      {
        domain: 'backend',
        difficulty: 'hard',
        question: 'Design a distributed cache system.',
        modelAnswer: 'Distributed cache architecture: consistent hashing for data distribution, replication for availability, LRU/LFU eviction policies, and TTL for expiration. Components: cache nodes, client library, cluster management, and monitoring. Implement: node discovery, data partitioning, replication factor, cache-aside pattern, and write-through/write-behind strategies. Handle: node failures (replica promotion), network partitions, cache stampede (lock-based or probabilistic early expiration), and hot keys (local cache or dedicated nodes). Scale considerations: add/remove nodes without downtime, monitor hit rates, and implement circuit breakers. Technologies: Redis Cluster, Memcached, or custom solution.',
        keywords: ['distributed cache', 'consistent hashing', 'scalability', 'redis', 'availability'],
        category: 'system-design',
      }
    );

`;

// Insert new content
seedContent = seedContent.slice(0, insertPoint) + newDomains + seedContent.slice(insertPoint);

// Write back
fs.writeFileSync('seed_comprehensive.js', seedContent);

console.log('Added Backend domain with 30 questions!');

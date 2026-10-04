import { ProjectStatus } from '../services/common/enum/ProjectStatus';

export const placeholder = {
  stats: [
    { value: "3+", label: "years experience" },
    { value: "12+", label: "projects shipped" },
    { value: "8+", label: "clients served" },
    { value: "25+", label: "technologies" },
  ],

  ticker: [
    "Python",
    "FastAPI",
    "React",
    "PyTorch",
    "LangChain",
    "PostgreSQL",
    "Docker",
    "TypeScript",
    "Next.js",
    "TensorFlow",
    "Redis",
    "scikit-learn",
  ],

  experience: [
    {
      period: "2023 — present",
      location: "Kathmandu, NPL",
      role: "ML Engineer & Full-stack Dev",
      company: "DalloTech",
      points: [
        "Building core AI R&D for Tathyanaka, an analytics platform — intent recognition, recommendation engine, and query generation.",
        "Developed a full ERP system for Jeevan Vigyan covering inventory, billing, and reporting.",
        "Designed and shipped REST APIs powering both internal tools and client-facing products.",
      ],
    },
    {
      period: "2022 — 2023",
      location: "Remote",
      role: "Freelance Developer",
      company: "Self-employed",
      points: [
        "Built an event management platform with real-time ticketing and QR-code check-in for a local events company.",
        "Developed an ordering system with recommendation features for a restaurant chain.",
        "Delivered ML prototypes for 3 clients: sound classification, document similarity, and churn prediction.",
      ],
    },
  ],

  allProjects: [
    {
      id: "riskvision",
      title: "RiskVision",
      blurb:
        "Predictive ML model with 80%+ accuracy for assessing stroke and heart disease risk from clinical data.",
      stack: ["Python", "PyTorch", "FastAPI", "React"],
      year: "2024",
      kind: "ML",
      coverHeight: 260,
      coverAccent: "#FF6B6B",
      coverColor: "#141418",
      status: ProjectStatus.ACTIVE,
      live: "https://github.com/BirajBuddhacharya/RiskVision",
      repo: "https://github.com/BirajBuddhacharya/RiskVision",
      summary:
        "RiskVision predicts stroke and heart disease risk using clinical features. The model was trained on public health datasets and achieves over 80% accuracy on held-out test data.",
      metrics: [
        { value: "80%+", label: "model accuracy" },
        { value: "< 200ms", label: "API latency" },
        { value: "3", label: "disease types" },
      ],
      sections: [
        {
          label: "Problem",
          body: "Early detection of stroke and heart disease is critical but requires specialist analysis. The goal was to build a tool that triages risk from basic clinical inputs.",
        },
        {
          label: "Approach",
          body: "Trained gradient-boosted and neural network classifiers on UCI and Kaggle health datasets. Used SMOTE to handle class imbalance and SHAP for interpretability.",
        },
        {
          label: "Outcome",
          body: "Deployed as a FastAPI service with a React frontend. The model consistently outperformed the baseline logistic regression by 14 percentage points.",
        },
      ],
      gallery: ["Model architecture", "ROC curves", "Feature importance", "UI screenshot"],
    },
    {
      id: "syncbeats",
      title: "SyncBeats",
      blurb:
        "CLI tool that syncs YouTube playlists and local music libraries using yt-dlp with smart deduplication.",
      stack: ["Python", "yt-dlp", "Click", "SQLite"],
      year: "2023",
      kind: "CLI tool",
      coverHeight: 160,
      coverAccent: "#6E6E78",
      coverColor: "#0E1418",
      status: ProjectStatus.ACTIVE,
      live: "https://github.com/BirajBuddhacharya/SyncBeats",
      repo: "https://github.com/BirajBuddhacharya/SyncBeats",
      summary:
        "SyncBeats is a command-line utility that keeps a local music folder in sync with YouTube playlists, handling duplicates and metadata tagging automatically.",
      metrics: [
        { value: "100+", label: "playlists synced" },
        { value: "0 dupes", label: "dedup accuracy" },
        { value: "ID3 tags", label: "auto-tagged" },
      ],
      sections: [
        {
          label: "Problem",
          body: "Downloading music from YouTube manually is tedious and leads to duplicates and inconsistent metadata.",
        },
        {
          label: "Approach",
          body: "Built on top of yt-dlp with a SQLite state file tracking already-downloaded tracks. Metadata is written via mutagen after each download.",
        },
        {
          label: "Outcome",
          body: "Used daily for personal music management. Open-sourced and used by ~100 users on GitHub.",
        },
      ],
      gallery: ["CLI output", "Config file", "Before/after sync"],
    },
    {
      id: "abcbooks",
      title: "ABC Books",
      blurb:
        "Full-stack e-commerce platform with responsive design, cart system, and streamlined checkout flow.",
      stack: ["Django", "React", "PostgreSQL", "Tailwind"],
      year: "2023",
      kind: "Web app",
      coverHeight: 200,
      coverAccent: "#7C3AED",
      coverColor: "#130E18",
      status: ProjectStatus.ACTIVE,
      live: "https://github.com/BirajBuddhacharya/ABC-Books",
      repo: "https://github.com/BirajBuddhacharya/ABC-Books",
      summary:
        "ABC Books is a full-featured online bookstore with product catalog, search, cart, and order management.",
      metrics: [
        { value: "500+", label: "products listed" },
        { value: "< 1.2s", label: "page load" },
        { value: "100%", label: "mobile responsive" },
      ],
      sections: [
        {
          label: "Problem",
          body: "A local bookstore needed an online presence with inventory management and order processing.",
        },
        {
          label: "Approach",
          body: "Django REST Framework backend with a React SPA frontend. PostgreSQL for relational data, with full-text search powered by Django's ORM.",
        },
        {
          label: "Outcome",
          body: "Launched and used in production. Reduced order processing time by 60% compared to manual methods.",
        },
      ],
      gallery: ["Home page", "Product detail", "Cart", "Order history"],
    },
    {
      id: "eventsystem",
      title: "EventPulse",
      blurb:
        "Real-time event management platform with QR-code check-in, ticket sales, and organizer dashboard.",
      stack: ["FastAPI", "React", "PostgreSQL", "Redis"],
      year: "2023",
      kind: "Web app",
      coverHeight: 300,
      coverAccent: "#0EA5E9",
      coverColor: "#0C1418",
      status: ProjectStatus.ACTIVE,
      live: "#",
      repo: "#",
      summary:
        "EventPulse handles the full lifecycle of ticketed events — from creation and sales to check-in on the day.",
      metrics: [
        { value: "2k+", label: "tickets issued" },
        { value: "< 300ms", label: "QR scan time" },
        { value: "10+", label: "events hosted" },
      ],
      sections: [
        {
          label: "Problem",
          body: "The client ran events manually with spreadsheets and paper tickets, leading to errors and slow check-in lines.",
        },
        {
          label: "Approach",
          body: "FastAPI backend with JWT auth, Stripe for payments, and QR code generation. Check-in app runs in the browser with a camera feed.",
        },
        {
          label: "Outcome",
          body: "Average check-in time dropped from 4 minutes to under 30 seconds. Zero oversold events since launch.",
        },
      ],
      gallery: ["Dashboard", "Ticket page", "QR scanner", "Analytics"],
    },
    {
      id: "tathyanaka",
      title: "Tathyanaka",
      blurb:
        "AI-powered analytics platform that turns raw data tables into natural-language insights and charts.",
      stack: ["Python", "LangChain", "FastAPI", "React", "PostgreSQL"],
      year: "2024",
      kind: "AI product",
      coverHeight: 220,
      coverAccent: "#10B981",
      coverColor: "#0E1814",
      status: ProjectStatus.ACTIVE,
      live: "#",
      repo: "#",
      summary:
        "Tathyanaka lets non-technical users query their data in plain English and receive structured charts and summaries.",
      metrics: [
        { value: "NL→SQL", label: "query engine" },
        { value: "< 2s", label: "avg response" },
        { value: "5+", label: "data connectors" },
      ],
      sections: [
        {
          label: "Problem",
          body: "Business stakeholders needed insights from PostgreSQL databases but lacked SQL knowledge.",
        },
        {
          label: "Approach",
          body: "LLM-powered NL-to-SQL pipeline with schema context injection. Results are rendered as Chart.js visualisations via a React dashboard.",
        },
        {
          label: "Outcome",
          body: "In production at DalloTech. Reduced data request turnaround from 2 days to under 5 minutes.",
        },
      ],
      gallery: ["Query interface", "Chart output", "Schema browser", "History"],
    },
    {
      id: "quickhire",
      title: "QuickHire",
      blurb:
        "Job portal with AI-assisted resume screening and match-scoring for faster recruiter workflows.",
      stack: ["Django", "React", "PostgreSQL", "scikit-learn"],
      year: "2022",
      kind: "Web app",
      coverHeight: 180,
      coverAccent: "#F59E0B",
      coverColor: "#18140E",
      status: ProjectStatus.ARCHIVED,
      live: "#",
      repo: "#",
      summary:
        "QuickHire speeds up recruiting by automatically ranking applicants against job descriptions using TF-IDF and semantic similarity.",
      metrics: [
        { value: "60%", label: "screening time saved" },
        { value: "500+", label: "resumes processed" },
        { value: "Top-3", label: "match accuracy" },
      ],
      sections: [
        {
          label: "Problem",
          body: "A small HR team was spending hours manually screening CVs for each open role.",
        },
        {
          label: "Approach",
          body: "TF-IDF cosine similarity combined with a sentence-transformer re-ranker. Built on Django + React with PDF parsing via pdfminer.",
        },
        {
          label: "Outcome",
          body: "Cut initial screening time by 60%. Recruiters now review only the top-5 matches before interviews.",
        },
      ],
      gallery: ["Job listing", "Applicant list", "Resume viewer"],
    },
  ],

  blogPosts: [
    {
      id: "rag-chatbot-langchain",
      title: "Building a production RAG chatbot with LangChain and pgvector",
      excerpt:
        "How I wired up a retrieval-augmented generation pipeline, what broke in production, and the three changes that made it actually reliable.",
      date: "Jun 2025",
      readTime: "8 min",
      tags: ["ML", "RAG", "LangChain"],
      status: "published",
      coverImage: "",
      body: [
        "Retrieval-augmented generation sounds simple on paper: embed your docs, store them in a vector DB, retrieve the top-k at query time, pass them as context to an LLM. In practice, the devil is in every single one of those steps.",
        "The first thing I learned the hard way is that chunking strategy matters more than model choice. I started with fixed 512-token chunks and got terrible results on questions that spanned section boundaries. Switching to a sliding window with 10% overlap and semantic sentence splitting (using spaCy) bumped retrieval recall from ~60% to ~82% on my eval set.",
        "pgvector was a pleasant surprise. I was ready to spin up a Pinecone instance but our existing PostgreSQL database already had enough scale, and the pgvector extension let me keep everything in one place. The query syntax is clean: `SELECT id, content, embedding <=> $1 AS distance FROM chunks ORDER BY distance LIMIT 5`.",
        "The part that actually made the chatbot reliable in production was adding a confidence threshold and a fallback message. If the top retrieved chunk has cosine distance above 0.4, I now respond with 'I don't have confident information about that' instead of hallucinating. Users trust the system more even though it answers fewer questions.",
        "One more thing: cache common queries with Redis. The 80/20 rule applies hard here — 20% of questions account for 80% of traffic, and LLM inference is expensive.",
      ],
    },
    {
      id: "fastapi-postgres-stack",
      title: "Why FastAPI + PostgreSQL is my default backend stack",
      excerpt:
        "After building backends in Django, Flask, Express, and Go, I keep coming back to the same combination. Here's why.",
      date: "Apr 2025",
      readTime: "5 min",
      tags: ["Backend", "FastAPI", "PostgreSQL"],
      status: "published",
      coverImage: "",
      body: [
        "I've built production backends in Django, Flask, Express, Go's net/http, and FastAPI. After shipping roughly a dozen services, I keep landing on FastAPI + PostgreSQL as my default. This post explains my reasoning.",
        "FastAPI gives you automatic OpenAPI docs, Pydantic validation, and async support out of the box. The docs alone save hours when handing off an API to a frontend developer. Pydantic v2 is fast enough that validation is never a bottleneck.",
        "PostgreSQL is boring in the best possible way. JSONB columns when you need schema flexibility. Full-text search when you need it. Row-level security when you need multi-tenancy. You can start simple and grow into every feature over time without migrating databases.",
        "The combination with SQLAlchemy 2.0 (async) and Alembic for migrations feels genuinely productive. I define my models once, get type-safe queries, and never write raw SQL except for performance-sensitive hotpaths.",
        "The one thing I'd add: use async Redis for caching from day one. Adding it later is a pain. Start with `redis-py` in async mode even if you only use it for rate limiting initially.",
      ],
    },
    {
      id: "notebook-to-production",
      title: "From Jupyter Notebook to a deployed ML service in one afternoon",
      excerpt:
        "A step-by-step walkthrough of packaging a trained model into a FastAPI service and deploying it on a single VPS.",
      date: "Feb 2025",
      readTime: "6 min",
      tags: ["ML", "Docker", "Tutorial"],
      status: "published",
      coverImage: "",
      body: [
        "Most ML tutorials end with a trained model sitting in a notebook. This post covers the last mile: turning that notebook into a deployed service that people can actually call.",
        "Step one is saving the model properly. For scikit-learn models I use joblib; for PyTorch I save the state dict, not the whole model. Saving the full model object breaks when you refactor classes.",
        "Wrap the model in a FastAPI app. A single `/predict` endpoint with a Pydantic input schema is usually all you need. Add a `/health` endpoint so your reverse proxy can check liveness.",
        "Containerise with Docker. A three-stage build (base → deps → app) keeps the final image lean. I pin the base image to a specific digest to avoid surprise updates.",
        "For deployment: a $6 VPS with Docker Compose, Nginx as a reverse proxy, and Certbot for TLS. Systemd restarts the compose stack on reboot. Total infrastructure cost: $6/month.",
      ],
    },
    {
      id: "event-driven-intro",
      title: "Event-driven architecture for beginners, without the hype",
      excerpt:
        "What events actually are, when they help, when they hurt, and a concrete example using Redis Streams.",
      date: "Dec 2024",
      readTime: "7 min",
      tags: ["Backend", "Redis"],
      status: "published",
      coverImage: "",
      body: [
        "Event-driven architecture is one of those phrases that gets used in the same breath as microservices and Kubernetes, which makes it sound scarier than it is. At its core, it's just: when something happens, publish a message; somewhere else, subscribe to it and react.",
        "The canonical example is an order being placed. Instead of synchronously calling the inventory service, the email service, and the analytics service from your order handler, you publish an `order.placed` event and each service handles it independently.",
        "The real benefit is decoupling. Your order service doesn't need to know that the email service exists. You can add a new consumer — say, a fraud detection service — without touching the order service at all.",
        "Redis Streams are my preferred lightweight implementation. They're ordered, persistent (within your maxlen), and support consumer groups for work distribution. For a portfolio project the setup is maybe 50 lines of Python.",
        "When does it hurt? When you need strict consistency. Event-driven systems are eventually consistent by design. If you need 'inventory decremented exactly once before the order confirms', you're better off with a synchronous call or a database transaction.",
      ],
    },
    {
      id: "freelancing-lessons",
      title: "Three years of freelancing: what I got wrong first",
      excerpt:
        "Pricing, scope, communication, and the two habits that made the biggest difference to my sanity.",
      date: "Oct 2024",
      readTime: "4 min",
      tags: ["Career", "Opinion"],
      status: "published",
      coverImage: "",
      body: [
        "I've been freelancing on the side since my second year at university. Here are the mistakes I made early and what I'd tell myself in 2022.",
        "Mistake one: fixed-price projects without a detailed spec. Every project where I said 'I'll build this for X' without a written spec turned into a scope-creep nightmare. Now I charge hourly for discovery, write a spec with the client, then quote fixed-price from that spec.",
        "Mistake two: underpricing to win the project. Cheap work attracts clients who treat you as cheap. Raising my rates by 40% reduced the number of leads but doubled my revenue, and the clients were dramatically easier to work with.",
        "The two habits that helped most: weekly written updates (even if nothing changed) and a shared task board. Both make the client feel informed and reduce the number of 'just checking in' messages by roughly 80%.",
        "The honest truth: freelancing is sales as much as it is engineering. Get comfortable with that, or find a different path.",
      ],
    },
  ],

  about: {
    headline: "ML engineer with a full-stack habit",
    coverImage: "",
    paragraphs: [
      "I started in machine learning — intent recognition, recommendation systems, sound classification — and kept drifting toward the plumbing behind it. Today I spend most of my time on backend systems: APIs, data pipelines, and the analytics layers that turn raw tables into something a person can act on.",
      "At DalloTech I work on a full ERP for Jeevan Vigyan and on Tathyanaka, an analytics product where I sit on the core AI R&D team. Outside of that I take on freelance builds — event platforms, ordering systems — usually the ones with an interesting retrieval or recommendation problem hiding inside.",
      "Based in Tripureshwor, Kathmandu. Currently finishing a BSc IT (Hons) at Techspire College / Asia Pacific University.",
    ],
    facts: [
      { k: "location", v: "Tripureshwor, Kathmandu" },
      { k: "current role", v: "ML Engineer & Full-stack Dev at DalloTech" },
      { k: "side quests", v: "Reading about distributed systems, hiking, photography" },
      { k: "currently learning", v: "Rust, LLM fine-tuning, system design" },
    ],
  },

  // single source for the résumé — the public /resume page groups these into blocks,
  // the about page derives its "education & certifications" list from them
  resume: {
    experiences: [
      {
        title: "ML Engineer & Full-stack Developer",
        period: "2023 — present",
        organization: "DalloTech",
        body: "Core AI R&D on Tathyanaka analytics platform. Built ERP for Jeevan Vigyan. REST API design and backend engineering.",
      },
      {
        title: "Freelance Developer",
        period: "2022 — 2023",
        organization: "Self-employed",
        body: "Event management platform, restaurant ordering system, and ML prototypes for 3 clients.",
      },
    ],
    education: [
      {
        title: "BSc IT (Hons) — Software Engineering",
        period: "2021 — present",
        organization: "Techspire College / Asia Pacific University",
        body: "Specialisation in software engineering and machine learning. Final year project: LLM-powered code review assistant.",
      },
    ],
    certifications: [
      {
        title: "TensorFlow Developer Certificate",
        period: "2023",
        organization: "Google — Coursera",
        body: "Official TensorFlow certification covering computer vision, NLP, and time-series with Keras.",
      },
      {
        title: "AWS Cloud Practitioner",
        period: "2022",
        organization: "Amazon Web Services",
        body: "Foundational AWS certification covering core services, pricing, and architecture best practices.",
      },
    ],
    skills: [
      { title: "ML / AI", body: "PyTorch, TensorFlow, scikit-learn, LangChain, LangGraph, RAG, HuggingFace Transformers" },
      { title: "Backend", body: "Python, FastAPI, Django, Node.js, REST APIs, PostgreSQL, Redis, MongoDB" },
      { title: "Frontend & Infra", body: "React, Next.js, TypeScript, Tailwind CSS, Docker, GitHub Actions, Linux, AWS" },
    ],
  },

  contactLinks: [
    { label: "Email", value: "birajbuddhacharya@gmail.com", href: "mailto:birajbuddhacharya@gmail.com" },
    { label: "GitHub", value: "github.com/birajbuddhacharya", href: "https://github.com/birajbuddhacharya" },
    { label: "LinkedIn", value: "linkedin.com/in/biraj-buddhacharya", href: "https://linkedin.com/in/biraj-buddhacharya" },
    { label: "Location", value: "Kathmandu, Nepal", href: "#" },
  ],

  admin: {
    chartBars: [
      18, 32, 27, 41, 55, 38, 29, 62, 48, 71, 54, 39, 66, 80,
    ],
    topPages: [
      { path: "/", views: "1,204", pct: 100 },
      { path: "/projects", views: "842", pct: 70 },
      { path: "/blog", views: "538", pct: 45 },
      { path: "/contact", views: "311", pct: 26 },
      { path: "/resume", views: "147", pct: 12 },
    ],
    activity: [
      { text: "New message from Anil Sharma — \"Quick question about your stack\"", time: "2m ago" },
      { text: "Blog post \"RAG chatbot\" reached 200 views", time: "1h ago" },
      { text: "Project RiskVision detail page visited 14 times today", time: "3h ago" },
      { text: "New message from recruiter@company.io — \"Exciting opportunity\"", time: "6h ago" },
    ],
    inbox: [
      {
        id: "m1", name: "Anil Sharma", email: "anil@example.com",
        subject: "Quick question about your stack",
        body: "Hey Biraj, loved your RAG post. I'm building something similar and curious whether you'd recommend pgvector over Pinecone for a small-scale deployment. Happy to chat over coffee if you're around Kathmandu.",
        time: "2m", read: false,
      },
      {
        id: "m2", name: "Recruiter @ TechCo", email: "recruiter@techco.io",
        subject: "Senior ML Engineer opening — remote",
        body: "Hi Biraj, I came across your portfolio and your experience with LangChain and FastAPI aligns well with a role we're filling. It's a fully remote senior ML engineer position. Would you be open to a 20-minute call this week?",
        time: "6h", read: false,
      },
      {
        id: "m3", name: "Priya Maharjan", email: "priya@startup.np",
        subject: "Freelance project — event platform",
        body: "Hi! We're building a ticketing platform for cultural events in Nepal and would love to work with you. We saw the EventPulse project on your portfolio. Can you share your availability and rates?",
        time: "1d", read: false,
      },
      {
        id: "m4", name: "Dev Community", email: "noreply@devto.io",
        subject: "Your post was featured in the weekly digest",
        body: "Congratulations! Your article 'Building a production RAG chatbot with LangChain and pgvector' was selected for this week's ML digest. It reached 800+ readers.",
        time: "2d", read: true,
      },
      {
        id: "m5", name: "Rahul K.", email: "rahul@agency.in",
        subject: "Collaboration inquiry",
        body: "Hey, we're a small design agency in Bangalore and often need a backend/ML developer for client projects. Your work looks great. Would you be interested in a retainer arrangement?",
        time: "3d", read: true,
      },
    ],
    settingsFields: [
      { label: "Display name", value: "Biraj Buddhacharya" },
      { label: "Email", value: "birajbuddhacharya@gmail.com" },
      { label: "Tagline", value: "ML Engineer & Full-stack Developer" },
      { label: "Location", value: "Kathmandu, Nepal" },
    ],
  },
};

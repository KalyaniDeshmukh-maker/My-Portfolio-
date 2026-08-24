/**
 * ResuMind AI - Analysis & NLP Intelligence Service
 * Handles resume parsing, keyword extraction, ATS scoring, and bullet point enhancement.
 */

export const SKILL_TAXONOMY = {
  dataScience: [
    'Python', 'Pandas', 'NumPy', 'Scikit-Learn', 'TensorFlow', 'PyTorch', 'Machine Learning', 
    'Deep Learning', 'Data Analysis', 'Data Visualization', 'Matplotlib', 'Seaborn', 'SQL', 
    'NLP', 'Computer Vision', 'Statistics', 'Jupyter', 'EDA', 'Feature Engineering'
  ],
  frontend: [
    'JavaScript', 'ES6+', 'TypeScript', 'React', 'HTML5', 'CSS3', 'TailwindCSS', 
    'Responsive Design', 'UI/UX', 'Glassmorphism', 'REST API', 'DOM Manipulation', 
    'Frontend Architecture', 'Antigravity IDE', 'Web Performance', 'Vite', 'Webpack'
  ],
  backendTools: [
    'Node.js', 'Express', 'Python Flask', 'FastAPI', 'RESTful APIs', 'Git', 'GitHub', 
    'Docker', 'Linux', 'VS Code', 'Postman', 'MySQL', 'PostgreSQL', 'MongoDB'
  ],
  iotHardware: [
    'C', 'C++', 'ESP32', 'Arduino', 'Sensors', 'Embedded Systems', 'IoT', 'Microcontrollers', 
    'Telemetry', 'MQTT', 'Serial Communication'
  ],
  softSkills: [
    'Problem Solving', 'Communication', 'Teamwork', 'Leadership', 'Time Management', 
    'Adaptability', 'Critical Thinking', 'Agile', 'Event Management', 'Collaboration'
  ]
};

export const SAMPLE_PRESETS = [
  {
    id: 'data-science-intern',
    title: 'Data Science & AI Intern (Match with Kalyani)',
    jobRole: 'Data Science Intern',
    jobDescription: `We are looking for a Data Science Intern with a strong foundation in Python, Machine Learning, and Data Analysis.
Key Responsibilities:
- Perform Exploratory Data Analysis (EDA) using NumPy, Pandas, and Matplotlib.
- Build predictive Machine Learning models using Scikit-Learn.
- Collaborate with the software engineering team to integrate models with RESTful APIs.
- Utilize Git and GitHub for version control.
- Effective communication, analytical problem solving, and ability to present data insights clearly.
Nice to have: Experience with interactive web dashboards, SQL, and AI developer tooling.`,
    sampleResume: `KALYANI VILAS DESHMUKH
B.Tech CSE (Data Science) Student | CGPA: 7.12
Skills: Python, JavaScript, C, SQL, NumPy, Pandas, Scikit-Learn Basics, Matplotlib, Data Visualization, Git, GitHub, REST APIs, HTML5, CSS3, Antigravity IDE, ESP32 Basics.
Projects:
1. ResuMind AI - Intelligent Resume & Skill Gap Analyzer: Built full-stack web application using JavaScript, CSS3 design systems, and Chart.js. Processed resume text, computed ATS compatibility scores, and extracted missing keyword intelligence.
2. Smart IoT Environmental Monitoring: Developed ESP32 sensor telemetry stream and web dashboard with data visualization.
3. Number Guessing Game: JavaScript web app with robust input validation.
Leadership: Core contributor in Fetch.ai Club, organizing technical events and workshops.`
  },
  {
    id: 'frontend-engineer',
    title: 'Junior Frontend / Web Developer',
    jobRole: 'Frontend Developer',
    jobDescription: `Seeking an enthusiastic Frontend Developer to engineer modern, responsive user interfaces.
Requirements:
- Strong proficiency in HTML5, CSS3, Modern JavaScript (ES6+).
- Experience building responsive layouts, mobile-first design, and clean UI/UX components.
- Understanding of REST API integration and asynchronous data fetching.
- Familiarity with CSS Custom Properties, modern CSS design systems, and Git version control.
- Good communication and teamwork skills.`
  }
];

/**
 * Clean and tokenize raw text into normalized words and bigrams
 */
export function extractKeywords(text) {
  if (!text) return [];
  const normalized = text.toLowerCase().replace(/[^a-z0-9+#\.\-\s]/g, ' ');
  const tokens = normalized.split(/\s+/).filter(t => t.length > 1);
  return tokens;
}

/**
 * Cross-match extracted text with skill taxonomy
 */
export function identifySkills(text) {
  if (!text) return { foundSkills: [], categorized: {} };
  const lowerText = text.toLowerCase();
  const foundSkills = [];
  const categorized = {};

  for (const [category, skills] of Object.entries(SKILL_TAXONOMY)) {
    categorized[category] = [];
    for (const skill of skills) {
      const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      if (regex.test(lowerText)) {
        foundSkills.push(skill);
        categorized[category].push(skill);
      }
    }
  }

  return { foundSkills: [...new Set(foundSkills)], categorized };
}

/**
 * Compute ATS Compatibility Score & Gap Analysis
 */
export async function analyzeResume(resumeText, jobDescription) {
  // Simulate realistic API latency for async request demonstration
  await new Promise(resolve => setTimeout(resolve, 450));

  if (!resumeText || !jobDescription) {
    throw new Error('Both Resume text and Job Description are required for analysis.');
  }

  const resumeSkillsData = identifySkills(resumeText);
  const jobSkillsData = identifySkills(jobDescription);

  const resumeSkills = new Set(resumeSkillsData.foundSkills.map(s => s.toLowerCase()));
  const jobSkills = new Set(jobSkillsData.foundSkills.map(s => s.toLowerCase()));

  const matchedSkills = [];
  const missingSkills = [];

  jobSkillsData.foundSkills.forEach(skill => {
    if (resumeSkills.has(skill.toLowerCase())) {
      matchedSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  });

  const additionalSkills = resumeSkillsData.foundSkills.filter(
    skill => !jobSkills.has(skill.toLowerCase())
  );

  // Calculate scores
  const skillMatchRatio = jobSkillsData.foundSkills.length > 0 
    ? (matchedSkills.length / jobSkillsData.foundSkills.length)
    : 0.75;

  // Check section completeness
  const sections = {
    contact: /(email|phone|linkedin|github|location|contact)/i.test(resumeText),
    education: /(education|b\.tech|degree|cgpa|university|college|school)/i.test(resumeText),
    skills: /(skills|technical skills|technologies|tools|languages)/i.test(resumeText),
    projects: /(projects|experience|work|portfolio)/i.test(resumeText)
  };

  const sectionScore = Object.values(sections).filter(Boolean).length / 4;
  
  // Keyword density score
  const resumeWordCount = resumeText.trim().split(/\s+/).length;
  const lengthScore = resumeWordCount >= 200 && resumeWordCount <= 1000 ? 1 : (resumeWordCount > 100 ? 0.7 : 0.4);

  // Weighted overall ATS score
  const rawScore = Math.round((skillMatchRatio * 55) + (sectionScore * 25) + (lengthScore * 20));
  const overallScore = Math.min(Math.max(rawScore, 15), 98);

  // Categorical breakdown for charts
  const categoryBreakdown = {};
  for (const [cat, skills] of Object.entries(SKILL_TAXONOMY)) {
    const jobCount = jobSkillsData.categorized[cat]?.length || 0;
    const resumeCount = resumeSkillsData.categorized[cat]?.length || 0;
    categoryBreakdown[cat] = {
      category: cat,
      required: jobCount,
      matched: resumeSkillsData.categorized[cat]?.filter(s => jobSkillsData.foundSkills.includes(s)).length || 0,
      totalResume: resumeCount
    };
  }

  // Generate actionable tips
  const recommendations = [];
  if (missingSkills.length > 0) {
    recommendations.push({
      type: 'critical',
      title: 'Missing Crucial Keywords',
      desc: `Add verified skills mentioned in the job description: ${missingSkills.slice(0, 4).join(', ')}.`
    });
  }
  if (!sections.projects) {
    recommendations.push({
      type: 'warning',
      title: 'Projects Section Missing',
      desc: 'Add a distinct "Projects" section with technical impact bullet points.'
    });
  }
  if (resumeWordCount < 250) {
    recommendations.push({
      type: 'info',
      title: 'Content Depth',
      desc: 'Your resume text seems brief. Expand on technical decisions and metrics achieved.'
    });
  }
  if (overallScore >= 80) {
    recommendations.push({
      type: 'success',
      title: 'High ATS Alignment',
      desc: 'Strong keyword overlap and section structure. Your profile matches this role effectively!'
    });
  }

  return {
    overallScore,
    stats: {
      matchedCount: matchedSkills.length,
      missingCount: missingSkills.length,
      totalJobSkills: jobSkillsData.foundSkills.length,
      wordCount: resumeWordCount
    },
    matchedSkills,
    missingSkills,
    additionalSkills,
    categoryBreakdown,
    sections,
    recommendations
  };
}

/**
 * AI-Powered Bullet Point Enhancer (STAR Method Transformation)
 */
export function enhanceBulletPoint(draftText, skillFocus = 'General') {
  if (!draftText || draftText.trim().length === 0) {
    return 'Please enter a draft bullet point to enhance.';
  }

  const clean = draftText.trim();
  
  // Rule-based heuristics for realistic instant STAR enhancement
  if (/guessing game|number game/i.test(clean)) {
    return 'Engineered a responsive, browser-based Number Guessing Game in JavaScript with custom glassmorphic styling, robust multi-type input validation, and interactive feedback loops that achieved zero-latency UI responses.';
  } else if (/iot|sensor|esp32|arduino/i.test(clean)) {
    return 'Architected an IoT environmental telemetry node using ESP32 and multi-sensor hardware to stream real-time atmospheric metrics to a responsive web dashboard with live trend visualizers.';
  } else if (/resume|ats|analyzer|tool/i.test(clean)) {
    return 'Built a full-stack AI Resume & Skill Gap Intelligence Platform using modern JavaScript (ES6+) and CSS custom properties, calculating real-time ATS compatibility scores and rendering dynamic Chart.js skill breakdown visualizers.';
  } else {
    // General STAR enhancement
    return `Spearheaded the development of ${clean.replace(/^(built|made|created|did|worked on)\s+/i, '')}, implementing modular ${skillFocus} architecture, optimizing performance, and delivering intuitive user experiences.`;
  }
}

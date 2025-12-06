# Calmly - Technical Architecture

**AI-powered communication coach for emotionally intelligent responses**

---

## 1. System Diagram

```
┌─────────────┐
│   Client    │ (React/Next.js Web App)
└──────┬──────┘
       │ HTTPS
       ▼
┌─────────────────────────────────────────────────────────┐
│              api-gateway (Public Service)               │
│  - HTTP routing & validation                            │
│  - Optional WorkOS auth                                 │
│  - Response formatting                                  │
└─────────────┬───────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────┐
│           coaching-engine (Private Service)             │
│  - Context detection (work/friendship/relationship)     │
│  - Multi-response generation via SmartInference         │
│  - Response refinement logic                            │
│  - User preference retrieval                            │
└───┬─────────┬──────────┬─────────────┬─────────────────┘
    │         │          │             │
    ▼         ▼          ▼             ▼
┌──────┐ ┌────────┐ ┌───────────┐ ┌──────────────┐
│ user-│ │scenario│ │ calmly-db │ │interaction-  │
│memory│ │-library│ │   (SQL)   │ │queue         │
│(SM)  │ │  (SB)  │ └───────────┘ └──────┬───────┘
└──────┘ └────────┘                      │
                                          ▼
                              ┌──────────────────────┐
                              │ interaction-recorder │
                              │    (Observer)        │
                              │ - Store interactions │
                              │ - Update patterns    │
                              │ - Session summaries  │
                              └──────────────────────┘

┌─────────────────────────────────────────────────────────┐
│            calmly-mcp (MCP Service)                     │
│  Exposes tools for AI agent integration:                │
│  - analyze_situation, generate_responses, etc.          │
└─────────────────────────────────────────────────────────┘

External Integrations:
  ├─ WorkOS (auth - optional)
  ├─ Stripe (payments - optional)
  ├─ ElevenLabs (voice synthesis - optional)
  └─ Vultr Managed PostgreSQL (production database)
```

**Flow**: User submits situation → API Gateway validates → Coaching Engine analyzes context, retrieves user preferences from SmartMemory, searches similar scenarios in SmartBucket, generates responses via SmartInference → Returns 1-3 responses with explanations → User selects/refines → Interaction queued → Recorder stores in memory +  Vultr SQL database

---

## 2. API Endpoints

### **POST /api/analyze**
Analyze situation context and emotional tone.

**Request:**
```json
{
  "situation": "My coworker keeps taking credit for my ideas in team meetings.",
  "userId": "user_123"
}
```

**Response:**
```json
{
  "context": "work",
  "confidence": 0.92,
  "emotionalTone": "frustrated_but_professional",
  "keyElements": ["workplace conflict", "credit attribution", "team dynamics"]
}
```

**Validation:** `situation` required (max 2000 chars), `userId` optional

---

### **POST /api/generate**
Generate 1-3 contextual response suggestions.

**Request:**
```json
{
  "situation": "My coworker keeps taking credit for my ideas.",
  "context": "work",
  "userId": "user_123"
}
```

**Response:**
```json
{
  "responses": [
    {
      "id": "resp_1",
      "tone": "Calm and Professional",
      "text": "I appreciate our collaboration. I'd like to discuss how we can better acknowledge individual contributions going forward.",
      "explanation": "Maintains professionalism while clearly stating needs without confrontation."
    },
    {
      "id": "resp_2",
      "tone": "Empathetic",
      "text": "I know we both worked hard. It's important to me that our team understands who contributed what.",
      "explanation": "Acknowledges shared effort while gently addressing attribution."
    },
    {
      "id": "resp_3",
      "tone": "Direct but Kind",
      "text": "I noticed my contribution wasn't mentioned. I'd like us to be more transparent about who does what.",
      "explanation": "Directly names the issue while maintaining constructive tone."
    }
  ],
  "metadata": {
    "generatedAt": "2025-01-15T10:30:00Z",
    "model": "llama-3.3-70b"
  }
}
```

**Validation:** `situation` required (max 2000 chars), `context` optional (work/friendship/relationship), `userId` optional

---

### **POST /api/refine**
Adjust tone or assertiveness of existing response.

**Request:**
```json
{
  "responseId": "resp_1",
  "originalText": "I appreciate our collaboration...",
  "adjustment": "Make it more assertive",
  "userId": "user_123"
}
```

**Response:**
```json
{
  "refinedResponse": {
    "id": "resp_1_refined",
    "tone": "Assertive and Professional",
    "text": "I need to address something important: my contributions should be acknowledged in team meetings.",
    "changes": ["Increased directness", "Stronger language", "More explicit expectations"]
  }
}
```

**Validation:** `responseId`, `originalText` (max 2000 chars), `adjustment` (max 200 chars) required; `userId` optional

---

### **POST /api/interactions**
Save interaction for personalization.

**Request:**
```json
{
  "userId": "user_123",
  "situationDescription": "Coworker taking credit for ideas",
  "detectedContext": "work",
  "selectedResponse": "I need to address something important...",
  "selectedTone": "Assertive and Professional",
  "refinementCount": 1
}
```

**Response:**
```json
{
  "interactionId": "int_456",
  "saved": true,
  "queuedForProcessing": true
}
```

**Validation:** `userId`, `situationDescription`, `selectedResponse` required

---

### **GET /api/preferences**
Retrieve user preferences.

**Request:** Query param `userId=user_123`

**Response:**
```json
{
  "userId": "user_123",
  "preferredTone": "balanced",
  "defaultAssertiveness": 5,
  "voiceEnabled": false,
  "elevenLabsVoiceId": null
}
```

---

### **PUT /api/preferences**
Update user preferences.

**Request:**
```json
{
  "userId": "user_123",
  "preferredTone": "empathetic",
  "defaultAssertiveness": 4,
  "voiceEnabled": true,
  "elevenLabsVoiceId": "voice_abc123"
}
```

**Response:**
```json
{
  "updated": true,
  "preferences": { /* updated preferences */ }
}
```

---

### **GET /api/scenarios**
Search scenario template library.

**Request:** Query params `context=work&query=team+conflict`

**Response:**
```json
{
  "scenarios": [
    {
      "id": "scn_1",
      "title": "Credit Attribution Conflict",
      "context": "work",
      "description": "Colleague taking credit for your work",
      "suggestedApproaches": ["Document contributions", "Address privately", "Loop in manager"],
      "relevanceScore": 0.89
    }
  ],
  "pagination": { "total": 15, "page": 1, "pageSize": 10 }
}
```

---

### **POST /api/voice/synthesize**
Generate speech from text (optional ElevenLabs integration).

**Request:**
```json
{
  "text": "I need to address something important about attribution.",
  "voiceId": "voice_abc123",
  "userId": "user_123"
}
```

**Response:**
```json
{
  "audioUrl": "https://storage.liquidmetal.ai/audio/xyz789.mp3",
  "duration": 3.5,
  "format": "mp3"
}
```

---

### **GET /health**
Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "services": {
    "ai": "operational",
    "memory": "operational",
    "storage": "operational"
  }
}
```

---

### **Error Codes**
- **400**: Invalid request payload
- **401**: Authentication required
- **403**: Insufficient permissions
- **404**: Resource not found
- **429**: Rate limit exceeded
- **500**: Internal server error
- **503**: AI service unavailable

---

## 3. Raindrop SmartComponents Usage

### **SmartMemory (user-memory)**

**Four-layer memory system for personalization:**

1. **Working Memory**: Active session data (temporary)
   - Current situation context
   - Generated responses
   - User's refinement commands

2. **Episodic Memory**: Historical interactions (long-term)
   - Session summaries: "User prefers empathetic tone for relationship conflicts"
   - Interaction patterns: "User often refines responses to be more assertive"

3. **Semantic Memory**: Learned patterns (knowledge base)
   - Tone preferences by context: `{"work": "professional", "relationship": "empathetic"}`
   - Common refinement patterns: "User increases assertiveness 70% of time"

4. **Procedural Memory**: Coaching templates (how-to)
   - Best practices for context detection
   - Response generation strategies

**Usage in code:**
```typescript
// Store interaction in working memory
await env.USER_MEMORY.putMemory({
  session_id: userId,
  content: JSON.stringify(interaction),
  key: "interaction",
  timeline: "*workplaceConflict"
});

// Retrieve user patterns
const patterns = await env.USER_MEMORY.getMemory({
  session_id: userId,
  key: "tone_preference",
  n_most_recent: 10
});

// Search similar situations
const similar = await env.USER_MEMORY.searchMemory({
  session_id: userId,
  terms: "coworker credit attribution",
  n_most_recent: 5
});
```

---

### **SmartBucket (scenario-library)**

**Semantic search and RAG for scenario templates:**

- **Content**: Pre-defined scenarios organized by context (work, friendship, relationship)
- **Capabilities**:
  - Semantic search to find relevant examples
  - Document retrieval for detailed scenario analysis
  - Automatic indexing of uploaded scenarios

**Usage in code:**
```typescript
// Search for similar scenarios
const scenarios = await env.SCENARIO_LIBRARY.documentSearch({
  bucket_name: "scenario-library",
  query: "team meeting conflict attribution",
  threshold: 0.7,
  limit: 5
});

// Query specific scenario
const details = await env.SCENARIO_LIBRARY.documentQuery({
  bucket_name: "scenario-library",
  document_id: "scn_workplace_credit",
  query: "What are the best approaches for this situation?"
});
```

**Sample Scenario Structure:**
```json
{
  "id": "scn_1",
  "title": "Credit Attribution Conflict",
  "context": "work",
  "description": "Coworker consistently takes credit for your contributions in meetings",
  "emotionalSignals": ["frustration", "desire_for_recognition", "fear_of_confrontation"],
  "suggestedApproaches": [
    {
      "tone": "Professional",
      "template": "I'd like to discuss how we acknowledge contributions...",
      "effectiveness": 0.85
    }
  ],
  "commonRefinements": ["more assertive", "include specific examples"]
}
```

---

### **SmartInference (Built-in AI)**

**AI model access for response generation:**

- **Model**: llama-3.3-70b (default), configurable
- **Tasks**:
  - Context classification (work/friendship/relationship)
  - Emotional tone detection
  - Multi-response generation (3 variants with different tones)
  - Response refinement based on user commands

**Usage in code:**
```typescript
// Generate responses using SmartInference
const prompt = `
Situation: ${situation}
Context: ${context}
User preferences: ${JSON.stringify(preferences)}

Generate 3 responses with different tones:
1. Calm and Professional
2. Empathetic
3. Direct but Kind

For each response, explain why it works.
`;

const responses = await env.ai.run("llama-3.3-70b", {
  messages: [{ role: "user", content: prompt }]
});
```

---

### **SQL Database (calmly-db)**

**Persistent storage for structured data:**

- **Tables**: users, user_preferences, interactions, api_keys
- **Purpose**: Relational queries, user management, analytics

**Integration with Vultr**: Database can be hosted on Vultr Managed Database for production scale.

---

### **Queue (interaction-queue)**

**Async event processing:**

- **Purpose**: Decouple API response from memory updates
- **Pattern**: Fire-and-forget for interactions
- **Reliability**: Automatic retries, dead-letter queue

**Usage:**
```typescript
// Queue interaction for async processing
await env.INTERACTION_QUEUE.send({
  userId: "user_123",
  interaction: interactionData,
  timestamp: Date.now()
});
```

---

### Vultr Integration

**Production Database Infrastructure:**

Calmly Coach uses **Vultr Managed PostgreSQL 16** for production data persistence:

**Configuration:**
- **Service:** Managed Database - PostgreSQL 16
- **Region:** Johannesburg
- **Features:** Automatic daily backups, connection pooling (PgBouncer), SSL/TLS encryption, 99.99% SLA
- **Monitoring:** Real-time CPU, memory, disk I/O, and connection metrics

**Data Storage:**
- User accounts and authentication
- Interaction history for personalization
- User preferences and settings
- API key management (future)

**Why Vultr:**
- **Zero-ops management** - Automatic updates, backups, and monitoring
- **Cost-effective scaling** - Start at $15/month, scale to enterprise
- **Production SLA** - 99.99% uptime guarantee
- **Developer experience** - One-click provisioning, web SQL console

**Architecture Benefits:**
- **Raindrop SmartMemory** handles real-time AI personalization and pattern learning
- **Vultr PostgreSQL** provides durable storage and relational queries
- **Hybrid approach** balances AI capabilities with production reliability
- **Migration path** documented for seamless dev-to-production deployment

**Connection:**
```typescript
const db = env.CALMLY_DB.prepare(
  'SELECT * FROM user_preferences WHERE user_id = ?'
).bind(userId);
```

**Cost**: ~$15-60/month depending on instance size

---

### **Recommended Approach: Hybrid**

1. **Vultr Managed Database** for SQL (always-on, predictable load)
2. **Vultr Compute** for peak traffic AI inference (burst capacity)
3. **Raindrop SmartInference** for baseline AI (cost-effective for moderate load)

**Decision Logic:**
```typescript
async function generateResponses(situation: string) {
  const queueDepth = await getInferenceQueueDepth();

  if (queueDepth > 10) {
    // High load: offload to Vultr
    return await generateResponsesViaVultr(situation);
  } else {
    // Normal load: use Raindrop SmartInference
    return await env.ai.run("llama-3.3-70b", { /* ... */ });
  }
}
```

---

## 5. Data Models

### **User**
```json
{
  "id": "user_123",
  "email": "user@example.com",
  "workosUserId": "workos_abc456",
  "createdAt": "2025-01-15T10:00:00Z",
  "updatedAt": "2025-01-15T10:00:00Z"
}
```

### **UserPreferences**
```json
{
  "id": "pref_789",
  "userId": "user_123",
  "preferredTone": "balanced",
  "defaultAssertiveness": 5,
  "voiceEnabled": false,
  "elevenLabsVoiceId": null,
  "createdAt": "2025-01-15T10:00:00Z",
  "updatedAt": "2025-01-15T10:00:00Z"
}
```

### **Interaction**
```json
{
  "id": "int_456",
  "userId": "user_123",
  "situationDescription": "My coworker keeps taking credit for my ideas.",
  "detectedContext": "work",
  "selectedResponse": "I need to address something important...",
  "selectedTone": "Assertive and Professional",
  "refinementCount": 1,
  "createdAt": "2025-01-15T10:30:00Z"
}
```

### **Scenario**
```json
{
  "id": "scn_1",
  "title": "Credit Attribution Conflict",
  "context": "work",
  "description": "Colleague taking credit for your work in team meetings",
  "emotionalSignals": ["frustration", "desire_for_recognition"],
  "suggestedApproaches": [
    {
      "tone": "Professional",
      "template": "I'd like to discuss how we acknowledge contributions...",
      "effectiveness": 0.85
    },
    {
      "tone": "Direct",
      "template": "I noticed my contribution wasn't mentioned...",
      "effectiveness": 0.78
    }
  ],
  "commonRefinements": ["more assertive", "include specific examples"],
  "relevanceScore": 0.89
}
```

### **Response**
```json
{
  "id": "resp_1",
  "tone": "Calm and Professional",
  "text": "I appreciate our collaboration on this project. I'd like to discuss how we can better acknowledge individual contributions in our team meetings going forward.",
  "explanation": "This response maintains professionalism while clearly stating your needs without direct confrontation.",
  "metadata": {
    "generatedAt": "2025-01-15T10:30:00Z",
    "model": "llama-3.3-70b",
    "tokenCount": 87
  }
}
```

### **MemoryEntry** (SmartMemory structure)
```json
{
  "memoryId": "mem_abc123",
  "sessionId": "user_123",
  "content": "User prefers empathetic tone for relationship conflicts and direct tone for workplace issues",
  "key": "tone_preference",
  "timeline": "*userPatterns",
  "agent": "interaction-recorder",
  "timestamp": "2025-01-15T10:45:00Z"
}
```

### **QueueMessage** (interaction-queue)
```json
{
  "messageId": "msg_xyz789",
  "userId": "user_123",
  "interaction": {
    "situationDescription": "...",
    "detectedContext": "work",
    "selectedResponse": "...",
    "selectedTone": "Assertive",
    "refinementCount": 1
  },
  "timestamp": 1705315800000,
  "retryCount": 0
}
```

---

## 6. Component Responsibilities

| Component | Type | Visibility | Purpose |
|-----------|------|-----------|---------|
| **api-gateway** | service | public | HTTP API entry, auth, validation, routing |
| **coaching-engine** | service | private | Core AI reasoning, response generation, context detection |
| **calmly-mcp** | mcp_service | public | MCP server exposing tools for AI agent integration |
| **interaction-recorder** | observer | private | Async interaction storage, memory updates, session summaries |
| **user-memory** | smartmemory | - | User preferences, interaction history, pattern learning |
| **scenario-library** | smartbucket | - | Scenario templates, semantic search, RAG retrieval |
| **calmly-db** | sql_database | - | User accounts, preferences, interaction records |
| **interaction-queue** | queue | - | Async event processing for interactions |

---

## 7. Inter-Component Communication

```
api-gateway → coaching-engine.analyzeContext(situation)
api-gateway → coaching-engine.generateResponses(situation, context, userId)
api-gateway → coaching-engine.refineResponse(responseId, adjustment)
api-gateway → coaching-engine.getUserPreferences(userId)
api-gateway → coaching-engine.getScenarioTemplates(context, query)

coaching-engine → user-memory.getMemory(userId)
coaching-engine → scenario-library.documentSearch(query)
coaching-engine → interaction-queue.send(interaction)
coaching-engine → ai.run(model, prompt)
coaching-engine → calmly-db.query(sql)

calmly-mcp → coaching-engine.* (delegates all tool calls)

interaction-recorder ← interaction-queue (triggered by new messages)
interaction-recorder → user-memory.putMemory(interaction)
interaction-recorder → calmly-db.insert(interaction)
```

---

## 8. Deployment Architecture

### **Backend (Raindrop MCP)**
```bash
# Deploy to LiquidMetal Raindrop
raindrop deploy

# Resources provisioned:
# - api-gateway (public HTTP endpoint)
# - coaching-engine (private service)
# - calmly-mcp (MCP server)
# - interaction-recorder (observer)
# - user-memory (SmartMemory instance)
# - scenario-library (SmartBucket)
# - calmly-db (Vultr Managed PostgreSQL)
# - interaction-queue (durable queue)
```

### **Frontend (Netlify)**
```bash
# React/Next.js app
npm run build
netlify deploy --prod

# Environment variables:
# - VITE_API_BASE_URL=https://api.calmly.liquidmetal.run
# - VITE_WORKOS_CLIENT_ID=(optional)
```

### **Environment Variables**
```bash
# Required
RAINDROP_API_KEY=rdp_xxx
VULTR_DB_CONNECTION_STRING=postgresql://user:pass@host:5432/calmly

# Optional
WORKOS_CLIENT_ID=client_xxx
WORKOS_CLIENT_SECRET=sk_xxx
STRIPE_SECRET_KEY=sk_live_xxx
ELEVENLABS_API_KEY=el_xxx
VULTR_COMPUTE_ENDPOINT=https://inference.vultr.example.com
VULTR_API_KEY=vultr_xxx
```

---

## 9. Performance Characteristics

- **Response generation**: < 5s (target: 3s)
- **Response refinement**: < 3s (target: 2s)
- **Context detection**: < 2s (parallel with generation)
- **Memory retrieval**: < 500ms (SmartMemory indexed)
- **Scenario search**: < 1s (SmartBucket semantic search)
- **Queue processing**: Async (does not block user response)

**Scalability:**
- Horizontal scaling for api-gateway (stateless)
- Coaching-engine scales with inference demand
- Observer auto-scales based on queue depth
- Vultr DB handles 1000+ concurrent connections

---

## 10. File Structure

```
calmly-coach/
├── src/
│   ├── api-gateway/
│   │   ├── index.ts          # HTTP routes and middleware
│   │   ├── interfaces.ts     # Request/response types
│   │   └── utils.ts          # Validation helpers
│   ├── coaching-engine/
│   │   ├── index.ts          # Core AI logic
│   │   ├── interfaces.ts     # Domain types
│   │   └── utils.ts          # Prompt builders
│   ├── calmly-mcp/
│   │   ├── index.ts          # MCP server setup
│   │   ├── interfaces.ts     # Tool schemas
│   │   └── tools/
│   │       ├── analyze_situation.ts
│   │       ├── generate_responses.ts
│   │       ├── refine_response.ts
│   │       ├── get_user_history.ts
│   │       ├── save_interaction.ts
│   │       └── search_scenarios.ts
│   └── interaction-recorder/
│       ├── index.ts          # Observer main loop
│       ├── interfaces.ts     # Message types
│       └── utils.ts          # Memory helpers
├── db/
│   └── calmly-db/
│       ├── schema.sql        # SQL table definitions
│       └── README.md
├── prisma/
│   └── schema.prisma         # ORM schema (optional)
├── scripts/
│   └── seed-scenarios.ts     # Populate scenario library
├── docs/
│   └── architecture.md       # THIS FILE
├── raindrop.manifest         # Raindrop resource definitions
├── package.json
└── tsconfig.json
```

---

## Summary

**Calmly** is a hackathon-ready AI communication coach leveraging Raindrop's SmartComponents (Memory, Buckets, Inference) with Vultr integration for scalable database and optional compute offloading. The architecture separates concerns clearly: api-gateway handles HTTP, coaching-engine contains AI logic, calmly-mcp exposes MCP tools, and interaction-recorder processes async events. SmartMemory enables personalization through four-layer memory, SmartBucket provides semantic scenario search, and Vultr ensures production-grade persistence and burst capacity. All APIs are RESTful with JSON schemas, targeting sub-5s response times for real-time coaching.

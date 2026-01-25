# 🔄 n8n Integration Guide for AI Tender Guardian

## 📋 Table of Contents
1. [What is n8n & Why Use It?](#what-is-n8n)
2. [Installation & Setup](#installation)
3. [Core Workflow Examples](#workflows)
4. [Real-World Automation Scenarios](#scenarios)
5. [Advanced Integration Patterns](#advanced)
6. [Production Deployment](#production)

---

## 🤔 WHAT IS n8n & WHY USE IT? {#what-is-n8n}

### What is n8n?

**n8n** (nodemation) is an open-source workflow automation tool that connects apps and services together. Think of it as:
- **Zapier/Make.com** but self-hosted and code-friendly
- **Visual programming** for business processes
- **Event-driven automation** for repetitive tasks

### Why Combine n8n with AI Tender Guardian?

**Current System (What You Have):**
```
AI Tender Guardian MVP:
✅ Bid sealing with encryption
✅ AI compliance checking
✅ Immutable audit log
✅ n8n webhook endpoint (/api/tender-update)
```

**With n8n Integration (What You Get):**
```
AI Tender Guardian + n8n = AUTONOMOUS PROCUREMENT SYSTEM:
🤖 Automated tender lifecycle management
📧 Multi-channel notifications (Email, Slack, SMS)
⏰ Scheduled compliance checks
🔗 Integration with 400+ external services
📊 Automated reporting and analytics
🚨 Real-time alerts for critical events
🔄 Multi-stage approval workflows
📝 Auto-generated audit reports
```

### Real-World Impact Example

**Without n8n:**
```
Tender Opening Process:
1. Procurement officer manually creates tender document (30 mins)
2. Manually emails 50 potential bidders (20 mins)
3. Manually tracks responses in spreadsheet (daily, 15 mins)
4. Manually logs tender status in system (5 mins)
5. Manually sends deadline reminders (10 mins)
6. Manually triggers compliance check after deadline (5 mins)
7. Manually notifies evaluation committee (10 mins)

Total Time: 95 minutes + daily overhead
Error Prone: Yes (forgotten emails, missed deadlines)
```

**With n8n:**
```
Tender Opening Process:
1. Officer fills Google Form → n8n AUTOMATICALLY:
   ✓ Logs tender opening via webhook
   ✓ Emails 50 bidders from CRM
   ✓ Creates tracking spreadsheet
   ✓ Sets up calendar reminders
   ✓ Schedules deadline notifications
   ✓ Triggers post-deadline compliance batch check
   ✓ Sends evaluation committee Slack notification

Total Time: 5 minutes (form fill)
Error Prone: No (fully automated)
Savings: 90 minutes + zero human errors
```

---

## 🚀 INSTALLATION & SETUP {#installation}

### Method 1: Docker (Recommended)

```bash
# Create n8n directory
mkdir ~/n8n-tender-guardian
cd ~/n8n-tender-guardian

# Create docker-compose.yml
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  n8n:
    image: n8nio/n8n:latest
    container_name: n8n-tender
    restart: unless-stopped
    ports:
      - "5678:5678"
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=changeme123
      - N8N_HOST=localhost
      - N8N_PORT=5678
      - N8N_PROTOCOL=http
      - WEBHOOK_URL=http://localhost:5678/
      - GENERIC_TIMEZONE=America/New_York
    volumes:
      - n8n_data:/home/node/.n8n

volumes:
  n8n_data:
    driver: local
EOF

# Start n8n
docker-compose up -d

# Check logs
docker logs -f n8n-tender

# Access n8n
open http://localhost:5678
# Login: admin / changeme123
```

### Method 2: npm (Local Development)

```bash
# Install n8n globally
npm install -g n8n

# Start n8n
n8n start

# Access: http://localhost:5678
```

### Method 3: Cloud Deployment (Production)

**n8n Cloud (Managed):**
- Visit: https://n8n.io/cloud/
- Sign up for account
- No installation needed
- $20/month starting tier

**Self-Hosted on DigitalOcean:**
```bash
# Use n8n's one-click installer
# https://marketplace.digitalocean.com/apps/n8n

# Or manual setup:
ssh root@your-server-ip

# Install Docker
curl -fsSL https://get.docker.com | sh

# Clone n8n setup
git clone https://github.com/n8n-io/n8n-hosting.git
cd n8n-hosting/docker-compose

# Configure
nano .env
# Set: N8N_HOST=your-domain.com
# Set: SSL_EMAIL=your@email.com

# Start with SSL
docker-compose -f docker-compose.yml -f docker-compose.https.yml up -d
```

### Verify Installation

```bash
# Check n8n is running
curl http://localhost:5678/healthz
# Should return: {"status":"ok"}

# Open browser
open http://localhost:5678

# You should see n8n login page
```

---

## 🔧 CORE WORKFLOW EXAMPLES {#workflows}

### Workflow 1: Automated Tender Opening Notification

**Trigger:** Google Form submission (tender opening request)  
**Actions:** Log to Guardian + Email bidders + Create tracking sheet

#### n8n Workflow Steps:

```
┌─────────────────────────────────────────────────┐
│ 1. TRIGGER: Google Forms                       │
│    "New Tender Opening Request"                │
│    Captures: tender_id, budget, deadline, etc  │
└────────────────┬────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────┐
│ 2. HTTP REQUEST: AI Tender Guardian            │
│    POST /api/tender-update                     │
│    Body: {                                      │
│      "tenderId": "{{$json.tender_id}}",        │
│      "updateContent": "Tender opened...",      │
│      "updatedBy": "{{$json.officer_name}}"     │
│    }                                            │
│    → Stores in Guardian with hash              │
└────────────────┬────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────┐
│ 3. GOOGLE SHEETS: Create Tracking Sheet        │
│    Spreadsheet: "Active Tenders"               │
│    Row: tender_id, budget, deadline, status    │
└────────────────┬────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────┐
│ 4. AIRTABLE/CRM: Get Qualified Bidders         │
│    Query: Industry matches tender category     │
│    Returns: Email list of potential bidders    │
└────────────────┬────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────┐
│ 5. EMAIL (Loop): Send to Each Bidder           │
│    To: {{$json.bidder_email}}                  │
│    Subject: New Tender: {{$json.tender_id}}    │
│    Body: Details + Guardian upload link        │
│    Attachment: Requirements PDF                │
└────────────────┬────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────┐
│ 6. SLACK: Notify Procurement Team              │
│    Channel: #procurement                       │
│    Message: "🎯 Tender opened: {{tender_id}}" │
│    Link to Guardian audit log                  │
└─────────────────────────────────────────────────┘
```

#### How to Build This in n8n:

1. **Add Google Forms Trigger:**
```javascript
// In n8n Editor:
// Add Node → Trigger → Google Forms
// Connect to your Google account
// Select form: "Tender Opening Request"
// Set trigger: "On form submit"
```

2. **Add HTTP Request Node:**
```javascript
// Add Node → Action → HTTP Request
// Method: POST
// URL: http://localhost:8001/api/tender-update
// OR: https://ai-tender-guardian.preview.emergentagent.com/api/tender-update
// Authentication: None
// Body Format: JSON

// Body (in n8n expression editor):
{
  "tenderId": "{{ $json.tender_id }}",
  "updateContent": "Tender {{ $json.tender_id }} opened. Budget: ${{ $json.budget }}. Deadline: {{ $json.deadline }}. Requirements: {{ $json.requirements }}",
  "updatedBy": "{{ $json.officer_name }}"
}
```

3. **Add Google Sheets Node:**
```javascript
// Add Node → Action → Google Sheets
// Resource: Sheet
// Operation: Append
// Document: "Active Tenders" (select your sheet)
// Sheet: Sheet1

// Column Mapping:
// tender_id → {{ $json.tender_id }}
// budget → {{ $json.budget }}
// deadline → {{ $json.deadline }}
// status → "OPEN"
// hash → {{ $node["HTTP Request"].json["updateHash"] }}
```

4. **Add Airtable Node (or your CRM):**
```javascript
// Add Node → Action → Airtable
// Operation: List
// Base: Your CRM base
// Table: "Qualified Bidders"
// Filter: {industry} = {{ $json.category }}
```

5. **Add Loop + Email Nodes:**
```javascript
// Add Node → Flow → Loop Over Items
// Input: {{ $node["Airtable"].json }}

// Inside loop, add: Send Email
// To: {{ $json.email }}
// Subject: New Tender Opportunity: {{ $json.tender_id }}
// Body Template:
Dear {{ $json.company_name }},

A new tender matching your profile is now open:

Tender ID: {{ $json.tender_id }}
Budget: ${{ $json.budget }}
Deadline: {{ $json.deadline }}

Submit your bid via our secure platform:
https://ai-tender-guardian.preview.emergentagent.com/upload

Requirements attached.

Best regards,
Procurement Team
```

6. **Add Slack Notification:**
```javascript
// Add Node → Action → Slack
// Channel: #procurement
// Text:
🎯 **New Tender Opened**

Tender ID: `{{ $json.tender_id }}`
Budget: ${{ $json.budget }}
Deadline: {{ $json.deadline }}
Hash: `{{ $node["HTTP Request"].json["updateHash"].substring(0, 16) }}...`

[View in Guardian](https://ai-tender-guardian.preview.emergentagent.com/audit)
```

**Save Workflow:** "Tender Opening Automation"

---

### Workflow 2: Automated Deadline Reminder System

**Trigger:** Schedule (Daily at 9 AM)  
**Actions:** Check upcoming deadlines + Send reminders

```
┌─────────────────────────────────────────────────┐
│ 1. TRIGGER: Schedule                            │
│    Every day at 9:00 AM                         │
└────────────────┬────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────┐
│ 2. GOOGLE SHEETS: Read Active Tenders          │
│    Get all rows where status = "OPEN"          │
│    Filter: deadline within next 3 days         │
└────────────────┬────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────┐
│ 3. IF: Has Expiring Tenders?                   │
│    Expression: {{ $json.length > 0 }}          │
└────────────────┬────────────────────────────────┘
                 │
                 ↓ YES
┌─────────────────────────────────────────────────┐
│ 4. LOOP: For Each Expiring Tender              │
│    Calculate hours remaining                    │
└────────────────┬────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────┐
│ 5. AIRTABLE: Get Bidders Who Started           │
│    Query: Started bid but not submitted        │
│    For tender: {{ $json.tender_id }}           │
└────────────────┬────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────┐
│ 6. EMAIL: Send Urgent Reminder                 │
│    Subject: ⏰ URGENT: {{ hours_left }} hours  │
│    Body: Deadline approaching for {{tender}}   │
└────────────────┬────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────┐
│ 7. TWILIO SMS: Send Text to Procurement        │
│    "3 tenders expiring in 48h"                 │
└─────────────────────────────────────────────────┘
```

#### Implementation:

```javascript
// Schedule Trigger
// Add Node → Trigger → Schedule
// Cron: 0 9 * * * (9 AM daily)

// Google Sheets Read
// Add Node → Google Sheets
// Operation: Read
// Sheet: Active Tenders
// Return all rows

// Function Node: Filter Expiring
// Add Node → Function
const now = new Date();
const threeDaysFromNow = new Date(now.getTime() + (3 * 24 * 60 * 60 * 1000));

return items.filter(item => {
  const deadline = new Date(item.json.deadline);
  return deadline <= threeDaysFromNow && deadline > now && item.json.status === 'OPEN';
}).map(item => {
  const deadline = new Date(item.json.deadline);
  const hoursLeft = Math.floor((deadline - now) / (1000 * 60 * 60));
  return {
    ...item.json,
    hours_remaining: hoursLeft,
    urgency: hoursLeft < 24 ? 'CRITICAL' : 'WARNING'
  };
});

// Email Node (in loop)
// Subject: {{ $json.urgency === 'CRITICAL' ? '🚨 URGENT' : '⏰' }} Tender Deadline: {{ $json.hours_remaining }} hours left
```

---

### Workflow 3: Post-Deadline Compliance Batch Check

**Trigger:** Webhook from Guardian (when tender deadline passes)  
**Actions:** Retrieve all bids + Run compliance checks + Generate report

```
┌─────────────────────────────────────────────────┐
│ 1. TRIGGER: Webhook                             │
│    URL: https://n8n.yourdomain.com/webhook/     │
│            tender-deadline-passed               │
│    Method: POST                                 │
│    Expected: {tender_id, total_bids}           │
└────────────────┬────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────┐
│ 2. HTTP: Get Audit Log from Guardian           │
│    GET /api/audit-log                          │
│    Filter: tenderId = {{ $json.tender_id }}    │
└────────────────┬────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────┐
│ 3. GOOGLE SHEETS: Get Tender Requirements      │
│    Lookup: tender_id → requirements text       │
└────────────────┬────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────┐
│ 4. LOOP: For Each Bid                          │
│    Get bid details from Guardian               │
└────────────────┬────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────┐
│ 5. HTTP: AI Compliance Check                   │
│    POST /api/check-compliance                  │
│    Body: {                                      │
│      tenderRequirements: "{{ requirements }}",  │
│      bidSummary: "{{ bid_summary }}"           │
│    }                                            │
└────────────────┬────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────┐
│ 6. FUNCTION: Aggregate Results                 │
│    Calculate:                                   │
│    - Total compliant bids                      │
│    - Total violations                          │
│    - Most common violations                    │
└────────────────┬────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────┐
│ 7. GOOGLE DOCS: Generate Report                │
│    Create document from template               │
│    Fill: compliance results table              │
└────────────────┬────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────┐
│ 8. EMAIL: Send to Evaluation Committee         │
│    Subject: Compliance Report - {{tender_id}}  │
│    Attachment: Report PDF                      │
│    Body: Summary + action items                │
└─────────────────────────────────────────────────┘
```

#### Implementation Details:

```javascript
// Webhook Trigger
// Add Node → Trigger → Webhook
// HTTP Method: POST
// Path: tender-deadline-passed
// Response: Immediately (don't wait for workflow)

// Get Audit Log
// Add Node → HTTP Request
// Method: GET
// URL: http://localhost:8001/api/audit-log
// Post-processing: Filter by tender_id

// Function: Filter Bids
return items.filter(item => 
  item.json.tenderId === $node["Webhook"].json["body"]["tender_id"]
);

// Compliance Check (in loop)
// For each bid, call:
// POST /api/check-compliance
// Store results in array

// Aggregation Function
const results = $input.all();
const compliant = results.filter(r => r.json.violations[0] === "No violations detected");
const nonCompliant = results.filter(r => r.json.violations[0] !== "No violations detected");

const violationCounts = {};
nonCompliant.forEach(r => {
  r.json.violations.forEach(v => {
    violationCounts[v] = (violationCounts[v] || 0) + 1;
  });
});

return [{
  json: {
    tender_id: $node["Webhook"].json["body"]["tender_id"],
    total_bids: results.length,
    compliant_bids: compliant.length,
    non_compliant_bids: nonCompliant.length,
    compliance_rate: (compliant.length / results.length * 100).toFixed(1) + '%',
    top_violations: Object.entries(violationCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([violation, count]) => `${violation} (${count} bids)`)
  }
}];

// Email Summary
Subject: Compliance Report: {{ $json.tender_id }}

Dear Evaluation Committee,

Compliance analysis complete for tender {{ $json.tender_id }}:

📊 Summary:
- Total Bids Received: {{ $json.total_bids }}
- ✅ Compliant: {{ $json.compliant_bids }}
- ❌ Non-Compliant: {{ $json.non_compliant_bids }}
- Compliance Rate: {{ $json.compliance_rate }}

🚨 Top Violations:
{{ $json.top_violations.join('\n') }}

Full report attached.

[View in Guardian](https://ai-tender-guardian.preview.emergentagent.com/audit)
```

---

### Workflow 4: Multi-Stage Approval Process

**Trigger:** Bid evaluation recommendation  
**Actions:** Approval chain (Legal → Finance → Executive)

```
┌─────────────────────────────────────────────────┐
│ 1. TRIGGER: Manual (Button in Guardian)        │
│    Or: HTTP POST with recommended winner       │
└────────────────┬────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────┐
│ 2. AIRTABLE: Log Approval Request              │
│    Status: "PENDING_LEGAL"                     │
│    Winner: {{ recommended_bidder }}            │
└────────────────┬────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────┐
│ 3. EMAIL: Request Legal Approval               │
│    To: legal@company.com                       │
│    Include: Approval link with token           │
│    Link: https://n8n.com/approve?token=xyz     │
└────────────────┬────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────┐
│ 4. WAIT FOR WEBHOOK: Legal Response            │
│    Webhook receives: {approved: true/false}    │
│    Timeout: 48 hours                           │
└────────────────┬────────────────────────────────┘
                 │
                 ↓ IF APPROVED
┌─────────────────────────────────────────────────┐
│ 5. EMAIL: Request Finance Approval             │
│    Similar to legal step                       │
└────────────────┬────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────┐
│ 6. WAIT FOR WEBHOOK: Finance Response          │
└────────────────┬────────────────────────────────┘
                 │
                 ↓ IF APPROVED
┌─────────────────────────────────────────────────┐
│ 7. EMAIL: Request Executive Approval           │
└────────────────┬────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────┐
│ 8. WAIT FOR WEBHOOK: Executive Response        │
└────────────────┬────────────────────────────────┘
                 │
                 ↓ ALL APPROVED
┌─────────────────────────────────────────────────┐
│ 9. HTTP: Log Final Decision to Guardian        │
│    POST /api/tender-update                     │
│    "Contract awarded to [winner] with          │
│     3-stage approval completed"                │
└────────────────┬────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────┐
│ 10. EMAIL: Notify Winner                       │
│     Subject: Contract Award Notification       │
└────────────────┬────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────┐
│ 11. SLACK: Announce to Company                 │
│     Channel: #procurement-wins                 │
└─────────────────────────────────────────────────┘
```

**Key Feature:** n8n's "Wait for Webhook" node allows pausing workflow until approval received

---

### Workflow 5: Suspicious Activity Monitoring

**Trigger:** Schedule (Every hour)  
**Actions:** Analyze patterns + Alert on anomalies

```
┌─────────────────────────────────────────────────┐
│ 1. TRIGGER: Schedule (Hourly)                  │
└────────────────┬────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────┐
│ 2. HTTP: Get Recent Audit Log                  │
│    GET /api/audit-log                          │
│    Filter: Last 1 hour                         │
└────────────────┬────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────┐
│ 3. FUNCTION: Detect Anomalies                  │
│    Check for:                                   │
│    - Multiple bids from same IP                │
│    - Bids submitted in rapid succession        │
│    - Identical bid hashes (impossible!)        │
│    - Unusual submission times (3 AM)           │
└────────────────┬────────────────────────────────┘
                 │
                 ↓ IF ANOMALY FOUND
┌─────────────────────────────────────────────────┐
│ 4. AIRTABLE: Log Security Event                │
│    Type: "SUSPICIOUS_ACTIVITY"                 │
│    Details: Anomaly description                │
└────────────────┬────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────┐
│ 5. TWILIO: SMS to Security Officer             │
│    "🚨 Suspicious bid activity detected"       │
└────────────────┬────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────┐
│ 6. EMAIL: Detailed Alert with Evidence         │
│    Include: Hashes, timestamps, IPs            │
└────────────────┬────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────┐
│ 7. SLACK: Post to #security Channel            │
│    With links to investigate                   │
└─────────────────────────────────────────────────┘
```

#### Anomaly Detection Function:

```javascript
// Function Node: Detect Anomalies
const bids = $input.all();
const anomalies = [];

// Check 1: Rapid succession (< 5 seconds apart)
for (let i = 0; i < bids.length - 1; i++) {
  const current = new Date(bids[i].json.timestamp);
  const next = new Date(bids[i + 1].json.timestamp);
  const diff = Math.abs(next - current) / 1000; // seconds
  
  if (diff < 5) {
    anomalies.push({
      type: 'RAPID_SUBMISSION',
      severity: 'MEDIUM',
      details: `Two bids submitted ${diff}s apart`,
      bids: [bids[i].json.bidderId, bids[i + 1].json.bidderId]
    });
  }
}

// Check 2: Unusual hours (midnight to 5 AM)
bids.forEach(bid => {
  const hour = new Date(bid.json.timestamp).getHours();
  if (hour >= 0 && hour < 5) {
    anomalies.push({
      type: 'UNUSUAL_HOUR',
      severity: 'LOW',
      details: `Bid submitted at ${hour}:00`,
      bidder: bid.json.bidderId,
      tender: bid.json.tenderId
    });
  }
});

// Check 3: Duplicate hashes (CRITICAL - should be impossible)
const hashes = {};
bids.forEach(bid => {
  if (hashes[bid.json.bidHash]) {
    anomalies.push({
      type: 'DUPLICATE_HASH',
      severity: 'CRITICAL',
      details: 'IMPOSSIBLE: Two bids with identical hash detected!',
      hash: bid.json.bidHash
    });
  }
  hashes[bid.json.bidHash] = true;
});

return [{
  json: {
    total_checked: bids.length,
    anomalies_found: anomalies.length,
    anomalies: anomalies
  }
}];
```

---

## 🌟 REAL-WORLD AUTOMATION SCENARIOS {#scenarios}

### Scenario 1: City Infrastructure Project ($50M)

**Challenge:** 
- 6-month timeline from tender to award
- 200+ potential bidders
- 15 requirement updates during process
- 45 bids expected
- Evaluation committee of 7 people across 3 departments

**n8n Solution:**

#### Workflow A: Tender Lifecycle Manager
```
Day 0: Tender Opens
├─ n8n logs to Guardian (hash: abc123...)
├─ Emails 200 bidders
├─ Creates project dashboard (Google Sheets)
├─ Sets up 25 scheduled reminders
└─ Configures deadline webhook

Day 1-180: During Tender Period
├─ Weekly status emails to stakeholders
├─ Automated FAQ responses (chatbot integration)
├─ Requirement amendments logged to Guardian
└─ Bidder question tracking (Airtable)

Day 180: Deadline Passes
├─ Guardian seals all 45 bids
├─ n8n triggers compliance batch check
├─ Generates preliminary report (30 mins vs 3 days manual)
├─ Emails evaluation committee with assignments
└─ Creates Notion workspace for evaluation

Day 181-200: Evaluation Phase
├─ Tracks evaluator progress
├─ Reminds pending evaluations
├─ Aggregates scores automatically
├─ Flags discrepancies for review
└─ Generates shortlist

Day 201: Award Process
├─ Initiates 3-stage approval (Legal → Finance → Executive)
├─ Each approval logged to Guardian
├─ Winner notification + rejection letters
├─ Contract generation (DocuSign integration)
└─ Public announcement posted
```

**Time Saved:** 320 hours (8 weeks of manual work)  
**Error Reduction:** 95% (eliminated missed deadlines, forgotten notifications)  
**Audit Trail:** 100% complete (every action logged with hash)

---

### Scenario 2: Monthly Equipment Procurement (Recurring)

**Challenge:**
- Hospital needs medical supplies monthly
- 50+ recurring items
- 3-5 vendors per item
- Need best price + compliance check
- Must maintain FDA/ISO audit trail

**n8n Solution:**

#### Workflow B: Automated Monthly RFQ
```
Day 1 of Month: Auto-Trigger
├─ n8n reads inventory system (API)
├─ Identifies items below reorder point
├─ Generates RFQ for each item
├─ Logs tender opening to Guardian
├─ Emails pre-qualified vendors
└─ Sets 7-day response deadline

Day 2-7: Quote Collection
├─ Vendors submit quotes via Guardian
├─ n8n monitors submissions
├─ Sends reminders to non-responders
└─ Logs all quotes with hashes

Day 8: Auto-Evaluation
├─ n8n retrieves all quotes
├─ AI compliance check for each
├─ Filters out non-compliant
├─ Calculates best price per item
├─ Generates award recommendation
└─ Creates purchase order draft

Day 8: Approval (2 hours)
├─ Procurement manager reviews recommendations
├─ Approves via n8n form
├─ n8n logs approval to Guardian
└─ Sends POs to winning vendors

Day 8-9: Order Confirmation
├─ Vendors confirm via email
├─ n8n updates inventory system
├─ Creates delivery tracking sheet
└─ Schedules payment after delivery
```

**Monthly Time Saved:** 60 hours  
**Annual Savings:** 720 hours ($36,000 @ $50/hour)  
**Cost Reduction:** 8-12% better pricing due to competitive automation

---

### Scenario 3: Emergency Procurement (Crisis Response)

**Challenge:**
- Natural disaster requires immediate supplies
- Normal 30-day process must complete in 4 hours
- Cannot skip compliance or audit requirements
- High fraud risk due to urgency

**n8n Solution:**

#### Workflow C: Emergency Fast-Track
```
T+0 mins: Crisis Declared
├─ Officer fills emergency form
├─ n8n immediately logs to Guardian
├─ Triggers emergency vendor list (pre-qualified)
├─ Sends SMS to 20 vendors: "URGENT RFQ"
└─ Email follows with details

T+30 mins: Quotes Start Arriving
├─ Each quote sealed in Guardian
├─ n8n runs real-time compliance check
├─ Displays live dashboard of quotes
└─ Flags compliant quotes in green

T+2 hours: Deadline
├─ n8n auto-closes tender
├─ Runs final compliance sweep
├─ Ranks compliant bids by price
├─ Generates award recommendation
└─ Notifies approval committee via SMS

T+2.5 hours: Approval
├─ Committee reviews on mobile
├─ Approves via SMS reply
├─ n8n logs approval to Guardian
└─ Award decision hashed and stored

T+3 hours: Winner Notified
├─ PO sent to winner
├─ Payment pre-authorized
├─ Delivery tracking activated
└─ Public transparency report generated

T+4 hours: Complete Audit Trail
├─ All actions logged in Guardian
├─ Full hash chain preserved
├─ Compliance verified
└─ Legal defensibility maintained
```

**Speed:** 4 hours vs 30 days (7.5x faster)  
**Compliance:** 100% maintained despite urgency  
**Fraud Prevention:** Every action cryptographically logged  

---

## 🚀 ADVANCED INTEGRATION PATTERNS {#advanced}

### Pattern 1: Bidder Self-Service Portal with n8n Backend

**Setup:**
```
Frontend: Typeform/Airtable Interface
         ↓
n8n: Business Logic & Orchestration
         ↓
Guardian: Secure Storage
         ↓
n8n: Notifications & Tracking
```

#### Implementation:

**1. Create Typeform for Bid Submission:**
```
Questions:
1. Company Name
2. Email
3. Phone
4. Tender ID (dropdown populated by n8n)
5. Bid Amount
6. File Upload (bid document)
7. Certifications (checkboxes)
```

**2. n8n Workflow:**
```javascript
// Trigger: Typeform Submission
// Node 1: Typeform Trigger
// Webhook automatically configured

// Node 2: Validate Tender ID
// HTTP GET to Guardian /api/audit-log
// Check if tender exists and is open

// Node 3: IF: Valid Tender
if (tenderExists && tenderStatus === 'OPEN') {
  // Continue
} else {
  // Send error email + stop workflow
}

// Node 4: Download File from Typeform
// Typeform provides file URL
// HTTP GET to download

// Node 5: Upload to Guardian
// HTTP POST /api/seal-bid
// Form-data: file + tender_id

// Node 6: Store Metadata in Airtable
// For tracking: company, email, hash, timestamp

// Node 7: Send Confirmation Email
// Include: receipt, hash, timestamp
// PDF attachment: submission receipt

// Node 8: Notify Procurement Team
// Slack: "New bid received for TENDER-2025-001"
```

---

### Pattern 2: AI-Powered Pre-Qualification System

**Workflow: Vendor Pre-Qualification Automation**

```
┌─────────────────────────────────────────────────┐
│ NEW VENDOR APPLIES                              │
│ Fills Airtable form with:                       │
│ - Company info, certifications, experience      │
└────────────────┬────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────────┐
│ n8n: DOCUMENT VERIFICATION                      │
│ 1. Extract docs from application                │
│ 2. Use AI (Guardian Gemini integration)         │
│    to verify:                                    │
│    - ISO certification validity                 │
│    - Registration documents                     │
│    - Financial statements completeness          │
└────────────────┬────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────┐
│ n8n: BACKGROUND CHECK                           │
│ 1. Check government databases (API)             │
│ 2. Verify tax compliance                        │
│ 3. Check sanctions lists                        │
│ 4. Search for past violations                   │
└────────────────┬────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────┐
│ n8n: SCORING ALGORITHM                          │
│ Calculate qualification score:                  │
│ - Experience: 30%                               │
│ - Financial stability: 25%                      │
│ - Certifications: 25%                           │
│ - Past performance: 20%                         │
└────────────────┬────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────┐
│ IF: Score > 75% → Auto-Approve                  │
│ IF: 50-75% → Manual Review                      │
│ IF: < 50% → Auto-Reject                         │
└────────────────┬────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────┐
│ LOG TO GUARDIAN                                 │
│ POST /api/tender-update                         │
│ "Vendor XYZ pre-qualified with score 82%"       │
│ Hash ensures decision is immutable              │
└─────────────────────────────────────────────────┘
```

---

### Pattern 3: Blockchain-Like Tender Chain

**Create an immutable chain of tender lifecycle events**

```javascript
// n8n Function Node: Build Tender Chain

// Concept: Each event includes hash of previous event
// Creating a blockchain-like chain for audit

const TENDER_ID = $json.tender_id;

// Get all events for this tender from Guardian
const events = $node["Get Audit Log"].json.filter(
  e => e.tenderId === TENDER_ID
);

// Sort by timestamp
events.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

// Build chain
const chain = [];
let previousHash = '0000000000000000'; // Genesis

events.forEach(event => {
  const chainBlock = {
    tenderId: event.tenderId,
    eventHash: event.bidHash || event.updateHash,
    timestamp: event.timestamp,
    previousHash: previousHash,
    eventType: event.status || 'UPDATE',
    // Create chain hash
    chainHash: crypto.createHash('sha256')
      .update(previousHash + event.bidHash + event.timestamp)
      .digest('hex')
  };
  
  chain.push(chainBlock);
  previousHash = chainBlock.chainHash;
});

// Store chain in Airtable
return [{
  json: {
    tender_id: TENDER_ID,
    chain_length: chain.length,
    genesis_hash: chain[0].previousHash,
    final_hash: chain[chain.length - 1].chainHash,
    chain_data: JSON.stringify(chain),
    verified: true // Can be verified by recalculating hashes
  }
}];

// Usage: Prove tender timeline hasn't been tampered with
// Anyone can verify by recalculating chain hashes
```

**Verification Workflow:**
```javascript
// n8n: Verify Tender Chain Integrity
const storedChain = JSON.parse($json.chain_data);

let isValid = true;
let previousHash = '0000000000000000';

for (let block of storedChain) {
  // Recalculate chain hash
  const calculatedHash = crypto.createHash('sha256')
    .update(previousHash + block.eventHash + block.timestamp)
    .digest('hex');
  
  if (calculatedHash !== block.chainHash) {
    isValid = false;
    break;
  }
  
  previousHash = block.chainHash;
}

return [{
  json: {
    tender_id: $json.tender_id,
    chain_valid: isValid,
    message: isValid 
      ? '✅ Chain integrity verified - no tampering detected'
      : '🚨 CRITICAL: Chain integrity compromised - potential tampering!'
  }
}];
```

---

### Pattern 4: Multi-Tenant SaaS with n8n

**If building Guardian as a SaaS for multiple organizations:**

```
Organization A → n8n Workflow (Isolated)
                 ↓
                 Guardian (Tenant: org_a)
                 ↓
                 Org A's CRM, Email, Slack

Organization B → n8n Workflow (Isolated)
                 ↓
                 Guardian (Tenant: org_b)
                 ↓
                 Org B's CRM, Email, Teams
```

#### n8n Configuration:

```javascript
// Add organization context to every workflow

// Node: Function - Get Organization Context
const ORG_ID = $json.organization_id || 'default';

// Fetch org config from database
const orgConfig = await $node["Fetch Org Config"].json;

return [{
  json: {
    org_id: ORG_ID,
    guardian_url: orgConfig.guardian_url,
    email_from: orgConfig.email_from,
    slack_webhook: orgConfig.slack_webhook,
    branding: orgConfig.branding,
    // Custom compliance rules
    compliance_rules: orgConfig.compliance_rules
  }
}];

// Use org context in subsequent nodes
// HTTP Request to Guardian:
// URL: {{ $node["Get Org Context"].json["guardian_url"] }}/api/seal-bid

// Email:
// From: {{ $node["Get Org Context"].json["email_from"] }}
```

---

## 🚀 PRODUCTION DEPLOYMENT {#production}

### Recommended Production Setup

```
┌─────────────────────────────────────────────┐
│         LOAD BALANCER (nginx)               │
│     SSL/TLS Termination                     │
└───────────┬─────────────────────────────────┘
            │
     ┌──────┴──────┐
     │             │
     ↓             ↓
┌─────────┐   ┌─────────┐
│ n8n     │   │ Guardian│
│ Server  │   │ API     │
│ (Node.js│   │ (FastAPI│
└────┬────┘   └────┬────┘
     │             │
     │             ↓
     │        ┌─────────┐
     │        │ MongoDB │
     │        │ Replica │
     │        │ Set     │
     │        └─────────┘
     │
     ↓
┌─────────────────┐
│ Redis (Queue)   │
│ For workflow    │
│ execution       │
└─────────────────┘
```

### Docker Compose Production Stack

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  n8n:
    image: n8nio/n8n:latest
    restart: always
    ports:
      - "5678:5678"
    environment:
      - N8N_HOST=${N8N_HOST}
      - N8N_PORT=5678
      - N8N_PROTOCOL=https
      - WEBHOOK_URL=https://${N8N_HOST}/
      - N8N_ENCRYPTION_KEY=${N8N_ENCRYPTION_KEY}
      - DB_TYPE=postgresdb
      - DB_POSTGRESDB_HOST=postgres
      - DB_POSTGRESDB_DATABASE=n8n
      - DB_POSTGRESDB_USER=n8n
      - DB_POSTGRESDB_PASSWORD=${POSTGRES_PASSWORD}
      - EXECUTIONS_MODE=queue
      - QUEUE_BULL_REDIS_HOST=redis
    volumes:
      - n8n_data:/home/node/.n8n
    depends_on:
      - postgres
      - redis
    networks:
      - tender_network

  postgres:
    image: postgres:15
    restart: always
    environment:
      - POSTGRES_USER=n8n
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
      - POSTGRES_DB=n8n
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - tender_network

  redis:
    image: redis:7-alpine
    restart: always
    volumes:
      - redis_data:/data
    networks:
      - tender_network

  guardian:
    build: ./backend
    restart: always
    ports:
      - "8001:8001"
    environment:
      - MONGO_URL=${MONGO_URL}
      - DB_NAME=${DB_NAME}
      - EMERGENT_LLM_KEY=${EMERGENT_LLM_KEY}
      - ENCRYPTION_KEY=${ENCRYPTION_KEY}
    networks:
      - tender_network

  nginx:
    image: nginx:alpine
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - n8n
      - guardian
    networks:
      - tender_network

volumes:
  n8n_data:
  postgres_data:
  redis_data:

networks:
  tender_network:
    driver: bridge
```

### Environment Variables (.env)

```bash
# n8n
N8N_HOST=n8n.yourdomain.com
N8N_ENCRYPTION_KEY=your-random-32-char-key-here
POSTGRES_PASSWORD=secure-postgres-password

# Guardian
MONGO_URL=mongodb://mongo:27017
DB_NAME=tender_production
EMERGENT_LLM_KEY=sk-emergent-1A8F55f96Fd501e86F
ENCRYPTION_KEY=production_32_byte_key_replace_this_123456
```

### Nginx Configuration

```nginx
# nginx.conf
events {
    worker_connections 1024;
}

http {
    upstream n8n {
        server n8n:5678;
    }

    upstream guardian {
        server guardian:8001;
    }

    server {
        listen 80;
        server_name n8n.yourdomain.com api.yourdomain.com;
        return 301 https://$host$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name n8n.yourdomain.com;

        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;

        location / {
            proxy_pass http://n8n;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            
            # WebSocket support for n8n
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
        }
    }

    server {
        listen 443 ssl http2;
        server_name api.yourdomain.com;

        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;

        location / {
            proxy_pass http://guardian;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
    }
}
```

### Deploy Commands

```bash
# 1. Clone your repo on server
ssh user@your-server
git clone https://github.com/your-org/ai-tender-guardian.git
cd ai-tender-guardian

# 2. Set up environment
cp .env.example .env
nano .env  # Fill in production values

# 3. Get SSL certificates (Let's Encrypt)
sudo apt install certbot
sudo certbot certonly --standalone -d n8n.yourdomain.com
sudo certbot certonly --standalone -d api.yourdomain.com

# Copy certs to ssl folder
sudo cp /etc/letsencrypt/live/n8n.yourdomain.com/fullchain.pem ./ssl/cert.pem
sudo cp /etc/letsencrypt/live/n8n.yourdomain.com/privkey.pem ./ssl/key.pem

# 4. Start stack
docker-compose -f docker-compose.prod.yml up -d

# 5. Check status
docker-compose ps

# 6. View logs
docker-compose logs -f n8n
docker-compose logs -f guardian

# 7. Access n8n
open https://n8n.yourdomain.com
```

### Monitoring Setup

```yaml
# Add to docker-compose.prod.yml

  grafana:
    image: grafana/grafana:latest
    restart: always
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=${GRAFANA_PASSWORD}
    volumes:
      - grafana_data:/var/lib/grafana
    networks:
      - tender_network

  prometheus:
    image: prom/prometheus:latest
    restart: always
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    networks:
      - tender_network
```

---

## 📊 SUMMARY: n8n Capabilities Added

### Before n8n:
- ✅ Bid encryption & sealing
- ✅ AI compliance checking
- ✅ Immutable audit log
- ✅ Manual tender management
- ❌ No automation
- ❌ No notifications
- ❌ No workflow orchestration

### After n8n Integration:
- ✅ **Everything above PLUS:**
- 🤖 Automated tender opening & notification (saves 90 min)
- ⏰ Scheduled deadline reminders (zero missed deadlines)
- 📊 Auto-generated compliance reports (30 min vs 3 days)
- 🔗 Integration with 400+ apps (email, Slack, CRM, etc.)
- 🚨 Real-time anomaly detection (fraud prevention)
- ✉️ Multi-channel notifications (email, SMS, Slack)
- 📝 Automated audit trail documentation
- 🔄 Multi-stage approval workflows
- 📈 Analytics dashboards (via Grafana integration)
- 🌐 SaaS multi-tenancy support

### ROI Calculation:

**Time Saved Per Tender (Average $5M project):**
- Tender opening: 90 mins → 5 mins = **85 mins saved**
- Deadline tracking: 15 mins/day × 30 days → 0 = **450 mins saved**
- Compliance checking: 3 days → 30 mins = **1,410 mins saved**
- Report generation: 2 days → 5 mins = **950 mins saved**
- Approval coordination: 1 day → 2 hours = **360 mins saved**

**Total: 3,255 minutes (54.25 hours) saved per tender**

**At $50/hour:** $2,712.50 saved per tender  
**100 tenders/year:** $271,250 annual savings

**n8n Cost:** ~$240/year (self-hosted) or ~$1,200/year (cloud)  
**Net Savings:** $270,010/year

---

## 🎯 Quick Start: Your First n8n Workflow

**Goal:** Automate tender opening notification in 10 minutes

```bash
# 1. Start n8n
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n

# 2. Open http://localhost:5678

# 3. Create new workflow

# 4. Add nodes:
#    a) Trigger: Webhook
#    b) HTTP Request: POST to Guardian /api/tender-update
#    c) Send Email: Notify team

# 5. Test workflow

# 6. Activate workflow

# 7. Done! ✅
```

**Test your workflow:**
```bash
curl -X POST http://localhost:5678/webhook-test/tender-opened \
  -H "Content-Type: application/json" \
  -d '{"tender_id": "TEST-001", "budget": 1000000}'

# Check Guardian audit log - should see new entry
# Check email - should receive notification
```

---

**You now have a fully automated, AI-powered, cryptographically-secured procurement system!** 🎉

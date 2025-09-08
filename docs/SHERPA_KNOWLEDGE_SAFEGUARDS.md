# MXTK Sherpa: Knowledge Safeguards & Content Guidelines

## Overview

MXTK Sherpa uses a **multi-layered safeguards system** to protect proprietary information while maintaining maximum transparency. This document describes the architecture, best practices, and admin workflows for safe knowledge management.

## 🛡️ Safeguards Architecture

### Layer 1: Pre-Ingestion Content Flagging

**Automated Risk Detection** (`lib/ai/govern/flag.ts`)

Sherpa automatically scans all content before vectorization using weighted heuristics:

- **Policy Violations** (25% risk weight)
  - `confidential`, `proprietary`, `do not distribute`
  - `internal only`, `nda`

- **Patent Content** (25% risk weight) 
  - `patent`, `claims`, `novel method`
  - `prior art`, `patentable`

- **Code & Secrets** (15% risk weight each)
  - Source code patterns: `function(`, `class `, `#include`
  - Security tokens: `api key`, `private key`, `mnemonic`

- **Positive Signals** (Whitelist protection)
  - Public materials reduce risk: `https://`, `public docs`, `press release`

**Risk Scoring**: Content scoring ≥0.5 is automatically quarantined for review.

### Layer 2: Quarantine System

**Content Isolation** (`app/api/ai/ingest/route.ts`)

- **Flagged chunks** are stored but **not vectorized**
- **No searchability** until admin approval  
- **Complete audit trail** via governance flags
- **Metadata preserved** for review context

### Layer 3: Human-in-the-Loop Review

**Admin Approval Process** (`/admin/flags`)

- **Pending queue**: All flagged content requires review
- **Risk assessment**: Shows scores, reasons, and labels
- **Approve/reject actions**: Only approved content gets embedded
- **Feedback learning**: Admin decisions train positive/negative signals

### Layer 4: Response-Level Safeguards

**Output Sanitization** (`app/api/ai/chat/route.ts`)

```typescript
// Real-time response filtering
const forbidden = /(internal\s+draft|confidential|proprietary|
  do\s*not\s*distribute|internal\s*only|nda|patent\s*claims?)/gi;
```

- **Pattern matching** removes sensitive phrases from responses
- **System boundaries**: Sherpa instructed to use only approved context
- **Scope limiting**: Cannot make claims beyond MXTK materials

## 📋 Content Guidelines & Best Practices

### 🟢 Safe to Upload (Auto-Approved)

**Public Materials**
- Press releases and media announcements
- Published whitepapers and documentation  
- Website content and marketing materials
- Legal documents intended for public disclosure
- Educational content about blockchain/DeFi

**Best Practices**
- Include URLs to public sources when available
- Mark clearly as "public" or "press release" in content
- Use descriptive source names: `"whitepaper-v2"`, `"press-release-2025-01"`

### 🟡 Review Required (Will Be Flagged)

**Technical Documentation**
- Implementation details without proprietary algorithms
- Integration guides for public APIs
- General architecture overviews
- Standard operating procedures

**Business Information**  
- Market analysis using public data
- Competitive landscape assessments
- General strategic initiatives
- Customer success stories (anonymized)

**Best Practices**
- Remove internal project names and code words
- Anonymize specific customer/partner references
- Replace internal timelines with general terms
- Review for unintentional sensitive details before upload

### 🔴 Never Upload (High Risk)

**Proprietary Technology**
- Novel algorithms and trade secrets
- Patent applications before filing
- Internal research and development
- Proprietary financial models

**Sensitive Business Data**
- Customer data and PII
- Financial projections and internal metrics  
- Acquisition targets and M&A discussions
- Competitive intelligence and strategy

**Security Information**
- API keys, private keys, mnemonics
- Internal infrastructure details
- Security vulnerabilities and assessments
- Authentication mechanisms

## 🔧 Admin Workflows

### Content Upload Process

1. **Upload via Admin Tools** (`/admin/tools`)
   ```bash
   # Supported formats: DOCX, PDF, MD, TXT
   # System auto-extracts text and applies flagging
   ```

2. **Automatic Risk Assessment**
   - Content chunked and scored
   - High-risk chunks quarantined
   - Governance flags created for audit

3. **Admin Review** (`/admin/flags`)
   - Review pending items with risk scores
   - Examine content context and metadata
   - Approve or reject with notes

4. **Vectorization**
   - Approved content embedded and made searchable
   - Rejected content archived with reasoning
   - Feedback improves future detection

### Review Guidelines

**Approve When:**
- Content clearly public or educational
- Benefits users without revealing secrets
- Risk factors are false positives
- Content adds value to Sherpa responses

**Reject When:**
- Any proprietary information present
- Customer/partner data included
- Internal processes or strategies revealed
- Uncertain about public nature

**Add Review Notes:**
- Document reasoning for future reference
- Note any patterns that should improve detection
- Flag systematic issues for signal training

## 🎯 Signal Training & Tuning

### Negative Signals

**Current Active Signals** (`ai_store/flags_feedback.json`):
```json
{
  "neg": [
    "policy",
    "confidential", 
    "patent"
  ]
}
```

**Recommended Additions**:
```json
{
  "neg": [
    "confidential", "proprietary", "patent", "trade-secret",
    "internal-draft", "competitive-advantage", "acquisition",
    "financial-projections", "customer-data", "m-and-a",
    "technical-roadmap", "internal-metrics", "nda-required"
  ]
}
```

### Training Documents

**Create Negative Training Sets:**

1. **Upload test documents** containing examples of what should NOT be shared
2. **Mark as "reject"** during admin review
3. **Extracted terms** automatically become negative signals
4. **System learns** to recognize similar patterns

Example training document:
```markdown
# DO NOT SHARE - INTERNAL DRAFT ONLY
This document contains proprietary algorithms for mineral validation...
Patent-pending claims include novel verification methods...
Internal financial projections show acquisition targets...
```

### Positive Signals

**Encourage Public Content**:
- Upload known-good public documents
- Mark as "approve" to train positive signals
- Include public URLs and press references
- Use clear public markers in content

## 🔍 Monitoring & Maintenance

### Regular Review Tasks

**Weekly**:
- Review pending flags queue
- Check for systematic false positives
- Update negative signals based on patterns
- Monitor response quality and accuracy

**Monthly**:
- Audit approved/rejected content decisions
- Review signal effectiveness  
- Update content guidelines based on learnings
- Test with synthetic sensitive content

**Quarterly**:
- Comprehensive review of safeguards effectiveness
- Update risk thresholds based on false positive/negative rates
- Train team on new content types and edge cases
- Document lessons learned and process improvements

### Analytics & Reporting

**Key Metrics**:
- Flagging accuracy (false positive/negative rates)
- Review queue processing time
- Response quality after sanitization
- User satisfaction with Sherpa responses

**Available Reports**:
- `/admin/flags` - Review queue and decisions history
- `/admin/costs` - AI usage and processing costs
- Governance flags - Complete audit trail via JSONL logs

## 🚀 Advanced Configuration

### Environment Variables

```bash
# AI Vector Store Configuration
AI_VECTOR_DIR=./ai_store

# Admin Access (use same strong token for all)
MXTK_ADMIN_TOKEN=your-strong-admin-token
ADMIN_TOKEN=your-strong-admin-token  
NEXT_PUBLIC_ADMIN_TOKEN=your-strong-admin-token

# OpenAI Integration (for live responses)
OPENAI_API_KEY=your-openai-api-key

# Budget Controls
AI_BUDGET_DAILY_USD=10.00
AI_BUDGET_MODE=degrade  # or 'block'
```

### Custom Risk Thresholds

To adjust sensitivity, modify `lib/ai/govern/flag.ts`:

```typescript
// More aggressive flagging (flag score ≥ 0.3)
if (score >= 0.3) labels.add('needs-review');

// Less aggressive flagging (flag score ≥ 0.7)  
if (score >= 0.7) labels.add('needs-review');
```

### Custom Pattern Matching

Add domain-specific patterns:

```typescript
// Mining/geology specific patterns
score += 0.20 * (hits(/\b(ore-grade|mineral-rights|geological-survey|mining-claim)\b/g, 'mining-sensitive') > 0 ? 1 : 0);

// Financial specific patterns  
score += 0.30 * (hits(/\b(revenue-forecast|profit-margin|acquisition-price)\b/g, 'financial-sensitive') > 0 ? 1 : 0);
```

## 📞 Support & Troubleshooting

### Common Issues

**Content Not Appearing in Sherpa**:
- Check `/admin/flags` for quarantined content
- Verify admin approval of flagged items
- Confirm vectorization completed successfully

**False Positives**:
- Review flagging patterns and adjust thresholds
- Add negative signals for common false triggers
- Update whitelist patterns for your domain

**Response Quality Issues**:
- Verify sufficient approved content in knowledge base
- Check response sanitization isn't over-filtering
- Review system prompts and boundaries

### Getting Help

1. **Check admin interfaces** first: `/admin/flags`, `/admin/tools`
2. **Review logs** in governance JSONL files
3. **Test with known content** to isolate issues
4. **Document edge cases** for future improvement

---

## Summary

MXTK Sherpa's safeguards provide **bulletproof protection** for proprietary information while maintaining **maximum transparency** for public content. The four-layer system ensures:

✅ **Automated detection** catches risky content before vectorization  
✅ **Human oversight** ensures accuracy and context-aware decisions  
✅ **Learning system** improves over time with admin feedback  
✅ **Response filtering** provides final safety net  

Follow these guidelines to safely expand Sherpa's knowledge while protecting your competitive advantages and sensitive information.

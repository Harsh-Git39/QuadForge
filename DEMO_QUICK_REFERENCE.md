# 📝 DEMO QUICK REFERENCE CARD

## 🎯 TENDER DETAILS

**TENDER ID:** `HOSPITAL-MED-2025`  
**BUDGET:** `5000000`  
**DEADLINE:** `2025-02-15T17:00`

**REQUIREMENTS:**
```
1. FDA certification required (current, not pending)
2. Minimum 2-year warranty on all equipment
3. ISO 13485:2016 medical device certification
4. Delivery within 60 days maximum
5. Budget ceiling: $5,000,000 (non-negotiable)
6. Installation training included
7. 24/7 technical support first year
```

---

## 👥 BIDDER SUMMARIES (Copy-Paste Ready)

### BID A - MediTech (✅ COMPLIANT)

**File:** `/tmp/demo_bid_compliant.txt`

**Summary:**
```
MediTech Solutions offers FDA 510(k) certified equipment (K234567, valid until 2027), ISO 13485:2016 compliant. 3-year comprehensive warranty (exceeds 2-year requirement). Delivery and installation in 45 days (15 days ahead of schedule). Total bid: $4,600,000 (8% under budget). All equipment meets specifications. 24/7 support and staff training included.
```

**Expected Result:** ✅ COMPLIANT, 0 violations

---

### BID B - HealthCare (⚠️ 5 VIOLATIONS)

**File:** `/tmp/demo_bid_violation1.txt`

**Summary:**
```
HealthCare Supplies Inc offers cost-effective equipment. FDA certification application pending (expected March 2025). ISO 9001 certified. 18-month standard warranty. 90-day delivery timeline. Total bid: $4,200,000 (lowest price, 16% under budget). Basic training included.
```

**Expected Result:** ❌ 5 violations  
- FDA pending (not current)
- 18-month warranty (below 2 years)
- 90-day delivery (exceeds 60 days)
- ISO 9001 (not ISO 13485)
- Only 40 monitors (need 50)

---

### BID C - Budget Medical (❌ 8 VIOLATIONS)

**File:** `/tmp/demo_bid_violation2.txt`

**Summary:**
```
Budget Medical Corp offers refurbished equipment at lowest market price. FDA certification exemption claimed for secondary market equipment. 6-month limited warranty. 120-day delivery (equipment sourcing required). Total bid: $3,457,500 (31% under budget - lowest bid). No training or support included.
```

**Expected Result:** ❌ 8 violations  
- No FDA certification
- 6-month warranty (far below 2 years)
- 120-day delivery (double the limit)
- Refurbished equipment
- Only 35 monitors (need 50)
- No training included
- No 24/7 support
- "As-is" disclaimers

---

## 🎬 5-STEP DEMO FLOW

1. **CREATE** → Fill form → Create tender (2 min)
2. **SEAL** → Upload 3 bids with summaries (6 min)
3. **AUDIT** → View all bids + summaries (2 min)
4. **COMPLIANCE** → Select tender + each bid → AI check (4 min)
5. **DECISION** → Award to MediTech (1 min)

**Total: 15 minutes**

---

## 💬 KEY TALKING POINTS

1. **"288x faster"** - 15 minutes vs 3 days
2. **"Lowest bid ≠ best bid"** - Compliance matters more
3. **"Mathematically impossible to tamper"** - Cryptographic hashing
4. **"AI caught 13 violations"** - Across 2 non-compliant bids
5. **"Zero manual intervention"** - 6 auto-notifications sent

---

## 🔢 DEMONSTRATION STATISTICS

| Metric | Value |
|--------|-------|
| Total bids | 3 |
| Compliant bids | 1 (MediTech) |
| Non-compliant | 2 |
| Total violations caught | 13 |
| Time saved | 71 hours |
| Efficiency gain | 288x |
| Budget range | $3.45M - $4.6M |
| Winner price | $4.6M |
| Savings under budget | $400,000 |

---

## ❓ ANTICIPATED QUESTIONS & ANSWERS

**Q: What if AI is wrong?**  
A: Human evaluators always review. AI assists, doesn't replace judgment.

**Q: Can requirements change after publishing?**  
A: No, cryptographic hash prevents any changes.

**Q: Can bidders see others' bids?**  
A: No, all bids encrypted until deadline.

**Q: What prevents fake bids?**  
A: Bidder authentication (to be added in production).

**Q: Is this legally valid?**  
A: Yes, cryptographic evidence is court-admissible.

---

## 🚨 TROUBLESHOOTING

**If AI is slow (>10 seconds):**
- Say: "The AI is analyzing hundreds of requirements..."
- It will complete, just takes longer sometimes

**If you forget tender ID:**
- It's always: `HOSPITAL-MED-2025`

**If bid summary is too long:**
- Use shortened versions above (pre-formatted)

**If dropdown is empty:**
- Refresh page, ensure tender was created first

---

## 📱 CONTACT FOR DEMO FILES

All demo files are located in:
```
/tmp/demo_tender.txt
/tmp/demo_bid_compliant.txt
/tmp/demo_bid_violation1.txt
/tmp/demo_bid_violation2.txt
```

**To download for offline demo:**
```bash
# On server/local machine:
cp /tmp/demo_*.txt ~/Desktop/
```

---

**DEVELOPED BY: QuadForge**  
**PRINT THIS CARD FOR REFERENCE DURING DEMO**

import { useState } from "react";
import React from "react";
import { Home, ClipboardList, Flag, Calendar, BookOpen, DollarSign, Shield, MessageSquare, Clock, MapPin, ExternalLink } from "lucide-react";

const COLORS = {
  bg: "#F7F4EF", surface: "#FFFFFF", ink: "#1A1714", muted: "#6B6560",
  accent: "#C8401B", accentLight: "#F5E8E3", border: "#E2DDD8",
  tag1: "#E8EFF5", tag2: "#EDF5EC", tag3: "#F5EDE8",
  warn: "#FEF3C7", warnText: "#92400E",
  alertBlue: "#EFF6FF", alertBlueBorder: "#3B82F6", alertBlueText: "#1E40AF",
  alertGreen: "#ECFDF5", alertGreenBorder: "#10B981", alertGreenText: "#065F46",
  alertAmber: "#FFFBEB", alertAmberBorder: "#F59E0B", alertAmberText: "#92400E",
  alertRed: "#FEF2F2", alertRedBorder: "#EF4444", alertRedText: "#991B1B",
};

const FORMS = {
  advancedEntry: "https://northeastern.na1.adobesign.com/public/esignWidget?wid=CBFCIBAA3AAABLblqZhBBeWyAIeRupaZdfQzwxwv6hS38PmFQh7Z61eJ_uJ1nOudgVXmBQ3HpzSSvqbZY1wQ%2a",
  coAdvisor: "https://northeastern.na1.adobesign.com/public/esignWidget?wid=CBFCIBAA3AAABLblqZhDBI-M3y6bRtqJR-cvwEVM669xK01a84PjtTXMb_eT66h_3ALHdMlMXbp7BfvbIlbA%2a",
  qualRequest: "https://northeastern.na1.adobesign.com/public/esignWidget?wid=CBFCIBAA3AAABLblqZhDcMLqCbEojwO0JlVCmnlX8c1tXMJM10qEBk9Qj-hDLtwmEuGAyduzf6_Gi8DVs0D8%2a",
  qualCompletion: "https://northeastern.na1.adobesign.com/public/esignWidget?wid=CBFCIBAA3AAABLblqZhCHDRud5NAtsXJXSa9LMUjTEqhBSdd0lXpEuE_xZZncd0W1BkwKTSYCi9IBstJ4slA%2a",
  proposalRequest: "https://northeastern.na1.adobesign.com/public/esignWidget?wid=CBFCIBAA3AAABLblqZhBzUL0pRLYj11aRJeqxLGtg7r-BfmRRr9zbjMRq0X8WJs7tFe9nG3hoR1PTFhNp_-k%2a",
  candidacy: "https://northeastern.na1.adobesign.com/public/esignWidget?wid=CBFCIBAA3AAABLblqZhAsySAFPdEzo_XIxfbo1s5GfDvfDT0v6Q5Y2G4tBa-py-MC__l04DJ00b3NExUGkSI%2a",
  dissertationDefense: "https://northeastern.na1.adobesign.com/public/esignWidget?wid=CBFCIBAA3AAABLblqZhClTkdjm242DdB9OuvY8TcY4EXPR97QwCnv_qwVp97Evy2MuUpLis3BD8EvRfKqHfI%2a",
  flexFellowship: "https://northeastern.na1.adobesign.com/public/esignWidget?wid=CBFCIBAA3AAABLblqZhAT90YzanOCIlAxx5-bx5xjFHcIbP_7hnapogyq8bQ3oNb8zuDq6zbM5umQyrKHJjk%2a",
  individualInstruction: "https://service.northeastern.edu/registrar?id=kb_article_view&sysparm_article=KB000020014",
  khourOverride: "https://www.khoury.northeastern.edu/current-masters-and-certificate-students/masters-advising-and-academic-support/masters-forms/",
  coeOverride: "https://coe.northeastern.edu/academics-experiential-learning/graduate-school-of-engineering/graduate-student-services/graduate-forms/",
};

const TODAY = new Date();
function daysUntil(dateStr) {
  const d = new Date(dateStr);
  const diff = Math.round((d - TODAY) / (1000 * 60 * 60 * 24));
  return diff;
}
function urgencyColor(days) {
  if (days <= 7) return { bg: COLORS.alertRed, border: COLORS.alertRedBorder, text: COLORS.alertRedText };
  if (days <= 21) return { bg: COLORS.alertAmber, border: COLORS.alertAmberBorder, text: COLORS.alertAmberText };
  if (days <= 45) return { bg: COLORS.alertBlue, border: COLORS.alertBlueBorder, text: COLORS.alertBlueText };
  return { bg: COLORS.alertGreen, border: COLORS.alertGreenBorder, text: COLORS.alertGreenText };
}
function formatDaysLabel(days) {
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days < 0) return "Past";
  return `${days}d`;
}
function formatShortDate(dateStr) {
  const d = new Date(dateStr + "T12:00:00"); // noon to avoid timezone shifting
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// Icon is derived automatically from screen — do not set manually.
const SCREEN_ICONS = {
  milestones: Flag,
  calendar: Calendar,
  courses: BookOpen,
  todos: ClipboardList,
  funding: DollarSign,
  contacts: MessageSquare,
};

// Static academic calendar + milestone dates only.
// Update once per semester for drop/registration dates; milestone dates are fixed year to year.
// Only set: label, date, screen. Icon is automatic.
const ALERTS = [
  { label: "Summer Project Rankings",   date: "2026-03-31", screen: "todos" },
  { label: "Annual Review Due",         date: "2026-04-15", screen: "todos" },
  { label: "Last Day to Withdraw (W)",  date: "2026-04-19", screen: "courses" },
  { label: "M5 Proposal Defense",       date: "2026-04-30", screen: "milestones" },
  { label: "PD Funds Request",          date: "2026-05-15", screen: "todos" },
  { label: "M2 Co-Advisor Declaration", date: "2026-08-31", screen: "milestones" },
  { label: "M3 Qualifying Exam",        date: "2026-11-30", screen: "milestones" },
].map(a => ({ ...a, icon: SCREEN_ICONS[a.screen] || null }))
 .filter(a => daysUntil(a.date) >= 0)
 .sort((a, b) => daysUntil(a.date) - daysUntil(b.date));

// ── Drop dates — update each semester from the Northeastern Academic Calendar iCal feed ──
const DROP_DATES = [
  {
    label: "Last Day to Add/Drop (no record)",
    date: "January 20, 2026",
    dateISO: "2026-01-20",
    detail: "Full-semester spring courses dropped by this date will not appear on your transcript. After this date, withdrawals result in a W grade. Drop via the Student Hub.",
    source: "Northeastern Academic Calendar 2025–2026",
  },
  {
    label: "Last Day to Withdraw with 'W'",
    date: "April 19, 2026",
    dateISO: "2026-04-19",
    detail: "Last day to withdraw from a full-semester spring course. A W grade appears on your transcript but does not affect GPA. You remain responsible for 100% of tuition. Withdraw via the Student Hub. Note: a W does count toward attempted credits and may affect academic standing.",
    source: "Northeastern Academic Calendar 2025–2026",
  },
];

// ── Program To-Dos — update each semester. Remove items once deadline passes. ──
const todos = [
  {
    title: "Summer Project Rankings",
    deadline: "March 31",
    deadlineISO: "2026-03-31",
    description: "Submit your summer project and assistantship rankings for the upcoming assignment process.",
    url: "https://drdawson.sites.northeastern.edu/4740-2/",
    buttonLabel: "Submit Rankings",
  },
  {
    title: "Annual Review",
    deadline: "April 15",
    deadlineISO: "2026-04-15",
    description: "Complete and submit your self-reflection and portfolio for the annual progress review.",
    url: "https://forms.office.com/r/Ph7hiAY4JP",
    buttonLabel: "Open Form",
  },
  {
    title: "CAMD Research Dissemination Proposals",
    deadline: "March 31",
    deadlineISO: "2026-03-31",
    description: "Apply for CAMD research dissemination funding to support the presentation and publication of your research.",
    url: "https://northeastern.sharepoint.com/sites/CAMDHub/SitePages/Announcements/Call-for-Research-Dissemination-Proposals-from-Faculty-and-Staff.aspx",
    buttonLabel: "View & Apply",
  },
];

// ── Changelog — add new entries at the top ──
const changelog = [
  {
    date: "March 24, 2026",
    entries: [
      "Funding tab restructured — Flex Fellowship, University Resources (Office of Research Development, Pivot-RP, Candid/Foundation Directory), Find Opportunities (ProFellow, PostdocJobs.com), Google Alerts guide",
      "Lucide icons replace unicode symbols throughout — nav, grid tiles, skinny buttons, and event detail",
      "Google Alerts example queries updated to quoted exact phrases with -undergraduate filter",
      "Per-discipline fellowship breakdown and Grants.gov removed from funding tab",
      "TODAY fixed to live date — urgency colors on Coming Up strip now reflect real current date",
      "Funding tab redesigned — Flex Fellowship and fellowship/grant discovery by research discipline (11 areas)",
      "Each discipline includes pre-built ProFellow, Google Alerts, Grants.gov, and federal fellowship links",
      "Assistantship types (SGA/RA/TA) and Professional Development Funds moved to Policies tab",
      "PhD Network Travel Funds added to Policies tab",
      "Added Program To-Dos section — time-sensitive action items with deadlines and direct form links",
      "Redesigned home screen — To-Dos card, simplified navigation, bottom links row",
      "Added Contacts & Communications section with program communications structure",
      "Added Changelog",
      "Bottom nav simplified to Home, To-Dos, Milestones, Calendar",
      "Corrected Spring 2026 course withdrawal dates",
      "Added Graduate Catalog link to Policies",
      "Wired Handbook link to SharePoint document",
    ],
  },
];

// ── Communications structure ──
const commsChannels = [
  {
    channel: "Teams",
    purpose: "Documents and access centralization",
    url: "https://teams.microsoft.com/l/team/19%3AwATcDwT4uhLQ4oWXRluYwf1GT1M6WtBU0UF-6h-YSDg1%40thread.tacv2/conversations?groupId=e28261f3-b2e1-4038-a57f-dfcef002c39d&tenantId=a8eec281-aaa3-4dae-ac9b-9a398b9215e7",
    linkLabel: "Open Teams channel",
  },
  {
    channel: "Slack",
    purpose: "Social",
    url: "https://camdphd.slack.com/archives/C03D0KFP8JU",
    linkLabel: "Open Slack",
  },
  {
    channel: "Email",
    purpose: "Information — sent bi-weekly (outgoing only)",
    url: "mailto:camd_idam@northeastern.edu",
    linkLabel: "camd_idam@northeastern.edu",
  },
  {
    channel: "Outlook",
    purpose: "Calendar with information",
    url: "webcal://25livepub.collegenet.com/calendars/Northeastern-Academic-Calendar.ics",
    linkLabel: "Subscribe to calendar",
  },
];

const milestones = [
  {
    id: 1, number: "M1", title: "Advanced Entry Request", year: "Year 1", deadline: "April 1", optional: true,
    summary: "Reduce required semester hours from 48 to 28. Students with graduate degrees in relevant fields will typically be approved. Students without graduate degrees but with relevant coursework or extensive professional experience may also be considered.",
    steps: [
      "Submit the form for consideration rather than asking if you're eligible — let the committee decide",
      "Confirm eligibility: graduate degree in a relevant field, OR relevant coursework/professional experience (5+ years)",
      "Verify you have a clear research plan and demonstrated excellence in core courses",
      "Identify primary and secondary advisors — both must support the request",
      "Write a 1–2 page paper outlining your research direction, accomplishments, and how prior experience prepares you for reduced coursework",
      "Attach the paper to the Advanced Entry Application and submit by April 1",
      "Outcomes communicated by June 1",
    ],
    notes: "Five years of funding remains regardless of which track you are on.",
    forms: [{ label: "Advanced Entry Application", url: FORMS.advancedEntry }],
  },
  {
    id: 2, number: "M2", title: "Co-Advisor Declaration", year: "Year 2", deadline: "August 31", optional: false,
    summary: "The co-advisor complements your primary advisor's disciplinary expertise and provides interdisciplinary research guidance. More involved than general committee members.",
    steps: [
      "Discuss with your primary advisor which aspects of your research could benefit from complementary expertise",
      "Identify a co-advisor from a different discipline than your primary advisor",
      "Confirm the co-advisor's responsibilities: guidance prior to qualifying exam, participation in qualifying exam and defenses, reading the dissertation",
      "Complete and submit the Co-Advisor Declaration form by August 31 of Year 2",
    ],
    notes: "Both advisors from the same department is permitted if their disciplinary backgrounds differ.",
    forms: [{ label: "Co-Advisor Declaration", url: FORMS.coAdvisor }],
  },
  {
    id: 3, number: "M3", title: "Qualifying Exam", year: "Year 3", deadline: "November 30", optional: false,
    summary: "A written thematic literature review and oral exam covering your primary and secondary research fields. Examiners: primary advisor, co-advisor, and an assigned third examiner.",
    steps: [
      "8 weeks before: Submit the Qualifying Exam Request form with advisor approval",
      "6 weeks before: Third committee member assigned; schedule your exam date",
      "5 weeks before: Send your thematic literature review to all three examiners",
      "3 weeks before: Receive written feedback from examiners",
      "1 week before: Send revised literature review to examiners",
      "Exam day: 15-minute presentation + 30-minute discussion with examiners",
      "2 weeks after: Final decision communicated",
      "After passing: YOU are responsible for ensuring all examiners sign the Completion Form — do not email, submit the form directly",
    ],
    critical: "After passing, you must personally collect examiner signatures on the Completion Form. Do not email — submit the form directly.",
    outcomes: ["Pass", "Pass with revisions (completed under advisor supervision)", "Fail — one retake permitted within 6 months"],
    notes: "Must be completed by end of Year 3 fall semester. Extensions require justification and result in automatic probation.",
    forms: [
      { label: "Exam Request Form", url: FORMS.qualRequest },
      { label: "Exam Completion Form", url: FORMS.qualCompletion },
    ],
  },
  {
    id: 4, number: "M4", title: "Dissertation Committee Formation", year: "Year 4", deadline: "Before Proposal Defense", optional: false,
    summary: "Form your full dissertation committee of at least four members between your qualifying exam and proposal defense preparation.",
    steps: [
      "Confirm your primary advisor and co-advisor",
      "Recruit a third member whose expertise complements your advisors",
      "Recruit an external member from outside Northeastern University",
      "Verify: at least two of four members hold CAMD faculty appointments",
      "Confirm all members are committed to attending both defenses, preferably in person",
      "Complete the Committee Formation form",
    ],
    notes: "Form your committee between the qualifying exam and proposal defense — don't wait until you're ready to schedule.",
    forms: [{ label: "Committee Formation Form", url: null, note: "New form — link TBD" }],
  },
  {
    id: 5, number: "M5", title: "Proposal Defense", year: "Year 4", deadline: "April 30", optional: false,
    summary: "Defend your dissertation proposal before your committee and the CAMD PhD community. The last step before achieving PhD candidacy.",
    steps: [
      "8 weeks before: Submit the Proposal Defense Request form and schedule your date",
      "Create a poster to announce your defense to the CAMD community",
      "CAMD admins will assist booking an ISEC classroom for in-person + online hybrid defense",
      "5 weeks before: Provide proposal document to committee",
      "3 weeks before: Receive feedback from committee",
      "1 week before: Submit revised proposal",
      "Defense day: 45-min presentation → 15-min public Q&A → committee Q&A (30 min) → deliberation (30 min)",
      "Decision communicated immediately after defense",
      "CRITICAL: After defense, submit the Doctoral Candidacy Form and follow up with faculty for signatures — this is YOUR responsibility",
    ],
    critical: "After a successful defense, submit the Doctoral Candidacy Form immediately. Follow up with faculty for signatures — program administration will not do this for you.",
    outcomes: ["Pass", "Pass with recovery assignment under advisor supervision", "Fail"],
    notes: "Must be completed at least one year before your intended dissertation defense date.",
    forms: [
      { label: "Proposal Defense Request", url: FORMS.proposalRequest },
      { label: "Doctoral Candidacy Form", url: FORMS.candidacy },
    ],
  },
  {
    id: 6, number: "M6", title: "Dissertation Defense", year: "Year 5", deadline: "Plan by April, no later than August", optional: false,
    summary: "The final defense of your completed dissertation. Open to the CAMD PhD community.",
    steps: [
      "Schedule a meeting with the Associate Director to confirm graduation eligibility before scheduling",
      "12 weeks before: Submit the Dissertation Defense request form",
      "Create a promotional poster to announce your defense",
      "Prepare a 1–2 page press release about your work",
      "Prepare 10 statements about your dissertation",
      "Announce defense via camdphd@northeastern.edu",
      "After successful defense: submit final dissertation per Graduate School requirements",
    ],
    critical: "Confirm graduation eligibility with the Associate Director before scheduling. Do not assume you are eligible.",
    notes: "Plan to defend by April of Year 5. August is the latest to remain on standard funding timeline.",
    forms: [{ label: "Dissertation Defense Form", url: FORMS.dissertationDefense }],
  },
];

const courseRegistration = [
  {
    code: "INAM 8986", title: "Research", color: COLORS.tag1,
    when: "Before candidacy, when taking fewer than 8 credits",
    detail: "Maintains eligibility for funding and F-1 status for international students. Must use the Individual Instruction form to register — you cannot register through the standard system.",
    critical: "International students: required to maintain F-1 status when not enrolled in regular coursework.",
    forms: [{ label: "Individual Instruction Form", url: FORMS.individualInstruction }],
  },
  {
    code: "INAM 9990", title: "Dissertation Term 1", color: COLORS.tag2,
    when: "First semester after achieving candidacy",
    detail: "Register in the first semester after successfully defending your proposal and achieving PhD candidacy status.",
    critical: null, forms: [],
  },
  {
    code: "INAM 9991", title: "Dissertation Term 2", color: COLORS.tag2,
    when: "Second semester after candidacy",
    detail: "Register in your second semester as a PhD candidate, following completion of Dissertation Term 1.",
    critical: null, forms: [],
  },
  {
    code: "INAM 9996", title: "Dissertation Continuation", color: COLORS.tag3,
    when: "All subsequent semesters after Term 1 and 2",
    detail: "Register every semester — including summers — after completing both Dissertation Term 1 and Term 2, until you graduate.",
    critical: "This includes summer semesters. Do not skip registration.",
    forms: [],
  },
];

const overrideLinks = [
  { college: "Khoury College of Computer Sciences", url: FORMS.khourOverride },
  { college: "College of Engineering", url: FORMS.coeOverride },
];



const contacts = [
  { role: "Graduate Administrator", name: "David Dawson II", email: "d.dawson@northeastern.edu", note: "Day-to-day support, enrollment, degree progress, administrative questions", hours: ["M: 2–4pm", "T: 10am–12pm", "TR: 11am–3pm (weekly)"], office: "Meserve 140 (or as communicated via Teams)", preferred: "Teams message" },
  { role: "Program Director", name: "Prof. Casper Harteveld", email: "c.harteveld@northeastern.edu", note: "Program feedback, concerns, and leadership questions", hours: ["T: 12–2pm (first Tuesday of every month)"], office: "Center for Design", preferred: null },
  { role: "Director, Research Development", name: "Liz Allen", email: "e.allen@northeastern.edu", note: "Grant writing, research funding opportunities, proposal development", hours: null, office: null, preferred: null },
  { role: "Program Distribution List", name: null, email: "camdphd@northeastern.edu", isGroup: true, note: "Announce milestone defenses and external events to the full program community", hours: null, office: null, preferred: null },
];

const policies = [
  { title: "GPA & Academic Standing", items: ["Minimum 3.0 cumulative GPA required for candidacy", "No grades lower than B in core courses", "Falling below 3.0 may result in academic probation"] },
  { title: "Advising Changes", items: ["Changing your primary advisor requires a formal request — contact David Dawson II", "Co-advisor changes follow a similar process", "Advisor changes are documented and may affect your timeline"] },
  { title: "Course Waivers & Extra Courses", items: ["Course waivers available for relevant prior work — submit the waiver form", "Extra courses beyond requirements are allowed but may impact GPA", "Auditing courses after completing requirements is encouraged to protect GPA"] },
  {
    title: "Assistantship Types", items: [
      "Student Graduate Assistantship (SGA): guaranteed for up to 5 years (Fall/Spring/Summer). Requires ~20 hrs/week. Paid semi-monthly.",
      "Research Assistantship (RA): funded by your primary advisor or a project PI. Supports faculty research. Typically begins Year 1–2.",
      "Teaching Assistantship (TA): begins in Year 3. Supports course delivery and academic development. Complete a teaching elective in Years 1–2.",
      "Experiential PhD or Fellowship: funded by employer, self, or fellowship organization. Notify program before agreeing to any external fellowship.",
    ],
  },
  { title: "Assistantship Rules", items: ["Sign your assignment letter before the semester begins — failure to sign = loss of funding", "You cannot request specific assignments, but can discuss interests with your advisor", "Repeatedly declining assignments may result in permanent funding loss and dismissal review", "SGA funding decisions are determined by the university, program, or primary advisor — you may request a review if your skills don't match the position"] },
  { title: "Probation & Dismissal", items: ["Automatic probation if qualifying exam is not completed by end of fall, Year 3", "Failing the qualifying exam twice results in a dismissal recommendation", "Academic appeals process available — contact David Dawson II"] },
  { title: "Annual Progress Assessment", items: ["Submit self-reflection and portfolio by April 15 each spring", "Assessment covers academic progress, assistantship performance, and milestone completion", "Results inform funding decisions and continuation in the program"] },
  {
    title: "Professional Development Funds", items: [
      "$1,000 available annually (fiscal year July 1–June 30) for conferences, professional associations, workshops, summer schools, and research support.",
      "Submit requests via the Concur system by May 15 each year. Unspent funds do not roll over.",
      "Funds may be used for research support with approval.",
    ],
  },
  {
    title: "PhD Network Travel Funds", items: [
      "Up to $500 in matching funds to support travel to present research.",
      "Matching funds must come from an advisor-supported grant, internal university funding, or an external funder.",
      "Professional Development funds are not acceptable as matching funds.",
      "Visit the PhD Network funding opportunities page for details.",
    ],
  },
];

const mockEvents = [
  { day: 5, title: "PhD Design Lab", category: "Program", time: "2:00 PM", endTime: "3:30 PM", location: "Center for Design, Room 205", description: "Bi-weekly PhD Program Design Lab. All CAMD PhD students welcome.", url: "https://teams.microsoft.com", startISO: "20260405T180000Z", endISO: "20260405T193000Z" },
  { day: 10, title: "CfD Conversations Series", category: "CAMD", time: "4:00 PM", endTime: "6:00 PM", location: "ISEC, Room 655", description: "Center for Design monthly panel series. This session: AI and Design Research.", url: "https://camd.northeastern.edu/center-for-design/events/", startISO: "20260410T200000Z", endISO: "20260410T220000Z" },
  { day: 19, title: "Last Day to Withdraw with W", category: "Milestone", time: "Deadline", endTime: null, location: null, description: "Last day to withdraw from a full-semester spring course. A W grade appears on your transcript but does not affect GPA. You remain responsible for 100% of tuition. Withdraw via the Student Hub.", url: "https://registrar.northeastern.edu/article/academic-calendar/", startISO: "20260419T000000Z", endISO: "20260419T235900Z" },
  { day: 15, title: "Annual Review Deadline", category: "Milestone", time: "Due", endTime: null, location: null, description: "Submit your self-reflection and portfolio for the Annual Progress Review. Contact David Dawson II with questions.", url: null, startISO: "20260415T000000Z", endISO: "20260415T235900Z" },
  { day: 15, title: "Design Research Week", category: "CAMD", time: "All week", endTime: null, location: "Various CAMD venues", description: "Design Research Week showcasing design-led research. Keynotes, panels, workshops, exhibitions. Theme: Performing Futures.", url: "https://camd.northeastern.edu/events/design-research-week-2026/", startISO: "20260415T090000Z", endISO: "20260419T180000Z" },
  { day: 22, title: "Proposal Defense: [Student Name]", category: "Program", time: "1:00 PM", endTime: "3:30 PM", location: "ISEC, Room 136 (also on Zoom)", description: "Dissertation proposal defense open to the CAMD PhD community. RSVP via camdphd@northeastern.edu for Zoom link.", url: null, startISO: "20260422T170000Z", endISO: "20260422T193000Z" },
  { day: 26, title: "CAMD Celebration", category: "CAMD", time: "6:00 PM", endTime: "9:00 PM", location: "Leader Bank Pavilion", description: "CAMD Undergraduate and Graduate Celebration for the Class of 2026. Regalia required.", url: "https://camd.northeastern.edu/celebration/", startISO: "20260426T220000Z", endISO: "20260427T010000Z" },
  { day: 29, title: "Graduate Commencement", category: "University", time: "TBD", endTime: null, location: "Fenway Park", description: "University Graduate Commencement Ceremony. Diplomas mailed 4–6 weeks after conferral.", url: "https://commencement.northeastern.edu/", startISO: "20260429T140000Z", endISO: "20260429T170000Z" },
];

const catColors = {
  Program: { bg: "#E8EFF5", text: "#1A4A7A" },
  CAMD: { bg: "#EDF5EC", text: "#1A5C2A" },
  Milestone: { bg: "#F5EDE8", text: "#7A2A1A" },
  University: { bg: "#F0EDF5", text: "#3A1A7A" },
};

const ICAL_CAMD = "webcal://camd.northeastern.edu/events/calendar.ics";
const ICAL_CAMD_GOOGLE = "https://calendar.google.com/calendar/r?cid=camd.northeastern.edu/events/calendar.ics";
const ICAL_ACADEMIC = "webcal://25livepub.collegenet.com/calendars/Northeastern-Academic-Calendar.ics";
const ICAL_ACADEMIC_GOOGLE = `https://calendar.google.com/calendar/r?cid=${encodeURIComponent("25livepub.collegenet.com/calendars/Northeastern-Academic-Calendar.ics")}`;

function makeGoogleCalLink(e) {
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(e.title)}&dates=${e.startISO}/${e.endISO||e.startISO}&details=${encodeURIComponent(e.description||"")}&location=${encodeURIComponent(e.location||"")}`;
}
function makeOutlookLink(e) {
  return `https://outlook.office.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(e.title)}&body=${encodeURIComponent(e.description||"")}&location=${encodeURIComponent(e.location||"")}&startdt=${e.startISO}&enddt=${e.endISO||e.startISO}&path=%2Fcalendar%2Faction%2Fcompose`;
}
function makeICS(e) {
  const lines = ["BEGIN:VCALENDAR","VERSION:2.0","BEGIN:VEVENT",`SUMMARY:${e.title}`,`DTSTART:${e.startISO}`,`DTEND:${e.endISO||e.startISO}`,`DESCRIPTION:${(e.description||"").replace(/\n/g,"\\n")}`,`LOCATION:${e.location||""}`,"END:VEVENT","END:VCALENDAR"].join("\n");
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(lines)}`;
}

const daysInMonth = 30;

export default function App() {
  const [screen, setScreen] = useState("home");
  const [selected, setSelected] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [expandedPolicy, setExpandedPolicy] = useState(null);
  const [expandedCourse, setExpandedCourse] = useState(null);
  const [expandedComms, setExpandedComms] = useState(false);
  const [showSubscribeSheet, setShowSubscribeSheet] = useState(false);

  const goHome = () => { setScreen("home"); setSelected(null); setSelectedDay(null); setSelectedEvent(null); };
  const goToScreen = (s) => { setScreen(s); setSelected(null); setSelectedDay(null); setSelectedEvent(null); };

  return (
    <div style={{ fontFamily: "'Lora', Georgia, serif", background: COLORS.bg, minHeight: "100vh", maxWidth: 430, margin: "0 auto", position: "relative", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { display: none; }
        .tap { transition: opacity 0.12s, transform 0.12s; cursor: pointer; }
        .tap:active { opacity: 0.7; transform: scale(0.98); }
        .slide-in { animation: slideIn 0.22s cubic-bezier(0.25,0.46,0.45,0.94); }
        @keyframes slideIn { from { opacity: 0; transform: translateX(18px); } to { opacity: 1; transform: translateX(0); } }
        .fade-in { animation: fadeIn 0.18s ease; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .sheet-in { animation: sheetIn 0.25s cubic-bezier(0.25,0.46,0.45,0.94); }
        @keyframes sheetIn { from { transform: translateY(100%); } to { transform: translateY(0); } }
        .alert-scroll { display: flex; gap: 10px; overflow-x: auto; padding-bottom: 4px; scrollbar-width: none; }
        .alert-scroll::-webkit-scrollbar { display: none; }
        a { color: inherit; text-decoration: none; }
      `}</style>
      <div style={{ height: 44, background: COLORS.bg }} />

      {/* ── HOME ── */}
      {screen === "home" && (
        <div className="fade-in" style={{ padding: "0 0 100px" }}>
          <div style={{ padding: "8px 24px 20px" }}>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: COLORS.muted, marginBottom: 6 }}>Interdisciplinary Design & Media</div>
            <div style={{ fontSize: 28, fontWeight: 600, color: COLORS.ink, lineHeight: 1.15 }}>PhD Hub</div>
          </div>

          {/* ── COMING UP STRIP ── */}
          <div style={{ padding: "0 20px 20px" }}>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: COLORS.muted, marginBottom: 10 }}>Coming up</div>
            <div className="alert-scroll">
              {ALERTS.map((alert, i) => {
                const days = daysUntil(alert.date);
                const col = urgencyColor(days);
                return (
                  <div key={i} className="tap" onClick={() => goToScreen(alert.screen)} style={{ flexShrink: 0, background: col.bg, borderRadius: 12, border: `1.5px solid ${col.border}`, padding: "14px 14px 12px", minWidth: 148, maxWidth: 164 }}>
                    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 10, gap: 6 }}>
                      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 700, color: col.text, letterSpacing: "-0.01em", lineHeight: 1 }}>{formatShortDate(alert.date)}</div>
                      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 700, color: col.text, background: "rgba(0,0,0,0.08)", borderRadius: 5, padding: "2px 6px", whiteSpace: "nowrap", flexShrink: 0 }}>{formatDaysLabel(days)}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
                      <div style={{ marginTop: 1, flexShrink: 0 }}>
                        {(() => { const I = alert.icon; return I ? <I size={11} color={col.text} strokeWidth={2} /> : null; })()}
                      </div>
                      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 500, color: col.text, lineHeight: 1.35 }}>{alert.label}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── TO-DOS EMPHASIZED CARD ── */}
          <div style={{ padding: "0 20px 14px" }}>
            <div className="tap" onClick={() => goToScreen("todos")} style={{ background: COLORS.ink, borderRadius: 16, padding: "18px 20px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(200,64,27,0.18)" }} />
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 500, color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>Action required</div>
                  <div style={{ fontSize: 20, fontWeight: 600, color: "#FFF", marginBottom: 3 }}>Program To-Dos</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.55)" }}>{todos.length} items need your attention</div>
                </div>
                <div style={{ width: 38, height: 38, borderRadius: "50%", background: COLORS.accent, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 16, fontWeight: 600, color: "#FFF" }}>{todos.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── 2-COL GRID: Milestones + Calendar ── */}
          <div style={{ padding: "0 20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
            {[
              { id: "milestones", label: "Milestones", sub: "6 program milestones", icon: Flag },
              { id: "calendar", label: "Calendar", sub: "Events & deadlines", icon: Calendar },
            ].map((item) => (
              <div key={item.id} className="tap" onClick={() => goToScreen(item.id)} style={{ background: COLORS.surface, borderRadius: 14, padding: "18px 16px", border: `1px solid ${COLORS.border}` }}>
                <div style={{ marginBottom: 7 }}><item.icon size={20} color={COLORS.accent} strokeWidth={1.75} /></div>
                <div style={{ fontSize: 15, fontWeight: 600, color: COLORS.ink, marginBottom: 2 }}>{item.label}</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: COLORS.muted }}>{item.sub}</div>
              </div>
            ))}
          </div>

          {/* ── SKINNY BUTTONS ── */}
          <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: 8, marginBottom: 14 }}>
            {[
              { id: "courses", label: "Courses", sub: "Registration & drop dates", icon: BookOpen },
              { id: "funding", label: "Funding", sub: "Aid, grants & stipends", icon: DollarSign },
              { id: "policies", label: "Policies", sub: "GPA, advising, probation, waivers", icon: Shield },
              { id: "contacts", label: "Contacts & Communications", sub: "Who to reach and where", icon: MessageSquare },
            ].map((item) => (
              <div key={item.id} className="tap" onClick={() => goToScreen(item.id)} style={{ background: COLORS.surface, borderRadius: 12, padding: "12px 16px", border: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 20, display: "flex", alignItems: "center", justifyContent: "center" }}><item.icon size={16} color={COLORS.accent} strokeWidth={1.75} /></div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.ink, marginBottom: 1 }}>{item.label}</div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: COLORS.muted }}>{item.sub}</div>
                  </div>
                </div>
                <div style={{ fontSize: 16, color: COLORS.muted }}>›</div>
              </div>
            ))}
          </div>

          {/* ── BOTTOM LINKS ── */}
          <div style={{ padding: "0 20px", display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
            <a href="https://northeastern.sharepoint.com/:w:/r/sites/IDaMPhDStudents/Shared%20Documents/General/Handbook/Student%20Handbook%20CAMD%20PhD_AY26.docx?d=we382d87c21d84d258562a9e5b0d1bd44&csf=1&web=1&e=L76IJV" target="_blank" rel="noreferrer" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: COLORS.accent, textDecoration: "underline" }}>Handbook</a>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: COLORS.muted }}>·</span>
            <a href="https://northeastern.sharepoint.com/sites/CAMDHub/SitePages/Students/PhD-Resources.aspx" target="_blank" rel="noreferrer" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: COLORS.accent, textDecoration: "underline" }}>PhD Hub</a>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: COLORS.muted }}>·</span>
            <a href="https://teams.microsoft.com/l/team/19%3AwATcDwT4uhLQ4oWXRluYwf1GT1M6WtBU0UF-6h-YSDg1%40thread.tacv2/conversations?groupId=e28261f3-b2e1-4038-a57f-dfcef002c39d&tenantId=a8eec281-aaa3-4dae-ac9b-9a398b9215e7" target="_blank" rel="noreferrer" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: COLORS.accent, textDecoration: "underline" }}>Teams</a>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: COLORS.muted }}>·</span>
            <a href="https://camdphd.slack.com/archives/C03D0KFP8JU" target="_blank" rel="noreferrer" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: COLORS.accent, textDecoration: "underline" }}>Slack</a>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: COLORS.muted }}>·</span>
            <span className="tap" onClick={() => goToScreen("changelog")} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: COLORS.accent, textDecoration: "underline", cursor: "pointer" }}>Changelog</span>
          </div>
        </div>
      )}

      {/* ── MILESTONES LIST ── */}
      {screen === "milestones" && !selected && (
        <div className="slide-in" style={{ padding: "0 0 100px" }}>
          <Header title="Milestones" onBack={goHome} />
          <div style={{ padding: "4px 20px 0" }}>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: COLORS.muted, marginBottom: 20, lineHeight: 1.5 }}>Six milestones mark your path from entry to defense. Tap any for step-by-step guidance and form links.</div>
            {milestones.map((m) => (
              <div key={m.id} className="tap" onClick={() => setSelected(m)} style={{ background: COLORS.surface, borderRadius: 14, padding: "18px 20px", marginBottom: 10, border: `1px solid ${COLORS.border}`, display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div style={{ minWidth: 40, height: 40, borderRadius: 10, background: m.optional ? COLORS.border : COLORS.ink, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 500, color: m.optional ? COLORS.muted : "#FFF" }}>{m.number}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3, flexWrap: "wrap" }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: COLORS.ink }}>{m.title}</div>
                    {m.optional && <Tag label="Optional" color={COLORS.border} textColor={COLORS.muted} />}
                  </div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: COLORS.muted, display: "flex", gap: 10 }}>
                    <span>{m.year}</span><span>·</span><span>Due: {m.deadline}</span>
                  </div>
                </div>
                <div style={{ color: COLORS.muted, fontSize: 16, marginTop: 2 }}>›</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── MILESTONE DETAIL ── */}
      {screen === "milestones" && selected && (
        <div className="slide-in" style={{ padding: "0 0 100px" }}>
          <Header title={selected.title} onBack={() => setSelected(null)} />
          <div style={{ padding: "0 20px" }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
              <Tag label={selected.year} color={COLORS.accentLight} textColor={COLORS.accent} />
              <Tag label={`Due: ${selected.deadline}`} color={COLORS.accentLight} textColor={COLORS.accent} />
              {selected.optional && <Tag label="Optional" color={COLORS.border} textColor={COLORS.muted} />}
            </div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: COLORS.ink, lineHeight: 1.6, marginBottom: 24 }}>{selected.summary}</div>
            {selected.critical && (
              <div style={{ background: COLORS.warn, borderRadius: 10, padding: "14px 16px", marginBottom: 24, borderLeft: `3px solid #D97706` }}>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 500, color: COLORS.warnText, marginBottom: 4, letterSpacing: "0.05em", textTransform: "uppercase" }}>⚠ Critical</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#78350F", lineHeight: 1.55 }}>{selected.critical}</div>
              </div>
            )}
            <SectionLabel>Steps</SectionLabel>
            <div style={{ marginBottom: 24 }}>
              {selected.steps.map((step, i) => {
                const isCrit = step.startsWith("CRITICAL:");
                return (
                  <div key={i} style={{ display: "flex", gap: 14, marginBottom: 14, alignItems: "flex-start" }}>
                    <div style={{ minWidth: 24, height: 24, borderRadius: "50%", background: isCrit ? COLORS.warn : COLORS.bg, border: `1.5px solid ${isCrit ? "#D97706" : COLORS.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 500, color: isCrit ? COLORS.warnText : COLORS.muted, marginTop: 1 }}>{i + 1}</div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13.5, color: isCrit ? "#78350F" : COLORS.ink, lineHeight: 1.55, flex: 1, fontWeight: isCrit ? 500 : 400 }}>{step}</div>
                  </div>
                );
              })}
            </div>
            {selected.outcomes && <>
              <SectionLabel>Possible Outcomes</SectionLabel>
              <div style={{ marginBottom: 24 }}>
                {selected.outcomes.map((o, i) => <div key={i} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: COLORS.ink, padding: "10px 14px", background: COLORS.bg, borderRadius: 8, marginBottom: 6 }}>{o}</div>)}
              </div>
            </>}
            {selected.notes && (
              <div style={{ background: COLORS.accentLight, borderRadius: 10, padding: "14px 16px", marginBottom: 24, borderLeft: `3px solid ${COLORS.accent}` }}>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 500, color: COLORS.accent, marginBottom: 4, letterSpacing: "0.05em", textTransform: "uppercase" }}>Note</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: COLORS.ink, lineHeight: 1.55 }}>{selected.notes}</div>
              </div>
            )}
            <SectionLabel>Forms</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {selected.forms.map((form, i) => (
                form.url
                  ? <a key={i} href={form.url} target="_blank" rel="noreferrer"><FormButton label={form.label} /></a>
                  : <div key={i} style={{ background: COLORS.bg, borderRadius: 12, padding: "14px 18px", border: `1px solid ${COLORS.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500, color: COLORS.muted }}>{form.label}</div>
                      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: COLORS.muted }}>{form.note}</div>
                    </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── CALENDAR MAIN ── */}
      {screen === "calendar" && !selectedDay && !selectedEvent && (
        <div className="slide-in" style={{ padding: "0 0 100px" }}>
          <Header title="Calendar" onBack={goHome} />
          <div style={{ padding: "0 20px" }}>
            <div style={{ background: COLORS.ink, borderRadius: 14, padding: "16px 18px", marginBottom: 20, display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 500, color: "rgba(255,255,255,0.5)", marginBottom: 3, letterSpacing: "0.06em", textTransform: "uppercase" }}>Subscribe to all events</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.8)", lineHeight: 1.4 }}>Add CAMD + program events to your calendar app — auto-updates monthly.</div>
              </div>
              <div className="tap" onClick={() => setShowSubscribeSheet(true)} style={{ minWidth: 72, background: COLORS.accent, borderRadius: 8, padding: "9px 12px", fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 500, color: "#FFF", textAlign: "center" }}>Subscribe</div>
            </div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: COLORS.muted, marginBottom: 16 }}>April 2026 · Tap a highlighted day</div>
            <div style={{ background: COLORS.surface, borderRadius: 16, padding: "16px", marginBottom: 20, border: `1px solid ${COLORS.border}` }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, marginBottom: 8 }}>
                {["S","M","T","W","T","F","S"].map((d, i) => <div key={i} style={{ textAlign: "center", fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 500, color: COLORS.muted, padding: "4px 0" }}>{d}</div>)}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
                {Array.from({ length: 3 }).map((_, i) => <div key={`e${i}`} />)}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const evs = mockEvents.filter(e => e.day === day);
                  const hasEvents = evs.length > 0;
                  const isMilestone = evs.some(e => e.category === "Milestone");
                  return (
                    <div key={day} className="tap" onClick={() => hasEvents && setSelectedDay(day)} style={{ aspectRatio: "1", borderRadius: 8, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: isMilestone ? COLORS.accentLight : hasEvents ? COLORS.bg : "transparent", border: isMilestone ? `1.5px solid ${COLORS.accent}` : "none", cursor: hasEvents ? "pointer" : "default" }}>
                      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: isMilestone ? COLORS.accent : COLORS.ink, fontWeight: hasEvents ? 500 : 400 }}>{day}</div>
                      {hasEvents && <div style={{ width: 4, height: 4, borderRadius: "50%", background: isMilestone ? COLORS.accent : COLORS.muted, marginTop: 2 }} />}
                    </div>
                  );
                })}
              </div>
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
              {Object.entries(catColors).map(([cat, col]) => (
                <div key={cat} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: col.bg, border: `1px solid ${col.text}33` }} />
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: COLORS.muted }}>{cat}</div>
                </div>
              ))}
            </div>
            <SectionLabel>Upcoming</SectionLabel>
            {mockEvents.slice(0, 6).map((e, i) => (
              <div key={i} className="tap" onClick={() => { setSelectedDay(e.day); setSelectedEvent(e); }}><EventRow event={e} /></div>
            ))}
          </div>
        </div>
      )}

      {/* ── DAY VIEW ── */}
      {screen === "calendar" && selectedDay && !selectedEvent && (
        <div className="slide-in" style={{ padding: "0 0 100px" }}>
          <Header title={`April ${selectedDay}`} onBack={() => setSelectedDay(null)} />
          <div style={{ padding: "0 20px" }}>
            {mockEvents.filter(e => e.day === selectedDay).map((e, i) => (
              <div key={i} className="tap" onClick={() => setSelectedEvent(e)} style={{ background: COLORS.surface, borderRadius: 14, padding: "18px 20px", marginBottom: 10, border: `1px solid ${COLORS.border}` }}>
                <Tag label={e.category} color={catColors[e.category]?.bg} textColor={catColors[e.category]?.text} />
                <div style={{ fontSize: 17, fontWeight: 600, color: COLORS.ink, marginTop: 8, marginBottom: 6 }}>{e.title}</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: COLORS.muted, display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
                  <span>{e.time}{e.endTime ? ` – ${e.endTime}` : ""}</span>
                  {e.location && <><span>·</span><span>{e.location}</span></>}
                </div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: COLORS.accent }}>Details & calendar options →</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── EVENT DETAIL ── */}
      {screen === "calendar" && selectedEvent && (
        <div className="slide-in" style={{ padding: "0 0 100px" }}>
          <Header title="Event Details" onBack={() => setSelectedEvent(null)} />
          <div style={{ padding: "0 20px" }}>
            <Tag label={selectedEvent.category} color={catColors[selectedEvent.category]?.bg} textColor={catColors[selectedEvent.category]?.text} />
            <div style={{ fontSize: 22, fontWeight: 600, color: COLORS.ink, marginTop: 12, marginBottom: 18, lineHeight: 1.25 }}>{selectedEvent.title}</div>
            <div style={{ background: COLORS.surface, borderRadius: 14, border: `1px solid ${COLORS.border}`, marginBottom: 20, overflow: "hidden" }}>
              <MetaRow icon={Clock} label="Time" value={selectedEvent.time + (selectedEvent.endTime ? ` – ${selectedEvent.endTime}` : "")} />
              {selectedEvent.location && <MetaRow icon={MapPin} label="Location" value={selectedEvent.location} border />}
              {selectedEvent.url && <a href={selectedEvent.url} target="_blank" rel="noreferrer"><MetaRow icon={ExternalLink} label="Event page" value="Open website" border accent /></a>}
            </div>
            {selectedEvent.description && <>
              <SectionLabel>About</SectionLabel>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: COLORS.ink, lineHeight: 1.65, marginBottom: 24 }}>{selectedEvent.description}</div>
            </>}
            <SectionLabel>Add to your calendar</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <a href={makeGoogleCalLink(selectedEvent)} target="_blank" rel="noreferrer"><CalButton icon="G" label="Add to Google Calendar" color="#4285F4" /></a>
              <a href={makeOutlookLink(selectedEvent)} target="_blank" rel="noreferrer"><CalButton icon="O" label="Add to Outlook / Office 365" color="#0078D4" /></a>
              <a href={makeICS(selectedEvent)} download={`${selectedEvent.title.replace(/\s+/g,"_")}.ics`}><CalButton icon="↓" label="Download .ics (Apple Calendar, etc.)" color={COLORS.muted} /></a>
            </div>
          </div>
        </div>
      )}

      {/* ── COURSES ── */}
      {screen === "courses" && (
        <div className="slide-in" style={{ padding: "0 0 100px" }}>
          <Header title="Course Registration" onBack={goHome} />
          <div style={{ padding: "0 20px" }}>

            {/* Drop dates */}
            <SectionLabel>Drop Dates — Spring 2026</SectionLabel>
            <div style={{ marginBottom: 24 }}>
              {DROP_DATES.map((d, i) => {
                const days = daysUntil(d.dateISO);
                const col = urgencyColor(days);
                return (
                  <div key={i} style={{ background: col.bg, borderRadius: 12, padding: "16px 18px", marginBottom: 10, border: `1.5px solid ${col.border}` }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: col.text }}>{d.label}</div>
                      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700, color: col.text, background: "rgba(0,0,0,0.07)", borderRadius: 6, padding: "2px 8px" }}>
                        {formatDaysLabel(days)}
                      </div>
                    </div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: col.text, marginBottom: 6 }}>{d.date}</div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: COLORS.ink, lineHeight: 1.5, marginBottom: 6 }}>{d.detail}</div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: COLORS.muted, fontStyle: "italic" }}>Source: {d.source}</div>
                  </div>
                );
              })}
              <div style={{ background: COLORS.bg, borderRadius: 10, padding: "10px 14px", border: `1px solid ${COLORS.border}` }}>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: COLORS.muted, lineHeight: 1.5 }}>
                  Drop dates update each semester and are sourced from the{" "}
                  <a href="https://registrar.northeastern.edu/article/academic-calendar/" target="_blank" rel="noreferrer" style={{ color: COLORS.accent }}>Northeastern Academic Calendar</a>.
                  Subscribe to the academic calendar below to get these dates automatically.
                </div>
              </div>
            </div>

            {/* Override requests */}
            <SectionLabel>Override Requests</SectionLabel>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: COLORS.muted, marginBottom: 12, lineHeight: 1.5 }}>
                If a course you need is full or restricted, submit an override request directly to the relevant college.
              </div>
              {overrideLinks.map((o, i) => (
                <a key={i} href={o.url} target="_blank" rel="noreferrer">
                  <div className="tap" style={{ background: COLORS.surface, borderRadius: 12, padding: "14px 18px", marginBottom: 8, border: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, color: COLORS.ink }}>{o.college}</div>
                    <div style={{ fontSize: 14, color: COLORS.accent }}>↗</div>
                  </div>
                </a>
              ))}
            </div>

            {/* Dissertation courses */}
            <SectionLabel>Dissertation-Track Courses</SectionLabel>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: COLORS.muted, marginBottom: 12, lineHeight: 1.5 }}>
              After Year 2, most students register for placeholder or dissertation courses. Tap for details.
            </div>
            {courseRegistration.map((course, i) => (
              <div key={i} style={{ marginBottom: 8 }}>
                <div className="tap" onClick={() => setExpandedCourse(expandedCourse === i ? null : i)} style={{ background: COLORS.surface, borderRadius: expandedCourse === i ? "12px 12px 0 0" : 12, padding: "14px 18px", border: `1px solid ${COLORS.border}`, borderBottom: expandedCourse === i ? "none" : undefined, display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ background: course.color, borderRadius: 8, padding: "5px 10px", fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 500, color: COLORS.ink, whiteSpace: "nowrap" }}>{course.code}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.ink, marginBottom: 1 }}>{course.title}</div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: COLORS.muted }}>{course.when}</div>
                  </div>
                  <div style={{ color: COLORS.muted, fontSize: 16, transform: expandedCourse === i ? "rotate(90deg)" : "none", transition: "transform 0.15s" }}>›</div>
                </div>
                {expandedCourse === i && (
                  <div style={{ background: COLORS.surface, borderRadius: "0 0 12px 12px", padding: "4px 18px 16px", border: `1px solid ${COLORS.border}`, borderTop: "none" }}>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: COLORS.ink, lineHeight: 1.6, marginTop: 10, marginBottom: course.critical ? 12 : 0 }}>{course.detail}</div>
                    {course.critical && (
                      <div style={{ background: COLORS.warn, borderRadius: 8, padding: "10px 14px", marginBottom: course.forms.length ? 12 : 0, borderLeft: `3px solid #D97706` }}>
                        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "#78350F", lineHeight: 1.5 }}>⚠ {course.critical}</div>
                      </div>
                    )}
                    {course.forms.map((f, fi) => (
                      <a key={fi} href={f.url} target="_blank" rel="noreferrer"><FormButton label={f.label} /></a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TO-DOS ── */}
      {screen === "todos" && (
        <div className="slide-in" style={{ padding: "0 0 100px" }}>
          <Header title="Program To-Dos" onBack={goHome} />
          <div style={{ padding: "0 20px" }}>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: COLORS.muted, marginBottom: 20, lineHeight: 1.55 }}>
              Time-sensitive actions from program administration. Complete by the deadline shown.
            </div>
            {todos.map((item, i) => {
              const days = item.deadlineISO ? daysUntil(item.deadlineISO) : null;
              const isUrgent = days !== null && days <= 7;
              const borderColor = isUrgent ? COLORS.accent : COLORS.muted;
              const badgeBg = isUrgent ? COLORS.accentLight : COLORS.tag1;
              const badgeText = isUrgent ? COLORS.accent : "#1A4A7A";
              return (
                <div key={i} style={{ background: COLORS.surface, borderRadius: 14, padding: "16px 18px", marginBottom: 10, border: `0.5px solid ${COLORS.border}`, borderLeft: `3px solid ${borderColor}` }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 8 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: COLORS.ink, lineHeight: 1.3, flex: 1, paddingRight: 10 }}>{item.title}</div>
                    <div style={{ background: badgeBg, borderRadius: 6, padding: "3px 8px", flexShrink: 0 }}>
                      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 600, color: badgeText }}>{item.deadline}</span>
                    </div>
                  </div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: COLORS.muted, lineHeight: 1.55, marginBottom: item.url ? 12 : 0 }}>{item.description}</div>
                  {item.url && (
                    <a href={item.url} target="_blank" rel="noreferrer">
                      <div className="tap" style={{ background: COLORS.ink, borderRadius: 10, padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, color: "#FFF" }}>{item.buttonLabel}</span>
                        <span style={{ fontSize: 14, color: "rgba(255,255,255,0.5)" }}>↗</span>
                      </div>
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── FUNDING ── */}
      {screen === "funding" && (
        <div className="slide-in" style={{ padding: "0 0 100px" }}>
          <Header title="Funding" onBack={goHome} />
          <div style={{ padding: "0 20px" }}>

            {/* Flex Fellowship */}
            <div style={{ background: COLORS.ink, borderRadius: 14, padding: "18px 20px", marginBottom: 24, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -16, right: -16, width: 80, height: 80, borderRadius: "50%", background: "rgba(200,64,27,0.2)" }} />
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 500, color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>Program funding</div>
              <div style={{ fontSize: 17, fontWeight: 600, color: "#FFF", marginBottom: 4 }}>Flex Fellowship</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.5, marginBottom: 14 }}>
                A funded semester for fieldwork, research, or creative practice. Available after completing coursework and qualifying exam. Apply at least 2 months before semester start — summer requests most likely to be approved.
              </div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.35)", marginBottom: 12 }}>
                Notify program administration before agreeing to any external fellowship — critical for international students.
              </div>
              <a href={FORMS.flexFellowship} target="_blank" rel="noreferrer">
                <div className="tap" style={{ background: COLORS.accent, borderRadius: 10, padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, color: "#FFF" }}>Flex Fellowship Form</span>
                  <span style={{ fontSize: 14, color: "rgba(255,255,255,0.7)" }}>↗</span>
                </div>
              </a>
            </div>

            {/* University Resources */}
            <SectionLabel>University Resources</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
              <a href="https://resdev.northeastern.edu/home/find-funding/" target="_blank" rel="noreferrer">
                <div className="tap" style={{ background: COLORS.surface, borderRadius: 12, padding: "14px 18px", border: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.ink, marginBottom: 2 }}>Office of Research Development</div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: COLORS.muted }}>Grant writing support, proposal development, funding search</div>
                  </div>
                  <div style={{ fontSize: 16, color: COLORS.muted, marginLeft: 12, flexShrink: 0 }}>↗</div>
                </div>
              </a>
              <a href="https://pivot.proquest.com/funding_main" target="_blank" rel="noreferrer">
                <div className="tap" style={{ background: COLORS.surface, borderRadius: 12, padding: "14px 18px", border: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.ink, marginBottom: 2 }}>Pivot-RP</div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: COLORS.muted }}>34,000+ opportunities — federal, foundation & corporate. Free via Northeastern login</div>
                  </div>
                  <div style={{ fontSize: 16, color: COLORS.muted, marginLeft: 12, flexShrink: 0 }}>↗</div>
                </div>
              </a>
              <a href="https://link.ezproxy.neu.edu/login?url=https://grantstoindividuals.org" target="_blank" rel="noreferrer">
                <div className="tap" style={{ background: COLORS.surface, borderRadius: 12, padding: "14px 18px", border: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.ink, marginBottom: 2 }}>Candid / Foundation Directory</div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: COLORS.muted }}>70,000+ private foundations. Free via Northeastern Library</div>
                  </div>
                  <div style={{ fontSize: 16, color: COLORS.muted, marginLeft: 12, flexShrink: 0 }}>↗</div>
                </div>
              </a>
            </div>

            {/* Find Opportunities */}
            <SectionLabel>Find Opportunities</SectionLabel>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: COLORS.muted, lineHeight: 1.55, marginBottom: 14 }}>
              Search your research area and "fellowship" to find relevant results. ProFellow requires a free account — <a href="https://www.profellow.com/sign-up/" target="_blank" rel="noreferrer" style={{ color: COLORS.accent }}>create one here</a>.
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
              <a href="https://www.profellow.com/fellowships/" target="_blank" rel="noreferrer">
                <div className="tap" style={{ background: COLORS.surface, borderRadius: 12, padding: "14px 18px", border: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.ink, marginBottom: 2 }}>ProFellow</div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: COLORS.muted }}>2,800+ fellowships across all disciplines and career stages</div>
                  </div>
                  <div style={{ fontSize: 16, color: COLORS.muted, marginLeft: 12, flexShrink: 0 }}>↗</div>
                </div>
              </a>
              <a href="https://www.postdocjobs.com" target="_blank" rel="noreferrer">
                <div className="tap" style={{ background: COLORS.surface, borderRadius: 12, padding: "14px 18px", border: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.ink, marginBottom: 2 }}>PostdocJobs.com</div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: COLORS.muted }}>Advanced fellowships and postdoctoral research positions</div>
                  </div>
                  <div style={{ fontSize: 16, color: COLORS.muted, marginLeft: 12, flexShrink: 0 }}>↗</div>
                </div>
              </a>
            </div>

            {/* Google Alerts */}
            <SectionLabel>Google Alerts</SectionLabel>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: COLORS.muted, lineHeight: 1.55, marginBottom: 14 }}>
              Set up a passive monitor so new fellowship opportunities come to you. Use quoted phrases and <span style={{ fontFamily: "monospace", fontSize: 12, color: COLORS.ink }}>-undergraduate</span> to filter noise.
            </div>
            <div style={{ background: COLORS.bg, borderRadius: 10, padding: "12px 14px", marginBottom: 14, border: `1px solid ${COLORS.border}` }}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 500, color: COLORS.muted, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>Example pattern</div>
              <a href={`https://www.google.com/alerts?q=${encodeURIComponent('"your research area" fellowship -undergraduate')}`} target="_blank" rel="noreferrer">
                <div className="tap" style={{ background: COLORS.surface, borderRadius: 8, padding: "8px 12px", display: "flex", alignItems: "center", justifyContent: "space-between", border: `1px solid ${COLORS.border}` }}>
                  <div style={{ fontFamily: "monospace", fontSize: 11, color: COLORS.ink, lineHeight: 1.4 }}>"your research area" fellowship -undergraduate</div>
                  <div style={{ color: COLORS.accent, fontSize: 12, flexShrink: 0, marginLeft: 8 }}>↗</div>
                </div>
              </a>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 8 }}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 500, color: COLORS.muted, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 2 }}>Further reading</div>
              <a href="https://www.howtogeek.com/444477/how-to-master-google-alerts/" target="_blank" rel="noreferrer" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: COLORS.accent, textDecoration: "underline" }}>How to Master Google Alerts — HowToGeek</a>
              <a href="https://mention.com/en/blog/how-to-set-up-google-alerts/" target="_blank" rel="noreferrer" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: COLORS.accent, textDecoration: "underline" }}>Using Filters & Operators Effectively — Mention.com</a>
              <a href="https://greyb.com/blog/expert-google-alerts-tips/" target="_blank" rel="noreferrer" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: COLORS.accent, textDecoration: "underline" }}>Expert Google Alerts Tips — GreyB</a>
            </div>

          </div>
        </div>
      )}

      {/* ── CONTACTS & COMMUNICATIONS ── */}
      {screen === "contacts" && (
        <div className="slide-in" style={{ padding: "0 0 100px" }}>
          <Header title="Contacts & Communications" onBack={goHome} />
          <div style={{ padding: "0 20px" }}>

            {/* Communications structure — expandable */}
            <div style={{ marginBottom: 20 }}>
              <div className="tap" onClick={() => setExpandedComms(!expandedComms)} style={{ background: COLORS.surface, borderRadius: expandedComms ? "12px 12px 0 0" : 12, padding: "16px 18px", border: `1px solid ${COLORS.border}`, borderBottom: expandedComms ? "none" : undefined, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: COLORS.ink, marginBottom: 2 }}>Communications Structure</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: COLORS.muted }}>Where different types of information live</div>
                </div>
                <div style={{ color: COLORS.muted, fontSize: 16, transform: expandedComms ? "rotate(90deg)" : "none", transition: "transform 0.15s" }}>›</div>
              </div>
              {expandedComms && (
                <div style={{ background: COLORS.surface, borderRadius: "0 0 12px 12px", border: `1px solid ${COLORS.border}`, borderTop: "none", overflow: "hidden" }}>
                  {commsChannels.map((ch, i) => (
                    <div key={i} style={{ padding: "14px 18px", borderTop: i > 0 ? `1px solid ${COLORS.border}` : "none", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.ink, marginBottom: 2 }}>{ch.channel}</div>
                        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: COLORS.muted }}>{ch.purpose}</div>
                      </div>
                      <a href={ch.url} target="_blank" rel="noreferrer">
                        <div style={{ background: COLORS.accentLight, borderRadius: 7, padding: "5px 10px", flexShrink: 0 }}>
                          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 500, color: COLORS.accent }}>{ch.linkLabel} ↗</span>
                        </div>
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: COLORS.muted, marginBottom: 16, lineHeight: 1.5 }}>Not sure who to contact? Start with the Graduate Administrator for most questions.</div>
            {contacts.map((c, i) => (
              <div key={i} style={{ background: COLORS.surface, borderRadius: 14, padding: "18px 20px", marginBottom: 10, border: `1px solid ${COLORS.border}` }}>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: COLORS.muted, marginBottom: 4 }}>{c.role}</div>
                {!c.isGroup && <div style={{ fontSize: 16, fontWeight: 600, color: COLORS.ink, marginBottom: 4 }}>{c.name}</div>}
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: COLORS.muted, marginBottom: 10, lineHeight: 1.4 }}>{c.note}</div>
                {c.hours && (
                  <div style={{ marginBottom: 10 }}>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 500, color: COLORS.muted, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 4 }}>Office Hours</div>
                    {c.hours.map((h, hi) => <div key={hi} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: COLORS.ink, lineHeight: 1.6 }}>{h}</div>)}
                    {c.office && <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: COLORS.muted, marginTop: 2 }}>{c.office}</div>}
                    {c.preferred && <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: COLORS.accent, marginTop: 2 }}>Preferred: {c.preferred}</div>}
                  </div>
                )}
                <a href={`mailto:${c.email}`}>
                  <div style={{ display: "inline-block", background: COLORS.accentLight, borderRadius: 8, padding: "6px 12px" }}>
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: COLORS.accent }}>{c.email}</span>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── CHANGELOG ── */}
      {screen === "changelog" && (
        <div className="slide-in" style={{ padding: "0 0 100px" }}>
          <Header title="Changelog" onBack={goHome} />
          <div style={{ padding: "0 20px" }}>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: COLORS.muted, marginBottom: 20, lineHeight: 1.55 }}>
              Significant content changes — new sections, removed content, structural updates. Regular calendar and deadline updates are not logged here.
            </div>
            {changelog.map((entry, i) => (
              <div key={i} style={{ marginBottom: 24 }}>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600, color: COLORS.accent, marginBottom: 10, letterSpacing: "0.04em" }}>{entry.date}</div>
                {entry.entries.map((line, li) => (
                  <div key={li} style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "flex-start" }}>
                    <div style={{ color: COLORS.border, marginTop: 4, fontSize: 10, flexShrink: 0 }}>—</div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: COLORS.ink, lineHeight: 1.55 }}>{line}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── POLICIES ── */}
      {screen === "policies" && (
        <div className="slide-in" style={{ padding: "0 0 100px" }}>
          <Header title="Policies" onBack={goHome} />
          <div style={{ padding: "0 20px" }}>
            {/* Graduate Catalog link */}
            <a href="https://catalog.northeastern.edu/graduate/arts-media-design/interdisciplinary-programs/interdisciplinary-design-media-phd/" target="_blank" rel="noreferrer">
              <div className="tap" style={{ background: COLORS.ink, borderRadius: 14, padding: "16px 20px", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 500, color: "rgba(255,255,255,0.5)", marginBottom: 3, letterSpacing: "0.06em", textTransform: "uppercase" }}>Official source</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500, color: "#FFF" }}>Graduate Catalog — IDM PhD</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>Program requirements, university academic policies & procedures</div>
                </div>
                <div style={{ fontSize: 18, color: "rgba(255,255,255,0.4)", marginLeft: 14 }}>↗</div>
              </div>
            </a>
            {policies.map((p, i) => (
              <div key={i} style={{ marginBottom: 8 }}>
                <div className="tap" onClick={() => setExpandedPolicy(expandedPolicy === i ? null : i)} style={{ background: COLORS.surface, borderRadius: expandedPolicy === i ? "12px 12px 0 0" : 12, padding: "16px 18px", border: `1px solid ${COLORS.border}`, borderBottom: expandedPolicy === i ? "none" : undefined, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: COLORS.ink }}>{p.title}</div>
                  <div style={{ color: COLORS.muted, fontSize: 16, transform: expandedPolicy === i ? "rotate(90deg)" : "none", transition: "transform 0.15s" }}>›</div>
                </div>
                {expandedPolicy === i && (
                  <div style={{ background: COLORS.surface, borderRadius: "0 0 12px 12px", padding: "4px 18px 16px", border: `1px solid ${COLORS.border}`, borderTop: "none" }}>
                    {p.items.map((item, ii) => (
                      <div key={ii} style={{ display: "flex", gap: 10, marginTop: 10, alignItems: "flex-start" }}>
                        <div style={{ color: COLORS.accent, marginTop: 3, fontSize: 10 }}>◆</div>
                        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: COLORS.ink, lineHeight: 1.55 }}>{item}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── BOTTOM NAV ── */}
      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430, background: "rgba(247,244,239,0.92)", backdropFilter: "blur(12px)", borderTop: `1px solid ${COLORS.border}`, padding: "10px 0 24px", display: "flex", justifyContent: "space-around" }}>
        {[
          { id: "home", label: "Home", icon: Home },
          { id: "todos", label: "To-Dos", icon: ClipboardList },
          { id: "milestones", label: "Milestones", icon: Flag },
          { id: "calendar", label: "Calendar", icon: Calendar },
        ].map((item) => (
          <div key={item.id} className="tap" onClick={() => goToScreen(item.id)} style={{ textAlign: "center", flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "center" }}><item.icon size={20} color={screen === item.id ? COLORS.accent : COLORS.muted} strokeWidth={1.75} /></div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: screen === item.id ? COLORS.accent : COLORS.muted, marginTop: 2, fontWeight: screen === item.id ? 500 : 400 }}>{item.label}</div>
          </div>
        ))}
      </div>

      {/* ── SUBSCRIBE SHEET ── */}
      {showSubscribeSheet && (
        <>
          <div onClick={() => setShowSubscribeSheet(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", zIndex: 10 }} />
          <div className="sheet-in" style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430, background: COLORS.surface, borderRadius: "20px 20px 0 0", padding: "24px 24px 48px", zIndex: 11 }}>
            <div style={{ width: 36, height: 4, borderRadius: 2, background: COLORS.border, margin: "0 auto 24px" }} />
            <div style={{ fontSize: 20, fontWeight: 600, color: COLORS.ink, marginBottom: 16 }}>Subscribe to Calendars</div>

            <SectionLabel>CAMD + Program Events</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
              <a href={ICAL_CAMD_GOOGLE} target="_blank" rel="noreferrer" onClick={() => setShowSubscribeSheet(false)}><CalButton icon="G" label="Subscribe in Google Calendar" color="#4285F4" /></a>
              <a href={ICAL_CAMD} onClick={() => setShowSubscribeSheet(false)}><CalButton icon="◎" label="Subscribe in Apple / Outlook (webcal)" color={COLORS.muted} /></a>
            </div>

            <SectionLabel>Northeastern Academic Calendar</SectionLabel>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: COLORS.muted, lineHeight: 1.5, marginBottom: 10 }}>
              Includes drop dates, registration periods, holidays, and degree conferral dates. Updates automatically each semester.
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
              <a href={ICAL_ACADEMIC_GOOGLE} target="_blank" rel="noreferrer" onClick={() => setShowSubscribeSheet(false)}><CalButton icon="G" label="Add Academic Calendar to Google" color="#4285F4" /></a>
              <a href={ICAL_ACADEMIC} onClick={() => setShowSubscribeSheet(false)}><CalButton icon="◎" label="Add Academic Calendar (webcal)" color={COLORS.muted} /></a>
            </div>

            <div style={{ background: COLORS.bg, borderRadius: 10, padding: "12px 14px", border: `1px solid ${COLORS.border}`, marginBottom: 16 }}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 500, color: COLORS.muted, marginBottom: 6, letterSpacing: "0.06em", textTransform: "uppercase" }}>Academic Calendar feed URL</div>
              <div style={{ fontFamily: "monospace", fontSize: 11, color: COLORS.ink, wordBreak: "break-all", userSelect: "all", lineHeight: 1.5 }}>25livepub.collegenet.com/calendars/Northeastern-Academic-Calendar.ics</div>
            </div>
            <div className="tap" onClick={() => setShowSubscribeSheet(false)} style={{ textAlign: "center", fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: COLORS.muted, padding: "12px" }}>Dismiss</div>
          </div>
        </>
      )}
    </div>
  );
}

function Header({ title, onBack }) {
  return (
    <div style={{ padding: "0 20px 20px", display: "flex", alignItems: "center", gap: 12 }}>
      <div className="tap" onClick={onBack} style={{ width: 36, height: 36, borderRadius: 10, background: "#FFF", border: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: COLORS.ink }}>‹</div>
      <div style={{ fontSize: 20, fontWeight: 600, color: COLORS.ink }}>{title}</div>
    </div>
  );
}
function Tag({ label, color, textColor }) {
  return <span style={{ display: "inline-block", background: color, borderRadius: 6, padding: "3px 8px", fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 500, color: textColor }}>{label}</span>;
}
function SectionLabel({ children }) {
  return <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: COLORS.muted, marginBottom: 10 }}>{children}</div>;
}
function FormButton({ label }) {
  return (
    <div className="tap" style={{ background: COLORS.ink, borderRadius: 12, padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500, color: "#FFF" }}>{label}</div>
      <div style={{ fontSize: 16, color: "rgba(255,255,255,0.5)" }}>↗</div>
    </div>
  );
}
function EventRow({ event }) {
  const col = catColors[event.category] || { bg: COLORS.bg, text: COLORS.muted };
  return (
    <div style={{ display: "flex", gap: 14, marginBottom: 10, alignItems: "center" }}>
      <div style={{ minWidth: 34, height: 34, borderRadius: 8, background: col.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: col.text }}>{event.day}</span>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: COLORS.ink, lineHeight: 1.3 }}>{event.title}</div>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: COLORS.muted }}>{event.time} · {event.category}</div>
      </div>
      <div style={{ color: COLORS.muted, fontSize: 14 }}>›</div>
    </div>
  );
}
function MetaRow({ icon, label, value, border, accent }) {
  const isComponent = typeof icon === "function";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 18px", borderTop: border ? `1px solid ${COLORS.border}` : "none" }}>
      <div style={{ color: accent ? COLORS.accent : COLORS.muted, width: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {isComponent ? React.createElement(icon, { size: 15, strokeWidth: 1.75 }) : <span style={{ fontSize: 15 }}>{icon}</span>}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: COLORS.muted, marginBottom: 2, letterSpacing: "0.06em", textTransform: "uppercase" }}>{label}</div>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: accent ? COLORS.accent : COLORS.ink, lineHeight: 1.4 }}>{value}</div>
      </div>
    </div>
  );
}
function CalButton({ icon, label, color }) {
  return (
    <div className="tap" style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: "14px 18px", display: "flex", alignItems: "center", gap: 14 }}>
      <div style={{ width: 32, height: 32, borderRadius: 8, background: color, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 700, color: "#FFF", flexShrink: 0 }}>{icon}</div>
      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500, color: COLORS.ink }}>{label}</div>
      <div style={{ marginLeft: "auto", color: COLORS.muted }}>›</div>
    </div>
  );
}

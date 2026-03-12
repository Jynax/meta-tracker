/**
 * T-4 Migration Script: Add dayId to all decision tree nodes.
 *
 * Strategy:
 * - For each chapter, collect all DayEntries that reference it (via chapterId).
 * - Sort those days chronologically.
 * - Distribute the chapter's nodes across days using metrics.totalDecisions as the count.
 * - If totalDecisions doesn't perfectly match the node count, assign remaining nodes
 *   to the last day (or first day if only one day maps to the chapter).
 *
 * Run: node scripts/add-dayids-to-nodes.cjs
 */

const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'src', 'data');

// Map of project file → metrics file and days export name
const PROJECT_MAP = [
  { project: 'metaProject.ts', metrics: 'metaMetrics.ts', daysExport: 'metaDays' },
  { project: 'bipProject.ts', metrics: 'bipMetrics.ts', daysExport: 'bipDays' },
  { project: 'remnantsProject.ts', metrics: 'remnantsMetrics.ts', daysExport: 'remnantsDays' },
  { project: 'itemBGoneProject.ts', metrics: 'itemBGoneMetrics.ts', daysExport: 'ibgDays' },
  { project: 'vulnBankProject.ts', metrics: 'vulnBankMetrics.ts', daysExport: 'vbDays' },
  { project: 'landingProject.ts', metrics: 'landingMetrics.ts', daysExport: 'landingDays' },
  { project: 'feedbackCaptureProject.ts', metrics: 'feedbackCaptureMetrics.ts', daysExport: 'fcDays' },
];

// Parse date like "Feb 26" or "Mar 3" into a sortable number (month*100 + day)
function parseDateKey(dateStr) {
  const months = { Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6, Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12 };
  const parts = dateStr.trim().split(/\s+/);
  const month = months[parts[0]] || 0;
  const day = parseInt(parts[1], 10) || 0;
  return month * 100 + day;
}

// Extract DayEntry data from metrics file using regex (avoid eval/import)
function extractDays(metricsContent, daysExport) {
  // Find the array declaration
  const startPattern = `export const ${daysExport}`;
  const startIdx = metricsContent.indexOf(startPattern);
  if (startIdx === -1) {
    console.warn(`  Warning: Could not find ${daysExport} in metrics file`);
    return [];
  }

  // Find the array content — skip past "DayEntry[] = ["
  const eqSign = metricsContent.indexOf('=', startIdx);
  const arrayStart = metricsContent.indexOf('[', eqSign);
  if (arrayStart === -1) return [];

  // We need to extract each day entry's date, chapterId, and totalDecisions
  // Use a simpler regex approach - find each { date: ..., chapterId: ..., metrics: { totalDecisions: ... } }
  const days = [];
  const content = metricsContent.slice(arrayStart);

  // Match each top-level object in the array by finding date and chapterId
  const dateRegex = /date:\s*'([^']+)'/g;
  const chapterIdRegex = /chapterId:\s*'([^']+)'/g;
  const totalDecRegex = /totalDecisions:\s*(\d+)/g;
  const titleRegex = /title:\s*'([^']+)'/g;
  const phaseRegex = /phase:\s*'([^']+)'/g;

  // Split by top-level objects using brace depth tracking.
  // content starts at the '[' of the array. We track only {} depth.
  const entries = [];
  let braceDepth = 0;
  let entryStart = -1;
  // Skip past the opening '['
  const innerStart = 1;

  for (let i = innerStart; i < content.length; i++) {
    const ch = content[i];
    if (ch === '{') {
      if (braceDepth === 0) entryStart = i;
      braceDepth++;
    } else if (ch === '}') {
      braceDepth--;
      if (braceDepth === 0 && entryStart !== -1) {
        entries.push(content.slice(entryStart, i + 1));
        entryStart = -1;
      }
    } else if (ch === ']' && braceDepth === 0) {
      break; // end of outer array
    }
  }

  for (const entry of entries) {
    const dateMatch = /date:\s*'([^']+)'/.exec(entry);
    const chapterIdMatch = /chapterId:\s*'([^']+)'/.exec(entry);
    const totalDecMatch = /totalDecisions:\s*(\d+)/.exec(entry);
    const titleMatch = /title:\s*'([^']*)'/.exec(entry);
    const phaseMatch = /phase:\s*'([^']+)'/.exec(entry);

    if (dateMatch && chapterIdMatch && totalDecMatch) {
      days.push({
        date: dateMatch[1],
        chapterId: chapterIdMatch[1],
        totalDecisions: parseInt(totalDecMatch[1], 10),
        title: titleMatch ? titleMatch[1] : undefined,
        phase: phaseMatch ? phaseMatch[1] : undefined,
      });
    }
  }

  return days;
}

// Extract chapter IDs and their node counts from project file
function extractChapters(projectContent) {
  const chapters = [];
  // Find each chapter block by looking for id: and nodes: array
  const chapterIdRegex = /id:\s*'([^']+)',\s*\n\s*name:/g;
  let match;
  while ((match = chapterIdRegex.exec(projectContent)) !== null) {
    chapters.push({ id: match[1], position: match.index });
  }
  return chapters;
}

// Count nodes in a chapter by finding node id patterns between two chapter positions
function countNodesInChapter(projectContent, chapterStart, nextChapterStart) {
  const slice = projectContent.slice(chapterStart, nextChapterStart || undefined);
  const nodeIds = slice.match(/id:\s*'[^']+',\s*\n\s*type:/g);
  return nodeIds ? nodeIds.length : 0;
}

function processProject(entry) {
  const projectPath = path.join(dataDir, entry.project);
  const metricsPath = path.join(dataDir, entry.metrics);

  let projectContent = fs.readFileSync(projectPath, 'utf-8');
  const metricsContent = fs.readFileSync(metricsPath, 'utf-8');

  console.log(`\nProcessing ${entry.project}...`);

  // Extract days from metrics
  const days = extractDays(metricsContent, entry.daysExport);
  console.log(`  Found ${days.length} day entries`);

  if (days.length === 0) {
    console.warn(`  Skipping: no days found`);
    return;
  }

  // Build chapter → days map (sorted chronologically)
  const chapterDaysMap = {};
  for (const day of days) {
    if (!chapterDaysMap[day.chapterId]) {
      chapterDaysMap[day.chapterId] = [];
    }
    chapterDaysMap[day.chapterId].push(day);
  }

  // Sort each chapter's days chronologically
  for (const chId of Object.keys(chapterDaysMap)) {
    chapterDaysMap[chId].sort((a, b) => parseDateKey(a.date) - parseDateKey(b.date));
  }

  // Now add dayId to each node in the project file.
  // Strategy: for each node (identified by `id: '...', type: '...'`),
  // determine which chapter it belongs to by position in file,
  // then assign the right dayId based on the day distribution.

  // First, find all chapter boundaries
  const chapterPattern = /id:\s*'([^']+)',\s*\n\s*name:\s*'[^']*',\s*\n\s*period:/g;
  const chapterPositions = [];
  let m;
  while ((m = chapterPattern.exec(projectContent)) !== null) {
    chapterPositions.push({ id: m[1], pos: m.index });
  }

  // For each chapter, find its nodes and assign dayIds
  let totalAssigned = 0;
  let offset = 0; // track how much the content shifts as we insert dayId

  for (let ci = 0; ci < chapterPositions.length; ci++) {
    const chapter = chapterPositions[ci];
    const nextChapter = chapterPositions[ci + 1];
    const chapterSliceEnd = nextChapter ? nextChapter.pos + offset : projectContent.length;
    const chapterSliceStart = chapter.pos + offset;

    const chapterDays = chapterDaysMap[chapter.id];
    if (!chapterDays || chapterDays.length === 0) {
      // No day data for this chapter — use chapter period to extract a date
      // Parse period from the chapter definition
      const periodMatch = /period:\s*'([^']+)'/.exec(projectContent.slice(chapterSliceStart, chapterSliceEnd));
      let fallbackDate = 'Unknown';
      if (periodMatch) {
        // Extract first date from period like "Feb 26, 2026" or "Feb 26–28, 2026"
        const periodDateMatch = /^([A-Z][a-z]+ \d+)/.exec(periodMatch[1]);
        if (periodDateMatch) fallbackDate = periodDateMatch[1];
      }
      console.log(`  Chapter ${chapter.id}: no day entries, using fallback "${fallbackDate}"`);

      // Find all nodes in this chapter region and add dayId
      const chapterContent = projectContent.slice(chapterSliceStart, chapterSliceEnd);
      const nodePattern = /(\n\s+)(id:\s*'[^']+',\s*\n\s*type:\s*'[^']+',?)/g;
      let nodeMatch;
      const insertions = [];

      while ((nodeMatch = nodePattern.exec(chapterContent)) !== null) {
        const insertPos = chapterSliceStart + nodeMatch.index + nodeMatch[1].length + nodeMatch[2].length;
        // Check if dayId already exists right after the type line
        const afterType = projectContent.slice(insertPos, insertPos + 50);
        if (afterType.includes('dayId:')) continue;

        // Find the indentation from the id line
        const indent = nodeMatch[1]; // \n + whitespace
        insertions.push({
          pos: insertPos,
          text: `\n${indent.replace('\n', '')}dayId: '${fallbackDate}',`,
        });
      }

      // Apply insertions in reverse order to preserve positions
      for (let i = insertions.length - 1; i >= 0; i--) {
        const ins = insertions[i];
        projectContent = projectContent.slice(0, ins.pos) + ins.text + projectContent.slice(ins.pos);
        offset += ins.text.length;
        totalAssigned++;
      }
      continue;
    }

    // Distribute nodes across days by totalDecisions count
    const totalDecisions = chapterDays.reduce((sum, d) => sum + d.totalDecisions, 0);

    // Find all nodes in this chapter region
    const chapterContent = projectContent.slice(chapterSliceStart, chapterSliceEnd);
    const nodePattern = /(\n\s+)(id:\s*'[^']+',\s*\n\s*type:\s*'[^']+',?)/g;
    let nodeMatch;
    const nodes = [];

    while ((nodeMatch = nodePattern.exec(chapterContent)) !== null) {
      nodes.push({
        index: nodeMatch.index,
        fullMatch: nodeMatch[0],
        indent: nodeMatch[1],
        idType: nodeMatch[2],
        absPos: chapterSliceStart + nodeMatch.index + nodeMatch[1].length + nodeMatch[2].length,
      });
    }

    if (nodes.length === 0) continue;

    // Assign dayIds: distribute based on totalDecisions counts
    const assignments = [];
    let nodeIdx = 0;

    for (let di = 0; di < chapterDays.length; di++) {
      const day = chapterDays[di];
      let count = day.totalDecisions;

      // For the last day, assign all remaining nodes
      if (di === chapterDays.length - 1) {
        count = nodes.length - nodeIdx;
      }

      for (let j = 0; j < count && nodeIdx < nodes.length; j++) {
        assignments.push({ nodeIdx: nodeIdx, dayId: day.date });
        nodeIdx++;
      }
    }

    // If there are still unassigned nodes (shouldn't happen but safety), assign to last day
    while (nodeIdx < nodes.length) {
      assignments.push({ nodeIdx: nodeIdx, dayId: chapterDays[chapterDays.length - 1].date });
      nodeIdx++;
    }

    console.log(`  Chapter ${chapter.id}: ${nodes.length} nodes, ${chapterDays.length} days (${chapterDays.map(d => d.date).join(', ')})`);

    // Apply dayId insertions in reverse order
    for (let i = assignments.length - 1; i >= 0; i--) {
      const node = nodes[assignments[i].nodeIdx];
      const dayId = assignments[i].dayId;
      const insertPos = node.absPos;

      // Check if dayId already exists
      const afterType = projectContent.slice(insertPos, insertPos + 50);
      if (afterType.includes('dayId:')) continue;

      const indent = node.indent.replace('\n', '');
      const insertion = `\n${indent}dayId: '${dayId}',`;
      projectContent = projectContent.slice(0, insertPos) + insertion + projectContent.slice(insertPos);
      offset += insertion.length;
      totalAssigned++;
    }
  }

  console.log(`  Total nodes with dayId assigned: ${totalAssigned}`);
  fs.writeFileSync(projectPath, projectContent, 'utf-8');
  console.log(`  Written: ${entry.project}`);
}

// Run
console.log('=== T-4: Adding dayId to all decision tree nodes ===');
for (const entry of PROJECT_MAP) {
  processProject(entry);
}
console.log('\nDone!');

import {
  courses,
  getLearningItemUrl,
  modules,
  type Course,
  type LearningItem,
  type Module,
} from "@/lib/data";

export type SearchResult = {
  item: LearningItem;
  score: number;
  context: string;
  href: string;
};

type SearchRecord = {
  item: LearningItem;
  title: string;
  priority: string[];
  supporting: string[];
  context: string;
};

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenVariants(token: string) {
  const variants = new Set([token]);

  if (token.endsWith("ies") && token.length > 4) variants.add(`${token.slice(0, -3)}y`);
  if (token.endsWith("es") && token.length > 3) variants.add(token.slice(0, -2));
  if (token.endsWith("s") && token.length > 3) variants.add(token.slice(0, -1));

  return [...variants];
}

function tokenize(value: string) {
  return normalize(value).split(" ").filter(Boolean);
}

function fieldIncludesToken(field: string, token: string) {
  return tokenVariants(token).some((variant) => field.includes(variant));
}

function scoreFields(fields: string[], token: string, weight: number) {
  return fields.some((field) => fieldIncludesToken(field, token)) ? weight : 0;
}

function getItemContext(item: LearningItem) {
  if (item.type === "PATH") return `${item.courseIds.length} courses - ${item.totalDuration}`;
  if (item.type === "MODULE") return `Inside: ${item.parentCourseTitle}`;
  return `${item.practiceArea} - ${item.duration}`;
}

function buildRecord(item: LearningItem): SearchRecord {
  if (item.type === "COURSE") {
    return {
      item,
      title: normalize(item.title),
      priority: [item.practiceArea],
      supporting: [item.description, item.type, item.level, item.duration],
      context: getItemContext(item),
    };
  }

  if (item.type === "MODULE") {
    return {
      item,
      title: normalize(item.title),
      priority: [item.parentCourseTitle, item.practiceArea, item.tags.join(" ")],
      supporting: [item.description, item.type, item.level],
      context: getItemContext(item),
    };
  }

  const pathCourses = courses.filter((course: Course) => item.courseIds.includes(course.id));
  const pathModules = modules.filter((module: Module) => item.courseIds.includes(module.courseId));

  return {
    item,
    title: normalize(item.title),
    priority: [
      pathCourses.map((course) => `${course.title} ${course.practiceArea}`).join(" "),
      pathModules.map((module) => `${module.title} ${module.tags.join(" ")}`).join(" "),
    ],
    supporting: [item.description, item.type, item.level, item.totalDuration],
    context: getItemContext(item),
  };
}

function scoreRecord(record: SearchRecord, rawQuery: string) {
  const query = normalize(rawQuery);
  const tokens = tokenize(rawQuery);

  if (!query || tokens.length === 0) return 0;

  const priority = record.priority.map(normalize);
  const supporting = record.supporting.map(normalize);
  const allFields = [record.title, ...priority, ...supporting];
  const everyTokenMatches = tokens.every((token) => allFields.some((field) => fieldIncludesToken(field, token)));

  if (!everyTokenMatches) return 0;

  let score = 0;

  if (record.title === query) score += 1000;
  if (record.title.startsWith(query)) score += 800;
  if (record.title.includes(query)) score += 500;

  for (const token of tokens) {
    score += scoreFields([record.title], token, 120);
    score += scoreFields(priority, token, 60);
    score += scoreFields(supporting, token, 20);
  }

  if (record.item.type === "MODULE") score += 12;
  if (record.item.type === "COURSE") score += 8;
  if (record.item.type === "PATH") score += 4;

  return score;
}

export function searchLearningItems(items: LearningItem[], query: string): SearchResult[] {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return items.map((item) => ({ item, score: 0, context: getItemContext(item), href: getLearningItemUrl(item) }));

  return items
    .map((item) => {
      const record = buildRecord(item);
      return {
        item,
        score: scoreRecord(record, query),
        context: record.context,
        href: getLearningItemUrl(item),
      };
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title));
}

export type BrightspaceCourseOffering = {
  Identifier: string;
  Name: string;
  Code: string;
  IsActive: boolean;
  Description?: {
    Text?: string;
    Html?: string;
  };
  Path?: string;
  StartDate?: string | null;
  EndDate?: string | null;
  CourseTemplate?: {
    Identifier?: string;
    Name?: string;
    Code?: string;
  } | null;
  Semester?: unknown;
  Department?: {
    Identifier?: string;
    Name?: string;
    Code?: string;
  } | null;
};

/**
 * Maps Brightspace course metadata to a learning_items upsert payload.
 *
 * Only provider facts are included. Curated editorial fields
 * (practice_area, level, duration_label, status) are maintained directly in
 * Supabase and deliberately left out so a re-sync never overwrites them.
 */
export function mapBrightspaceCourseToLearningItem(course: BrightspaceCourseOffering) {
  const orgUnitId = course.Identifier;
  const baseUrl = process.env.BRIGHTSPACE_BASE_URL || "";
  const path = course.Path || `/d2l/home/${orgUnitId}`;
  const brightspaceUrl = path.startsWith("http") ? path : `${baseUrl}/d2l/home/${orgUnitId}`;

  return {
    provider: "brightspace",
    provider_course_id: orgUnitId,
    provider_module_id: null,
    item_type: "course",
    title: course.Name,
    description: course.Description?.Text || null,
    brightspace_url: brightspaceUrl,
    metadata: {
      brightspaceName: course.Name,
      brightspaceCode: course.Code,
      isActive: course.IsActive,
      path: course.Path,
      startDate: course.StartDate,
      endDate: course.EndDate,
      courseTemplate: course.CourseTemplate,
      semester: course.Semester,
      department: course.Department,
    },
    synced_at: new Date().toISOString(),
  };
}

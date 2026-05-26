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

export function mapBrightspaceCourseToLearningItem(course: BrightspaceCourseOffering) {
  const orgUnitId = course.Identifier;
  const path = course.Path || `/d2l/home/${orgUnitId}`;
  const brightspaceUrl = path.startsWith("http")
    ? path
    : `https://mlri.brightspace.com/d2l/home/${orgUnitId}`;

  return {
    provider: "brightspace",
    provider_course_id: orgUnitId,
    provider_module_id: null,
    item_type: "course",
    title: orgUnitId === "6703" ? "Eviction Defense: The First 48 Hours" : course.Name,
    description:
      course.Description?.Text ||
      "Synced from Brightspace course metadata during the connection spike.",
    practice_area: orgUnitId === "6703" ? "Housing" : null,
    level: "Foundations",
    duration_label: orgUnitId === "6703" ? "12 min" : null,
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

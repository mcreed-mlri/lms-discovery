import type { Course, Module } from "@/lib/data";

type Theme = {
  rail: string;
  border: string;
  hoverBorder: string;
  chip: string;
  dot: string;
  progress: string;
};

const themes: Record<string, Theme> = {
  "professional-foundations": {
    rail: "before:bg-blue-500",
    border: "border-blue-100",
    hoverBorder: "hover:border-blue-300",
    chip: "border-blue-200 bg-blue-50 text-blue-700",
    dot: "bg-blue-500",
    progress: "bg-blue-500",
  },
  "client-centered-practice": {
    rail: "before:bg-emerald-500",
    border: "border-emerald-100",
    hoverBorder: "hover:border-emerald-300",
    chip: "border-emerald-200 bg-emerald-50 text-emerald-700",
    dot: "bg-emerald-500",
    progress: "bg-emerald-500",
  },
  "first-steps-in-court": {
    rail: "before:bg-amber-500",
    border: "border-amber-100",
    hoverBorder: "hover:border-amber-300",
    chip: "border-amber-200 bg-amber-50 text-amber-700",
    dot: "bg-amber-500",
    progress: "bg-amber-500",
  },
};

const fallbackTheme: Theme = {
  rail: "before:bg-slate-400",
  border: "border-slate-200",
  hoverBorder: "hover:border-sky-200",
  chip: "border-slate-200 bg-slate-50 text-slate-600",
  dot: "bg-slate-400",
  progress: "bg-mlri-blue",
};

export function getCourseTheme(courseId: string) {
  return themes[courseId] ?? fallbackTheme;
}

export function getCourseId(item: Course | Module) {
  return "courseId" in item ? item.courseId : item.id;
}

export function getCourseLabel(course: Course) {
  const labels: Record<string, string> = {
    "professional-foundations": "Foundations",
    "client-centered-practice": "Client Communication",
    "first-steps-in-court": "Court Skills",
  };

  return labels[course.id] ?? course.title;
}

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
  "brightspace-wrapper-demo": {
    rail: "before:bg-[#7f6a3c]",
    border: "border-[#d1c19b]",
    hoverBorder: "hover:border-[#7f6a3c]",
    chip: "border-[#d1c19b] bg-[#efe6d0] text-[#6d5628]",
    dot: "bg-[#7f6a3c]",
    progress: "bg-[#7f6a3c]",
  },
  "professional-foundations": {
    rail: "before:bg-[#b88a2d]",
    border: "border-[#d9c69d]",
    hoverBorder: "hover:border-[#b88a2d]",
    chip: "border-[#d9c69d] bg-[#f5ead0] text-[#8a6218]",
    dot: "bg-[#b88a2d]",
    progress: "bg-[#b88a2d]",
  },
  "client-centered-practice": {
    rail: "before:bg-[#6f927b]",
    border: "border-[#bdd0c1]",
    hoverBorder: "hover:border-[#6f927b]",
    chip: "border-[#bdd0c1] bg-[#e7efe7] text-[#496f54]",
    dot: "bg-[#6f927b]",
    progress: "bg-[#6f927b]",
  },
  "first-steps-in-court": {
    rail: "before:bg-[#b76545]",
    border: "border-[#dfb8a7]",
    hoverBorder: "hover:border-[#b76545]",
    chip: "border-[#dfb8a7] bg-[#f4e3da] text-[#8d472e]",
    dot: "bg-[#b76545]",
    progress: "bg-[#b76545]",
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
    "brightspace-wrapper-demo": "Wrapper Demo",
    "professional-foundations": "Foundations",
    "client-centered-practice": "Client Communication",
    "first-steps-in-court": "Court Skills",
  };

  return labels[course.id] ?? course.title;
}

import { ArrowIcon } from "@/components/icons";
import { hearsaySkills } from "@/lib/binder";

/** The Hearsay pilot opened up to its five skills, so an advocate can jump to
 *  the one their case needs. Skills not built yet say so and are not links. */
export function HearsaySkills() {
  return (
    <ol aria-label="Hearsay skills" className="mt-3 flex flex-col gap-2">
      {hearsaySkills.map((skill, index) => {
        const number = (
          <span
            aria-hidden="true"
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[13px] font-bold ${
              skill.status === "open"
                ? "bg-[color:var(--ink)] text-[color:var(--paper)]"
                : "border-2 border-[color:var(--line-strong)] text-[color:var(--ink-soft)]"
            }`}
          >
            {index + 1}
          </span>
        );
        if (skill.status === "open" && skill.href) {
          return (
            <li key={skill.title}>
              <a
                href={skill.href}
                className="group flex min-h-14 items-center gap-4 rounded-[12px] border-[1.5px] border-[color:var(--ink)] px-4 py-3 transition hover:bg-[color:var(--hover-tint)] focus-ring"
              >
                {number}
                <span className="min-w-0 flex-1">
                  <span className="block text-[16px] font-extrabold text-[color:var(--ink)]">
                    {skill.title}
                  </span>
                  <span className="block text-[13px] text-[color:var(--ink-muted)]">
                    Open now · practice · {skill.minutes} min
                  </span>
                </span>
                <span className="inline-flex shrink-0 items-center gap-1 text-[14px] font-bold text-[color:var(--brand-ink)]">
                  Open
                  <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </a>
            </li>
          );
        }
        return (
          <li key={skill.title} className="flex min-h-11 items-center gap-4 px-4 py-1.5">
            {number}
            <span className="min-w-0 flex-1 text-[15px] font-semibold text-[color:var(--ink-muted)]">
              {skill.title}
            </span>
            <span className="shrink-0 text-[13px] text-[color:var(--ink-soft)]">Coming</span>
          </li>
        );
      })}
    </ol>
  );
}

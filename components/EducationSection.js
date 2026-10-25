import Reveal from "@/components/Reveal";

export default function EducationSection({ items }) {
  if (!items || items.length === 0) return null;

  return (
    <section id="pendidikan" className="mx-auto max-w-5xl px-6 py-20">
      <Reveal>
        <p className="font-display text-xs tracking-[0.2em] text-magenta">
          Pendidikan
        </p>
        <h2 className="mt-2 font-display text-2xl font-semibold text-ink sm:text-3xl">
          Latar belakang pendidikan
        </h2>
      </Reveal>

      <div className="mt-10 space-y-6 border-l border-line pl-8">
        {items.map((item, i) => (
          <Reveal key={item.id} delay={i * 0.08} className="relative">
            <span className="absolute -left-[41px] top-6 flex h-4 w-4 items-center justify-center rounded-full border border-cyan bg-void">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan" />
            </span>

            <div className="glow-border rounded-2xl bg-surface p-5 sm:p-6">
              {item.period ? (
                <p className="text-xs font-medium text-cyan">{item.period}</p>
              ) : null}
              <h3 className="mt-1 font-display text-lg font-semibold text-ink">
                {item.institution}
              </h3>
              <p className="mt-1 text-sm text-ink/90">{item.degree}</p>
              {item.description ? (
                <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted">
                  {item.description}
                </p>
              ) : null}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

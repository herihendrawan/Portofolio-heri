import Image from "next/image";
import { Award, ExternalLink } from "lucide-react";
import Reveal from "@/components/Reveal";

export default function CertificatesSection({ items }) {
  if (!items || items.length === 0) return null;

  return (
    <section id="sertifikat" className="mx-auto max-w-5xl px-6 py-20">
      <Reveal>
        <p className="font-display text-xs tracking-[0.2em] text-magenta">
          Sertifikat
        </p>
        <h2 className="mt-2 font-display text-2xl font-semibold text-ink sm:text-3xl">
          Sertifikasi &amp; pelatihan
        </h2>
      </Reveal>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => (
          <Reveal key={item.id} delay={(i % 3) * 0.08} className="h-full">
            <div className="glow-border flex h-full flex-col overflow-hidden rounded-2xl bg-surface">
              <div className="relative aspect-[16/10] w-full bg-surface-2">
                {item.image_url ? (
                  <Image
                    src={item.image_url}
                    alt={item.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-muted">
                    <Award size={32} />
                  </div>
                )}
              </div>

              <div className="flex flex-1 flex-col gap-1 p-5">
                <h3 className="font-display text-base font-semibold text-ink">
                  {item.title}
                </h3>
                <p className="text-sm text-muted">
                  {item.issuer}
                  {item.issued_date ? ` · ${item.issued_date}` : ""}
                </p>
                {item.credential_url ? (
                  <a
                    href={item.credential_url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-auto inline-flex items-center gap-1.5 pt-3 text-xs text-cyan hover:underline"
                  >
                    Lihat kredensial <ExternalLink size={12} />
                  </a>
                ) : null}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

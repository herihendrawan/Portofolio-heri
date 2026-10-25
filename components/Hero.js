"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const line = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function Hero({
  eyebrow,
  headline,
  headlineHighlight,
  subtitle,
  ctaPrimaryLabel,
  ctaSecondaryLabel,
  photoUrl,
}) {
  return (
    <section className="relative overflow-hidden px-6 pt-16 pb-24 sm:pt-24">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -left-24 h-96 w-96 rounded-full bg-cyan/20 blur-[110px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-40 right-[-10%] h-80 w-80 rounded-full bg-magenta/15 blur-[110px]"
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className={`relative mx-auto grid max-w-5xl items-center gap-12 ${
          photoUrl ? "lg:grid-cols-[1.35fr_1fr]" : ""
        }`}
      >
        <div>
          <motion.p
            variants={line}
            className="mb-5 font-display text-sm tracking-[0.2em] text-cyan"
          >
            {eyebrow}
          </motion.p>

          <motion.h1
            variants={line}
            className="max-w-3xl font-display text-4xl font-semibold leading-[1.08] text-ink sm:text-5xl md:text-6xl"
          >
            {headline}{" "}
            <span className="glow-text-cyan text-cyan">{headlineHighlight}</span>
          </motion.h1>

          <motion.p
            variants={line}
            className="mt-6 max-w-xl whitespace-pre-line text-base text-muted sm:text-lg"
          >
            {subtitle}
          </motion.p>

          <motion.div
            variants={line}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <a
              href="#proyek"
              className="rounded-full bg-cyan px-6 py-3 text-sm font-semibold text-void transition-transform hover:scale-[1.03]"
            >
              {ctaPrimaryLabel}
            </a>
            <a
              href="#pendidikan"
              className="glow-border rounded-full px-6 py-3 text-sm font-semibold text-ink"
            >
              {ctaSecondaryLabel}
            </a>
          </motion.div>
        </div>

        {photoUrl ? (
          <motion.div
            variants={line}
            className="relative order-first mx-auto w-60 sm:w-72 lg:order-last lg:w-full lg:max-w-sm"
          >
            <div
              aria-hidden
              className="absolute -inset-3 rounded-[2rem] bg-linear-to-br from-cyan/40 via-transparent to-magenta/40 blur-xl"
            />
            <div className="glow-border relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-surface">
              <Image
                src={photoUrl}
                alt="Foto profil"
                fill
                priority
                sizes="(min-width: 1024px) 384px, 288px"
                className="object-cover"
              />
            </div>
          </motion.div>
        ) : null}
      </motion.div>
    </section>
  );
}

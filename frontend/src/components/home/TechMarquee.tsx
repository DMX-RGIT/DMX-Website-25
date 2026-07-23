"use client";

const techStack = [
  "PyTorch", "TensorFlow", "Hugging Face", "OpenCV", "scikit-learn",
  "LangChain", "FastAPI", "Next.js", "Docker", "PostgreSQL",
  "Pandas", "NumPy", "Keras", "CUDA", "Weights & Biases",
  "Jupyter", "Git", "Linux", "AWS", "Streamlit",
];

export function TechMarquee() {
  return (
    <section className="py-16 overflow-hidden border-y border-border-subtle">
      <div className="text-center mb-8">
        <p className="text-xs font-mono uppercase tracking-[0.2em] text-text-secondary">
          Technologies We Work With
        </p>
      </div>

      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-bg-primary to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-bg-primary to-transparent z-10 pointer-events-none" />

        {/* First row — scroll left */}
        <div className="flex gap-6 mb-4 animate-marquee-left">
          {[...techStack, ...techStack].map((tech, idx) => (
            <div
              key={`row1-${idx}`}
              className="shrink-0 px-5 py-2.5 rounded-full border border-border-default bg-bg-surface text-text-secondary text-sm font-mono whitespace-nowrap hover:border-brand-navy-light hover:text-text-primary transition-colors"
            >
              {tech}
            </div>
          ))}
        </div>

        {/* Second row — scroll right */}
        <div className="flex gap-6 animate-marquee-right">
          {[...techStack.slice().reverse(), ...techStack.slice().reverse()].map((tech, idx) => (
            <div
              key={`row2-${idx}`}
              className="shrink-0 px-5 py-2.5 rounded-full border border-border-default bg-bg-surface text-text-secondary text-sm font-mono whitespace-nowrap hover:border-brand-navy-light hover:text-text-primary transition-colors"
            >
              {tech}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

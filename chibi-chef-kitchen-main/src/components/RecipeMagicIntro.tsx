import { useEffect } from "react";
import type { ChefSteelRecipe } from "@/lib/chef-steel-recipes";

const chefMascot = "/mascot1.png";

type Props = {
  recipe: ChefSteelRecipe;
  onDone: () => void;
};

export function RecipeMagicIntro({ recipe, onDone }: Props) {
  useEffect(() => {
    const id = window.setTimeout(onDone, 1800);
    return () => window.clearTimeout(id);
  }, [onDone]);

  return (
    <main className="grid min-h-screen place-items-center bg-background px-4 py-10 font-nunito text-foreground">
      <section className="animate-scale-in w-full max-w-2xl rounded-[2.5rem] border-2 border-dashed border-secondary bg-card p-7 text-center shadow-[var(--shadow-cozy)] sm:p-10">
        <div className="relative mx-auto flex h-64 max-w-md items-end justify-center sm:h-72">
          <div className="absolute bottom-4 left-1/2 h-32 w-56 -translate-x-1/2 rounded-[45%] border-4 border-border bg-accent shadow-[var(--shadow-soft)]" aria-hidden>
            <div className="absolute -top-5 left-1/2 h-7 w-24 -translate-x-1/2 rounded-full border-4 border-border bg-card" />
            <div className="absolute left-1/2 top-7 -translate-x-1/2 text-5xl">🍲</div>
          </div>

          <img
            src={chefMascot}
            alt="Cute chef stirring a pot"
            width={768}
            height={768}
            className="relative z-10 h-56 w-56 animate-chef-bounce object-contain sm:h-64 sm:w-64"
          />

          <span className="absolute right-10 top-12 animate-bounce text-3xl sm:right-20">✨</span>
          <span className="absolute left-10 top-20 animate-pulse text-2xl sm:left-20">💨</span>
        </div>

        <p className="mt-3 text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground">
          Chef&apos;s kitchen
        </p>

        <h1 className="mt-2 font-fredoka text-3xl font-extrabold sm:text-4xl">
          {recipe.title}
        </h1>

        <div className="relative mx-auto mt-5 max-w-lg rounded-3xl bg-secondary px-6 py-4 text-sm font-semibold text-secondary-foreground shadow-[var(--shadow-soft)]">
          <span
            className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 bg-secondary"
            aria-hidden
          />
          <p>Chef is stirring the pot...</p>
          <p className="mt-1">Tasting, seasoning, sprinkling love 💛</p>
        </div>

        <div className="mt-5 flex items-center justify-center gap-2 text-sm font-bold text-primary">
          <span className="h-2 w-2 animate-pulse rounded-full bg-current" />
          <span className="h-2 w-2 animate-pulse rounded-full bg-current [animation-delay:150ms]" />
          <span className="h-2 w-2 animate-pulse rounded-full bg-current [animation-delay:300ms]" />
        </div>
      </section>
    </main>
  );
}

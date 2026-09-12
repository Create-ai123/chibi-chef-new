import { useEffect, useRef, useState } from "react";
import type { ChefSteelRecipe } from "@/lib/chef-steel-recipes";

const chefMascot = "/mascot1.png";

function mmss(total: number) {
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}

type Props = {
  recipe: ChefSteelRecipe;
  onBack: () => void;
  onToast: (message: string) => void;
  isSaved: (title: string, steps: string[]) => boolean;
  save: (entry: {
    title: string;
    description: string;
    ingredients: string[];
    steps: string[];
    time: number;
    method: string;
    difficulty: string;
    image?: string;
  }) => boolean;
};

export function ChefSteelRecipeDetail({ recipe, onBack, onToast, save, isSaved }: Props) {
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});
  const [checkedSteps, setCheckedSteps] = useState<Record<number, boolean>>({});
  const [seconds, setSeconds] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (seconds === null || seconds <= 0) return;
    timerRef.current = setInterval(() => {
      setSeconds((current) => (current === null ? null : Math.max(0, current - 1)));
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [seconds]);

  useEffect(() => {
    if (seconds === 0) onToast("Ding! 🔔 Your timer is done!");
  }, [seconds, onToast]);

  const saved = isSaved(recipe.title, recipe.steps);

  const saveRecipe = () => {
    if (saved) return;
    const didSave = save({
      title: recipe.title,
      description: recipe.tip,
      ingredients: recipe.ingredients,
      steps: recipe.steps,
      time: recipe.time,
      method: recipe.method,
      difficulty: recipe.difficulty,
      image: recipe.image,
    });
    if (didSave) onToast("Recipe saved! 🥰");
  };

  return (
    <main className="min-h-screen bg-background px-4 py-8 font-nunito text-foreground sm:px-6">
      <div className="mx-auto max-w-3xl">
        <section className="animate-scale-in overflow-hidden rounded-[2rem] border-2 border-dashed border-secondary bg-card shadow-[var(--shadow-cozy)]">
          <div className="bg-gradient-to-br from-secondary/60 via-card to-accent/50 p-5 sm:p-8">
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={onBack}
                className="rounded-full bg-muted px-4 py-2 font-fredoka text-sm font-bold shadow-[var(--shadow-soft)] transition-transform hover:scale-105 active:scale-95"
              >
                ← Back to Pantry
              </button>
              <button
                type="button"
                onClick={saveRecipe}
                disabled={saved}
                className={`rounded-full px-4 py-2 font-fredoka text-sm font-bold shadow-[var(--shadow-soft)] transition-transform hover:scale-105 active:scale-95 ${
                  saved ? "bg-muted text-muted-foreground" : "bg-primary text-primary-foreground"
                }`}
              >
                {saved ? "Saved Recipe ♥" : "♡ Save Recipe"}
              </button>
            </div>

            <div className="mt-6 text-center">
              <span className="rounded-full bg-mint px-3 py-1 font-fredoka text-xs font-bold text-secondary-foreground">
                {recipe.category} · {recipe.method}
              </span>
              <h1 className="mt-3 font-fredoka text-3xl font-extrabold leading-tight sm:text-4xl">
                {recipe.title}
              </h1>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <span className="rounded-full bg-accent px-3 py-1 font-fredoka text-xs font-bold text-accent-foreground">
                  ⏱️ {recipe.time} min
                </span>
                <span className="rounded-full bg-muted px-3 py-1 font-fredoka text-xs font-bold">
                  🍳 {recipe.method}
                </span>
                <span className="rounded-full bg-muted px-3 py-1 font-fredoka text-xs font-bold">
                  🟢 {recipe.difficulty}
                </span>
              </div>
            </div>

            <div className="mt-7 grid min-h-56 place-items-center overflow-hidden rounded-[1.75rem] border border-border bg-recipe p-6 shadow-[var(--shadow-soft)]">
              {recipe.image ? (
                <img src={recipe.image} alt={recipe.title} className="h-56 w-full rounded-2xl object-cover" />
              ) : (
                <div className="text-center">
                  <div className="text-8xl drop-shadow-sm sm:text-9xl">{recipe.emoji}</div>
                  <p className="mt-3 font-fredoka text-sm font-bold text-muted-foreground">
                    Add a food photo later in <code>public/recipes/</code> ✨
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-7 p-5 sm:p-8">
            <div>
              <h2 className="font-fredoka text-xl font-extrabold">Ingredients 🥕</h2>
              <p className="mt-1 text-xs text-muted-foreground">Tap each ingredient as you add it to your counter.</p>
              <ul className="mt-3 space-y-2">
                {recipe.ingredients.map((ingredient) => {
                  const checked = Boolean(checkedIngredients[ingredient]);
                  return (
                    <li key={ingredient}>
                      <button
                        type="button"
                        onClick={() => setCheckedIngredients((current) => ({ ...current, [ingredient]: !checked }))}
                        className={`flex w-full items-center gap-3 rounded-2xl border border-border px-4 py-3 text-left text-sm transition-all hover:scale-[1.01] ${
                          checked ? "bg-mint/60 text-muted-foreground line-through" : "bg-muted/50"
                        }`}
                      >
                        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-lg border border-border bg-card text-xs font-bold">
                          {checked ? "✓" : ""}
                        </span>
                        {ingredient}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div>
              <h2 className="font-fredoka text-xl font-extrabold">Let's cook! 👩‍🍳</h2>
              <ol className="mt-3 space-y-3">
                {recipe.steps.map((step, index) => {
                  const checked = Boolean(checkedSteps[index]);
                  return (
                    <li key={`${index}-${step}`}>
                      <button
                        type="button"
                        onClick={() => setCheckedSteps((current) => ({ ...current, [index]: !checked }))}
                        className={`flex w-full items-start gap-3 rounded-2xl border border-border px-4 py-3 text-left text-sm transition-all hover:scale-[1.01] ${
                          checked ? "bg-mint/60 text-muted-foreground line-through" : "bg-muted/50"
                        }`}
                      >
                        <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full font-fredoka text-xs font-bold ${checked ? "bg-mint" : "bg-primary text-primary-foreground"}`}>
                          {checked ? "✓" : index + 1}
                        </span>
                        <span className="pt-1">{step}</span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>

            <div className="rounded-3xl border-2 border-dashed border-secondary bg-secondary/40 p-4">
              <div className="flex items-start gap-3">
                <img src={chefMascot} alt="" className="h-16 w-16 object-contain" />
                <div>
                  <p className="font-fredoka text-xs font-bold uppercase tracking-widest text-muted-foreground">Chef's Thought 💭</p>
                  <p className="mt-1 text-sm font-medium">{recipe.tip}</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-muted/70 p-5 text-center">
              <h2 className="font-fredoka text-lg font-extrabold">Cooking Timer ⏱️</h2>
              <p className="mt-1 text-xs text-muted-foreground">Use this while you cook so the chef can keep time for you.</p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setSeconds(seconds === null || seconds === 0 ? recipe.time * 60 : null)}
                  className="rounded-full bg-primary px-5 py-3 font-fredoka text-sm font-bold text-primary-foreground shadow-[var(--shadow-soft)] transition-transform hover:scale-105 active:scale-95"
                >
                  {seconds !== null && seconds > 0 ? "Stop timer 🛑" : `Start ${recipe.time}-Min Timer`}
                </button>
                {seconds !== null && (
                  <span className="rounded-full bg-mint px-5 py-3 font-mono text-xl font-bold text-secondary-foreground">
                    {seconds > 0 ? mmss(seconds) : "Done! 🔔"}
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

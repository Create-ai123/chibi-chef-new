import "../styles.css";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ChefSteelRecipeDetail } from "@/components/ChefSteelRecipeDetail";
import { RecipeMagicIntro } from "@/components/RecipeMagicIntro";
import { RecipeBook } from "@/components/RecipeBook";
import { useRecipeBook } from "@/lib/recipe-book";
import {
  PANTRY_BY_CATEGORY,
  RECIPES,
  type ChefSteelRecipe,
  type MealCategory,
} from "@/lib/chef-steel-recipes";

const chefMascot = "/mascot1.png";
const chefFull = "/chibi-chef.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cozy Pantry Recipe Companion | Chef-Steel" },
      {
        name: "description",
        content:
          "Pick a meal, choose pantry ingredients, and discover cozy recipes you can cook at home.",
      },
      { property: "og:title", content: "Cozy Pantry Recipe Companion" },
      {
        property: "og:description",
        content: "A cute pantry-to-recipe helper for breakfast, lunch and dinner.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const CATEGORIES: { id: MealCategory; label: string; icon: string }[] = [
  { id: "Breakfast", label: "Breakfast", icon: "🍳" },
  { id: "Lunch", label: "Lunch", icon: "☀️" },
  { id: "Dinner", label: "Dinner", icon: "🌙" },
];

function RecipeGroup({
  title,
  subtitle,
  recipes,
  selected,
  recipeMatches,
  onChoose,
  showMissing = false,
  showMainIngredients = false,
}: {
  title: string;
  subtitle: string;
  recipes: ChefSteelRecipe[];
  selected: string[];
  recipeMatches: (recipe: ChefSteelRecipe, item: string) => boolean;
  onChoose: (recipe: ChefSteelRecipe) => void;
  showMissing?: boolean;
  showMainIngredients?: boolean;
}) {
  return (
    <div>
      <div className="mb-3">
        <h4 className="font-fredoka text-lg font-extrabold">{title}</h4>
        <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {recipes.map((recipe) => {
          const matched = selected
            .filter((item) => recipeMatches(recipe, item))
            .map((item) => prettyIngredient(item));
          const missing = recipe.keys
            .filter((key) => !selected.some((item) => recipeMatches(recipe, item)))
            .map(prettyIngredient);
          return (
            <button
              key={recipe.id}
              type="button"
              onClick={() => onChoose(recipe)}
              className="group overflow-hidden rounded-3xl border border-border bg-recipe text-left shadow-[var(--shadow-soft)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-cozy)] active:scale-[0.99]"
            >
              <div className="grid h-36 place-items-center bg-card text-7xl shadow-inner transition-transform group-hover:scale-[1.03]" aria-hidden>
                {recipe.emoji}
              </div>
              <div className="p-4">
                <h5 className="font-fredoka text-base font-extrabold leading-tight">{recipe.title}</h5>
                <p className="mt-1 text-xs text-foreground/75">⏱️ {recipe.time} min · {recipe.method} · 🟢 {recipe.difficulty}</p>
                {selected.length > 0 && (
                  <div className="mt-3 space-y-1.5 text-xs">
                    {matched.length > 0 && (
                      <p className="font-bold text-foreground">✓ Matches: {matched.join(", ")}</p>
                    )}
                    {showMissing && missing.length > 0 && (
                      <p className="font-bold text-primary">＋ Missing: {missing.join(", ")}</p>
                    )}
                    {showMainIngredients && (
                      <p className="font-bold text-foreground">🍽️ Main ingredients: {recipe.keys.join(", ")}</p>
                    )}
                  </div>
                )}
                <p className="mt-3 text-xs font-bold text-primary">Tap to cook →</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Index() {
  const [started, setStarted] = useState(false);
  const [typed, setTyped] = useState("");
  const [category, setCategory] = useState<MealCategory | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [custom, setCustom] = useState("");
  const [openRecipe, setOpenRecipe] = useState<ChefSteelRecipe | null>(null);
  const [showRecipeMagic, setShowRecipeMagic] = useState(false);
  const [showBook, setShowBook] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const { book, isSaved, save, update, remove } = useRecipeBook();

  const pantry = category ? PANTRY_BY_CATEGORY[category] : [];

  const symbolFor = (name: string) => {
    const found = Object.values(PANTRY_BY_CATEGORY)
      .flat()
      .find((item) => item.name.toLowerCase() === name.toLowerCase());
    return found?.symbol ?? "🥄";
  };

  const recipeMatches = (recipe: ChefSteelRecipe, item: string) => {
    const ingredient = item.trim().toLowerCase();
    return recipe.keys.some((key) => key === ingredient || ingredient.includes(key) || key.includes(ingredient));
  };

  const prettyIngredient = (key: string) => {
    const pantryItem = Object.values(PANTRY_BY_CATEGORY)
      .flat()
      .find((item) => item.name.toLowerCase() === key.toLowerCase());
    if (pantryItem) return pantryItem.name;
    return key.charAt(0).toUpperCase() + key.slice(1);
  };

  const recipeGroups = useMemo(() => {
    if (!category) {
      return { ready: [], other: [] } as { ready: ChefSteelRecipe[]; other: ChefSteelRecipe[] };
    }

    const categoryRecipes = RECIPES.filter((recipe) => recipe.category === category);
    if (selected.length === 0) {
      return { ready: categoryRecipes, other: [] };
    }

    const ready = categoryRecipes
      .filter((recipe) => selected.some((item) => recipeMatches(recipe, item)))
      .sort((a, b) => {
        const aMatches = selected.filter((item) => recipeMatches(a, item)).length;
        const bMatches = selected.filter((item) => recipeMatches(b, item)).length;
        return bMatches - aMatches;
      });

    // Other recipes must be completely different: they cannot contain any ingredient
    // the user selected. Keep them separate from the priority matching results.
    const other = categoryRecipes.filter(
      (recipe) => !selected.some((item) => recipeMatches(recipe, item)),
    );

    return { ready, other };
  }, [category, selected]);

  const filteredRecipes = [...recipeGroups.ready, ...recipeGroups.other];

  useEffect(() => {
    if (started) return;
    const intro = "Oh hi there! 🍳 Got random ingredients? Pick a meal and let's make something yummy!";
    let i = 0;
    setTyped("");
    const id = setInterval(() => {
      i += 1;
      setTyped(intro.slice(0, i));
      if (i >= intro.length) clearInterval(id);
    }, 18);
    return () => clearInterval(id);
  }, [started]);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 2300);
    return () => clearTimeout(id);
  }, [toast]);

  const changeCategory = (next: MealCategory) => {
    setCategory(next);
    setSelected([]);
    setCustom("");
    setOpenRecipe(null);
    setShowBook(false);
    window.setTimeout(() => document.getElementById("chef-pantry")?.scrollIntoView({ behavior: "smooth", block: "start" }), 40);
  };

  const toggleIngredient = (item: string) => {
    setSelected((current) =>
      current.includes(item) ? current.filter((value) => value !== item) : [...current, item],
    );
  };

  const addCustom = () => {
    const value = custom.trim();
    if (!value) return;
    if (!selected.some((item) => item.toLowerCase() === value.toLowerCase())) {
      setSelected((current) => [...current, value]);
    }
    setCustom("");
  };

  const chooseRecipe = (recipe: ChefSteelRecipe) => {
    setOpenRecipe(recipe);
    setShowRecipeMagic(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!started) {
    return (
      <main className="grid min-h-screen place-items-center bg-background px-4 py-10 font-nunito text-foreground">
        <section className="animate-scale-in w-full max-w-md rounded-[2.5rem] border-2 border-dashed border-secondary bg-card p-8 text-center shadow-[var(--shadow-cozy)]">
          <div className="mx-auto flex h-52 w-52 items-center justify-center sm:h-64 sm:w-64">
            <img src={chefMascot} alt="Cozy chef mascot smiling" width={768} height={768} className="h-48 w-48 object-contain sm:h-60 sm:w-60" />
          </div>
          <div className="relative mt-6 rounded-3xl bg-secondary px-5 py-4 text-left text-sm font-semibold text-secondary-foreground shadow-[var(--shadow-soft)]">
            <span className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 bg-secondary" aria-hidden />
            <p className="min-h-[3.5rem] font-nunito">
              {typed}
              <span className="ml-0.5 inline-block h-4 w-[2px] animate-pulse align-middle bg-current" />
            </p>
          </div>
          <button
            type="button"
            onClick={() => setStarted(true)}
            className="mt-6 w-full rounded-full bg-primary px-6 py-4 text-lg font-fredoka font-extrabold text-primary-foreground shadow-[var(--shadow-cozy)] transition-transform duration-200 hover:scale-105 active:scale-95"
          >
            Let&apos;s Cook! ✨
          </button>
        </section>
      </main>
    );
  }

  if (openRecipe && showRecipeMagic) {
    return (
      <RecipeMagicIntro
        recipe={openRecipe}
        onDone={() => setShowRecipeMagic(false)}
      />
    );
  }

  if (openRecipe) {
    return (
      <ChefSteelRecipeDetail
        recipe={openRecipe}
        onBack={() => { setOpenRecipe(null); setShowRecipeMagic(false); }}
        onToast={setToast}
        isSaved={isSaved}
        save={save}
      />
    );
  }

  return (
    <main className="min-h-screen bg-background px-4 py-8 font-nunito text-foreground sm:px-6">
      <div className="mx-auto flex max-w-3xl flex-col gap-5">
        <section className="animate-fade-in rounded-[2rem] border border-border bg-card p-5 shadow-[var(--shadow-cozy)] sm:p-7">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
            <img src={chefFull} alt="Cozy chef mascot holding a wooden spoon" width={768} height={768} className="h-24 w-24 shrink-0 object-contain sm:h-28 sm:w-28" />
            <div className="w-full flex-1">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Cozy Pantry</p>
                  <h1 className="font-fredoka text-2xl font-extrabold leading-tight sm:text-3xl">Recipe Companion 🍳</h1>
                </div>
                <button
                  type="button"
                  onClick={() => setShowBook(true)}
                  className="shrink-0 rounded-full bg-accent px-3 py-2 font-fredoka text-xs font-bold text-accent-foreground shadow-[var(--shadow-soft)] transition-transform hover:scale-105 active:scale-95"
                >
                  📖 My Recipe Book
                </button>
              </div>
              <div className="relative mt-3 rounded-3xl bg-secondary px-4 py-3 text-sm font-medium text-secondary-foreground shadow-[var(--shadow-soft)]">
                <span className="absolute -top-2 left-6 h-4 w-4 rotate-45 bg-secondary sm:-left-2 sm:top-5" aria-hidden />
                <p>{category ? `Yay! Let's make ${category.toLowerCase()}! Pick ingredients or browse the ready-to-cook recipes. 💛` : "Select a meal time and I'll whip up something delicious!"}</p>
              </div>
            </div>
          </div>

          <div className="mt-5 border-t border-border pt-5">
            <p className="mb-3 text-center text-xs font-bold uppercase tracking-widest text-muted-foreground">What are we cooking?</p>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {CATEGORIES.map((item) => {
                const active = category === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => changeCategory(item.id)}
                    aria-pressed={active}
                    className={`rounded-2xl border px-2 py-3 font-fredoka text-sm font-extrabold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)] active:scale-95 sm:px-4 sm:py-4 sm:text-base ${
                      active ? "border-transparent bg-primary text-primary-foreground shadow-[var(--shadow-soft)]" : "border-border bg-muted hover:bg-accent"
                    }`}
                  >
                    <span className="block text-xl sm:inline sm:mr-1">{item.icon}</span>{item.label}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {showBook ? (
          <RecipeBook
            book={book}
            mascotUrl={chefMascot}
            onUpdate={update}
            onRemove={remove}
            onToast={setToast}
            onBack={() => setShowBook(false)}
          />
        ) : !category ? (
          <section className="animate-fade-in rounded-[2rem] border-2 border-dashed border-secondary bg-card p-8 text-center shadow-[var(--shadow-cozy)]">
            <div className="text-5xl">🍽️</div>
            <h2 className="mt-3 font-fredoka text-xl font-extrabold">Choose Breakfast, Lunch or Dinner</h2>
            <p className="mt-2 text-sm text-muted-foreground">Once you choose, your pantry and ready-to-cook recipes will appear here.</p>
          </section>
        ) : (
          <section id="chef-pantry" className="animate-fade-in rounded-[2rem] border border-border bg-card p-5 shadow-[var(--shadow-cozy)] sm:p-7">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{category} pantry</p>
                <h2 className="font-fredoka text-xl font-extrabold">Select what&apos;s in your pantry 🧺</h2>
              </div>
              {selected.length > 0 && (
                <button type="button" onClick={() => setSelected([])} className="rounded-full bg-muted px-3 py-2 font-fredoka text-xs font-bold">Clear</button>
              )}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {pantry.map((item) => {
                const active = selected.includes(item.name);
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => toggleIngredient(item.name)}
                    aria-pressed={active}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-200 hover:scale-105 active:scale-95 ${
                      active ? "border-transparent bg-primary text-primary-foreground shadow-[var(--shadow-soft)]" : "border-border bg-muted text-foreground hover:bg-accent"
                    }`}
                  >
                    {item.symbol}&nbsp;{item.name}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex gap-2">
              <input
                value={custom}
                onChange={(event) => setCustom(event.target.value)}
                onKeyDown={(event) => event.key === "Enter" && addCustom()}
                placeholder="Add your own ingredient…"
                aria-label="Custom ingredient"
                className="min-w-0 flex-1 rounded-full border border-input bg-background px-4 py-2.5 text-sm outline-none transition focus:ring-2 focus:ring-ring"
              />
              <button type="button" onClick={addCustom} className="rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-accent-foreground transition-transform hover:scale-105 active:scale-95">Add +</button>
            </div>

            {selected.length > 0 && (
              <div className="mt-4 rounded-3xl border-2 border-dashed border-border bg-muted/60 p-4">
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Selected ingredients</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selected.map((item) => (
                    <button key={item} type="button" onClick={() => toggleIngredient(item)} className="rounded-full border border-secondary bg-secondary px-3 py-1.5 text-sm font-bold text-foreground shadow-[var(--shadow-soft)]">
                      {symbolFor(item)} {item} ×
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-7 border-t border-border pt-6">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Ready to cook</p>
                  <h3 className="font-fredoka text-xl font-extrabold">{selected.length ? "Recipes from your pantry ✨" : "A few cozy ideas for you"}</h3>
                </div>
                <span className="rounded-full bg-accent px-3 py-1 font-fredoka text-xs font-bold">{filteredRecipes.length} recipes</span>
              </div>

              {filteredRecipes.length === 0 ? (
                <div className="mt-4 rounded-3xl border-2 border-dashed border-secondary bg-secondary/30 p-6 text-center">
                  <div className="text-4xl">🥺</div>
                  <p className="mt-2 font-fredoka text-sm font-bold">Chef couldn&apos;t find a recipe for those ingredients.</p>
                  <p className="mt-1 text-xs text-muted-foreground">Try removing one ingredient or choose another meal category.</p>
                </div>
              ) : (
                <div className="mt-5 space-y-6">
                  {recipeGroups.ready.length > 0 && (
                    <RecipeGroup
                      title="Ready to cook"
                      subtitle="A few cozy ideas for you"
                      recipes={recipeGroups.ready}
                      selected={selected}
                      recipeMatches={recipeMatches}
                      onChoose={chooseRecipe}
                      showMissing
                    />
                  )}
                  {recipeGroups.other.length > 0 && (
                    <RecipeGroup
                      title="Other recipes 🍽️"
                      subtitle="Completely different recipes that don't use any ingredient you selected."
                      recipes={recipeGroups.other}
                      selected={selected}
                      recipeMatches={recipeMatches}
                      onChoose={chooseRecipe}
                      showMainIngredients
                    />
                  )}
                </div>
              )}
            </div>
          </section>
        )}

        <footer className="pb-6 text-center text-xs text-muted-foreground">Made with love · Your chef says: eat something warm today 💛</footer>
      </div>

      <div
        aria-live="polite"
        className={`fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-primary px-5 py-2.5 font-fredoka text-sm font-bold text-primary-foreground shadow-[var(--shadow-cozy)] transition-all duration-300 ${toast ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"}`}
      >
        {toast}
      </div>
    </main>
  );
}

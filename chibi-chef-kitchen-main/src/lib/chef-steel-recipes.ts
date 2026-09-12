export type MealCategory = "Breakfast" | "Lunch" | "Dinner";

export type ChefSteelRecipe = {
  id: string;
  title: string;
  category: MealCategory;
  emoji: string;
  image?: string;
  time: number;
  method: string;
  difficulty: "Beginner" | "Easy" | "Medium";
  keys: string[];
  ingredients: string[];
  steps: string[];
  tip: string;
};

export type PantryItem = {
  name: string;
  symbol: string;
};

export const PANTRY_BY_CATEGORY: Record<MealCategory, PantryItem[]> = {
  Breakfast: [
    { name: "Eggs", symbol: "🥚" },
    { name: "Bread", symbol: "🍞" },
    { name: "Milk", symbol: "🥛" },
    { name: "Bananas", symbol: "🍌" },
    { name: "Oats", symbol: "🥣" },
    { name: "Flour", symbol: "🌾" },
    { name: "Cheese", symbol: "🧀" },
    { name: "Tomatoes", symbol: "🍅" },
  ],
  Lunch: [
    { name: "Rice", symbol: "🍚" },
    { name: "Eggs", symbol: "🥚" },
    { name: "Tomatoes", symbol: "🍅" },
    { name: "Bread", symbol: "🍞" },
    { name: "Cheese", symbol: "🧀" },
    { name: "Flour", symbol: "🌾" },
    { name: "Milk", symbol: "🥛" },
    { name: "Bananas", symbol: "🍌" },
  ],
  Dinner: [
    { name: "Rice", symbol: "🍚" },
    { name: "Eggs", symbol: "🥚" },
    { name: "Tomatoes", symbol: "🍅" },
    { name: "Bread", symbol: "🍞" },
    { name: "Cheese", symbol: "🧀" },
    { name: "Oats", symbol: "🥣" },
    { name: "Flour", symbol: "🌾" },
    { name: "Milk", symbol: "🥛" },
  ],
};

export const RECIPES: ChefSteelRecipe[] = [
  {
    id: "banana-oat-pancakes",
    title: "Banana Oat Pancakes 🥞",
    category: "Breakfast",
    emoji: "🥞",
    time: 15,
    method: "Stovetop",
    difficulty: "Easy",
    keys: ["bananas", "oats", "milk"],
    ingredients: ["1 ripe banana", "1/2 cup oats", "1/3 cup milk", "Pinch of salt", "A little oil for the pan"],
    steps: [
      "Mash the banana in a bowl until mostly smooth.",
      "Stir in oats, milk and a tiny pinch of salt.",
      "Warm a lightly oiled pan over medium heat.",
      "Spoon small pancakes into the pan and cook until bubbles appear.",
      "Flip, cook the other side, and serve warm.",
    ],
    tip: "Keep the pancakes small — they are much easier to flip!",
  },
  {
    id: "cheesy-egg-toast",
    title: "Cheesy Egg Toast 🍳",
    category: "Breakfast",
    emoji: "🍳",
    time: 10,
    method: "Stovetop",
    difficulty: "Beginner",
    keys: ["eggs", "bread", "cheese"],
    ingredients: ["2 eggs", "2 slices bread", "2 slices cheese", "1 tsp butter or oil", "Salt & pepper"],
    steps: [
      "Whisk the eggs with a pinch of salt and pepper.",
      "Dip the bread lightly into the egg mixture.",
      "Cook the bread in a warm pan until golden on both sides.",
      "Add cheese on top and cover the pan for a minute.",
      "Serve when the cheese is soft and melty.",
    ],
    tip: "A lid helps the cheese melt without over-browning the toast.",
  },
  {
    id: "chocolate-oat-mug-cake",
    title: "Chocolate Oat Mug Cake 🍫",
    category: "Breakfast",
    emoji: "🍫",
    time: 5,
    method: "Microwave",
    difficulty: "Beginner",
    keys: ["oats", "milk"],
    ingredients: ["4 tbsp oats", "5 tbsp milk", "1 tbsp chocolate syrup", "Pinch of salt"],
    steps: [
      "Crush the oats a little so they soften faster.",
      "Mix oats, milk, chocolate syrup and salt in a large mug.",
      "Microwave for 90 seconds.",
      "Stir, then microwave for another 20–30 seconds if needed.",
      "Let it rest for a minute before eating.",
    ],
    tip: "Use a mug twice the size of your batter so it has room to rise.",
  },
  {
    id: "tomato-cheese-toast",
    title: "Cozy Tomato Cheese Toast 🍅",
    category: "Lunch",
    emoji: "🍅",
    time: 10,
    method: "Stovetop",
    difficulty: "Beginner",
    keys: ["tomatoes", "bread", "cheese"],
    ingredients: ["2 slices bread", "1 tomato", "2 slices cheese", "1 tsp oil", "Salt & pepper"],
    steps: [
      "Toast the bread in a dry pan until crisp.",
      "Chop the tomato and cook it with a little oil for a few minutes.",
      "Season the tomato with salt and pepper.",
      "Pile the tomato onto the toast and add cheese.",
      "Cover the pan briefly until the cheese melts.",
    ],
    tip: "A tiny pinch of sugar can balance very tangy tomatoes.",
  },
  {
    id: "speedy-egg-fried-rice",
    title: "Speedy Egg Fried Rice 🍚",
    category: "Lunch",
    emoji: "🍚",
    time: 10,
    method: "Stovetop",
    difficulty: "Easy",
    keys: ["rice", "eggs"],
    ingredients: ["1.5 cups cooked rice", "2 eggs", "1 tbsp oil", "Salt & pepper"],
    steps: [
      "Heat oil in a pan over medium-high heat.",
      "Scramble the eggs quickly, then push them to one side.",
      "Add the rice and stir-fry for about 3 minutes.",
      "Mix the eggs and rice together.",
      "Season and serve hot.",
    ],
    tip: "Cold day-old rice usually fries up fluffier than fresh rice.",
  },
  {
    id: "tiny-pantry-crepes",
    title: "Tiny Pantry Crepes 🥞",
    category: "Lunch",
    emoji: "🥞",
    time: 15,
    method: "Stovetop",
    difficulty: "Easy",
    keys: ["flour", "milk", "eggs"],
    ingredients: ["1/2 cup flour", "3/4 cup milk", "1 egg", "Pinch of sugar", "Pinch of salt"],
    steps: [
      "Whisk everything into a smooth, thin batter.",
      "Rest the batter for 5 minutes while the pan heats.",
      "Pour a thin layer into a lightly greased pan.",
      "Cook for about 1 minute, then flip and cook the other side.",
      "Fill with banana slices or your favorite topping.",
    ],
    tip: "Crepe batter should be runny enough to spread quickly around the pan.",
  },
  {
    id: "cheesy-rice-bowl",
    title: "Cozy Cheesy Rice Bowl 🧀",
    category: "Dinner",
    emoji: "🧀",
    time: 15,
    method: "Stovetop",
    difficulty: "Beginner",
    keys: ["rice", "cheese", "tomatoes"],
    ingredients: ["1.5 cups cooked rice", "1 tomato", "1/3 cup grated cheese", "1 tsp oil", "Salt & pepper"],
    steps: [
      "Warm oil in a pan and cook chopped tomato for 3–4 minutes.",
      "Add the cooked rice and stir until hot.",
      "Season with salt and pepper.",
      "Sprinkle cheese over the top.",
      "Cover for a minute, then fluff and serve.",
    ],
    tip: "Add the cheese at the very end so it stays soft and gooey.",
  },
  {
    id: "easy-tomato-rice",
    title: "Easy Tomato Rice 🍅",
    category: "Dinner",
    emoji: "🍚",
    time: 20,
    method: "Stovetop",
    difficulty: "Easy",
    keys: ["rice", "tomatoes"],
    ingredients: ["1.5 cups cooked rice", "2 tomatoes", "1 tbsp oil", "Salt & pepper", "Optional herbs"],
    steps: [
      "Heat oil in a pan over medium heat.",
      "Cook chopped tomatoes until soft and saucy.",
      "Season with salt, pepper and herbs if using.",
      "Fold in the cooked rice.",
      "Cook for another 2–3 minutes and serve warm.",
    ],
    tip: "Let the tomato cook down properly before adding rice for better flavor.",
  },
  {
    id: "golden-cheese-toastie",
    title: "Golden Cheese Toastie 🧀",
    category: "Dinner",
    emoji: "🥪",
    time: 5,
    method: "Stovetop",
    difficulty: "Beginner",
    keys: ["bread", "cheese"],
    ingredients: ["2 slices bread", "2 slices cheese", "Butter", "Pinch of pepper"],
    steps: [
      "Butter the outside of both bread slices.",
      "Place cheese between the slices.",
      "Toast in a pan for 2–3 minutes per side.",
      "Cover for a moment if the cheese needs help melting.",
      "Slice diagonally and serve hot.",
    ],
    tip: "The diagonal slice is scientifically proven by the chef to taste better. Probably.",
  },
  {
    id: "egg-tomato-rice",
    title: "Egg & Tomato Comfort Rice 🍳",
    category: "Dinner",
    emoji: "🍳",
    time: 15,
    method: "Stovetop",
    difficulty: "Easy",
    keys: ["eggs", "tomatoes", "rice"],
    ingredients: ["1 cup cooked rice", "2 eggs", "1 tomato", "1 tsp oil", "Salt & pepper"],
    steps: [
      "Cook chopped tomato in a little oil until soft.",
      "Add the rice and warm it through.",
      "Push the rice aside and scramble the eggs in the same pan.",
      "Mix everything together and season.",
      "Serve immediately while warm and cozy.",
    ],
    tip: "Keep the eggs slightly soft before mixing them into the rice.",
  },
];

export const getRecipeImage = (recipe: ChefSteelRecipe) => recipe.image ?? "";

export const normalizeKey = (value: string) => value.trim().toLowerCase();

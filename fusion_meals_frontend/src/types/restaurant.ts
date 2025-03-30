export interface Substitution {
  original: string;
  healthier: string;
}

export interface HealthierVersion {
  name: string;
  description: string;
  calories: number;
  costSavings: number;
  healthBenefits: string[];
  mainSubstitutions: Substitution[];
}

export interface BudgetVersion {
  name: string;
  description: string;
  costSavings: number;
  totalCost: number;
  valueIngredients: string[];
}

export interface QuickVersion {
  name: string;
  description: string;
  totalTime: number;
  timeSavings: number;
  shortcuts: string[];
}

export interface DishTransformation {
  id: string;
  originalName: string;
  restaurantName: string;
  estimatedCalories: number;
  estimatedCost: number;
  prepTime: number;
  cookTime: number;
  healthierVersion: HealthierVersion;
  budgetVersion: BudgetVersion;
  quickVersion: QuickVersion;
  image: string;
}

export interface SearchResponse {
  results: DishTransformation[];
  total: number;
} 
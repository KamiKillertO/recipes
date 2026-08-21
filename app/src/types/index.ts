export interface User {
  id: string;
  username: string;
}

export interface Ingredient {
  name: string;
  quantity: string;
  unit: string;
}

export interface Instruction {
  step_number: number;
  text: string;
}

export interface Recipe {
  id: string;
  user_id: string;
  title: string;
  description: string;
  image_url: string;
  servings: number;
  prep_time: number;
  cook_time: number;
  source_type: string;
  ingredients: Ingredient[];
  instructions: Instruction[];
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface CreateRecipeRequest {
  title: string;
  description: string;
  image_path?: string;
  servings: number;
  prep_time: number;
  cook_time: number;
  source_type: string;
  ingredients: Ingredient[];
  instructions: Instruction[];
  tags: string[];
}

export type UpdateRecipeRequest = Partial<CreateRecipeRequest>;

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    username: string;
    created_at: string;
  };
}
import { create } from 'zustand';
import { api } from '../lib/api';
import * as types from '../types';

interface RecipeState {
  recipes: types.Recipe[];
  selectedRecipe: types.Recipe | null;
  isLoading: boolean;
  error: string | null;
  fetchRecipes: () => Promise<void>;
  fetchRecipe: (id: string) => Promise<void>;
  createRecipe: (recipe: types.CreateRecipeRequest) => Promise<void>;
  updateRecipe: (id: string, recipe: types.UpdateRecipeRequest) => Promise<void>;
  deleteRecipe: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useRecipeStore = create<RecipeState>((set, get) => ({
  recipes: [],
  selectedRecipe: null,
  isLoading: false,
  error: null,

  fetchRecipes: async () => {
    set({ isLoading: true, error: null });
    try {
      const recipes = await api.getRecipes();
      set({ recipes, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch recipes',
        isLoading: false,
      });
    }
  },

  fetchRecipe: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const recipe = await api.getRecipe(id);
      set({ selectedRecipe: recipe, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch recipe',
        isLoading: false,
      });
    }
  },

  createRecipe: async (recipe: types.CreateRecipeRequest) => {
    set({ isLoading: true, error: null });
    try {
      await api.createRecipe(recipe);
      await get().fetchRecipes();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to create recipe',
        isLoading: false,
      });
      throw error;
    }
  },

  updateRecipe: async (id: string, recipe: types.UpdateRecipeRequest) => {
    set({ isLoading: true, error: null });
    try {
      await api.updateRecipe(id, recipe);
      await get().fetchRecipes();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update recipe',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteRecipe: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await api.deleteRecipe(id);
      const { recipes } = get();
      set({
        recipes: recipes.filter((r) => r.id !== id),
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete recipe',
        isLoading: false,
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
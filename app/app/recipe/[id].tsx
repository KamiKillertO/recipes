import { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRecipeStore } from '../../src/lib/recipeStore';

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { selectedRecipe, isLoading, fetchRecipe } = useRecipeStore();

  useEffect(() => {
    if (id) {
      fetchRecipe(id);
    }
  }, [id]);

  if (isLoading || !selectedRecipe) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2E7D32" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{selectedRecipe.title}</Text>
      <Text style={styles.description}>{selectedRecipe.description}</Text>
      <Text style={styles.meta}>
        Prep: {selectedRecipe.prep_time}min | Cook: {selectedRecipe.cook_time}min | Servings: {selectedRecipe.servings}
      </Text>
      
      <Text style={styles.sectionTitle}>Ingredients</Text>
      {selectedRecipe.ingredients.map((ing, i) => (
        <Text key={i} style={styles.item}>
          {ing.quantity} {ing.unit} {ing.name}
        </Text>
      ))}
      
      <Text style={styles.sectionTitle}>Instructions</Text>
      {selectedRecipe.instructions.map((inst, i) => (
        <Text key={i} style={styles.item}>
          {inst.step_number}. {inst.text}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FAFAFA',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
  },
  description: {
    fontSize: 16,
    color: '#757575',
    marginTop: 8,
  },
  meta: {
    fontSize: 14,
    color: '#757575',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#212121',
    marginTop: 24,
    marginBottom: 8,
  },
  item: {
    fontSize: 16,
    color: '#212121',
    marginBottom: 4,
  },
});
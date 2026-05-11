import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useRecipeStore } from '../../src/lib/recipeStore';

export default function NewRecipeScreen() {
  const router = useRouter();
  const { createRecipe, isLoading } = useRecipeStore();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [servings, setServings] = useState('4');
  const [prepTime, setPrepTime] = useState('15');
  const [cookTime, setCookTime] = useState('30');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a recipe title');
      return;
    }

    try {
      await createRecipe({
        title,
        description,
        servings: parseInt(servings) || 4,
        prep_time: parseInt(prepTime) || 0,
        cook_time: parseInt(cookTime) || 0,
        source_type: 'manual',
        ingredients: ingredients.split('\n').filter(i => i.trim()).map(i => ({
          name: i.trim(),
          quantity: '',
          unit: '',
        })),
        instructions: instructions.split('\n').filter(i => i.trim()).map((i, idx) => ({
          step_number: idx + 1,
          text: i.trim(),
        })),
        tags: [],
      });
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to create recipe');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Title *</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Recipe name" />
      
      <Text style={styles.label}>Description</Text>
      <TextInput style={styles.input} value={description} onChangeText={setDescription} placeholder="Short description" multiline />
      
      <View style={styles.row}>
        <View style={styles.half}>
          <Text style={styles.label}>Servings</Text>
          <TextInput style={styles.input} value={servings} onChangeText={setServings} keyboardType="numeric" />
        </View>
        <View style={styles.half}>
          <Text style={styles.label}>Prep (min)</Text>
          <TextInput style={styles.input} value={prepTime} onChangeText={setPrepTime} keyboardType="numeric" />
        </View>
        <View style={styles.half}>
          <Text style={styles.label}>Cook (min)</Text>
          <TextInput style={styles.input} value={cookTime} onChangeText={setCookTime} keyboardType="numeric" />
        </View>
      </View>
      
      <Text style={styles.label}>Ingredients (one per line)</Text>
      <TextInput style={[styles.input, styles.multiline]} value={ingredients} onChangeText={setIngredients} placeholder="1 cup flour&#10;2 eggs&#10;1 tsp salt" multiline numberOfLines={5} />
      
      <Text style={styles.label}>Instructions (one per line)</Text>
      <TextInput style={[styles.input, styles.multiline]} value={instructions} onChangeText={setInstructions} placeholder="Mix ingredients&#10;Bake at 350F" multiline numberOfLines={5} />
      
      <TouchableOpacity style={styles.button} onPress={handleSave} disabled={isLoading}>
        <Text style={styles.buttonText}>{isLoading ? 'Saving...' : 'Save Recipe'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FAFAFA',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 4,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  multiline: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  half: {
    flex: 1,
  },
  button: {
    backgroundColor: '#2E7D32',
    padding: 16,
    borderRadius: 8,
    marginTop: 24,
    marginBottom: 32,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
});
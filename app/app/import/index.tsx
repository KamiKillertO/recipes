import { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useRecipeStore } from '../../src/lib/recipeStore';
import { useAuthStore } from '../../src/lib/authStore';

export default function ImportScreen() {
  const router = useRouter();
  const { createRecipe } = useRecipeStore();
  const [image, setImage] = useState<string | null>(null);
  const [dividerX, setDividerX] = useState(50);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');

  const pickImage = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const processImage = async () => {
    if (!image) return;

    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('image', {
        uri: image,
        name: 'photo.jpg',
        type: 'image/jpeg',
      } as any);
      formData.append('divider_x', dividerX.toString());

      const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8080';
      const response = await fetch(`${API_URL}/api/ocr`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('OCR failed');
      }

      const data = await response.json();
      setIngredients(data.ingredients || '');
      setInstructions(data.instructions || '');
    } catch (error) {
      Alert.alert('Error', 'Failed to process image');
    } finally {
      setIsProcessing(false);
    }
  };

  const saveRecipe = async () => {
    if (!ingredients && !instructions) {
      Alert.alert('Error', 'No recipe data to save');
      return;
    }

    try {
      const ingredientLines = ingredients.split('\n').filter((l) => l.trim());
      const instructionLines = instructions.split('\n').filter((l) => l.trim());

      await createRecipe({
        title: 'Imported Recipe',
        description: 'Imported via OCR',
        servings: 4,
        prep_time: 0,
        cook_time: 0,
        source_type: 'ocr',
        ingredients: ingredientLines.map((name) => ({
          name: name.trim(),
          quantity: '',
          unit: '',
        })),
        instructions: instructionLines.map((text, i) => ({
          step_number: i + 1,
          text: text.trim(),
        })),
        tags: [],
      });

      router.push('/');
    } catch (error) {
      Alert.alert('Error', 'Failed to save recipe');
    }
  };

  if (ingredients || instructions) {
    return (
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Ingredients (Left)</Text>
        <View style={styles.editBox}>
          <TextInput
            style={styles.editText}
            value={ingredients}
            onChangeText={setIngredients}
            multiline
            placeholder="Enter ingredients..."
          />
        </View>

        <Text style={styles.sectionTitle}>Instructions (Right)</Text>
        <View style={styles.editBox}>
          <TextInput
            style={styles.editText}
            value={instructions}
            onChangeText={setInstructions}
            multiline
            placeholder="Enter instructions..."
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={saveRecipe}>
          <Text style={styles.buttonText}>Save Recipe</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!image ? (
        <TouchableOpacity style={styles.cameraButton} onPress={pickImage}>
          <Text style={styles.cameraText}>Take Photo</Text>
        </TouchableOpacity>
      ) : (
        <>
          <View style={styles.imageContainer}>
            <Image source={{ uri: image }} style={styles.image} resizeMode="contain" />
            <TouchableOpacity
              style={[styles.dividerLine, { left: `${dividerX}%` }]}
              onPressIn={(e) => {
                const x = e.nativeEvent.locationX;
                const percent = Math.min(100, Math.max(0, (x / 300) * 100));
                setDividerX(percent);
              }}
            >
              <View style={styles.dividerHandle} />
            </TouchableOpacity>
          </View>

          <View style={styles.sliderContainer}>
            <Text style={styles.sliderLabel}>Left: Ingredients</Text>
            <Text style={styles.sliderLabel}>Right: Instructions</Text>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.secondaryButton} onPress={pickImage}>
              <Text style={styles.secondaryButtonText}>Retake</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, isProcessing && styles.buttonDisabled]}
              onPress={processImage}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Process</Text>
              )}
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FAFAFA',
  },
  cameraButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2E7D32',
    borderRadius: 8,
  },
  cameraText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  imageContainer: {
    height: 400,
    backgroundColor: '#000',
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  dividerLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: '#FF6F00',
    marginLeft: -2,
  },
  dividerHandle: {
    position: 'absolute',
    top: '50%',
    left: -10,
    width: 20,
    height: 40,
    backgroundColor: '#FF6F00',
    borderRadius: 10,
    marginTop: -20,
  },
  sliderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  sliderLabel: {
    fontSize: 14,
    color: '#757575',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    backgroundColor: '#2E7D32',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#757575',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2E7D32',
  },
  secondaryButtonText: {
    color: '#2E7D32',
    fontSize: 16,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212121',
    marginTop: 16,
    marginBottom: 8,
  },
  editBox: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    minHeight: 120,
  },
  editText: {
    padding: 12,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
  },
});
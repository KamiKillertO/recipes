import { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, TextInput, ActivityIndicator, Text } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useRecipeStore } from '../../src/lib/recipeStore';
import { useAuthStore } from '../../src/lib/authStore';

export default function RecipesScreen() {
  const router = useRouter();
  const { recipes, isLoading, error, fetchRecipes } = useRecipeStore();
  const { isAuthenticated } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchRecipes();
    }
  }, [isAuthenticated]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchRecipes();
    setIsRefreshing(false);
  };

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <View style={styles.authPrompt}>
          <Link href="/login" style={styles.authLink}>
            <TouchableOpacity style={styles.loginButton}>
              <Link href="/login">Login to see your recipes</Link>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search recipes..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholderTextColor="#757575"
      />

      {isLoading && recipes.length === 0 ? (
        <ActivityIndicator size="large" color="#2E7D32" />
      ) : filteredRecipes.length === 0 ? (
        <View style={styles.emptyState}>
          <Link href="/recipe/new">
            <TouchableOpacity>
              <Text>No recipes yet. Tap to add your first recipe!</Text>
            </TouchableOpacity>
          </Link>
        </View>
      ) : (
        <FlatList
          data={filteredRecipes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Link href={`/recipe/${item.id}`}>
              <TouchableOpacity style={styles.recipeCard}>
                <View style={styles.recipeInfo}>
                  <Text style={styles.recipeTitle}>{item.title}</Text>
                  <Text style={styles.recipeMeta}>
                    {item.prep_time + item.cook_time} min • {item.servings} servings
                  </Text>
                </View>
              </TouchableOpacity>
            </Link>
          )}
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          contentContainerStyle={styles.listContent}
        />
      )}

      <Link href="/recipe/new" asChild>
        <TouchableOpacity style={styles.fab}>
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  searchInput: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
  },
  recipeCard: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  recipeInfo: {
    flex: 1,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212121',
  },
  recipeMeta: {
    fontSize: 14,
    color: '#757575',
    marginTop: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2E7D32',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fabText: {
    fontSize: 32,
    color: '#fff',
    marginTop: -2,
  },
  authPrompt: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  authLink: {
    color: '#2E7D32',
  },
  loginButton: {
    padding: 16,
  },
});
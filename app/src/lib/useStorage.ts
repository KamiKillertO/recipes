export async function setStorageItemAsync(key: string, value: string | null) {
  if (value === null) {
    localStorage.removeItem(key);
  } else {
    localStorage.setItem(key, value);
  }
}

export function useStorageState(key: string): [string | null, (value: string | null) => void] {
  const getItem = () => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  };

  const setItem = (value: string | null) => {
    try {
      if (value === null) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, value);
      }
    } catch {
      // silently fail - localStorage may be full/private
    }
  };

  return [getItem(), setItem];
}
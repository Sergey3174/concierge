export function getItemFromStore(key: string): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(key);
}

export function setItemInStore(key: string, value: string) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(key, value);
  }
}

export function removeItemFromStore(key: string) {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(key);
  }
}

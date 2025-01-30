export const saveToLocalStorage = (
  key: string,
  value: any,
  successText?: string
) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return { key, value, successText };
  } catch (error) {
    return error;
  }
};

export const getFromLocalStorage = (key: string, successText?: string) => {
  try {
    const item = localStorage.getItem(key);
    return item ? { item: JSON.parse(item), successText } : null;
  } catch (error) {
    return error;
  }
};

export const removeFromLocalStorage = (key: string, successText?: string) => {
  try {
    localStorage.removeItem(key);
    return { key, successText };
  } catch (error) {
    return error;
  }
};

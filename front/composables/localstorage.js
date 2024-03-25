const storePrefixe = "TIME_MANAGER";
let hasLocalStorage = null;
const fakeStorage = {};

const isSupported = () => {
  if (process.server || hasLocalStorage !== null) return hasLocalStorage;
  try {
    const key = "SUPPORT_TIME_MANAGER";
    localStorage.setItem(key, key);
    localStorage.removeItem(key);
    hasLocalStorage = true;
  } catch {
    hasLocalStorage = false;
    // TODO BUGSNAG
  }
  return hasLocalStorage;
};

const get = (field) => {
  if (isSupported()) {
    const item = localStorage.getItem(`${storePrefixe}-${field}`) ?? null;
    if (item) {
      return JSON.parse(item);
    }
  }
  return fakeStorage[field] ?? null;
};

const set = (field, data) => {
  if (isSupported()) {
    localStorage.setItem(`${storePrefixe}-${field}`, JSON.stringify(data));
  } else {
    fakeStorage[field] = data;
  }
};

const remove = (field) => {
  if (isSupported()) {
    localStorage.removeItem(`${storePrefixe}-${field}`);
  } else {
    delete fakeStorage[field];
  }
};

export const useLocaleStorage = {
  get,
  set,
  remove,
};

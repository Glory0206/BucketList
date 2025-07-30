let navigator = null;

export const setNavigator = (nav) => {
  navigator = nav;
};

export const goTo = (path) => {
  if (navigator) {
    navigator(path);
  } else {
    console.error('Navigator is not initialized');
  }
};
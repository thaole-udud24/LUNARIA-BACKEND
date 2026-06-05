export const getImg = (name: string) => {
  try {
    return require(`@/assets/images/${name}`);
  } catch (err) {
    return '';
  }
};

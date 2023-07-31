const parseCartFromCookie = (cookieString) => {
  try {
    return JSON.parse(cookieString);
  } catch (error) {
    return [];
  }
};

export default parseCartFromCookie;

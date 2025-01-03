const generateToken = (length = 20) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      token += characters[randomIndex];
    }
    return token;
  };
  
  const hashExpirationDate = (expirationDate) => {
    let hash = 0;
    for (let i = 0; i < expirationDate.length; i++) {
      const char = expirationDate.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0; // Convert to 32bit integer
    }
    return hash.toString(16);
  };
  
  export const generateTokenWithExpiration = () => {
    const token = generateToken();
    const expirationDate = new Date(Date.now() + 15 * 60 * 1000).toISOString().split('T')[0]; // Only the date part
    const hashedExpirationDate = hashExpirationDate(expirationDate);
    return `${token}:${expirationDate}:${hashedExpirationDate}`;
  };
  
  export const isTokenValid = (tokenWithExpiration) => {
    const [token, expirationDate, hashedExpirationDate] = tokenWithExpiration.split(':');
    const expectedHashedExpirationDate = hashExpirationDate(expirationDate);
  
    const currentDate = new Date().toISOString().split('T')[0]; // Only the date part
    return hashedExpirationDate === expectedHashedExpirationDate && currentDate <= expirationDate;
  };
  
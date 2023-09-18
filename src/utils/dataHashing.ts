import bcrypt from "bcrypt";

export const hashData = async (data: string, saltRound = 10) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const hashedData = await bcrypt.hash(data, saltRound);

    return hashedData;
  } catch (error) {
    throw error;
  }
};

export const verifyHashedData = async (hashed: string, unHashed: string) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const match = await bcrypt.compare(hashed, unHashed);

    return match;
  } catch (error) {
    throw error;
  }
};

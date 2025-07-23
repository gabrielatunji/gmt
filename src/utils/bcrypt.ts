import bcrypt from 'bcrypt';

const saltRounds = 10;


export const hashPassword = async (password: string): Promise<string> => {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error: any) {
    console.log('Error hashing password:', error);
    throw new Error(`Password hashing failed: ${error.message}`);
  }
};


export const confirmPassword = async (password: string, hash: string): Promise<boolean> => {
  try {
    const match = await bcrypt.compare(password, hash);
    return match;
  } catch (error: any) {
    console.log('Error confirming password:', error);
    throw new Error(`Password confirmation failed: ${error.message}`);
  }
};
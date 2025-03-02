import bcrypt from "bcrypt";

export const generateHash = ({
  plainText,
  saltRounds = process.env.SALT_ROUNDS,
}) => {
  return bcrypt.hashSync(plainText, Number(saltRounds));
};

export const compareHash = ({ plainText, hashedText }) => {
  return bcrypt.compareSync(plainText, hashedText);
};

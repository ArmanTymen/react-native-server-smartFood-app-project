const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('JWT_SECRET is not defined! Exiting...');
  process.exit(1);
}
export { JWT_SECRET };
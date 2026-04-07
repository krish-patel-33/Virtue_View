export const shouldBeLoggedIn = async (req, res) => {
  res.status(200).json({ message: "You are Authenticated" });
};

export const shouldBeAdmin = async (req, res) => {
  // verifyToken and verifyAdmin middleware already handled authentication
  res.status(200).json({ message: "You are Authenticated as Admin" });
};

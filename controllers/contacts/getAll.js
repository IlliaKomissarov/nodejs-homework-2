const { Contact } = require("../../models");

const getAll = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 20, favorite } = req.query;
  const skip = (page - 1) * limit;

  const filter = favorite ? { owner, favorite } : { owner };

  try {
    const result = await Contact.find(filter, "-createdAt -updatedAt", {
      skip,
      limit,
    }).populate("owner", "email subscription");
    res.json(result);
  } catch (error) {
    console.error("Error while retrieving contacts:", error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = getAll;

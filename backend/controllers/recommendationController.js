const { getRecommendations } = require("../services/recommendationService");

const getTripRecommendations = async (req, res) => {
  try {
    const {
      form_a,
      form_b,
      form_c,
      form_f,
      form_g,
      form_h,
      form_i,
      form_j,
      form_r,
      form_rr,
      top_k,
    } = req.body;

    const result = await getRecommendations({
      form_a,
      form_b,
      form_c,
      form_f,
      form_g,
      form_h,
      form_i,
      form_j,
      form_r,
      form_rr,
      top_k: top_k || 10,
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("Recommendation error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to generate travel recommendations",
    });
  }
};

module.exports = {
  getTripRecommendations,
};
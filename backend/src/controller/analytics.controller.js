import { getAdminAnalyticsOverview, getRevenueTrendsService } from "../services/analytics.services.js";

export const getAdminAnalytics = async (req, res) => {
  try {
    const analytics = await getAdminAnalyticsOverview();

    return res.status(200).json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error("Admin analytics error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch admin analytics"
    });
  }
};

export const getRevenueTrends = async (req, res) => {
  try {
    const { year, month } = req.query;
    const trends = await getRevenueTrendsService({ 
      year: year ? Number(year) : null, 
      month: month ? Number(month) : null 
    });

    return res.status(200).json({
      success: true,
      data: trends
    });
  } catch (error) {
    console.error("Revenue trends error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch revenue trends"
    });
  }
};

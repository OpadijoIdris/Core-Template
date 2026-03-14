
import prisma from "../config/postgres.js";

const normalizeOrderStats = (stats) => {
  const normalized = { PENDING: 0, PAID: 0, CANCELLED: 0, FULFILLED: 0 };
  stats.forEach(stat => {
    if (normalized.hasOwnProperty(stat.status)) {
      normalized[stat.status] = stat._count.id;
    }
  });
  return normalized;
};

export const getAdminAnalyticsOverview = async () => {
  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalOrdersCount,
      orderStats,
      totalRevenue,
      revenueToday,
      revenueThisMonth,
      projectedIncomePOD, // New: Cash currently with agents
      refundCount,
      refundedAmount,
      lowStockCount,
      outOfStockCount,
      openChats
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.groupBy({ by: ["status"], _count: { id: true } }),
      prisma.order.aggregate({ _sum: { total: true }, where: { payment_status: "SUCCESS" } }),
      
      // Use updatedAt for revenue today/month to capture when payment was actually CONFIRMED
      prisma.order.aggregate({ 
        _sum: { total: true }, 
        where: { 
          payment_status: "SUCCESS", 
          updatedAt: { gte: todayStart } 
        } 
      }),
      prisma.order.aggregate({ 
        _sum: { total: true }, 
        where: { 
          payment_status: "SUCCESS", 
          updatedAt: { gte: monthStart } 
        } 
      }),
      
      // POD orders that are out for delivery but not yet fulfilled
      prisma.order.aggregate({
        _sum: { total: true },
        where: {
          payment_provider: "PAY_ON_DELIVERY",
          status: "PENDING",
          payment_status: "PENDING"
        }
      }),

      prisma.order.count({ where: { refundStatus: "SUCCESS" } }),
      prisma.order.aggregate({ _sum: { refundAmount: true }, where: { refundStatus: "SUCCESS" } }),
      prisma.product.count({ where: { quantity: { gt: 0, lte: 5 } } }),
      prisma.product.count({ where: { quantity: 0 } }),
      prisma.conversation.count({ where: { status: "OPEN" } })
    ]);

    return {
      orders: {
        total: totalOrdersCount,
        status: normalizeOrderStats(orderStats)
      },
      revenue: {
        total: totalRevenue._sum.total || 0,
        today: revenueToday._sum.total || 0,
        month: revenueThisMonth._sum.total || 0,
        projected: projectedIncomePOD._sum.total || 0 // Cash out for delivery
      },
      refunds: {
        count: refundCount,
        amount: refundedAmount._sum.refundAmount || 0
      },
      inventory: {
        lowStock: lowStockCount,
        outOfStock: outOfStockCount
      },
      chat: {
        openConversations: openChats
      }
    };
  } catch (error) {
    console.error("Admin analytics error:", error.message);
    throw new Error(`Failed to retrieve admin analytics: ${error.message}`);
  }
};

export const getRevenueTrendsService = async ({ year, month }) => {
  try {
    let startDate, endDate;
    let groupBy = "day"; // Default grouping

    if (year && month) {
      // Specific month in a year: Show daily breakdown
      startDate = new Date(year, month - 1, 1);
      endDate = new Date(year, month, 0, 23, 59, 59);
      groupBy = "day";
    } else if (year) {
      // Specific year: Show monthly breakdown
      startDate = new Date(year, 0, 1);
      endDate = new Date(year, 11, 31, 23, 59, 59);
      groupBy = "month";
    } else {
      // Default: Last 30 days
      endDate = new Date();
      startDate = new Date();
      startDate.setDate(endDate.getDate() - 30);
      groupBy = "day";
    }

    const revenueData = await prisma.order.findMany({
      where: {
        payment_status: "SUCCESS",
        updatedAt: { // Use updatedAt to show when money was actually received
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        total: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: "asc",
      },
    });

    // Process data based on grouping
    const trendsMap = new Map();

    revenueData.forEach((order) => {
      let key;
      const date = new Date(order.updatedAt);
      
      if (groupBy === "day") {
        key = date.toISOString().split("T")[0]; // YYYY-MM-DD
      } else {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`; // YYYY-MM
      }

      const currentTotal = trendsMap.get(key) || 0;
      trendsMap.set(key, currentTotal + Number(order.total));
    });

    // Fill gaps and format for charts
    const formattedTrends = [];
    const current = new Date(startDate);

    while (current <= endDate) {
      let key;
      let label;
      
      if (groupBy === "day") {
        key = current.toISOString().split("T")[0];
        label = current.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        current.setDate(current.getDate() + 1);
      } else {
        key = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, "0")}`;
        label = current.toLocaleDateString("en-US", { month: "long", year: "numeric" });
        current.setMonth(current.getMonth() + 1);
      }

      formattedTrends.push({
        date: key,
        label,
        revenue: trendsMap.get(key) || 0,
      });

      // Break loop if we've reached the end
      if (groupBy === "month" && current.getFullYear() > endDate.getFullYear()) break;
    }

    return formattedTrends;
  } catch (error) {
    console.error("Revenue trends error:", error.message);
    throw new Error(`Failed to retrieve revenue trends: ${error.message}`);
  }
};

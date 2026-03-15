import express, { urlencoded } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';

// Route Imports
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';
import categoryRouter from './routes/category.routes.js';
import subCategoryRouter from './routes/subcategory.routes.js';
import productRouter from './routes/product.routes.js';
import cartRouter from './routes/cart.routes.js';
import checkoutRouter from './routes/checkout.routes.js';
import webhookRouter from './routes/webhook.routes.js';
import orderRouter from './routes/order.routes.js';
import chatRouter from './routes/chat.routes.js';
import analyticsRouter from './routes/analytics.routes.js';

const app = express();

// 1. GLOBAL SECURITY & PERFORMANCE MIDDLEWARE
app.set("trust proxy", 1); // Needed for rate limiting if behind Render/Nginx/Heroku
app.use(helmet()); // Secure HTTP headers
app.use(compression()); // Compress responses
app.use(morgan('dev')); // Logger

// 2. DYNAMIC CORS CONFIGURATION
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:3000",
  "http://localhost:5173", // Common Vite port
  /\.vercel\.app$/, // Allow all Vercel subdomains (Safer for reviews)
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.some(pattern => 
            pattern instanceof RegExp ? pattern.test(origin) : pattern === origin)) {
            callback(null, true);
        } else {
            callback(new Error('CORS Policy: Access Denied'));
        }
    },
    credentials: true,
}));

// 3. WEBHOOKS (CRITICAL: Must be before express.json() to maintain raw body)
app.use("/api/webhook", webhookRouter);

// 4. REQUEST PARSING & POLLUTION PREVENTION
app.use(express.json({ limit: '10kb' })); // Limit body size
app.use(urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
app.use(hpp()); // Prevent parameter pollution

// 5. GLOBAL RATE LIMITING
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // Limit each IP to 200 requests per window
    message: { success: false, message: "Too many requests. Please try again later." }
});
app.use("/api", globalLimiter);

// 6. API ROUTES
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/category", categoryRouter);
app.use("/api/subcategory", subCategoryRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/checkout", checkoutRouter);
app.use("/api/order", orderRouter);
app.use("/api/chat", chatRouter);
app.use("/api/analytics", analyticsRouter);

// 7. EXTERNAL CALLBACKS
app.get("/paystack/callback", (req, res) => {
  res.send("Payment received. You can close this page.");
});

// 8. SYSTEM HEALTH CHECK
app.get("/", (_, res) => {
    res.json({ 
        success: true,
        message: "TemplateStore Core API - Operations Online",
        environment: process.env.NODE_ENV || 'development'
    })
});

// 9. 404 NOT FOUND HANDLER
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `System node not found: ${req.originalUrl}`
    });
});

// 10. GLOBAL ERROR HANDLING MIDDLEWARE
app.use((err, req, res, next) => {
    console.error("GLOBAL ERROR:", err.stack);
    
    const statusCode = err.status || 500;
    res.status(statusCode).json({
        success: false,
        message: statusCode === 500 ? "Internal System Failure" : err.message,
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    });
});

export default app;

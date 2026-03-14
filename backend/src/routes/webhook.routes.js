import { Router } from "express";
import bodyParser from "body-parser";
import {handlePaystackWebhooks } from "../controller/webhook.controller.js";

const router = Router();

router.post("/", 
    bodyParser.raw({ type: "application/json" }),
    handlePaystackWebhooks
);

export default router;

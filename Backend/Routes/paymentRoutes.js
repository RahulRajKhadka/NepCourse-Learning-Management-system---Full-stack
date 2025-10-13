import express from "express";
import { initiateCoursePayment, renderEsewaFormAndSubmit, esewaSuccess, esewaFailure, khaltiReturn } from "../Controller/PaymentController.js";

const router = express.Router();

// Unified initiation
router.post("/initiate-course-payment", initiateCoursePayment);

// eSewa helper form and callbacks
router.get("/esewa-form", renderEsewaFormAndSubmit);
router.get("/esewa-success", esewaSuccess);
router.get("/esewa-failure", esewaFailure);
// Some eSewa flows POST back instead of GET
router.post("/esewa-success", esewaSuccess);
router.post("/esewa-failure", esewaFailure);

// Khalti return callback
router.get("/khalti-return", khaltiReturn);

// Stripe routes removed per request

export default router;
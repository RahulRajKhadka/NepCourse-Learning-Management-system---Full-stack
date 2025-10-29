import express from "express";
import { 
  initiateCoursePayment, 
  renderEsewaFormAndSubmit, 
  esewaSuccess, 
  esewaFailure, 
  khaltiReturn 
} from "../Controller/PaymentController.js";
import isAuth from "../middleware/isAuth.js";

const router = express.Router();

router.post("/initiate-course-payment", isAuth, initiateCoursePayment);

router.get("/esewa-form", renderEsewaFormAndSubmit);
router.get("/esewa-success", esewaSuccess);
router.get("/esewa-failure", esewaFailure);
router.post("/esewa-success", esewaSuccess);
router.post("/esewa-failure", esewaFailure);

router.get("/khalti-return", khaltiReturn);

export default router;

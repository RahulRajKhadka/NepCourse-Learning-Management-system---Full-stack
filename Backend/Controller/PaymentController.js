import dotenv from "dotenv";
dotenv.config();

import EsewaService from "../utils/esewa.js";
import axios from "axios";
import Enrollment from "../Model/Enrollment.js"; // Import your Enrollment model
import Course from "../Model/courseModel.js"; // Import Course model

// Unified initiate endpoint used by frontend
export const initiateCoursePayment = async (req, res) => {
  try {
    const { courseId, paymentGateway } = req.body;
    const amount = req.body.amount || req.query.amount;

    if (!courseId) {
      return res
        .status(400)
        .json({ success: false, message: "courseId is required" });
    }
    if (!paymentGateway) {
      return res
        .status(400)
        .json({ success: false, message: "paymentGateway is required" });
    }

    if (amount === undefined || amount === null || isNaN(Number(amount))) {
      return res
        .status(400)
        .json({ success: false, message: "amount is required" });
    }

    if (Number(amount) === 0) {
      return res.json({ success: true, enrollmentType: "free" });
    }

    const reqBaseUrl = `${req.protocol}://${req.get("host")}`;
    const serverBaseUrl = process.env.SERVER_URL || reqBaseUrl;

    if (paymentGateway === "esewa") {
      const userId = req.user?._id;
      const transactionUuid = `${courseId}-${userId}-${Date.now()}`;
      const successUrl =
        process.env.ESEWA_SUCCESS_URL ||
        `${serverBaseUrl}/api/payment/esewa-success`;
      const failureUrl =
        process.env.ESEWA_FAILURE_URL ||
        `${serverBaseUrl}/api/payment/esewa-failure`;

      const formData = EsewaService.createPaymentData({
        amount: Number(amount),
        transactionUuid,
        successUrl,
        failureUrl,
      });

      const paymentUrl = `${serverBaseUrl}/api/payment/esewa-form?transaction_uuid=${encodeURIComponent(formData.transaction_uuid)}&amount=${encodeURIComponent(formData.amount)}&tax_amount=${encodeURIComponent(formData.tax_amount)}&total_amount=${encodeURIComponent(formData.total_amount)}&product_code=${encodeURIComponent(formData.product_code)}&product_service_charge=${encodeURIComponent(formData.product_service_charge)}&product_delivery_charge=${encodeURIComponent(formData.product_delivery_charge)}&success_url=${encodeURIComponent(formData.success_url)}&failure_url=${encodeURIComponent(formData.failure_url)}&signed_field_names=${encodeURIComponent(formData.signed_field_names)}&signature=${encodeURIComponent(formData.signature)}&courseId=${courseId}&userId=${userId}`;
      return res.json({ success: true, paymentUrl });
    }

    if (paymentGateway === "khalti") {
      const khaltiBaseUrl =
        process.env.NODE_ENV === "production"
          ? "https://khalti.com/api/v2/epayment/initiate/"
          : "https://a.khalti.com/api/v2/epayment/initiate/";

      const rawSecretKey = process.env.KHALTI_SECRET_KEY;
      if (!rawSecretKey) {
        return res.status(500).json({
          success: false,
          message: "Khalti secret key is not configured (KHALTI_SECRET_KEY).",
        });
      }
      const authHeader = rawSecretKey.startsWith("Key ")
        ? rawSecretKey
        : `Key ${rawSecretKey}`;

      if (Math.round(Number(amount)) < 10) {
        return res.status(400).json({
          success: false,
          message: "Amount must be at least NPR 10 for Khalti.",
        });
      }

      const userId = req.user?._id;
      const payload = {
        return_url: process.env.KHALTI_RETURN_URL || `${serverBaseUrl}/api/payment/khalti-return?courseId=${courseId}&userId=${userId}`,

        website_url: process.env.CLIENT_URL || "http://localhost:5173",
        amount: Math.round(Number(amount) * 100),
        purchase_order_id: `${courseId}-${userId}-${Date.now()}`,
        purchase_order_name: `Course-${courseId}`,
      };

      const { data } = await axios
        .post(khaltiBaseUrl, payload, {
          headers: {
            "Content-Type": "application/json",
            Authorization: authHeader,
          },
        })
        .catch(async (err) => {
          const errData =
            err?.response?.data || (await Promise.resolve(err.message));
          return { data: { __error: true, details: errData } };
        });

      if (data?.__error) {
        return res.status(500).json({
          success: false,
          message: "Khalti initiation failed",
          error: data.details,
        });
      }
      if (!data?.payment_url) {
        return res.status(500).json({
          success: false,
          message: "Khalti initiation failed: payment_url missing",
          error: data,
        });
      }
      return res.json({ success: true, paymentUrl: data.payment_url });
    }

    return res
      .status(400)
      .json({ success: false, message: "Unsupported paymentGateway" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Payment initiation failed",
      error: error.message,
    });
  }
};

// Render form
export const renderEsewaFormAndSubmit = (req, res) => {
  const q = req.query;
  const paymentEndpoint = EsewaService.paymentUrl;

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Redirecting to eSewa</title></head>
<body>
  <p>Redirecting to eSewa...</p>
  <form id="esewaForm" method="POST" action="${paymentEndpoint}">
    <input type="hidden" name="amount" value="${q.amount}" />
    <input type="hidden" name="tax_amount" value="${q.tax_amount}" />
    <input type="hidden" name="total_amount" value="${q.total_amount}" />
    <input type="hidden" name="transaction_uuid" value="${q.transaction_uuid}" />
    <input type="hidden" name="product_code" value="${q.product_code}" />
    <input type="hidden" name="product_service_charge" value="${q.product_service_charge}" />
    <input type="hidden" name="product_delivery_charge" value="${q.product_delivery_charge}" />
    <input type="hidden" name="success_url" value="${q.success_url}?courseId=${q.courseId}&userId=${q.userId}" />
    <input type="hidden" name="failure_url" value="${q.failure_url}" />
    <input type="hidden" name="signed_field_names" value="${q.signed_field_names}" />
    <input type="hidden" name="signature" value="${q.signature}" />
  </form>
  <script>document.getElementById('esewaForm').submit();</script>
  </body>
  </html>`;

  res.set("Content-Type", "text/html");
  return res.send(html);
};

// ✅ FIXED: eSewa Success with Enrollment Creation
export const esewaSuccess = async (req, res) => {
  const clientBase = process.env.CLIENT_URL || "http://localhost:5173";
  
  try {
    const encodedData = req.query?.data || req.body?.data;
    const courseId = req.query?.courseId;
    const userId = req.query?.userId;
    
    let transactionUuid;
    let totalAmount;

    if (encodedData) {
      try {
        const decoded = EsewaService.decodeResponse(encodedData);
        transactionUuid = decoded?.transaction_uuid;
        totalAmount = decoded?.total_amount;
      } catch (e) {
        console.error("Decode error:", e);
      }
    }

    transactionUuid = transactionUuid || req.query?.transaction_uuid;
    totalAmount = totalAmount || req.query?.total_amount;

    if (!transactionUuid || !totalAmount) {
      return res.redirect(302, `${clientBase}/payment-failure`);
    }

    // ✅ Verify payment
    const status = await EsewaService.checkPaymentStatus({
      transactionUuid,
      totalAmount,
    });

    if (status?.status === "COMPLETE") {
      // ✅ CREATE ENROLLMENT
      if (courseId && userId) {
        try {
          // Check if already enrolled
          let enrollment = await Enrollment.findOne({ 
            user: userId, 
            course: courseId 
          });

          if (!enrollment) {
            // Create new enrollment
            enrollment = await Enrollment.create({
              user: userId,
              course: courseId,
              enrollmentDate: new Date(),
              paymentStatus: "completed",
              paymentMethod: "esewa",
              transactionId: transactionUuid,
              amountPaid: totalAmount,
              progress: 0,
              completedLectures: [],
            });

            // Update course enrollment count
            await Course.findByIdAndUpdate(courseId, {
              $inc: { enrollmentCount: 1 }
            });

            console.log("✅ Enrollment created:", enrollment._id);
          } else {
            console.log("ℹ️ User already enrolled");
          }

          // Redirect with courseId
          return res.redirect(302, `${clientBase}/payment-success?courseId=${courseId}`);
        } catch (dbError) {
          console.error("❌ Database error:", dbError);
          return res.redirect(302, `${clientBase}/payment-success?courseId=${courseId}&warning=enrollment-failed`);
        }
      }
      
      return res.redirect(302, `${clientBase}/payment-success`);
    }
    
    return res.redirect(302, `${clientBase}/payment-failure`);
  } catch (err) {
    console.error("eSewa success error:", err);
    return res.redirect(302, `${clientBase}/payment-failure`);
  }
};

export const esewaFailure = (req, res) => {
  const clientBase = process.env.CLIENT_URL || "http://localhost:5173";
  return res.redirect(302, `${clientBase}/payment-failure`);
};


export const khaltiReturn = async (req, res) => {
  try {
    const clientBase = process.env.CLIENT_URL || "http://localhost:5173";
    const pidx = req.query.pidx;
    const courseId = req.query.courseId;
    const userId = req.query.userId;

    if (!pidx) {
      return res.redirect(302, `${clientBase}/payment-failure`);
    }

    const lookupUrl =
      process.env.NODE_ENV === "production"
        ? "https://khalti.com/api/v2/epayment/lookup/"
        : "https://a.khalti.com/api/v2/epayment/lookup/";

    const authHeader = (process.env.KHALTI_SECRET_KEY || "").startsWith("Key ")
      ? process.env.KHALTI_SECRET_KEY
      : `Key ${process.env.KHALTI_SECRET_KEY || ""}`;

    let attempts = 0;
    while (attempts < 6) {
      const { data } = await axios.post(
        lookupUrl,
        { pidx },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: authHeader,
          },
        }
      );

      if (data?.status === "Completed") {
      
        if (courseId && userId) {
          try {
            let enrollment = await Enrollment.findOne({ 
              user: userId, 
              course: courseId 
            });

            if (!enrollment) {
              enrollment = await Enrollment.create({
                user: userId,
                course: courseId,
                enrollmentDate: new Date(),
                paymentStatus: "completed",
                paymentMethod: "khalti",
                transactionId: pidx,
                amountPaid: data.total_amount / 100, // Convert paisa to NPR
                progress: 0,
                completedLectures: [],
              });

              await Course.findByIdAndUpdate(courseId, {
                $inc: { enrollmentCount: 1 }
              });

              console.log("✅ Khalti Enrollment created:", enrollment._id);
            }

            return res.redirect(302, `${clientBase}/payment-success?courseId=${courseId}`);
          } catch (dbError) {
            console.error("❌ Database error:", dbError);
            return res.redirect(302, `${clientBase}/payment-success?courseId=${courseId}&warning=enrollment-failed`);
          }
        }

        return res.redirect(302, `${clientBase}/payment-success`);
      }
      
      if (
        data?.status &&
        ["User canceled", "Expired", "Refunded"].includes(data.status)
      ) {
        return res.redirect(302, `${clientBase}/payment-failure`);
      }
      
      await new Promise((r) => setTimeout(r, 2000));
      attempts += 1;
    }

    return res.redirect(302, `${clientBase}/payment-failure`);
  } catch (error) {
    console.error("Khalti return error:", error);
    const clientBase = process.env.CLIENT_URL || "http://localhost:5173";
    return res.redirect(302, `${clientBase}/payment-failure`);
  }
};
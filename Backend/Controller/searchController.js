import Courses from "../Model/courseModel.js";
import { GoogleGenerativeAI } from "@google/generative-ai"; // ✅ Correct import
import dotenv from "dotenv";

dotenv.config();

export const searchWithAi = async (req, res) => {
  try {
    const { query } = req.body;
    console.log("1. Received query:", query);

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Query is required",
      });
    }

    // First, try direct search with user query
    let courses = await Courses.find({
      isPublished: true,
      $or: [
        { title: { $regex: query, $options: "i" } },
        { subtitle: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
        { level: { $regex: query, $options: "i" } },
      ],
    });

    console.log("2. Direct search found:", courses.length, "courses");

    // If no results, use AI to extract keywords
    if (courses.length === 0) {
      console.log("3. No direct results, using AI...");

      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

      const prompt = `Extract relevant coding/technology keywords from this query for course search. 
Return ONLY the keywords as a comma-separated list, nothing else.
Query: "${query}"

Examples:
- "I want to learn backend" -> backend, nodejs, express, mongodb, api
- "Show me beginner courses" -> beginner, html, css, javascript, programming
- "AI courses" -> ai, machine learning, python, artificial intelligence

Keywords:`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      console.log("4. AI Response:", responseText);

      const keywords = responseText
        .trim()
        .toLowerCase()
        .split(",")
        .map((k) => k.trim())
        .filter((k) => k.length > 0);

      console.log("5. Extracted keywords:", keywords);

      if (keywords.length > 0) {
        const orConditions = keywords.flatMap((keyword) => [
          { title: { $regex: keyword, $options: "i" } },
          { subtitle: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
          { category: { $regex: keyword, $options: "i" } },
          { level: { $regex: keyword, $options: "i" } },
        ]);

        courses = await Courses.find({
          isPublished: true,
          $or: orConditions,
        }).limit(20);

        console.log("6. AI-enhanced search found:", courses.length, "courses");
      }
    }

    console.log("7. Returning response with", courses.length, "courses");

    return res.status(200).json({
      success: true,
      course: courses,
      count: courses.length,
    });
  } catch (error) {
    console.error("Search error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

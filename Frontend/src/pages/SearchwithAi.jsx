import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import ai from "../assets/ai.png";
import { RiMicAiFill } from "react-icons/ri";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../config.js";
import Card from "../Component/Card.jsx";
import start from "../assets/start.mp3";

const SearchWithAi = () => {
  const startSound = new Audio(start);
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [courses, setCourses] = useState([]);

  // Clean up speech synthesis when component unmounts
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  function speak(message) {
    // Cancel any ongoing speech before starting new one
    window.speechSynthesis.cancel();

    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(message);
    synth.speak(utterance);
  }

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  if (!recognition) {
    toast.error("Your browser does not support speech recognition.");
  }

  const handleVoiceSearch = async () => {
    startSound.play();
    if (!recognition) {
      toast.error("Speech recognition not supported in your browser");
      return;
    }

    recognition.start();

    recognition.onresult = async (e) => {
      const transcript = e.results[0][0].transcript;
      setInput(transcript);
      toast.success(`Voice input: ${transcript}`);
      await fetchCourses(transcript);
    };

    recognition.onerror = (e) => {
      toast.error("Error occurred in speech recognition: " + e.error);
    };
  };

  // 🔍 Handle manual search button
  const handleSearch = async () => {
    if (!input.trim()) {
      toast.error("Please enter a search term");
      return;
    }
    await fetchCourses(input);
  };

  const fetchCourses = async (query) => {
    try {
      const response = await axios.post(
        `${serverUrl}/api/courses/searchWithAi`,
        { query },
        { withCredentials: true }
      );

      if (response.data.success) {
        console.log("Courses found:", response.data.course);
        setCourses(response.data.course);

        if (response.data.course.length > 0) {
          speak("These are the top courses I found for you");
        } else {
          speak("Sorry, I could not find any courses matching your search");
        }
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast.error("Something went wrong while fetching courses");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 text-white flex flex-col items-center px-4 py-10">
      <div className="relative bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl rounded-2xl p-8 w-full max-w-2xl text-center">
        <FaArrowLeftLong
          onClick={() => {
            window.speechSynthesis.cancel(); // Stop speech when navigating back
            navigate(-1);
          }}
          className="absolute top-5 left-6 text-2xl text-gray-300 cursor-pointer hover:text-white transition"
        />
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-200 mb-6 flex justify-center items-center gap-2">
          <img src={ai} alt="AI" className="w-6 h-6 sm:w-8 sm:h-8" />
          Search with <span className="text-[#CB99C7] ml-1">AI</span>
        </h1>

        {/* Search Box */}
        <div className="flex items-center bg-white rounded-full overflow-hidden shadow-md p-2 pl-5">
          <input
            type="text"
            placeholder="What do you want to learn? (e.g. AI, MERN, Cloud...)"
            className="flex-grow bg-transparent outline-none text-gray-700 placeholder-gray-500 text-sm sm:text-base"
            onChange={(e) => setInput(e.target.value)}
            value={input}
          />

          {/* Manual Search */}
          <button
            className="p-3 bg-[#cb87c5] rounded-full text-white mr-2 hover:bg-[#b66bb0] transition"
            onClick={handleSearch}
          >
            <img src={ai} alt="AI" className="w-6 h-6" />
          </button>

          {/* Voice Search */}
          <button
            className="p-3 bg-white/10 rounded-full text-white mr-2 hover:bg-white/20 transition"
            onClick={handleVoiceSearch}
          >
            <RiMicAiFill className="w-9 h-9 text-[#cb87c5]" />
          </button>
        </div>

        {input && (
          <div className="mt-4 p-3 bg-white/5 rounded-lg">
            <p className="text-gray-300">Current input:</p>
            <p className="text-[#CB99C7] font-semibold">"{input}"</p>
          </div>
        )}
      </div>

      {/* 📚 Results Section */}
      <div className="w-full max-w-6xl mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.length > 0 ? (
          courses.map((course) => (
            <Card
              key={course._id}
              id={course._id}
              title={course.title}
              description={course.description}
              price={course.price}
              category={course.category}
              level={course.level}
              thumbnail={course.thumbnail}
              enrolledStudents={course.enrolledStudents}
            />
          ))
        ) : (
          <p className="text-gray-400 text-center w-full col-span-full">
            No courses found.
          </p>
        )}
      </div>
    </div>
  );
};

export default SearchWithAi;

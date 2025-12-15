import React from "react";
import { useThemeStore } from "./stores/theme-store";

const App = () => {
  const { isDark, setIsDark } = useThemeStore();

  return (
    <div
      className="min-h-screen p-4 text-center transition-colors duration-300"
      style={{ backgroundColor: isDark ? "#1a1a1a" : "white" }}
    >
      <h1
        className={`text-xl font-semibold mb-4 ${
          isDark ? "text-white" : "text-gray-900"
        }`}
      >
        Test Title
      </h1>
      <button
        onClick={() => setIsDark(!isDark)}
        className={`px-6 py-2 rounded-lg font-medium transition-colors duration-300 ${
          isDark
            ? "bg-white text-gray-900 hover:bg-gray-100"
            : "bg-gray-900 text-white hover:bg-gray-800"
        }`}
      >
        {isDark ? "White Mode" : "Dark Mode"}
      </button>
    </div>
  );
};

export default App;
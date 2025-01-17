import React from "react";
import { useDarkMode } from "../utilities/darkmodeContext";

const SettingsDialog = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <div className="fixed top-4 right-4">
      <div className="flex items-center space-x-2 bg-gray-200 dark:bg-gray-700 p-2 rounded-full shadow-md">
        <span className="text-sm text-gray-800 dark:text-gray-200">{isDarkMode ? "Dark Mode" : "Light Mode"}</span>
        <button
          onClick={toggleDarkMode}
          className={`relative w-12 h-6 flex items-center bg-gray-300 dark:bg-gray-500 rounded-full transition-colors duration-300`}
        >
          <span
            className={`absolute w-5 h-5 bg-white dark:bg-gray-900 rounded-full shadow-md transform transition-transform duration-300 ${
              isDarkMode ? "translate-x-6" : "translate-x-0"
            }`}
          />
        </button>
      </div>
    </div>
  );
};

export default SettingsDialog;

// From Uiverse.io by ParasSalunke
import React from "react";

const GradientButton = () => {
   return (
    <div className="relative group ">
      <div className="relative w-64 h-14 opacity-90 overflow-hidden rounded-xl bg-black z-10">
        {/* Animated gradient overlay */}
        <div
          className="absolute z-10 -translate-x-44 group-hover:translate-x-[30rem] ease-in transition-all duration-700 h-full w-44 bg-gradient-to-r from-gray-500 to-white/10 opacity-30 -skew-x-12"
        ></div>

        {/* Button wrapper */}
        <div className="absolute flex items-center justify-center text-white z-[1] opacity-90 rounded-2xl inset-0.5 bg-black">
          <button
            name="text"
            className="input font-semibold text-lg h-full opacity-90 w-full px-16 py-3 rounded-xl bg-black cursor-pointer"
          >
            Zero Balance?
          </button>
        </div>

        {/* Glow/blur effect */}
        <div className="absolute duration-1000 group-hover:animate-spin w-full h-[100px] bg-gradient-to-r from-indigo-500 to-blue-300 blur-[30px]"></div>
      </div>
    </div>
  );
};
export default GradientButton;

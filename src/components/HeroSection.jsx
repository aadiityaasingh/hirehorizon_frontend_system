import React, { useState } from "react";
import { Button } from "./ui/button";
import { Search } from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSearchedQuery } from "@/redux/jobSlice";

const HeroSection = () => {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchJobHandler = (e) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;
    dispatch(setSearchedQuery(query.trim()));
    navigate("/browse");
  };

  return (
    <div className="relative overflow-hidden py-12 md:py-20 px-4">
      <div className="text-center max-w-4xl mx-auto">
        <div className="flex flex-col gap-6">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight">
            Search, Apply &amp; <br />
            Get Your <span className="text-blue-600">Dream Career</span>
          </h1>

          <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Discover thousands of curated job openings from high-growth startups and Fortune 500 companies. One-click apply and start your journey today.
          </p>

          <form
            onSubmit={searchJobHandler}
            className="flex w-full max-w-xl shadow-md border border-gray-200 pl-4 py-1 rounded-full items-center gap-2 mx-auto bg-white focus-within:ring-2 focus-within:ring-blue-400 focus-within:border-transparent transition-all"
          >
            <input
              type="text"
              placeholder="Job title, keywords, or company..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="outline-none border-none w-full text-gray-700 placeholder-gray-400 text-sm md:text-base bg-transparent"
            />
            <Button
              type="submit"
              className="rounded-full bg-blue-600 hover:bg-blue-700 text-white cursor-pointer px-5"
            >
              <Search className="h-5 w-5" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;

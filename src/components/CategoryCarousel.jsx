import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";

const categories = [
  "Frontend Developer",
  "Backend Developer",
  "FullStack Developer",
  "UI/UX Designer",
  "Data Scientist",
  "DevOps Engineer",
  "Mobile App Developer",
];

const CategoryCarousel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchJobHandler = (query) => {
    dispatch(setSearchedQuery(query));
    navigate("/browse");
  };

  return (
    <div className="px-4">
      <Carousel className="w-full max-w-xl mx-auto my-12 md:my-16">
        <CarouselContent className="-ml-2">
          {categories.map((cat, index) => (
            <CarouselItem key={index} className="pl-2 basis-1/2 md:basis-1/3 lg:basis-1/3">
              <Button
                onClick={() => searchJobHandler(cat)}
                variant="outline"
                className="w-full rounded-full border-gray-300 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-colors text-sm font-medium py-2"
              >
                {cat}
              </Button>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex" />
        <CarouselNext className="hidden sm:flex" />
      </Carousel>
    </div>
  );
};

export default CategoryCarousel;

import React, { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import { RotateCcw, Filter, Check } from "lucide-react";

const filterData = [
  {
    filterType: "Job Source",
    array: [
      "Direct Employers",
      "Remotive",
      "RemoteOK",
      "WeWorkRemotely",
      "Greenhouse",
      "Lever",
      "Arbeitnow",
      "Jobicy",
    ],
  },
  {
    filterType: "Location",
    array: [
      "Remote",
      "Delhi",
      "Gurgaon",
      "Bangalore",
      "Hyderabad",
      "Mumbai",
      "Pune",
      "Noida",
    ],
  },
  {
    filterType: "Industry & Role",
    array: [
      "Frontend Developer",
      "Backend Developer",
      "FullStack Developer",
      "UI/UX Designer",
      "Data Scientist",
      "DevOps",
      "Mobile App",
      "QA",
    ],
  },
  {
    filterType: "Salary Range",
    array: ["0-6 LPA", "6-12 LPA", "12-20 LPA", "20+ LPA"],
  },
  {
    filterType: "Job Type",
    array: ["full-time", "part-time", "internship"],
  },
];

const FilterCard = () => {
  const [selectedValue, setSelectedValue] = useState("");
  const dispatch = useDispatch();
  const { searchedQuery } = useSelector((store) => store.job);

  useEffect(() => {
    setSelectedValue(searchedQuery || "");
  }, [searchedQuery]);

  const toggleHandler = (val) => {
    if (selectedValue.toLowerCase() === val.toLowerCase()) {
      setSelectedValue("");
      dispatch(setSearchedQuery(""));
    } else {
      setSelectedValue(val);
      dispatch(setSearchedQuery(val));
    }
  };

  const clearFilterHandler = () => {
    setSelectedValue("");
    dispatch(setSearchedQuery(""));
  };

  return (
    <div className="w-full bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <h2 className="font-bold text-base text-gray-900 flex items-center gap-2">
          <Filter className="w-4 h-4 text-blue-600" />
          Filter Jobs
        </h2>
        {selectedValue && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilterHandler}
            className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50 h-7 px-2 flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </Button>
        )}
      </div>

      <RadioGroup value={selectedValue} onValueChange={(val) => toggleHandler(val)}>
        {filterData.map((data, index) => (
          <div key={index} className="mt-5">
            <h3 className="font-semibold text-xs text-gray-500 uppercase tracking-wider mb-2.5">
              {data.filterType}
            </h3>

            <div className="space-y-2">
              {data.array.map((item, idx) => {
                const itemId = `filter-${index}-${idx}`;
                const isSelected = selectedValue.toLowerCase() === item.toLowerCase();

                return (
                  <div
                    key={itemId}
                    onClick={() => toggleHandler(item)}
                    className={`flex items-center space-x-2 px-2 py-1.5 rounded-lg cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "hover:bg-gray-50 text-gray-600"
                    }`}
                  >
                    <RadioGroupItem
                      value={item}
                      id={itemId}
                      checked={isSelected}
                      className="pointer-events-none"
                    />
                    <span className="text-sm cursor-pointer capitalize flex-1 select-none">
                      {item}
                    </span>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-blue-600" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default FilterCard;

import { JOB_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import { setAllJobs } from "@/redux/jobSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetAllJobs = () => {
  const dispatch = useDispatch();
  const { searchedQuery } = useSelector((store) => store.job);

  useEffect(() => {
    const fetchAllJobs = async () => {
      try {
        const q = (searchedQuery || "").toLowerCase().trim();
        const isClientOnly = q.includes("lpa") || q === "direct employers";

        let url = `${JOB_API_END_POINT}/get?limit=200`;
        if (!isClientOnly && q) {
          url += `&keyword=${encodeURIComponent(searchedQuery.trim())}`;
        }

        const res = await axios.get(url, { withCredentials: true });

        if (res.data.success) {
          dispatch(setAllJobs(res.data.jobs || []));
        }
      } catch (error) {
        console.error("Fetch all jobs error:", error);
      }
    };

    fetchAllJobs();
  }, [searchedQuery, dispatch]);
};

export default useGetAllJobs;

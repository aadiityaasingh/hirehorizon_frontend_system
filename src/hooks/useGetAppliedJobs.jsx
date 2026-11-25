import { setAllAppliedJobs } from "@/redux/jobSlice";
import { APPLICATION_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetAppliedJobs = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);

  useEffect(() => {
    if (!user) return;

    const fetchAppliedJobs = async () => {
      try {
        const res = await axios.get(
          `${APPLICATION_API_END_POINT}/get`,
          { withCredentials: true }
        );

        if (res?.data?.success) {
          const appliedList = res.data.applications || res.data.application || [];
          dispatch(setAllAppliedJobs(appliedList));
        }
      } catch (error) {
        console.log("Error fetching applied jobs:", error);
      }
    };

    fetchAppliedJobs();
  }, [dispatch, user]);
};

export default useGetAppliedJobs;
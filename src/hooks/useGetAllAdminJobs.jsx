import { JOB_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import { setAllAdminJobs } from "@/redux/jobSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

const useGetAllAdminJobs = () => {

  const dispatch = useDispatch();

  useEffect(() => {

    const fetchAllAdminJobs = async () => {

      try {

        const res = await axios.get(
          `${JOB_API_END_POINT}/getadminjobs`,
          { withCredentials: true }
        );

        if (res?.data?.success) {

          dispatch(setAllAdminJobs(res.data.jobs));

        }

      } catch (error) {

        console.log(error);

        toast.error(
          error.response?.data?.message ||
          "Failed to fetch admin jobs"
        );

      }

    };

    fetchAllAdminJobs();

  }, [dispatch]);

};

export default useGetAllAdminJobs;
import { createSlice } from "@reduxjs/toolkit";

const applicationSlice = createSlice({
  name: "application",
  initialState: {
    applicants: [],
  },
  reducers: {
    setAllApplicants: (state, action) => {
      state.applicants = action.payload || [];
    },
    updateApplicantStatus: (state, action) => {
      const { id, status } = action.payload;
      const list =
        state.applicants?.applications ||
        state.applicants?.applicants ||
        (Array.isArray(state.applicants) ? state.applicants : null);
      if (list) {
        const item = list.find((app) => app._id === id);
        if (item) {
          item.status = status.toLowerCase();
        }
      }
    },
  },
});

export const { setAllApplicants, updateApplicantStatus } = applicationSlice.actions;

export default applicationSlice.reducer;

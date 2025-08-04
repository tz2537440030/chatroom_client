import { createSlice } from "@reduxjs/toolkit";

const getInitialMomentState = () => {
  return {
    momentList: [] as any,
  };
};

export const momentSlice = createSlice({
  name: "moment",
  initialState: getInitialMomentState(),
  reducers: {
    setMomentList: (state, action) => {
      const { momentList } = action.payload;
      state.momentList = momentList;
    },
    setMoment: (state, action) => {
      const { moment } = action.payload;
      state.momentList = state.momentList.map((item: any) =>
        item.id === moment.id ? moment : item,
      );
    },
  },
});

export const { setMomentList, setMoment } = momentSlice.actions;

export default momentSlice.reducer;

// Selectors
export const selectMomentList = (state: { moment: { momentList: any } }) =>
  state.moment.momentList;

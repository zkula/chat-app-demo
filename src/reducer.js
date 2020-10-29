export const initialState = {
    user: "Guest",
  };
  
  //Selector
  //Reduce func adds up total value of an array and returns the amount
  
  const reducer = (state, action) => {
    console.log(action);
    switch (action.type) {
      case "SET_USER":
        return {
          ...state,
          user: action.user,
        };
      
      default:
        return state;
    }
  };
  
  export default reducer;
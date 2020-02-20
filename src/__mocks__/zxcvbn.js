const zxcvbn = jest.fn(password => {
  switch (password) {
    case "GoodPassword":
      return { score: 4 };
    case "BadPassword":
      return {
        feedback: {
          suggestions: ["Suggestion 1", "Suggestion 2"]
        },
        score: 1
      };
    default:
      return {
        feedback: {
          suggestions: ["Suggestion 3", "Suggestion 4"]
        },
        score: 0
      };
  }
});

export default zxcvbn;

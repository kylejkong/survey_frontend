import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { nanoid } from "nanoid";

function MyComponent() {
  const [surveys, setSurveys] = useState([]); // State to store the survey data
  const [selectedOptions, setSelectedOptions] = useState({}); // State to store the selected options for each question
  const [currentPage, setCurrentPage] = useState(1); // State to track the current page number
  const [validationError, setValidationError] = useState(false); // State to track validation errors
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessages, setErrorMessages] = useState([]);

  useEffect(() => {
    // Fetches survey data from the API
    const fetchSurveys = async () => {
      try {
        const response = await fetch("http://localhost:1337/api/surveys");
        const data = await response.json();
        console.log("Q", data.data);
        setSurveys(data.data);
      } catch (error) {
        console.log("Error occurred while fetching surveys:", error);
      }
    };

    fetchSurveys();
  }, []);

  const handleRadioChange = (event, questionId) => {
    // Updates the selected option for a question in the state
    setSelectedOptions((prevState) => ({
      ...prevState,
      [questionId]: event.target.value,
    }));

    // Set an empty string for unanswered questions
    if (!event.target.value) {
      setSelectedOptions((prevState) => ({
        ...prevState,
        [questionId]: "",
      }));
    }
  };

  const handleSendClick = async () => {
    try {
      // Proceed with form submission
      const form_id = nanoid(3);
      const time_stamp = moment().format("YYYYMMDDHHmmss");
      const responses = surveys.map((survey) => ({
        surveyQuestion: survey.attributes.question,
        surveyResponse: selectedOptions[survey.id],
        formID: form_id + time_stamp,
      }));

      let isAnyQuestionNotAnswered = false;

      // Array to store IDs of unanswered questions
      let unansweredQuestions = [];

      responses.forEach((response) => {
        console.log("surveyQuestion:", response.surveyQuestion);
        console.log("surveyResponse:", response.surveyResponse);

        // Check if the surveyResponse is empty
        if (response.surveyResponse === undefined) {
          console.log(
            "Validation: Survey response is empty for question:",
            response.surveyQuestion
          );

          // Add the ID of the unanswered question to the array
          unansweredQuestions.push(response.surveyQuestion);

          // No need to set isAnyQuestionNotAnswered to true here
          return;
        }
      });

      // If any question is not answered, display an error and return
      if (unansweredQuestions.length > 0) {
        setValidationError(true);
        console.log("Unanswered questions:", unansweredQuestions);
        setErrorMessages(unansweredQuestions)
        return;
        
      }

      // Clear validation error if all questions are answered
      setValidationError(false);

      // Assuming axios.post returns a successful response

      responses.forEach(async (response) => {
        try {
          const res = await axios.post("http://localhost:1337/api/responses", {
            data: response,
          });
          console.log("Response:", res.data);
        } catch (error) {
          console.error("Error:", error.message);
        }
      });
      const successfulSubmit = true;

      if (successfulSubmit) {
        // Display success message
        setSuccessMessage("Form submitted successfully!");
        console.log("Form submitted successfully!");
        setSelectedOptions({});
        setCurrentPage(1);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  // Filter questions based on the current page and question type
  const filteredSurveys = surveys.filter(
    (survey) => survey.attributes.questionType === currentPage
  );

  return (
    <div>
      {currentPage === 1 && <label>Part 1. 員工資料</label>}
      {currentPage !== 1 && (
        <label>
          Part 2. 員工資料
          <br />
        </label>
      )}
      <br />
      {currentPage !== 1 && (
        <label>
          本問卷設有75項問題，主要是選擇或短答題。
          選擇題設有5個選項，分別是非常不同意、不同意、既不同意也不返對、同意和非常同21意。在部門關係的問題中，「既不同意也不返對」則變為「沒接觸」。
          <br />
        </label>
      )}
      <br />
      {currentPage > 1 && (
        <button onClick={() => setCurrentPage((prevPage) => prevPage - 1)}>
          Previous
        </button>
      )}
      {currentPage < 13 && (
        <button onClick={() => setCurrentPage((prevPage) => prevPage + 1)}>
          Next
        </button>
      )}
      <br />

      {currentPage === 2 && (
        <label>
          <br />
          薪酬與福利
          <br />
        </label>
      )}
      {currentPage === 3 && (
        <label>
          <br />
          直屬主管的管理
          (就以下7-13題，直屬主管是指在日常工作中分配工作予你的員工。當你遇到工作上的問題，你會直接向他或她報告或討論。)
          <br />
        </label>
      )}
      {currentPage === 4 && (
        <label>
          <br />
          集團管理層的管理(就以下14-19題，公司的管理層即主席(Chairman)、行政總裁(CEO)、營運總監(COO)、財務總監(CFO)、策略及投資總監(CSIO)及行政總監(CAO)的意見。)
          <br />
        </label>
      )}
      {currentPage === 5 && (
        <label>
          <br />
          所屬部門關係 (就以下20-25題，所屬部門就是你工作的部門)
          <br />
        </label>
      )}
      {currentPage === 6 && (
        <label>
          <br />
          其他部門關係
          <br />
        </label>
      )}
      {currentPage === 7 && (
        <label>
          <br />
          工作環境和設備
          <br />
        </label>
      )}
      {currentPage === 8 && (
        <label>
          <br />
          學習與發展
          <br />
        </label>
      )}
      {currentPage === 9 && (
        <label>
          <br />
          事業發展
          <br />
        </label>
      )}
      {currentPage === 10 && (
        <label>
          <br />
          工作滿意度
          <br />
        </label>
      )}
      {currentPage === 11 && (
        <label>
          <br />
          賦權 (Empowerment)
          <br />
        </label>
      )}
      {currentPage === 12 && (
        <label>
          <br />
          滿意和忠誠度
          <br />
        </label>
      )}
      {currentPage === 13 && (
        <label>
          <br />
          其他建議
          <br />
        </label>
      )}

      {filteredSurveys.map((survey) => (
        <div key={survey.id} style={{ width: '50%', marginBottom: '10px' }}>
          <h2>{survey.attributes.question}</h2>

          <form>
            {[
              "a",
              "b",
              "c",
              "d",
              "e",
              "f",
              "g",
              "h",
              "i",
              "j",
              "k",
              "l",
              "m",
              "n",
              "o",
            ].map(
              (option) =>
                // Check if the option value exists before rendering the radio button
                survey.attributes[option] && (
                  <label key={option} style={{
                    display: 'block',
                    width: '100%',
                    marginBottom: '5px', // Adjust the margin as needed
                  }}>
                    <input
                      type="radio"
                      name={`question${survey.id}`}
                      value={survey.attributes[option]}
                      checked={
                        selectedOptions[survey.id] === survey.attributes[option]
                      }
                      onChange={(event) => handleRadioChange(event, survey.id)}
                    />
                    {survey.attributes[option]}
                  </label>
                )
            )}
            {currentPage === 13 && (
              <label>
                <input
                  type="text"
                  value={selectedOptions[survey.id] || ""}
                  onChange={(event) => handleRadioChange(event, survey.id)}
                  style={{ width: "70%", padding: "8px" }}
                  placeholder="Example: 在家工作（Work From Home）"
                />
              </label>
            )}
          </form>
        </div>
      ))}

      {/* Validation error message */}
      <br />

      {/* Navigation buttons */}
      {currentPage > 1 && (
        <button onClick={() => setCurrentPage((prevPage) => prevPage - 1)}>
          Previous
        </button>
      )}
      {currentPage < 13 && (
        <button onClick={() => setCurrentPage((prevPage) => prevPage + 1)}>
          Next
        </button>
      )}
      <br />
      <br />
      {currentPage === 13 && <button onClick={handleSendClick}>Send</button>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

      {validationError && (
        <div style={{ color: "red" }}>
          <p>Please answer all questions before submitting.</p>
          {errorMessages}
        </div>
      )}
    </div>
  );
}

export default MyComponent;

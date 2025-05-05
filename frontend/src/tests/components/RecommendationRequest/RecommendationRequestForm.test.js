import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import RecommendationRequestForm, {removeZ} from "main/components/RecommendationRequest/RecommendationRequestForm";
import { RecommendationRequestFixtures } from "fixtures/RecommendationRequestFixtures";

import { QueryClient, QueryClientProvider } from "react-query";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("RecommendationRequestForm tests", () => {

  const queryClient = new QueryClient();

  const expectedHeaders = ["Requester's Email", "Professor's Email", "Explanation", "Date Requested", "Date Needed", "Done"];
  const testId = "RecommendationRequestForm";

  test("renders correctly with no initialContents", async () => {
    render(
        <QueryClientProvider client={queryClient}>
            <Router>
                <RecommendationRequestForm />
            </Router>
        </QueryClientProvider>,
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });
  });

  test("that the removeZ function works properly", () => {
    expect(removeZ("ABC")).toBe("ABC");
    expect(removeZ("ABCZ")).toBe("ABC");
  });

  test("renders correctly with no initialContents", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <RecommendationRequestForm />
        </Router>
      </QueryClientProvider>,
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });
  });

  test("renders correctly when passing in initialContents", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <RecommendationRequestForm initialContents={RecommendationRequestFixtures.oneRecommendationRequest} />
        </Router>
      </QueryClientProvider>,
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expect(await screen.findByTestId(`${testId}-id`)).toBeInTheDocument();
    expect(screen.getByText(`Id`)).toBeInTheDocument();

    expect(screen.getByLabelText("Id")).toHaveValue(String(RecommendationRequestFixtures.oneRecommendationRequest.id));
    //expect(screen.getByLabelText("Requester's Email")).toHaveValue(RecommendationRequestFixtures.oneRecommendationRequest.requesterEmail);
    //expect(screen.getByLabelText("professorEmail")).toHaveValue(RecommendationRequestFixtures.oneRecommendationRequest.professorEmail);
    //expect(screen.getByLabelText("explanation")).toHaveValue(RecommendationRequestFixtures.oneRecommendationRequest.explanation);
    //expect(screen.getByLabelText("done")).toHaveValue(RecommendationRequestFixtures.oneRecommendationRequest.done);
  });

  test("that navigate(-1) is called when Cancel is clicked", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <RecommendationRequestForm />
        </Router>
      </QueryClientProvider>,
    );
    expect(await screen.findByTestId(`${testId}-cancel`)).toBeInTheDocument();
    const cancelButton = screen.getByTestId(`${testId}-cancel`);

    fireEvent.click(cancelButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });

  test("that the correct validations are performed", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <RecommendationRequestForm />
        </Router>
      </QueryClientProvider>,
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();
    const submitButton = screen.getByText(/Create/);
    fireEvent.click(submitButton);

    await screen.findByText(/Requester's email is required./);
    expect(screen.getByText(/Professor's email is required./)).toBeInTheDocument();
    expect(screen.getByText(/Explanation is required./)).toBeInTheDocument();
    expect(screen.getByText(/Date requested is required./)).toBeInTheDocument();
    expect(screen.getByText(/Date needed is required./)).toBeInTheDocument();
    expect(screen.getByText(/Done is required/)).toBeInTheDocument();

    const nameInput = screen.getByTestId(`${testId}-explanation`);
    fireEvent.change(nameInput, { target: { value: "a".repeat(1001) } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Max length 1000 characters/)).toBeInTheDocument();
    });
  });

  test("maxLength validation works for email fields", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <RecommendationRequestForm />
        </Router>
      </QueryClientProvider>
    );

    // Find form fields
    const requesterEmailInput = screen.getByLabelText(/Requester's Email/i);
    const professorEmailInput = screen.getByLabelText(/Professor's Email/i);
    const submitButton = screen.getByTestId(`${testId}-submit`);

    // Enter value that exceeds max length
    const tooLongEmail = "a".repeat(256) + "@example.com";
    
    // Test requesterEmail validation
    fireEvent.change(requesterEmailInput, { target: { value: tooLongEmail } });
    fireEvent.click(submitButton);
    
    // We should see the max length error message
    await waitFor(() => {
      expect(screen.getByText("Max length 255 characters")).toBeInTheDocument();
    });

    // Clear and try with professorEmail
    fireEvent.change(requesterEmailInput, { target: { value: "valid@example.com" } });
    fireEvent.change(professorEmailInput, { target: { value: tooLongEmail } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText("Max length 255 characters")).toBeInTheDocument();
    });
  });
});

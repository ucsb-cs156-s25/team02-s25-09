import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import ArticlesForm from "main/components/Articles/ArticlesForm";
import { articlesFixtures } from "fixtures/articlesFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

describe("ArticlesForm tests", () => {
  test("renders correctly", async () => {
    render(
      <Router>
        <ArticlesForm />
      </Router>
    );
    await screen.findByText(/Title/);
    await screen.findByText(/Create/);
  });

  test("renders correctly when passing in an article", async () => {
    render(
      <Router>
        <ArticlesForm initialContents={articlesFixtures.oneArticle} />
      </Router>
    );
    await screen.findByTestId(/ArticlesForm-id/);
    expect(screen.getByText(/ID/)).toBeInTheDocument();
    expect(screen.getByTestId(/ArticlesForm-id/)).toHaveValue("1");
  });

  test("Correct error messages on bad input", async () => {
    render(
      <Router>
        <ArticlesForm />
      </Router>
    );
    await screen.findByTestId("ArticlesForm-title");

    fireEvent.change(screen.getByTestId("ArticlesForm-url"), {
      target: { value: "not-a-url" },
    });
    fireEvent.change(screen.getByTestId("ArticlesForm-email"), {
      target: { value: "bademail" },
    });
    fireEvent.change(screen.getByTestId("ArticlesForm-dateAdded"), {
      target: { value: "bad-date" },
    });

    fireEvent.click(screen.getByTestId("ArticlesForm-submit"));

    await screen.findByText(/Enter a valid URL/);
    expect(screen.getByText(/Enter a valid email address/)).toBeInTheDocument();
    expect(screen.getByText(/Date must be in ISO format/)).toBeInTheDocument();
  });

  test("Correct error messages on missing input", async () => {
    render(
      <Router>
        <ArticlesForm />
      </Router>
    );
    fireEvent.click(screen.getByTestId("ArticlesForm-submit"));

    await screen.findByText(/Title is required/);
    expect(screen.getByText(/URL is required/)).toBeInTheDocument();
    expect(screen.getByText(/Explanation is required/)).toBeInTheDocument();
    expect(screen.getByText(/Email is required/)).toBeInTheDocument();
    expect(screen.getByText(/Date Added is required/)).toBeInTheDocument();
  });

  test("No error messages on good input", async () => {
    const mockSubmitAction = jest.fn();

    render(
      <Router>
        <ArticlesForm submitAction={mockSubmitAction} />
      </Router>
    );

    fireEvent.change(screen.getByLabelText("Title"), {
      target: { value: "Good Title" },
    });
    fireEvent.change(screen.getByLabelText("URL"), {
      target: { value: "https://valid.com" },
    });
    fireEvent.change(screen.getByLabelText("Explanation"), {
      target: { value: "Good explanation" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "good@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Date Added (ISO format)"), {
      target: { value: "2024-05-01T10:00" },
    });

    fireEvent.click(screen.getByTestId("ArticlesForm-submit"));

    await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

    expect(
      screen.queryByText(/Enter a valid URL/)
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Enter a valid email address/)
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Date must be in ISO format/)
    ).not.toBeInTheDocument();
  });

  test("navigate(-1) is called on cancel", async () => {
    render(
      <Router>
        <ArticlesForm />
      </Router>
    );

    fireEvent.click(screen.getByTestId("ArticlesForm-cancel"));

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });
});
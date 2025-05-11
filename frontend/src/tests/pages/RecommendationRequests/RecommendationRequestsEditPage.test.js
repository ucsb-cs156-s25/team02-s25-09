import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import RecommendationRequestsEditPage from "main/pages/RecommendationRequests/RecommendationRequestsEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "jest-mock-console";

const mockToast = jest.fn();
jest.mock("react-toastify", () => {
  const originalModule = jest.requireActual("react-toastify");
  return {
    __esModule: true,
    ...originalModule,
    toast: (x) => mockToast(x),
  };
});

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");
  return {
    __esModule: true,
    ...originalModule,
    useParams: () => ({
      id: 17,
    }),
    Navigate: (x) => {
      mockNavigate(x);
      return null;
    },
  };
});

describe("RecommendationRequestsEditPage tests", () => {
  describe("when the backend doesn't return data", () => {
    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(() => {
      axiosMock.reset();
      axiosMock.resetHistory();
      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock
        .onGet("/api/systemInfo")
        .reply(200, systemInfoFixtures.showingNeither);
      axiosMock
        .onGet("/api/recommendationrequests", { params: { id: 17 } })
        .timeout();
    });

    const queryClient = new QueryClient();
    test("renders header but form is not present", async () => {
      const restoreConsole = mockConsole();

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <RecommendationRequestsEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      await screen.findByText("Edit Recommendation Request");
      expect(
        screen.queryByTestId("RecommendationRequest-requesterEmail"),
      ).not.toBeInTheDocument();
      restoreConsole();
    });
  });

  describe("tests where backend is working normally", () => {
    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(() => {
      axiosMock.reset();
      axiosMock.resetHistory();
      axiosMock
        .onGet("/api/currentUser")
        .reply(200, apiCurrentUserFixtures.userOnly);
      axiosMock
        .onGet("/api/systemInfo")
        .reply(200, systemInfoFixtures.showingNeither);
      axiosMock
        .onGet("/api/recommendationrequests", { params: { id: 17 } })
        .reply(200, {
          id: 17,
          requesterEmail: "cgaucho@ucsb.edu",
          professorEmail: "phtcon@ucsb.edu",
          explanation: "BS/MS program",
          dateRequested: "2022-04-20",
          dateNeeded: "2022-05-01",
          done: false,
        });
      axiosMock.onPut("/api/recommendationrequests").reply(200, {
        id: 17,
        requesterEmail: "cgaucho@ucsb.edu",
        professorEmail: "phtcon@ucsb.edu",
        explanation: "PhD CS Stanford",
        dateRequested: "2022-04-20T00:00:00.018Z",
        dateNeeded: "2022-05-01T00:00:00.018Z",
        done: true,
      });
    });

    const queryClient = new QueryClient();

    test("Is populated with the data provided", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <RecommendationRequestsEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("RecommendationRequestForm-id");

      const idField = screen.getByTestId("RecommendationRequestForm-id");
      const requesterEmailField = screen.getByLabelText("Requester's Email");
      const professorEmailField = screen.getByLabelText("Professor's Email");
      const explanationField = screen.getByTestId(
        "RecommendationRequestForm-explanation",
      );
      const dateRequestedField = screen.getByTestId(
        "RecommendationRequestForm-dateRequested",
      );
      const dateNeededField = screen.getByTestId(
        "RecommendationRequestForm-dateNeeded",
      );
      const doneField = screen.getByLabelText("Done");

      const submitButton = screen.getByTestId(
        "RecommendationRequestForm-submit",
      );

      expect(idField).toBeInTheDocument();
      expect(idField).toHaveValue("17");

      expect(requesterEmailField).toBeInTheDocument();
      expect(requesterEmailField).toHaveValue("cgaucho@ucsb.edu");

      expect(professorEmailField).toBeInTheDocument();
      expect(professorEmailField).toHaveValue("phtcon@ucsb.edu");

      expect(explanationField).toBeInTheDocument();
      expect(explanationField).toHaveValue("BS/MS program");

      expect(dateRequestedField).toBeInTheDocument();
      expect(dateRequestedField).toHaveValue("2022-04-20");

      expect(dateNeededField).toBeInTheDocument();
      expect(dateNeededField).toHaveValue("2022-05-01");

      expect(doneField).toBeInTheDocument();
      expect(doneField).toHaveValue("false"); // Not .not.toBeChecked()

      expect(submitButton).toHaveTextContent("Update");

      fireEvent.change(requesterEmailField, {
        target: { value: "cgaucho@ucsb.edu" },
      });
      fireEvent.change(professorEmailField, {
        target: { value: "phtcon@ucsb.edu" },
      });
      fireEvent.change(explanationField, {
        target: { value: "PhD CS Stanford program" },
      });
      fireEvent.change(dateRequestedField, {
        target: { value: "2022-04-20" }, // Use YYYY-MM-DD format
      });
      fireEvent.change(dateNeededField, {
        target: { value: "2022-05-01" }, // Use YYYY-MM-DD format
      });
      fireEvent.change(doneField, {
        target: { value: "true" }, // String "true", not boolean
      });

      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toHaveBeenCalled());
      expect(mockToast).toHaveBeenCalledWith(
        "Recommendation Request Updated - id: 17 requesterEmail: cgaucho@ucsb.edu",
      );

      expect(mockNavigate).toHaveBeenCalledWith({
        to: "/recommendationrequests",
      });

      expect(axiosMock.history.put.length).toBe(1); // times called
      expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
      expect(axiosMock.history.put[0].data).toBe(
        JSON.stringify({
          requesterEmail: "cgaucho@ucsb.edu",
          professorEmail: "phtcon@ucsb.edu",
          explanation: "PhD CS Stanford program",
          dateRequested: "2022-04-20T00:00:00.000Z",
          dateNeeded: "2022-05-01T00:00:00.000Z",
          done: true,
        }),
      ); // posted object
      expect(mockNavigate).toHaveBeenCalledWith({
        to: "/recommendationrequests",
      });
    });

    // test("Changes when you click Update", async () => {
    //   render(
    //     <QueryClientProvider client={queryClient}>
    //       <MemoryRouter>
    //         <RecommendationRequestsEditPage />
    //       </MemoryRouter>
    //     </QueryClientProvider>,
    //   );

    //   const idField             = screen.getByTestId("RecommendationRequestForm-id");
    //   const requesterEmailField = screen.getByLabelText("Requester's Email");
    //   const professorEmailField = screen.getByLabelText("Professor's Email");
    //   const explanationField    = screen.getByTestId("RecommendationRequestForm-explanation");
    //   const dateRequestedField  = screen.getByTestId("RecommendationRequestForm-dateRequested");
    //   const dateNeededField     = screen.getByTestId("RecommendationRequestForm-dateNeeded");
    //   const doneField           = screen.getByLabelText("Done");

    //   const submitButton        = screen.getByTestId("RecommendationRequestForm-submit");

    //   expect(idField).toBeInTheDocument();
    //   expect(idField).toHaveValue("17");

    //   expect(requesterEmailField).toBeInTheDocument();
    //   expect(requesterEmailField).toHaveValue("cgaucho@ucsb.edu");

    //   expect(professorEmailField).toBeInTheDocument();
    //   expect(professorEmailField).toHaveValue("phtcon@ucsb.edu");

    //   expect(explanationField).toBeInTheDocument();
    //   expect(explanationField).toHaveValue("BS/MS program");

    //   expect(dateRequestedField).toBeInTheDocument();
    //   expect(dateRequestedField).toHaveValue("2022-04-20");

    //   expect(dateNeededField).toBeInTheDocument();
    //   expect(dateNeededField).toHaveValue("2022-05-01");

    //   expect(doneField).toBeInTheDocument();
    //   expect(doneField).toHaveValue("false"); // Not .not.toBeChecked()

    //   expect(submitButton).toHaveTextContent("Update");

    //   fireEvent.change(nameField, {
    //     target: { value: "Freebirds World Burrito" },
    //   });
    //   fireEvent.change(descriptionField, { target: { value: "Big Burritos" } });

    //   fireEvent.click(submitButton);

    //   await waitFor(() => expect(mockToast).toHaveBeenCalled());
    //   expect(mockToast).toHaveBeenCalledWith(
    //     "Restaurant Updated - id: 17 name: Freebirds World Burrito",
    //   );
    //   expect(mockNavigate).toHaveBeenCalledWith({ to: "/recommendationrequests" });
    // });
  });
});

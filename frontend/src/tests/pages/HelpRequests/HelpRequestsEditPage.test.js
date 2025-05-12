import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import HelpRequestsEditPage from "main/pages/HelpRequests/HelpRequestsEditPage";

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

describe("HelpRequestsEditPage tests", () => {
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
      axiosMock.onGet("/api/helprequests", { params: { id: 17 } }).timeout();
    });

    const queryClient = new QueryClient();
    test("renders header but form is not present", async () => {
      const restoreConsole = mockConsole();

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <HelpRequestsEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      await screen.findByText("Edit Help Request");
      expect(
        screen.queryByTestId("Help Request-requesterEmail"),
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
      axiosMock.onGet("/api/helprequests", { params: { id: 17 } }).reply(200, {
        id: 17,
        requesterEmail: "jsanchez98@ucsb.edu",
        teamId: "s22-5pm-3",
        tableOrBreakoutRoom: "9",
        requestTime: "2022-04-20T17:12:35",
        explanation: "I need help",
        solved: false,
      });
      axiosMock.onPut("/api/helprequests").reply(200, {
        id: 17,
        requesterEmail: "um@ucsb.edu",
        teamId: "s22-5pm-9",
        tableOrBreakoutRoom: "3",
        requestTime: "2004-02-12T21:45:26",
        explanation: "OH GAWD PLZ NO!!",
        solved: false,
      });
    });

    const queryClient = new QueryClient();

    test("Is populated with the data provided", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <HelpRequestsEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("HelpRequestForm-id");

      const idField = screen.getByTestId("HelpRequestForm-id");
      const requesterEmailField = screen.getByTestId(
        "HelpRequestForm-requesterEmail",
      );
      const teamIdField = screen.getByTestId("HelpRequestForm-teamId");
      const tableOrBreakoutRoomField = screen.getByTestId(
        "HelpRequestForm-tableOrBreakoutRoom",
      );
      const requestTimeField = screen.getByTestId(
        "HelpRequestForm-requestTime",
      );
      const explanationField = screen.getByTestId(
        "HelpRequestForm-explanation",
      );
      const solvedField = screen.getByTestId("HelpRequestForm-solved");
      const submitButton = screen.getByTestId("HelpRequestForm-submit");

      expect(idField).toBeInTheDocument();
      expect(idField).toHaveValue("17");
      expect(requesterEmailField).toBeInTheDocument();
      expect(requesterEmailField).toHaveValue("jsanchez98@ucsb.edu");

      expect(teamIdField).toBeInTheDocument();
      expect(teamIdField).toHaveValue("s22-5pm-3");

      expect(tableOrBreakoutRoomField).toBeInTheDocument();
      expect(tableOrBreakoutRoomField).toHaveValue("9");

      expect(requestTimeField).toBeInTheDocument();
      expect(requestTimeField).toHaveValue("2022-04-20T17:12:35.000");

      expect(explanationField).toBeInTheDocument();
      expect(explanationField).toHaveValue("I need help");

      expect(solvedField).toBeInTheDocument();
      expect(solvedField).not.toBeChecked();

      expect(submitButton).toHaveTextContent("Update");

      fireEvent.change(requesterEmailField, {
        target: { value: "um@ucsb.edu" },
      });
      fireEvent.change(teamIdField, {
        target: { value: "s22-5pm-9" },
      });
      fireEvent.change(tableOrBreakoutRoomField, {
        target: { value: "3" },
      });
      fireEvent.change(requestTimeField, {
        target: { value: "2004-02-12T21:45:26.000" },
      });
      fireEvent.change(explanationField, {
        target: { value: "OH GAWD PLZ NO!!" },
      });
      fireEvent.change(solvedField, {
        target: { value: false },
      });
      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toHaveBeenCalled());
      expect(mockToast).toHaveBeenCalledWith(
        "Help Request Updated - id: 17 requesterEmail: um@ucsb.edu",
      );

      expect(mockNavigate).toHaveBeenCalledWith({ to: "/helprequests" });

      expect(axiosMock.history.put.length).toBe(1); // times called
      expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
      expect(axiosMock.history.put[0].data).toBe(
        JSON.stringify({
          requesterEmail: "um@ucsb.edu",
          teamId: "s22-5pm-9",
          tableOrBreakoutRoom: "3",
          requestTime: "2004-02-12T21:45:26.000",
          explanation: "OH GAWD PLZ NO!!",
          solved: false,
        }),
      ); // posted object
    });

    test("Changes when you click Update", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <HelpRequestsEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("HelpRequestForm-id");

      const idField = screen.getByTestId("HelpRequestForm-id");
      const requesterEmailField = screen.getByTestId(
        "HelpRequestForm-requesterEmail",
      );
      const teamIdField = screen.getByTestId("HelpRequestForm-teamId");
      const tableOrBreakoutRoomField = screen.getByTestId(
        "HelpRequestForm-tableOrBreakoutRoom",
      );
      const requestTimeField = screen.getByTestId(
        "HelpRequestForm-requestTime",
      );
      const explanationField = screen.getByTestId(
        "HelpRequestForm-explanation",
      );
      const solvedField = screen.getByTestId("HelpRequestForm-solved");
      const submitButton = screen.getByTestId("HelpRequestForm-submit");

      expect(idField).toBeInTheDocument();
      expect(idField).toHaveValue("17");
      expect(requesterEmailField).toBeInTheDocument();
      expect(requesterEmailField).toHaveValue("jsanchez98@ucsb.edu");

      expect(teamIdField).toBeInTheDocument();
      expect(teamIdField).toHaveValue("s22-5pm-3");

      expect(tableOrBreakoutRoomField).toBeInTheDocument();
      expect(tableOrBreakoutRoomField).toHaveValue("9");

      expect(requestTimeField).toBeInTheDocument();
      expect(requestTimeField).toHaveValue("2022-04-20T17:12:35.000");

      expect(explanationField).toBeInTheDocument();
      expect(explanationField).toHaveValue("I need help");

      expect(solvedField).toBeInTheDocument();
      expect(solvedField).not.toBeChecked();

      expect(submitButton).toHaveTextContent("Update");

      fireEvent.change(requesterEmailField, {
        target: { value: "um@ucsb.edu" },
      });
      fireEvent.change(teamIdField, {
        target: { value: "s22-5pm-9" },
      });
      fireEvent.change(tableOrBreakoutRoomField, {
        target: { value: "3" },
      });
      fireEvent.change(requestTimeField, {
        target: { value: "2004-02-12T21:45:26.000" },
      });
      fireEvent.change(explanationField, {
        target: { value: "OH GAWD PLZ NO!!" },
      });
      fireEvent.change(solvedField, {
        target: { value: false },
      });

      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toBeCalled());
      expect(mockToast).toHaveBeenCalledWith(
        "Help Request Updated - id: 17 requesterEmail: um@ucsb.edu",
      );
      expect(mockNavigate).toHaveBeenCalledWith({ to: "/helprequests" });
    });
  });
});

import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import MenuItemReviewsEditPage from "main/pages/MenuItemReviews/MenuItemReviewsEditPage";

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

describe("MenuItemReviewsEditPage tests", () => {
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
      axiosMock.onGet("/api/menuitemreview", { params: { id: 17 } }).timeout();
    });

    const queryClient = new QueryClient();
    test("renders header but form is not present", async () => {
      const restoreConsole = mockConsole();

      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <MenuItemReviewsEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );
      await screen.findByText("Edit Menu Item Review");
      expect(
        screen.queryByTestId("MenuItemReviewsForm-itemId"),
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
        .onGet("/api/menuitemreview", { params: { id: 17 } })
        .reply(200, {
          id: 17,
          itemId: 1,
          reviewerEmail: "jasonzhao@ucsb.edu",
          stars: 5,
          dateReviewed: "2025-05-03T06:19:23",
          comments: "good",
        });
      axiosMock.onPut("/api/menuitemreview").reply(200, {
        id: 17,
        itemId: 3,
        reviewerEmail: "jasonz2005@gmail.com",
        stars: 3,
        dateReviewed: "2025-05-03T06:20:50",
        comments: "mid",
      });
    });

    const queryClient = new QueryClient();

    test("Is populated with the data provided", async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <MenuItemReviewsEditPage />
          </MemoryRouter>
        </QueryClientProvider>,
      );

      await screen.findByTestId("MenuItemReviewForm-id");

      const idField = screen.getByTestId("MenuItemReviewForm-id");
      const itemIdField = screen.getByLabelText("Item Id");
      const reviewerEmailField = screen.getByLabelText("Reviewer Email");
      const starsField = screen.getByLabelText("Stars");
      const dateReviewedField = screen.getByLabelText(
        "Date Reviewed(iso format)",
      );
      const commentsField = screen.getByLabelText("Comments");
      const submitButton = screen.getByTestId("MenuItemReviewForm-submit");

      expect(idField).toBeInTheDocument();
      expect(idField).toHaveValue("17");
      expect(itemIdField).toBeInTheDocument();
      expect(itemIdField).toHaveValue("1");
      expect(reviewerEmailField).toBeInTheDocument();
      expect(reviewerEmailField).toHaveValue("jasonzhao@ucsb.edu");
      expect(starsField).toBeInTheDocument();
      expect(starsField).toHaveValue("5");
      expect(dateReviewedField).toBeInTheDocument();
      expect(dateReviewedField).toHaveValue("2025-05-03T06:19:23.000");
      expect(commentsField).toBeInTheDocument();
      expect(commentsField).toHaveValue("good");

      expect(submitButton).toHaveTextContent("Update");

      fireEvent.change(itemIdField, {
        target: { value: "3" },
      });
      fireEvent.change(reviewerEmailField, {
        target: { value: "jasonz2005@gmail.com" },
      });
      fireEvent.change(starsField, {
        target: { value: "3" },
      });
      fireEvent.change(dateReviewedField, {
        target: { value: "2025-05-03T06:20:50" },
      });
      fireEvent.change(commentsField, {
        target: { value: "mid" },
      });
      fireEvent.click(submitButton);

      await waitFor(() => expect(mockToast).toHaveBeenCalled());
      expect(mockToast).toHaveBeenCalledWith(
        "Menu Item Review Updated - id: 17 itemId: 3",
      );

      expect(mockNavigate).toHaveBeenCalledWith({ to: "/menuitemreviews" });

      expect(axiosMock.history.put.length).toBe(1); // times called
      expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
      expect(axiosMock.history.put[0].data).toBe(
        JSON.stringify({
          itemId: "3",
          reviewerEmail: "jasonz2005@gmail.com",
          stars: "3",
          dateReviewed: "2025-05-03T06:20:50.000",
          comments: "mid",
        }),
      ); // posted object
      expect(mockNavigate).toHaveBeenCalledWith({ to: "/menuitemreviews" });
    });

    // test("Changes when you click Update", async () => {
    //   render(
    //     <QueryClientProvider client={queryClient}>
    //       <MemoryRouter>
    //         <MenuItemReviewsEditPage />
    //       </MemoryRouter>
    //     </QueryClientProvider>,
    //   );

    //   await screen.findByTestId("MenuItemReviewForm-id");

    //   const idField = screen.getByTestId("MenuItemReviewForm-id");
    //   const itemIdField = screen.getByLabelText("Item Id");
    //   const reviewerEmailField = screen.getByLabelText("Reviewer Email");
    //   const starsField = screen.getByLabelText("Stars");
    //   const dateReviewedField = screen.getByLabelText("Date Reviewed(iso format)");
    //   const commentsField = screen.getByLabelText("Comments");
    //   const submitButton = screen.getByTestId("MenuItemReviewForm-submit");

    //   expect(idField).toHaveValue("17");
    //   expect(itemIdField).toHaveValue("1");
    //   expect(reviewerEmailField).toHaveValue("jasonzhao@ucsb.edu");
    //   expect(starsField).toHaveValue("5");
    //   expect(dateReviewedField).toHaveValue("2025-05-03T06:19:23.000");
    //   expect(commentsField).toHaveValue("good");
    //   expect(submitButton).toBeInTheDocument();

    //   fireEvent.change(nameField, {
    //     target: { value: "Freebirds World Burrito" },
    //   });
    //   fireEvent.change(descriptionField, { target: { value: "Big Burritos" } });

    //   fireEvent.click(submitButton);

    //   await waitFor(() => expect(mockToast).toBeCalled());
    //   expect(mockToast).toHaveBeenCalledWith(
    //     "Restaurant Updated - id: 17 name: Freebirds World Burrito",
    //   );
    //   expect(mockNavigate).toBeCalledWith({ to: "/restaurants" });
    // });
  });
});

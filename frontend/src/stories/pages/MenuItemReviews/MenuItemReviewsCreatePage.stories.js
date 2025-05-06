import React from "react";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { http, HttpResponse } from "msw";

import MenuItemReviewCreatePage from "main/pages/MenuItemReviews/MenuItemReviewsCreatePage";

import { menuItemReviewFixtures } from "fixtures/menuItemReviewFixtures";

export default {
  title: "pages/MenuItemReviews/MenuItemReviewsCreatePage",
  component: MenuItemReviewCreatePage,
};

const Template = () => <MenuItemReviewCreatePage storybook={true} />;

export const Default = Template.bind({});
Default.parameters = {
  msw: [
    http.get("/api/currentUser", () => {
      return HttpResponse.json(apiCurrentUserFixtures.userOnly, {
        status: 200,
      });
    }),
    http.get("/api/systemInfo", () => {
      return HttpResponse.json(systemInfoFixtures.showingNeither, {
        status: 200,
      });
    }),
    http.post("/api/menuitemreview/post", () => {
      return HttpResponse.json(menuItemReviewFixtures.oneMenuItemReview, {
        status: 200,
      });
    }),
  ],
};

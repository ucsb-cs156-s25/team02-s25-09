import React from "react";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { http, HttpResponse } from "msw";

import RecommendationRequestsCreatePage from "main/pages/RecommendationRequests/RecommendationRequestsCreatePage";

import { RecommendationRequestFixtures } from "fixtures/RecommendationRequestFixtures";

export default {
  title: "pages/RecommendationRequests/RecommendationRequestsCreatePage",
  component: RecommendationRequestsCreatePage,
};

const Template = () => <RecommendationRequestsCreatePage storybook={true} />;

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
    http.post("/api/recommendationrequests/post", () => {
      return HttpResponse.json(
        RecommendationRequestFixtures.oneRecommendationRequest,
        { status: 200 },
      );
    }),
  ],
};

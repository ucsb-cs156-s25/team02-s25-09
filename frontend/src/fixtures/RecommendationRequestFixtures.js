const RecommendationRequestFixtures = {
  oneRecommendationRequest: {
    id: 1,
    requesterEmail: "cgaucho@ucsb.edu",
    professorEmail: "phtcon@ucsb.edu",
    explanation: "BS/MS program",
    dateRequested: "2022-04-20T00:00:00.018Z",
    dateNeeded: "2022-05-01T00:00:00.018Z",
    done: false,
  },
  threeRecommendationRequests: [
    {
      id: 2,
      requesterEmail: "ldelplaya@ucsb.edu",
      professorEmail: "richert@ucsb.edu",
      explanation: "PhD CS Stanford",
      dateRequested: "2022-04-20T00:00:00.018Z",
      dateNeeded: "2022-11-11T00:00:00.018Z",
      done: false,
    },
    {
      id: 3,
      requesterEmail: "rubenking123@ucsb.edu",
      professorEmail: "kingbob321@ucsb.edu",
      explanation: "PhD CS MIT",
      dateRequested: "2022-10-29T00:00:00.018Z",
      dateNeeded: "2023-01-21T00:00:00.018Z",
      done: true,
    },
    {
      id: 4,
      requesterEmail: "alu@ucsb.edu",
      professorEmail: "csguyprofessor@ucsb.edu",
      explanation: "PhD CE Cal Tech",
      dateRequested: "2020-11-19T00:00:00.018Z",
      dateNeeded: "2024-04-06T00:00:00.018Z",
      done: false,
    },
  ],
};

export { RecommendationRequestFixtures };

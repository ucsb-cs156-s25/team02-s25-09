const helpRequestFixtures = {
  oneRequest: {
    id: 1,
    requesterEmail: "jsanchez98@ucsb.edu",
    teamId: "s22-5pm-3",
    tableOrBreakoutRoom: "9",
    requestTime: "2022-04-20T17:12:35",
    explanation: "I need help",
    solved: false,
  },
  threeRequests: [
    {
      id: 1,
      requesterEmail: "jsanchez98@ucsb.edu",
      teamId: "s22-5pm-3",
      tableOrBreakoutRoom: "9",
      requestTime: "2022-04-20T17:12:35",
      explanation: "I need help",
      solved: false,
    },
    {
      id: 2,
      requesterEmail: "brooooooooo@ucsb.edu",
      teamId: "s22-6pm-12",
      tableOrBreakoutRoom: "12",
      requestTime: "2004-02-12T19:21:21",
      explanation: "HELP ME! ... HELP MEE!!",
      solved: false,
    },
    {
      id: 3,
      requesterEmail: "nointernetaccess@ucsb.edu",
      teamId: "s25-5pm-9",
      tableOrBreakoutRoom: "3",
      requestTime: "2025-05-01T16:26:21",
      explanation: "Necesito Ayuda",
      solved: false,
    },
  ],
};

export { helpRequestFixtures };

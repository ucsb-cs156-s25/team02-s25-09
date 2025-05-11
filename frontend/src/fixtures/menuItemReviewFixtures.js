const menuItemReviewFixtures = {
  oneMenuItemReview: {
    id: 1,
    itemId: 1,
    reviewerEmail: "jasonzhao@ucsb.edu",
    stars: 5,
    dateReviewed: "2025-05-03T06:19:23",
    comments: "good",
  },

  threeMenuItemReviews: [
    {
      id: 1,
      itemId: 1,
      reviewerEmail: "jasonzhao@ucsb.edu",
      stars: 5,
      dateReviewed: "2025-05-03T06:19:23",
      comments: "good",
    },
    {
      id: 2,
      itemId: 3,
      reviewerEmail: "jasonz2005@gmail.com",
      stars: 3,
      dateReviewed: "2025-05-03T06:20:50",
      comments: "mid",
    },
    {
      id: 3,
      itemId: 6,
      reviewerEmail: "jasonzzz2005@gmail.com",
      stars: 1,
      dateReviewed: "2025-05-03T06:25:50",
      comments: "terrible",
    },
  ],
};

export { menuItemReviewFixtures };

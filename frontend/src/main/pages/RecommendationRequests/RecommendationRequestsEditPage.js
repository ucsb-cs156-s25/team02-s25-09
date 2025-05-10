import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import RecommendationRequestForm from "main/components/RecommendationRequests/RecommendationRequestForm";
import { Navigate } from "react-router-dom";
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function RecommendationRequestsEditPage({ storybook = false }) {
  let { id } = useParams();

  const {
    data: recommendationrequests,
    _error,
    _status,
  } = useBackend(
    // Stryker disable next-line all : don't test internal caching of React Query
    [`/api/recommendationrequests?id=${id}`],
    {
      // Stryker disable next-line all : GET is the default, so mutating this to "" doesn't introduce a bug
      method: "GET",
      url: `/api/recommendationrequests`,
      params: {
        id,
      },
    },
  );


  const objectToAxiosPutParams = (recommendationrequests) => {
    // Ensure dates are properly formatted for the backend
    // Stryker disable next-line all
    const formatDate = (dateString) => {
      // Stryker disable next-line all
      if (!dateString) return dateString;
      // If the date is already in ISO format, return it
      // Stryker disable next-line all
      if (dateString.includes('T')) return dateString;
      // Otherwise, convert YYYY-MM-DD to ISO format with time
      const date = new Date(dateString);
      return date.toISOString();
    };

    return {
      url: "/api/recommendationrequests",
      method: "PUT",
      params: {
        id: recommendationrequests.id,
      },
      data: {
        requesterEmail: recommendationrequests.requesterEmail,
        professorEmail: recommendationrequests.professorEmail,
        explanation:    recommendationrequests.explanation,
        dateRequested:  formatDate(recommendationrequests.dateRequested),
        dateNeeded:     formatDate(recommendationrequests.dateNeeded),
        // Stryker disable next-line all : don't test 
        done:           recommendationrequests.done === "true" || recommendationrequests.done === true,
      },
    };
  };

  const onSuccess = (recommendationrequests) => {
    toast(`Recommendation Request Updated - id: ${recommendationrequests.id} requesterEmail: ${recommendationrequests.requesterEmail}`);
  };

  const mutation = useBackendMutation(
    objectToAxiosPutParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    [`/api/recommendationrequests?id=${id}`],
  );

  const { isSuccess } = mutation;

  const onSubmit = async (data) => {
    mutation.mutate(data);
  };

  if (isSuccess && !storybook) {
    return <Navigate to="/recommendationrequests" />;
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Edit Recommendation Request</h1>
        {recommendationrequests && (
          <RecommendationRequestForm
            submitAction={onSubmit}
            buttonLabel={"Update"}
            initialContents={recommendationrequests}
          />
        )}
      </div>
    </BasicLayout>
  );
}

import { Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

export function removeZ(myString) {
  return myString.replace("Z", "");
}

function RecommendationRequestForm({
  initialContents,
  submitAction,
  buttonLabel = "Create",
}) {
  // Stryker disable all
  const defaultValues = initialContents
    ? {
        ...initialContents,
        dateRequested: removeZ(initialContents.dateRequested),
        dateNeeded: removeZ(initialContents.dateNeeded),
      }
    : {};
  // Stryker restore all

  // Stryker disable all
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({ defaultValues });
  // Stryker restore all

  // Allows us to go forward and backward in the history stack
  const navigate = useNavigate();

  const testIdPrefix = "RecommendationRequestForm";

  // Stryker disable Regex
  const isodate_regex = /^\d{4}-[01]\d-[0-3]\d$/;
  // Stryker restore Regex

  return (
    <Form onSubmit={handleSubmit(submitAction)}>
      {initialContents && (
        <Form.Group className="mb-3">
          <Form.Label htmlFor="id">Id</Form.Label>
          <Form.Control
            data-testid={testIdPrefix + "-id"}
            id="id"
            type="text"
            {...register("id")}
            value={initialContents.id}
            disabled
          />
        </Form.Group>
      )}

      <Form.Group className="mb-3">
        <Form.Label htmlFor="requesterEmail">Requester's Email</Form.Label>
        <Form.Control
          // data-testid={testIdPrefix + "-requesterEmail"}
          id="requesterEmail"
          type="text"
          isInvalid={Boolean(errors.requesterEmail)}
          {...register("requesterEmail", {
            required: "Requester's email is required.",
            maxLength: {
              value: 255,
              message: "Max length 255 characters",
            },
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.requesterEmail?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="professorEmail">Professor's Email</Form.Label>
        <Form.Control
          // data-testid={testIdPrefix + "-professorEmail"}
          id="professorEmail"
          type="text"
          isInvalid={Boolean(errors.professorEmail)}
          {...register("professorEmail", {
            required: "Professor's email is required.",
            maxLength: {
              value: 255,
              message: "Max length 255 characters",
            },
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.professorEmail?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="explanation">Explanation</Form.Label>
        <Form.Control
          data-testid={testIdPrefix + "-explanation"}
          id="explanation"
          type="text"
          isInvalid={Boolean(errors.explanation)}
          {...register("explanation", {
            required: "Explanation is required.",
            maxLength: {
              value: 1000,
              message: "Max length 1000 characters",
            },
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.explanation?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="dateRequested">Date Requested</Form.Label>
        <Form.Control
          data-testid={testIdPrefix + "-dateRequested"}
          id="dateRequested"
          type="date"
          isInvalid={Boolean(errors.dateRequested)}
          {...register("dateRequested", {
            required: true,
            pattern: isodate_regex,
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.dateRequested && "Date requested is required."}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="dateNeeded">Date Needed</Form.Label>
        <Form.Control
          data-testid={testIdPrefix + "-dateNeeded"}
          id="dateNeeded"
          type="date"
          isInvalid={Boolean(errors.dateNeeded)}
          {...register("dateNeeded", {
            required: true,
            pattern: isodate_regex,
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.dateNeeded && "Date needed is required."}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="done">Done</Form.Label>
        <Form.Select
          // data-testid={testIdPrefix + "-done"}
          id="done"
          isInvalid={Boolean(errors.done)}
          {...register("done", {
            required: "Done is required.",
            // valueAsBoolean: true,
          })}
        >
          <option value="">-- select --</option>
          <option value="true">True</option>
          <option value="false">False</option>
        </Form.Select>
        <Form.Control.Feedback type="invalid">
          {errors.done?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Button type="submit" data-testid={testIdPrefix + "-submit"}>
        {buttonLabel}
      </Button>
      <Button
        variant="Secondary"
        onClick={() => navigate(-1)} // Likewise to navigate, it's the 'back' button
        data-testid={testIdPrefix + "-cancel"}
      >
        Cancel
      </Button>
    </Form>
  );
}

export default RecommendationRequestForm;

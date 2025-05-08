import { Button, Form } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";

function HelpRequestForm({
  initialContents,
  submitAction,
  buttonLabel = "Create",
}) {
  // Stryker disable all
  const {
    control,
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({ defaultValues: initialContents || {} });
  // Stryker restore all

  const navigate = useNavigate();

  const testIdPrefix = "HelpRequestForm";

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
        <Form.Label htmlFor="requesterEmail">Requester Email</Form.Label>
        <Form.Control
          data-testid={testIdPrefix + "-requesterEmail"}
          id="requesterEmail"
          type="text"
          isInvalid={Boolean(errors.requesterEmail)}
          {...register("requesterEmail", {
            required: "Requester Email is required.",
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
        <Form.Label htmlFor="teamId">Team Id</Form.Label>
        <Form.Control
          data-testid={testIdPrefix + "-teamId"}
          id="teamId"
          type="text"
          isInvalid={Boolean(errors.teamId)}
          {...register("teamId", {
            required: "Team Id is required.",
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.teamId?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="tableOrBreakoutRoom">
          Table Or Breakout Room
        </Form.Label>
        <Form.Control
          data-testid={testIdPrefix + "-tableOrBreakoutRoom"}
          id="tableOrBreakoutRoom"
          type="text"
          isInvalid={Boolean(errors.tableOrBreakoutRoom)}
          {...register("tableOrBreakoutRoom", {
            required: "Table or Breakout Room is required.",
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.tableOrBreakoutRoom?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="requestTime">Request Time (iso format)</Form.Label>
        <Form.Control
          type="datetime-local"
          id="requestTime"
          data-testid={`${testIdPrefix}-requestTime`}
          step="1"
          defaultValue={initialContents?.requestTime}
          isInvalid={!!errors.requestTime}
          {...register("requestTime", {
            required: "Request Time is required.",
            validate: (value) =>
              /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(value) ||
              "Please use correct form in the timestamp",
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.requestTime?.message}
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
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.explanation?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Controller
        name="solved"
        control={control}
        rules={{
          validate: (value) =>
            value === true ||
            value === false ||
            "You must indicate whether this is solved.",
        }}
        render={({ field }) => (
          <Form.Group className="mb-3">
            <Form.Label>Solved</Form.Label>
            <div>
              <Form.Check
                inline
                type="radio"
                id="solved-yes"
                label="Yes"
                checked={field.value === true}
                onChange={() => field.onChange(true)}
                isInvalid={!!errors.solved}
              />
              <Form.Check
                inline
                type="radio"
                id="solved-no"
                label="No"
                checked={field.value === false}
                onChange={() => field.onChange(false)}
                isInvalid={!!errors.solved}
              />
            </div>
            <Form.Control.Feedback type="invalid" style={{ display: "block" }}>
              {errors.solved?.message}
            </Form.Control.Feedback>
          </Form.Group>
        )}
      />

      <Button type="submit" data-testid={testIdPrefix + "-submit"}>
        {buttonLabel}
      </Button>
      <Button
        variant="Secondary"
        onClick={() => navigate(-1)}
        data-testid={testIdPrefix + "-cancel"}
      >
        Cancel
      </Button>
    </Form>
  );
}

export default HelpRequestForm;

import React from "react";
import Button from "reactstrap/lib/Button";

/**
 * Component that shows a busy indicator when busy.
 *
 * @reactProps inProgress - If true, the in-progress indicator is shown.
 * @reactProps text - The text to display on the button.
 */
export function BusyButton({
  inProgress,
  text = "Save"
}: {
  inProgress: boolean;
  text?: string;
}) {
  return (
    <Button disabled={inProgress} block={true} color="dark-green" type="submit">
      {text}
    </Button>
  );
}

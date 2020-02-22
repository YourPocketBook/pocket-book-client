import format from "date-fns/format";
import parseDate from "date-fns/parseISO";
import React from "react";
import Col from "reactstrap/lib/Col";
import Row from "reactstrap/lib/Row";
import { useMedication } from "../../hooks/useMedications";
import { Link } from "../../link";
import { PrivatePage } from "../../private-page";
import { MarkdownSkeleton } from "./markdown-skeleton";
import styles from "./medication.module.scss";

/**
 * Component that displays the medication to the user and allows administrators
 * to edit or delete medications.
 *
 * Invalid or expired token is handled by [[PrivatePage]].
 *
 * If the user is offline, it displays the offline warning and disables
 * the edit and delete buttons.
 *
 * If load into state returns nothing or fails, it displays an error message.
 *
 * While the delete request is running, it disables the submit button
 * and displays a "busy" indicator.
 * When the delete request completes, it redirects to the medication list.
 */
export function Medication({ id, reload }: { id: string; reload: boolean }) {
  const { medication, isLoading, loadFailed } = useMedication(id, reload);

  let content;

  if (isLoading && !medication) {
    content = <div>Loading...</div>;
  } else if (!isLoading && (loadFailed || !medication)) {
    content = (
      <React.Fragment>
        <h1>Error Loading Medication</h1>
        <p>We weren't able to load that medication. Try refreshing the page.</p>
      </React.Fragment>
    );
  } else if (medication) {
    content = (
      <React.Fragment>
        <Row>
          <Col>
            <Link
              className="btn btn-link text-decorate-underline"
              href="/medications"
            >
              Go back...
            </Link>
          </Col>
          <Col>
            <h1 className="text-capitalize">
              {(medication.name || "").toLowerCase()}
            </h1>
          </Col>
          <Col />
        </Row>
        <h2>Clinical Condition</h2>
        <h3>Indication</h3>
        <MarkdownSkeleton source={medication.indications} />
        <h3>Inclusion Criteria</h3>
        <MarkdownSkeleton source={medication.inclusionCriteria} />
        <h3>Exclusion Criteria</h3>
        <MarkdownSkeleton source={medication.exclusionCriteria} />
        <h2>Medicine Details</h2>
        <h3>Name, Form and Strength of Medicine</h3>
        <MarkdownSkeleton source={medication.form} />
        <h3>Route or Method</h3>
        <MarkdownSkeleton source={medication.route} />
        <h3>Dosage</h3>
        <MarkdownSkeleton source={medication.dose} />
        <h3>Side Effects</h3>
        <MarkdownSkeleton source={medication.sideEffects} />
        <h3>Advice to Patient and/or Carer</h3>
        <MarkdownSkeleton source={medication.adviceIfTaken} />
        <h3>Advice if Patient Declines or is Excluded</h3>
        <MarkdownSkeleton source={medication.adviceIfDeclined} />
        <h2>Audit Trail</h2>
        <h3>Records</h3>
        <p>
          All details should be recorded on the Patient Report Form and any
          adverse reactions reported via the Incident Management Framework.
        </p>
        <footer>
          {medication.policyDate
            ? `Taken from Medications Administration Directives dated ${format(
                parseDate(medication.policyDate),
                "d MMM yyyy"
              )}.`
            : null}
        </footer>
      </React.Fragment>
    );
  }

  return (
    <PrivatePage>
      <div className={styles.background}>
        <div className={styles.centreBox}>
          <div className={styles.p}>{content}</div>
        </div>
      </div>
    </PrivatePage>
  );
}

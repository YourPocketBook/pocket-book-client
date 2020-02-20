import format from "date-fns/format";
import isValid from "date-fns/isValid";
import parseISO from "date-fns/parseISO";
import React from "react";
import ReactMarkdown from "react-markdown";
import Col from "reactstrap/lib/Col";
import FormFeedback from "reactstrap/lib/FormFeedback";
import FormGroup from "reactstrap/lib/FormGroup";
import Input, { InputType } from "reactstrap/lib/Input";
import Label from "reactstrap/lib/Label";
import Row from "reactstrap/lib/Row";

interface IFieldProps {
  value: string;
  longText: boolean;
  warning: string;
  valid?: boolean;
  showValidation: boolean;
  name: string;
  id: string;
  placeholder: string;
  autoComplete?: string;
  type?: InputType;
  onChange(val: string): void;
}

export function Field(props: IFieldProps) {
  const {
    name,
    id,
    value,
    longText,
    warning,
    valid,
    showValidation,
    placeholder,
    type,
    onChange
  } = props;

  const autoComplete =
    props.autoComplete === undefined ? "off" : props.autoComplete;

  let formattedValue = value;
  if (type === "date") {
    const d = parseISO(value);
    formattedValue = isValid(d) ? format(d, "yyyy-MM-dd") : "";
  }

  const inputControl = !longText ? (
    <Col>
      <FormGroup>
        <Label for={id}>{placeholder}</Label>
        <Input
          id={id}
          name={name}
          placeholder={placeholder}
          autoComplete={autoComplete}
          value={formattedValue}
          onChange={e => onChange(e.target.value)}
          valid={showValidation && valid}
          invalid={showValidation && valid === false}
          type={type}
        />
        <FormFeedback>{warning}</FormFeedback>
      </FormGroup>
    </Col>
  ) : (
    <React.Fragment>
      <Col md={true}>
        <FormGroup>
          <Label for={id}>{placeholder}</Label>
          <Input
            type="textarea"
            id={id}
            name={name}
            placeholder={placeholder}
            autoComplete={autoComplete}
            value={formattedValue}
            className="h-100"
            onChange={e => onChange(e.target.value)}
            valid={showValidation && valid}
            invalid={showValidation && valid === false}
          />
          <FormFeedback>{warning}</FormFeedback>
        </FormGroup>
      </Col>
      <Col md={true}>
        <ReactMarkdown source={value} />
      </Col>
    </React.Fragment>
  );

  return <Row>{inputControl}</Row>;
}

import React, { useState } from "react";
import Button from "reactstrap/lib/Button";
import Form from "reactstrap/lib/Form";
import FormFeedback from "reactstrap/lib/FormFeedback";
import Modal from "reactstrap/lib/Modal";
import ModalBody from "reactstrap/lib/ModalBody";
import ModalFooter from "reactstrap/lib/ModalFooter";
import ModalHeader from "reactstrap/lib/ModalHeader";
import { fetcher } from "../fetcher";
import { Field } from "../field";
import { useSubmitData } from "../hooks/useSubmitData";
import { useValidation } from "../hooks/useValidation";

const setNameEndPoint = "/api/update-name";

interface IEditNameModalProps {
  initialName: string;
  show: boolean;
  setShow(val: boolean): void;
}

export function EditNameModal(props: IEditNameModalProps) {
  const { initialName, show, setShow } = props;

  const [name, nameValid, setName, setNameValid] = useValidation(
    initialName,
    "text"
  );
  const [showValidation, setShowValidation] = useState(false);

  const { serverError, inProgress, submit } = useSubmitData(
    { name },
    { name: nameValid },
    { name: setNameValid },
    setNameEndPoint,
    {
      authenticate: true,
      method: "PUT",
      setShowValidation,
      success: () => {
        setShow(false);
        fetcher.updateName(name);
      }
    }
  );

  const serverWarning =
    showValidation && serverError ? (
      <FormFeedback className="d-block">
        The server has had an issue, please try again.
      </FormFeedback>
    ) : null;

  return (
    <Modal isOpen={show} toggle={() => setShow(!show)}>
      <ModalHeader>Update your name</ModalHeader>
      <ModalBody>
        <Form onSubmit={submit}>
          {serverWarning}
          <Field
            placeholder="Name"
            id="name"
            name="name"
            longText={false}
            showValidation={showValidation}
            valid={nameValid}
            value={name}
            warning="You need to enter your name."
            onChange={setName}
          />
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button
          color="dark-green"
          disabled={inProgress}
          // tslint:disable-next-line:no-empty
          onClick={() => submit({ preventDefault: () => {} })}
        >
          Save
        </Button>
        <Button color="secondary" onClick={() => setShow(false)}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
}

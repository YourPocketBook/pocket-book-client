import React, { useState } from "react";
import Button from "reactstrap/lib/Button";
import Modal from "reactstrap/lib/Modal";
import ModalBody from "reactstrap/lib/ModalBody";
import ModalFooter from "reactstrap/lib/ModalFooter";
import ModalHeader from "reactstrap/lib/ModalHeader";
import { fetcher } from "../fetcher";
import { history } from "../history";

const deleteEndPoint = "/api/delete-account";

interface IDeleteModalProps {
  show: boolean;
  setShow(val: boolean): void;
}

export function DeleteModal(props: IDeleteModalProps) {
  const { show, setShow } = props;

  const [isDeleting, setIsDeleting] = useState(false);
  const [hasFailed, setHasFailed] = useState(false);

  async function deleteAccount() {
    setIsDeleting(true);

    try {
      const res = await fetcher.authFetch(deleteEndPoint, {
        method: "DELETE"
      });

      if (res.ok) {
        history.push("/");
        setShow(false);
        fetcher.clearToken();
      } else {
        setHasFailed(true);
      }
    } catch {
      setHasFailed(true);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Modal isOpen={show} toggle={() => setShow(!show)}>
      <ModalHeader>Are you sure?</ModalHeader>
      <ModalBody>
        {hasFailed
          ? "Deleting failed.  Try again?"
          : "Are you sure you want to delete your account? This cannot be un-done."}
      </ModalBody>
      <ModalFooter>
        <Button color="danger" onClick={deleteAccount} disabled={isDeleting}>
          Yes
        </Button>
        <Button color="secondary" onClick={() => setShow(false)}>
          No
        </Button>
      </ModalFooter>
    </Modal>
  );
}

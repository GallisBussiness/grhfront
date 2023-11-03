import { create } from "react-modal-promise";
import { Cropper } from "react-advanced-cropper";
import "react-advanced-cropper/dist/style.css";
import { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "@mantine/core";

const CropperImageModal = ({ isOpen, onResolve, onReject, img }) => {
  const [cropImg, setCropImg] = useState();

  const onChange = (cropper) => {
    setCropImg(cropper.getCanvas()?.toDataURL());
  };

  const save = () => {
    onResolve(cropImg);
  };

  return (
    <Dialog
      header="Redimensionnement Photo"
      visible={isOpen}
      style={{ width: "50vw" }}
      onHide={() => onReject()}
    >
      <Cropper src={img} onChange={onChange} className={"cropper"} />
      <div className="my-2 mx-au">
        <Button onClick={save}>ENREGISTRER</Button>
      </div>
    </Dialog>
  );
};

export default create(CropperImageModal);

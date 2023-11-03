import { Button, FileCard, FileUploader, Pane } from "evergreen-ui";
import { Dialog } from "primereact/dialog";
import { useCallback, useState } from "react";
import { create } from "react-modal-promise";

function TakePhotoModal({ isOpen, onResolve, onReject }) {

  const [files, setFiles] = useState([])
  const [fileRejections, setFileRejections] = useState([])
  const handleChange = useCallback((files) => setFiles([files[0]]), [])
  const handleRejected = useCallback((fileRejections) => setFileRejections([fileRejections[0]]), [])
  const handleRemove = useCallback(() => {
    setFiles([])
    setFileRejections([])
  }, [])
 
  return (
    <>
      <Dialog
        header="Prendre Photo"
        visible={isOpen}
        style={{ width: "50vw" }}
        onHide={() => onReject()}
      >
       <Pane maxWidth={654}>
      <FileUploader
        label="Uploader une Image"
        description="veuillez uploader une image qui ne depasse pas 5MB !"
        maxSizeInBytes={5 * 1024 ** 2}
        maxFiles={1}
        onChange={handleChange}
        onRejected={handleRejected}
        renderFile={(file) => {
          const { name, size, type } = file
          const fileRejection = fileRejections.find((fileRejection) => fileRejection.file === file)
          const { message } = fileRejection || {}
          return (
            <FileCard
              key={name}
              isInvalid={fileRejection != null}
              name={name}
              onRemove={handleRemove}
              sizeInBytes={size}
              type={type}
              validationMessage={message}
            />
          )
        }}
        values={files}
      />
    </Pane>
    <div className="flex items-center justify-center my-4 w-1/3 mx-auto">
      <Button onClick={()=>onResolve(files)} intent="success">VALIDER</Button>
    </div>
      </Dialog>
    </>
  );
}

export default create(TakePhotoModal);

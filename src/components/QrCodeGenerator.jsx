import React from "react";
import QRCode from "qrcode.react";

function QRGenerator({ value, documentId }) {
  return (
    <div>
      <QRCode
        id={documentId}
        value={value}
        size={144}
        bgColor="#FFF"
        fgColor="#000"
        includeMargin
        level={"H"}
      />
    </div>
  );
}

export default QRGenerator;
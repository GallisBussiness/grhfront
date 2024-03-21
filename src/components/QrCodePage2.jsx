import React from "react";
import {  Image, View} from "@react-pdf/renderer";
import { createTw } from "react-pdf-tailwind";

const tw = createTw({
    theme: {
      fontFamily: {
        sans: ["Comic Sans"],
      },
      extend: {
        fontFamily: {
          'roboto': ['"Roboto Serif"', "serif"],
        },
      },
    },
  });


function QRCodePage2({ id }) {
  const dataUrl = document.getElementById(id).toDataURL();
  return (
      <View>
        <Image allowDangerousPaths src={dataUrl} style={tw('h-96 w-96 mr-2')} />
      </View>
  );
}

export default QRCodePage2;

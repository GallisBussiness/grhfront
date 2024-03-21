import { Document,Font,Image,Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { format, parseISO } from "date-fns";
import { createTw } from "react-pdf-tailwind";
import QRCodePage2 from "./QrCodePage2";

Font.register({ family: 'Roboto', src: "/roboto-font/Roboto-Medium.ttf" });

const tw = createTw({
  theme: {
    fontFamily: {
      sans: ["Comic Sans"],
    },
  },
});



const styles = StyleSheet.create({
    table: { 
      display: "table", 
      width: "90%", 
      borderStyle: "solid", 
      borderWidth: 2, 
      borderRightWidth: 0, 
      borderBottomWidth: 0,
      marginHorizontal: "auto",
    }, 
    tableRow: { 
      margin: "auto", 
      flexDirection: "row" 
    }, 
    tableCol: { 
      width: "20%", 
      borderStyle: "solid", 
      borderWidth: 1, 
      borderLeftWidth: 0, 
      borderTopWidth: 0 
    }, 
    tableCell: { 
      margin: "auto", 
      marginTop: 5,
      padding:2,
      fontSize: 10 
    }
  });


  const filterArrive =  (tab) => {
    const p = tab?.find(t => t.type === "ARRIVEE");
    if(p){
       return format(parseISO(p.heure),"H:mm:ss");
    }
    return null;
  }

  const findName =  (tab) => {
    const p = tab?.find(t => t.type === "ARRIVEE" || t.type === "DEPART" );
    if(p){
       return `${p.employe.prenom} ${p.employe.nom}` ;
    }
    return null;
  }

  const findPoste =  (tab) => {
    const p = tab?.find(t => t.type === "ARRIVEE" || t.type === "DEPART" );
    if(p){
       return p.employe.poste ;
    }
    return null;
  }

  const filterDepart =  (tab) => {
    const p = tab?.find(t => t.type === "DEPART");
    if(p){
       return format(parseISO(p.heure),"H:mm:ss");
    }
    return null;
  }


function FicheQrPrint({fiche}) {
  return (
    <Document author="CROUSZ">
    <Page size="A4" wrap={true} style={{margin: 5}}>
        <View style={tw("flex flex-row items-center justify-between my-5 w-10/12 mx-auto pr-10")}>
                <View style={tw("flex flex-col w-1/3")}>
                  <View style={tw('flex flex-col items-center justify-center')}>
                  <View>
                        <Text style={{fontSize:'8px', textTransform: "uppercase",fontFamily:"Roboto"}}> République du Sénégal</Text>
                        </View>
                        <View  style={tw('font-bold')}>
                       <Image src="/drapeau.png" style={tw('w-12 h-8')}/>
                    </View>
                  </View>
                        <View style={tw('flex flex-col items-center justify-center')}>
                         <View  style={tw('font-semibold')}>
                                  <Text style={{fontSize:'8px',textTransform: "uppercase",fontFamily:"Roboto"}}> Un peuple - Un but - Une foi</Text>
                              </View>
                              <View  style={tw('font-bold')}>
                                  <Text style={{fontSize:'12px',fontFamily:"Roboto"}}> **************</Text>
                              </View>
                        </View>
                       
                       <View style={tw('flex flex-col items-center justify-center')}>
                            <View  style={tw("font-semibold")}>
                              <Text style={{fontSize:'8px',textTransform: "uppercase",textAlign:"center",fontFamily:"Roboto"}}>Ministère de l'Enseignement Supérieur, de la Recherche et de
                              l'Innovation </Text> 
                          </View>
                          <View  style={tw('font-bold')}>
                              <Text style={{fontSize:'12px',fontFamily:"Roboto"}}> ************************</Text>
                          </View>
                       </View>

                    <View style={tw('flex flex-col items-center justify-center')}>
                            <View  style={tw('flex flex-col items-center justify-center')} >
                          <Text style={{fontSize:'8px',textTransform: "uppercase",fontFamily:"Roboto",textAlign:"center"}}>Centre Régional des Oeuvres Universitaires Sociales de
                              Ziguinchor (CROUS/Z)</Text>
                          </View>
                    </View>
                    
                    </View>
                    <View style={tw('flex flex-col items-center justify-between')}>
                        <View >
                       <Image src="/logo.png" style={tw('w-24 h-24')}/>
                    </View>
                    <View style={tw("flex items-center justify-center w-full my-2")}>
                        <Text style={{fontWeight:"bold",fontFamily:"Roboto",fontSize:12}}>REF: {fiche?.ref}</Text>
                    </View> 
                    </View>
                    
        </View>
        <View style={tw("flex items-center justify-center w-11/12 mx-auto p-2 bg-cyan-500")}>
            <Text style={{fontWeight:"bold",fontFamily:"Roboto",color: "white"}}>FICHE DE PRESENCE DU : {fiche?.date} </Text>
        </View>
        <View style={tw("flex items-center justify-center w-full my-2")}>
            <Text style={{fontFamily:"Roboto",fontSize: "12px"}}>{fiche?.description}</Text>
        </View>
          
        <View style={tw("flex items-center justify-center w-5/12 mx-auto my-20")}>
        <QRCodePage2 id="qrfiche"/>
        </View>     

    </Page>
  </Document>
  )
}

export default FicheQrPrint

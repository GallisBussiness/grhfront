import { Document,Font,Image,Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { format, intervalToDuration, parseISO } from "date-fns";
import { createTw } from "react-pdf-tailwind";

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
      width: "25%", 
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




function FicheHebdoPrint({presences}) {
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
                    </View>
                    
        </View>
        <View style={tw("flex items-center justify-center w-11/12 mx-auto p-2 bg-cyan-500")}>
            <Text style={{fontWeight:"bold",fontFamily:"Roboto",color: "white"}}>FICHE HEBDOMADAIRE </Text>
        </View>
          
          <View wrap={true}>
          {presences?.map((p,i) => (
                    <View key={i}> 
                    <View style={{marginTop:5, textTransform:'uppercase'}}> 
                        <Text style={styles.tableCell}>{p.employe.prenom} {p.employe.nom}, {p.employe.matricule_de_solde ?? 'Temporaire'}</Text> 
                        </View>
                        <View style={styles.body}>
              <View style={styles.table} wrap={true}> 
                <View style={styles.tableRow}> 
                  <View style={{...styles.tableCol,backgroundColor: "#fad487"}}> 
                    <Text style={{...styles.tableCell,fontStyle: "14px", fontWeight: "bold"}}>DATE</Text> 
                  </View>
                  <View style={{...styles.tableCol,backgroundColor: "#fad487"}}> 
                    <Text style={{...styles.tableCell,fontStyle: "14px", fontWeight: "bold"}}>ARRIVE</Text> 
                  </View> 
                  <View style={{...styles.tableCol,backgroundColor: "#fad487"}}> 
                    <Text style={{...styles.tableCell,fontStyle: "14px", fontWeight: "bold"}}>DEPART</Text> 
                  </View> 
                  <View style={{...styles.tableCol,backgroundColor: "#fad487"}}> 
                    <Text style={{...styles.tableCell,fontStyle: "14px", fontWeight: "bold"}}>HEURES</Text> 
                  </View> 
                   
                </View>
                 {p.presences?.map((pre,i) => (
                  <View wrap={false} style={styles.tableRow} key={i}> 
                  <View style={{...styles.tableCol,backgroundColor: "white"}}> 
                    <Text style={styles.tableCell}>{pre.date}</Text> 
                  </View> 
                  <View style={{...styles.tableCol,backgroundColor: "white"}}> 
                    <Text style={styles.tableCell}>{pre?.arrive?.heure ? format(parseISO(pre?.arrive?.heure),"HH:mm:ss") : ''}</Text> 
                  </View>
                  <View style={{...styles.tableCol,backgroundColor: "white"}}> 
                    <Text style={styles.tableCell}>{pre?.depart?.heure ? format(parseISO(pre?.depart?.heure),"HH:mm:ss") :''} </Text> 
                  </View> 
                  <View style={{...styles.tableCol,backgroundColor: "white"}}>
                    <Text style={styles.tableCell}>{(pre?.arrive && pre?.depart) ? intervalToDuration({start : parseISO(pre.arrive.heure) , end : parseISO(pre.depart.heure)}).hours : 0 }</Text> 
                  </View>
                </View> 
                  ))}
              </View>
            </View>
                  <View style={tw("flex items-center justify-center w-10/12 mx-auto p-1 bg-cyan-500")} wrap={true}> 
                        <Text style={{...styles.tableCell,color: "white"}}>TOTAL HEURES : {p.heures}</Text> 
                        </View>
                  </View>
                  
                  ))}
            
          </View>

    </Page>
  </Document>
  )
}

export default FicheHebdoPrint

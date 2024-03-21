import { Pane, Tab, Tablist } from "evergreen-ui"
import AttributionsGlobalesEmploye from "./AttributionsGlobalesEmploye"
import AttributionSpecifique from "./config/AttributionSpecifique"
import { useState } from "react"


function AttributionsCdd({id}) {
const [selectedIndex, setSelectedIndex] = useState(0)
const [tabs] = useState(['ATTRIBUTIONS GLOBALES','ATTRIBUTIONS INDIVIDUELLES'])
  return (
    <div className="w-11/12 my-5 mx-auto">
    <Pane height={120}>
  <Tablist marginBottom={16} flexBasis={240} marginRight={24}>
    {tabs.map((tab, index) => (
      <Tab
        aria-controls={`panel-${tab}`}
        isSelected={index === selectedIndex}
        key={tab}
        onSelect={() => setSelectedIndex(index)}
      >
        {tab}
      </Tab>
    ))}
  </Tablist>
  <Pane padding={16} background="tint1" flex="1">
      <Pane
        aria-hidden={selectedIndex !== 0}
        display={selectedIndex === 0 ? 'block' : 'none'}
        role="tabpanel"
      >
        {id && <AttributionsGlobalesEmploye id={id}/>}
      </Pane>
      <Pane
        aria-hidden={selectedIndex !== 1}
        display={selectedIndex === 1 ? 'block' : 'none'}
        role="tabpanel"
      >
        {id && <AttributionSpecifique id={id} />}
      </Pane>
  </Pane>
</Pane>
  </div>
  )
}

export default AttributionsCdd
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { getAttributionSpecifiqueByRubrique } from '../../services/attribution-specifique';
import { useQuery } from 'react-query';
import { getExclusionSpecifiqueByRubrique } from '../../services/exclusion-specifique';
import { Pane, Tab, Tablist } from 'evergreen-ui';
import AttributionIndividuelleRubrique from './AttributionIndividuelleRubrique';
import ExclusionSpecifiqueRubrique from './ExclusionSpecifiqueRubrique';

function Rubrique() {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [tabs] = useState(['INDIVIDUELLES', 'EXCLUSIONS',])
  const {id} = useParams();
  const qk = ['get_AT']
  const qks = ['get_EX']
  const {data: AT} = useQuery(qk, () => getAttributionSpecifiqueByRubrique(id));

  const {data: EX} = useQuery(qks, () => getExclusionSpecifiqueByRubrique(id));


  return (
    <>
    <div className="w-11/12 my-5 mx-auto">
        <Pane height={120}>
      <Tablist marginBottom={16} flexBasis={240} marginRight={24}>
        {tabs.map((tab, index) => (
          <Tab
            aria-controls={`panel-${tab}`}
            isSelected={index === selectedIndex}
            key={index}
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
            {AT && <AttributionIndividuelleRubrique data={AT}/>}
          </Pane>

          <Pane
            aria-hidden={selectedIndex !== 1}
            display={selectedIndex === 1 ? 'block' : 'none'}
            role="tabpanel"
          >
            {EX && <ExclusionSpecifiqueRubrique data={EX}/>}
          </Pane>
         
      </Pane>
    </Pane>
      </div>
    </>
  )
}

export default Rubrique
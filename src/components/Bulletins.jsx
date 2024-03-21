import React, { useState } from 'react'
import { useQuery } from 'react-query';
import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer';
import { LoadingOverlay } from '@mantine/core';
import { getBulletinsCdd } from '../services/lotcddservice';
import { getBulletins } from '../services/lotservice';

function Bulletins({employe}) {
    const [docs,setDocs] = useState(null);
    
     const key = ['getBulletins',employe._id];
    
    const {isLoading} =  useQuery(key,() => employe?.type === "CDD" ? getBulletinsCdd(employe._id): getBulletins(employe._id),{
        onSuccess:(data) => {
           const nd = data.map(d => {
            const rplce = d.replaceAll('\\','/');
            const fileName = rplce.split('/').slice(2).join('-');
             const uri =  import.meta.env.VITE_BACKURL + '/'+ rplce;
            return {uri,fileName};
           });
           setDocs(nd.reverse());
        }
    })
  return (
      <div className="w-8/12 mx-auto h-1/2 my-2">
  <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: 'sm', blur: 2 }}  loaderProps={{ color: 'blue', type: 'bars' }}/>
    {docs && <DocViewer prefetchMethod="GET" documents={docs} pluginRenderers={DocViewerRenderers} />}
      </div>
  )
}

export default Bulletins
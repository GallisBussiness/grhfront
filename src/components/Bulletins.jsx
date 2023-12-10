import React, { useState } from 'react'
import { getBulletins } from '../services/lotservice';
import { useQuery } from 'react-query';
import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer';

function Bulletins({employe}) {
    const [docs,setDocs] = useState(null);
    const key = ['getBulletins',employe._id];
    const {isLoading} =  useQuery(key,() => getBulletins(employe._id),{
        onSuccess:(data) => {
           const nd = data.map(d => {
            const rplce = d.replaceAll('\\','/');
            const fileName = rplce.split('/').slice(2).join('-');
            const uri =  import.meta.env.VITE_BACKURL + '/'+ rplce;
            return {uri,fileName};
           });
           setDocs(nd);
        }
    })
  return (
      <div className="w-8/12 mx-auto h-1/2 my-2">
    {docs && <DocViewer prefetchMethod="GET" documents={docs} pluginRenderers={DocViewerRenderers} />}
      </div>
  )
}

export default Bulletins
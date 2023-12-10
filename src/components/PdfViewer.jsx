import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer"

function PdfViewer({uri}) {

  return (
    <div>
     <DocViewer prefetchMethod="GET" documents={[
            uri
     ]} pluginRenderers={DocViewerRenderers} />
  </div>
  )
}

export default PdfViewer
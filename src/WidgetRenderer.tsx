import * as React from "react"
import * as ReactDOM from 'react-dom'

const Widget:React.FunctionComponent<{ 
    components: Map<string, React.FunctionComponent> ,
    props: Map<string, any>
}> = ({ components, props }) => {    
  const rendered: React.ReactElement[] = []
  const sorted:Map<string, React.FunctionComponent> = new Map(Array.from(components.entries()).sort((a,b)=>{
    if(a[0] == 'AddWidget') return 1
    if(b[0] == 'AddWidget') return -1
    return a[0].localeCompare(b[0])
  }))
  sorted.forEach( (Component, key) => 
    rendered.push(<Component key={key} {...(props.get(key))} />)
  )
  return <React.StrictMode> {rendered} </React.StrictMode>
}

const WidgetRenderer = (components, props) => 
    ReactDOM.render( 
      Widget({components, props}), 
        document.getElementById('main')
    )

export default  WidgetRenderer
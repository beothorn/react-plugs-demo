import * as React from 'react'
import { Hub } from 'react-plugs'

const widgetBox: (hub: Hub)  => ((name: string, widget: React.ReactElement<any>) => React.ReactElement<any>) = (hub) => {
    return (name, widget) => <div className="widget">
        <div className="widget-header"><button onClick={() => hub.unplug(name)}>&#10006;</button></div>
        {widget}
    </div>;
}

export default widgetBox
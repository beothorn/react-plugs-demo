import * as React from 'react'
import { Hub } from 'react-plugs'

const widgetBox: (hub: Hub)  => ((name: string, widget: React.ReactElement<any>) => React.ReactElement<any>) = (hub) => {
    return (name, widget) => <div className="widget">
        <button onClick={() => hub.unplug(name)}>Close</button>
        {widget}
    </div>;
}

export default widgetBox
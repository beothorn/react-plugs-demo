import { Hub, Plug } from 'react-plugs'
import { BehaviorSubject } from 'rxjs'
import { map } from 'rxjs/operators'
import * as React from 'react'

class AddWidget implements Plug {
    props: any
    name = "AddWidget"
    renderer: { props: any; functionComponent: ({ options }: { options: any }) => any }
    inputs: { source: string; inputSubscriber: (connections: any) => void }[]

    constructor(hub: Hub, widgetGenerators: Map<string, any>){
        const allWidgets = Array.from(widgetGenerators.keys())
        const availableWidgets = new BehaviorSubject(allWidgets)
        this.props = availableWidgets.pipe(map(opts => ({options: opts})))
        this.inputs = [
            {
                source: "Hub:connections",
                inputSubscriber: (connections) => {
                    const currentLoadedWidgets = Array.from(connections.keys())
                    const updatedAvailableWidgets: string[] = allWidgets.filter( w => !currentLoadedWidgets.includes(w) )
                    availableWidgets.next(updatedAvailableWidgets)
                }
            }
        ]
        this.renderer = {
            props: this.props,
            functionComponent: ({options}) => options.map(  (i, index) => 
                <button 
                    onClick={() => 
                        hub.plug(widgetGenerators.get(i)())
                    } 
                    key={index}
                >
                    {i}
                </button>
            )
        }
    }

    
}

export default AddWidget
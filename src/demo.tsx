import { Hub } from 'react-plugs'
import { Subject } from 'rxjs'
import * as React from 'react'

const propsOutput: Subject<{a: string}> = new Subject()

const hub = new Hub()

hub.plug({
    name: "Renderable",
    renderer: {
        props: propsOutput,
        functionComponent: ({a}) => <p>{a}</p>
    }
})

propsOutput.next({a: "It Works!"})
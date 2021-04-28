import { Hub, PlugConfig } from 'react-plugs'
import { Subject, BehaviorSubject } from 'rxjs'
import { scan, map } from 'rxjs/operators'
import * as React from 'react'

const availableWidgets: BehaviorSubject<any> = new BehaviorSubject(["RandomNumberDisplay", "RandomNumberAccumulatorDisplay"])

const widgetBox: (widget:  React.ReactElement<any>, hub: Hub, name: string) => React.ReactElement<any> = (widget, hub, name) => {
    return <div className="widget">
        <button onClick={() => hub.unplug(name)}>Close</button>
        {widget}
    </div>;
}

const hotRandomNumber: BehaviorSubject<any> = new BehaviorSubject({randomNumber: Math.random()})
setInterval( () => {
    hotRandomNumber.next({randomNumber: Math.random()})
}, 2000)

const randomNumberGenerator = {
    name: "RandomNumberGenerator",
    outputs: [
        {
            name: "number",
            outputObservable: hotRandomNumber
        }
    ]
}

class RandomNumberDisplay implements PlugConfig {
    widgetProps: Subject<any> = new Subject()
    name = "RandomNumberDisplay"
    inputs = [
        {
            source: "RandomNumberGenerator:number",
            inputSubscriber: (randomNumberGeneratorOutput) => {
                this.widgetProps.next({randomNumber: randomNumberGeneratorOutput.randomNumber})
            }
        }
    ]
    renderer = {
        props: this.widgetProps,
        functionComponent: ({randomNumber}) => widgetBox(
            <p>Random number: {randomNumber}</p>,
            hub,
            this.name
        )
    }
}

class RandomNumberAccumulatorDisplay implements PlugConfig {
    widgetProps: BehaviorSubject<any> = new BehaviorSubject([])
    name = "RandomNumberAccumulatorDisplay"
    inputs = [
        {
            source: "RandomNumberGenerator:number",
            inputSubscriber: (randomNumberGeneratorOutput) => {
                this.widgetProps.next(randomNumberGeneratorOutput.randomNumber)
            }
        }
    ]
    renderer = {
        props: this.widgetProps.pipe(
            scan((acc, newNumber) => {
                acc.randomNumbers.push(newNumber)
                return {randomNumbers: acc.randomNumbers.slice(-3)}
            }, {randomNumbers: []})
        ),
        functionComponent: ({randomNumbers}) => widgetBox(
            randomNumbers.map( (i, index) => <p key={index}>{index}: {i}</p>),
            hub,
            this.name
        )
    }
}

const hub = new Hub()

const widgets: Map<string, any> = new Map()
widgets.set("RandomNumberAccumulatorDisplay", () => new RandomNumberAccumulatorDisplay)
widgets.set("RandomNumberDisplay", () => new RandomNumberDisplay())

const addWidget = {
    name: "AddWidget",
    renderer: {
        props: availableWidgets.pipe(map(opts => ({options: opts}))),
        functionComponent: ({options}) => options.map( 
            (i, index) => 
                <button 
                    onClick={() => 
                        hub.plug(widgets.get(i)())
                    } 
                    key={index}
                >
                    {i}
                </button>
        )
    }
}

hub.plug(randomNumberGenerator)
hub.plug(addWidget)
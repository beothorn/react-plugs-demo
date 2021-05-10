import { Plug } from 'react-plugs'
import { Subject } from 'rxjs'
import * as React from 'react'
import widgetBox from './WidgetBox'

class RandomNumberDisplay implements Plug {

    wrapper: (name: string, widget: React.ReactElement<any>) => React.ReactElement<any>

    constructor(widgetWrapper: (name: string, widget: React.ReactElement<any>) => React.ReactElement<any>){
        this.wrapper = widgetWrapper
    }

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
        functionComponent: ({randomNumber}) => this.wrapper(
            this.name,
            <p>Random number: {randomNumber}</p>
        )
    }
}

export default RandomNumberDisplay
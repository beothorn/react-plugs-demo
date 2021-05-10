import { Plug } from 'react-plugs'
import { BehaviorSubject } from 'rxjs'
import { scan } from 'rxjs/operators'
import * as React from 'react'

class RandomNumberAccumulatorDisplay implements Plug {

    wrapper: (name: string, widget: React.ReactElement<any>) => React.ReactElement<any>

    constructor(widgetWrapper: (name: string, widget: React.ReactElement<any>) => React.ReactElement<any>){
        this.wrapper = widgetWrapper
    }

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
        functionComponent: ({randomNumbers}) => this.wrapper(
            this.name,
            randomNumbers.map( (i, index) => <p key={index}>{index}: {i}</p>),
        )
    }
}

export default RandomNumberAccumulatorDisplay
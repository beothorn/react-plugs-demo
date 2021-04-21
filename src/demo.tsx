import { Hub } from 'react-plugs'
import { Subject } from 'rxjs'
import { scan } from 'rxjs/operators'
import * as React from 'react'

const randomNumberSource: Subject<any> = new Subject()

const randomNumberGenerator = {
    name: "RandomNumberGenerator",
    outputs: [
        {
            name: "number",
            outputObservable: randomNumberSource
        }
    ]
}

const randomNumberDisplayProps: Subject<any> = new Subject()
const randomNumberDisplay = {
    name: "RandomNumberDisplay",
    inputs: [
        {
            source: "RandomNumberGenerator:number",
            inputSubscriber: (randomNumberGeneratorOutput) => {
                randomNumberDisplayProps.next({randomNumber: randomNumberGeneratorOutput.randomNumber})
            }
        }
    ],
    renderer: {
        props: randomNumberDisplayProps,
        functionComponent: ({randomNumber}) => <p>Random number: {randomNumber}</p>
    }
}

const randomNumberAccumulatorDisplayProps: Subject<any> = new Subject()
const randomNumberAccumulatorDisplay = {
    name: "RandomNumberAccumulatorDisplay",
    inputs: [
        {
            source: "RandomNumberGenerator:number",
            inputSubscriber: (randomNumberGeneratorOutput) => {
                randomNumberAccumulatorDisplayProps.next(randomNumberGeneratorOutput.randomNumber)
            }
        }
    ],
    renderer: {
        props: randomNumberAccumulatorDisplayProps.pipe(scan((acc, newNumber) => ({randomNumbers: acc.randomNumbers.concat(newNumber)}), {randomNumbers: []})),
        functionComponent: ({randomNumbers}) => <>{randomNumbers.map( (i, index) => <p key={index}>{index}: {i}</p>)}</>
    }
}

const hub = new Hub()

hub.plug(randomNumberGenerator)
hub.plug(randomNumberDisplay)
hub.plug(randomNumberAccumulatorDisplay)

randomNumberSource.next({randomNumber: Math.random()})

setInterval( () => {
    randomNumberSource.next({randomNumber: Math.random()})
}, 2000)



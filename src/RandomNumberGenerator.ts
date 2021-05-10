import { BehaviorSubject } from 'rxjs'

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

export default randomNumberGenerator
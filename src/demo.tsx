import { Hub, Plug } from 'react-plugs'
import widgetBox from './WidgetBox'
import randomNumberGenerator from './RandomNumberGenerator'
import RandomNumberDisplay from './RandomNumberDisplay'
import RandomNumberAccumulatorDisplay from './RandomNumberAccumulatorDisplay'
import AddWidget from './AddWidget'

const hub = new Hub()
const widgetBoxWrapper = widgetBox(hub)

const widgets: Map<string, any> = new Map()
widgets.set("RandomNumberAccumulatorDisplay", () => new RandomNumberAccumulatorDisplay(widgetBoxWrapper))
widgets.set("RandomNumberDisplay", () => new RandomNumberDisplay(widgetBoxWrapper))

const addWidget = new AddWidget(hub, widgets)


hub.plug(randomNumberGenerator)
hub.plug(addWidget)
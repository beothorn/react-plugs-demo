import { Hub, HubComponent } from 'react-plugs'
import * as ReactDOM from 'react-dom'
import widgetBox from './WidgetBox'
import randomNumberGenerator from './RandomNumberGenerator'
import RandomNumberDisplay from './RandomNumberDisplay'
import RandomNumberAccumulatorDisplay from './RandomNumberAccumulatorDisplay'
import AddWidget from './AddWidget'
import WidgetRenderer from './WidgetRenderer'

const hub = new Hub(WidgetRenderer)
const widgetBoxWrapper = widgetBox(hub)

const widgets: Map<string, any> = new Map()
widgets.set("RandomNumberAccumulatorDisplay", () => new RandomNumberAccumulatorDisplay(widgetBoxWrapper))
widgets.set("RandomNumberDisplay", () => new RandomNumberDisplay(widgetBoxWrapper))

const addWidget = new AddWidget(hub, widgets)


hub.plug(randomNumberGenerator)
hub.plug(addWidget)
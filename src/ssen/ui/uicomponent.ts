///<reference path="../../lib.d.ts"/>

export interface UIComponentProperties {
    width?: string | number
    height?: string | number
}

export interface UIComponentLifecycleProcessor {
    added(component:UIComponent<UIComponentProperties, any, any>)
    removed(component:UIComponent<UIComponentProperties, any, any>)
}

export class UIComponent<P extends UIComponentProperties, S, C> extends React.Component<P, S, C> {
    static lifecycleProcessors:UIComponentLifecycleProcessor[]

    static lifecycle__added(component:UIComponent<UIComponentProperties, any, any>) {
        lifecycleProcessors.forEach((p:UIComponentLifecycleProcessor) => p.added(component))
    }

    static lifecycle__removed(component:UIComponent<UIComponentProperties, any, any>) {
        lifecycleProcessors.forEach((p:UIComponentLifecycleProcessor) => p.removed(component))
    }

    componentDidMount() {
        UIComponent.added(this)
    }

    componentWillUnmount() {
        UIComponent.removed(this)
    }
}
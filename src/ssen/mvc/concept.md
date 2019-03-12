# Injection

- Type을 통한 분류는 불가능 (String을 써야 한다... 망할...)

```js
class SampleContext extends Context {
	mapDependency() {
		injector.mapClass(Type, Class)
		injector.mapSingleton(Type, Class)
		injector.mapValue(Type, object)
		injector.mapFactory(Type, FactoryClass)

		viewMap.map(Class)

		commandMap.map('event', [Class, Class, Class])
	}

	startup() {
		// startup hook
	}

	shutdown() {
		// shutdown hook
	}
}

@Context(SampleContext)
class ContextView extends UIComponent {

}

class Component extends React.Component {
	@Inject(Type)
	property: Type

	@Inject(Type)
	set accessor(value:Type) {
		this._value = value
	}

	@PostConstruct()
	init() {
	}
}
```
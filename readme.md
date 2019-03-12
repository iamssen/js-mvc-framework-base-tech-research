
# Annotation 파악

- class    => `Annotation({args...})(Class)`
- function => `Annotation({args...})(Class.protorype)`

Annotation 가능 범위?

- class annotation
- property annotation
- function annotation
- function argument annotation
- setter

# 구조 선택

- amd
- commonjs
	- namespace 선언 형태로 만들기 힘들어진다
	- es6 import 를 사용할 수 있다. 부분적으로 가져오거나, 빌드에 포함시키거나 하기 쉽다.
	- 별도로 분리된 파일들이 namespace를 가지고 있을때 namespace 단위를 merge 시킬수가 없다. (가장 큰 문제)
	- 실제 application 에서만 사용하자
		- `import` 구문을 통해서 불러오는 형태만...
- namespace
	- 코드에서 class 이름이 길어진다 (destructuring 사용해서 쪼개면 될듯...)
	- library가 커진다. 부분적으로 가져오기 힘들어진다.
	- library project에서만 사용하자.
		- html 상에서 `<script>`를 통해서 불러오고
		- 소스코드 상에서는 `///<reference/>`를 통해서 사용하는 형태
		- `import flow = ssen.reflow`와 같은식으로 namespace를 짧게 만든 다음 `new flow.Context()`와 같이 사용한다

# 만들 라이브러리들

- ssen.core
	- ssen.core.js
	- annotation decorator process
		- Class.annotations를 사용하지 않고 별도의 Map을 만들어서 관리한다
		- `ssen.core.AnnotationUtils.decorate(c:Class, annotation:any):Class`
		- `ssen.core.AnnotationUtils.search(), catch()`
- ssen.reflow
	- ssen.reflow.js
	- dependency injector `@Inject, @PostConstruct`
	- annotation based mvc framework
	- context
		```js
		class Context extends Context {
			mapDependency() {
				injector.mapClass(Ref, RefImpl)

			}
		}
		```
- ssen.ui
	- ssen.ui.js
	- `ssen.reflow`를 찾아서 있으면 reflow를 위한 added to stage capture를 실행한다
	- react의 기본적인 기능들을 좀 더 flex 스럽게 업그레이드 시킨다?
- ssen.chart


---------

# Archive

과거 annotation 기반 framework를 설계하면서 테스트했던 코드들을 남기기 위해 보관
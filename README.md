# csssr-tz
## тестовое задание

### исправленный вариант - index.js
### первоначалльный вариант - 1111.js

```
Slomux — упрощённая, сломанная реализация Flux.
Перед вами небольшое приложение, написанное на React + Slomux.
Это нерабочий секундомер с настройкой интервала обновления.

Исправьте ошибки и потенциально проблемный код, почините приложение и прокомментируйте своё решение.

При нажатии на "старт" должен запускаться секундомер и через заданный интервал времени увеличивать свое значение на значение интервала
При нажатии на "стоп" секундомер должен останавливаться и сбрасывать свое значение
```

### 1. компонент createStore
 - функциональному выражению dispatch дописан возвращаемый результат
 - функциональному выражению subscribe дописан возвращаемый результат в виде функции проверки на дубли

### 2. компонент connect
 - функция render перенесена в конец кода
 - добавлен метод жизненного цикла componentWillUnmount в котором происходит отписка
 - убран метод жизненного цикла componentDidUpdate 
 - добавлен метод жизненного цикла componentDidMount в который вынесена функциональность componentDidUpdate и добавлена инициализация отписки

### 3. компонент Interval
 - произведена замена аргументов местами (mapStateToProps и mapDispatchToProps) в вызове функции connect

### 4. компонент TimerComponent
 - функция render перенесена в конец кода
 - в функции handleStart произведена декомпозиция на метод браузера window.interval и функцию обратного вызова changeCurrentTime
 - в функции handleStart метод setTimeout заменён методом setInterval
 - в функции handleStop добавлен метод clearInterval

### 5. рендеринг приложения
 - добавлен второй аргумент (начальное состояние) в вызове createStore компонента Provider




+ во всех компонентах произведена деструкторизация объектов для упрощения кода
+ где неободимо произведена замена на стрелочные функции

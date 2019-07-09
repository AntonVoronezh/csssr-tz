import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
// Slomux — упрощённая, сломанная реализация Flux.
// Перед вами небольшое приложение, написанное на React + Slomux.
// Это нерабочий секундомер с настройкой интервала обновления.

// Исправьте ошибки и потенциально проблемный код, почините приложение и прокомментируйте своё решение.

// При нажатии на "старт" должен запускаться секундомер и через заданный интервал времени
// увеличивать свое значение на значение интервала
// При нажатии на "стоп" секундомер должен останавливаться и сбрасывать свое значение

const createStore = (reducer, initialState) => {
	let currentState = initialState;
	const listeners = [];

	const getState = () => currentState;

	const dispatch = action => {
		currentState = reducer(currentState, action);
		listeners.forEach(listener => listener());
		return action;
	};

	const subscribe = listener => {
		listeners.push(listener);
		return () => {
			const index = listeners.indexOf(listener);
			if (index >= 0) {
				listeners.splice(index, 1);
			}
		};
	};

	return { getState, dispatch, subscribe };
};

const connect = (mapStateToProps, mapDispatchToProps) => Component => {
	class WrappedComponent extends React.Component {
		componentDidMount() {
			const { store } = this.context;
			this.unsubscribe = store.subscribe(this.handleChange);
		}

		componentWillUnmount() {
			this.unsubscribe();
		}

		handleChange = () => this.forceUpdate();

		render() {
			const { store } = this.context;

			return (
				<Component
					{...this.props}
					{...mapStateToProps(store.getState(), this.props)}
					{...mapDispatchToProps(store.dispatch, this.props)}
				/>
			);
		}
	}

	WrappedComponent.contextTypes = {
		store: PropTypes.object,
	};

	return WrappedComponent;
};

class Provider extends React.Component {
	getChildContext() {
		const { store } = this.props;

		return {
			store,
		};
	}

	render() {
		const { children } = this.props;

		return React.Children.only(children);
	}
}

Provider.childContextTypes = {
	store: PropTypes.object,
};

// APP

// actions
const CHANGE_INTERVAL = 'CHANGE_INTERVAL';

// action creators
const changeInterval = value => ({
	type: CHANGE_INTERVAL,
	payload: value,
});

// reducers
const reducer = (state, action) => {
	switch (action.type) {
		case CHANGE_INTERVAL:
			return (state += action.payload);
		default:
			return {};
	}
};

// components

class IntervalComponent extends React.Component {
	render() {
		const { changeInterval, currentInterval } = this.props;
		
		return (
			<div>
				<span>Интервал обновления секундомера: {currentInterval} сек.</span>
				<span>
					<button onClick={() => changeInterval(-1)}>-</button>
					<button onClick={() => changeInterval(1)}>+</button>
				</span>
			</div>
		);
	}
}

const Interval = connect(
	state => ({
		currentInterval: state,
	}),
	dispatch => ({
		changeInterval: value => dispatch(changeInterval(value)),
	})
)(IntervalComponent);

class TimerComponent extends React.Component {
	state = {
		currentTime: 0,
	};

	handleStart = () => {
		const { currentInterval } = this.props;

		const changeCurrentTime = () => {
			this.setState(state => ({
				currentTime: state.currentTime + currentInterval,
			}));
		};

		window.interval = setInterval(changeCurrentTime.bind(this), currentInterval * 1000);
	};

	handleStop = () => {
		clearInterval(window.interval);
		this.setState({ currentTime: 0 });
	};

	render() {
		const { currentTime } = this.state;

		return (
			<div>
				<Interval />
				<div>Секундомер: {currentTime} сек.</div>
				<div>
					<button onClick={this.handleStart}>Старт</button>
					<button onClick={this.handleStop}>Стоп</button>
				</div>
			</div>
		);
	}
}

const Timer = connect(
	state => ({
		currentInterval: state,
	}),
	() => {}
)(TimerComponent);

// init
ReactDOM.render(
	<Provider store={createStore(reducer, 0)}>
		<Timer />
	</Provider>,
	document.getElementById('app')
);

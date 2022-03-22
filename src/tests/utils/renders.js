/** @format */

import { render as rtlRender } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Router } from 'react-router-dom';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { defaultReducers } from './testStores';
import { createMemoryHistory } from 'history';

const mockedUsedLocation = jest.fn();
const mockedUsedNavigate = jest.fn();
jest.mock('react-router', () => ({
	...jest.requireActual('react-router'),
	useNavigate: () => mockedUsedNavigate,
}));

jest.mock('react-router-dom', () => ({
	// __esModule: true,
	...jest.requireActual('react-router-dom'),
	useNavigate: () => mockedUsedNavigate,
	Navigate: (props) => {
		mockedUsedNavigate(props);
		return <div>Mocked Navigate</div>;
	},
}));

/**
 * App specific Helper function that wraps a component inside a React Redux-store provider and a memory router. Used for testing component functionality. MemoryRouter specificly is used when we want there to be initial entries on the path
 * @param {JSX} ui The component that is to be wrapped.
 * @param {Object} reduxConfig takes the given store and its initial state if provided as an object. If no store is provided, it creates a store using the defaultReducers as well as the initialState (initialState=undefined by default.)
 * @returns {Function}
 */
function renderWithReduxAndMemoryRouter(
	ui,
	{
		reducers = defaultReducers,
		preloadedState,
		initialPath = '/',
		store = createStore(reducers, preloadedState, applyMiddleware(thunk)),
		...renderOptions
	} = {}
) {
	const history = createMemoryHistory();

	function Wrapper({ children }) {
		return (
			<Provider store={store}>
				<MemoryRouter initialEntries={[initialPath]}>{children}</MemoryRouter>
			</Provider>
		);
	}
	return {
		utils: rtlRender(ui, { wrapper: Wrapper, ...renderOptions }),
		mockedUsedNavigate,
		mockedUsedLocation,
		history,
	};
}

/**
 * App specific Helper function that wraps a component inside a React Redux-store provider and a regular router. Used for testing component functionality. Router specificly is used in cases where we do not need MemoryRouter functionality, but need to otherwise observe when location is changed.
 * @param {JSX} ui The component that is to be wrapped.
 * @param {Object} reduxConfig takes the given store and its initial state if provided as an object. If no store is provided, it creates a store using the defaultReducers as well as the initialState (initialState=undefined by default.)
 * @returns {Function}
 */
function renderWithReduxAndRouter(
	ui,
	{
		reducers = defaultReducers,
		preloadedState,
		initialPath = '/',
		store = createStore(reducers, preloadedState, applyMiddleware(thunk)),
		...renderOptions
	} = {}
) {
	const history = createMemoryHistory();

	function Wrapper({ children }) {
		return (
			<Provider store={store}>
				<Router location={history.location} navigator={history}>
					{children}
				</Router>
			</Provider>
		);
	}
	return {
		utils: rtlRender(ui, { wrapper: Wrapper, ...renderOptions }),
		mockedUsedNavigate,
		history,
	};
}

// re-export everything
export * from '@testing-library/react';
// override render method
export { renderWithReduxAndRouter, renderWithReduxAndMemoryRouter };

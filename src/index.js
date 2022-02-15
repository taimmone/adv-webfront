/** @format */
import React from 'react';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

import { Provider } from 'react-redux';
import store from './redux/store';

ReactDOM.render(
	<Provider store={store}>
		<BrowserRouter>
			<StrictMode>
				<App />
			</StrictMode>
		</BrowserRouter>
	</Provider>,
	document.getElementById('root')
);

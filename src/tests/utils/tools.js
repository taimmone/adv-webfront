/** @format */
import userEvent from '@testing-library/user-event';
import {
	renderWithReduxAndMemoryRouter,
	renderWithReduxAndRouter,
} from './renders';
import { defaultState, mockStoreCreator } from './testStores';
import { act } from 'react-dom/test-utils';
import { fireEvent, waitFor, within } from '@testing-library/react';
import { Routes } from 'react-router-dom';

let _store;

export const config = ({
	component,
	preloadedState,
	needsRoutes,
	startingPath,
}) => {
	return {
		component,
		preloadedState: { ...defaultState, ...preloadedState },
		needsRoutes,
		startingPath,
	};
};

export const setupWithMock = (
	{ component, preloadedState, needsRoutes, startingPath },
	render = renderWithReduxAndMemoryRouter
) => {
	let componentWithRoutes;
	if (needsRoutes) {
		componentWithRoutes = <Routes>{component}</Routes>;
	}
	//Mocking dispatch
	const store = mockStoreCreator(preloadedState);
	store.dispatch = jest.fn();

	return {
		store,
		...render(componentWithRoutes || component, {
			store,
			initialPath: startingPath,
		}),
	};
};

export const when = ({ config, situation, caseNum, display }) => {
	return {
		itShould: {
			displayComponent: function (componentId) {
				it(`When ${situation}, it should display component ${componentId}`, async () => {
					const { utils } = setupWithMock(config);
					expect(await utils.findByTestId(componentId)).toExist();
				});
			},
			navigateTo: function (location) {
				it(`When ${situation}, it should navigate to ${location}`, async () => {
					const { mockedUsedNavigate } = setupWithMock(config);
					// console.log('test', mockedUsedNavigate.mock);
					// await waitFor(() => {
					// expect(history.location.pathname).toEqual(location);
					expect(mockedUsedNavigate).toHaveBeenCalledTimes(1);
					// expect(mockedUsedNavigate).toHaveBeenCalledTimes(1);
					const mockCall = mockedUsedNavigate.mock.calls[0][0];
					if (typeof mockCall === 'object') {
						expect(mockCall?.to).toEqual(location);
					} else {
						expect(mockCall).toEqual(location);
					}
					// });
					// 	// Ensuring that useNavigate is called with the correct property
					// }, 10);
				});
			},
		},
	};
};

export const removeCookie = (name) => {
	document.cookie = `${name}=1; expires=1 Jan 1970 00:00:00 GMT;`;
};

/**
 * @description A test to ensure that all of the data-testIds in the given array exist in the rendered component using given setup.
 * @param {Array} arrayOfTestIds - The array of data-testIds,
 * @param {Object} config - uses to create a new render instance.
 * */
export const display = (arrayOfTestIds, config, afterTime = 0) => {
	it(`Display ${arrayOfTestIds.toString().replaceAll(',', ', ')}${
		afterTime ? ` after ${afterTime}(ms) has passed` : ''
	}`, async () => {
		const { utils } = setupWithMock(config);
		jest.useFakeTimers();
		jest.advanceTimersByTime(afterTime);
		for (const testId of arrayOfTestIds) {
			expect(await utils.findByTestId(testId)).toBeTruthy();
		}
	});
};
/**
 * @description A test to ensure that the component displays the correct number of data-testIds using given setup.
 * @param {String} testId  The data-testId,
 * @param {Number} amount The number of data-testIds that should exist.
 * @param {function} setup creates a new render instance.
 * */
export const displayMultiple = (testIds, amount, config) => {
	it(`Displays correct number of ${testIds
		.toString()
		.replaceAll(',', ', ')} (${amount})`, async () => {
		const { utils } = setupWithMock(config);
		for (let index = 0; index < testIds.length; index++) {
			const testId = testIds[index];

			const renderedProducts = await utils.findAllByTestId(testId);
			expect(renderedProducts).toHaveLength(amount);
		}
	});
};

/**
 * @description A test to ensure that none of the data-testIds in the given array exist in the rendered component using given setup.
 * @param {Array} arrayOfTestIds  The array of data-testIds,
 * @param {function} setup creates a new render instance.
 * */
export const displayNot = (arrayOfTestIds, config) => {
	it(`Does not display ${arrayOfTestIds
		.toString()
		.replaceAll(',', ', ')}`, () => {
		for (const testId of arrayOfTestIds) {
			const { utils } = setupWithMock(config);
			expect(utils.queryByTestId(testId)).not.toBeInTheDocument();
		}
	});
};

export const displayingCorrectComponents = ({
	mainComponent,
	preloadedState,
	displayComponents,
	displayNotComponents,
}) => {
	describe(`Displaying correct components - ${preloadedState.auth.role}`, () => {
		if (displayComponents) {
			it(`Should be able to access all role-specific paths`, async () => {
				let path;
				for (const componentId in displayComponents) {
					try {
						path = displayComponents[componentId];
						const { utils } = setupWithMock({
							component: mainComponent,
							preloadedState,
							needsRoutes: false,
							startingPath: path,
						});
						await act(async () => {
							jest.useFakeTimers();
							jest.advanceTimersByTime(10000);
							expect(await utils.findByTestId(componentId)).toBeTruthy();
						});
					} catch (error) {
						throw new Error(
							`FAILURE: Could not find component ${componentId} while trying to access path: ${path} as ${preloadedState.auth.role} (should be able to!!!). Check that the component is named correctly and that the path is configured correctly.`
						);
					}
				}
			});
		}
		if (displayNotComponents) {
			it(`Should not be able to access unauthorized paths`, async () => {
				let path;
				for (const componentId in displayNotComponents) {
					try {
						path = displayNotComponents[componentId];
						const { utils } = setupWithMock({
							component: mainComponent,
							preloadedState,
							needsRoutes: false,
							startingPath: path,
						});
						await act(async () => {
							jest.useFakeTimers();
							jest.advanceTimersByTime(10000);
							expect(utils.queryByTestId(componentId)).not.toBeInTheDocument();
						});
						// expect(await utils.findByTestId(componentId)).toBeTruthy();
					} catch (error) {
						throw new Error(
							`FAILURE: Found component ${componentId} while trying to access path: ${path} as ${preloadedState.auth.role} (should NOT be able to!!!). Check that the path is configured correctly.`
						);
					}
				}
			});
		}
	});
};

export const elements = (arrayOfElementIds, config) => {
	return {
		shouldHaveStyle: function (objectOfValues) {
			it(`Elements with data-testids of ${arrayOfElementIds
				.toString()
				.replaceAll(',', ', ')} should have correct styles`, () => {
				const { utils } = setupWithMock(config);
				for (let index = 0; index < arrayOfElementIds.length; index++) {
					const element = arrayOfElementIds[index];
					const value = objectOfValues[element];
					expect(utils.getByTestId(element)).toHaveStyle(value);
				}
			});
		},
		shouldHaveValue: function (objectOfValues) {
			it(`Elements with data-testids of ${arrayOfElementIds
				.toString()
				.replaceAll(',', ', ')} should have correct values`, () => {
				const { utils } = setupWithMock(config);
				for (let index = 0; index < arrayOfElementIds.length; index++) {
					const element = arrayOfElementIds[index];
					const value = objectOfValues[element];
					try {
						expect(utils.getByTestId(element)).toHaveValue(value);
					} catch (error) {
						throw new Error(
							`FAILURE: Could not find "${value}" as a value of an element with data-testid of ${arrayOfElementIds[index]}`
						);
					}
				}
			});
		},
		shouldHaveCorrectRoleWithin: (parentId) => {
			it(`Elements with data-testids of ${arrayOfElementIds
				.toString()
				.replaceAll(
					',',
					', '
				)} should have correct role within ${parentId}`, () => {
				const { utils } = setupWithMock(config);
				for (let index = 0; index < arrayOfElementIds.length; index++) {
					try {
						const element = arrayOfElementIds[index];
						const component = utils.getAllByTestId(parentId);
						const role = within(component[0]).getAllByRole(
							element.split('-')[1]
						);

						expect(role[0]).toBeInTheDocument();
						// expect(utils.getByTestId(element)).tohaveRole(textContent);
					} catch (error) {
						// console.log(error);
						throw new Error(
							`FAILURE: Could not find element with role ${
								arrayOfElementIds[index].split('-')[1]
							} and data-testid of ${
								arrayOfElementIds[index]
							} within ${parentId}`
						);
					}
				}
			});
		},
		shouldHaveTextContent: function (objectOfText) {
			it(`Elements with data-testids of ${arrayOfElementIds
				.toString()
				.replaceAll(',', ', ')} should have correct text content`, () => {
				const { utils } = setupWithMock(config);
				for (let index = 0; index < arrayOfElementIds.length; index++) {
					const element = arrayOfElementIds[index];
					const textContent = objectOfText[element];
					try {
						expect(utils.getByTestId(element)).toHaveTextContent(textContent);
					} catch (error) {
						throw new Error(
							`FAILURE: Could not find "${textContent}" as a text content of an element with data-testid of ${arrayOfElementIds[index]}`
						);
					}
				}
			});
		},
		shouldHaveAttribute: function (attribute, value) {
			it(`Elements with ids of ${arrayOfElementIds
				.toString()
				.replaceAll(
					',',
					', '
				)} should have property "${attribute}" set to "${value}"`, () => {
				const { utils } = setupWithMock(config);
				for (const id of arrayOfElementIds) {
					expect(utils.getByTestId(id)).toHaveProperty(attribute, value);
				}
			});
		},
		shouldNotHaveAttribute: function (attribute) {
			for (const id in arrayOfElementIds) {
				it(`Element with id of ${id} should have property ${attribute}`, () => {
					const { utils } = setupWithMock(config);
					expect(utils.getByTestId(id)).not.toHaveProperty(attribute, true);
				});
			}
		},
	};
};

export const changeNot = (config) => {
	return {
		selects: function (arrayOfSelectIds) {
			return {
				toValues: function (arrayOfValues) {
					for (let index = 0; index < arrayOfValues.length; index++) {
						const value = arrayOfValues[index];
						const selectId = arrayOfSelectIds[index];
						it(`Should not be able to change the value of a select with id of ${selectId} to ${value}`, () => {
							const { utils } = setupWithMock(config);
							const inputEl = utils.getByTestId(selectId);
							act(() => {
								fireEvent.change(inputEl, { target: { value } });
							});
							expect(utils.getByTestId(selectId)).not.toHaveValue(value);
						});
					}
				},
			};
		},
		inputs: function (arrayOfInputIds) {
			return {
				toValues: function (arrayOfValues) {
					for (let index = 0; index < arrayOfValues.length; index++) {
						const value = arrayOfValues[index];
						const inputId = arrayOfInputIds[index];
						it(`Should be able to change the value of input with id of ${inputId} to ${value}`, () => {
							const { utils } = setupWithMock(config);
							const inputEl = utils.getByTestId(inputId);
							act(() => {
								fireEvent.change(inputEl, { target: { value } });
							});
							expect(utils.getByTestId(inputId)).toHaveValue(value);
						});
					}
				},
			};
		},
	};
};
/**
 * @description A Helper function to create a test that makes sure that desired inputs can have their values changed.
 * @param {Object} config
 * @returns {Function}
 */
export const change = (config) => {
	return {
		select: function (selectId) {
			return {
				toValues: function (arrayOfValues) {
					it(`Should be able to change the value of ${selectId} to ${arrayOfValues
						.toString()
						.replaceAll(',', ' or ')}`, () => {
						const { utils } = setupWithMock(config);
						for (let index = 0; index < arrayOfValues.length; index++) {
							const value = arrayOfValues[index];
							const inputEl = utils.getByTestId(selectId);
							act(() => {
								fireEvent.change(inputEl, { target: { value } });
							});
							expect(utils.getByTestId(selectId)).toHaveValue(value);
						}
					});
				},
			};
		},
		inputs: function (arrayOfInputIds) {
			return {
				toValues: function (arrayOfValues) {
					it(`Should be able to change the value of inputs: ${arrayOfInputIds
						.toString()
						.replaceAll(',', ', ')}`, () => {
						const { utils } = setupWithMock(config);
						for (let index = 0; index < arrayOfValues.length; index++) {
							const value = arrayOfValues[index];
							const inputId = arrayOfInputIds[index];
							const inputEl = utils.getByTestId(inputId);
							act(() => {
								fireEvent.change(inputEl, { target: { value } });
							});
							const inputValue = utils.getByTestId(inputId).value;
							expect(inputValue.toString()).toBe(value.toString());
						}
					});
				},
			};
		},
	};
};

export const clicking = (id, config, amount = 1) => {
	return {
		callsMock: function (ObjectOfMocks) {
			for (const mockFunc in ObjectOfMocks) {
				it(`Should call ${mockFunc}-function ${amount} time${
					amount > 1 ? 's' : ''
				} when clicking ${id}`, () => {
					const { utils } = setupWithMock(config);
					for (let index = 0; index < amount; index++) {
						act(() => {
							userEvent.click(utils.getByTestId(id));
						});
					}

					expect(ObjectOfMocks[mockFunc]).toHaveBeenCalledTimes(amount);
				});
			}
		},
		dispatches: function (action) {
			return {
				withData: function (data) {
					it(`Should dispatch ${JSON.stringify(
						action
					)}-action with data when clicking ${id}`, () => {
						const { utils } = setupWithMock(config);
						act(() => {
							userEvent.click(utils.getByTestId(id));
						});

						expect(_store.dispatch).toHaveBeenCalledTimes(1);
						expect(_store.dispatch).toHaveBeenCalledWith(action(data));
					});
				},
			};
		},
		navigatesTo: function (location) {
			return it(`Clicking ${id} navigates to ${location}`, async () => {
				const { mockedUsedNavigate, utils } = setupWithMock(config);
				userEvent.click(await utils.findByTestId(id));
				// Ensuring that useNavigate gets called:
				expect(mockedUsedNavigate).toHaveBeenCalledTimes(1);
				// Ensuring that useNavigate is called with the correct property
				expect(mockedUsedNavigate.mock.calls[0][0]).toEqual(location);
			});
		},
		changesLocationTo: function (location) {
			return it(`Clicking a Link with data-testid ${id} changes location to ${location}`, async () => {
				const { history, utils } = setupWithMock(
					config,
					renderWithReduxAndRouter
				);

				// expect(mockedUsedNavigate).toHaveBeenCalledTimes(1);

				await waitFor(async () => {
					userEvent.click(await utils.findByTestId(id));
				});
				// Because we use the router with history, we can access history.location.pathname to ensure the Links to-value is equal to location.
				expect(history.location.pathname).toEqual(location);
			});
		},
		sets: function (payload) {
			return {
				to: function (reducerName) {
					it(`Clicking ${id} stores ${JSON.stringify(
						payload
					)} to ${reducerName}-state`, async () => {
						const { component, store } = setupWithMock(config);
						await act(async () => {
							userEvent.click(component.getByTestId(id));
						});
						await act(async () => {
							userEvent.click(component.getByTestId(id));
						});

						expect(store.dispatch).toHaveBeenCalledTimes(1);
						// expect(store.dispatch).toHaveBeenCalledWith(
						//   myAction({ payload: 'some other text' })
						// );
						//Using a bit of a gimmick to ensure the _store is given time to update
						await new Promise((res, rej) => {
							setTimeout(res, 50);
						});

						const state = _store.getState()[reducerName];
						expect(state).toEqual(payload);
					});
				},
			};
		},
		displays: function (arrayOfTestIds) {
			for (const testId of arrayOfTestIds) {
				it(`Clicking ${id} ${amount} time${
					amount > 1 ? 's' : ''
				} displays ${testId}`, async () => {
					const { utils } = setupWithMock(config);
					for (let index = 0; index < amount; index++) {
						userEvent.click(utils.getByTestId(id));
					}
					expect(await utils.findByTestId(testId)).toBeInTheDocument();
				});
			}
		},
		displaysNot: function (arrayOfTestIds) {
			for (const testId of arrayOfTestIds) {
				it(`Clicking ${id} ${amount} time${
					amount > 1 ? 's' : ''
				} hides ${testId}`, async () => {
					const { utils } = setupWithMock(config);
					for (let index = 0; index < amount; index++) {
						userEvent.click(utils.getByTestId(id));
					}
					expect(await utils.queryByTestId(testId)).not.toBeInTheDocument();
				});
			}
		},
	};
};

/**
 * A helper function to handle dispatch-tests.
 * @param {Object} ActionDetails
 * @param {Function} ActionDetails.action - The action that is expected to be dispatched
 * @param {*} ActionDetails.value - The value that the action is expected to dispatch.
 * @param {Boolean} ActionDetails.usesThunk - Tells whether or not this action may contain thunk-logic
 * @returns {Function}
 */
export const dispatch = ({ action, value, usesThunk }) => {
	return {
		/**
		 * @description when-function Takes the case-details
		 * @typedef {Object} When
		 * @param {object} details - contains required parameters
		 * @param {Number} details.caseNum - The number of the current case
		 * @param {String} details.situation - The details of the situation
		 * @param {Object} details.config - The configuration of the situation
		 * @param {Array} details.FilledInputs - Filled inputs
		 * @param {Object} details.FilledInputs.inputId - data-testid
		 * @param {String} details.FilledInputs.inputValue - input values
		 * @param {String} details.userClickTarget - data-testid of click target.
		 */
		when: ({
			caseNum,
			situation,
			config,
			FilledInputs,
			userClickTarget,
			afterTime = 0,
		}) => {
			it(`${caseNum ? `Case ${caseNum}: ` : ''}${situation ? situation : ''}${
				situation && userClickTarget ? ', ' : ''
			} ${userClickTarget ? userClickTarget + ' clicked' : ''} -> ${
				action.name
			}-action dispatched`, async () => {
				const { store, utils } = setupWithMock(config);
				// if there are user inputs, fill these inputs
				if (
					FilledInputs?.constructor === Object &&
					Object.keys(FilledInputs).length !== 0
				) {
					for (const inputId in FilledInputs) {
						const value = FilledInputs[inputId];
						const inputEl = utils.getByTestId(inputId);
						act(() => {
							fireEvent.change(inputEl, { target: { value } });
						});
						const inputValue = inputEl.value;
						expect(inputValue.toString()).toBe(value.toString());
					}
				}
				if (userClickTarget) {
					act(() => {
						userEvent.click(utils.getByTestId(userClickTarget));
					});
				}
				jest.useFakeTimers();
				jest.advanceTimersByTime(afterTime);

				await waitFor(() => expect(store.dispatch).toHaveBeenCalledTimes(1));

				if (usesThunk) {
					expect(store.dispatch.mock.calls[0][0].toString()).toBe(
						action(value).toString()
					);
				} else {
					expect(store.dispatch).toHaveBeenCalledWith(action(value));
				}
			});
		},
	};
};

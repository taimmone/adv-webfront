/** @format */

import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
//Own utils for testing
import {
	config,
	dispatch,
	display,
	displayNot,
	elements,
} from '../utils/tools';
//Component(s) to test:
import Notification from '../../components/Notification';
//Dispatched Actions:
import { removeNotification } from '../../redux/actionCreators/notificationsActions';

afterEach(() => {
	jest.runOnlyPendingTimers();
	jest.useRealTimers();
	cleanup();
});

beforeEach(() => {
	jest.useFakeTimers();
});

const notificationIsSuccess = { message: 'testMessage', isSuccess: true };
const notificationIsNotSuccess = { message: 'testMessage', isSuccess: false };

const hasNoNotification = config({ component: <Notification /> });
const hasNotificationSuccess = config({
	component: <Notification />,
	preloadedState: { notification: notificationIsSuccess },
});
const hasNotificationFailure = config({
	component: <Notification />,
	preloadedState: { notification: notificationIsNotSuccess },
});
describe('Notification-component - UNIT TESTS', () => {
	describe('Displaying correct elements', () => {
		describe('Case 1: Has No notification in notification-state', () => {
			display(['no-notification-component'], hasNoNotification);
			displayNot(['notification-component'], hasNoNotification);
		});
		describe('Case 2: Has notification in notification-state', () => {
			display(['notification-component'], hasNotificationSuccess);
			displayNot(['no-notification-component'], hasNotificationSuccess);
		});
	});
	describe('Displaying correct data in elements', () => {
		describe('Case 1: Notification isSuccess-value === true', () => {
			elements(
				['notification-component'],
				hasNotificationSuccess
			).shouldHaveStyle({
				'notification-component': 'backgroundColor: green',
			});
			elements(
				['notification-component'],
				hasNotificationSuccess
			).shouldHaveTextContent({
				'notification-component': notificationIsSuccess.message,
			});
		});
		describe('Case 2: Notification isSuccess-value === false', () => {
			elements(
				['notification-component'],
				hasNotificationFailure
			).shouldHaveStyle({
				'notification-component': 'backgroundColor: red',
			});
			elements(
				['notification-component'],
				hasNotificationFailure
			).shouldHaveTextContent({
				'notification-component': notificationIsNotSuccess.message,
			});
		});
	});
	describe('Dispatching correct actions', () => {
		describe('Removing the notification', () => {
			dispatch({ action: removeNotification, usesThunk: false }).when({
				caseNum: 1,
				situation: 'Enough time has passed',
				config: hasNotificationSuccess,
				afterTime: 20000,
			});
		});
	});
});

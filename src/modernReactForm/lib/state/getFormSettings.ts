import MFTypes from '../MFTypes'

/**
 * Функция формирует и возвращает объект с настройками при каких событиях проверять поле ввода
 * @param configCheckingOpts
 */
export default function getFormSettings(configCheckingOpts: MFTypes.FormSettings = {}) {
	return function () {
		const defaultCheckingOpts: MFTypes.FormSettings = {
			checkBeforeSubmit: 'never',
			checkAfterSubmit: 'onChange',
			disableFields: 'never',
			clearFieldsAfterSubmit: false,
			sendFormOnFieldBlur: false,
			sendFormOnFieldChange: false,
		}
		
		return Object.assign(defaultCheckingOpts, configCheckingOpts)
	}
}


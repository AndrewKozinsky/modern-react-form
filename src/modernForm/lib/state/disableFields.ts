import MFTypes from '../MFTypes'

/**
 * Функция блокирует/разблокирует поля и возвращает новый объект состояния полей
 * @param {Boolean} needToDisable — нужно ли блокировать или наоборот разблокировать поля формы
 * @param {Object} stateFields — объект с состояниями полей формы
 */
export default function disableFields(
	needToDisable: boolean,
	stateFields: MFTypes.StateFields,
) {
	const newStateFields = { ...stateFields }
	
	for (const fieldName in newStateFields) {
		newStateFields[fieldName] = {
			...newStateFields[fieldName],
			disabled: needToDisable
		}
	}
	
	return newStateFields
}

/**
 * Функция очищает значения полей и возвращает новый объект состояния полей формы
 * @param stateFields
 */
export function clearFields(
	stateFields: MFTypes.StateFields,
) {
	const newStateFields = { ...stateFields }
	
	for (const fieldName in newStateFields) {
		const newStateField = { ...newStateFields[fieldName] }
		
		if (newStateField.fieldType === 'text') {
			newStateField.value = ''
		}
		else if (newStateField.fieldType === 'checkbox' || newStateField.fieldType === 'radio') {
			newStateField.inputs.map(input => {
				input.checked = false
			})
		}
		else if (newStateField.fieldType === 'toggle') {
			newStateField.checked = false
		}
		else if (newStateField.fieldType === 'select') {
			newStateField.checkedValue = ''
		}
	}
	
	return newStateFields
}

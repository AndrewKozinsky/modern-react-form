import MFTypes from '../MFTypes'


/**
 * Функция возвращает объект со значениями полей формы
 * @param {Object} fields — fields data
 */
export default function getReadyFieldsValues(fields: MFTypes.StateFields): MFTypes.ReadyFieldsValues {
	const fieldsValuesObj: MFTypes.ReadyFieldsValues = {}

	for (const fieldName in fields) {
		const field = fields[fieldName]
		
		if (field.fieldType == 'text') {
			fieldsValuesObj[fieldName] = field.value
		}
		else if (field.fieldType == 'checkbox') {
			// Все отмеченные поля
			const checkedInputs = field.inputs.filter(input => input.checked)
			// Вернуть value всех отмеченных полей
			fieldsValuesObj[fieldName] = checkedInputs.map(input => input.value)
		}
		else if (field.fieldType == 'radio') {
			// Все отмеченные поля
			const checkedInput = field.inputs.find(input => input.checked)
			// Вернуть value всех отмеченных полей
			fieldsValuesObj[fieldName] = checkedInput?.value || null
		}
		else if (field.fieldType == 'toggle') {
			fieldsValuesObj[fieldName] = field.checked
		}
		else if (field.fieldType == 'select') {
			fieldsValuesObj[fieldName] = field.checkedValue
		}
	}

	return fieldsValuesObj
}


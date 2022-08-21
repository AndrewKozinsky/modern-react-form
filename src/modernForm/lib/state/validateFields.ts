import MFTypes from '../MFTypes'

/**
 * Функция проверяет значение поля с помощью переданной проверяющей функции.
 * И в зависимости от проверки возвращает или null, если ошибки нет, или текст ошибки.
 * @param {Object} fieldsState — объект состояния полей формы
 * @param {Object} fieldState — объект состояния поля формы
 * @param {Object} fieldConfig — конфигурация поля формы
 */
export function getErrorOfField(
	fieldsState: MFTypes.StateFields,
	fieldState: MFTypes.StateField,
	fieldConfig: MFTypes.ConfigField
): null | string {
	const schema = fieldConfig.schema
	if (!schema) return null
	
	// В переменную в зависимости от типа поля будет присваиваться значение поля.
	let value: MFTypes.FieldSchemaFieldValue = ''
	
	if (fieldState.fieldType === 'text') {
		value = fieldState.value
	}
	else if (fieldState.fieldType === 'checkbox') {
		const checkedInputs = fieldState.inputs.filter(input => input.checked)
		
		if (checkedInputs) {
			value = checkedInputs.map(input => input.value)
		}
	}
	else if (fieldState.fieldType === 'radio') {
		const checkedInput = fieldState.inputs.find(input => input.checked)
		
		if (checkedInput) {
			value = checkedInput.value
		}
	}
	else if (fieldState.fieldType === 'toggle') {
		value = fieldState.checked
	}
	else if (fieldState.fieldType === 'select') {
		value = fieldState.checkedValue
	}
	
	// Передать значение поля в проверяющую функцию и вернуть ответ.
	return schema(fieldsState, value) || null
}

/**
 * Функция проходит по всем полям, проверяет значение и ставит/убирает ошибки у каждого поля.
 * Возвращает булево значение имеет ли форма хотя бы одну ошибку.
 * @param {Object} stateFields — объект состояния полей формы
 * @param {Function} setStateFields — функция устанавливающая в Хранилище новый объект состояния полей
 * @param {Object} formConfig — объект конфигурации формы
 */
export function setErrorToAllTextFields(
	stateFields: MFTypes.StateFields,
	setStateFields: MFTypes.SetStateFields,
	formConfig: MFTypes.Config
) {
	// Флаг сообщающий имеют ли хотя бы одно поле ошибку
	let fieldsHaveErrors = false
	
	const newStateFields: MFTypes.StateFields = {}
	
	Object.keys(stateFields).map(fieldName => {
		// Объект состояния и объект конфигурации поля
		const fieldState = stateFields[fieldName]
		const fieldConfig = formConfig.fields[fieldName]
		
		// Получить значение ошибки
		const fieldError = getErrorOfField(stateFields, fieldState, fieldConfig)
		
		if (fieldError) fieldsHaveErrors = true
		
		// Поставить в объект состояния полей это поле, но с новым значением ошибки
		newStateFields[fieldName] = { ...fieldState, error: fieldError }
	})
	
	setStateFields(newStateFields)
	
	return fieldsHaveErrors
}

/**
 * Функция проверяет форму на ошибки и обновляет значение флага formHasErrors в Хранилище
 * @param {Object} stateFields — объект состояния полей формы
 * @param {Object} formConfig — объект конфигурации формы
 * @param {Function} setFormHasErrors — функция обновляющая значение флага содержит ли форма ошибки
 */
export function setFormHasErrorsFlag(
	stateFields: MFTypes.StateFields,
	formConfig: MFTypes.Config,
	setFormHasErrors: MFTypes.SetFormHasErrors,
) {
	// Превратить объект состояния полей формы в массив для дальнейшего перебора
	const formConfigFieldsKeys = Object.keys(formConfig.fields)
	
	for (let i = 0; i < formConfigFieldsKeys.length; i++) {
		const fieldName = formConfigFieldsKeys[i]
		
		const fieldState = stateFields[fieldName]
		const fieldConfig = formConfig.fields[fieldName]
		
		const error = getErrorOfField(stateFields, fieldState, fieldConfig)
		if (error) {
			setFormHasErrors(true)
			return
		}
	}
	
	setFormHasErrors(false)
}

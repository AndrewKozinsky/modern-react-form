import { ReactElement } from 'react'
import MFTypes from '../MFTypes'

/**
 * Функция создаёт объект с названиями полей формы в ключе и сами элементы для отрисовки в значении
 * @param {Object} state — объект возвращаемый функцией useFormState() с различными деталями формы
 * @param {Object} formConfig — объект конфигурации формы
 */
export function createFieldComps(
	state: MFTypes.State,
	formConfig: MFTypes.Config
): {[key in keyof typeof state.fields]: ReactElement} {
	const result: {[key in keyof typeof state.fields]: ReactElement} = {}
	
	Object.keys(formConfig.fields).map((fieldName) => {
		const fieldConfig = formConfig.fields[fieldName]
		const fieldState = state.fields[fieldName]
		
		// Получение функции-компонента
		const Component = formConfig.fields[fieldName].component
		
		// Формирование объекта свойствам компонента
		const compProps: Record<string, any> = { ...fieldConfig.fieldData }
		
		if (fieldState.fieldType === 'text' && fieldConfig.fieldType) {
			compProps.mName = fieldName
			compProps.mValue = fieldState.value
			compProps.mDisabled = fieldState.disabled
			compProps.mError = fieldState.error
		}
		else if (fieldState.fieldType === 'checkbox' && fieldConfig.fieldType === 'checkbox') {
			compProps.mName = fieldName
			compProps.mDisabled = fieldState.disabled
			compProps.mError = fieldState.error
		}
		else if (fieldState.fieldType === 'radio' && fieldConfig.fieldType === 'radio') {
			compProps.mName = fieldName
			compProps.mDisabled = fieldState.disabled
			compProps.mError = fieldState.error
		}
		else if (fieldState.fieldType === 'toggle' && fieldConfig.fieldType === 'toggle') {
			compProps.mName = fieldName
			compProps.mValue = fieldConfig.value
			compProps.mChecked = fieldState.checked
			compProps.mDisabled = fieldState.disabled
			compProps.mError = fieldState.error
		}
		else if (fieldState.fieldType === 'select' && fieldConfig.fieldType === 'select') {
			compProps.mName = fieldName
			compProps.mValue = fieldState.checkedValue
			compProps.mOptions = fieldState.options
			compProps.mDisabled = fieldState.disabled
			compProps.mError = fieldState.error
		}
		
		compProps.mOnBlur = state.onBlurFn(fieldState, fieldConfig)
		compProps.mOnChange = state.onChangeFn(fieldState, fieldConfig)
		
		result[fieldName] = <Component {...compProps} />
	})
	
	return result
}


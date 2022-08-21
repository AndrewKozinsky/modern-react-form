import MFTypes from '../MFTypes'

/**
 * Функция создаёт объект с названиями полей формы в ключе и сами элементы для отрисовки в значении
 * @param {Object} state — объект возвращаемый функцией useFormState() с различными деталями формы
 * @param {Object} formConfig — объект конфигурации формы
 */
export function createFieldProps(
	state: MFTypes.State,
	formConfig: MFTypes.Config
) {
	const result: {[key in keyof typeof state.fields]: any} = {}
	
	Object.keys(formConfig.fields).map((fieldName) => {
		const fieldConfig = formConfig.fields[fieldName]
		const fieldState = state.fields[fieldName]
		
		const props: Record<string, any> = {
			mName: fieldName,
			mDisabled: fieldState.disabled,
			mError: fieldState.error,
			mOnBlur: state.onBlurFn(fieldState, fieldConfig),
			mOnChange: state.onChangeFn(fieldState, fieldConfig)
		}
		
		if (fieldState.fieldType === 'text' && fieldConfig.fieldType) {
			props.mValue = fieldState.value
		}
		else if (
			fieldState.fieldType === 'checkbox' && fieldConfig.fieldType === 'checkbox' ||
			fieldState.fieldType === 'radio' && fieldConfig.fieldType === 'radio'
		) {
			props.mInputs = fieldState.inputs
		}
		else if (fieldState.fieldType === 'toggle' && fieldConfig.fieldType === 'toggle') {
			props.mValue = fieldConfig.value
			props.mChecked = fieldState.checked
		}
		else if (fieldState.fieldType === 'select' && fieldConfig.fieldType === 'select') {
			props.mValue = fieldState.checkedValue
			props.mOptions = fieldState.options
		}
		
		result[fieldName] = props
	})
	
	return result
}

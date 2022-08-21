// import React from 'react'
import MFTypes  from '../MFTypes'
import {
	getErrorOfField,
	setFormHasErrorsFlag
} from '../state/validateFields'
import { sendForm } from './submitHandler'

/**
 * Обработчик изменения поля.
 * Получает объект с новыми значениями поля формы и ставит в состояние поле изменённое значение.
 * @param {Object} fieldValues — объект с новыми значениями поля формы
 * @param {Object} fields — объект состояния полей формы
 * @param {Function} setFields — функция устанавливающая объект состояния полей формы в useState
 */
export default function fieldChangeHandler(
	stateFields: MFTypes.StateFields, // Fields data from Store
	setStateFields: MFTypes.SetStateFields, // Fields data setting function
	formConfig: MFTypes.Config,
	settings: MFTypes.FormSettings,
	submitCounter: number,
	setSubmitCounter: MFTypes.SetSubmitCounter,
	setFormHasErrors: MFTypes.SetFormHasErrors,
	setCommonError: MFTypes.SetCommonError,
	setSubmitStatus: MFTypes.SetSubmitStatus,
) {
	return function (fieldState: MFTypes.StateField, fieldConfig: MFTypes.ConfigField) {
		return function (e: React.BaseSyntheticEvent) {
			
			// Имя и значение поля
			const fieldName = e.target.name
			const fieldValue: string = e.target.value
			
			let newFieldState: MFTypes.StateField = { fieldType: 'text', value: '', disabled: true }
			
			if (fieldConfig.fieldType === 'text' && fieldState.fieldType === 'text') {
				// Скопировать объект состояния поля и поставить новое значение value
				newFieldState = { ...fieldState, value: fieldValue }
			}
			else if (fieldConfig.fieldType === 'checkbox' && fieldState.fieldType === 'checkbox') {
				// Найти idx элемента с переданным value
				const inputIdx = fieldState.inputs.findIndex(input => input.value == fieldValue)
				
				// Сделать копию массив полей и поля, где нужно изменить параметр checked. И там поставить зеркальное значение checked.
				const newInputs = [...fieldState.inputs]
				newInputs[inputIdx] = { ...newInputs[inputIdx] }
				newInputs[inputIdx].checked = !newInputs[inputIdx].checked
				
				// Составить новый объект группы флагов
				newFieldState = { ...fieldState, inputs:  newInputs }
			}
			else if (fieldConfig.fieldType === 'radio' && fieldState.fieldType === 'radio') {
				const newInputs = fieldState.inputs.map(input => {
					return { ...input, checked: input.value == fieldValue }
				})
				
				// Составить новый объект группы переключателей
				newFieldState = { ...fieldState, inputs: newInputs }
			}
			else if (fieldConfig.fieldType === 'toggle' && fieldState.fieldType === 'toggle') {
				// Составить новый объект состояния поля с изменённым свойством checked
				newFieldState = { ...fieldState, checked: e.target.checked }
			}
			else if (fieldConfig.fieldType === 'select' && fieldState.fieldType === 'select') {
				newFieldState = { ...fieldState, checkedValue: fieldValue }
			}
			
			// Заменить объект поля его копией поля и сохранить в Хранилище
			const newStateFields: MFTypes.StateFields = { ...stateFields, [fieldName]: newFieldState }
			
			// Если следует проверить поле и показать/скрыть ошибку...
			if (submitCounter === 0 && settings.checkBeforeSubmit === 'onChange' || submitCounter > 0 && settings.checkAfterSubmit === 'onChange') {
				// Получить объекта состояния поля с установленной или убранной ошибкой
				newFieldState.error = getErrorOfField(stateFields, newFieldState, fieldConfig)
				
				// Поставить флаг имеет ли форма ошибки
				setFormHasErrorsFlag(newStateFields, formConfig, setFormHasErrors)
			}
			
			setStateFields(newStateFields)
			
			// Поставить флаг, что форма ожидает отправки
			setSubmitStatus('waiting')
			
			// Если предписано отправлять форму при изменении значения поля...
			if (settings.sendFormOnFieldBlur) {
				sendForm(
					newStateFields,
					setStateFields,
					formConfig,
					submitCounter,
					setSubmitCounter,
					setFormHasErrors,
					setCommonError,
					settings,
					setSubmitStatus
				)
			}
		}
	}
}


import React from 'react'
import MFTypes from '../MFTypes'
import {
	getErrorOfField,
	setFormHasErrorsFlag
} from '../state/validateFields'
import { sendForm } from './submitHandler'

/**
 * Обработчик потерей фокуса полем.
 * Получает объект с новыми значениями поля формы и ставит в поле новое значение.
 * @param {Object} fieldValues — объект с новыми значениями поля формы
 * @param {Object} fields — объект состояния полей формы
 * @param {Function} setFields — функция устанавливающая объект состояния полей формы в useState
 */
export default function fieldBlurHandler(
	stateFields: MFTypes.StateFields,
	setStateFields: MFTypes.SetStateFields,
	formConfig: MFTypes.Config,
	formSettings: MFTypes.FormSettings,
	submitCounter: number,
	setSubmitCounter: MFTypes.SetSubmitCounter,
	setFormHasErrors: MFTypes.SetFormHasErrors,
	setCommonError: MFTypes.SetCommonError,
	setSubmitStatus: MFTypes.SetSubmitStatus,
) {
	return function (fieldState: MFTypes.StateField, fieldConfig: MFTypes.ConfigField) {
		return function (e: React.BaseSyntheticEvent) {
			
			// Если следует проверить поле и показать/скрыть ошибку...
			if (submitCounter === 0 && formSettings.checkBeforeSubmit == 'onBlur' || submitCounter > 0 && formSettings.checkAfterSubmit == 'onBlur') {
				// Имя поля
				const fieldName = e.target.name
				
				// Получить значение ошибки
				const fieldError = getErrorOfField(stateFields, fieldState, fieldConfig)
				if (fieldError === fieldState.error) return
				
				// Скопировать объект состояния
				const newFieldState = { ...fieldState }
				newFieldState.error = fieldError
				
				// Заменить объект поля его копией поля
				const updatedFields: MFTypes.StateFields = { ...stateFields, [fieldName]: newFieldState }
				setStateFields(updatedFields)
				
				// Поставить флаг, что форма имеет ошибки (если это так)
				setFormHasErrorsFlag(stateFields, formConfig, setFormHasErrors)
			}
			
			// Поставить флаг, что форма ожидает отправки
			setSubmitStatus('waiting')
			
			// Если предписано отправлять форму при потере полем фокуса...
			if (formSettings.sendFormOnFieldBlur) {
				sendForm(
					stateFields,
					setStateFields,
					formConfig,
					submitCounter,
					setSubmitCounter,
					setFormHasErrors,
					setCommonError,
					formSettings,
					setSubmitStatus
				)
			}
		}
	}
}

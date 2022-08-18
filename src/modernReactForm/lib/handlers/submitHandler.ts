import React from 'react'
import MFTypes from '../MFTypes'
import getReadyFieldsValues from '../misc/getReadyFieldsValues'
import { setErrorToAllTextFields } from '../state/validateFields'
import disableFields, { clearFields } from '../state/disableFields'

/**
 * Обработчик отправки формы помещаемый на <form>
 * @param {Object} stateFields — объект состояния полей формы
 * @param {Function} setStateFields — функция устанавливающая в Хранилище новый объект состояния полей
 * @param {Object} formConfig — объект конфигурации формы
 * @param {Number} submitCounter — количество отправок формы
 * @param {Function} setSubmitCounter — функция устанавливающая количество отправок формы
 * @param {Function} setFormHasErrors — функция обновляющая значение флага содержит ли форма ошибки
 * @param {Function} setCommonError — функция обновляющая значение общей ошибки формы
 * @param {Object} formSettings — объект с настройками формы
 * @param {Function} setSubmitStatus — функция обновляющая значение статуса отправки формы
 */
export default function formSubmitHandler(
	stateFields: MFTypes.StateFields,
	setStateFields: MFTypes.SetStateFields,
	formConfig: MFTypes.Config,
	submitCounter: number,
	setSubmitCounter: MFTypes.SetSubmitCounter,
	setFormHasErrors: MFTypes.SetFormHasErrors,
	setCommonError: MFTypes.SetCommonError,
	formSettings: MFTypes.FormSettings,
	setSubmitStatus: MFTypes.SetSubmitStatus,
) {
	return function (e: React.SyntheticEvent) {
		e.preventDefault()
		
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


/**
 * Обработчик отправки формы
 * @param {Object} stateFields — объект состояния полей формы
 * @param {Function} setStateFields — функция устанавливающая в Хранилище новый объект состояния полей
 * @param {Object} formConfig — объект конфигурации формы
 * @param {Number} submitCounter — количество отправок формы
 * @param {Function} setSubmitCounter — функция устанавливающая количество отправок формы
 * @param {Function} setFormHasErrors — функция обновляющая значение флага содержит ли форма ошибки
 * @param {Function} setCommonError — функция обновляющая значение общей ошибки формы
 * @param {Object} formSettings — объект с настройками формы
 * @param {Function} setSubmitStatus — функция обновляющая значение статуса отправки формы
 */
export async function sendForm(
	stateFields: MFTypes.StateFields,
	setStateFields: MFTypes.SetStateFields,
	formConfig: MFTypes.Config,
	submitCounter: number,
	setSubmitCounter: MFTypes.SetSubmitCounter,
	setFormHasErrors: MFTypes.SetFormHasErrors,
	setCommonError: MFTypes.SetCommonError,
	formSettings: MFTypes.FormSettings,
	setSubmitStatus: MFTypes.SetSubmitStatus,
) {
	// Увеличить счётчик отправок формы
	setSubmitCounter(submitCounter + 1)
	
	// Проверить все текстовые поля на наличие ошибок и показать их
	const formHasErrors = setErrorToAllTextFields(stateFields, setStateFields, formConfig)
	
	// Поставить флаг имеет ли форма ошибки
	setFormHasErrors(formHasErrors)
	
	if (formHasErrors) return
	
	// Ошибок нет... Поставить флаг, что форма отправляется
	setSubmitStatus('pending')
	
	// Значения полей формы
	const readyFieldValues = getReadyFieldsValues(stateFields)
	
	// Настройки блокировки и очистки полей формы до и после отправки...
	const disableFieldsOption = formSettings.disableFields
	const clearAfterSubmit = formSettings.clearFieldsAfterSubmit
	
	// Если нужно заблокировать поля при отправке...
	if (disableFieldsOption == 'whileSubmit' || disableFieldsOption == 'whileAndAfterSubmit') {
		const newStateFields = disableFields(true, stateFields)
		setStateFields(newStateFields)
	}
	
	try {
		// Формирование нового объекта состояния полей...
		let newStateFields: MFTypes.StateFields = { ...stateFields }
		
		// Отправить запрос и получить ответ
		const response = await formConfig.requestFn(readyFieldValues)

		if (response.status == 'success') {
			// Обнулить общую ошибку
			setCommonError(null)
			
			// Разблокировать поля если они были заблокированы при отправке, но не нужно блокировать после
			if (disableFieldsOption == 'whileSubmit') {
				newStateFields = disableFields(false, stateFields)
			}
			// Заблокировать поля если они не должны быть заблокированы при отправке, но должны быть после
			else if (disableFieldsOption == 'afterSubmit') {
				newStateFields = disableFields(true, stateFields)
			}
			
			// Если нужно очистить форму после отправки. Может стоит брать значения переданные в конфигурации?
			if (clearAfterSubmit) {
				newStateFields = clearFields(stateFields)
			}
			
			// Поставить флаг, что форма отправилась успешно
			setSubmitStatus('success')
		}
		// Если функция отправки формы передала ошибочный ответ...
		else {
			// Поставить флаг, что форма содержит ошибки
			setFormHasErrors(true)
			
			// Поставить текст общей ошибки если она есть
			if (response.commonError) {
				setCommonError(response.commonError)
			}
			// Поставить текст ошибки полей, если они есть
			if (response.fieldsErrors) {
				
				response.fieldsErrors.forEach(fieldError => {
					const fieldName = fieldError.name
					
					const fieldState = newStateFields[fieldName]
					fieldState.error = fieldError.message
				})
			}
			
			// Поставить флаг, что форма отправилась неудачно
			setSubmitStatus('error')
		}
		
		// Поставить сформированный объект полей в качестве нового состояния
		setStateFields(newStateFields)
	}
	catch (err) {
		setFormHasErrors(true)
		
		// Поставить флаг, что форма отправилась неудачно
		setSubmitStatus('error')
	}
}

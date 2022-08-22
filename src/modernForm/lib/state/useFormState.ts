import { useCallback, useMemo, useState } from 'react'
import MFTypes from '../MFTypes'
import getInitialFieldsState from './getInitialFieldsState'
import fieldChangeHandler from '../handlers/fieldChangeHandler'
import getFormSettings from './getFormSettings'
import fieldBlurHandler from '../handlers/fieldBlurHandler'
import formSubmitHandler from '../handlers/submitHandler'
import updateFieldFn from './updateFieldFn'

/**
 * Хук создаёт Хранилища и обработчики используемые в форме
 * @param formConfig
 */
export default function useFormState(formConfig: MFTypes.Config): MFTypes.State {
	// Объект с состояниями полей формы
	const [fields, setFields] = useState(getInitialFieldsState(formConfig))
	
	// Счётчик количества попыток отправки формы
	const [submitCounter, setSubmitCounter] = useState(0)
	
	// Есть ли в форме ошибки?
	const [formHasErrors, setFormHasErrors] = useState(false)
	
	// Текст общей ошибки от сервера
	const [commonError, setCommonError] = useState<MFTypes.CommonError>(null)
	
	// Статус отправки формы
	const [submitStatus, setSubmitStatus] = useState<MFTypes.SubmitStatus>('waiting')
	
	// Настройки проверки правильности полей формы
	const settings = useMemo(getFormSettings(formConfig.settings), [])
	
	// Функция обновляет объект состояния любого поля
	const updateField = useCallback((fieldName: string, newFieldData: Partial<MFTypes.StateField>) => {
		updateFieldFn(fields, setFields, fieldName, newFieldData)
	}, [fields])
	
	// Обработчик изменения поля формы
	const onChangeFn: MFTypes.OnChangeFn = fieldChangeHandler(
		fields, setFields, formConfig , settings, submitCounter, setSubmitCounter, setFormHasErrors, setCommonError, setSubmitStatus
	)
	
	// Обработчик потери фокуса поля формы
	const onBlurFn: MFTypes.OnBlurFn = fieldBlurHandler(
		fields, setFields, formConfig, settings, submitCounter, setSubmitCounter, setFormHasErrors, setCommonError, setSubmitStatus
	)
	
	// Обработчик отправки формы
	const onSubmitFn: MFTypes.onSubmitFn = useCallback(formSubmitHandler(
		fields, setFields, formConfig, submitCounter, setSubmitCounter, setFormHasErrors, setCommonError, settings, setSubmitStatus
	), [fields, formConfig, submitCounter, settings])
	
	return {
		fields,
		updateField,
		onChangeFn,
		onBlurFn,
		onSubmitFn,
		formHasErrors,
		commonError,
		submitStatus
	}
}


import MFTypes from '../MFTypes'
import { useCallback, useMemo, useState } from 'react'
import getInitialFieldsState from './getInitialFieldsState'
import fieldChangeHandler from '../handlers/fieldChangeHandler'
import getFormSettings from './getFormSettings'
import fieldBlurHandler from '../handlers/fieldBlurHandler'
import formSubmitHandler from '../handlers/submitHandler'

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
	), [fields, setFields, formConfig, submitCounter, settings])
	
	return {
		fields,
		onChangeFn,
		onBlurFn,
		onSubmitFn,
		formHasErrors,
		commonError,
		submitStatus
	}
}

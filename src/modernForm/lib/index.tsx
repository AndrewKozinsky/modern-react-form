import MFTypes from './MFTypes'
import useFormState from './state/useFormState'
import { createFieldProps } from './components/createFieldComps'


/**
 * Хук возвращает объект с деталями для составления статьи
 * @param {Object} formConfig — объект настройки формы
 */
export default function useGetModernForm(formConfig: MFTypes.Config) {
	// Получения хранилищ и обработчиков используемых в форме
	const formState = useFormState(formConfig)
	
	return {
		fieldAttrs: createFieldProps(formState, formConfig), // Объект с состоянием полей
		onSubmit: formState.onSubmitFn,                      // Обработчик отправки форм, который нужно поставить в свойство onSubmit в <form>
		formHasErrors: formState.formHasErrors,              // Имеет ли форма ошибки
		commonError: formState.commonError,                  // Текст общей ошибки
		submitStatus: formState.submitStatus                 // Статус отправленной формы
	}
}

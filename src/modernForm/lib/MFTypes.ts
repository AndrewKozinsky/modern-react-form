import React from 'react'

// Все типы используемые ModernForm
namespace MFTypes {
	// КОНФИГУРАЦИЯ ==========================================
	
	// Объект конфигурации
	export type Config = {
		// Конфигурация полей формы
		fields: ConfigFields
		// Объект с настройками когда следует проверять поля формы
		settings?: FormSettings
		// Обработчик отправки формы
		requestFn: (readyFieldValues: ReadyFieldsValues) => Promise<RequestFnReturn>
	}
	
	// Конфигурация полей формы
	export type ConfigFields = Record<string, ConfigField>
	// Объединённый тип объекта настройки поля
	export type ConfigField = ConfigTextField | ConfigCheckboxesField | ConfigRadiosField | ConfigToggleField | ConfigSelectField
	
	// Передаваемые настройки текстового поля
	export type ConfigTextField = {
		// Тип поля
		fieldType: 'text'
		// Начальное значение атрибута value у поля
		initialValue?: string
		// Функция проверки поля
		schema?: FieldSchema<string>
	}
	
	// Передаваемые настройки группы флагов
	type ConfigCheckboxesField = {
		// Тип поля
		fieldType: 'checkbox'
		// Функция проверки поля
		schema?: FieldSchema<string[]>
		// Массив объектов с данными о флагах
		inputs: FieldGroupInputData[]
	}
	
	// Передаваемые настройки группы переключателей
	type ConfigRadiosField = {
		// Тип поля
		fieldType: 'radio'
		// Функция проверки поля
		schema?: FieldSchema<string>
		// Массив объектов с данными о переключателях
		inputs: FieldGroupInputData[]
	}
	
	// Передаваемые настройки тумблера
	type ConfigToggleField = {
		// Тип поля
		fieldType: 'toggle'
		// Значение атрибута value у флага
		value: string
		// Функция проверки поля
		schema?: FieldSchema<boolean>
		// Отмечен ли флаг изначально?
		initialChecked?: boolean
	}
	
	// Передаваемые настройки выпадающего списка
	type ConfigSelectField = {
		// Тип поля
		fieldType: 'select'
		// value изначально выбранного пункта. Первый если ничего не передано.
		initialCheckedValue?: string
		// Функция проверки поля
		schema?: FieldSchema<string>
		// Массив объектов с данными о пунктах выпадающего списка
		options: FieldGroupInputData[]
	}
	
	// Объект с данными флага или переключателя
	export type FieldGroupInputData = {
		label: string,
		value: string,
		checked?: boolean
	}
	
	// Функция проверяющая поле на правильность
	type FieldSchema<T extends FieldSchemaFieldValue> = <T extends FieldSchemaFieldValue>(fields: StateFields, value: T) => null | string
	export type FieldSchemaFieldValue = boolean | string | string[]
	
	// Обработчик изменения поля ввод
	export type OnChangeFn = (fieldState: StateField, fieldConfig: ConfigField) => OnChangeInnerFn
	export type OnChangeInnerFn = (e: React.BaseSyntheticEvent) => void
	
	// Обработчик потерей фокуса полем ввода
	export type OnBlurFn = (fieldState: StateField, fieldConfig: ConfigField) => OnChangeInnerFn
	export type OnBlurInnerFn = (e: React.BaseSyntheticEvent) => OnChangeInnerFn
	
	// Обработчик отправки формы
	export type onSubmitFn = (e: React.SyntheticEvent) => void
	
	// Функция увеличивающая счётчик количества попыток отправок формы
	export type SetSubmitCounter = ( counter: number ) => void
	// Функция ставящая флаг содержит ли форма ошибки
	export type SetFormHasErrors = ( counter: boolean ) => void
	
	// Объект возвращаемый функцией, которая запускается при отправке формы
	export type RequestFnReturn = RequestFnSuccessReturn | RequestFnFailReturn
	// Успешная отправка формы
	type RequestFnSuccessReturn = { status: 'success' }
	// Неудачная отправка формы
	type RequestFnFailReturn = {
		status: 'fail',
		commonError?: string,
		fieldsErrors?: { name: string, message: string }[]
	}
	
	// Настройки формы
	export type FormSettings = {
		// При каком событии проверять поля формы до первой отправки
		checkBeforeSubmit?: CheckFieldBeforeSubmit
		// При каком событии проверять поля формы после первой отправки
		checkAfterSubmit?: CheckFieldAfterSubmit
		// Настройка блокировки полей
		// never — не блокировать
		// whileSubmit — при отправке формы
		// whileAndAfterSubmit — при отправке формы и после получения ответа от сервера
		// afterSubmit — после получения ответа от сервера
		disableFields?: 'never' | 'whileSubmit' | 'whileAndAfterSubmit' | 'afterSubmit'
		// Стирать ли значения полей после отправки формы (false по умолчанию)
		clearFieldsAfterSubmit?: boolean
		// Отправлять ли форму после потерей поля фокуса (false по умолчанию)
		sendFormOnFieldBlur?: boolean
		// Отправлять ли форму после изменения поля (false по умолчанию)
		sendFormOnFieldChange?: boolean
	}
	type CheckFieldBeforeSubmit = 'never' | 'onChange' | 'onBlur' // never (не проверять), onChange (изменение значения поля), onBlur (потеря фокуса),
	type CheckFieldAfterSubmit = 'onChange' | 'onBlur' // onChange (изменение значения поля), onBlur (потеря фокуса)
	
	
	// ТИПЫ СВОЙСТВ ПЕРЕДАВАЕМЫХ КОМПОНЕНТАМ ==========================================
	type BaseCompProps = {
		mName: string
		mDisabled: boolean
		mError: null | string
		mOnBlur: OnBlurInnerFn
		mOnChange: OnChangeInnerFn
	}
	export type TextCompProps = BaseCompProps & { mValue: string }
	export type FieldGroupCompProps = BaseCompProps & { mInputs: StateFieldInputItem[] }
	export type ToggleCompProps = BaseCompProps & { mValue: string, mChecked: boolean }
	export type SelectCompProps = BaseCompProps & { mValue: string, mOptions: StateSelectOption[] }
	
	
	// СОСТОЯНИЕ ==========================================
	
	// Функция обновляющая объект состояния полей формы
	export type SetStateFields = (fields: StateFields) => void
	
	// Объект с данными состояния полей формы. В key название поля, в значении данные поля
	export type StateFields = Record<string, StateField>
	
	// Объединённый тип состояния поля
	export type StateField = StateTextField | StateCheckboxesField | StateRadiosField | StateToggleField | StateSelectField
	
	// Объект состояния текстового поля
	export type StateTextField = {
		// Тип поля
		fieldType: 'text'
		// Значение поля
		value: string
		// Заблокировано ли поле
		disabled: boolean
		// Ошибка поля
		error?: null | string
	}
	// Объект состояния флагов
	export type StateCheckboxesField = {
		// Тип поля
		fieldType: 'checkbox'
		// Массив флагов
		inputs: StateFieldInputItem[]
		// Заблокировано ли поле
		disabled: boolean
		// Ошибка поля
		error?: null | string
	}
	// Объект состояния переключателей
	export type StateRadiosField = {
		// Тип поля
		fieldType: 'radio'
		// Массив переключателей
		inputs: StateFieldInputItem[]
		// Заблокировано ли поле
		disabled: boolean
		// Ошибка поля
		error?: null | string
	}
	// Объект состояния тумблера
	export type StateToggleField = {
		// Тип поля
		fieldType: 'toggle'
		// выбран ли тумблер
		checked: boolean
		// Заблокировано ли поле
		disabled: boolean
		// Ошибка поля
		error?: null | string
	}
	// Объект состояния выпадающего списка
	export type StateSelectField = {
		// Тип поля
		fieldType: 'select'
		// Массив пунктов выпадающего списка
		options: StateSelectOption[]
		// value выбранного пункта выпадающего списка
		checkedValue: string
		// Заблокировано ли поле
		disabled: boolean
		// Ошибка поля
		error?: null | string
	}
	
	// Состояние пункта группового поля: флаги, переключатели или пункты выпадающего списка
	export type StateFieldInputItem = {
		label: string,
		value: string,
		checked: boolean
	}
	// Объект с данными пункта выпадающего списка
	export type StateSelectOption = Omit<StateFieldInputItem, 'checked'>
	
	// Функция обновляет объект состояния любого поля
	export type UpdateField = ( fieldName: string, newFieldData: StateField ) => void
	
	// Значения полей формы
	export type ReadyFieldsValues = Record<string, null | FieldSchemaFieldValue>
	
	// Тип общей ошибки от сервера и функция устанавливающая его в Хранилище
	export type CommonError = null | string
	export type SetCommonError = ( err: CommonError ) => void
	
	// Статус отправки формы:
	// waiting (форма ещё не отправлено)
	// pending (форма отправлена и ответ ещё не пришёл)
	// error (после отправки получен ошибочный ответ)
	// success — (после отправки получен успешный ответ)
	export type SubmitStatus = 'waiting' | 'pending' | 'error' | 'success'
	export type SetSubmitStatus = ( status: SubmitStatus ) => void
	
	export type State = {
		fields: StateFields
		updateField: UpdateField
		onChangeFn: OnChangeFn
		onBlurFn: OnBlurFn
		onSubmitFn: onSubmitFn
		formHasErrors: boolean
		commonError: CommonError
		submitStatus: SubmitStatus
	}
}

export default MFTypes


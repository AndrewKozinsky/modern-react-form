import * as yup from 'yup'
import MFTypes from '../../../lib/MFTypes'


/** Конфигурация формы */
const allFieldsFormConfig: MFTypes.Config = {
	fields: {
		text: {
			fieldType: 'text',
			schema(fields, value) {
				return checkTextField(() => {
					yup.string()
						.required('Обязательное поле')
						.email('Нужно написать почту')
						.max(8, 'Максимум можно использовать 8 символов')
						.validateSync(value)
				})
			}
		},
		textarea: {
			fieldType: 'text',
			schema(fields, value) {
				return checkTextField(() => {
					yup.string()
						.required('Обязательное поле')
						.min(4, 'Пароль должен иметь минимум 4 символа')
						.max(6, 'Пароль может иметь максимум 6 символов')
						.validateSync(value)
				})
			}
		},
		check: {
			fieldType: 'checkbox',
			inputs: [
				{ label: 'Один', value: 'one' },
				{ label: 'Два', value: 'two' },
				{ label: 'Три', value: 'three' },
			],
			schema(fields, valuesArr) {
				if (Array.isArray(valuesArr)) {
					return valuesArr.length ? null : 'Нужно выбрать хотя бы один элемент'
				}
				
				return 'Возникла неизвестная ошибка'
			}
		},
		radio: {
			fieldType: 'radio',
			inputs: [
				{ label: 'Один', value: 'one' },
				{ label: 'Два', value: 'two' },
				{ label: 'Три', value: 'three' },
			],
		},
		toggle: {
			fieldType: 'toggle',
			value: 'toggle',
		},
		select: {
			fieldType: 'select',
			options: [
				{ value: 'one', label: 'Один' },
				{ value: 'two', label: 'Два' }
			],
		},
	},
	async requestFn(readyFieldValues) {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				console.log('Sent!')
				resolve({ status: 'success' })
			}, 1000)
		})
	},
	settings: {
		// checkBeforeSubmit: 'onBlur', // До первой отправки при потери фокуса
		// checkAfterSubmit: 'onChange', // После первой отправки при вводе символов
		// sendFormOnFieldBlur: true,
	},
}

export default allFieldsFormConfig


function checkTextField(fn: Function): string | null {
	try {
		return fn()
	}
	catch (err) {
		if (err instanceof Error) {
			return err.message
		}
	}
	
	return null
}















/*const formConfig: MFTypes.Config = {
	fields: {
		email: {
			fieldType: 'text',
			component: TextInput,
			fieldData: text,
			schema(fields, value) {
				return checkEmailField(value)
			}
		},
		check: {
			fieldType: 'checkbox',
			inputs: [
				{ label: 'Один', value: 'one' },
				{ label: 'Два', value: 'two' },
				{ label: 'Три', value: 'three' },
			],
			component: FieldGroup,
			fieldData: check,
		},
		radio: {
			fieldType: 'radio',
			inputs: [
				{ label: 'Один', value: 'one' },
				{ label: 'Два', value: 'two' },
				{ label: 'Три', value: 'three' },
			],
			component: FieldGroup,
			fieldData: radio
		},
		toggle: {
			fieldType: 'toggle',
			value: 'toggle',
			component: Toggle,
			fieldData: toggle
		},
		select: {
			fieldType: 'select',
			options: [
				{ value: 'one', label: 'Один' },
				{ value: 'two', label: 'Два' }
			],
			component: Select,
			fieldData: select
		},
	},
	async requestFn(readyFieldValues) {
		// Какая-то логика отправки ответа на сервер...
		// ...
		
		return { status: 'success' }
	},
	settings: {
		checkBeforeSubmit: 'onBlur', // До первой отправки при потери фокуса
		checkAfterSubmit: 'onChange', // После первой отправки при вводе символов
		sendFormOnFieldBlur: true,
	},
}*/


/*const formConfig: MFTypes.Config = {
	fields: {
		password: {
			fieldType: 'text',
			component: TextInput,
			fieldData: {},
			schema(fields, value) {
				if (value.length < 4) return 'Пароль должен длиннее трёх символов'
				else if (value.length > 100) return 'Пароль должен быть короче ста символов'
				
				return null
			}
		},
		check: {
			fieldType: 'checkbox',
			component: FieldGroup,
			fieldData: {},
			inputs: [
				{ label: 'Один', value: 'one' },
				{ label: 'Два', value: 'two' },
				{ label: 'Три', value: 'three' },
			],
			
		},
		radio: {
			fieldType: 'radio',
			component: FieldGroup,
			fieldData: {},
			inputs: [
				{ label: 'Один', value: 'one' },
				{ label: 'Два', value: 'two' },
				{ label: 'Три', value: 'three' },
			],
			
		},
		toggle: {
			fieldType: 'toggle',
			component: Toggle,
			fieldData: {},
			value: 'toggle',
			
		},
		select: {
			fieldType: 'select',
			component: Select,
			fieldData: {},
			options: [
				{ value: 'one', label: 'Один' },
				{ value: 'two', label: 'Два' }
			],
		},
	},
	async requestFn(...) {...},
	// Когда проверять форму
	settings: {...},
}*/

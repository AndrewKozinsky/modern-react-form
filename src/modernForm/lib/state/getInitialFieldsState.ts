import MFTypes from '../MFTypes'

/**
 * Функция формирующая объект с состоянием полей на основе начальной конфигурации
 * @param {Object} formConfig — объект конфигурации формы
 */
export default function getInitialFieldsState(formConfig: MFTypes.Config): MFTypes.StateFields {
	// Объект состояния полей
	const fields: MFTypes.StateFields = {}
	
	const formConfigFields = formConfig.fields
	
	// Перебор полей переданных в объекте конфигурации и на основе их строится объект состояния полей формы
	Object.keys(formConfigFields).forEach(fieldName => {
		const fieldConfig = formConfigFields[fieldName]
		
		if (fieldConfig.fieldType === 'text') {
			const fieldProps: MFTypes.StateTextField = {
				fieldType: 'text',
				value: fieldConfig.initialValue || '',
				disabled: false,
				error: null
			}
			
			fields[fieldName] = fieldProps
		}
		else if (fieldConfig.fieldType === 'checkbox') {
			const fieldProps: MFTypes.StateCheckboxesField = {
				fieldType: 'checkbox',
				inputs: getInputs(fieldConfig.inputs),
				disabled: false,
				error: null
			}
			
			fields[fieldName] = fieldProps
		}
		else if (fieldConfig.fieldType === 'radio') {
			const fieldProps: MFTypes.StateRadiosField = {
				fieldType: 'radio',
				inputs: getInputs(fieldConfig.inputs),
				disabled: false,
				error: null
			}
			
			fields[fieldName] = fieldProps
		}
		else if (fieldConfig.fieldType === 'toggle') {
			const fieldProps: MFTypes.StateToggleField = {
				fieldType: 'toggle',
				checked: !!fieldConfig.initialChecked,
				disabled: false,
				error: null
			}
			
			fields[fieldName] = fieldProps
		}
		else if (fieldConfig.fieldType === 'select') {
			const fieldProps: MFTypes.StateSelectField = {
				fieldType: 'select',
				checkedValue: getSelectValue(fieldConfig.options),
				options: fieldConfig.options,
				disabled: false,
				error: null
			}
			
			fields[fieldName] = fieldProps
		}
	})
	
	return fields
}

/**
 * Функция формирует и возвращает массив флагов или переключателей
 * @param {Array} groupInputs — массив флагов
 */
function getInputs(groupInputs: MFTypes.FieldGroupInputData[]): MFTypes.StateFieldInputItem[] {
	return groupInputs.map(configInput => {
		return {
			label: configInput.label,
			value: configInput.value,
			checked: configInput.checked || false
		}
	})
}

/**
 * Функция возвращает value выбранного пункта выпадающего списка
 * @param {Array} options — массив пунктов выпадающего списка
 */
function getSelectValue(options: MFTypes.FieldGroupInputData[]): string {
	// Если в options какой-то пункт помечен выделенным, то возвратить его value.
	for (let i = 0; i < options.length; i++) {
		if (options[i].checked) {
			return options[i].value
		}
	}
	
	// В противном случае вернуть value первого элемента
	return options[0].value
}

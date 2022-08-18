import { OptionsType } from './SelectTypes'

/**
 * Функция возвращает массив тегов <option>
 * @param {Array} options — массив пунктов выпадающего списка
 */
export function getOptions(options: OptionsType) {
	return options.map(function (option, i) {

		// Атрибуты <option>
		const optionAttrs: Record<string, any> = {
			value: option.value,
			key: i
		}

		// Если <option> заблокирован
		if (option.disabled) optionAttrs.disabled = true

		return <option {...optionAttrs}>{option.label}</option>
	})
}


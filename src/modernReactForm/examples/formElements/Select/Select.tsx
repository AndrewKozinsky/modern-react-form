import Label from '../Label/Label'
import { OptionsType } from './SelectTypes'
import { getOptions } from './Select-func'


export type SelectPropType = {
	label?: string // Подпись выше выпадающего списка
	mName: string // Имя выпадающего списка
	mValue: string // Выбранное значение выпадающего списка
	mError?: null | string // Текст ошибки
	mDisabled: boolean // Выбранное значение выпадающего списка
	mOptions: OptionsType // Массив для генерации тегов <option>
	mOnChange: any, // Обработчик изменения поля
	mOnBlur?: any // Обработчик потери фокуса полем
}

/** Компонент выпадающего списка */
function Select(props: SelectPropType) {
	const {
		label,
		mName,
		mValue,
		mError = null,
		mDisabled,
		mOptions,
		mOnChange,
		mOnBlur = () => {}
	} = props
	
	// Атрибуты поля
	const inputAttribs = {
		name: mName,
		value: mValue,
		disabled: mDisabled,
		onChange: mOnChange,
		onBlur: mOnBlur
	}
	
	return (
		<div>
			<Label label={label} />
			<select {...inputAttribs}>
				{getOptions(mOptions)}
			</select>
		</div>
	)
}

export default Select

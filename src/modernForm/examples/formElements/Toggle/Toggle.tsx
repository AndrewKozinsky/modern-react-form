import MFTypes from '../../../lib/MFTypes'

export type TogglePropType = MFTypes.ToggleCompProps & {
	label?: string // Подпись флага
	// mName: string // Имя группы флагов
	// mValue: string // Значение флага
	// mChecked?: boolean // Отмечено ли поле
	// mError?: null | string // Текст ошибки
	// mDisabled?: boolean // Заблокировано ли поле
	// mOnChange: any // Обработчик выбора пункта
	// mOnBlur?: any, // Обработчик потерей полем фокуса
}

/** Компонент тумблера для формы */
function Toggle(props: TogglePropType) {
	const {
		label,
		mName,
		mValue,
		mChecked = false,
		mDisabled = false,
		mOnChange,
		mOnBlur = () => {}
	} = props
	
	
	// Атрибуты флага
	const inputAttribs = {
		type: 'checkbox',
		name: mName,
		value: mValue,
		checked: mChecked,
		disabled: mDisabled,
		onChange: mOnChange,
		onBlur: mOnBlur
	}
	
	return (
		<div>
			<input {...inputAttribs} />
			<label>{label}</label>
		</div>
	)
}

export default Toggle


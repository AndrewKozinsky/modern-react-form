
type RadioPropType = {
	label?: string // Подпись переключателя
	name: string // Имя группы переключателей
	value: string // Значение переключателя
	checked?: boolean
	disabled?: boolean
	onChange: any // Обработчик выбора пункта
	onBlur?: any // Обработчик потери фокуса полем
}

/** Компонент переключателя для формы */
function Radio(props: RadioPropType) {
	const {
		label = '',
		name,
		value,
		checked,
		disabled = false,
		onChange,
		onBlur = () => {}
	} = props
	
	
	// Атрибуты переключателя
	const inputAttribs = {
		type: 'radio',
		name,
		value,
		checked,
		disabled,
		onChange,
		onBlur
	}
	
	return (
		<div>
			<input {...inputAttribs} />
			<label>{label}</label>
		</div>
	)
}

export default Radio

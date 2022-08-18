
export type CheckboxPropType = {
	label?: string // Подпись флага
	name: string // Имя группы флагов
	value: string // Значение флага
	checked?: boolean // Отмечено ли поле
	disabled?: boolean // Заблокировано ли поле
	onChange: any // Обработчик выбора пункта
	onBlur?: any // Обработчик потери фокуса полем
}

/** Компонент флага для формы */
function Checkbox(props: CheckboxPropType) {
	const {
		label,
		name,
		value,
		checked,
		disabled = false,
		onChange,
		onBlur,
	} = props
	
	// Атрибуты флага
	const inputAttribs = {
		type: 'checkbox',
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

export default Checkbox


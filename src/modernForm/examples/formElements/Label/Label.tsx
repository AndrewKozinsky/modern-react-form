
type LabelPropType = {
	label?: string // Текст подписи
}

/** Компонент подписи поля ввода */
function Label(props: LabelPropType) {
	const { label } = props
	
	if (!label) return null
	
	return (
		<div>
			<label>{label}</label>
		</div>
	)
}

export default Label

import Label from '../Label/Label'
import Checkbox from '../Checkbox/Checkbox'
import Radio from '../Radio/Radio'

export type FieldGroupPropType = {
	label?: string // Подпись группы переключателей или флагов
	inputType: FieldGroupInputType // Тип: флаги или переключатели
	mName: string // Имя группы переключателей или флагов
	mInputs: FieldGroupInputDataType[] // Данные по флагам или переключателям
	mError?: null | string // Текст ошибки
	mDisabled?: boolean // Заблокировано ли поле
	mOnChange: any, // Обработчик изменения поля
	mOnBlur: any, // Обработчик потерей полем фокуса
}

export type FieldGroupInputType = 'radio' | 'checkbox'

export type FieldGroupInputDataType = {
	label: string
	value: string
	checked?: boolean
}

/** Компоненты группы флагов или переключателей */
function FieldGroup(props: FieldGroupPropType) {
	const {
		label,
		inputType,
		mName,
		mInputs,
		mError = null,
		mDisabled = false,
		mOnChange,
		mOnBlur = () => {},
	} = props
	
	// Получение типа поля: переключатель или флаг
	const Component = (inputType == 'checkbox') ? Checkbox : Radio
	
	return (
		<>
			<Label label={label}/>
			<div>
				{mInputs.map((inputData, i) => {
					const attrs = {
						label: inputData.label,
						value: inputData.value,
						name: mName,
						checked: !!inputData.checked,
						disabled: mDisabled,
						onChange: mOnChange,
						onBlur: mOnBlur,
					}
					
					return <Component {...attrs} key={i} />
				})}
				{mError && <p>{mError}</p>}
			</div>
		</>
	)
}

export default FieldGroup

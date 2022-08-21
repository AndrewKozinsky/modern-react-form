import useGetModernForm from '../../lib'
import FieldGroup from '../formElements/FieldGroup/FieldGroup'
import Select from '../formElements/Select/Select'
import TextInput from '../formElements/TextInput/TextInput'
import Toggle from '../formElements/Toggle/Toggle'
import Button from '../formElements/Button/Button'
import allFieldsFormConfig from './configs/allFieldsFormConfig'
import './css/reset.css'
import './css/app.css'


export default function Forms() {
	return (
		<article className='forms'>
			<AllFieldsForm />
		</article>
	)
}


function AllFieldsForm() {
	const {
		fieldAttrs,
		onSubmit,
		formHasErrors,
		commonError,
		submitStatus
	} = useGetModernForm(allFieldsFormConfig)
	
	return (
		<>
			<h3>Форма со всеми типами полей</h3>
			<form onSubmit={onSubmit}>
				<TextInput {...fieldAttrs.text} label='text label' />
				<TextInput {...fieldAttrs.textarea} label='textarea label' inputType='textarea' rows={10} />
				<FieldGroup {...fieldAttrs.check} label='Checkboxes label' inputType='checkbox' />
				<FieldGroup {...fieldAttrs.radio} label='Radios label' inputType='radio' />
				<Toggle {...fieldAttrs.toggle} label='toggle' />
				<Select {...fieldAttrs.select} label='select label' />
				<Button type='submit' text='Отправить' disabled={formHasErrors || submitStatus === 'pending'}/>
			</form>
			{commonError && <p>{commonError}</p>}
		</>
	)
}

import './css/reset.css'
import './css/app.css'
import allFieldsFormConfig from './configs/allFieldsFormConfig'
import index from '../../lib/useGetModernForm'
import Button from '../formElements/Button/Button'

export default function Forms() {
	return (
		<article className='forms'>
			<AllFieldsForm />
		</article>
	)
}


function AllFieldsForm() {
	const {
		fieldComps,
		onSubmit,
		formHasErrors,
		commonError,
		submitStatus
	} = index(allFieldsFormConfig)
	
	return (
		<>
			<h3>Форма со всеми типами полей</h3>
			<form onSubmit={onSubmit}>
				{fieldComps.text}
				{fieldComps.textarea}
				{fieldComps.check}
				{fieldComps.radio}
				{fieldComps.toggle}
				{fieldComps.select}
				<Button type='submit' text='Отправить' disabled={formHasErrors || submitStatus === 'pending'}/>
			</form>
			{commonError && <p>{commonError}</p>}
		</>
	)
	
}

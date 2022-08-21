import React, { ReactElement } from 'react'

export type ButtonPropType = {
	type?: 'button' | 'submit' | 'reset'
	text?: string | ReactElement
	onClick?: (...args: any[]) => void
	disabled?: boolean
}

/** Компонент кнопки */
export default function Button(props: ButtonPropType) {
	
	const {
		type = 'button', // Тип кнопки. Варианты: standard (стандартная кнопка), onlyIcon (только значок)
		disabled = false,
		onClick,
	} = props
	
	const { text } = props
	
	// Атрибуты кнопки
	const btnAttrs: Record<string, any> = {
		type,
		disabled
	}
	if (onClick) btnAttrs.onClick = onClick
	
	return (
		<button {...btnAttrs}>
			{text}
		</button>
	)
}

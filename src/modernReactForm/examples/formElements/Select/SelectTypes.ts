// Массив пунктов выпадающего списка
export type OptionsType = OptionType[]

// Тип пункта выпадающего списка
export type OptionType = {
    value: string
    label: string
    disabled?: boolean
}


# ModernForm. Конструктор форм для Реакта.

ModernForm преследует несколько целей:
1. Переместить детали реализации из компонента в отдельный модуль чтобы не смешивать вид и логику работы;
2. Дать возможность настраивать поведение формы просто указывая параметры поведения.



## Объект с конфигурацией формы
В объекте конфигурации указываются настройки формы.

Объект должен соответствовать типу MFTypes.Config.

В объекте конфигурации есть три основных свойства: fields, requestFn и formSettings.

В fields указывается какие поля будут у формы, их типы, проверяющая функция и какой компонент будет отрисовывать поле.

В requestFn указывается функция запускаемая при отправке формы. Самый распространённый вариант — это отправка данных на сервер.

В formSettings указывается объект с настройками поведения формы.
```typescript
const formConfig: MFTypes.Config = {
    fields: {...},
    async requestFn(...) {...},
    formSettings: {...},
}
```

Ниже рассказаны подробности.

### Свойство fields в объекте конфигурации формы
Тут указывается объект с конфигурацией полей существующих в форме.

В ключе пишется строка по которой вы будите получать поле в компоненте Реакта (об этом ниже). И по совместительству это будет свойством name у поля.

В значении различные настройки поля. Объекты с настройками полей имеют одинаковые свойства. Давайте их рассмотрим.

В свойстве **fieldType** указывается тип поля. Всего существует 5 значений:
1. text — текстовое поле или текстовая область;
2. radio — группа переключателей (radio);
3. checkbox — группа флагов (checkbox);
4. toggle — тумблер. Фактически это одиночный флаг. Поэтому такое поле может быть или в состоянии «включено» или «выключено»;
5. select — выпадающий список

В свойстве **component** указывается компонент Реакта, с помощью которого будет отрисовываться поле.

> Заметьте, что компоненты для типов полей radio и checkbox должны уметь отрисовывать не единичные переключатели или флаги, а их группу потому что в них передаётся массив данных. Проще всего сделать один такой компонент принимающий тип полей, массив данных и отрисовывающий поля. Пример такого компонента смотрите на formElements/FieldGroup/FieldGroup.

ModernForm в каждый компонент автоматически передаёт группу свойств:

text
- mName: string
- mValue: string
- mError: null | string
- mDisabled: boolean
- mOnChange: Function
- mOnBlur: Function

radio и checkbox
- mName
- mInputs [{label: '', value: '', checked: false}]
- mError
- mDisabled
- mOnChange
- mOnBlur

select
- mName
- mValue
- mError
- mDisabled
- mOptions
- mOnChange
- mOnBlur

toggle
- mName
- mValue
- mChecked
- mError
- mDisabled
- mOnChange
- mOnBlur


```typescript
const formConfig: MFTypes.Config = {
	fields: {
		name: {
			fieldType: 'text',
			component: TextInput,
			fieldData: {},
			schema(fields, value) {
				if (value.length < 3) return 'Имя должно быть длиннее двух символов'
				else if (value.length > 20) return 'Имя не должно быть длиннее 20 символов'
				return null
			}
		},
		gender: {
			fieldType: 'radio',
			component: FieldGroup,
			fieldData: {},
			inputs: [
				{ label: 'Без ответа', value: 'without-answer' },
				{ label: 'Мужчина', value: 'man' },
				{ label: 'Женщина', value: 'woman' },
			],
		},
		country: {
			fieldType: 'select',
			component: Select,
			fieldData: {},
			options: [
				{ value: 'rus', label: 'Россия' },
				{ value: 'ukr', label: 'Украина' },
				{ value: 'bel', label: 'Беларусь' },
			],
		},
		legal: {
			fieldType: 'checkbox',
			component: FieldGroup,
			fieldData: {},
			inputs: [
				{ label: 'Принятие правил сервиса', value: 'acceptRules' },
				{ label: 'Ценовая политика', value: 'pricesPolicy' },
			],
		},
		getNews: {
			fieldType: 'toggle',
			component: Toggle,
			fieldData: {},
			value: 'toggle',
		
		},
	},
	async requestFn(...) {...},
	// Когда проверять форму
	formSettings: {...},
}
```
# ModernForm. Конструктор форм для Реакта.

ModernForm преследует несколько целей:
1. Переместить детали реализации из компонента в отдельный модуль чтобы не смешивать вид и логику;
2. Дать возможность настраивать поведение формы просто указывая параметры поведения.

Вы будите взаимодействовать с двумя сущностями: объектом конфигурации формы и хуком useGetModernForm(). В объекте вам нужно сконфигурировать форму. А через хук получить сформированные поля и другие данные для взаимодействия с формой.

Посмотрите примеры в папке examples.

## Объект конфигурации формы
В объекте конфигурации указываются настройки формы. Он должен соответствовать типу MFTypes.Config. Поэтому там должны быть три основных свойства: fields, requestFn и settings.

В fields указывается существующие у формы поля, их типы, проверяющая функция и какой компонент будет отрисовывать поле.

В requestFn функция запускаемая при отправке формы. Самый распространённый вариант — это отправка данных на сервер.

В settings объект с настройками поведения формы.

```typescript
const formConfig: MFTypes.Config = {
    fields: {...},
    async requestFn(/*...*/) {/*...*/},
    settings: {/*...*/},
}
```

Ниже рассказаны детали.

### Свойство fields в объекте конфигурации формы
Тут указывается объект с конфигурацией полей существующих в форме.

В ключе пишется строка по которой будите получать поле в компоненте Реакта (об этом в разделе «Хук useGetModernForm»). И по совместительству это будет свойством name у поля.

Объекты с настройками полей имеют некоторые одинаковые свойства. Давайте их рассмотрим.

В свойстве **fieldType** указывается тип поля. Всего существует 5 значений:
1. text — текстовое поле или текстовая область;
2. radio — группа переключателей (radio);
3. checkbox — группа флагов (checkbox);
4. toggle — тумблер. Фактически это одиночный флаг. Поэтому такое поле может быть или в состоянии «включено» или «выключено»;
5. select — выпадающий список

В свойстве **component** указывается компонент Реакта, с помощью которого будет отрисовано поле.

В необязательное свойство **fieldData** можно указать значения атрибутов, которые вы хотите передать в поле формы. Например, подпись.

В необязательное свойство **schema** можно передать функцию проверяющая значение поля. В неё передаётся объект значений всех полей и вторым аргументом значение описываемого поля. В случае наличия ошибки поле должно вернуть текст ошибки. Если же ошибок нет, то null.

Поля типа radio и checkbox должны иметь свойство inputs, где указан массив переключателей и флагов. Они описываются через объекты со свойствами label (подпись поля) и value (значение поля). Аналогичный массив нужно передать полям типа select. Только там он заносится в свойство options.

В поле типа toggle передайте свойство value со значением флага.

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
				{ value: 'without-answer', label: 'Без ответа' },
				{ value: 'man', label: 'Мужчина' },
				{ value: 'woman', label: 'Женщина' },
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
	async requestFn(/*...*/) {/*...*/},
	settings: {/*...*/},
}
```

### Тип данных передаваемый в fieldData

Напомню, что в fieldData можно передать объект со свойствами, которые должны быть переданы в компонент.

Если этот объект просто передать в fieldData, то TypeScript не будет подсказывать вам правильные свойства. Поэтому я советую создать этот объект отдельно и задать ему тип соответствующий типу принимаемых компонентов свойство. Например для текстового компонента он может называться TextInputPropType.

Но дело в том, что ModernForm автоматические передаёт в компонент свои собственные свойства. Поэтому желательно уточнить тип передаваемых в компонент свойств через MFTypes.TextFieldData который в треугольных скобках принимает исходный тип свойств компонента.  

```typescript
const nameFieldProps: MFTypes.TextFieldData<TextInputPropType> = {
	label: 'text label',
	inputType: 'text'
}

const formConfig: MFTypes.Config = {
	fields: {
		name: {
			fieldType: 'text',
			component: TextInput,
			fieldData: nameFieldProps,
		},
	},
	async requestFn(/*...*/) {/*...*/}
}
```

Все варианты уточняющих типов объектов передаваемых в fieldData:

Текстовое поле: ``MFTypes.TextFieldData<TextInputPropType>``

Флаги: ``MFTypes.CheckFieldData<FieldGroupPropType>``

Переключатели: ``MFTypes.RadioFieldData<FieldGroupPropType>``

Тумлер: ``MFTypes.ToggleFieldData<TogglePropType>``

Выпадающий список: ``MFTypes.SelectFieldData<SelectPropType>``

### Функция проверяющая значение поля

В примере выше показан пример такой функции:

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
		}
	},
	async requestFn(/*...*/) {/*...*/},
	settings: {/*...*/},
}
```
Это не самый лучший вариант потому что существуют специальные библиотеки проверяющие переданное значение более удобным способом. Например, Yup.

Ниже показан пример как можно можно использовать Yup для более простой и качественной проверки значения полей формы.

```typescript
const allFieldsFormConfig: MFTypes.Config = {
	fields: {
		text: {
			fieldType: 'text',
			component: TextInput,
			fieldData: text,
			schema(fields, value) {
				return checkTextField(() => {
					yup.string()
						.required('Обязательное поле')
						.email('Нужно написать почту')
						.max(8, 'Максимум можно использовать 8 символов')
						.validateSync(value)
				})
			}
		},
	},
	async requestFn(/*...*/) {/*...*/},
	settings: {/*...*/},
}

function checkTextField(fn: Function): string | null {
	try {
		return fn()
	}
	catch (err) {
		if (err instanceof Error) {
			return err.message
		}
	}
	
	return null
}
```

Yup больше подходит для проверки строк на соответствие каким-либо критериям. То есть им лучше проверять значения текстовых полей. В случае флагов, переключателей, выпадающих список и тумблера это всё не требуется потому что там передаётся value переданного значения (в случае флагов массив значений). И всё, что вы сможете проверить, что проставлено ли значение или нет.

### Свойство requestFn в объекте конфигурации формы
Тут указывается функция запускаемая при отправке формы. requestFn получает объект со значениями всех полей

Метод должен вернуть объект ``{ status: 'success' }`` если запрос прошёл удачно или объект ``{ status: 'fail' }`` если не удачно. Дополнительно туда можно поставить свойство ``commonError`` с текстом ошибки не привязанной к конкретному полю. Например «На сервере произошла неизвестная ошибка» или «Неправильная почта или пароль». Если ошибки привязаны к полям, то их нужно указать в свойстве ``fieldsErrors``. Он принимает массив объектов типа ``{ name: string, message: string }``. В name указывается название поля, а в ``message`` текст ошибки.

Значение свойства commonError можно получить в компоненте и как-то показать. А ошибки привязанные к полям передаются в сам компонент поля формы. 

Ниже показан пример функции эмулирующий запрос к серверу и через секунду получающий успешный ответ.

```typescript
const formConfig: MFTypes.Config = {
    fields: {/*...*/},
    
    async requestFn(readyFieldValues) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({ status: 'success' })
            }, 1000)
        })
    },
    
    settings: {/*...*/},
}
```

### Свойство settings в объекте конфигурации формы
Это необязательный параметр в который вы можете передать объект регулирующий поведение формы.

В **checkBeforeSubmit** указывается при каком событии форма должна проверять правильность полей до отправки формы: never (не проверять), onChange (при изменении значения поля), onBlur (при потерей поля фокуса).

В **checkAfterSubmit** указывается при каком событии форма должна проверять правильность полей после отправки формы: onChange (при изменении значения поля), onBlur (при потерей поля фокуса). Тут имеется в виду если пользователь попытался отправить форму, она проверилась, были найдены ошибки, и этот параметр регулирует при каком событии нужно эти ошибки проверять.

В **disableFields** указывается настройка блокировки полей: never (не блокировать), whileSubmit (при отправке формы и разблокировать после), whileAndAfterSubmit (при отправке формы и после получения ответа от сервера), afterSubmit (после получения ответа от сервера). Если в полях есть ошибки, то поля блокироваться не будут.

В **clearFieldsAfterSubmit** указывается булево значение нужно ли очищать поля после удачной отправки формы.

В **sendFormOnFieldBlur** и **sendFormOnFieldChange** указывается булево значение регулирующее нужно ли автоматически отправлять форму при потере поля фокуса или при её изменении. Это полезно когда форма состоит только из группы флагов или переключателей и при изменении вы хотете сразу отправлять данные на сервер без необходимости жать кнопку отправки.

Объект ниже показывает значения по умолчанию:

```typescript
const formConfig: MFTypes.Config = {
    fields: {/*...*/},
    async requestFn(/*...*/) {/*...*/},
    
    settings: {
		checkBeforeSubmit: 'never',
		checkAfterSubmit: 'onChange',
		disableFields: 'never',
		clearFieldsAfterSubmit: false,
		sendFormOnFieldBlur: false,
		sendFormOnFieldChange: false,
    },
}
```

## Хук useGetModernForm()

В функции компонента, где будет форма, нужно вызвать хук useGetModernForm() в который передать объект конфигурации формы. Он возвратит объект со следующими свойствами:

В **fieldComps** будет объект со всеми полями формы.

В **onSubmit** будет функция-обработчик отправки формы. Поставьте в свойство onSubmit элемента ``<form>``.

В **formHasErrors** будет булево значение имеет ли форма ошибки в настоящий момент.

В **commonError** будет текст общей ошибки формы или null.

В **submitStatus** будет статус отправки формы: ``waiting`` — форма ещё не отправлялась, ``pending`` — форма отправилась, но ответ ещё не получен, ``error`` — после отправки формы пришёл ошибочный ответ и ``success`` после отправки формы пришёл успешный ответ.

Использую эти значения можно, например в случае ошибки дать форме красный фон, а в случае удачной отправки показать сообщение и скрыть форму. Или в кнопке отправки в атрибут disabled передать, что кнопка должна быть заблокированной если форма или имеет ошибки или успешно отправлена.

```jsx
function AllFieldsForm() {
	const {
		fieldComps,
		onSubmit,
		formHasErrors,
		commonError,
		submitStatus
	} = useGetModernForm(allFieldsFormConfig)
	
	return (
		<>
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
```

## Компоненты-поля формы

ModernForm в каждый компонент автоматически передаёт несколько свойств. Поэтому вы должны 1 раз настроить компоненты чтобы они умели взаимодействовать с ModernForm. 

**text**
- mName: string
- mValue: string
- mError: null | string
- mDisabled: boolean
- mOnChange: Function
- mOnBlur: Function

**radio и checkbox**
- mName
- mInputs: [{label: '', value: '', checked: false}]
- mError
- mDisabled
- mOnChange
- mOnBlur

**select**
- mName
- mValue
- mError
- mDisabled
- mOptions: [{label: '', value: ''}]
- mOnChange
- mOnBlur

**toggle**
- mName
- mValue
- mChecked
- mError
- mDisabled
- mOnChange
- mOnBlur

В ``mName`` имя поля. То, что должно быть в атрибуте name.

В ``mError`` текст ошибки.

В ``mDisabled`` булево значение заблокировано ли поле.

В ``mOnChange`` и ``mOnBlur`` обработчик изменения значения поля и потерей фокуса.

В поле типа text передаётся атрибут ``mValue`` со значением поля.

В поле типа radio и checkbox передаётся атрибут ``mInputs`` с массивом переключателей или флагов.

В поле типа select передаётся атрибут ``mOptions`` с массивом пунктов выпадающего списка. А выбранное значение в атрибуте ``mValue``.

В поле типа toggle через ``mValue`` передаётся значение поля и через ``mChecked`` выбрано ли поле.

Все эти данные вам нужно поставить в свои компоненты полей формы. А ModernForm будет обновлять их значение.

> Заметьте, что компоненты для типов полей radio и checkbox должны уметь отрисовывать не единичные переключатели или флаги, а их группу потому что в них передаётся массив данных. Проще всего сделать один такой компонент принимающий тип полей, массив данных и отрисовывающий поля. Пример такого компонента смотрите на formElements/FieldGroup/FieldGroup.

Чтобы лучше понять как это сделать советую посмотреть примеры в папке examples.
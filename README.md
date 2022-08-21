# ModernForm. Конструктор форм для Реакта.

ModernForm преследует несколько целей:
1. Переместить детали реализации из компонента в отдельный модуль чтобы не смешивать вид и логику;
2. Дать возможность настраивать поведение формы просто указывая параметры поведения.

Вы будите взаимодействовать с двумя сущностями: объектом конфигурации формы и хуком useGetModernForm(). В объекте вам нужно сконфигурировать форму. А через хук получить данные для взаимодействия с формой.

Смотрите примеры использования в папке examples.

## Объект конфигурации формы
В объекте конфигурации указываются настройки формы. Он должен соответствовать типу MFTypes.Config. Поэтому там должны быть два основных свойства: fields, requestFn и необязательное settings.

В fields указывается существующие у формы поля, их типы, проверяющая функция и другие данные.

В requestFn асинхронная функция запускаемая при отправке формы. Самый распространённый вариант — это отправка данных на сервер.

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

В ключе пишется строка, которая будет являться именем поля. Другими словами значение атрибута name. По этому ключу далее вы будите получать объект со свойствами, которые нужно передать в компонент поля формы. В этом объекте будет имя поля, значение, обработчики изменения и потери фокуса и прочие данные (об этом рассказано подробнее в разделе «Хук useGetModernForm»).

Рассмотрим свойства в объектах настройки полей.

В свойстве **fieldType** указывается тип поля. Всего существует 5 значений:
1. text — текстовое поле или текстовая область;
2. radio — группа переключателей (radio);
3. checkbox — группа флагов (checkbox);
4. toggle — тумблер. Фактически это одиночный флаг. Поэтому такое поле может быть или в состоянии «включено» или «выключено»;
5. select — выпадающий список

В необязательное свойство **schema** можно передать функцию проверяющая значение поля. В неё передаётся объект значений всех полей и вторым аргументом значение описываемого поля. В случае наличия ошибки функция должна вернуть текст ошибки. Если же ошибок нет, то null.

Поля типа radio и checkbox должны иметь свойство inputs, где указан массив переключателей и флагов. Они описываются через объекты со свойствами label (подпись поля) и value (значение поля). Аналогичный массив нужно передать полям типа select. Только там он заносится в свойство options.

В поле типа toggle передайте свойство value со значением флага.

В примере ниже дан пример формы со всеми типами полей и всеми свойствами. Только schema есть у одного поля, но можно поставить на любые другие.

```typescript
const formConfig: MFTypes.Config = {
	fields: {
		name: {
			fieldType: 'text',
			schema(fields, value) {
				if (value.length < 3) return 'Имя должно быть длиннее двух символов'
				else if (value.length > 20) return 'Имя не должно быть длиннее 20 символов'
				return null
			}
		},
		gender: {
			fieldType: 'radio',
			inputs: [
				{ value: 'without-answer', label: 'Без ответа' },
				{ value: 'man', label: 'Мужчина' },
				{ value: 'woman', label: 'Женщина' },
			],
		},
		country: {
			fieldType: 'select',
			options: [
				{ value: 'rus', label: 'Россия' },
				{ value: 'ukr', label: 'Украина' },
				{ value: 'bel', label: 'Беларусь' },
			],
		},
		legal: {
			fieldType: 'checkbox',
			inputs: [
				{ label: 'Принятие правил сервиса', value: 'acceptRules' },
				{ label: 'Ценовая политика', value: 'pricesPolicy' },
			],
		},
		getNews: {
			fieldType: 'toggle',
			value: 'toggle',
		},
	},
	async requestFn(/*...*/) {/*...*/},
	settings: {/*...*/},
}
```


### Функция проверяющая значение поля

В примере выше показан пример такой функции:

```typescript
const formConfig: MFTypes.Config = {
	fields: {
		name: {
			fieldType: 'text',
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

Ниже показан пример как можно использовать Yup для более простой и качественной проверки значения полей формы.

```typescript
const allFieldsFormConfig: MFTypes.Config = {
	fields: {
		text: {
			fieldType: 'text',
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

Yup больше подходит для проверки строк на соответствие каким-либо критериям. То есть им лучше проверять значения текстовых полей. В случае флагов, переключателей, выпадающих списков и тумблера это всё не требуется потому что там передаётся value выделенного значения (в случае флагов массив выделенных значений). И всё, что вы сможете проверить это проставлено ли значение или нет.

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

В **disableFields** указывается настройка блокировки полей: never (не блокировать), whileSubmit (при отправке формы и разблокировать после получения ответа), whileAndAfterSubmit (при отправке формы и после получения ответа от сервера), afterSubmit (после получения ответа от сервера). Если в полях есть ошибки, то поля блокироваться не будут.

В **clearFieldsAfterSubmit** указывается булево значение нужно ли очищать поля после удачной отправки формы.

В **sendFormOnFieldBlur** и **sendFormOnFieldChange** указывается булево значение регулирующее нужно ли автоматически отправлять форму при потере поля фокуса или при её изменении. Это полезно когда форма состоит только из группы флагов или переключателей и при изменении вы хотите сразу отправлять данные на сервер без необходимости жать кнопку отправки.

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

В **fieldAttrs** объект с атрибутами, которые нужно передать в поля формы. В следующем разделе дан список передаваемых атрибутов.

В **onSubmit** функция-обработчик отправки формы. Поставьте в свойство onSubmit элемента ``<form>``.

В **formHasErrors** булево значение имеет ли форма ошибки в настоящий момент.

В **commonError** текст общей ошибки формы или null.

В **submitStatus** статус отправки формы: ``waiting`` — форма ещё не отправлялась, ``pending`` — форма отправилась, но ответ ещё не получен, ``error`` — после отправки формы пришёл ошибочный ответ и ``success`` после отправки формы пришёл успешный ответ.

Использую эти значения можно, например в случае ошибки дать форме красную рамку, а в случае удачной отправки показать сообщение и скрыть форму. Или в кнопке отправки в атрибут disabled передать, что кнопка должна быть заблокированной если форма или имеет ошибки или успешно отправлена.

```jsx
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
            <form onSubmit={onSubmit}>
	            <TextInput {...fieldAttrs.name} label='Name' />
	            <FieldGroup {...fieldAttrs.gender} label='Gender' inputType='radio' />
	            <country {...fieldAttrs.select} label='Country' />
	            <FieldGroup {...fieldAttrs.legal} inputType='checkbox' />
	            <Toggle {...fieldAttrs.getNews} />
	            <Button type='submit' text='Send' disabled={formHasErrors || submitStatus === 'pending'}/>
	        </form>
	        {commonError && <p>{commonError}</p>}
	    </>
	)
}
```

## Компоненты-поля формы

Как было сказано хук useGetModernForm() возвращает объект со свойством fieldAttrs. В его ключах имена полей. А в значении каждого ключа объект с атрибутами, которые нужно передать в компонент через механизм деструктуризации (``{...props}``). Эти свойства отличаются в зависимости от типа поля.

**text**
- mName: string
- mValue: string
- mError: null | string
- mDisabled: boolean
- mOnChange: Function
- mOnBlur: Function

**radio и checkbox**
- mName: string
- mInputs: [{label: '', value: '', checked: false}]
- mError: null | string
- mDisabled: boolean
- mOnChange: Function
- mOnBlur: Function

**select**
- mName: string
- mValue: string
- mError: null | string
- mDisabled: boolean
- mOptions: [{label: '', value: ''}]
- mOnChange: Function
- mOnBlur: Function

**toggle**
- mName: string
- mValue: string
- mChecked: boolean
- mError: null | string
- mDisabled: boolean
- mOnChange: Function
- mOnBlur: Function

В ``mName`` имя поля. То, что должно быть в атрибуте name.

В ``mError`` текст ошибки.

В ``mDisabled`` булево значение заблокировано ли поле.

В ``mOnChange`` и ``mOnBlur`` обработчик изменения значения поля и потерей фокуса.

В поле типа text передаётся атрибут ``mValue`` со значением поля.

В поле типа radio и checkbox передаётся атрибут ``mInputs`` с массивом переключателей или флагов.

В поле типа select передаётся атрибут ``mOptions`` с массивом пунктов выпадающего списка. А выбранное значение в атрибуте ``mValue``.

В поле типа toggle через ``mValue`` передаётся значение поля и через ``mChecked`` выбрано ли поле.

Все эти данные вам нужно поставить в свои компоненты полей формы. Это делается 1 раз. И ModernForm будет обновлять их значение.

> Заметьте, что компоненты для типов полей radio и checkbox должны уметь отрисовывать не единичные переключатели или флаги, а их группу потому что в них передаётся массив данных. Проще всего сделать один такой компонент принимающий тип полей, массив данных и отрисовывающий поля. Пример такого компонента смотрите на formElements/FieldGroup/FieldGroup.

Чтобы лучше понять как это сделать советую посмотреть примеры в папке examples.

Скорее всего у вас затипизирован объект props передаваемый в компонент. Там могут быть как ваши свойства (например label, inputType и др.), так и свойства, которые вы обязаны передать для правильной работы полей формы (они начинаются на ``m...``).

```typescript jsx
export type TextInputPropType = {
	label?: string 
	inputType?: 'text' | 'textarea'
	fieldType?: 'text' | 'email' | 'password'
	rows?: number
	mName: string
	mValue: string
	mError?: null | string
	mDisabled?: boolean
	mOnChange: Function
	mOnBlur?: Function
}

function TextInput(props: TextInputPropType) {/*...*/}
```

Чтобы не типизировать эти передаваемые свойства можно наследоваться от типа MFTypes.TextCompProps. Это самый правильный вариант.

```typescript jsx
export type TextInputPropType = MFTypes.TextCompProps & {
	label?: string
	inputType?: 'text' | 'textarea'
	fieldType?: 'text' | 'email' | 'password'
	rows?: number
}

function TextInput(props: TextInputPropType) {/*...*/}
```
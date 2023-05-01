import { Form, useActionData, useNavigation } from '@remix-run/react'
import React, { useEffect, useState } from 'react'
import FormField from '~/components/FormField';
import type { ActionArgs } from "@remix-run/node"; // or cloudflare/deno
import GenericButton from '~/components/GenericButton';
import { ActionFunction, LoaderFunction, json } from '@remix-run/node'
import { validateAllFormFields } from '~/utils/validateForms';
import { createQuestion } from '~/utils/insertQuestionData.server';
import DropDown from '~/components/DropDown';
import { questionData } from '~/utils/types.server';
 

export const action: ActionFunction = async ({ request }) => {

  const form = await request.formData()
  
  
  console.log([...form]);

  let questionCardData = [...form].filter(elm => elm[0] === 'title' || elm[0] === 'description' );
  let formattedCard: any = []
  questionCardData.map((elm, index) => formattedCard.push({type: elm[0], order: index , content: elm[1] + ''}))

  let questionContentData = [...form].filter(elm => elm[0] !== 'title' && elm[0] !== 'description' );
  let formattedContent: any  = []
  questionContentData.map((elm, index) => formattedContent.push({type: elm[0], order: index , content: elm[1] + ''}))

  //console.log(formattedCard);
  //console.log(formattedContent);

  //console.log(questionCardData);

  //console.log(questionContentData);

  await createQuestion(formattedCard, formattedContent);

  return  null ;
}

const baseBtnStyles = 'rounded-xl py-2 px-2 w-full text-white max-w-[200px] transition	 hover:bg-white hover:text-black';

const defaultFormFields = [
  {
    field: 'title',
    label: "title",
    value: '',
    error: ''
  },
  {
    field: 'description',
    label: "description",
    value: '',
    error: ''
  },
]

const actionButtons =  [
    {param: 'Code', color: 'bg-customOrange'},
    {param: 'Text', color: 'bg-sky-500'},
    {param: 'Link', color: 'bg-customRed'},
]

const QuestionForm = () => {

  const formErrors = useActionData<typeof action>();
  const navigation = useNavigation();

  const isSubmitting = navigation.state === "submitting";

  const [formValues, setFormValues] = useState(({
      title: '',
      description: ''
  }) );

  const [formFields, setFormFields] = useState(defaultFormFields);
  const [serverFormErrors, setServerFormErrors] = useState('');
  const [redirectError, setRedirectError] = useState('');
  const [allFieldsValid, setAllFieldsValid] = useState(false);


  const addFormField = async (field: string) => {

      field = field.toLowerCase();

      let countExistingFields = Object.keys(formValues).filter(elm => elm.includes( field)).length;

      let fieldNumber = countExistingFields > 0 ? countExistingFields + 1: 1;

      setFormValues({...formValues, [field + ' ' +  fieldNumber]: ''});

      setFormFields([...formFields,  
          {
            field: field + ' ' +   fieldNumber,
            label:  field + ' ' +  fieldNumber,
            value: '',
            error: ''
          },
      ]) 

  }


  const deleteFormField = (field: string) => {

    let filteredArray = formFields.filter(elm => elm.field !== field);

    interface formValuesProps {
      [key: string]: string
    }

    let copyFormValues: formValuesProps = formValues;
    delete copyFormValues[field as keyof typeof copyFormValues ];

    setFormFields(filteredArray);

  }


  useEffect(() => {
    if(formErrors){
        setServerFormErrors((formErrors.error))
    }
  }, [formErrors])


  useEffect(() => {
      setAllFieldsValid(validateAllFormFields(formFields))
  }, [formValues])
  

  return (

    <div className="wrapper w-full flex flex-col items-center py-5 rounded-xl">
        <h1 className='font-bold text-3xl text-center'>Ask a Question</h1>
        <Form method='POST' className='my-[20px] w-[200px]  md:w-[500px] bg-customBlack px-8 py-7 rounded-lg'>

            {
              formFields.map((field, i )=> (

                <FormField 
                    key = {i}
                    formType = {'login'}
                    htmlFor =   {field.field}
                    label   =   {field.label}
                    formFields = {formFields}
                    value =     {field.value}
                    setFormValues = {setFormValues}
                    multiline = {field.label !== 'title'}
                    dynamicForm
                    deletable = {field.label !== 'title' &&  field.label !== 'description'}
                    deleteFormField = {deleteFormField}
                />
                
              ))
            }

            <div className="wrapper flex my-4 gap-x-3">

                {
                  actionButtons.map(btn => (
                    <button 
                        onClick={(e) =>{  e.preventDefault(); addFormField(btn.param)}}
                        className= {btn.color + ' ' +  baseBtnStyles}
                      > 
                        Add {btn.param}
                   </button>
                  ))
                }
               
            </div>


            <div className="flex flex-col items-center my-5">
                <DropDown name="priority" options={['Low','Medium', 'Urgent']}  defaultValue={'Ascending'}   label={'Priority'} width={'200px'} />
            </div>

            {
              !allFieldsValid && <small className='text-center text-customOrange text-xs mb-3 block'>  No fields can be blank. </small>
            }

            <div className="w-full text-center ">
                <GenericButton
                    formButton = {true}
                    buttonType='skyBlue'
                    text="Submit"
                    className={(isSubmitting || !allFieldsValid )? `mt-4 pointer-events-none opacity-20`: 'mt-4' }
                />
            </div>

           
        </Form>
    </div>
    
               
  )
}

export default QuestionForm;
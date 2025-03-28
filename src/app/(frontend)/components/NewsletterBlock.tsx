'use client'
import { Page, Form } from '@/payload-types'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { useState } from 'react'

type NewsletterProps = Extract<Page['layout'][0], { blockType: 'newsletter-form' }>

type FormState = {
  loading: boolean
  error: string | null
  success: boolean
}

type InputFormField = Extract<
  NonNullable<Form['fields']>[number],
  {
    blockType:
      | 'text'
      | 'email'
      | 'textarea'
      | 'number'
      | 'checkbox'
      | 'select'
      | 'country'
      | 'state'
    name: string
    label?: string | null
    required?: boolean | null
  }
>

export default function NewsletterBlock({ block }: { block: NewsletterProps }) {
  const [formState, setFormState] = useState<FormState>({
    loading: false,
    error: null,
    success: false,
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!block.form || typeof block.form !== 'object') return

    setFormState({
      loading: true,
      error: null,
      success: false,
    })

    const formData = new FormData(e.target as HTMLFormElement)
    const data = Object.fromEntries(formData.entries())
    console.log(data)

    try {
      const response = await fetch('/api/form-submissions', {
        method: 'POST',
        body: JSON.stringify({
          form: block.form.id,
          submissionData: Object.entries(data)?.map(([field, value]) => ({
            field,
            value: value as string,
          })),
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to submit form')
      }
      setFormState({
        loading: false,
        error: null,
        success: true,
      });

      (e.target as HTMLFormElement).reset()

      setTimeout(() => {
        setFormState({
          loading: false,
          error: null,
          success: false,
        })
      }, 5000)
    } catch (error) {
      console.error(error)
      setFormState({
        loading: false,
        error: 'Failed to submit form',
        success: false,
      })
    }
  }
  if(!block) return
  return (
    <div>
      {typeof block?.form === 'object' && block?.form?.title === 'newsletter' && (
        <div
        className='flex flex-col items-center w-full pb-5'
          
        >
          <h2>{block.heading}</h2>
          <form
            className="form"
            onSubmit={handleSubmit}
            style={{ width: '100%', maxWidth: '400px' }}
          >
            {block.form.fields?.map((field) => {
              const inputField = field as InputFormField
              
              return (
                <div
                  key={inputField.name}
                  style={{
                    marginBottom: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '5px',
                    maxWidth: '100%',
                  }}
                >
                  <label htmlFor={inputField.name}>{inputField.label}</label>
                  <input
                    type={inputField.blockType === 'email' ? 'email' : 'text'}
                    name={inputField.name}
                    required={inputField.required || false}
                    placeholder={inputField.label || ''}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '5px',
                      border: '1px solid #ccc',
                    }}
                  />
                </div>
              )
            })}
            {formState.error && <p style={{ color: 'red' }}>{formState.error}</p>}
            {formState.success ? (
              <div style={{ color: 'green' }}>
                <RichText data={block.form.confirmationMessage!} />
              </div>
            ) : (
              <button type="submit">{block.form.submitButtonLabel || 'Submit'}</button>
            )}
          </form>
        </div>
      )}
    </div>
  )
}

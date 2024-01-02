import { randomUUID } from 'crypto'
import { z } from 'zod'
import { sanitize } from 'isomorphic-dompurify'
 
// Here we define the schema of data we expect to receive
// for input validation. Notice the age must be a number
const schema = z.object({
  name: z.string({
    invalid_type_error: 'Invalid name',
  }),
  age: z.number({
    invalid_type_error: "Invalid age"  
  }),
})

// Here we define the component we would like to show on screen
export default async function Form() {

  // We generate a random UUID to be used as a CSRF token. In reality
  // this would be associated with the user's session.
  const csrfToken = randomUUID()

  // In this server action we take in the form
  // data, validate it, and pretend to store it.
  async function sendName(formData: FormData) {
    'use server'

    // Initially we take the CSRF token and make sure it matches the
    // one we initially generated for the form.
    if(formData.get('_csrf') != csrfToken) {
      console.log("Invalid CSRF token, panic!")
      return
    }

    // Next we validate the input data to ensure it's of the right format
    const validatedFormData = schema.safeParse({
      name: formData.get('name'),
      age: z.coerce.number().parse(formData.get('age'))
    })
    if (!validatedFormData.success) {
      console.log("Invalid fields, panic!")
      console.log(validatedFormData.error.flatten().fieldErrors)
      return
    }
 
    // Then we sanitize (on the server, but this should be on the client). We
    // don't throw an error here, we just remove the dangerous parts.
    const sanitizedFormData = {
      name: sanitize(validatedFormData.data.name),
      age: validatedFormData.data.age
    }

    // Pretend to store validatedFormData.data...
    console.log('Storing data')
    console.log(sanitizedFormData)
  }
 
  return (
    // This renders the form. Notice, this is a server side component (as is
    // default in Next 13).
    <form action={sendName}>
      <input type="hidden" name="_csrf" value={csrfToken} />
      <input type="text" name="name"/>
      <br/>
      <input type="number" name="age" />
      <br/>
      <button type="submit">Send name and age!</button>
    </form>
  )
}
import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const systemPrompt = `
You are a flashcard creator, you take in text and create multiple flashcards from it. Make sure to create exactly 10 flashcards.
Both front and back should be one sentence long.
You should return in the following JSON format:
{
  "flashcards":[
    {
      "front": "Front of the card",
      "back": "Back of the card"
    }
  ]
}
`


// 1. It creates a chat completion request to the OpenAI API.
// 2. The `messages` array includes two elements:
// — A ‘system’ message with our predefined `systemPrompt`, which instructs the AI on how to create flashcards.
// — A ‘user’ message containing the input text from the request body.
// 3. We specify ‘gpt-4o’ as the model to use.
// 4. We set the `response_format` to ‘json_object’ to ensure we receive a JSON response.

// Final Part
// 1. We parse the JSON content from the API response using `JSON.parse()`. The response is expected to be in the format specified in our system prompt, with a `flashcards` array containing objects with `front` and `back` properties.
// 2. We return the `flashcards` array from the parsed JSON using `NextResponse.json()`. This sends the flashcards back to the client as a JSON response.
export async function POST(req) {
  const openai = new OpenAI()
  const data = await req.text()

  const completion = await openai.chat.completions.create({
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: data },
    ],
    model: 'gpt-4o',
    response_format: { type: 'json_object' },
  })

  // Parse the JSON response from the OpenAI API
  const flashcards = JSON.parse(completion.choices[0].message.content)

  // Return the flashcards as a JSON response
  return NextResponse.json(flashcards.flashcards)
}
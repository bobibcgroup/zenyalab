import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json()

    // Get OpenAI API key from environment variables
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    // Prepare the prompt for ChatGPT
    const userName = formData[1] || 'there'
    const userAge = formData[3] || 'unknown'
    
    const prompt = `You are a world-renowned biohacking and longevity expert. Analyze the following personalized lifestyle data and provide a concise, personalized assessment.

Personal Profile:
- Name: ${formData[1] || 'Not provided'}
- Gender: ${formData[2] || 'Not provided'}
- Chronological Age: ${formData[3] || 'Not provided'}

Sleep Quality:
- Average hours of sleep per night: ${formData[4] || 'Not provided'}
- Wakes up feeling rested: ${formData[5] || 'Not provided'}

Nutrition & Intake:
- Meals per day: ${formData[6] || 'Not provided'}
- Days per week consuming sweets: ${formData[7] || 'Not provided'}
- Days per week fasting: ${formData[8] || 'Not provided'}

Activity & Movement:
- Overall activity level: ${formData[9] || 'Not provided'}
- Cardio sessions per week: ${formData[10] || 'Not provided'}

Provide a personalized assessment in this EXACT format (use these exact section headers):

Biological Age: [Number only, e.g., 43]

BRIEF:
[2-3 sentences personalized to ${userName}, summarizing their current biohacking status and biological age meaning]

GOOD THINGS:
[Bullet points of what ${userName} is doing well - be specific based on their data]

BAD THINGS:
[Bullet points of areas needing improvement - be specific based on their data]

STEPS RECOMMENDED:
[Numbered list of 3-5 specific, actionable biohacking recommendations tailored to their data]

Important formatting rules:
- Use "Biological Age:", "BRIEF:", "GOOD THINGS:", "BAD THINGS:", "STEPS RECOMMENDED:" as exact headers (all caps for section headers)
- Do NOT use markdown bold (**) or asterisks
- Use bullet points (-) for GOOD THINGS and BAD THINGS
- Use numbered list (1., 2., 3.) for STEPS RECOMMENDED
- Keep each section concise
- Personalize to ${userName} throughout
- Total response should be under 250 words`

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a world-renowned biohacking expert with deep expertise in longevity optimization, biological age assessment, and evidence-based lifestyle interventions. You provide personalized, concise assessments that help people optimize their healthspan.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 800,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('OpenAI API error:', error)
      return NextResponse.json(
        { error: 'Failed to generate analysis' },
        { status: 500 }
      )
    }

    const data = await response.json()
    const analysis = data.choices[0]?.message?.content || 'Unable to generate analysis.'

    // Map question IDs to readable field names for n8n
    const questionMap: Record<number, string> = {
      1: 'name',
      2: 'gender',
      3: 'age',
      4: 'sleepHours',
      5: 'wakesUpRested',
      6: 'mealsPerDay',
      7: 'sweetsPerWeek',
      8: 'fastingDaysPerWeek',
      9: 'activityLevel',
      10: 'cardioSessionsPerWeek',
      11: 'email',
    }

    // Structure form data with readable field names
    const structuredFormData: Record<string, any> = {}
    Object.keys(formData).forEach((key) => {
      const questionId = parseInt(key)
      const fieldName = questionMap[questionId] || `question_${key}`
      structuredFormData[fieldName] = formData[key]
    })

    // Send form data and analysis to n8n webhook (non-blocking)
    const n8nWebhookUrl = 'https://primary-production-eb3d.up.railway.app/webhook/zenyalab'
    
    // Fire and forget - don't wait for webhook response
    fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        formData: structuredFormData,
        rawFormData: formData, // Keep raw data as backup
        analysis: analysis,
        timestamp: new Date().toISOString(),
      }),
    }).catch((error) => {
      // Log error but don't block the response
      console.error('Failed to send data to n8n webhook:', error)
    })

    return NextResponse.json({ analysis })
  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


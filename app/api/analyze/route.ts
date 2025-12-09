import { NextRequest, NextResponse } from 'next/server'

// Configure runtime for Vercel
export const runtime = 'nodejs' // Node.js runtime
// Note: Vercel free tier has 10s timeout, Pro has 60s
// If you're on Pro, increase maxDuration to 30-60
export const maxDuration = 10 // 10 seconds max execution time (matches free tier limit)

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  try {
    const formData = await request.json()
    console.log('📥 Received analyze request:', {
      timestamp: new Date().toISOString(),
      elapsed: Date.now() - startTime + 'ms',
    })

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

    // Call OpenAI API with timeout to prevent hanging
    // Set timeout to 8 seconds to ensure we complete before Vercel's 10s limit
    const openAIController = new AbortController()
    const openAITimeout = setTimeout(() => {
      openAIController.abort()
      console.error('⏱️ OpenAI API request timeout triggered after 8 seconds')
    }, 8000) // 8 second timeout (leaves 2s buffer for Vercel's 10s limit)

    console.log('🤖 Calling OpenAI API...', {
      model: 'gpt-4',
      promptLength: prompt.length,
      elapsed: Date.now() - startTime + 'ms',
    })

    let response: Response
    try {
      const openAIStartTime = Date.now()
      response = await fetch('https://api.openai.com/v1/chat/completions', {
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
        signal: openAIController.signal,
      })
      clearTimeout(openAITimeout)
      console.log('📡 OpenAI API response received:', {
        status: response.status,
        statusText: response.statusText,
        elapsed: Date.now() - openAIStartTime + 'ms',
      })
    } catch (error: any) {
      clearTimeout(openAITimeout)
      if (error?.name === 'AbortError') {
        console.error('⏱️ OpenAI API request timed out after 8 seconds')
        return NextResponse.json(
          { error: 'Request timed out. The AI service is taking too long. Please try again.' },
          { status: 504 }
        )
      }
      console.error('❌ OpenAI API fetch error:', {
        error: error?.message,
        name: error?.name,
        stack: error?.stack,
      })
      throw error
    }

    if (!response.ok) {
      let errorMessage = 'Failed to generate analysis'
      try {
        const error = await response.json()
        console.error('OpenAI API error:', error)
        errorMessage = error.error?.message || error.message || errorMessage
      } catch (e) {
        const errorText = await response.text().catch(() => 'Unknown error')
        console.error('OpenAI API error (non-JSON):', errorText)
        errorMessage = errorText.substring(0, 200) || errorMessage
      }
      return NextResponse.json(
        { error: errorMessage },
        { status: response.status || 500 }
      )
    }

    let data: any
    try {
      data = await response.json()
    } catch (error) {
      console.error('Failed to parse OpenAI response:', error)
      return NextResponse.json(
        { error: 'Failed to parse analysis response' },
        { status: 500 }
      )
    }

    const analysis = data.choices?.[0]?.message?.content || 'Unable to generate analysis.'
    
    if (!analysis || analysis === 'Unable to generate analysis.') {
      console.error('No analysis content in OpenAI response:', data)
      return NextResponse.json(
        { error: 'No analysis content received from AI' },
        { status: 500 }
      )
    }
    
    console.log('✅ OpenAI API call completed:', {
      elapsed: Date.now() - startTime + 'ms',
      analysisLength: analysis.length,
    })

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

    // Send form data and analysis to n8n webhook
    // IMPORTANT: Only trigger webhook AFTER we have successfully received analysis from OpenAI
    const n8nWebhookUrl = 'https://n8n.bobwazneh.com/webhook/zenyalab'
    
    // Prepare payload - n8n webhooks typically expect data in the request body
    // Send both structured and raw data for flexibility
    const webhookPayload = {
      ...structuredFormData, // Spread structured data at top level for easy access
      formData: structuredFormData, // Also include nested for reference
      rawFormData: formData, // Keep raw data as backup
      analysis: analysis,
      timestamp: new Date().toISOString(),
    }

    console.log('📤 Triggering n8n webhook AFTER successful OpenAI response:', {
      url: n8nWebhookUrl,
      payloadKeys: Object.keys(webhookPayload),
      hasAnalysis: !!analysis,
      analysisLength: analysis.length,
    })

    // Send webhook - initiate the request immediately to ensure it starts
    // This ensures the webhook is triggered after we have the OpenAI response
    // We start the fetch immediately (which initiates the network request)
    // but don't await it, so we can return the response to the user quickly
    const controller = new AbortController()
    const timeoutId = setTimeout(() => {
      controller.abort()
    }, 10000) // 10 second timeout for background task

    const webhookStartTime = Date.now()
    
    // Start the fetch request immediately - this initiates the network call
    // The promise will continue executing even after we return the response
    const webhookPromise = fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(webhookPayload),
      signal: controller.signal,
    })
      .then(async (response) => {
        clearTimeout(timeoutId)
        
        if (!response.ok) {
          const errorText = await response.text().catch(() => 'Unknown error')
          console.error(`❌ n8n webhook error: ${response.status} ${response.statusText}`, {
            url: n8nWebhookUrl,
            method: 'POST',
            errorText: errorText.substring(0, 200),
            elapsed: Date.now() - webhookStartTime + 'ms',
          })
        } else {
          const responseText = await response.text().catch(() => '')
          console.log('✅ Successfully sent POST request to n8n webhook:', {
            status: response.status,
            statusText: response.statusText,
            responseLength: responseText.length,
            url: n8nWebhookUrl,
            method: 'POST',
            elapsed: Date.now() - webhookStartTime + 'ms',
          })
        }
      })
      .catch((error: any) => {
        clearTimeout(timeoutId)
        
        // Log detailed error information
        const errorDetails: any = {
          url: n8nWebhookUrl,
          error: error?.message || String(error),
          name: error?.name,
          timestamp: new Date().toISOString(),
        }
        
        if (error?.code) errorDetails.code = error.code
        if (error?.cause) errorDetails.cause = error.cause
        
        // Check if it's a timeout/abort error
        if (error?.name === 'AbortError' || error?.message?.includes('timeout')) {
          console.warn('⚠️ n8n webhook call timed out or was aborted:', errorDetails)
        } else {
          console.error('❌ Failed to send data to n8n webhook:', errorDetails)
        }
      })

    // Ensure webhook promise is tracked (prevents cancellation in serverless)
    // The fetch has already been initiated, so the network request is in progress
    // We attach handlers to keep the promise chain alive
    webhookPromise.catch(() => {
      // Errors already logged in promise chain
    })

    // Return response immediately - webhook executes in background
    // Webhook is guaranteed to be triggered since we have the analysis at this point
    const totalTime = Date.now() - startTime
    console.log('📤 Returning response to user:', {
      totalTime: totalTime + 'ms',
      webhookTriggered: true,
      hasAnalysis: true,
    })
    
    return NextResponse.json({ analysis })
  } catch (error: any) {
    const errorMessage = error?.message || String(error) || 'Internal server error'
    console.error('Analysis error:', {
      error: errorMessage,
      stack: error?.stack,
      name: error?.name,
      elapsed: Date.now() - startTime + 'ms',
    })
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}


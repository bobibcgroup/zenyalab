import { NextRequest, NextResponse } from 'next/server'

// Configure runtime for Vercel
export const runtime = 'nodejs' // Node.js runtime
// Note: Vercel free tier has 10s timeout, Pro has 60s
// If you're on Pro, increase maxDuration to 30-60 and increase OpenAI timeout accordingly
export const maxDuration = 10 // 10 seconds max execution time (matches free tier limit)

// OpenAI model configuration
// Use gpt-3.5-turbo for faster responses (2-4 seconds) or gpt-4 for better quality (5-15 seconds)
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-3.5-turbo' // Default to faster model
const OPENAI_TIMEOUT = OPENAI_MODEL === 'gpt-4' ? 25000 : 8000 // Longer timeout for GPT-4

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
    // Timeout varies based on model: gpt-3.5-turbo is faster (8s), gpt-4 needs more time (25s)
    // For Vercel free tier (10s limit), we use 8s timeout to leave buffer
    // For Vercel Pro (60s limit), GPT-4 can use up to 25s
    const openAIController = new AbortController()
    // Calculate timeout: leave 2s buffer for Vercel's limit
    const maxTimeoutMs = (maxDuration * 1000) - 2000 // Leave 2s buffer
    const timeoutMs = OPENAI_MODEL === 'gpt-4' ? Math.min(OPENAI_TIMEOUT, maxTimeoutMs) : OPENAI_TIMEOUT
    const openAITimeout = setTimeout(() => {
      openAIController.abort()
      console.error(`⏱️ OpenAI API request timeout triggered after ${timeoutMs}ms`)
    }, timeoutMs)

    console.log('🤖 Calling OpenAI API...', {
      model: OPENAI_MODEL,
      promptLength: prompt.length,
      timeout: timeoutMs + 'ms',
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
          model: OPENAI_MODEL,
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
        console.error(`⏱️ OpenAI API request timed out after ${timeoutMs}ms`)
        return NextResponse.json(
          { error: `Request timed out after ${Math.round(timeoutMs/1000)}s. The AI service is taking too long. Please try again, or consider using a faster model.` },
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

    // Send webhook - await with timeout to ensure it completes
    // We'll wait up to 3 seconds for the webhook, then return response to user
    const webhookStartTime = Date.now()
    
    console.log('🚀 Starting webhook fetch request...', {
      url: n8nWebhookUrl,
      timestamp: new Date().toISOString(),
    })

    // Use Promise.race to timeout the webhook after 3 seconds
    // This ensures we don't wait too long, but gives the webhook time to complete
    try {
      const webhookResponse = await Promise.race([
        fetch(n8nWebhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(webhookPayload),
        }),
        new Promise<Response>((_, reject) =>
          setTimeout(() => reject(new Error('Webhook timeout after 3 seconds')), 3000)
        ),
      ])

      console.log('📡 Webhook response received:', {
        status: webhookResponse.status,
        statusText: webhookResponse.statusText,
        elapsed: Date.now() - webhookStartTime + 'ms',
      })

      if (!webhookResponse.ok) {
        const errorText = await webhookResponse.text().catch(() => 'Unknown error')
        console.error(`❌ n8n webhook error: ${webhookResponse.status} ${webhookResponse.statusText}`, {
          url: n8nWebhookUrl,
          method: 'POST',
          errorText: errorText.substring(0, 200),
          elapsed: Date.now() - webhookStartTime + 'ms',
        })
      } else {
        const responseText = await webhookResponse.text().catch(() => '')
        console.log('✅ Successfully sent POST request to n8n webhook:', {
          status: webhookResponse.status,
          statusText: webhookResponse.statusText,
          responseLength: responseText.length,
          url: n8nWebhookUrl,
          method: 'POST',
          elapsed: Date.now() - webhookStartTime + 'ms',
        })
      }
    } catch (error: any) {
      // Log error but don't block the response
      const errorDetails: any = {
        url: n8nWebhookUrl,
        error: error?.message || String(error),
        name: error?.name,
        timestamp: new Date().toISOString(),
      }
      
      if (error?.code) errorDetails.code = error.code
      if (error?.cause) errorDetails.cause = error.cause
      
      if (error?.message?.includes('timeout')) {
        console.warn('⚠️ n8n webhook call timed out after 3 seconds (continuing anyway):', errorDetails)
      } else {
        console.error('❌ Failed to send data to n8n webhook (non-fatal):', errorDetails)
      }
    }

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


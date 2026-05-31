// src/utils/api.js - OpenAI Chat Endpoint
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { message, userProfile, isAssessed } = req.body

  const systemPrompt = isAssessed 
    ? `You are an AI Career Coach for a Learning Management System. 
       User: ${userProfile.name}
       Skill Level: ${userProfile.skillLevel}
       Career Goal: ${userProfile.careerGoal}
       
       Provide helpful advice about courses, career paths, and job market trends.
       Keep responses concise and actionable.`
    : `You are an AI Career Assessment assistant. Your job is to assess the user's:
       1. Current skill level in computing (Beginner/Intermediate/Advanced)
       2. Primary interests in computing (e.g., Web Dev, Data Science, Mobile, Cloud, AI)
       3. Career goals (specific role they want to achieve)
       
       Ask ONE question at a time. After collecting all info, output:
       {"assessmentComplete":true,"skillLevel":"X","careerGoal":"Y","interests":["Z"]}
       
       Keep conversation natural and encourage user to answer honestly.`

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      temperature: 0.7,
      max_tokens: 500
    })

    const reply = completion.choices[0].message.content
    let responseData = { reply }

    // Check if this completes the assessment
    if (!isAssessed && reply.includes('"assessmentComplete":true')) {
      try {
        const jsonMatch = reply.match(/\{.*\}/s)
        if (jsonMatch) {
          const assessmentData = JSON.parse(jsonMatch[0])
          responseData = {
            ...responseData,
            assessmentComplete: true,
            skillLevel: assessmentData.skillLevel,
            careerGoal: assessmentData.careerGoal,
            interests: assessmentData.interests
          }
        }
      } catch (e) {
        console.error('Failed to parse assessment JSON')
      }
    }

    res.status(200).json(responseData)
  } catch (error) {
    console.error('OpenAI API error:', error)
    res.status(500).json({ error: 'Failed to process chat message' })
  }
}
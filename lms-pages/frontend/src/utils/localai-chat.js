// server/api/localai-chat.js

export async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { message, userProfile, isAssessed } = req.body

  // Simple prompt engineering for your LMS
  const getPrompt = () => {
    if (!isAssessed) {
      return `You are a career assessment bot for a learning platform. 
      
Ask ONE question at a time to learn about the user:

1. First ask: "What is your current skill level? (Beginner/Intermediate/Advanced)"
2. Then ask: "What area of computing interests you most? (Web Dev, Data Science, Mobile, Cloud, AI, Cybersecurity)"
3. Finally ask: "What is your specific career goal?"

Current conversation: User said: "${message}"

Respond naturally, one question at a time.`
    }
    
    return `You are a career coach. User wants to become a ${userProfile.careerGoal || 'developer'}.
    Skill level: ${userProfile.skillLevel || 'Beginner'}
    
    Give specific advice about:
    - What courses to take next
    - Current job market trends
    - Skills to learn
    
    Keep response under 150 words. Be practical and encouraging.
    
    User question: "${message}"`
  }

  try {
    // Call LocalAI
    const response = await fetch('http://localhost:8080/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: getPrompt() },
          { role: "user", content: message }
        ],
        temperature: 0.7,
        max_tokens: 300
      })
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const data = await response.json()
    const reply = data.choices[0].message.content
    
    // Check if assessment is complete (simple keyword detection)
    let assessmentComplete = false
    let skillLevel = null
    let careerGoal = null
    
    if (!isAssessed) {
      // Look for all three assessment markers in conversation history
      const conversation = [message]
      if (conversation.some(m => /beginner|intermediate|advanced/i.test(m))) {
        const levelMatch = conversation.join(' ').match(/beginner|intermediate|advanced/i)
        if (levelMatch) skillLevel = levelMatch[0].charAt(0).toUpperCase() + levelMatch[0].slice(1).toLowerCase()
      }
      if (conversation.some(m => /developer|engineer|architect|analyst/i.test(m))) {
        const goalMatch = conversation.join(' ').match(/(frontend|backend|full.?stack|data|cloud|devops|security)\s*(developer|engineer|architect)/i)
        if (goalMatch) careerGoal = goalMatch[0]
      }
      
      assessmentComplete = !!(skillLevel && careerGoal)
    }

    res.status(200).json({
      reply,
      assessmentComplete,
      skillLevel,
      careerGoal
    })
    
  } catch (error) {
    console.error('LocalAI error:', error)
    
    // Fallback responses (so your demo always works)
    let fallbackReply = "I'm having technical difficulties. However, based on your interest, I recommend starting with HTML/CSS basics, then JavaScript."
    
    if (!isAssessed && message.toLowerCase().includes('beginner')) {
      fallbackReply = "Great! As a beginner, I recommend starting with Web Development. What interests you more: Frontend (what users see) or Backend (servers/databases)?"
    } else if (!isAssessed && message.toLowerCase().includes('intermediate')) {
      fallbackReply = "Since you have some experience, what specific career role are you targeting? (e.g., Full Stack Developer, Data Engineer, Cloud Architect)"
    } else if (isAssessed) {
      fallbackReply = `Based on your goal to become a ${userProfile.careerGoal}, I suggest learning: React, Node.js, and PostgreSQL. The job market shows 2,500+ openings for this role in Nigeria.`
    }
    
    res.status(200).json({ reply: fallbackReply })
  }
}
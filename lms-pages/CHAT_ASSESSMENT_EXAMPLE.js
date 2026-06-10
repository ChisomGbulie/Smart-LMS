// EXAMPLE: Enhanced handleRegularChat function with assessment retrieval
// This shows how to modify your chat to retrieve saved assessments

// Add this to server.js if you want to retrieve saved assessments in chat
// This would replace or enhance the existing handleRegularChat function

async function handleRegularChatWithAssessment(message, userProfile, userId) {
  const lowerMsg = message.toLowerCase();
  
  // Handle assessment request - Now retrieves from database
  if (lowerMsg.includes('assessment')) {
    try {
      const result = await getAssessment(userId);
      
      if (result.success && result.data) {
        const assessment = result.data;
        const pathResult = await getLearningPath(userId);
        
        if (pathResult.success && pathResult.data) {
          const path = pathResult.data;
          const coursesList = (path.recommended_courses || [])
            .map(course => `• ${course}`)
            .join('\n');
          
          return {
            reply: `✅ **Your Saved Assessment:**\n\n` +
                   `📌 **Career Goal:** ${assessment.career_goal}\n` +
                   `🎯 **Specialization:** ${assessment.specialization}\n` +
                   `📊 **Skill Level:** ${assessment.experience_level}\n` +
                   `⏰ **Last Updated:** ${new Date(assessment.updated_at).toLocaleDateString()}\n\n` +
                   `${path.roadmap_content}\n\n` +
                   `**Recommended Courses:**\n${coursesList}\n\n` +
                   `Would you like to:\n• 📚 Browse these courses\n• 🔄 Retake the assessment\n• 📋 Learn about a specific skill`,
            fromDatabase: true
          };
        }
      } else {
        return {
          reply: "You haven't completed an assessment yet. Would you like to start one?",
          fromDatabase: false
        };
      }
    } catch (error) {
      console.error('Error retrieving assessment:', error);
      return {
        reply: "I had trouble retrieving your assessment. Please try again later.",
        error: true
      };
    }
  }
  
  // Regular chat handling (existing code)
  if (lowerMsg.includes('course') || lowerMsg.includes('learn')) {
    return "📚 **Recommended Courses:**\n\n• Introduction to Web Development\n• JavaScript Fundamentals to Advanced\n• React.js Mastery\n• Node.js & Express Backend Development\n\nVisit the Courses page to enroll! 🎓";
  }
  
  if (lowerMsg.includes('job') || lowerMsg.includes('salary')) {
    return "💼 **Market Insights (Nigeria):**\n\n• Entry-level: ₦300k-450k/month\n• Mid-level: ₦500k-750k/month\n• Senior: ₦800k-1.2M/month\n\n🔥 Demand is growing 28% year-over-year!";
  }
  
  if (lowerMsg.includes('skill') || lowerMsg.includes('technology')) {
    return "🔧 **Top Skills for 2025:**\n\n✓ React.js, TypeScript, Next.js\n✓ Node.js, Python, PostgreSQL\n✓ Docker, Git, CI/CD\n\nWhich skill would you like to learn more about?";
  }
  
  return "I'm here to help! Ask me about assessment, courses, jobs, or skills.";
}

// USAGE in your chat endpoint:
// if (isAssessed && state.roadmapShown) {
//   return await handleRegularChatWithAssessment(msg, userProfile, userId);
// }

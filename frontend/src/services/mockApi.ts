
// // === Keyword extraction (lightweight semantic simulation) ===
// const extractTopic = (s: string) => {
//   if (s.includes('deadline') || s.includes('late')) return 'Project Management/Deadlines';
//   if (s.includes('credit') || s.includes('recognition')) return 'Credit/Recognition for Contributions';
//   if (s.includes('communication') || s.includes('ghosting')) return 'Interpersonal Communication Issues';
//   if (s.includes('respect') || s.includes('boundary')) return 'Boundary Setting/Lack of Respect';
//   if (s.includes('workload') || s.includes('unfair')) return 'Uneven Workloads/Fairness';
//   if (s.includes('gossip') || s.includes('complaint')) return 'Workplace/Social Drama';
//   if (s.includes('apology') || s.includes('sorry')) return 'Need to Apologize';
//   return 'General Conflict/The Situation';
// };

// export const mockAnalyze = (situation: string) => {
//   return new Promise(resolve => {
//     setTimeout(() => {
//       const s = situation.toLowerCase();
//       const context =
//         s.includes('work') || s.includes('manager') || s.includes('team')
//           ? 'Professional/Work'
//           : s.includes('friend') || s.includes('partner') || s.includes('family')
//             ? 'Personal/Relationship'
//             : 'Neutral/General';
      
//       const emotionalTone =
//         s.includes('angry') || s.includes('furious')
//           ? 'Angry/Need to De-escalate'
//           : s.includes('hurt') || s.includes('sad')
//             ? 'Hurt/Vulnerable'
//             : context === 'Professional/Work'
//               ? 'Frustrated but Professional'
//               : 'Concerned but Caring';

//       const userGoal =
//         s.includes('stop') || s.includes('end')
//           ? 'Set Firm Boundary'
//           : s.includes('resolve') || s.includes('fix')
//             ? 'Collaborative Problem-Solving'
//             : s.includes('express') || s.includes('feel')
//               ? 'Express Feelings/Gain Understanding'
//               : 'Seek Clarification';

//       resolve({
//         context,
//         confidence: 0.85,
//         emotionalTone,
//         userGoal, // New element: Crucial for guiding the advice
//         keyElements: [
//           context === 'Professional/Work' ? 'Workplace Dynamics' : 'Relationship Dynamics',
//           'Communication Breakdown',
//           extractTopic(situation) // Incorporate the refined topic
//         ]
//       });
//     }, 600);
//   });
// };

// // === SUGGEST MOCK ===
// export const mockSuggest = (situation: string) => {
//   return new Promise(resolve => {
//     setTimeout(() => {
//       const s = situation.toLowerCase();
//       const topic = extractTopic(s);

//       let responses;

//       // ===== WORK CONTEXT =====
//       if (s.includes('work') || s.includes('manager') || s.includes('team')) {
//         responses = [
//           {
//             id: '1',
//             tone: 'Professional',
//             text: `I want to make sure we're aligned about ${topic}. Can we clarify expectations moving forward?`,
//             explanation: 'Addresses structure and future alignment.'
//           },
//           {
//             id: '2',
//             tone: 'Direct but Fair',
//             text: `I'm noticing recurring friction around ${topic}. Let’s address it so we avoid miscommunication.`,
//             explanation: 'Acknowledges pattern and proposes resolution.'
//           },
//           {
//             id: '3',
//             tone: 'Neutral',
//             text: `Could we sync briefly? I want to ensure we're on the same page regarding ${topic}.`,
//             explanation: 'Low-friction, collaborative framing.'
//           },
//           {
//             id: '4',
//             tone: 'Firm & Objective',
//             text: `I need a clear action plan for ${topic}. My capacity requires us to prioritize effectively moving forward.`,
//             explanation: 'Uses objective language to set a boundary on workload/scope.'
//           },
//           {
//             id: '5',
//             tone: 'Collaborative & Proactive',
//             text: `To prevent future issues with ${topic}, let's define a specific process for [Action, e.g., 'submitting changes'].`,
//             explanation: 'Shifts focus from blame to process improvement.'
//           },
//         ];
//       }

//       // ===== FRIENDSHIP / RELATIONSHIP =====
//       else if (
//         s.includes('friend') ||
//         s.includes('relationship') ||
//         s.includes('partner') ||
//         s.includes('family')
//       ) {
//         responses = [
//           {
//             id: '1',
//             tone: 'Warm',
//             text: `I care about us, and ${topic} has been on my mind. Can we talk it through?`,
//             explanation: 'Balances honesty with care.'
//           },
//           {
//             id: '2',
//             tone: 'Soft but Clear',
//             text: `I felt a bit uneasy about ${topic}. I'd like to understand each other better.`,
//             explanation: 'Invites open dialogue.'
//           },
//           {
//             id: '3',
//             tone: 'Balanced',
//             text: `Here’s what I experienced around ${topic}. What was it like on your side?`,
//             explanation: 'Promotes reciprocal communication.'
//           },
//           {
//             id: '4',
//             tone: 'Vulnerable & Direct',
//             text: `I felt [Emotion, e.g., 'ignored'] when ${topic}. I'd appreciate it if you could share your perspective on what happened.`,
//             explanation: 'Uses "I" statements to own feelings and invite dialogue.'
//           },
//           {
//             id: '5',
//             tone: 'Gentle & Affirming',
//             text: `This is important to me because I value our relationship. Can we find a time to talk more deeply about ${topic}?`,
//             explanation: 'Affirms the relationship while signaling the importance of the issue.'
//           },
//         ];
//       }

//       // ===== UNKNOWN CONTEXT =====
//       else {
//         responses = [
//           {
//             id: '1',
//             tone: 'Calm',
//             text: `Can you share a bit more about ${topic}? I want to respond accurately.`,
//             explanation: 'Clarifies missing context.'
//           },
//           {
//             id: '2',
//             tone: 'Reasoned',
//             text: `Let’s break down what happened around ${topic} and figure out the best approach.`,
//             explanation: 'Analytical framing.'
//           },
//           {
//             id: '3',
//             tone: 'Curious',
//             text: `What’s the core outcome you’re aiming for regarding ${topic}?`,
//             explanation: 'Guides toward negotiation.'
//           }
//         ];
//       }

//       // Add randomness to avoid repeated patterns
//       responses = [...responses].sort(() => Math.random() - 0.5);

//       resolve({ responses });
//     }, 900);
//   });
// };

// // === SAVE MOCK ===
// export const mockSaveInteraction = () => {
//   return Promise.resolve({
//     interactionId: `int_${Date.now()}`,
//     saved: true,
//     queuedForProcessing: true
//   });
// };

export const mockAnalyze = (situation: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Smart context detection based on keywords
      const lowerSituation = situation.toLowerCase();
      let context = 'work';
      
      if (lowerSituation.match(/friend|buddy|pal|hangout|social/)) {
        context = 'friendship';
      } else if (lowerSituation.match(/partner|spouse|girlfriend|boyfriend|husband|wife|relationship|date|romantic/)) {
        context = 'relationship';
      } else if (lowerSituation.match(/work|job|coworker|colleague|boss|manager|office|team|project|meeting/)) {
        context = 'work';
      } else if (lowerSituation.match(/family|parent|sibling|mom|dad|brother|sister/)) {
        context = 'relationship';
      }
      
      // Detect emotional tone
      let emotionalTone = 'neutral';
      if (lowerSituation.match(/angry|mad|furious|upset/)) {
        emotionalTone = 'frustrated_assertive';
      } else if (lowerSituation.match(/sad|hurt|disappointed|depressed/)) {
        emotionalTone = 'hurt_seeking_support';
      } else if (lowerSituation.match(/confused|unsure|don't know/)) {
        emotionalTone = 'uncertain_seeking_clarity';
      } else if (lowerSituation.match(/anxious|worried|nervous|afraid/)) {
        emotionalTone = 'anxious_cautious';
      } else {
        emotionalTone = 'composed_professional';
      }
      
      resolve({
        context,
        confidence: 0.82 + Math.random() * 0.15, // Random 0.82-0.97
        emotionalTone,
        keyElements: extractKeyElements(lowerSituation, context)
      });
    }, 800);
  });
};

function extractKeyElements(situation: string, context: string): string[] {
  const elements: string[] = [];
  
  // Communication patterns
  if (situation.match(/not listen|ignor|dismiss/)) elements.push('communication breakdown');
  if (situation.match(/credit|recogni|acknowledg/)) elements.push('attribution concerns');
  if (situation.match(/respect|value|appreciat/)) elements.push('mutual respect');
  if (situation.match(/boundary|limit|space/)) elements.push('boundary setting');
  if (situation.match(/conflict|disagree|argument/)) elements.push('conflict resolution');
  if (situation.match(/trust|honest|truth/)) elements.push('trust issues');
  
  // Context-specific
  if (context === 'work') {
    elements.push('professional dynamics');
    if (situation.match(/deadline|pressure|stress/)) elements.push('time management');
  } else if (context === 'friendship') {
    elements.push('social connection');
  } else {
    elements.push('emotional intimacy');
  }
  
  // Default if nothing matched
  if (elements.length === 0) {
    elements.push('interpersonal communication', 'relationship dynamics');
  }
  
  return elements.slice(0, 4); // Max 4 elements
}

export const mockSuggest = (situation: string, context?: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const detectedContext = context || 'work';
      const responses = generateContextualResponses(situation, detectedContext);
      
      resolve({
        responses,
        metadata: {
          generatedAt: new Date().toISOString(),
          model: 'llama-3.3-70b'
        }
      });
    }, 1500);
  });
};

function generateContextualResponses(situation: string, context: string) {
  const lowerSit = situation.toLowerCase();
  const isConflict = !!lowerSit.match(/conflict|disagree|argument|fight/);
  const isNeedsBoundary = !!lowerSit.match(/boundary|too much|overwhelm|space/);
  const needsAssertiveness = !!lowerSit.match(/credit|ignor|dismiss|overlook/);
  
  // Template responses that adapt to context
  const responses = [
    {
      id: 'resp_1',
      tone: 'Calm and Professional',
      text: generateCalmResponse(context, situation, isConflict, needsAssertiveness),
      explanation: 'Maintains composure while clearly expressing needs. Opens dialogue without escalation.'
    },
    {
      id: 'resp_2',
      tone: 'Empathetic',
      text: generateEmpatheticResponse(context, situation, isConflict),
      explanation: 'Acknowledges emotions on both sides. Builds connection through understanding.'
    },
    {
      id: 'resp_3',
      tone: 'Direct but Kind',
      text: generateDirectResponse(context, situation, needsAssertiveness, isNeedsBoundary),
      explanation: 'Clear and honest communication with respectful tone. Sets expectations explicitly.'
    }
  ];
  
  return responses;
}

function generateCalmResponse(context: string, situation: string, isConflict: boolean, needsAssertiveness: boolean): string {
  if (context === 'work') {
    if (needsAssertiveness) {
      return "I'd like to discuss something important. I want to make sure my contributions are properly recognized. Can we schedule time to talk about how we track project work?";
    }
    if (isConflict) {
      return "I appreciate your perspective. I'd like to find a solution that works for both of us. Could we take some time to discuss this calmly?";
    }
    return "I'd appreciate the opportunity to discuss this matter. When would be a good time for us to have a thoughtful conversation about this?";
  } else if (context === 'friendship') {
    return "I value our friendship and want to talk about something that's been on my mind. Can we find time to chat openly about this?";
  } else {
    return "I care about us and I think we should talk about this. Can we set aside time when we're both calm to discuss it together?";
  }
}

function generateEmpatheticResponse(context: string, situation: string, isConflict: boolean): string {
  if (context === 'work') {
    return "I understand we're both under pressure. I'm feeling concerned about this situation, and I imagine you have your own perspective. I'd like to hear your thoughts.";
  } else if (context === 'friendship') {
    return "I care about you and our friendship. I've been feeling some concern about this, and I want to understand your perspective too. Can we talk it through?";
  } else {
    return "I love you and want us to work through this together. I've been feeling worried about this, and I want to understand how you're feeling too.";
  }
}

function generateDirectResponse(context: string, situation: string, needsAssertiveness: boolean, isNeedsBoundary: boolean): string {
  if (needsAssertiveness) {
    return "I need to address this directly: my contributions should be acknowledged. This is important to me, and I'd like us to establish a clearer system going forward.";
  }
  if (isNeedsBoundary) {
    return "I need to be honest about my boundaries here. I've been feeling overwhelmed, and I need us to make some changes to how we handle this.";
  }
  if (context === 'work') {
    return "I want to be direct about my concerns. This situation isn't working for me, and I think we need to address it to move forward productively.";
  } else if (context === 'friendship') {
    return "I need to be honest with you about how I'm feeling. This has been bothering me, and I think we should talk about it openly to keep our friendship strong.";
  } else {
    return "I need to be direct with you about this. It's been affecting how I feel, and I think addressing it honestly will help us both.";
  }
}

export const mockSaveInteraction = () => {
  return Promise.resolve({
    interactionId: 'int_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
    saved: true,
    queuedForProcessing: true
  });
};

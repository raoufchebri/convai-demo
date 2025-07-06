# ConvAI Demo - Interactive Voice Learning Assistant

A Next.js web application that provides an interactive voice-based learning experience with specialized AI teachers for different subjects. Built with ElevenLabs ConvAI technology.

## 🎯 What This App Does

This app creates an immersive voice conversation experience where students can interact with specialized AI teachers through natural speech. The interface features a beautiful animated orb that responds to the conversation state and allows seamless switching between different subjects.

## Installation

**Prerequisites**
- Node.js 18+ 
- npm or pnpm
- ElevenLabs API key
- ElevenLabs ConvAI agents configured

1. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

2. **Set up environment variables**
   - Copy `.env.example` to `.env.local`
   - Add your ElevenLabs API key and agent IDs

### Environment Variables
Create a `.env.local` file with:

```env
# ElevenLabs Configuration
AGENT_ID=your_default_agent_id
MATH_AGENT_ID=your_math_agent_id
SCIENCE_AGENT_ID=your_science_agent_id
XI_API_KEY=your_elevenlabs_api_key
```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   - Navigate to `http://localhost:3000`
   - Grant microphone permissions
   - Start talking!

## 🏗️ Project Structure

```
convai-demo/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   └── signed-url/    # ElevenLabs signed URL endpoint
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page
├── components/            # React components
│   ├── ConvAI.tsx         # Main conversation component
│   ├── background-wave.tsx # Animated background
│   └── ui/               # UI components
├── agents/               # Agent personality files
│   ├── math.md           # Dr. Elena's personality
│   ├── science.md        # Simon's personality
│   └── general.md        # General assistant personality
├── lib/                  # Utility functions
└── public/              # Static assets
```


## 👨‍🏫 Available Teachers

### Dr. Elena - Mathematics Teacher
- **Theme**: Pink/Math
- **Expertise**: K-12 mathematics education
- **Specialties**: Algebra, Geometry, Trigonometry, Statistics, Problem-solving
- **Voice Commands**: "let's talk mathematics", "switch to math", "I want to discuss math"

### Simon - Science Teacher  
- **Theme**: Green/Science
- **Expertise**: K-12 science education
- **Specialties**: Life Science, Physical Science, Chemistry, Physics, Scientific Method
- **Voice Commands**: "let's talk science", "switch to science", "I want to discuss science"

### General Assistant
- **Theme**: Gray/General
- **Purpose**: General conversation and assistance
- **Voice Commands**: "return to general", "back to general", "switch to general"

## 🎮 How to Use

### Starting a Conversation
1. Page load will start the conversation. Alternatively, click the floating play button (▶️) in the bottom-right corner
2. The orb will animate and change color to indicate the conversation is active

### Switching Between Teachers
You can switch between teachers using voice commands:

**From any teacher:**
- "let's talk mathematics" → Switch to Dr. Elena (Math)
- "let's talk science" → Switch to Simon (Science)  
- "return to general" → Switch to General Assistant

**Alternative commands:**
- "switch to math/science/general"
- "I want to discuss mathematics/science"
- "let's discuss mathematics/science"

### Manual Theme Switching
- Click the colored theme buttons below the orb
- Pink button → Math teacher (Dr. Elena)
- Green button → Science teacher (Simon)
- Gray button → General assistant

### Stopping Conversations
- Say "stop conversation", "end conversation", or "goodbye"
- Click the stop button (⏹️) in the bottom-right corner
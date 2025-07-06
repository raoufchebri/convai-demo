## Conversational AI Demo

A Next.js demo application showcasing ElevenLabs Conversational AI capabilities.

## Getting Started

### 1. Environment Setup

Copy the example environment file and add your credentials:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your ElevenLabs credentials:

```
AGENT_ID=your_agent_id_here
XI_API_KEY=your_xi_api_key_here
```

**Required Environment Variables:**
- `AGENT_ID` - Your ElevenLabs conversational AI agent ID
- `XI_API_KEY` - Your ElevenLabs API key

### How to Get Your Credentials

#### Getting Your Agent ID

1. **Sign up to ElevenLabs** at [elevenlabs.io](https://elevenlabs.io)
2. From the home page, locate **Conversational AI** under **Products** in the left sidebar menu
3. Click on **Conversational AI**
4. On the same sidebar, locate **Agents** and click on it
5. Complete the form to create a new agent
6. Hit **Create Agent**
7. Copy the **Agent ID** that is generated

#### Getting Your API Key

1. On the sidebar menu, locate your icon and name to access the account settings
2. Click on **API Key**
3. Click **Create API Key**
4. Give it a name or leave the default name
5. Hit **Create** and copy your API key

### 2. Install Dependencies

```bash
npm install
```

### 3. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## Learn More

- [Conversational AI Tutorial](https://elevenlabs.io/docs/product/introduction)
- [Conversational AI SDK](https://elevenlabs.io/docs/libraries/conversational-ai-sdk-js)

import {NextResponse} from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const requestedAgentId = searchParams.get('agentId');
    
    // Use the requested agent ID or fall back to the default
    let agentId = process.env.AGENT_ID; // Default agent
    const mathAgentId = process.env.MATH_AGENT_ID;
    const scienceAgentId = process.env.SCIENCE_AGENT_ID;
    const apiKey = process.env.XI_API_KEY;
    
    // Map agent identifiers to actual agent IDs
    if (requestedAgentId === 'math' && mathAgentId) {
        agentId = mathAgentId;
    } else if (requestedAgentId === 'science' && scienceAgentId) {
        agentId = scienceAgentId;
    } else if (requestedAgentId && requestedAgentId !== 'math' && requestedAgentId !== 'science') {
        agentId = requestedAgentId; // Allow direct agent ID if provided
    }
    
    if (!agentId) {
        return NextResponse.json({ error: 'AGENT_ID is not set' }, { status: 500 });
    }
    if (!apiKey) {
        return NextResponse.json({ error: 'XI_API_KEY is not set' }, { status: 500 });
    }
    
    try {
        const response = await fetch(
            `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${agentId}`,
            {
                method: 'GET',
                headers: {
                    'xi-api-key': apiKey,
                }
            }
        );

        if (!response.ok) {
            throw new Error('Failed to get signed URL');
        }

        const data = await response.json();
        return NextResponse.json({signedUrl: data.signed_url})
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Failed to get signed URL' }, { status: 500 });
    }
}

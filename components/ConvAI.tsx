"use client"

import {Button} from "@/components/ui/button";
import * as React from "react";
import {useState, useRef} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Conversation} from "@11labs/client";
import {cn} from "@/lib/utils";

// Theme definitions
const THEMES = {
    gray: {
        name: "General",
        orbActive: "orb-active-gray",
        orbInactive: "orb-inactive-gray",
        waveGradient: "waveGradientGray"
    },
    pink: {
        name: "Math", 
        orbActive: "orb-active-pink",
        orbInactive: "orb-inactive-pink",
        waveGradient: "waveGradientPink"
    },
    green: {
        name: "Science",
        orbActive: "orb-active-green", 
        orbInactive: "orb-inactive-green",
        waveGradient: "waveGradientGreen"
    },
    blue: {
        name: "History",
        orbActive: "orb-active-blue",
        orbInactive: "orb-inactive-blue", 
        waveGradient: "waveGradientBlue"
    },
    purple: {
        name: "Geography",
        orbActive: "orb-active-purple",
        orbInactive: "orb-inactive-purple", 
        waveGradient: "waveGradientPurple"
    }
};

// Voice command mapping for themes
const THEME_COMMANDS = {
    'gray': ['gray', 'grey', 'silver'],
    'pink': ['math', 'mathematics'],
    'green': ['science'],
    'blue': ['history'],
    'purple': ['geography', 'geo']
};

async function requestMicrophonePermission() {
    try {
        await navigator.mediaDevices.getUserMedia({audio: true})
        return true
    } catch {
        console.error('Microphone permission denied')
        return false
    }
}

async function getSignedUrl(agentId?: string): Promise<string> {
    const url = agentId ? `/api/signed-url?agentId=${agentId}` : '/api/signed-url';
    const response = await fetch(url)
    if (!response.ok) {
        throw Error('Failed to get signed url')
    }
    const data = await response.json()
    return data.signedUrl
}

export function ConvAI() {
    const [conversation, setConversation] = useState<Conversation | null>(null)
    const [isConnected, setIsConnected] = useState(false)
    const [isSpeaking, setIsSpeaking] = useState(false)
    const [currentTheme, setCurrentTheme] = useState<keyof typeof THEMES>('gray')
    const [stopRequested, setStopRequested] = useState(false)
    const [currentAgentId, setCurrentAgentId] = useState<string | undefined>(undefined)
    
    // Use ref to track conversation state for async operations
    const conversationRef = useRef<Conversation | null>(null)
    conversationRef.current = conversation

    // Pass theme to BackgroundWave component
    React.useEffect(() => {
        // Update document body with theme class for global access
        document.body.setAttribute('data-theme', currentTheme);
    }, [currentTheme]);

    // Auto-start conversation on component mount
    React.useEffect(() => {
        startConversation(); // Start with default agent
    }, []);

    // Handle stop request when agent stops speaking
    React.useEffect(() => {
        console.log('Stop effect triggered:', { stopRequested, isSpeaking, hasConversation: !!conversation, isConnected });
        if (stopRequested && !isSpeaking && conversation && isConnected) {
            console.log('Agent stopped speaking, ending conversation as requested...');
            setStopRequested(false);
            endConversation();
        }
    }, [stopRequested, isSpeaking, conversation, isConnected]);

    // Ensure states are synchronized when conversation is null
    React.useEffect(() => {
        if (!conversation) {
            setIsConnected(false);
            setIsSpeaking(false);
            setStopRequested(false);
        }
    }, [conversation]);

    // Function to handle voice commands for theme changes and conversation control
    const handleVoiceCommand = (text: string) => {
        console.log('=== handleVoiceCommand called ===');
        const lowerText = text.toLowerCase();
        console.log('Checking voice command for:', lowerText); // Debug log
        console.log('Original text:', text); // Debug log
        
        // Check for stop conversation commands FIRST (before theme commands)
        const stopCommands = [
            'stop conversation',
            'end conversation',
            'stop talking',
            'end talking',
            'stop chat',
            'end chat',
            'stop the conversation',
            'end the conversation',
            'quit conversation',
            'exit conversation',
            'goodbye',
            'bye'
        ];
        
        console.log('Checking against stop commands:', stopCommands);
        for (const command of stopCommands) {
            console.log(`Checking if "${lowerText}" contains "${command}"`);
            if (lowerText.includes(command)) {
                console.log(`Matched stop command: ${command}`); // Debug log
                if (conversation && isConnected) {
                    console.log('Stop command received, will end conversation when agent stops speaking...');
                    setStopRequested(true);
                    return true; // Command was handled
                } else {
                    console.log('No active conversation to stop');
                }
            }
        }
        
        // Also check for simple stop commands (but be more careful)
        const simpleStopCommands = ['stop', 'end', 'quit', 'exit'];
        for (const command of simpleStopCommands) {
            // Only match if it's a standalone command or clearly a stop request
            if (lowerText === command || 
                lowerText.startsWith(command + ' ') || 
                lowerText.endsWith(' ' + command) ||
                lowerText.includes(' ' + command + ' ')) {
                console.log(`Matched simple stop command: ${command}`); // Debug log
                if (conversation && isConnected) {
                    console.log('Stop command received, will end conversation when agent stops speaking...');
                    setStopRequested(true);
                    return true; // Command was handled
                } else {
                    console.log('No active conversation to stop');
                }
            }
        }
        
        // Check for theme change commands
        for (const [themeKey, commands] of Object.entries(THEME_COMMANDS)) {
            for (const command of commands) {
                if (lowerText.includes(command)) {
                    console.log(`Found color keyword: ${command}`); // Debug log
                    
                    // Check if it's a request to change theme (not just mentioning the color)
                    const themeChangePatterns = [
                        `change to ${command}`,
                        `switch to ${command}`,
                        `set ${command}`,
                        `make it ${command}`,
                        `use ${command}`,
                        `i want ${command}`,
                        `change color to ${command}`,
                        `change theme to ${command}`,
                        `set theme to ${command}`,
                        `set color to ${command}`,
                        // Student-specific patterns
                        `i want to discuss ${command}`,
                        `i want to talk about ${command}`,
                        `let's discuss ${command}`,
                        `let's talk about ${command}`,
                        `direct me to the ${command} section`,
                        `take me to ${command}`,
                        `go to ${command}`,
                        `show me ${command}`,
                        `i'd like to discuss ${command}`,
                        `i'd like to talk about ${command}`,
                        `can we discuss ${command}`,
                        `can we talk about ${command}`,
                        `i want to learn about ${command}`,
                        `teach me about ${command}`,
                        // More flexible patterns
                        `change ${command}`,
                        `switch ${command}`,
                        `want ${command}`,
                        `like ${command}`,
                        `prefer ${command}`
                    ];
                    
                    for (const pattern of themeChangePatterns) {
                        if (lowerText.includes(pattern)) {
                            console.log(`Matched pattern: ${pattern}`); // Debug log
                            const newTheme = themeKey as keyof typeof THEMES;
                            if (newTheme !== currentTheme) {
                                console.log(`Theme change requested: ${currentTheme} -> ${newTheme}`);
                                console.log(`Current conversation state:`, { conversation: !!conversation, isConnected, isSpeaking });
                                setCurrentTheme(newTheme);
                                console.log(`Theme changed to ${THEMES[newTheme].name}`);
                                
                                // Switch to Math agent if Math theme is selected
                                if (newTheme === 'pink') {
                                    console.log('Switching to Math agent...');
                                    switchToAgent('math'); // Use a simple identifier
                                }
                                
                                // Switch to Science agent if Science theme is selected
                                if (newTheme === 'green') {
                                    console.log('Switching to Science agent...');
                                    switchToAgent('science'); // Use a simple identifier
                                }
                                
                                // Optional: Add visual feedback or audio confirmation
                                return true; // Theme was changed
                            } else {
                                console.log(`Theme is already ${THEMES[newTheme].name}`); // Debug log
                            }
                        }
                    }
                }
            }
        }
        console.log('No voice command detected'); // Debug log
        return false; // No command was handled
    };

    async function startConversation(agentId?: string) {
        const hasPermission = await requestMicrophonePermission()
        if (!hasPermission) {
            alert("No permission")
            return;
        }
        const signedUrl = await getSignedUrl(agentId)
        const conversation = await Conversation.startSession({
            signedUrl: signedUrl,
            onConnect: () => {
                setIsConnected(true)
                setIsSpeaking(true)
            },
            onDisconnect: () => {
                setIsConnected(false)
                setIsSpeaking(false)
            },
            onError: (error) => {
                console.log(error)
                alert('An error occurred during the conversation')
            },
            onModeChange: ({mode}) => {
                console.log('Mode changed:', mode, 'Setting isSpeaking to:', mode === 'speaking');
                setIsSpeaking(mode === 'speaking')
            },
            // Add message handler for voice commands
            onMessage: (message) => {
                console.log('=== onMessage called ===');
                console.log('Received message:', message); // Debug log
                console.log('Message source:', message.source);
                console.log('Full message object:', JSON.stringify(message, null, 2));
                
                if (message.message && message.source === 'user') {
                    console.log('=== Processing user message ===');
                    console.log('Processing user message:', message.message); // Debug log
                    console.log('Message type:', typeof message.message);
                    console.log('Message length:', message.message.length);
                    console.log('Current conversation state:', { conversation: !!conversation, isConnected });
                    const commandHandled = handleVoiceCommand(message.message);
                    if (commandHandled) {
                        console.log('Voice command handled successfully!');
                    } else {
                        console.log('No command detected in message:', message.message);
                    }
                } else {
                    console.log('Message not from user or no message content');
                }
            }
        })
        setConversation(conversation)
    }

    async function endConversation() {
        if (!conversation) {
            return
        }
        await conversation.endSession()
        setConversation(null)
        setStopRequested(false)
        setIsConnected(false)
        setIsSpeaking(false)
        setCurrentAgentId(undefined)
    }

    async function switchToAgent(agentId: string) {
        console.log(`Switching to agent: ${agentId}`);
        
        // Force end current conversation and clear all states
        if (conversationRef.current) {
            console.log('Force ending current conversation...');
            
            // End the conversation at the API level
            try {
                await conversationRef.current.endSession();
            } catch (error) {
                console.log('Error ending conversation:', error);
            }
            
            // Immediately clear all states
            setConversation(null);
            setIsConnected(false);
            setIsSpeaking(false);
            setStopRequested(false);
            setCurrentAgentId(undefined);
            
            // Wait for state updates to propagate
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
        
        // Start new conversation with the specified agent
        console.log(`Starting new conversation with agent: ${agentId}`);
        setCurrentAgentId(agentId);
        await startConversation(agentId);
    }

    return (
        <>
            <div className={"flex flex-col justify-center items-center -mt-8 gap-8"}>
                {/* Orb */}
                <div className={cn('orb my-16 mx-12',
                    isSpeaking ? 'animate-orb' : (conversation && 'animate-orb-slow'),
                    isConnected ? THEMES[currentTheme].orbActive : THEMES[currentTheme].orbInactive)}
                ></div>
                
                {/* Current Theme Display */}
                <div className="text-center">
                    <p className="text-sm text-gray-600">Current theme: <span className={cn("font-semibold",
                        currentTheme === 'gray' && "text-gray-600",
                        currentTheme === 'pink' && "text-pink-500", 
                        currentTheme === 'green' && "text-green-500",
                        currentTheme === 'blue' && "text-blue-500",
                        currentTheme === 'purple' && "text-purple-500"
                    )}>{THEMES[currentTheme].name}</span></p>
                    <p className="text-xs text-gray-500 mt-1">Try saying: "I want to discuss math", "Let's talk about science", "Direct me to the history section", or "Show me geography"</p>
                    <p className="text-xs text-gray-500 mt-1">
                        Status: {isConnected ? 'Connected' : 'Disconnected'} | 
                        Speaking: {isSpeaking ? 'Yes' : 'No'} | 
                        Stop Requested: {stopRequested ? 'Yes' : 'No'}
                    </p>
                </div>
                
                {/* Theme Selector */}
                <div className="flex gap-2">
                    {Object.entries(THEMES).map(([key, theme]) => {
                        const isDisabled = key === 'blue' || key === 'purple';
                        const tooltipText = isDisabled ? `${theme.name} (coming soon)` : theme.name;
                        
                        const handleThemeClick = () => {
                            if (!isDisabled) {
                                const newTheme = key as keyof typeof THEMES;
                                setCurrentTheme(newTheme);
                                
                                // Switch to Math agent if Math theme is selected
                                if (newTheme === 'pink') {
                                    console.log('Switching to Math agent...');
                                    switchToAgent('math');
                                }
                                
                                // Switch to Science agent if Science theme is selected
                                if (newTheme === 'green') {
                                    console.log('Switching to Science agent...');
                                    switchToAgent('science');
                                }
                                
                                // Switch to General agent if General theme is selected
                                if (newTheme === 'gray') {
                                    console.log('Switching to General agent...');
                                    switchToAgent(undefined); // Uses AGENT_ID (default agent)
                                }
                            }
                        };
                        
                        return (
                            <Button
                                key={key}
                                size="sm"
                                variant={currentTheme === key ? "default" : "outline"}
                                className={cn(
                                    "rounded-full w-12 h-12 p-0 relative group",
                                    isDisabled && "opacity-50 cursor-not-allowed"
                                )}
                                onClick={handleThemeClick}
                                title={tooltipText}
                                disabled={isDisabled}
                            >
                                <div className={cn(
                                    "w-6 h-6 rounded-full",
                                    key === 'gray' && "bg-gray-400",
                                    key === 'pink' && "bg-pink-400", 
                                    key === 'green' && "bg-green-400",
                                    key === 'blue' && "bg-blue-400",
                                    key === 'purple' && "bg-purple-400"
                                )}></div>
                                {/* Custom tooltip */}
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                                    {tooltipText}
                                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                                </div>
                            </Button>
                        );
                    })}
                </div>
            </div>

            {/* Floating Audio Control Button */}
            <div className="fixed bottom-6 right-6 z-50">
                <Button
                    size="lg"
                    className={cn(
                        "rounded-full w-16 h-16 shadow-lg transition-all duration-300",
                        isConnected 
                            ? "bg-black hover:bg-gray-800" 
                            : "bg-white hover:bg-gray-100"
                    )}
                    onClick={isConnected ? endConversation : () => startConversation()}
                    disabled={false}
                    title={`Conversation: ${conversation ? 'active' : 'null'}, Connected: ${isConnected}`}
                >
                    {isConnected ? (
                        <svg 
                            className="w-8 h-8 text-gray-300" 
                            fill="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <rect x="6" y="6" width="12" height="12" rx="1"/>
                        </svg>
                    ) : (
                        <svg 
                            className="w-8 h-8 text-gray-400" 
                            fill="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path d="M8 5v14l11-7z"/>
                        </svg>
                    )}
                </Button>
            </div>
        </>
    )
}
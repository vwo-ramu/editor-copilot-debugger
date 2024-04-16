// define interface for log data of some appilocation used to import and visualize in our application
export interface LogData {
    campaignId: string;
    variationId: string;
    selector: string;
    conversationId: string;
    pageURL: string;
    conversationLog: {
        [key: string]: {
            message: string;
            timestamp: Date;
            data: any;
        }[];
    };
}

export interface ConversationGeneration {
    css: string;
    js: string;
    message: string;
    reasoning: string;

}

export interface ConversationUserMessage {
    role: 'user';
    message: string;
    img: string; // base64 image
}

export interface ConversationBotMessage {
    role: 'bot';
    message: string;
    generations: ConversationGeneration[];
}

export enum LogConversationActions {
    AI_RESPONSE = 'AI response',
    PRE_PROCESS_GENERATIONS = 'preprocessed generations',
    AI_RESPONSE_ADDED = 'AI response added to conversation',
    GENERATION_APPLIED = 'Generation applied',
    SENDING_MESSAGE = 'Sending message',
    GOT_SCREENSHOT = 'Got screenshot',
    UNHANDLED = 'Unhandled',
}

export interface ConversationEventAIResponse {
    message: LogConversationActions.AI_RESPONSE;
    timestamp: Date;
    data: {
        user: {
            message: string;
            img: string; // base64 image
        };
        bot: {
            message: string; // raw message
        };
    };
}

export interface ConversationEventPreProcessGenerations {
    message: LogConversationActions.PRE_PROCESS_GENERATIONS;
    timestamp: Date;
    data: {
        message: string;
        generations: { css: string; js: string; message: string; reasoning: string }[];
    };
}

export interface ConversationEventAIResponseAdded {
    message: LogConversationActions.AI_RESPONSE_ADDED;
    timestamp: Date;
    data: {
        user: ConversationUserMessage;
        bot: ConversationBotMessage;
        conversationMessages: {
            role: 'user' | 'bot';
            content: any;
            _id: string;
        }[];
    };
}

export interface ConversationEventGenerationApplied {
    message: LogConversationActions.GENERATION_APPLIED;
    timestamp: Date;
    data: {
        generation: ConversationGeneration;
    };
}

export interface ConversationEventSendingMessage {
    message: LogConversationActions.SENDING_MESSAGE;
    timestamp: Date;
    data: {
        message: string;
        editedMessage: {previousId: number | null | undefined, msgRef: undefined}[];
    };
}

export interface ConversationEventGotScreenshot {
    message: LogConversationActions.GOT_SCREENSHOT;
    timestamp: Date;
    data: {
        screenshot: string; // base64 image
    };
}

export interface ConversationEventUnhandled {
    message: LogConversationActions.UNHANDLED;
    timestamp: Date;
    data: {
        message: string;
    };
}

export type ConversationEvent =
    | ConversationEventAIResponse
    | ConversationEventPreProcessGenerations
    | ConversationEventAIResponseAdded
    | ConversationEventGenerationApplied
    | ConversationEventSendingMessage
    | ConversationEventGotScreenshot
    | ConversationEventUnhandled;

import { useMemo } from 'react';
import { ConversationEvent, LogConversationActions, LogData } from '../types';
import { Accordion, AccordionItem } from '@nextui-org/accordion';

const PrettyLog = ({ data }: { data: LogData }) => {
    // expensive transformation of data to pretty log
    const prettyLogs = useMemo(() => {
        const prettyLogs: { conversationId: string; data: ConversationEvent[] }[] = [];
        for (const key in data.conversationLog) {
            // ignore 'no_conversation_id' key
            if (key === 'no_conversation_id') continue;

            const conversationId = key;
            const conversation = data.conversationLog[key];

            const tempGroupData: ConversationEvent[] = [];
            for (let convEvent of conversation) {
                const convEventData = convEvent.data;

                if (convEvent.message === LogConversationActions.AI_RESPONSE) {
                    tempGroupData.push({
                        message: LogConversationActions.AI_RESPONSE,
                        timestamp: new Date(convEvent.timestamp),
                        data: {
                            user: {
                                message: convEventData.for.content.text,
                                img: convEventData.for.content.screenshot,
                            },
                            bot: {
                                message: JSON.stringify(convEventData.fullRespones.content),
                            },
                        },
                    });
                    continue;
                }

                if (convEvent.message === LogConversationActions.PRE_PROCESS_GENERATIONS) {
                    tempGroupData.push({
                        message: LogConversationActions.PRE_PROCESS_GENERATIONS,
                        timestamp: new Date(convEvent.timestamp),
                        data: {
                            message: convEventData.modifications.message,
                            generations: convEventData.modifications.generations,
                        },
                    });
                    continue;
                }

                if (convEvent.message === LogConversationActions.AI_RESPONSE_ADDED) {
                    tempGroupData.push({
                        message: LogConversationActions.AI_RESPONSE_ADDED,
                        timestamp: new Date(convEvent.timestamp),
                        data: {
                            user: {
                                message: convEventData.userMessage.content.text,
                                img: convEventData.userMessage.content.screenshot,
                            },
                            bot: {
                                message: convEventData.botMessage.content.text,
                                generations: convEventData.botMessage.content.text.generations,
                            },
                            conversationMessages: convEventData.conversation.messages,
                        },
                    });
                    continue;
                }

                if (convEvent.message === LogConversationActions.GENERATION_APPLIED) {
                    tempGroupData.push({
                        message: LogConversationActions.GENERATION_APPLIED,
                        timestamp: new Date(convEvent.timestamp),
                        data: {
                            generation: convEventData.generation,
                        },
                    });
                    continue;
                }

                tempGroupData.push({
                    message: LogConversationActions.UNHANDLED,
                    timestamp: new Date(convEvent.timestamp),
                    data: {
                        message: convEventData.message,
                    },
                });
            }
            prettyLogs.push({ conversationId, data: tempGroupData });
        }
        return prettyLogs;
    }, [data]);

    const displayAccordionItemContent = (event: ConversationEvent) => {
        switch (event.message) {
            case LogConversationActions.AI_RESPONSE:
                return (
                    <div className='flex flex-col gap-4'>
                        <div className='font-semibold'>User</div>
                        <div>{event.data.user.message}</div>
                        <div className='font-semibold'>Bot</div>
                        <div>{event.data.bot.message}</div>
                    </div>
                );
            case LogConversationActions.PRE_PROCESS_GENERATIONS:
                return (
                    <div>
                        <div className='font-semibold'>Modifications</div>
                        {event.data.generations.map((gen, i) => (
                            <div key={i} className='flex flex-col gap-2'>
                                <div>CSS: {gen.css}</div>
                                <div>JS: {gen.js}</div>
                                <div>Message: {gen.message}</div>
                                <div>Reasoning: {gen.reasoning}</div>
                            </div>
                        ))}
                    </div>
                );
            case LogConversationActions.AI_RESPONSE_ADDED:
                return (
                    <div className='flex flex-col gap-4'>
                        <div className='font-semibold'>User</div>
                        <img src={event.data.user.img} alt='User Screenshot' className='max-w-xs' />
                        <div>{event.data.user.message}</div>
                        <div className='font-semibold'>Bot</div>
                        <div>{event.data.bot.message}</div>
                        {/* Displaying generations if present */}
                        {event.data.bot.generations &&
                            event.data.bot.generations.map((gen, i) => (
                                <div key={i} className='flex flex-col gap-2'>
                                    <div>CSS: {gen.css}</div>
                                    <div>JS: {gen.js}</div>
                                    <div>Message: {gen.message}</div>
                                    <div>Reasoning: {gen.reasoning}</div>
                                </div>
                            ))}
                    </div>
                );
            case LogConversationActions.GENERATION_APPLIED:
                return (
                    <div>
                        <div className='font-semibold'>Generation Applied</div>
                        <div>CSS: {event.data.generation.css}</div>
                        <div>JS: {event.data.generation.js}</div>
                        <div>Message: {event.data.generation.message}</div>
                        <div>Reasoning: {event.data.generation.reasoning}</div>
                    </div>
                );
            default:
                // For unhandled or generic events, simply displaying the timestamp
                return (
                    <div className='flex flex-col gap-4'>
                        <div>{event.data.message}</div>
                    </div>
                );
        }
    };

    return (
        <>
            {prettyLogs.map((log, index) => (
                <Accordion key={index} selectionMode='multiple' variant='bordered'>
                    {log.data.map((d, i: number) => (
                        <AccordionItem key={i} title={d.message}>
                            {displayAccordionItemContent(d)}
                        </AccordionItem>
                    ))}
                </Accordion>
            ))}
        </>
    );
};

export default PrettyLog;

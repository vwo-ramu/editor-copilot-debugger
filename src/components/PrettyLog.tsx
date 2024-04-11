import { useMemo } from 'react';

import { Icon } from '@iconify/react';

import {
    ConversationBotMessage,
    ConversationEvent,
    ConversationGeneration,
    ConversationUserMessage,
    LogConversationActions,
    LogData,
} from '../types';

import { Editor } from '@monaco-editor/react';

import { Accordion, AccordionItem } from '@nextui-org/accordion';
import { Chip } from '@nextui-org/chip';
import { Card, CardBody } from '@nextui-org/card';
import { Divider } from '@nextui-org/divider';
import { ScrollShadow } from '@nextui-org/scroll-shadow';
import { Tabs, Tab } from '@nextui-org/tabs';
import { Avatar } from '@nextui-org/avatar';
import { Button } from '@nextui-org/button';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from '@nextui-org/modal';

const GenerationView = ({ title, gen }: { title: string; gen: ConversationGeneration }) => (
    <Card>
        <CardBody className='flex flex-col gap-2'>
            <div className='font-semibold text-primary'>{title}</div>
            <div className='text-sm'>Message: {gen.message}</div>
            <div className='text-sm italic'>Resoning: {gen.reasoning}</div>
            <Tabs aria-label='Generation Details'>
                {gen.js && (
                    <Tab key='js' title='JS'>
                        <Editor
                            className='rounded-editor'
                            theme='vs-dark'
                            height='150px'
                            defaultLanguage='javascript'
                            defaultValue={gen.js}
                            options={{ readOnly: true, minimap: { enabled: false } }}
                        />
                    </Tab>
                )}

                {gen.css && (
                    <Tab key='css' title='CSS'>
                        <Editor
                            className='rounded-editor'
                            theme='vs-dark'
                            height='150px'
                            defaultLanguage='css'
                            defaultValue={gen.css}
                            options={{ readOnly: true, minimap: { enabled: false } }}
                        />
                    </Tab>
                )}
            </Tabs>
        </CardBody>
    </Card>
);

// ui for to and from message with bubble layout
const MessageBubbleView = ({ msg }: { msg: ConversationUserMessage | ConversationBotMessage }) => {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const displayMessageView = (msg: ConversationUserMessage | ConversationBotMessage) => {
        if (msg.role === 'user') {
            return (
                <div className='flex gap-2 text-sm items-center'>
                    <Avatar className='flex-shrink-0' name='User' />
                    <div className='flex-grow bg-primary-100 p-4 rounded-medium'>{msg.message}</div>
                    <Button isIconOnly color='primary' variant='ghost' aria-label='Like' onPress={onOpen}>
                        <Icon icon='lucide:image' />
                    </Button>
                </div>
            );
        } else {
            return (
                <div className='flex gap-2 text-sm'>
                    <Avatar className='flex-shrink-0' name='Bot' />
                    <div className='flex flex-col flex-grow border-2 border-zinc-800 p-4 rounded-medium gap-4'>
                        <div>{msg.message}</div>
                        {msg.generations &&
                            msg.generations.map((gen, i) => (
                                <GenerationView key={i} title={`Generation ${i + 1}`} gen={gen} />
                            ))}
                    </div>
                </div>
            );
        }
    };
    return (
        <>
            {displayMessageView(msg)}
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {() => (
                        <>
                            <ModalHeader className='flex flex-col gap-1'>Attached Image</ModalHeader>
                            <ModalBody>
                                {msg.role === 'user' &&
                                    (msg.img ? <img src={msg.img} alt='User Screenshot' /> : 'No image')}
                            </ModalBody>
                            <ModalFooter></ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
};

const PrettyLog = ({ data }: { data: LogData }) => {
    // expensive transformation of data to pretty log
    const prettyLogs = useMemo(() => {
        console.log('PrettyLog :: expensive transformation of data to pretty log', data);

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
                                message: JSON.stringify(convEventData.fullRespones.content, null, 2),
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
                                role: 'user',
                                message: convEventData.userMessage.content.text,
                                img: convEventData.userMessage.content.screenshot,
                            },
                            bot: {
                                role: 'bot',
                                message: convEventData.botMessage.content.text,
                                generations: convEventData.botMessage.content.generations,
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
        console.log('PrettyLog :: prettyLogs', prettyLogs);
        return prettyLogs;
    }, [data]);

    const displayAccordionItemContent = (event: ConversationEvent) => {
        switch (event.message) {
            case LogConversationActions.AI_RESPONSE:
                return (
                    <div className='text-sm flex flex-col gap-4'>
                        <div className='font-semibold'>User</div>
                        <ScrollShadow className='w-full max-h-80'>{event.data.user.message}</ScrollShadow>
                        <Divider />
                        <div className='font-semibold'>Bot</div>
                        <ScrollShadow className='w-full max-h-80'>
                            <pre>{event.data.bot.message}</pre>
                        </ScrollShadow>
                    </div>
                );
            case LogConversationActions.PRE_PROCESS_GENERATIONS:
                return (
                    <div className='flex flex-col gap-4'>
                        {event.data.generations.map((gen, i) => (
                            <GenerationView key={i} title={`Generation ${i + 1}`} gen={gen} />
                        ))}
                    </div>
                );
            case LogConversationActions.AI_RESPONSE_ADDED:
                return (
                    <div className='flex flex-col gap-4'>
                        <MessageBubbleView msg={event.data.user} />
                        <MessageBubbleView msg={event.data.bot} />
                        <Button
                            color='primary'
                            variant='ghost'
                            onClick={() => console.log(event.data.conversationMessages)}>
                            Console log messages till now
                        </Button>
                    </div>
                );
            case LogConversationActions.GENERATION_APPLIED:
                return <GenerationView title='Currently applied generation' gen={event.data.generation} />;
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
        <div className='flex flex-col gap-8'>
            {prettyLogs.map((log, index) => (
                <div className='flex flex-col gap-4' key={index}>
                    <Chip color='secondary' variant='bordered'>
                        Conversation ID: {log.conversationId}
                    </Chip>
                    <Accordion selectionMode='multiple' variant='bordered'>
                        {log.data.map((d, i: number) => (
                            <AccordionItem
                                key={i}
                                title={d.message}
                                subtitle={new Intl.DateTimeFormat('en-IN', {
                                    day: '2-digit',
                                    month: 'long',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit',
                                    hour12: true,
                                }).format(new Date(d.timestamp))}>
                                {displayAccordionItemContent(d)}
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            ))}
        </div>
    );
};

export default PrettyLog;

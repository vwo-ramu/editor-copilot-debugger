import { Input } from '@nextui-org/input';
import { Divider } from '@nextui-org/divider';
import { Snippet } from '@nextui-org/snippet';

import { LogData } from '../types';

// present the logs are quick preview with important information to glance
const PreviewLog = ({ data }: { data: LogData }) => {
    return (
        <div className='flex flex-col gap-4'>
            <Divider />

            <div className='text-lg font-semibold'>Preview Log</div>

            <div className='flex justify-between gap-2'>
                <Input
                    isReadOnly
                    type='text'
                    label='Campaign ID'
                    variant='bordered'
                    className='max-w-xs'
                    value={data.campaignId}
                />

                <Input
                    isReadOnly
                    type='text'
                    label='Variation ID'
                    variant='bordered'
                    className='max-w-xs'
                    value={data.variationId}
                />

                <Input
                    isReadOnly
                    type='text'
                    label='Conversation ID'
                    variant='bordered'
                    className='max-w-xs'
                    value={data.conversationId}
                />
            </div>

            <Snippet symbol='Page URL:' variant='bordered'>
                {data.pageURL}
            </Snippet>

            <Snippet symbol='Selector:' variant='bordered'>
                {data.selector}
            </Snippet>
        </div>
    );
};

export default PreviewLog;

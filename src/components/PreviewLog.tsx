import { Input } from '@nextui-org/input';
import { Divider } from '@nextui-org/divider';
import { Snippet } from '@nextui-org/snippet';

import { LogData } from '../types';

// present the logs are quick preview with important information to glance
const PreviewLog = ({ data }: { data: LogData }) => {
    const genericPreviewText = data.type === 'generic' ? JSON.stringify(data.data) : '';

    return (
        <div className='flex flex-col gap-4'>
            <Divider />

            <div className='text-lg font-semibold'>Log Overview</div>

            {data.type === 'editor-v1' && (
                <>
                    <div className='flex justify-between gap-2'>
                        <Input isReadOnly type='text' label='Campaign ID' variant='bordered' value={data.campaignId} />

                        <Input
                            isReadOnly
                            type='text'
                            label='Variation ID'
                            variant='bordered'
                            value={data.variationId}
                        />
                    </div>

                    <Snippet symbol='Page URL:' variant='bordered'>
                        {data.pageURL}
                    </Snippet>

                    <Snippet symbol='Selector:' variant='bordered'>
                        {data.selector}
                    </Snippet>
                </>
            )}

            {data.type === 'editor-v2' && (
                <>
                    <div className='flex justify-between gap-2'>
                        <Input isReadOnly type='text' label='Account ID' variant='bordered' value={data.accountId} />

                        <Input isReadOnly type='text' label='User ID' variant='bordered' value={data.userId} />
                    </div>
                </>
            )}

            {data.type === 'generic' && (
                <>
                    <Snippet symbol='Data:' variant='bordered'>
                        <span>{genericPreviewText.slice(0, 50)}{genericPreviewText.length > 50 && '...'}</span>
                    </Snippet>
                </>
            )}
        </div>
    );
};

export default PreviewLog;

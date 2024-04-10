import { Icon } from '@iconify/react';
import { Button } from '@nextui-org/button';

const EmptyLog = ({ navigateToUpload }: { navigateToUpload: () => void }) => {
    return (
        <div className='flex flex-col gap-4 items-center p-16'>
            <Icon icon='lucide:package-open' height={64} width={64} />
            <h2 className='text-2xl'>No Logs</h2>
            <p className='text-md text-gray-500 text-center'>You might not have provided a valid log file/ is empty</p>
            <Button color='primary' onClick={() => navigateToUpload()}>
                Upload Log
            </Button>
        </div>
    );
};

export default EmptyLog;

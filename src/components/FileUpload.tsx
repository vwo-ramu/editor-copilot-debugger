/**
 * Create a file upload component
 *
 * - should accept csv files
 * - should support drag and drop
 * - should accept only one file at a time
 * - should display the file name
 * - after file upload extract csv content, show error message if issues with csv parsing
 *
 */

import { ChangeEvent, DragEvent, useCallback, useState } from 'react';
import Papa from 'papaparse';
import { LogData } from '../types';

export const FileUpload = ({updateLogData}: {updateLogData: (data: LogData)=>void}) => {
    const [dragging, setDragging] = useState(false);
    const [fileName, setFileName] = useState('');
    const [error, setError] = useState('');

    const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
        if (!e) return;
        e.preventDefault();
        setDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragging(false);
    }, []);

    const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragging(false);
        processFile(e.dataTransfer.files[0]);
    }, []);

    const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        processFile(e.target.files[0]);
    }, []);

    const transformData = (d: any): LogData => {
        const data = d[0];
        // transform data to logdata
        return {
            campaignId: data['Campaign ID'],
            variationId: data.variationId,
            selector: data['ElementOverWhichAIEditorWasOpen'],
            conversationId: data.conversationId,
            pageURL: data.pageURL,
            conversationLog: JSON.parse(data.conversationLog),
        };
    }

    const processFile = (file: File) => {
        if (file.type !== 'text/csv') {
            setError('Please upload a CSV file.');
            return;
        }

        setError('');
        setFileName(file.name);

        Papa.parse(file, {
            complete: (result) => {
                console.log(result.data);
                try {
                    // Handle the parsed data here
                    updateLogData(transformData(result.data));
                } catch (err: any) {
                    setError(`Transforming error :: ${err.message}`);
                }
            },
            error: (err) => {
                setError(`Parsing error :: ${err.message}`);
            },
            header: true,
        });
    };

    return (
        <div
            className={`flex flex-col gap-4 items-center p-4 border-2 ${
                dragging ? 'border-success-200 bg-success-800' : 'border-default-600'
            } border-dashed rounded-small`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}>
            <label htmlFor='file-upload' className='cursor-pointer'>
                <input type='file' id='file-upload' className='hidden' onChange={handleChange} accept='.csv' />
                <span className='text-primary'>Upload a file</span>
            </label>
            <p className='text-sm text-gray-500'>or drag and drop a file here</p>
            {fileName && <p className='text-sm'><b>File uploaded:</b> {fileName}</p>}
            {error && <p className='text-sm text-danger'>{error}</p>}
        </div>
    );
};

export default FileUpload;

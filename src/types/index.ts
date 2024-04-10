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
            timestamp: number;
            data: any;
        }[];
    };
}

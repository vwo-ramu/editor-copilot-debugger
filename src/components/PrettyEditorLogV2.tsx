import { Chip } from "@nextui-org/chip";
import { Card, CardBody } from "@nextui-org/card";
import { EditorLogV2Data } from "../types";

interface PrettyEditorLogV2Props {
    data: EditorLogV2Data;
}

const PrettyEditorLogV2 = ({data}: PrettyEditorLogV2Props) => {
    const displayFields = {
        "Account ID": data.accountId,
        "User ID": data.userId,
        "User Email": data.userEmail,
        "Campaign ID": data.campaignId,
        "Variation ID": data.variationId,
        "Element Info": data.selector,
        "Target URL": data.targetUrl,
        "Timestamp": data.timestamp
    };

    return (
        <div className="flex flex-col gap-4">
            <Chip size="sm">Editor Log V2</Chip>
            {/* Basic Information */}
            {Object.entries(displayFields).map(([key, value]) => (
                <Card key={key} shadow="sm">
                    <CardBody className="p-4">
                        <div className="flex justify-between items-center">
                            <div className="font-medium">{key}</div>
                            <div className="text-default-500">{value}</div>
                        </div>
                    </CardBody>
                </Card>
            ))}
            
            {/* Conversation History */}
            <Card shadow="sm">
                <CardBody className="p-4">
                    <div className="flex flex-col gap-2">
                        <div className="font-medium">Conversation History</div>
                        <pre className="text-sm text-default-500 whitespace-pre-wrap">
                            {JSON.stringify(data.conversationHistory, null, 2)}
                        </pre>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}

export default PrettyEditorLogV2;

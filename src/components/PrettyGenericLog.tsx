import { Card, CardBody } from "@nextui-org/card";
import { Chip } from "@nextui-org/chip";
import { GenericLogData } from "../types";

interface PrettyGenericLogProps {
    data: GenericLogData;
}

const PrettyGenericLog = ({data}: PrettyGenericLogProps) => {
    return (
        <div className="flex flex-col gap-2">
            <Chip size="sm">Generic Logs</Chip>
            {Object.entries(data.data).map(([key, value]) => (
                <Card key={key} shadow="sm">
                    <CardBody className="flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                            <div className="font-medium">{key}</div>
                            <div className="text-default-500">{value}</div>
                        </div>
                    </CardBody>
                </Card>
            ))}
        </div>
    );
}

export default PrettyGenericLog;

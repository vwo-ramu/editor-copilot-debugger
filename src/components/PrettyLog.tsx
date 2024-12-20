import { LogData } from "../types";
import PrettyEditorLog from "./PrettyEditorLog";
import PrettyEditorLogV2 from "./PrettyEditorLogV2";
import PrettyGenericLog from "./PrettyGenericLog";

interface PrettyLogProps {
    data: LogData;
}

const PrettyLog = ({data}: PrettyLogProps) => {
    switch (data.type) {
        case 'editor-v1':
            return <PrettyEditorLog data={data} />;
        case 'editor-v2':
            return <PrettyEditorLogV2 data={data} />;
        case 'generic':
            return <PrettyGenericLog data={data} />;
        default:
            return <div>Unsupported log format</div>;
    }

}

export default PrettyLog;

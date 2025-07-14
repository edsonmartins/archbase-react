import React from 'react';
export interface Attachment {
    name: string;
    type: string;
    size: number;
    content: string;
}
export interface ArchbaseFileAttachmentProps {
    attachments: Attachment[];
    accept?: string[];
    acceptDescription?: string;
    onAttachmentAdd: (newAttachment: Attachment) => void;
    onAttachmentRemove: (removedAttachment: Attachment) => void;
    height?: number | string;
    width?: number | string;
}
export declare const ArchbaseFileAttachment: React.FC<ArchbaseFileAttachmentProps>;
//# sourceMappingURL=ArchbaseFileAttachment.d.ts.map
import React, { useState, useEffect } from 'react'
import { Group, Image, Button, Stack, Text, Box, rem, Paper, Tooltip, ActionIcon } from '@mantine/core'
import { Dropzone, MIME_TYPES, DropzoneProps } from '@mantine/dropzone'
import {
  IconUpload,
  IconPhoto,
  IconX,
  IconFile,
  IconFileText,
  IconFileSpreadsheet,
  IconTrash
} from '@tabler/icons-react'
import { useMantineTheme } from '@mantine/core'
import { t } from 'i18next'
import { useArchbaseTheme } from '@components/hooks'

export interface Attachment {
  name: string
  type: string
  size: number
  content: string // base64
}

export interface ArchbaseFileAttachmentProps {
  attachments: Attachment[]
  onAttachmentAdd: (newAttachment: Attachment) => void
  onAttachmentRemove: (removedAttachment: Attachment) => void
  height?: number | string
  width?: number | string
}

const formatFileSize = (size: number) => {
  if (size < 1024) {
    return `${size} bytes`
  } else if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(2)} KB`
  } else {
    return `${(size / (1024 * 1024)).toFixed(2)} MB`
  }
}

const getFileIcon = (type: string) => {
  if (type === 'application/pdf') {
    return <IconFileText size={48} style={{ color: 'red' }} />
  } else if (
    type === 'application/msword' ||
    type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    return <IconFileText size={48} style={{ color: 'blue' }} />
  } else if (
    type === 'application/vnd.ms-excel' ||
    type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ) {
    return <IconFileSpreadsheet size={48} style={{ color: 'green' }} />
  } else {
    return <IconFile size={48} />
  }
}

export const ArchbaseFileAttachment: React.FC<ArchbaseFileAttachmentProps> = ({
  attachments,
  onAttachmentAdd,
  onAttachmentRemove,
  height = 'auto',
  width = '100%'
}) => {
  const [selectedAttachmentIndex, setSelectedAttachmentIndex] = useState<number | null>(null)
  const theme = useArchbaseTheme()

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (selectedAttachmentIndex !== null) {
        if (event.key === 'ArrowRight') {
          setSelectedAttachmentIndex((prevIndex) =>
            prevIndex !== null && prevIndex < attachments.length - 1 ? prevIndex + 1 : prevIndex
          )
        } else if (event.key === 'ArrowLeft') {
          setSelectedAttachmentIndex((prevIndex) =>
            prevIndex !== null && prevIndex > 0 ? prevIndex - 1 : prevIndex
          )
        } else if (event.key === 'Delete') {
          removeFile(attachments[selectedAttachmentIndex])
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedAttachmentIndex, attachments])

  const handleDrop = (acceptedFiles: File[]) => {
    const filesWithPreviews = acceptedFiles.map((file) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      return new Promise<Attachment>((resolve) => {
        reader.onload = () => {
          resolve({
            name: file.name,
            type: file.type,
            size: file.size,
            content: reader.result as string
          })
        }
      })
    })

    Promise.all(filesWithPreviews).then((newAttachments) => {
      newAttachments.forEach((attachment) => onAttachmentAdd(attachment))
      if (selectedAttachmentIndex === null && newAttachments.length > 0) {
        setSelectedAttachmentIndex(0)
      }
    })
  }

  const removeFile = (file: Attachment) => {
    onAttachmentRemove(file)
    if (attachments.length === 0) {
      setSelectedAttachmentIndex(null)
    } else if (selectedAttachmentIndex !== null && selectedAttachmentIndex >= attachments.length) {
      setSelectedAttachmentIndex(attachments.length - 1)
    }
  }

  const selectFile = (index: number) => {
    setSelectedAttachmentIndex(index)
  }

  return (
    <Stack>
      <Paper withBorder style={{ border: `2px dashed ${theme.colors.gray[5]}`, padding: '20px' }}>
        <Dropzone
          onDrop={handleDrop}
          accept={[
            MIME_TYPES.jpeg,
            MIME_TYPES.png,
            MIME_TYPES.pdf,
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          ]}
          multiple
        >
          <Group gap="xl" style={{ minHeight: 60, pointerEvents: 'none' }}>
            <Dropzone.Accept>
              <IconUpload
                style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-blue-6)' }}
                stroke={1.5}
              />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <IconX
                style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-red-6)' }}
                stroke={1.5}
              />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <IconPhoto
                style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-dimmed)' }}
                stroke={1.5}
              />
            </Dropzone.Idle>

            <div>
              <Text size="xl" inline>
                Arraste os arquivos aqui ou clique para selecionar
              </Text>
              <Text size="sm" color="dimmed" inline mt={7}>
                Anexe arquivos de imagem, PDFs, DOC, DOCX, XLS ou XLSX
              </Text>
            </div>
          </Group>
        </Dropzone>
      </Paper>
      <Box style={{ height, width, overflowY: 'auto' }}>
        <Group>
          {attachments.map((attachment, index) => (
            <Box
              key={index}
              style={{
                position: 'relative',
                border:
                  selectedAttachmentIndex === index ? `2px solid ${theme.colors.blue[5]}` : 'none',
                borderRadius: theme.radius.sm,
                padding: '4px',
                cursor: 'pointer'
              }}
              onClick={() => selectFile(index)}
            >
              {attachment.type.startsWith('image/') ? (
                <Image
                  src={attachment.content}
                  height={100}
                  width={100}
                  style={{
                    border: `1px solid ${theme.colors.gray[4]}`,
                    borderRadius: theme.radius.sm,
                    objectFit: 'cover'
                  }}
                />
              ) : (
                <Box
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 100,
                    width: 100,
                    border: `1px solid ${theme.colors.gray[4]}`,
                    borderRadius: theme.radius.sm,
                    backgroundColor: theme.colors.gray[0]
                  }}
                >
                  {getFileIcon(attachment.type)}
                </Box>
              )}
              <Text size="xs" color="dimmed">
                {attachment.name}
              </Text>
              <Text size="xs" color="dimmed">
                {formatFileSize(attachment.size)}
              </Text>
              <Tooltip withinPortal withArrow label={t('archbase:Remover')}>
                <ActionIcon
                  color="red"
                  style={{
                    cursor: 'pointer', position: 'absolute', top: 0, right: 0
                  }}
                  onClick={(e) => {
                    e.stopPropagation()
                    removeFile(attachment)
                  }}
                >
                  <IconTrash
                    size="1.2rem"
                    color={"white"}
                  />
                </ActionIcon>
              </Tooltip>
            </Box>
          ))}
        </Group>
      </Box>
    </Stack>
  )
}

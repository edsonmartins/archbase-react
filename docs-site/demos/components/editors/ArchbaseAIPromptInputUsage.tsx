import React, { useState } from 'react';
import { Stack, Card, Text, Paper } from '@mantine/core';
import { ArchbaseAIPromptInput } from '@archbase/components';

export function ArchbaseAIPromptInputUsage() {
  const [messages, setMessages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (prompt: string) => {
    setMessages((prev) => [...prev, `Você: ${prompt}`]);
    setIsLoading(true);

    // Simula resposta da IA
    setTimeout(() => {
      setMessages((prev) => [...prev, `IA: Resposta para "${prompt}"`]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <Stack gap="md" p="md">
      <Card withBorder p="md">
        <Text fw={500} mb="md">Chat com IA</Text>

        <Paper withBorder p="md" mb="md" mih={150} bg="gray.0">
          {messages.length === 0 ? (
            <Text c="dimmed" size="sm">Nenhuma mensagem ainda...</Text>
          ) : (
            <Stack gap="xs">
              {messages.map((msg, i) => (
                <Text key={i} size="sm">{msg}</Text>
              ))}
            </Stack>
          )}
        </Paper>

        <ArchbaseAIPromptInput
          placeholder="Digite sua pergunta..."
          onSubmit={handleSubmit}
          loading={isLoading}
          suggestions={[
            { id: '1', text: 'Explique o conceito de...' },
            { id: '2', text: 'Como faço para...' },
            { id: '3', text: 'Qual a diferença entre...' },
            { id: '4', text: 'Resuma o seguinte texto...' },
          ]}
          enableHistory
          history={messages}
        />
      </Card>

      <Card withBorder p="md">
        <Text fw={500} mb="md">Modo compacto</Text>
        <ArchbaseAIPromptInput
          placeholder="Pergunte algo..."
          onSubmit={(p) => console.log('Prompt:', p)}
          size="sm"
          enableVoice
        />
      </Card>
    </Stack>
  );
}

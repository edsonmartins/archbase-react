import React from 'react';
import { Stack } from '@mantine/core';
import { ArchbaseCodeViewer } from '@archbase/components';

const exampleCode = `import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(c => c + 1)}>
      Contagem: {count}
    </button>
  );
}`;

export function ArchbaseCodeViewerUsage() {
  return (
    <Stack gap="md" p="md">
      <ArchbaseCodeViewer
        code={exampleCode}
        language="tsx"
        showLineNumbers
        showCopyButton
      />
    </Stack>
  );
}

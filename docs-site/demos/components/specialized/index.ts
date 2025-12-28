import type { MantineDemo } from '@mantinex/demo';
import { ArchbaseSpreadsheetImportUsage } from './ArchbaseSpreadsheetImportUsage';

const usageCode = `
import { ArchbaseSpreadsheetImport } from '@archbase/components';
import type { SpreadsheetField } from '@archbase/components';

function Demo() {
  const [isOpen, setIsOpen] = useState(false);

  const fields: SpreadsheetField[] = [
    {
      key: 'nome',
      label: 'Nome',
      required: true,
      fieldType: 'text',
    },
    {
      key: 'idade',
      label: 'Idade',
      required: true,
      fieldType: 'number',
    },
    {
      key: 'email',
      label: 'Email',
      required: true,
      fieldType: 'email',
    },
  ];

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Importar Planilha</Button>

      <ArchbaseSpreadsheetImport
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        fields={fields}
        onDataLoaded={(data) => console.log('Dados importados:', data)}
      />
    </>
  );
}
`;

export const usage: MantineDemo = {
  type: 'code',
  component: ArchbaseSpreadsheetImportUsage,
  code: usageCode,
};

import { ArchbaseDataSourceV2 } from '../src/datasource/v2/ArchbaseDataSourceV2';
import { DataSourceEventNames } from '../src/datasource/ArchbaseDataSource';
import { createTestData, Pessoa } from './test-data';
import { vi } from 'vitest';

describe('ArchbaseDataSourceV2 (New Implementation)', () => {
  let dataSource: ArchbaseDataSourceV2<Pessoa>;
  let testData: Pessoa[];

  beforeEach(() => {
    testData = createTestData.pessoaList(3);
    dataSource = new ArchbaseDataSourceV2({
      name: 'test-datasource',
      records: testData
    });
  });

  afterEach(() => {
    dataSource.close();
  });

  describe('Basic Operations', () => {
    test('should initialize correctly', () => {
      expect(dataSource.getName()).toBe('test-datasource');
      expect(dataSource.getTotalRecords()).toBe(3);
      expect(dataSource.getCurrentIndex()).toBe(0);
      expect(dataSource.getCurrentRecord()).toEqual(testData[0]);
      expect(dataSource.isBrowsing()).toBe(true);
    });

    test('should handle empty initialization', () => {
      const emptyDS = new ArchbaseDataSourceV2<Pessoa>({
        name: 'empty'
      });
      
      expect(emptyDS.isEmpty()).toBe(true);
      expect(emptyDS.getCurrentIndex()).toBe(-1);
      expect(emptyDS.getCurrentRecord()).toBeUndefined();
    });
  });

  describe('Navigation', () => {
    test('should navigate between records', () => {
      // First record
      expect(dataSource.isFirst()).toBe(true);
      expect(dataSource.getCurrentRecord()!.id).toBe(1);
      
      // Next
      dataSource.next();
      expect(dataSource.getCurrentIndex()).toBe(1);
      expect(dataSource.getCurrentRecord()!.id).toBe(2);
      
      // Last
      dataSource.last();
      expect(dataSource.isLast()).toBe(true);
      expect(dataSource.getCurrentRecord()!.id).toBe(3);
      
      // Prior
      dataSource.prior();
      expect(dataSource.getCurrentIndex()).toBe(1);
      
      // First
      dataSource.first();
      expect(dataSource.isFirst()).toBe(true);
    });

    test('should emit recordChanged on navigation', () => {
      const events: any[] = [];
      dataSource.addListener(event => events.push(event));
      
      dataSource.next();
      
      expect(events).toHaveLength(1);
      expect(events[0].type).toBe(DataSourceEventNames.recordChanged);
      expect(events[0].index).toBe(1);
    });
  });

  describe('Field Operations', () => {
    test('should update field value with immutability', () => {
      const originalRecord = dataSource.getCurrentRecord();
      const originalName = originalRecord!.nome;
      
      dataSource.setFieldValue('nome', 'Novo Nome');
      
      // Original should be unchanged
      expect(originalRecord!.nome).toBe(originalName);
      
      // Current should be updated
      expect(dataSource.getCurrentRecord()!.nome).toBe('Novo Nome');
      
      // Records should be different references
      expect(dataSource.getCurrentRecord()).not.toBe(originalRecord);
    });

    test('should handle nested fields', () => {
      dataSource.setFieldValue('endereco.cidade', 'Rio de Janeiro');
      
      expect(dataSource.getFieldValue('endereco.cidade')).toBe('Rio de Janeiro');
      expect(dataSource.getCurrentRecord()!.endereco.cidade).toBe('Rio de Janeiro');
    });

    test('should emit events on field change', () => {
      const events: any[] = [];
      dataSource.addListener(event => events.push(event));
      
      dataSource.setFieldValue('nome', 'Test');
      
      // Should emit fieldChanged and dataChanged
      expect(events).toHaveLength(2);
      expect(events[0].type).toBe(DataSourceEventNames.fieldChanged);
      expect(events[0].fieldName).toBe('nome');
      expect(events[0].newValue).toBe('Test');
      expect(events[1].type).toBe(DataSourceEventNames.dataChanged);
    });
  });

  describe('CRUD Operations', () => {
    test('should insert new record', () => {
      const newPessoa: Pessoa = {
        id: 999,
        nome: 'Nova Pessoa',
        email: 'nova@test.com',
        idade: 25,
        ativo: true,
        dataNascimento: new Date(),
        endereco: {
          rua: 'Rua Nova',
          cidade: 'São Paulo',
          cep: '00000-000'
        },
        contatos: []
      };
      
      dataSource.insert(newPessoa);
      
      expect(dataSource.getTotalRecords()).toBe(4);
      expect(dataSource.getCurrentRecord()).toEqual(newPessoa);
      expect(dataSource.isInserting()).toBe(true);
      expect(dataSource.getCurrentIndex()).toBe(3);
    });

    test('should remove current record', async () => {
      const secondRecord = testData[1];
      dataSource.next(); // Go to second record
      
      const removed = await dataSource.remove();
      
      expect(removed).toEqual(secondRecord);
      expect(dataSource.getTotalRecords()).toBe(2);
      expect(dataSource.getCurrentRecord()!.id).toBe(3); // Should be on third record now
    });

    test('should handle edit/save', async () => {
      dataSource.edit();
      expect(dataSource.isEditing()).toBe(true);
      
      dataSource.setFieldValue('nome', 'Editado');
      
      const saved = await dataSource.save();
      
      expect(saved!.nome).toBe('Editado');
      expect(dataSource.isBrowsing()).toBe(true);
    });

    test('should handle edit/cancel', () => {
      const originalName = dataSource.getCurrentRecord()!.nome;
      
      dataSource.edit();
      dataSource.setFieldValue('nome', 'Temporário');
      
      expect(dataSource.getCurrentRecord()!.nome).toBe('Temporário');
      
      dataSource.cancel();
      
      expect(dataSource.getCurrentRecord()!.nome).toBe(originalName);
      expect(dataSource.isBrowsing()).toBe(true);
    });

    test('should handle insert/cancel', () => {
      const originalCount = dataSource.getTotalRecords();
      
      dataSource.insert({ nome: 'Temp' } as Pessoa);
      expect(dataSource.getTotalRecords()).toBe(originalCount + 1);
      
      dataSource.cancel();
      
      expect(dataSource.getTotalRecords()).toBe(originalCount);
      expect(dataSource.isBrowsing()).toBe(true);
    });
  });

  describe('Array Field Operations', () => {
    test('should append to array field', () => {
      const originalContatos = dataSource.getFieldValue('contatos');
      const originalLength = originalContatos.length;
      
      const novoContato = {
        tipo: 'TELEFONE' as const,
        valor: '123456789',
        principal: false
      };
      
      dataSource.appendToFieldArray('contatos', novoContato);
      
      const newContatos = dataSource.getFieldValue('contatos');
      expect(newContatos).toHaveLength(originalLength + 1);
      expect(newContatos[newContatos.length - 1]).toEqual(novoContato);
      
      // Original should be unchanged
      expect(originalContatos).toHaveLength(originalLength);
    });

    test('should update array item', () => {
      dataSource.updateFieldArrayItem('contatos', 0, draft => {
        draft.valor = 'updated@email.com';
      });
      
      const contatos = dataSource.getFieldValue('contatos');
      expect(contatos[0].valor).toBe('updated@email.com');
    });

    test('should remove array item', () => {
      const originalLength = dataSource.getFieldValue('contatos').length;
      
      dataSource.removeFromFieldArray('contatos', 0);
      
      const contatos = dataSource.getFieldValue('contatos');
      expect(contatos).toHaveLength(originalLength - 1);
    });
  });

  describe('Events and Callbacks', () => {
    test('should call onStateChange callback', () => {
      const onStateChange = vi.fn();
      
      const ds = new ArchbaseDataSourceV2({
        name: 'test',
        records: testData,
        onStateChange
      });
      
      ds.setFieldValue('nome', 'Test');
      
      expect(onStateChange).toHaveBeenCalledTimes(1);
      expect(onStateChange).toHaveBeenCalledWith(
        expect.any(Array), // prevRecords
        expect.any(Array)  // newRecords
      );
    });

    test('should maintain listener management', () => {
      const listener1 = vi.fn();
      const listener2 = vi.fn();
      
      dataSource.addListener(listener1);
      dataSource.addListener(listener2);
      
      dataSource.setFieldValue('nome', 'Test');
      
      expect(listener1).toHaveBeenCalled();
      expect(listener2).toHaveBeenCalled();
      
      dataSource.removeListener(listener1);
      dataSource.setFieldValue('nome', 'Test2');
      
      expect(listener1).toHaveBeenCalledTimes(2); // Não deve ser chamado novamente
      expect(listener2).toHaveBeenCalledTimes(4); // Deve ser chamado novamente
    });
  });

  describe('Debug Features', () => {
    test('should provide debug snapshot', () => {
      const snapshot = dataSource.getDebugSnapshot();
      
      expect(snapshot).toEqual({
        name: 'test-datasource',
        recordCount: 3,
        currentIndex: 0,
        currentRecord: testData[0],
        state: 'browse',
        listeners: 0
      });
    });
  });

  describe('Immutability Validation', () => {
    test('should never mutate original data', () => {
      // Store original values (not using JSON due to Date serialization)
      const originalFirstNome = testData[0].nome;
      const originalFirstCidade = testData[0].endereco.cidade;
      const originalFirstContatosLength = testData[0].contatos.length;
      const originalSecondIdade = testData[1].idade;
      
      // Multiple operations
      dataSource.setFieldValue('nome', 'Changed');
      dataSource.setFieldValue('endereco.cidade', 'Changed City');
      dataSource.appendToFieldArray('contatos', { 
        tipo: 'EMAIL' as const, 
        valor: 'new@test.com',
        principal: false 
      });
      
      dataSource.next();
      dataSource.setFieldValue('idade', 99);
      
      // Original test data should be completely unchanged
      expect(testData[0].nome).toBe(originalFirstNome);
      expect(testData[0].endereco.cidade).toBe(originalFirstCidade);
      expect(testData[0].contatos).toHaveLength(originalFirstContatosLength);
      expect(testData[1].idade).toBe(originalSecondIdade);
    });
  });
});
/**
 * ApiTokenModal V1 Baseline Tests
 * 
 * Estes testes capturam o comportamento EXATO da versão V1 atual.
 * TODOS os testes devem passar após migração V1/V2.
 * 
 * ⚠️ CRITICAL: Se qualquer teste falhar após migração, 
 *    a migração deve ser REVERTIDA imediatamente.
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ApiTokenModal } from '../src/ApiTokenModal';
import { ArchbaseDataSource } from '@archbase/data';
import React from 'react';

// Mock dos serviços externos
jest.mock('@archbase/data', () => ({
  ArchbaseDataSource: jest.requireActual('@archbase/data').ArchbaseDataSource,
  ArchbaseRemoteApiService: jest.fn().mockImplementation(() => ({
    findAll: jest.fn().mockResolvedValue({
      content: [
        { id: 1, name: 'user1@test.com', fullName: 'Usuario 1' },
        { id: 2, name: 'user2@test.com', fullName: 'Usuario 2' },
      ],
      totalElements: 2
    }),
    findOne: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  }))
}));

// Mock data para tokens
interface TokenData {
  id?: number;
  name: string;
  description: string;
  expirationDate: string;
  userId: number;
  scopes: string[];
  isActive: boolean;
}

const mockTokenData: TokenData[] = [
  {
    id: 1,
    name: 'API Token 1',
    description: 'Token para integração',
    expirationDate: '2024-12-31',
    userId: 1,
    scopes: ['read', 'write'],
    isActive: true
  },
  {
    id: 2,
    name: 'API Token 2',
    description: 'Token para relatórios',
    expirationDate: '2024-06-30',
    userId: 2,
    scopes: ['read'],
    isActive: false
  }
];

describe('ApiTokenModal V1 Baseline', () => {
  let user: ReturnType<typeof userEvent.setup>;
  let dataSource: ArchbaseDataSource<TokenData, number>;
  let mockApiService: any;

  beforeEach(() => {
    user = userEvent.setup();
    
    // Create mock API service
    mockApiService = {
      findAll: jest.fn().mockResolvedValue({
        content: [
          { id: 1, name: 'user1@test.com', fullName: 'Usuario 1' },
          { id: 2, name: 'user2@test.com', fullName: 'Usuario 2' },
        ],
        totalElements: 2
      }),
      findOne: jest.fn(),
      save: jest.fn().mockResolvedValue(mockTokenData[0]),
      remove: jest.fn(),
    };

    dataSource = new ArchbaseDataSource('tokenDataSource', {
      records: mockTokenData,
      grandTotalRecords: mockTokenData.length,
      currentPage: 0,
      totalPages: 1,
      pageSize: 10,
    });
    dataSource.open();
    dataSource.first();
  });

  afterEach(() => {
    dataSource.close();
    jest.clearAllMocks();
  });

  describe('🔍 Modal Basic Functionality', () => {
    test('should render modal when opened', () => {
      render(
        <ApiTokenModal
          opened={true}
          onClose={jest.fn()}
          dataSource={dataSource}
          userApiService={mockApiService}
        />
      );

      // Modal deve estar visível
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText(/token/i)).toBeInTheDocument();
    });

    test('should not render modal when closed', () => {
      render(
        <ApiTokenModal
          opened={false}
          onClose={jest.fn()}
          dataSource={dataSource}
          userApiService={mockApiService}
        />
      );

      // Modal não deve estar visível
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    test('should call onClose when close button clicked', async () => {
      const onClose = jest.fn();
      render(
        <ApiTokenModal
          opened={true}
          onClose={onClose}
          dataSource={dataSource}
          userApiService={mockApiService}
        />
      );

      // Procurar botão de fechar (X ou Cancel)
      const closeButton = screen.getByRole('button', { name: /fechar|close|cancel/i });
      await user.click(closeButton);

      expect(onClose).toHaveBeenCalled();
    });
  });

  describe('🔗 DataSource Integration (CRITICAL)', () => {
    test('should load data from dataSource on open', () => {
      render(
        <ApiTokenModal
          opened={true}
          onClose={jest.fn()}
          dataSource={dataSource}
          userApiService={mockApiService}
        />
      );

      // Deve mostrar dados do primeiro registro
      expect(screen.getByDisplayValue('API Token 1')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Token para integração')).toBeInTheDocument();
    });

    test('should update form when dataSource record changes', async () => {
      render(
        <ApiTokenModal
          opened={true}
          onClose={jest.fn()}
          dataSource={dataSource}
          userApiService={mockApiService}
        />
      );

      // Verificar primeiro registro
      expect(screen.getByDisplayValue('API Token 1')).toBeInTheDocument();

      // Navegar para próximo registro
      dataSource.next();

      await waitFor(() => {
        expect(screen.getByDisplayValue('API Token 2')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Token para relatórios')).toBeInTheDocument();
      });
    });

    test('should save data to dataSource when form submitted', async () => {
      const onSave = jest.fn();
      render(
        <ApiTokenModal
          opened={true}
          onClose={jest.fn()}
          onSave={onSave}
          dataSource={dataSource}
          userApiService={mockApiService}
        />
      );

      // Entrar em modo de edição
      dataSource.edit();

      // Modificar nome do token
      const nameInput = screen.getByDisplayValue('API Token 1');
      await user.clear(nameInput);
      await user.type(nameInput, 'Token Modificado');

      // Salvar
      const saveButton = screen.getByRole('button', { name: /salvar|save/i });
      await user.click(saveButton);

      expect(onSave).toHaveBeenCalled();
      expect(dataSource.getFieldValue('name')).toBe('Token Modificado');
    });

    test('should handle form validation errors', async () => {
      render(
        <ApiTokenModal
          opened={true}
          onClose={jest.fn()}
          dataSource={dataSource}
          userApiService={mockApiService}
        />
      );

      dataSource.edit();

      // Limpar campo obrigatório
      const nameInput = screen.getByDisplayValue('API Token 1');
      await user.clear(nameInput);

      // Tentar salvar
      const saveButton = screen.getByRole('button', { name: /salvar|save/i });
      await user.click(saveButton);

      // Deve mostrar erro de validação
      await waitFor(() => {
        expect(screen.getByText(/obrigatório|required/i)).toBeInTheDocument();
      });
    });
  });

  describe('📅 Date Handling (Critical Feature)', () => {
    test('should display expiration date correctly', () => {
      render(
        <ApiTokenModal
          opened={true}
          onClose={jest.fn()}
          dataSource={dataSource}
          userApiService={mockApiService}
        />
      );

      // Data deve estar no formato correto
      const dateInput = screen.getByDisplayValue('2024-12-31');
      expect(dateInput).toBeInTheDocument();
    });

    test('should update expiration date in dataSource', async () => {
      render(
        <ApiTokenModal
          opened={true}
          onClose={jest.fn()}
          dataSource={dataSource}
          userApiService={mockApiService}
        />
      );

      dataSource.edit();

      // Alterar data de expiração
      const dateInput = screen.getByDisplayValue('2024-12-31');
      await user.clear(dateInput);
      await user.type(dateInput, '2025-06-15');

      // Verificar se dataSource foi atualizado
      expect(dataSource.getFieldValue('expirationDate')).toBe('2025-06-15');
    });

    test('should validate date ranges', async () => {
      render(
        <ApiTokenModal
          opened={true}
          onClose={jest.fn()}
          dataSource={dataSource}
          userApiService={mockApiService}
        />
      );

      dataSource.edit();

      // Tentar definir data no passado
      const dateInput = screen.getByDisplayValue('2024-12-31');
      await user.clear(dateInput);
      await user.type(dateInput, '2020-01-01');

      // Deve mostrar erro de validação
      await waitFor(() => {
        expect(screen.getByText(/data.*passado|invalid.*date/i)).toBeInTheDocument();
      });
    });
  });

  describe('👥 User Selection (Critical Feature)', () => {
    test('should load users from API service', async () => {
      render(
        <ApiTokenModal
          opened={true}
          onClose={jest.fn()}
          dataSource={dataSource}
          userApiService={mockApiService}
        />
      );

      // Deve ter campo de seleção de usuário
      const userSelect = screen.getByLabelText(/usuário|user/i);
      expect(userSelect).toBeInTheDocument();

      // Abrir dropdown
      await user.click(userSelect);

      // Deve carregar usuários da API
      await waitFor(() => {
        expect(mockApiService.findAll).toHaveBeenCalled();
      });
    });

    test('should filter users based on search', async () => {
      render(
        <ApiTokenModal
          opened={true}
          onClose={jest.fn()}
          dataSource={dataSource}
          userApiService={mockApiService}
        />
      );

      const userSelect = screen.getByLabelText(/usuário|user/i);
      await user.click(userSelect);

      // Digitar para filtrar
      await user.type(userSelect, 'user1');

      // API deve ser chamada com filtro
      await waitFor(() => {
        expect(mockApiService.findAll).toHaveBeenCalledWith(
          expect.anything(),
          expect.stringContaining('user1')
        );
      });
    });

    test('should update dataSource when user selected', async () => {
      render(
        <ApiTokenModal
          opened={true}
          onClose={jest.fn()}
          dataSource={dataSource}
          userApiService={mockApiService}
        />
      );

      dataSource.edit();

      const userSelect = screen.getByLabelText(/usuário|user/i);
      await user.click(userSelect);

      // Selecionar usuário
      await waitFor(() => {
        const userOption = screen.getByText('Usuario 1');
        user.click(userOption);
      });

      // DataSource deve ser atualizado
      expect(dataSource.getFieldValue('userId')).toBe(1);
    });
  });

  describe('🔒 Security Scopes (Critical Feature)', () => {
    test('should display available scopes', () => {
      render(
        <ApiTokenModal
          opened={true}
          onClose={jest.fn()}
          dataSource={dataSource}
          userApiService={mockApiService}
        />
      );

      // Deve mostrar opções de escopo
      expect(screen.getByText(/scope|permiss/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/read/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/write/i)).toBeInTheDocument();
    });

    test('should show current scopes as selected', () => {
      render(
        <ApiTokenModal
          opened={true}
          onClose={jest.fn()}
          dataSource={dataSource}
          userApiService={mockApiService}
        />
      );

      // Scopes do token atual devem estar selecionados
      const readCheckbox = screen.getByLabelText(/read/i);
      const writeCheckbox = screen.getByLabelText(/write/i);

      expect(readCheckbox).toBeChecked();
      expect(writeCheckbox).toBeChecked();
    });

    test('should update scopes in dataSource', async () => {
      render(
        <ApiTokenModal
          opened={true}
          onClose={jest.fn()}
          dataSource={dataSource}
          userApiService={mockApiService}
        />
      );

      dataSource.edit();

      // Desmarcar write scope
      const writeCheckbox = screen.getByLabelText(/write/i);
      await user.click(writeCheckbox);

      // DataSource deve ser atualizado
      const scopes = dataSource.getFieldValue('scopes');
      expect(scopes).toContain('read');
      expect(scopes).not.toContain('write');
    });
  });

  describe('⚡ Form Actions (Critical Functionality)', () => {
    test('should enable save button when in edit mode', () => {
      render(
        <ApiTokenModal
          opened={true}
          onClose={jest.fn()}
          dataSource={dataSource}
          userApiService={mockApiService}
        />
      );

      dataSource.edit();

      const saveButton = screen.getByRole('button', { name: /salvar|save/i });
      expect(saveButton).not.toBeDisabled();
    });

    test('should disable save button when in browse mode', () => {
      render(
        <ApiTokenModal
          opened={true}
          onClose={jest.fn()}
          dataSource={dataSource}
          userApiService={mockApiService}
        />
      );

      // Em modo browse
      expect(dataSource.isBrowsing()).toBe(true);

      const saveButton = screen.getByRole('button', { name: /salvar|save/i });
      expect(saveButton).toBeDisabled();
    });

    test('should handle save action correctly', async () => {
      const onSave = jest.fn();
      render(
        <ApiTokenModal
          opened={true}
          onClose={jest.fn()}
          onSave={onSave}
          dataSource={dataSource}
          userApiService={mockApiService}
        />
      );

      dataSource.edit();

      // Modificar dados
      const nameInput = screen.getByDisplayValue('API Token 1');
      await user.clear(nameInput);
      await user.type(nameInput, 'Novo Token');

      // Salvar
      const saveButton = screen.getByRole('button', { name: /salvar|save/i });
      await user.click(saveButton);

      expect(onSave).toHaveBeenCalled();
    });

    test('should handle cancel action correctly', async () => {
      render(
        <ApiTokenModal
          opened={true}
          onClose={jest.fn()}
          dataSource={dataSource}
          userApiService={mockApiService}
        />
      );

      dataSource.edit();

      // Modificar dados
      const nameInput = screen.getByDisplayValue('API Token 1');
      await user.clear(nameInput);
      await user.type(nameInput, 'Novo Token');

      // Cancelar
      const cancelButton = screen.getByRole('button', { name: /cancelar|cancel/i });
      await user.click(cancelButton);

      // Dados devem voltar ao estado original
      expect(dataSource.getFieldValue('name')).toBe('API Token 1');
      expect(dataSource.isBrowsing()).toBe(true);
    });
  });

  describe('🔧 Error Handling (Critical)', () => {
    test('should handle API errors gracefully', async () => {
      // Mock API error
      mockApiService.findAll.mockRejectedValueOnce(new Error('API Error'));

      render(
        <ApiTokenModal
          opened={true}
          onClose={jest.fn()}
          dataSource={dataSource}
          userApiService={mockApiService}
        />
      );

      // Tentar carregar usuários
      const userSelect = screen.getByLabelText(/usuário|user/i);
      await user.click(userSelect);

      // Deve mostrar erro
      await waitFor(() => {
        expect(screen.getByText(/erro|error/i)).toBeInTheDocument();
      });
    });

    test('should handle save errors gracefully', async () => {
      // Mock save error
      mockApiService.save.mockRejectedValueOnce(new Error('Save Error'));

      const onSave = jest.fn();
      render(
        <ApiTokenModal
          opened={true}
          onClose={jest.fn()}
          onSave={onSave}
          dataSource={dataSource}
          userApiService={mockApiService}
        />
      );

      dataSource.edit();

      // Tentar salvar
      const saveButton = screen.getByRole('button', { name: /salvar|save/i });
      await user.click(saveButton);

      // Deve mostrar erro
      await waitFor(() => {
        expect(screen.getByText(/erro.*salvar|save.*error/i)).toBeInTheDocument();
      });
    });

    test('should handle network timeouts', async () => {
      // Mock timeout
      mockApiService.findAll.mockImplementation(() => 
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 100)
        )
      );

      render(
        <ApiTokenModal
          opened={true}
          onClose={jest.fn()}
          dataSource={dataSource}
          userApiService={mockApiService}
        />
      );

      const userSelect = screen.getByLabelText(/usuário|user/i);
      await user.click(userSelect);

      // Deve mostrar erro de timeout
      await waitFor(() => {
        expect(screen.getByText(/timeout|tempo.*esgotado/i)).toBeInTheDocument();
      }, { timeout: 2000 });
    });
  });

  describe('♿ Accessibility (a11y)', () => {
    test('should have proper modal structure', () => {
      render(
        <ApiTokenModal
          opened={true}
          onClose={jest.fn()}
          dataSource={dataSource}
          userApiService={mockApiService}
        />
      );

      const modal = screen.getByRole('dialog');
      expect(modal).toHaveAttribute('aria-modal', 'true');
    });

    test('should have proper form labels', () => {
      render(
        <ApiTokenModal
          opened={true}
          onClose={jest.fn()}
          dataSource={dataSource}
          userApiService={mockApiService}
        />
      );

      // Todos os campos devem ter labels
      expect(screen.getByLabelText(/nome|name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/descrição|description/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/data.*expiração|expiration.*date/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/usuário|user/i)).toBeInTheDocument();
    });

    test('should support keyboard navigation', async () => {
      render(
        <ApiTokenModal
          opened={true}
          onClose={jest.fn()}
          dataSource={dataSource}
          userApiService={mockApiService}
        />
      );

      // Tab através dos campos
      await user.tab();
      expect(document.activeElement).toHaveAttribute('type', 'text');

      await user.tab();
      expect(document.activeElement).toHaveAttribute('type', 'text');
    });

    test('should announce errors to screen readers', async () => {
      render(
        <ApiTokenModal
          opened={true}
          onClose={jest.fn()}
          dataSource={dataSource}
          userApiService={mockApiService}
        />
      );

      // Simular erro no DataSource
      const errorMessage = 'Nome é obrigatório';
      dataSource.setFieldError('name', [errorMessage]);

      await waitFor(() => {
        const errorElement = screen.getByText(errorMessage);
        expect(errorElement).toHaveAttribute('role', 'alert');
      });
    });
  });

  describe('🔄 Component Lifecycle', () => {
    test('should cleanup properly on unmount', () => {
      const { unmount } = render(
        <ApiTokenModal
          opened={true}
          onClose={jest.fn()}
          dataSource={dataSource}
          userApiService={mockApiService}
        />
      );

      expect(() => {
        unmount();
      }).not.toThrow();
    });

    test('should handle prop changes correctly', () => {
      const { rerender } = render(
        <ApiTokenModal
          opened={false}
          onClose={jest.fn()}
          dataSource={dataSource}
          userApiService={mockApiService}
        />
      );

      // Abrir modal
      rerender(
        <ApiTokenModal
          opened={true}
          onClose={jest.fn()}
          dataSource={dataSource}
          userApiService={mockApiService}
        />
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();

      // Fechar modal
      rerender(
        <ApiTokenModal
          opened={false}
          onClose={jest.fn()}
          dataSource={dataSource}
          userApiService={mockApiService}
        />
      );

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });
});
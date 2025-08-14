# Exemplos Avançados - Sistema de Segurança Archbase React v3

## 📋 Índice

- [Sistema Empresarial Completo](#sistema-empresarial-completo)
- [Multi-tenant com Segurança](#multi-tenant-com-segurança)
- [Dashboard com Permissões Granulares](#dashboard-com-permissões-granulares)
- [Formulários Dinâmicos Seguros](#formulários-dinâmicos-seguros)
- [Sistema de Workflow com Aprovações](#sistema-de-workflow-com-aprovações)
- [Integração com Sistema Legacy](#integração-com-sistema-legacy)
- [Performance e Otimização](#performance-e-otimização)
- [Monitoramento e Analytics](#monitoramento-e-analytics)

---

## 🏢 Sistema Empresarial Completo

### Arquitetura de Segurança Empresarial

```typescript
// security/enterprise-security-manager.ts
import { ArchbaseSecurityManager } from '@archbase/security';

interface EnterpriseUser {
  id: string;
  email: string;
  department: string;
  role: string;
  permissions: string[];
  tenantId: string;
}

class EnterpriseSecurityManager extends ArchbaseSecurityManager {
  private permissionCache = new Map<string, boolean>();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutos
  
  constructor(
    private apiClient: EnterpriseAPIClient,
    private currentUser: EnterpriseUser
  ) {
    super();
  }
  
  async hasPermission(permission: string): Promise<boolean> {
    const cacheKey = `${this.currentUser.id}:${permission}`;
    
    // Verificar cache
    if (this.permissionCache.has(cacheKey)) {
      return this.permissionCache.get(cacheKey)!;
    }
    
    try {
      // Verificação hierárquica de permissões
      const result = await this.checkPermissionHierarchy(permission);
      
      // Cache com TTL
      this.permissionCache.set(cacheKey, result);
      setTimeout(() => {
        this.permissionCache.delete(cacheKey);
      }, this.cacheTimeout);
      
      return result;
    } catch (error) {
      console.error('Erro ao verificar permissão:', error);
      return false; // Falha segura
    }
  }
  
  private async checkPermissionHierarchy(permission: string): Promise<boolean> {
    // 1. Verificar permissão específica
    if (this.currentUser.permissions.includes(permission)) {
      return true;
    }
    
    // 2. Verificar permissões por role
    const rolePermissions = await this.apiClient.getRolePermissions(
      this.currentUser.role
    );
    if (rolePermissions.includes(permission)) {
      return true;
    }
    
    // 3. Verificar permissões por departamento
    const deptPermissions = await this.apiClient.getDepartmentPermissions(
      this.currentUser.department
    );
    if (deptPermissions.includes(permission)) {
      return true;
    }
    
    // 4. Verificar permissões hierárquicas (admin)
    if (this.currentUser.role === 'admin' && permission.startsWith('admin_')) {
      return true;
    }
    
    return false;
  }
  
  async registerAction(action: string, description?: string): Promise<void> {
    // Registrar ação para auditoria
    await this.apiClient.logAction({
      userId: this.currentUser.id,
      tenantId: this.currentUser.tenantId,
      action,
      description,
      timestamp: new Date(),
      ipAddress: await this.getClientIP()
    });
  }
  
  async batchCheckPermissions(permissions: string[]): Promise<Record<string, boolean>> {
    const result: Record<string, boolean> = {};
    
    // Verificar em lote para performance
    const uncachedPermissions = permissions.filter(p => 
      !this.permissionCache.has(`${this.currentUser.id}:${p}`)
    );
    
    if (uncachedPermissions.length > 0) {
      const batchResult = await this.apiClient.batchCheckPermissions(
        this.currentUser.id,
        uncachedPermissions
      );
      
      // Atualizar cache
      Object.entries(batchResult).forEach(([permission, granted]) => {
        const cacheKey = `${this.currentUser.id}:${permission}`;
        this.permissionCache.set(cacheKey, granted);
      });
    }
    
    // Retornar resultado completo
    permissions.forEach(permission => {
      const cacheKey = `${this.currentUser.id}:${permission}`;
      result[permission] = this.permissionCache.get(cacheKey) || false;
    });
    
    return result;
  }
}
```

### Configuração do Sistema Principal

```typescript
// app/enterprise-app.tsx
import React from 'react';
import { ArchbaseSecurityProvider } from '@archbase/security';
import { EnterpriseSecurityManager } from './security/enterprise-security-manager';

function EnterpriseApp() {
  const [securityManager, setSecurityManager] = useState<EnterpriseSecurityManager>();
  const [currentUser, setCurrentUser] = useState<EnterpriseUser>();
  
  useEffect(() => {
    // Inicializar após login
    initializeSecurity();
  }, []);
  
  const initializeSecurity = async () => {
    const user = await authService.getCurrentUser();
    const apiClient = new EnterpriseAPIClient(user.tenantId);
    const manager = new EnterpriseSecurityManager(apiClient, user);
    
    await manager.initialize();
    
    setCurrentUser(user);
    setSecurityManager(manager);
  };
  
  if (!securityManager || !currentUser) {
    return <LoadingScreen />;
  }
  
  return (
    <ArchbaseSecurityProvider 
      manager={securityManager}
      resourceName="enterprise_system"
      resourceDescription="Sistema Empresarial"
      debug={process.env.NODE_ENV === 'development'}
      onPermissionCheck={(permission, granted) => {
        // Analytics de permissões
        analytics.trackPermissionCheck(permission, granted, currentUser.id);
      }}
    >
      <EnterpriseLayout>
        <Router>
          <Routes>
            <Route path="/hr" element={<HRModule />} />
            <Route path="/finance" element={<FinanceModule />} />
            <Route path="/admin" element={<AdminModule />} />
          </Routes>
        </Router>
      </EnterpriseLayout>
    </ArchbaseSecurityProvider>
  );
}
```

### Módulos com Segurança Específica

```typescript
// modules/hr/hr-module.tsx
import { ArchbaseViewSecurityProvider } from '@archbase/security';

function HRModule() {
  return (
    <ArchbaseViewSecurityProvider 
      viewName="hr_module"
      requiredPermissions={['access_hr', 'view_employee_data']}
      fallbackComponent={UnauthorizedHRAccess}
    >
      <HRDashboard />
    </ArchbaseViewSecurityProvider>
  );
}

function HRDashboard() {
  return (
    <div className="hr-dashboard">
      <h1>Recursos Humanos</h1>
      
      {/* Grid de funcionários com segurança granular */}
      <EmployeeDataGrid />
      
      {/* Relatórios condicionais */}
      <ConditionalReports />
      
      {/* Ações administrativas */}
      <HRAdminActions />
    </div>
  );
}

function EmployeeDataGrid() {
  return (
    <ArchbaseGridTemplate
      title="Funcionários"
      dataSource={employeeDataSource}
      filterType="advanced"
      
      resourceName="employee_management"
      resourceDescription="Gerenciamento de Funcionários"
      
      columnSecurityOptions={{
        permissionPrefix: "hr_employee_",
        defaultFallback: "🔒 Dados Confidenciais",
        hideByDefault: false
      }}
      
      userActions={{
        visible: true,
        onAddExecute: () => openEmployeeModal('create'),
        onEditExecute: () => openEmployeeModal('edit'),
        onRemoveExecute: handleTerminateEmployee,
        allowRemove: true
      }}
      
      columns={
        <Columns>
          {/* Dados básicos - sempre visíveis */}
          <ArchbaseDataGridColumn 
            dataField="name" 
            header="Nome" 
            dataType="text" 
          />
          
          <ArchbaseDataGridColumn 
            dataField="department" 
            header="Departamento" 
            dataType="text" 
          />
          
          <ArchbaseDataGridColumn 
            dataField="position" 
            header="Cargo" 
            dataType="text" 
          />
          
          {/* Dados pessoais sensíveis */}
          <ArchbaseDataGridColumn 
            dataField="cpf" 
            header="CPF" 
            dataType="text"
            viewPermission="view_personal_data"
            fallbackContent="***.***.***-**"
          />
          
          <ArchbaseDataGridColumn 
            dataField="phone" 
            header="Telefone" 
            dataType="text"
            viewPermission="view_contact_info"
            fallbackContent="(XX) XXXXX-XXXX"
          />
          
          {/* Dados financeiros */}
          <ArchbaseDataGridColumn 
            dataField="salary" 
            header="Salário" 
            dataType="currency"
            viewPermission="view_salary"
            hideWhenNoPermission={true}
          />
          
          <ArchbaseDataGridColumn 
            dataField="bonus" 
            header="Bônus" 
            dataType="currency"
            viewPermission="view_compensation"
            fallbackContent="Confidencial"
          />
          
          {/* Dados de performance */}
          <ArchbaseDataGridColumn 
            dataField="performanceScore" 
            header="Avaliação" 
            dataType="number"
            viewPermission="view_performance"
            fallbackContent={
              <Badge color="gray">Restrito</Badge>
            }
          />
          
          {/* Dados administrativos */}
          <ArchbaseDataGridColumn 
            dataField="admissionDate" 
            header="Data Admissão" 
            dataType="date"
            viewPermission="view_admin_data"
          />
          
          <ArchbaseDataGridColumn 
            dataField="contractType" 
            header="Tipo Contrato" 
            dataType="text"
            viewPermission="view_contract_details"
            fallbackContent="N/A"
          />
        </Columns>
      }
    />
  );
}
```

---

## 🏘️ Multi-tenant com Segurança

### Security Manager Multi-tenant

```typescript
// security/multi-tenant-security-manager.ts
class MultiTenantSecurityManager extends ArchbaseSecurityManager {
  constructor(
    private tenantId: string,
    private userId: string,
    private apiClient: TenantAPIClient
  ) {
    super();
  }
  
  async hasPermission(permission: string): Promise<boolean> {
    try {
      // Verificar no contexto do tenant
      const response = await this.apiClient.checkPermission({
        tenantId: this.tenantId,
        userId: this.userId,
        permission: permission
      });
      
      return response.granted;
    } catch (error) {
      console.error(`Erro ao verificar permissão ${permission} para tenant ${this.tenantId}:`, error);
      return false;
    }
  }
  
  async registerAction(action: string, description?: string): Promise<void> {
    await this.apiClient.logTenantAction({
      tenantId: this.tenantId,
      userId: this.userId,
      action,
      description,
      timestamp: new Date()
    });
  }
  
  async getTenantPermissions(): Promise<string[]> {
    const response = await this.apiClient.getTenantPermissions(this.tenantId);
    return response.permissions;
  }
}
```

### Aplicação Multi-tenant

```typescript
// app/multi-tenant-app.tsx
interface TenantConfig {
  id: string;
  name: string;
  features: string[];
  permissions: string[];
  theme: any;
}

function MultiTenantApp() {
  const [tenant, setTenant] = useState<TenantConfig>();
  const [securityManager, setSecurityManager] = useState<MultiTenantSecurityManager>();
  
  useEffect(() => {
    initializeTenant();
  }, []);
  
  const initializeTenant = async () => {
    // Detectar tenant (subdomain, path, etc.)
    const tenantId = detectTenantId();
    const tenantConfig = await loadTenantConfig(tenantId);
    const currentUser = await authService.getCurrentUser();
    
    const manager = new MultiTenantSecurityManager(
      tenantId,
      currentUser.id,
      new TenantAPIClient(tenantId)
    );
    
    setTenant(tenantConfig);
    setSecurityManager(manager);
  };
  
  if (!tenant || !securityManager) {
    return <TenantLoadingScreen />;
  }
  
  return (
    <MantineProvider theme={tenant.theme}>
      <ArchbaseSecurityProvider 
        manager={securityManager}
        resourceName={`tenant_${tenant.id}`}
        resourceDescription={`Sistema ${tenant.name}`}
      >
        <TenantApp tenant={tenant} />
      </ArchbaseSecurityProvider>
    </MantineProvider>
  );
}

function TenantApp({ tenant }: { tenant: TenantConfig }) {
  return (
    <div className="tenant-app">
      <TenantHeader tenant={tenant} />
      
      <TenantNavigation tenant={tenant} />
      
      <main>
        <Router>
          <Routes>
            {/* Rotas condicionais por features do tenant */}
            {tenant.features.includes('crm') && (
              <Route path="/crm" element={<CRMModule tenantId={tenant.id} />} />
            )}
            
            {tenant.features.includes('finance') && (
              <Route path="/finance" element={<FinanceModule tenantId={tenant.id} />} />
            )}
            
            {tenant.features.includes('hr') && (
              <Route path="/hr" element={<HRModule tenantId={tenant.id} />} />
            )}
          </Routes>
        </Router>
      </main>
    </div>
  );
}

function CRMModule({ tenantId }: { tenantId: string }) {
  return (
    <ArchbaseViewSecurityProvider 
      viewName={`crm_module_${tenantId}`}
      requiredPermissions={['access_crm']}
    >
      <CRMDashboard tenantId={tenantId} />
    </ArchbaseViewSecurityProvider>
  );
}

function CRMDashboard({ tenantId }: { tenantId: string }) {
  return (
    <ArchbaseGridTemplate
      title="Clientes"
      dataSource={clientDataSource}
      resourceName={`crm_clients_${tenantId}`}
      
      columnSecurityOptions={{
        permissionPrefix: `tenant_${tenantId}_crm_`,
        defaultFallback: "Dados Restritos"
      }}
      
      columns={
        <Columns>
          <ArchbaseDataGridColumn dataField="name" header="Nome" />
          <ArchbaseDataGridColumn 
            dataField="revenue" 
            header="Faturamento"
            viewPermission="view_client_revenue"
            dataType="currency"
          />
          <ArchbaseDataGridColumn 
            dataField="contacts" 
            header="Contatos"
            viewPermission="view_client_contacts"
          />
        </Columns>
      }
    />
  );
}
```

---

## 📊 Dashboard com Permissões Granulares

### Dashboard Executivo

```typescript
// dashboard/executive-dashboard.tsx
import { useArchbaseSecurity, useArchbasePermissionCheck } from '@archbase/security';

function ExecutiveDashboard() {
  const security = useArchbaseSecurity();
  
  // Verificar permissões para diferentes métricas
  const canViewRevenue = useArchbasePermissionCheck('view_revenue_metrics');
  const canViewCosts = useArchbasePermissionCheck('view_cost_metrics');
  const canViewProfit = useArchbasePermissionCheck('view_profit_metrics');
  const canViewEmployeeMetrics = useArchbasePermissionCheck('view_employee_metrics');
  const canExportData = useArchbasePermissionCheck('export_dashboard_data');
  
  // Registrar acesso ao dashboard
  useEffect(() => {
    security.registerAction('access_executive_dashboard', 'Acessar Dashboard Executivo');
  }, [security]);
  
  return (
    <div className="executive-dashboard">
      <DashboardHeader 
        title="Dashboard Executivo"
        actions={
          <DashboardActions 
            canExport={canExportData}
            onExport={handleExportDashboard}
          />
        }
      />
      
      <div className="metrics-grid">
        {/* Métricas Financeiras */}
        <MetricsSection title="Financeiro">
          {canViewRevenue && (
            <MetricCard
              title="Receita Total"
              value="R$ 2.450.000"
              trend="+12.5%"
              color="green"
              onClick={() => openRevenueDetails()}
            />
          )}
          
          {canViewCosts && (
            <MetricCard
              title="Custos Operacionais"
              value="R$ 1.680.000"
              trend="+5.2%"
              color="orange"
              onClick={() => openCostDetails()}
            />
          )}
          
          {canViewProfit && canViewRevenue && canViewCosts && (
            <MetricCard
              title="Lucro Líquido"
              value="R$ 770.000"
              trend="+18.7%"
              color="blue"
              onClick={() => openProfitDetails()}
            />
          )}
        </MetricsSection>
        
        {/* Métricas de RH */}
        {canViewEmployeeMetrics && (
          <MetricsSection title="Recursos Humanos">
            <MetricCard
              title="Total Funcionários"
              value="1,247"
              trend="+3.1%"
              color="purple"
            />
            
            <MetricCard
              title="Taxa Rotatividade"
              value="2.4%"
              trend="-0.8%"
              color="red"
            />
          </MetricsSection>
        )}
        
        {/* Gráficos Condicionais */}
        {canViewRevenue && canViewCosts && (
          <ChartSection>
            <FinancialChart />
          </ChartSection>
        )}
        
        {canViewEmployeeMetrics && (
          <ChartSection>
            <EmployeeChart />
          </ChartSection>
        )}
      </div>
      
      {/* Tabelas de Dados Detalhados */}
      <DetailedDataSection />
    </div>
  );
}

function DetailedDataSection() {
  const canViewSales = useArchbasePermissionCheck('view_sales_data');
  const canViewCustomers = useArchbasePermissionCheck('view_customer_data');
  
  return (
    <div className="detailed-data">
      <Tabs defaultValue="sales">
        <Tabs.List>
          {canViewSales && <Tabs.Tab value="sales">Vendas</Tabs.Tab>}
          {canViewCustomers && <Tabs.Tab value="customers">Clientes</Tabs.Tab>}
        </Tabs.List>
        
        {canViewSales && (
          <Tabs.Panel value="sales">
            <SalesDataGrid />
          </Tabs.Panel>
        )}
        
        {canViewCustomers && (
          <Tabs.Panel value="customers">
            <CustomersDataGrid />
          </Tabs.Panel>
        )}
      </Tabs>
    </div>
  );
}

function SalesDataGrid() {
  return (
    <ArchbaseDataGrid 
      dataSource={salesDataSource}
      resourceName="sales_dashboard"
      columnSecurityOptions={{
        permissionPrefix: "sales_",
        defaultFallback: "Confidencial"
      }}
    >
      <Columns>
        <ArchbaseDataGridColumn dataField="product" header="Produto" />
        <ArchbaseDataGridColumn 
          dataField="amount" 
          header="Valor"
          dataType="currency"
          viewPermission="view_amount"
        />
        <ArchbaseDataGridColumn 
          dataField="commission" 
          header="Comissão"
          dataType="currency"
          viewPermission="view_commission"
          hideWhenNoPermission={true}
        />
        <ArchbaseDataGridColumn 
          dataField="profit" 
          header="Lucro"
          dataType="currency"
          viewPermission="view_profit_detail"
          fallbackContent="N/A"
        />
      </Columns>
    </ArchbaseDataGrid>
  );
}
```

### Dashboard Personalizado por Role

```typescript
// dashboard/role-based-dashboard.tsx
function RoleBasedDashboard() {
  const security = useArchbaseSecurity();
  const [userRole, setUserRole] = useState<string>();
  
  useEffect(() => {
    loadUserRole();
  }, []);
  
  const loadUserRole = async () => {
    const user = await authService.getCurrentUser();
    setUserRole(user.role);
  };
  
  const renderDashboardByRole = () => {
    switch (userRole) {
      case 'ceo':
        return <CEODashboard />;
      case 'cfo':
        return <CFODashboard />;
      case 'hr_manager':
        return <HRManagerDashboard />;
      case 'sales_manager':
        return <SalesManagerDashboard />;
      case 'analyst':
        return <AnalystDashboard />;
      default:
        return <DefaultDashboard />;
    }
  };
  
  return (
    <div className="role-dashboard">
      {renderDashboardByRole()}
    </div>
  );
}

function CFODashboard() {
  const canViewBudget = useArchbasePermissionCheck('view_budget');
  const canViewCashFlow = useArchbasePermissionCheck('view_cash_flow');
  const canViewForecasts = useArchbasePermissionCheck('view_financial_forecasts');
  
  return (
    <div className="cfo-dashboard">
      <h1>Dashboard CFO</h1>
      
      {canViewBudget && <BudgetOverview />}
      {canViewCashFlow && <CashFlowChart />}
      {canViewForecasts && <FinancialForecasts />}
      
      <ArchbaseGridTemplate
        title="Relatórios Financeiros"
        dataSource={financialReportsDataSource}
        resourceName="cfo_reports"
        
        columnSecurityOptions={{
          permissionPrefix: "finance_",
          defaultFallback: "🔒 Acesso CFO Necessário"
        }}
        
        columns={
          <Columns>
            <ArchbaseDataGridColumn dataField="reportName" header="Relatório" />
            <ArchbaseDataGridColumn 
              dataField="actualAmount" 
              header="Valor Real"
              dataType="currency"
              viewPermission="view_actual_amounts"
            />
            <ArchbaseDataGridColumn 
              dataField="budgetAmount" 
              header="Orçado"
              dataType="currency"
              viewPermission="view_budget_amounts"
            />
            <ArchbaseDataGridColumn 
              dataField="variance" 
              header="Variação"
              dataType="currency"
              viewPermission="view_variances"
              fallbackContent={<Badge color="gray">Restrito</Badge>}
            />
          </Columns>
        }
      />
    </div>
  );
}
```

---

## 📝 Formulários Dinâmicos Seguros

### Formulário com Campos Condicionais

```typescript
// forms/dynamic-secure-form.tsx
import { useArchbaseSecureForm, useArchbasePermissionCheck } from '@archbase/security';

interface DynamicFormConfig {
  sections: FormSection[];
  permissions: Record<string, string>;
}

interface FormSection {
  id: string;
  title: string;
  permission?: string;
  fields: FormField[];
}

interface FormField {
  id: string;
  type: 'text' | 'email' | 'currency' | 'date' | 'select';
  label: string;
  permission?: string;
  sensitive?: boolean;
  required?: boolean;
}

function DynamicSecureForm({ config, dataSource }: {
  config: DynamicFormConfig;
  dataSource: ArchbaseDataSource<any, any>;
}) {
  const {
    hasPermission,
    registerFormAction,
    canSubmit,
    securityErrors
  } = useArchbaseSecureForm({
    resourceName: 'dynamic_form',
    requiredPermissions: ['access_form']
  });
  
  useEffect(() => {
    registerFormAction('submit_dynamic_form', 'Submeter Formulário Dinâmico');
    registerFormAction('save_draft', 'Salvar Rascunho');
  }, [registerFormAction]);
  
  const renderField = (field: FormField) => {
    // Verificar permissão do campo
    if (field.permission && !hasPermission(field.permission)) {
      if (field.sensitive) {
        return null; // Ocultar campo sensível
      }
      return (
        <div key={field.id} className="restricted-field">
          <Text size="sm" color="dimmed">
            {field.label}: 🔒 Acesso restrito
          </Text>
        </div>
      );
    }
    
    const commonProps = {
      key: field.id,
      label: field.label,
      dataSource: dataSource,
      dataField: field.id,
      required: field.required
    };
    
    switch (field.type) {
      case 'text':
        return <ArchbaseEdit {...commonProps} />;
      case 'email':
        return <ArchbaseEdit {...commonProps} type="email" />;
      case 'currency':
        return <ArchbaseNumberEdit {...commonProps} dataType="currency" />;
      case 'date':
        return <ArchbaseDatePickerEdit {...commonProps} />;
      case 'select':
        return <ArchbaseSelect {...commonProps} options={field.options} />;
      default:
        return <ArchbaseEdit {...commonProps} />;
    }
  };
  
  const renderSection = (section: FormSection) => {
    // Verificar permissão da seção
    if (section.permission && !hasPermission(section.permission)) {
      return (
        <Card key={section.id} className="restricted-section">
          <Text weight="bold">{section.title}</Text>
          <Text size="sm" color="dimmed">
            🔒 Você não tem permissão para visualizar esta seção
          </Text>
        </Card>
      );
    }
    
    return (
      <Card key={section.id} className="form-section">
        <Text weight="bold" mb="md">{section.title}</Text>
        <Stack spacing="md">
          {section.fields.map(renderField)}
        </Stack>
      </Card>
    );
  };
  
  return (
    <form className="dynamic-secure-form">
      <Stack spacing="lg">
        {config.sections.map(renderSection)}
        
        {/* Erros de segurança */}
        {securityErrors.length > 0 && (
          <Alert color="red" title="Erros de Segurança">
            <List>
              {securityErrors.map((error, index) => (
                <List.Item key={index}>{error}</List.Item>
              ))}
            </List>
          </Alert>
        )}
        
        {/* Ações */}
        <Group justify="flex-end">
          {hasPermission('save_draft') && (
            <Button variant="outline" onClick={handleSaveDraft}>
              Salvar Rascunho
            </Button>
          )}
          
          <Button 
            type="submit" 
            disabled={!canSubmit}
            onClick={handleSubmit}
          >
            Submeter Formulário
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
```

### Formulário de Cadastro de Cliente Empresarial

```typescript
// forms/enterprise-client-form.tsx
function EnterpriseClientForm() {
  const canViewFinancialData = useArchbasePermissionCheck('view_client_financial_data');
  const canEditContractTerms = useArchbasePermissionCheck('edit_contract_terms');
  const canAccessCreditInfo = useArchbasePermissionCheck('access_credit_information');
  
  return (
    <ArchbaseSecurityProvider resourceName="client_form">
      <Card className="client-form">
        <Text size="xl" weight="bold" mb="lg">
          Cadastro de Cliente Empresarial
        </Text>
        
        <Stack spacing="md">
          {/* Informações Básicas - Sempre visíveis */}
          <Section title="Informações Básicas">
            <Grid>
              <Grid.Col span={6}>
                <ArchbaseEdit 
                  label="Razão Social"
                  dataSource={clientDataSource}
                  dataField="companyName"
                  required
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <ArchbaseEdit 
                  label="CNPJ"
                  dataSource={clientDataSource}
                  dataField="cnpj"
                  required
                />
              </Grid.Col>
            </Grid>
          </Section>
          
          {/* Informações Financeiras - Condicionais */}
          <ArchbaseSecureFormField 
            permission="view_client_financial_data"
            fallback={
              <Alert color="blue" icon={<IconLock />}>
                Informações financeiras disponíveis apenas para usuários autorizados.
                Entre em contato com o administrador para acesso.
              </Alert>
            }
          >
            <Section title="Informações Financeiras">
              <Grid>
                <Grid.Col span={6}>
                  <ArchbaseNumberEdit 
                    label="Faturamento Anual"
                    dataSource={clientDataSource}
                    dataField="annualRevenue"
                    dataType="currency"
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <ArchbaseNumberEdit 
                    label="Limite de Crédito"
                    dataSource={clientDataSource}
                    dataField="creditLimit"
                    dataType="currency"
                  />
                </Grid.Col>
              </Grid>
            </Section>
          </ArchbaseSecureFormField>
          
          {/* Informações de Crédito - Ultra Restrito */}
          {canAccessCreditInfo && (
            <Section title="Análise de Crédito" variant="restricted">
              <Grid>
                <Grid.Col span={4}>
                  <ArchbaseNumberEdit 
                    label="Score de Crédito"
                    dataSource={clientDataSource}
                    dataField="creditScore"
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <ArchbaseSelect 
                    label="Classificação de Risco"
                    dataSource={clientDataSource}
                    dataField="riskClassification"
                    options={riskOptions}
                  />
                </Grid.Col>
                <Grid.Col span={4}>
                  <ArchbaseDatePickerEdit 
                    label="Última Análise"
                    dataSource={clientDataSource}
                    dataField="lastCreditAnalysis"
                  />
                </Grid.Col>
              </Grid>
            </Section>
          )}
          
          {/* Termos Contratuais - Apenas Gestores */}
          <ArchbaseSecureFormField 
            permission="edit_contract_terms"
            fallback={
              <Section title="Termos Contratuais">
                <Text color="dimmed">
                  📋 Termos contratuais são gerenciados pela equipe comercial
                </Text>
              </Section>
            }
          >
            <Section title="Termos Contratuais">
              <Grid>
                <Grid.Col span={6}>
                  <ArchbaseNumberEdit 
                    label="Prazo de Pagamento (dias)"
                    dataSource={clientDataSource}
                    dataField="paymentTerms"
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <ArchbaseNumberEdit 
                    label="Desconto (%)"
                    dataSource={clientDataSource}
                    dataField="discountPercentage"
                    dataType="percentage"
                  />
                </Grid.Col>
              </Grid>
              
              <ArchbaseTextArea 
                label="Observações Contratuais"
                dataSource={clientDataSource}
                dataField="contractNotes"
                rows={4}
              />
            </Section>
          </ArchbaseSecureFormField>
        </Stack>
      </Card>
    </ArchbaseSecurityProvider>
  );
}
```

---

## ⚡ Workflow com Aprovações

### Sistema de Aprovação com Níveis

```typescript
// workflow/approval-system.tsx
interface ApprovalWorkflow {
  id: string;
  type: 'expense' | 'purchase' | 'contract' | 'hire';
  currentLevel: number;
  maxLevel: number;
  status: 'pending' | 'approved' | 'rejected';
  approvers: WorkflowApprover[];
  requester: User;
  amount?: number;
}

interface WorkflowApprover {
  level: number;
  userId: string;
  role: string;
  permission: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedAt?: Date;
  comments?: string;
}

function ApprovalWorkflowSystem() {
  const security = useArchbaseSecurity();
  const [workflows, setWorkflows] = useState<ApprovalWorkflow[]>([]);
  
  const canViewAllWorkflows = useArchbasePermissionCheck('view_all_workflows');
  const canApproveExpenses = useArchbasePermissionCheck('approve_expenses');
  const canApprovePurchases = useArchbasePermissionCheck('approve_purchases');
  const canApproveContracts = useArchbasePermissionCheck('approve_contracts');
  
  return (
    <div className="approval-system">
      <WorkflowTabs 
        canViewAll={canViewAllWorkflows}
        canApproveExpenses={canApproveExpenses}
        canApprovePurchases={canApprovePurchases}
        canApproveContracts={canApproveContracts}
      />
    </div>
  );
}

function WorkflowTabs({ 
  canViewAll, 
  canApproveExpenses, 
  canApprovePurchases, 
  canApproveContracts 
}) {
  return (
    <Tabs defaultValue="pending">
      <Tabs.List>
        <Tabs.Tab value="pending">Pendentes de Aprovação</Tabs.Tab>
        {canViewAll && <Tabs.Tab value="all">Todos os Workflows</Tabs.Tab>}
        <Tabs.Tab value="my-requests">Minhas Solicitações</Tabs.Tab>
      </Tabs.List>
      
      <Tabs.Panel value="pending">
        <PendingApprovalsGrid />
      </Tabs.Panel>
      
      {canViewAll && (
        <Tabs.Panel value="all">
          <AllWorkflowsGrid />
        </Tabs.Panel>
      )}
      
      <Tabs.Panel value="my-requests">
        <MyRequestsGrid />
      </Tabs.Panel>
    </Tabs>
  );
}

function PendingApprovalsGrid() {
  return (
    <ArchbaseGridTemplate
      title="Aprovações Pendentes"
      dataSource={pendingApprovalsDataSource}
      resourceName="approval_workflow"
      
      columnSecurityOptions={{
        permissionPrefix: "workflow_",
        defaultFallback: "Acesso Negado"
      }}
      
      userActions={{
        visible: true,
        customUserActions: <WorkflowBulkActions />
      }}
      
      columns={
        <Columns>
          <ArchbaseDataGridColumn 
            dataField="type" 
            header="Tipo" 
            dataType="text"
            cellRenderer={({ value }) => (
              <Badge color={getWorkflowTypeColor(value)}>
                {getWorkflowTypeLabel(value)}
              </Badge>
            )}
          />
          
          <ArchbaseDataGridColumn 
            dataField="requester" 
            header="Solicitante" 
            dataType="text"
          />
          
          <ArchbaseDataGridColumn 
            dataField="amount" 
            header="Valor" 
            dataType="currency"
            viewPermission="view_workflow_amounts"
            fallbackContent="Confidencial"
          />
          
          <ArchbaseDataGridColumn 
            dataField="currentLevel" 
            header="Nível Atual" 
            dataType="number"
          />
          
          <ArchbaseDataGridColumn 
            dataField="createdAt" 
            header="Criado em" 
            dataType="datetime"
          />
          
          <ArchbaseDataGridColumn 
            dataField="actions" 
            header="Ações" 
            dataType="actions"
            cellRenderer={({ row }) => (
              <WorkflowActions workflow={row} />
            )}
          />
        </Columns>
      }
    />
  );
}

function WorkflowActions({ workflow }: { workflow: ApprovalWorkflow }) {
  const canApprove = useArchbasePermissionCheck(`approve_${workflow.type}`);
  const canReject = useArchbasePermissionCheck(`reject_${workflow.type}`);
  const canView = useArchbasePermissionCheck('view_workflow_details');
  
  return (
    <Group spacing="xs">
      {canView && (
        <ActionIcon 
          color="blue" 
          onClick={() => openWorkflowDetails(workflow.id)}
        >
          <IconEye />
        </ActionIcon>
      )}
      
      {canApprove && (
        <ArchbaseSecureActionButton
          actionName={`approve_workflow_${workflow.type}`}
          actionDescription={`Aprovar ${getWorkflowTypeLabel(workflow.type)}`}
          permission={`approve_${workflow.type}`}
          color="green"
          size="sm"
          onClick={() => approveWorkflow(workflow.id)}
        >
          Aprovar
        </ArchbaseSecureActionButton>
      )}
      
      {canReject && (
        <ArchbaseSecureActionButton
          actionName={`reject_workflow_${workflow.type}`}
          actionDescription={`Rejeitar ${getWorkflowTypeLabel(workflow.type)}`}
          permission={`reject_${workflow.type}`}
          color="red"
          size="sm"
          onClick={() => rejectWorkflow(workflow.id)}
        >
          Rejeitar
        </ArchbaseSecureActionButton>
      )}
    </Group>
  );
}
```

### Formulário de Solicitação de Despesa

```typescript
// workflow/expense-request-form.tsx
function ExpenseRequestForm() {
  const [amount, setAmount] = useState(0);
  const [approvalLevel, setApprovalLevel] = useState(1);
  
  const canRequestExpenses = useArchbasePermissionCheck('request_expenses');
  const canRequestHighValue = useArchbasePermissionCheck('request_high_value_expenses');
  
  // Calcular nível de aprovação baseado no valor
  useEffect(() => {
    const level = calculateApprovalLevel(amount);
    setApprovalLevel(level);
  }, [amount]);
  
  const calculateApprovalLevel = (value: number): number => {
    if (value <= 1000) return 1; // Supervisor
    if (value <= 5000) return 2; // Gerente
    if (value <= 20000) return 3; // Diretor
    return 4; // CEO
  };
  
  if (!canRequestExpenses) {
    return (
      <Alert color="red" icon={<IconLock />}>
        Você não tem permissão para solicitar reembolso de despesas.
      </Alert>
    );
  }
  
  return (
    <ArchbaseSecurityProvider resourceName="expense_request">
      <form className="expense-form">
        <Stack spacing="md">
          <Text size="xl" weight="bold">
            Solicitação de Reembolso de Despesa
          </Text>
          
          {/* Informações básicas */}
          <Grid>
            <Grid.Col span={6}>
              <ArchbaseEdit 
                label="Descrição da Despesa"
                dataSource={expenseDataSource}
                dataField="description"
                required
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <ArchbaseSelect 
                label="Categoria"
                dataSource={expenseDataSource}
                dataField="category"
                options={expenseCategories}
                required
              />
            </Grid.Col>
          </Grid>
          
          <Grid>
            <Grid.Col span={6}>
              <ArchbaseNumberEdit 
                label="Valor"
                dataSource={expenseDataSource}
                dataField="amount"
                dataType="currency"
                required
                onChange={(value) => setAmount(value || 0)}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <ArchbaseDatePickerEdit 
                label="Data da Despesa"
                dataSource={expenseDataSource}
                dataField="expenseDate"
                required
              />
            </Grid.Col>
          </Grid>
          
          {/* Validação de valor alto */}
          {amount > 20000 && !canRequestHighValue && (
            <Alert color="orange" icon={<IconAlertTriangle />}>
              Despesas acima de R$ 20.000 requerem permissão especial.
              Entre em contato com a diretoria.
            </Alert>
          )}
          
          {/* Mostrar fluxo de aprovação */}
          <ApprovalFlowPreview level={approvalLevel} amount={amount} />
          
          {/* Justificativa para valores altos */}
          {amount > 5000 && (
            <ArchbaseTextArea 
              label="Justificativa (obrigatória para valores acima de R$ 5.000)"
              dataSource={expenseDataSource}
              dataField="justification"
              rows={4}
              required
            />
          )}
          
          {/* Upload de comprovantes */}
          <FileUploadSection />
          
          <Group justify="flex-end">
            <Button variant="outline" onClick={() => saveDraft()}>
              Salvar Rascunho
            </Button>
            
            <Button 
              type="submit" 
              disabled={amount > 20000 && !canRequestHighValue}
              onClick={submitExpenseRequest}
            >
              Submeter Solicitação
            </Button>
          </Group>
        </Stack>
      </form>
    </ArchbaseSecurityProvider>
  );
}

function ApprovalFlowPreview({ level, amount }: { level: number; amount: number }) {
  const approvers = getApproversByLevel(level);
  
  return (
    <Card className="approval-flow-preview">
      <Text weight="bold" mb="sm">
        Fluxo de Aprovação (Nível {level})
      </Text>
      
      <Stepper active={0} breakpoint="sm">
        {approvers.map((approver, index) => (
          <Stepper.Step 
            key={index}
            label={approver.role}
            description={approver.name}
          />
        ))}
      </Stepper>
      
      <Text size="sm" color="dimmed" mt="sm">
        Valor: {formatCurrency(amount)} - Aprovação necessária até nível {level}
      </Text>
    </Card>
  );
}
```

---

## 🔧 Performance e Otimização

### Cache Inteligente de Permissões

```typescript
// security/optimized-security-manager.ts
class OptimizedSecurityManager extends ArchbaseSecurityManager {
  private permissionCache = new Map<string, { value: boolean; expires: number }>();
  private batchQueue: string[] = [];
  private batchTimeout: NodeJS.Timeout | null = null;
  
  constructor(
    private apiClient: SecurityAPIClient,
    private cacheConfig = {
      ttl: 5 * 60 * 1000, // 5 minutos
      batchSize: 10,
      batchDelay: 100 // 100ms
    }
  ) {
    super();
  }
  
  async hasPermission(permission: string): Promise<boolean> {
    // Verificar cache primeiro
    const cached = this.getCachedPermission(permission);
    if (cached !== null) {
      return cached;
    }
    
    // Adicionar à fila de batch
    if (!this.batchQueue.includes(permission)) {
      this.batchQueue.push(permission);
    }
    
    // Processar batch
    if (this.batchQueue.length >= this.cacheConfig.batchSize) {
      await this.processBatch();
    } else {
      this.scheduleBatchProcessing();
    }
    
    // Aguardar resultado (pode vir do cache após batch)
    return this.waitForPermission(permission);
  }
  
  private getCachedPermission(permission: string): boolean | null {
    const cached = this.permissionCache.get(permission);
    if (cached && cached.expires > Date.now()) {
      return cached.value;
    }
    return null;
  }
  
  private scheduleBatchProcessing() {
    if (this.batchTimeout) {
      clearTimeout(this.batchTimeout);
    }
    
    this.batchTimeout = setTimeout(() => {
      this.processBatch();
    }, this.cacheConfig.batchDelay);
  }
  
  private async processBatch() {
    if (this.batchQueue.length === 0) return;
    
    const permissions = [...this.batchQueue];
    this.batchQueue = [];
    
    try {
      const results = await this.apiClient.batchCheckPermissions(permissions);
      
      // Cachear resultados
      const expires = Date.now() + this.cacheConfig.ttl;
      Object.entries(results).forEach(([permission, granted]) => {
        this.permissionCache.set(permission, { value: granted, expires });
      });
      
    } catch (error) {
      console.error('Erro no batch de permissões:', error);
      // Cache negativo para evitar spam de requests
      permissions.forEach(permission => {
        this.permissionCache.set(permission, { 
          value: false, 
          expires: Date.now() + 30000 // 30 segundos
        });
      });
    }
  }
  
  private async waitForPermission(permission: string): Promise<boolean> {
    // Aguardar processamento do batch
    for (let i = 0; i < 50; i++) { // Max 5 segundos
      const cached = this.getCachedPermission(permission);
      if (cached !== null) {
        return cached;
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Fallback: requisição individual
    try {
      const result = await this.apiClient.checkPermission(permission);
      const expires = Date.now() + this.cacheConfig.ttl;
      this.permissionCache.set(permission, { value: result, expires });
      return result;
    } catch (error) {
      console.error('Erro ao verificar permissão individual:', error);
      return false;
    }
  }
  
  // Limpar cache quando necessário
  clearCache() {
    this.permissionCache.clear();
  }
  
  // Pré-carregar permissões comuns
  async preloadPermissions(permissions: string[]) {
    const uncached = permissions.filter(p => this.getCachedPermission(p) === null);
    if (uncached.length > 0) {
      this.batchQueue.push(...uncached);
      await this.processBatch();
    }
  }
}
```

### Hook Otimizado para Múltiplas Permissões

```typescript
// hooks/useOptimizedPermissions.ts
function useOptimizedPermissions(permissions: string[]) {
  const [permissionMap, setPermissionMap] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const security = useArchbaseSecurity();
  
  useEffect(() => {
    if (!security.isAvailable) {
      // Se segurança não está disponível, todas as permissões são true
      const allTrue = permissions.reduce((acc, permission) => {
        acc[permission] = true;
        return acc;
      }, {} as Record<string, boolean>);
      setPermissionMap(allTrue);
      setIsLoading(false);
      return;
    }
    
    loadPermissions();
  }, [permissions, security]);
  
  const loadPermissions = async () => {
    setIsLoading(true);
    
    try {
      // Usar batch se manager suporta
      if (security.manager && 'batchCheckPermissions' in security.manager) {
        const results = await (security.manager as any).batchCheckPermissions(permissions);
        setPermissionMap(results);
      } else {
        // Verificar individualmente
        const results: Record<string, boolean> = {};
        await Promise.all(
          permissions.map(async (permission) => {
            results[permission] = await security.hasPermission(permission);
          })
        );
        setPermissionMap(results);
      }
    } catch (error) {
      console.error('Erro ao carregar permissões:', error);
      // Em caso de erro, negar todas as permissões
      const allFalse = permissions.reduce((acc, permission) => {
        acc[permission] = false;
        return acc;
      }, {} as Record<string, boolean>);
      setPermissionMap(allFalse);
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    permissions: permissionMap,
    isLoading,
    hasPermission: (permission: string) => permissionMap[permission] || false,
    hasAllPermissions: (perms: string[]) => perms.every(p => permissionMap[p]),
    hasAnyPermission: (perms: string[]) => perms.some(p => permissionMap[p])
  };
}

// Uso do hook otimizado
function OptimizedComponent() {
  const {
    permissions,
    isLoading,
    hasPermission,
    hasAllPermissions,
    hasAnyPermission
  } = useOptimizedPermissions([
    'view_users',
    'edit_users',
    'delete_users',
    'view_reports',
    'export_data'
  ]);
  
  if (isLoading) {
    return <Skeleton height={200} />;
  }
  
  return (
    <div>
      {hasPermission('view_users') && <UsersList />}
      {hasAllPermissions(['view_reports', 'export_data']) && <ReportsSection />}
      {hasAnyPermission(['edit_users', 'delete_users']) && <UserActions />}
    </div>
  );
}
```

---

## 📊 Monitoramento e Analytics

### Sistema de Auditoria

```typescript
// monitoring/security-audit.ts
interface SecurityAuditEvent {
  id: string;
  userId: string;
  tenantId?: string;
  action: string;
  resource: string;
  permission: string;
  granted: boolean;
  timestamp: Date;
  metadata: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

class SecurityAuditLogger {
  private events: SecurityAuditEvent[] = [];
  private batchSize = 50;
  private flushInterval = 30000; // 30 segundos
  
  constructor(private apiClient: AuditAPIClient) {
    // Flush periódico
    setInterval(() => this.flush(), this.flushInterval);
    
    // Flush antes de fechar a página
    window.addEventListener('beforeunload', () => this.flush());
  }
  
  logPermissionCheck(
    permission: string,
    granted: boolean,
    context: {
      userId: string;
      resource: string;
      metadata?: Record<string, any>;
    }
  ) {
    const event: SecurityAuditEvent = {
      id: generateUUID(),
      userId: context.userId,
      action: 'permission_check',
      resource: context.resource,
      permission,
      granted,
      timestamp: new Date(),
      metadata: context.metadata || {},
      ipAddress: this.getClientIP(),
      userAgent: navigator.userAgent
    };
    
    this.events.push(event);
    
    if (this.events.length >= this.batchSize) {
      this.flush();
    }
  }
  
  logActionExecution(
    action: string,
    context: {
      userId: string;
      resource: string;
      success: boolean;
      metadata?: Record<string, any>;
    }
  ) {
    const event: SecurityAuditEvent = {
      id: generateUUID(),
      userId: context.userId,
      action: `action_${action}`,
      resource: context.resource,
      permission: action,
      granted: context.success,
      timestamp: new Date(),
      metadata: {
        ...context.metadata,
        execution_result: context.success ? 'success' : 'failed'
      }
    };
    
    this.events.push(event);
  }
  
  private async flush() {
    if (this.events.length === 0) return;
    
    const eventsToSend = [...this.events];
    this.events = [];
    
    try {
      await this.apiClient.sendAuditEvents(eventsToSend);
    } catch (error) {
      console.error('Erro ao enviar eventos de auditoria:', error);
      // Recolocar eventos na fila em caso de erro
      this.events.unshift(...eventsToSend);
    }
  }
  
  private getClientIP(): string {
    // Implementar detecção de IP do cliente
    return 'unknown';
  }
}
```

### Dashboard de Monitoramento

```typescript
// monitoring/security-dashboard.tsx
function SecurityMonitoringDashboard() {
  const [auditEvents, setAuditEvents] = useState<SecurityAuditEvent[]>([]);
  const [analytics, setAnalytics] = useState<SecurityAnalytics>();
  
  const canViewAudit = useArchbasePermissionCheck('view_security_audit');
  const canViewAnalytics = useArchbasePermissionCheck('view_security_analytics');
  
  useEffect(() => {
    if (canViewAudit) {
      loadAuditEvents();
    }
    if (canViewAnalytics) {
      loadAnalytics();
    }
  }, [canViewAudit, canViewAnalytics]);
  
  if (!canViewAudit && !canViewAnalytics) {
    return (
      <Alert color="red" icon={<IconLock />}>
        Você não tem permissão para visualizar dados de segurança
      </Alert>
    );
  }
  
  return (
    <div className="security-dashboard">
      <Text size="xl" weight="bold" mb="lg">
        Dashboard de Segurança
      </Text>
      
      <Tabs defaultValue="overview">
        <Tabs.List>
          {canViewAnalytics && <Tabs.Tab value="overview">Visão Geral</Tabs.Tab>}
          {canViewAudit && <Tabs.Tab value="audit">Auditoria</Tabs.Tab>}
          {canViewAnalytics && <Tabs.Tab value="users">Usuários</Tabs.Tab>}
          {canViewAnalytics && <Tabs.Tab value="permissions">Permissões</Tabs.Tab>}
        </Tabs.List>
        
        {canViewAnalytics && (
          <Tabs.Panel value="overview">
            <SecurityOverview analytics={analytics} />
          </Tabs.Panel>
        )}
        
        {canViewAudit && (
          <Tabs.Panel value="audit">
            <SecurityAuditGrid events={auditEvents} />
          </Tabs.Panel>
        )}
        
        {canViewAnalytics && (
          <Tabs.Panel value="users">
            <UserSecurityAnalytics />
          </Tabs.Panel>
        )}
        
        {canViewAnalytics && (
          <Tabs.Panel value="permissions">
            <PermissionAnalytics />
          </Tabs.Panel>
        )}
      </Tabs>
    </div>
  );
}

function SecurityAuditGrid({ events }: { events: SecurityAuditEvent[] }) {
  return (
    <ArchbaseDataGrid 
      dataSource={auditDataSource}
      resourceName="security_audit"
      
      columnSecurityOptions={{
        permissionPrefix: "audit_",
        defaultFallback: "Restrito"
      }}
    >
      <Columns>
        <ArchbaseDataGridColumn 
          dataField="timestamp" 
          header="Data/Hora" 
          dataType="datetime"
        />
        
        <ArchbaseDataGridColumn 
          dataField="userId" 
          header="Usuário" 
          dataType="text"
          viewPermission="view_user_details"
        />
        
        <ArchbaseDataGridColumn 
          dataField="action" 
          header="Ação" 
          dataType="text"
        />
        
        <ArchbaseDataGridColumn 
          dataField="resource" 
          header="Recurso" 
          dataType="text"
        />
        
        <ArchbaseDataGridColumn 
          dataField="permission" 
          header="Permissão" 
          dataType="text"
          viewPermission="view_permission_details"
        />
        
        <ArchbaseDataGridColumn 
          dataField="granted" 
          header="Status" 
          dataType="boolean"
          cellRenderer={({ value }) => (
            <Badge color={value ? 'green' : 'red'}>
              {value ? 'Permitido' : 'Negado'}
            </Badge>
          )}
        />
        
        <ArchbaseDataGridColumn 
          dataField="ipAddress" 
          header="IP" 
          dataType="text"
          viewPermission="view_ip_details"
          fallbackContent="***.***.***"
        />
      </Columns>
    </ArchbaseDataGrid>
  );
}
```

---

Este documento fornece exemplos avançados e práticos de como implementar o sistema de segurança do Archbase React v3 em cenários reais complexos. Cada exemplo pode ser adaptado às necessidades específicas do seu projeto.
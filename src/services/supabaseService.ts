import { supabase } from './authService';
import { RawMaterial, Product, FixedExpense, VariableExpense, Sale, RawMaterialPurchase, EmployeeCost } from '../types';

export class SupabaseService {
  // =============================================
  // INSUMOS (RAW MATERIALS)
  // =============================================
  
  async getRawMaterials(clientId: string): Promise<RawMaterial[]> {
    const { data, error } = await supabase
      .from('raw_materials')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar insumos:', error);
      throw new Error('Erro ao carregar insumos');
    }

    return data?.map(item => ({
      id: item.id,
      clientId: item.client_id,
      code: item.code,
      name: item.name,
      category: item.category,
      measurementUnit: item.measurement_unit,
      unitPrice: item.unit_price || 0,
      supplier: item.supplier,
      minimumStock: item.minimum_stock || 0,
      currentStock: item.current_stock || 0,
      createdAt: new Date(item.created_at),
      updatedAt: new Date(item.updated_at)
    })) || [];
  }

  async createRawMaterial(material: Omit<RawMaterial, 'id' | 'createdAt' | 'updatedAt'>): Promise<RawMaterial> {
    console.log('createRawMaterial chamado com:', material);
    
    const insertData = {
      client_id: material.clientId,
      code: material.code,
      name: material.name,
      category: material.category,
      measurement_unit: material.measurementUnit,
      unit_price: material.unitPrice,
      supplier: material.supplier,
      minimum_stock: material.minimumStock,
      current_stock: material.currentStock
    };
    
    console.log('Dados para inserção:', insertData);
    
    const { data, error } = await supabase
      .from('raw_materials')
      .insert([insertData])
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar insumo:', error);
      console.error('Detalhes do erro:', error.message, error.details, error.hint);
      throw new Error('Erro ao criar insumo');
    }

    console.log('Insumo criado com sucesso no banco:', data);

    const result = {
      id: data.id,
      clientId: data.client_id,
      code: data.code,
      name: data.name,
      category: data.category,
      measurementUnit: data.measurement_unit,
      unitPrice: data.unit_price,
      supplier: data.supplier,
      minimumStock: data.minimum_stock,
      currentStock: data.current_stock,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };

    console.log('Insumo retornado:', result);
    return result;
  }

  async updateRawMaterial(id: string, material: Partial<RawMaterial>): Promise<void> {
    const updateData: any = {};
    
    if (material.code !== undefined) updateData.code = material.code;
    if (material.name !== undefined) updateData.name = material.name;
    if (material.category !== undefined) updateData.category = material.category;
    if (material.measurementUnit !== undefined) updateData.measurement_unit = material.measurementUnit;
    if (material.unitPrice !== undefined) updateData.unit_price = material.unitPrice;
    if (material.supplier !== undefined) updateData.supplier = material.supplier;
    if (material.minimumStock !== undefined) updateData.minimum_stock = material.minimumStock;
    if (material.currentStock !== undefined) updateData.current_stock = material.currentStock;

    const { error } = await supabase
      .from('raw_materials')
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error('Erro ao atualizar insumo:', error);
      throw new Error('Erro ao atualizar insumo');
    }
  }

  async deleteRawMaterial(id: string): Promise<void> {
    const { error } = await supabase
      .from('raw_materials')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao deletar insumo:', error);
      throw new Error('Erro ao deletar insumo');
    }
  }

  // =============================================
  // PRODUTOS
  // =============================================
  
  async getProducts(clientId: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar produtos:', error);
      throw new Error('Erro ao carregar produtos');
    }

    return data?.map(item => ({
      id: item.id,
      clientId: item.client_id,
      name: item.name,
      category: item.category,
      description: item.description,
      portionYield: item.portion_yield,
      portionUnit: item.portion_unit,
      sellingPrice: item.selling_price,
      marginPercentage: item.margin_percentage || 30,
      ingredients: item.ingredients || [],
      createdAt: new Date(item.created_at),
      lastModified: new Date(item.last_modified)
    })) || [];
  }

  async createProduct(product: Omit<Product, 'id' | 'createdAt' | 'lastModified'>): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .insert([{
        client_id: product.clientId,
        name: product.name,
        category: product.category,
        description: product.description,
        portion_yield: product.portionYield,
        portion_unit: product.portionUnit,
        selling_price: product.sellingPrice,
        margin_percentage: product.marginPercentage || 30,
        ingredients: product.ingredients || []
      }])
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar produto:', error);
      throw new Error('Erro ao criar produto');
    }

    return {
      id: data.id,
      clientId: data.client_id,
      name: data.name,
      category: data.category,
      description: data.description,
      portionYield: data.portion_yield,
      portionUnit: data.portion_unit,
      sellingPrice: data.selling_price,
      marginPercentage: data.margin_percentage || 30,
      ingredients: data.ingredients || [],
      createdAt: new Date(data.created_at),
      lastModified: new Date(data.last_modified)
    };
  }

  async updateProduct(id: string, product: Partial<Product>): Promise<void> {
    const updateData: any = {};
    
    if (product.name !== undefined) updateData.name = product.name;
    if (product.category !== undefined) updateData.category = product.category;
    if (product.description !== undefined) updateData.description = product.description;
    if (product.portionYield !== undefined) updateData.portion_yield = product.portionYield;
    if (product.portionUnit !== undefined) updateData.portion_unit = product.portionUnit;
    if (product.sellingPrice !== undefined) updateData.selling_price = product.sellingPrice;
    if (product.marginPercentage !== undefined) updateData.margin_percentage = product.marginPercentage;
    if (product.ingredients !== undefined) updateData.ingredients = product.ingredients;

    const { error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error('Erro ao atualizar produto:', error);
      throw new Error('Erro ao atualizar produto');
    }
  }

  async deleteProduct(id: string): Promise<void> {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao deletar produto:', error);
      throw new Error('Erro ao deletar produto');
    }
  }

  // =============================================
  // DESPESAS FIXAS
  // =============================================
  
  async getFixedExpenses(clientId: string): Promise<FixedExpense[]> {
    const { data, error } = await supabase
      .from('fixed_expenses')
      .select('*')
      .eq('client_id', clientId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar despesas fixas:', error);
      throw new Error('Erro ao carregar despesas fixas');
    }

    return data?.map(item => ({
      id: item.id,
      clientId: item.client_id,
      name: item.name,
      category: item.category,
      amount: item.amount,
      frequency: item.frequency,
      dueDate: item.due_date,
      description: item.description,
      isActive: item.is_active,
      createdAt: new Date(item.created_at),
      updatedAt: new Date(item.updated_at)
    })) || [];
  }

  async createFixedExpense(expense: Omit<FixedExpense, 'id' | 'createdAt' | 'updatedAt'>): Promise<FixedExpense> {
    const { data, error } = await supabase
      .from('fixed_expenses')
      .insert([{
        client_id: expense.clientId,
        name: expense.name,
        category: expense.category,
        amount: expense.amount,
        frequency: expense.frequency,
        due_date: expense.dueDate,
        description: expense.description,
        is_active: expense.isActive
      }])
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar despesa fixa:', error);
      throw new Error('Erro ao criar despesa fixa');
    }

    return {
      id: data.id,
      clientId: data.client_id,
      name: data.name,
      category: data.category,
      amount: data.amount,
      frequency: data.frequency,
      dueDate: data.due_date,
      description: data.description,
      isActive: data.is_active,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  }

  async updateFixedExpense(id: string, expense: Partial<FixedExpense>): Promise<void> {
    const updateData: any = {};
    
    if (expense.name !== undefined) updateData.name = expense.name;
    if (expense.category !== undefined) updateData.category = expense.category;
    if (expense.amount !== undefined) updateData.amount = expense.amount;
    if (expense.frequency !== undefined) updateData.frequency = expense.frequency;
    if (expense.dueDate !== undefined) updateData.due_date = expense.dueDate;
    if (expense.description !== undefined) updateData.description = expense.description;
    if (expense.isActive !== undefined) updateData.is_active = expense.isActive;

    const { error } = await supabase
      .from('fixed_expenses')
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error('Erro ao atualizar despesa fixa:', error);
      throw new Error('Erro ao atualizar despesa fixa');
    }
  }

  async deleteFixedExpense(id: string): Promise<void> {
    const { error } = await supabase
      .from('fixed_expenses')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao deletar despesa fixa:', error);
      throw new Error('Erro ao deletar despesa fixa');
    }
  }

  // =============================================
  // DESPESAS VARIÁVEIS
  // =============================================
  
  async getVariableExpenses(clientId: string): Promise<VariableExpense[]> {
    const { data, error } = await supabase
      .from('variable_expenses')
      .select('*')
      .eq('client_id', clientId)
      .order('expense_date', { ascending: false });

    if (error) {
      console.error('Erro ao buscar despesas variáveis:', error);
      throw new Error('Erro ao carregar despesas variáveis');
    }

    return data?.map(item => ({
      id: item.id,
      clientId: item.client_id,
      name: item.name,
      category: item.category,
      amount: item.amount,
      expenseDate: new Date(item.expense_date),
      description: item.description,
      createdAt: new Date(item.created_at)
    })) || [];
  }

  async createVariableExpense(expense: Omit<VariableExpense, 'id' | 'createdAt'>): Promise<VariableExpense> {
    const { data, error } = await supabase
      .from('variable_expenses')
      .insert([{
        client_id: expense.clientId,
        name: expense.name,
        category: expense.category,
        amount: expense.amount,
        expense_date: expense.expenseDate.toISOString().split('T')[0],
        description: expense.description
      }])
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar despesa variável:', error);
      throw new Error('Erro ao criar despesa variável');
    }

    return {
      id: data.id,
      clientId: data.client_id,
      name: data.name,
      category: data.category,
      amount: data.amount,
      expenseDate: new Date(data.expense_date),
      description: data.description,
      createdAt: new Date(data.created_at)
    };
  }

  async updateVariableExpense(id: string, expense: Partial<VariableExpense>): Promise<void> {
    const updateData: any = {};
    
    if (expense.name !== undefined) updateData.name = expense.name;
    if (expense.category !== undefined) updateData.category = expense.category;
    if (expense.amount !== undefined) updateData.amount = expense.amount;
    if (expense.expenseDate !== undefined) updateData.expense_date = expense.expenseDate.toISOString().split('T')[0];
    if (expense.description !== undefined) updateData.description = expense.description;

    const { error } = await supabase
      .from('variable_expenses')
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error('Erro ao atualizar despesa variável:', error);
      throw new Error('Erro ao atualizar despesa variável');
    }
  }

  async deleteVariableExpense(id: string): Promise<void> {
    const { error } = await supabase
      .from('variable_expenses')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao deletar despesa variável:', error);
      throw new Error('Erro ao deletar despesa variável');
    }
  }

  // =============================================
  // VENDAS
  // =============================================
  
  async getSales(clientId: string): Promise<Sale[]> {
    const { data, error } = await supabase
      .from('sales')
      .select('*')
      .eq('client_id', clientId)
      .order('sale_date', { ascending: false });

    if (error) {
      console.error('Erro ao buscar vendas:', error);
      throw new Error('Erro ao carregar vendas');
    }

    return data?.map(item => ({
      id: item.id,
      clientId: item.client_id,
      saleDate: new Date(item.sale_date),
      totalSales: item.total_sales,
      numberOfOrders: item.number_of_orders,
      averageTicket: item.average_ticket,
      notes: item.notes,
      createdAt: new Date(item.created_at)
    })) || [];
  }

  async createSale(sale: Omit<Sale, 'id' | 'createdAt'>): Promise<Sale> {
    const { data, error } = await supabase
      .from('sales')
      .insert([{
        client_id: sale.clientId,
        sale_date: sale.saleDate.toISOString().split('T')[0],
        total_sales: sale.totalSales,
        number_of_orders: sale.numberOfOrders,
        average_ticket: sale.averageTicket,
        notes: sale.notes
      }])
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar venda:', error);
      throw new Error('Erro ao criar venda');
    }

    return {
      id: data.id,
      clientId: data.client_id,
      saleDate: new Date(data.sale_date),
      totalSales: data.total_sales,
      numberOfOrders: data.number_of_orders,
      averageTicket: data.average_ticket,
      notes: data.notes,
      createdAt: new Date(data.created_at)
    };
  }

  async updateSale(id: string, sale: Partial<Sale>): Promise<void> {
    const updateData: any = {};
    
    if (sale.saleDate !== undefined) updateData.sale_date = sale.saleDate.toISOString().split('T')[0];
    if (sale.totalSales !== undefined) updateData.total_sales = sale.totalSales;
    if (sale.numberOfOrders !== undefined) updateData.number_of_orders = sale.numberOfOrders;
    if (sale.averageTicket !== undefined) updateData.average_ticket = sale.averageTicket;
    if (sale.notes !== undefined) updateData.notes = sale.notes;

    const { error } = await supabase
      .from('sales')
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error('Erro ao atualizar venda:', error);
      throw new Error('Erro ao atualizar venda');
    }
  }

  async deleteSale(id: string): Promise<void> {
    const { error } = await supabase
      .from('sales')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao deletar venda:', error);
      throw new Error('Erro ao deletar venda');
    }
  }

  // =============================================
  // COMPRAS DE INSUMOS (RAW MATERIAL PURCHASES)
  // =============================================
  
  async getRawMaterialPurchases(clientId: string): Promise<RawMaterialPurchase[]> {
    const { data, error } = await supabase
      .from('raw_material_purchases')
      .select('*')
      .eq('client_id', clientId)
      .order('purchase_date', { ascending: false });

    if (error) {
      console.error('Erro ao buscar compras de insumos:', error);
      throw new Error('Erro ao carregar compras de insumos');
    }

    return data?.map(item => ({
      id: item.id,
      clientId: item.client_id,
      rawMaterialId: item.raw_material_id,
      quantity: item.quantity,
      unitPrice: item.unit_price,
      totalCost: item.total_cost,
      purchaseDate: new Date(item.purchase_date),
      supplier: item.supplier,
      paymentMethod: item.payment_method,
      receipt: item.receipt,
      notes: item.notes,
      createdAt: new Date(item.created_at)
    })) || [];
  }

  async createRawMaterialPurchase(purchase: Omit<RawMaterialPurchase, 'id' | 'createdAt'>): Promise<RawMaterialPurchase> {
    const { data, error } = await supabase
      .from('raw_material_purchases')
      .insert([{
        client_id: purchase.clientId,
        raw_material_id: purchase.rawMaterialId,
        quantity: purchase.quantity,
        unit_price: purchase.unitPrice,
        total_cost: purchase.totalCost,
        purchase_date: purchase.purchaseDate.toISOString().split('T')[0],
        supplier: purchase.supplier,
        payment_method: purchase.paymentMethod,
        receipt: purchase.receipt,
        notes: purchase.notes
      }])
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar compra de insumo:', error);
      throw new Error('Erro ao criar compra de insumo');
    }

    return {
      id: data.id,
      clientId: data.client_id,
      rawMaterialId: data.raw_material_id,
      quantity: data.quantity,
      unitPrice: data.unit_price,
      totalCost: data.total_cost,
      purchaseDate: new Date(data.purchase_date),
      supplier: data.supplier,
      paymentMethod: data.payment_method,
      receipt: data.receipt,
      notes: data.notes,
      createdAt: new Date(data.created_at)
    };
  }

  async updateRawMaterialPurchase(id: string, purchase: Partial<RawMaterialPurchase>): Promise<void> {
    const updateData: any = {};
    
    if (purchase.rawMaterialId !== undefined) updateData.raw_material_id = purchase.rawMaterialId;
    if (purchase.quantity !== undefined) updateData.quantity = purchase.quantity;
    if (purchase.unitPrice !== undefined) updateData.unit_price = purchase.unitPrice;
    if (purchase.totalCost !== undefined) updateData.total_cost = purchase.totalCost;
    if (purchase.purchaseDate !== undefined) updateData.purchase_date = purchase.purchaseDate.toISOString().split('T')[0];
    if (purchase.supplier !== undefined) updateData.supplier = purchase.supplier;
    if (purchase.paymentMethod !== undefined) updateData.payment_method = purchase.paymentMethod;
    if (purchase.receipt !== undefined) updateData.receipt = purchase.receipt;
    if (purchase.notes !== undefined) updateData.notes = purchase.notes;

    const { error } = await supabase
      .from('raw_material_purchases')
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error('Erro ao atualizar compra de insumo:', error);
      throw new Error('Erro ao atualizar compra de insumo');
    }
  }

  async deleteRawMaterialPurchase(id: string): Promise<void> {
    const { error } = await supabase
      .from('raw_material_purchases')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao deletar compra de insumo:', error);
      throw new Error('Erro ao deletar compra de insumo');
    }
  }

  // =============================================
  // CUSTOS DE FUNCIONÁRIOS (EMPLOYEE COSTS)
  // =============================================
  
  async getEmployeeCosts(clientId: string): Promise<EmployeeCost[]> {
    const { data, error } = await supabase
      .from('employee_costs')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar custos de funcionários:', error);
      throw new Error('Erro ao carregar custos de funcionários');
    }

    return data?.map(item => ({
      id: item.id,
      clientId: item.client_id,
      professional: item.professional,
      hourlyCost: item.hourly_cost,
      averageSalary: item.average_salary,
      benefits: item.benefits,
      fgts: item.fgts,
      vacationAllowance: item.vacation_allowance,
      vacationBonus: item.vacation_bonus,
      fgtsVacationBonus: item.fgts_vacation_bonus,
      thirteenthSalary: item.thirteenth_salary,
      fgtsThirteenth: item.fgts_thirteenth,
      noticePeriod: item.notice_period,
      fgtsNoticePeriod: item.fgts_notice_period,
      fgtsPenalty: item.fgts_penalty,
      createdAt: new Date(item.created_at),
      updatedAt: new Date(item.updated_at)
    })) || [];
  }

  async createEmployeeCost(employeeCost: Omit<EmployeeCost, 'id' | 'createdAt' | 'updatedAt'>): Promise<EmployeeCost> {
    const { data, error } = await supabase
      .from('employee_costs')
      .insert([{
        client_id: employeeCost.clientId,
        professional: employeeCost.professional,
        hourly_cost: employeeCost.hourlyCost,
        average_salary: employeeCost.averageSalary,
        benefits: employeeCost.benefits,
        fgts: employeeCost.fgts,
        vacation_allowance: employeeCost.vacationAllowance,
        vacation_bonus: employeeCost.vacationBonus,
        fgts_vacation_bonus: employeeCost.fgtsVacationBonus,
        thirteenth_salary: employeeCost.thirteenthSalary,
        fgts_thirteenth: employeeCost.fgtsThirteenth,
        notice_period: employeeCost.noticePeriod,
        fgts_notice_period: employeeCost.fgtsNoticePeriod,
        fgts_penalty: employeeCost.fgtsPenalty
      }])
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar custo de funcionário:', error);
      throw new Error('Erro ao criar custo de funcionário');
    }

    return {
      id: data.id,
      clientId: data.client_id,
      professional: data.professional,
      hourlyCost: data.hourly_cost,
      averageSalary: data.average_salary,
      benefits: data.benefits,
      fgts: data.fgts,
      vacationAllowance: data.vacation_allowance,
      vacationBonus: data.vacation_bonus,
      fgtsVacationBonus: data.fgts_vacation_bonus,
      thirteenthSalary: data.thirteenth_salary,
      fgtsThirteenth: data.fgts_thirteenth,
      noticePeriod: data.notice_period,
      fgtsNoticePeriod: data.fgts_notice_period,
      fgtsPenalty: data.fgts_penalty,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  }

  async updateEmployeeCost(id: string, employeeCost: Partial<EmployeeCost>): Promise<void> {
    const updateData: any = {};
    
    if (employeeCost.professional !== undefined) updateData.professional = employeeCost.professional;
    if (employeeCost.hourlyCost !== undefined) updateData.hourly_cost = employeeCost.hourlyCost;
    if (employeeCost.averageSalary !== undefined) updateData.average_salary = employeeCost.averageSalary;
    if (employeeCost.benefits !== undefined) updateData.benefits = employeeCost.benefits;
    if (employeeCost.fgts !== undefined) updateData.fgts = employeeCost.fgts;
    if (employeeCost.vacationAllowance !== undefined) updateData.vacation_allowance = employeeCost.vacationAllowance;
    if (employeeCost.vacationBonus !== undefined) updateData.vacation_bonus = employeeCost.vacationBonus;
    if (employeeCost.fgtsVacationBonus !== undefined) updateData.fgts_vacation_bonus = employeeCost.fgtsVacationBonus;
    if (employeeCost.thirteenthSalary !== undefined) updateData.thirteenth_salary = employeeCost.thirteenthSalary;
    if (employeeCost.fgtsThirteenth !== undefined) updateData.fgts_thirteenth = employeeCost.fgtsThirteenth;
    if (employeeCost.noticePeriod !== undefined) updateData.notice_period = employeeCost.noticePeriod;
    if (employeeCost.fgtsNoticePeriod !== undefined) updateData.fgts_notice_period = employeeCost.fgtsNoticePeriod;
    if (employeeCost.fgtsPenalty !== undefined) updateData.fgts_penalty = employeeCost.fgtsPenalty;

    const { error } = await supabase
      .from('employee_costs')
      .update(updateData)
      .eq('id', id);

    if (error) {
      console.error('Erro ao atualizar custo de funcionário:', error);
      throw new Error('Erro ao atualizar custo de funcionário');
    }
  }

  async deleteEmployeeCost(id: string): Promise<void> {
    const { error } = await supabase
      .from('employee_costs')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao deletar custo de funcionário:', error);
      throw new Error('Erro ao deletar custo de funcionário');
    }
  }
}

export const supabaseService = new SupabaseService();

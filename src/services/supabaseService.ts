import { supabase } from './authService';
import { RawMaterial, Product, FixedExpense, VariableExpense, Sale } from '../types';

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
    const { data, error } = await supabase
      .from('raw_materials')
      .insert([{
        client_id: material.clientId,
        code: material.code,
        name: material.name,
        category: material.category,
        measurement_unit: material.measurementUnit,
        unit_price: material.unitPrice,
        supplier: material.supplier,
        minimum_stock: material.minimumStock,
        current_stock: material.currentStock
      }])
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar insumo:', error);
      throw new Error('Erro ao criar insumo');
    }

    return {
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
}

export const supabaseService = new SupabaseService();

import React, { useState } from 'react';
import { Product } from '../types';
import ProductForm from './ProductForm';
import ProductList from './ProductList';
import { Plus, Package } from 'lucide-react';

interface SettingsProps {
  products: Product[];
  onAddProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  onUpdateProduct: (id: string, product: Omit<Product, 'id' | 'createdAt'>) => void;
  onDeleteProduct: (id: string) => void;
}

export default function Settings({ products, onAddProduct, onUpdateProduct, onDeleteProduct }: SettingsProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleAddProduct = (productData: Omit<Product, 'id' | 'createdAt'>) => {
    onAddProduct(productData);
    setShowForm(false);
  };

  const handleUpdateProduct = (productData: Omit<Product, 'id' | 'createdAt'>) => {
    if (editingProduct) {
      onUpdateProduct(editingProduct.id, productData);
      setEditingProduct(null);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Configurações</h2>
          <p className="text-gray-600">Gerencie seus produtos e calcule os custos</p>
        </div>
        
        {!showForm && !editingProduct && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Produto
          </button>
        )}
      </div>

      {/* Product Form */}
      {(showForm || editingProduct) && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <ProductForm
            product={editingProduct}
            onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}
            onCancel={editingProduct ? handleCancelEdit : () => setShowForm(false)}
          />
        </div>
      )}

      {/* Product List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Package className="h-5 w-5 mr-2 text-gray-600" />
            Produtos Cadastrados ({products.length})
          </h3>
        </div>
        
        <ProductList
          products={products}
          onEdit={handleEdit}
          onDelete={onDeleteProduct}
        />
      </div>
    </div>
  );
}
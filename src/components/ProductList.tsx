import React from 'react';
import { Product } from '../types';
import { Edit2, Trash2, Package, Calendar, Hash } from 'lucide-react';
import { calculateProductCost } from '../utils/calculations';

interface ProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export default function ProductList({ products, onEdit, onDelete }: ProductListProps) {
  if (products.length === 0) {
    return (
      <div className="p-8 text-center">
        <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 mb-2">Nenhum produto cadastrado ainda</p>
        <p className="text-sm text-gray-500">Clique em "Novo Produto" para começar</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {products.map((product) => {
        const costs = calculateProductCost(product);
        
        return (
          <div key={product.id} className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <Hash className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-mono text-gray-600">{product.code}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {product.category}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-600 mb-1">Rendimento</p>
                    <p className="font-semibold text-gray-900">
                      {product.portionYield} {product.portionUnit}
                    </p>
                  </div>
                  
                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-600 mb-1">Custo Total Insumos</p>
                    <p className="font-semibold text-gray-900">
                      R$ {costs.totalIngredientsCost.toFixed(2)}
                    </p>
                  </div>
                  
                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-600 mb-1">Margem Segurança (10%)</p>
                    <p className="font-semibold text-gray-900">
                      R$ {costs.safetyMargin.toFixed(2)}
                    </p>
                  </div>
                  
                  <div className="bg-orange-100 p-3 rounded-lg border border-orange-300">
                    <p className="text-xs text-orange-700 mb-1">Custo por {product.portionUnit}</p>
                    <p className="font-bold text-orange-600">
                      R$ {costs.costPerPortionOrKg.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Precificação:</p>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Preço Sugerido:</span>
                        <span className="font-medium">R$ {product.pricing.suggestedPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Preço Praticado:</span>
                        <span className="font-medium">R$ {product.pricing.practicalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Despesas:</p>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Fixas:</span>
                        <span className="font-medium">R$ {product.pricing.fixedExpenses.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Variáveis:</span>
                        <span className="font-medium">R$ {product.pricing.variableExpenses.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Resultado:</p>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Lucro:</span>
                        <span className="font-medium text-green-600">R$ {product.pricing.profit.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Última alteração: {product.lastModified.toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Package className="h-4 w-4" />
                    <span>{product.ingredients.length} ingredientes</span>
                  </div>
                </div>

                <div className="mt-3">
                  <p className="text-sm text-gray-600 mb-2">Principais ingredientes:</p>
                  <div className="flex flex-wrap gap-2">
                    {product.ingredients.slice(0, 4).map((ingredient) => (
                      <span
                        key={ingredient.id}
                        className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-800"
                      >
                        {ingredient.name} ({ingredient.netQuantity}{ingredient.measurementUnit})
                      </span>
                    ))}
                    {product.ingredients.length > 4 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-800">
                        +{product.ingredients.length - 4} mais
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex space-x-2 ml-4">
                <button
                  onClick={() => onEdit(product)}
                  className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-colors"
                  title="Editar produto"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
                      onDelete(product.id);
                    }
                  }}
                  className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-colors"
                  title="Excluir produto"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
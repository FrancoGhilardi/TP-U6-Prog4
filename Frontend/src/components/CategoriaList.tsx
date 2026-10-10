import { MESSAGES } from "../constants/messages";
import type { Categoria } from "../types/categoria";
import CategoriaCard from "./CategoriaCard";

interface CategoriaListProps {
  categorias: Categoria[];
  onEdit: (categoria: Categoria) => void;
  onDelete: (categoria: Categoria) => void;
}

const CategoriaList = ({
  categorias,
  onEdit,
  onDelete,
}: CategoriaListProps) => {
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow">
      <table className="w-full text-left">
        <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
          <tr>
            <th scope="col" className="w-28 px-6 py-3">
              Número
            </th>
            <th scope="col" className="w-56 px-6 py-3">
              Nombre
            </th>
            <th scope="col" className="px-6 py-3">
              Descripción
            </th>
            <th scope="col" className="px-6 py-3 text-right">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {categorias.length === 0 ? (
            <tr className="border-t border-gray-100">
              <td
                colSpan={4}
                className="px-6 py-8 text-center text-sm text-gray-500"
              >
                {MESSAGES.sinCategorias}
              </td>
            </tr>
          ) : (
            categorias.map((categoria) => (
              <CategoriaCard
                key={categoria.id}
                categoria={categoria}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CategoriaList;

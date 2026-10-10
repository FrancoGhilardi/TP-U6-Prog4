import type { Categoria } from "../types/categoria";
import Button from "./Button";

interface CategoriaCardProps {
  categoria: Categoria;
  onEdit: (categoria: Categoria) => void;
  onDelete: (categoria: Categoria) => void;
}

const CategoriaCard = ({ categoria, onEdit, onDelete }: CategoriaCardProps) => {
  return (
    <tr className="border-t border-gray-100 hover:bg-gray-50">
      <td className="px-6 py-4 text-sm text-gray-500">{categoria.id}</td>
      <td className="px-6 py-4 text-sm font-medium text-gray-900">
        {categoria.nombre}
      </td>
      <td className="px-6 py-4 text-sm text-gray-700">
        {categoria.descripcion}
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex justify-end gap-4">
          <Button variant="link" onClick={() => onEdit(categoria)}>
            Editar
          </Button>
          <Button variant="linkDanger" onClick={() => onDelete(categoria)}>
            Eliminar
          </Button>
        </div>
      </td>
    </tr>
  );
};

export default CategoriaCard;

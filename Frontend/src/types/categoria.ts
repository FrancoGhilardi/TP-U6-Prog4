export interface Categoria {
  id: number;
  nombre: string;
  descripcion: string;
}

export type CategoriaFormData = Omit<Categoria, "id">;

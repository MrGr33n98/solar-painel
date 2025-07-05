import { z } from 'zod';

export const ProductSchema = z.object({
  name: z.string().min(3, "Nome do produto deve ter pelo menos 3 caracteres.").max(255, "Nome do produto não pode exceder 255 caracteres."),
  description: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres.").max(1000, "Descrição não pode exceder 1000 caracteres."),
  price: z.number().positive("Preço deve ser um número positivo."),
  vendorId: z.string().cuid("ID do vendedor inválido."), // Assuming cuid for vendorId
  images: z.array(z.string().url("URL de imagem inválida.")).optional(),
});

export type ProductSchemaType = z.infer<typeof ProductSchema>;

import { z } from 'zod'

export const propertySchema = z.object({
  title: z.string().min(5, 'ชื่อต้องมีอย่างน้อย 5 ตัวอักษร'),
  description: z.string().min(20),
  type: z.enum(['condo', 'house', 'townhouse', 'land']),
  status: z.enum(['for_sale', 'for_rent']),
  price: z.number().positive('ราคาต้องมากกว่า 0'),
  area: z.number().positive(),
  bedrooms: z.number().int().min(0),
  bathrooms: z.number().int().min(0),
  province: z.string().min(1),
  district: z.string().min(1),
  address: z.string(),
})

export type PropertyFormData = z.infer<typeof propertySchema>
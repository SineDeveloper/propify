import { z } from 'zod'

export const propertySchema = z.object({
  title: z.string().min(5, 'ชื่อต้องมีอย่างน้อย 5 ตัวอักษร'),
  description: z.string().min(20, 'คำอธิบายต้องมีอย่างน้อย 20 ตัวอักษร'),
  type: z.enum(['condo', 'house', 'townhouse', 'land']),
  status: z.enum(['for_sale', 'for_rent']),
  price: z.number().positive('ราคาต้องมากกว่า 0'),
  area: z.number().positive('กรุณาระบุขนาดพื้นที่'),
  bedrooms: z.number().int().min(0),
  bathrooms: z.number().int().min(0),
  province: z.string().min(1, 'กรุณาเลือกจังหวัด'),
  district: z.string().min(1, 'กรุณาระบุเขต/อำเภอ'),
  address: z.string().optional().default(''),
  lat: z.number().optional(),
  lng: z.number().optional(),
})

export type PropertyFormData = z.infer<typeof propertySchema>
const {z} = require('zod')

const registerSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(3, 'min length for first name is 3')
    .max(15, 'max length for first name is 15'),

  lastName: z
    .string()
    .trim()
    .min(3, 'min length for last name is 3')
    .max(15, 'max length for last name is 15'),

  phone: z
    .string()
    .trim()
    .regex(
      /^(?:\+212|0)[5-7][0-9]{8}$/,
      'please provide a valid phone number'
    ),

  email: z
    .email('please provide a valid email')
    .trim(),

  password: z
    .string()
    .min(8, 'password must be at least 8 characters')
    .regex(/[A-Z]/, 'password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'password must contain at least one number')
    .regex(
      /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/,
      'password must contain at least one special character'
    ),

  role: z
    .enum(['seller', 'user']).optional(),
});

const loginSchema = z.object({
  email: z.email('please provide a valid email'),
  password: z.string().min(1, 'please provide a password'),
});

const createProductSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, 'min length for name is 3')
    .max(50, 'max length for name is 50'),

  description: z
    .string()
    .min(20, 'min length for description is 20')
    .max(3000, 'max length for description is 3000'),

  price: z
    .number()
    .min(0, 'price cannot be negative'),

  stock: z
    .number()
    .min(0, 'stock cannot be negative'),

  image: z
    .string()
    .min(1, 'please provide the image of the product'),

  category: z.enum([
    'console',
    'laptop',
    'setup',
    'accessory',
    'video_game'
  ]),
});

const createOrderSchema = z.object({
  item: z.array(
    z.object({
      product: z.string(),
      amount: z.number().int().min(1),
    })
  ).min(1, 'you have no order'),

  shippingType: z.enum([
    'cash on dilevery',
    'bank payement',
  ]),

  shippingAddress: z.object({
    fullName: z
      .string()
      .min(6, 'minimum characters is 6')
      .max(30, 'maximum characters is 30'),

    phone: z
      .string()
      .regex(
        /^(?:\+212|0)[5-7][0-9]{8}$/,
        'please provide a valid phone number'
      ),

    emailAddress: z
      .string()
      .email('Please provide a valid email'),

    address: z
      .string()
      .min(10, 'minimum characters is 10')
      .max(50, 'maximum characters is 50'),

    city: z.enum([
      'Casablanca',
      'Rabat',
      'Marrakech',
      'Tangier',
      'Fes',
      'Agadir',
      'Meknes',
      'Oujda',
      'Kenitra',
      'Tetouan',
      'Safi',
      'El Jadida',
      'Sale',
    ]),

    postalCode: z.union([
  z.string(),
  z.number()
]).optional(),
  }),
});

const addToCartSchema = z.object({
  item: z.array(
    z.object({
      product: z
        .string()
        .regex(/^[0-9a-fA-F]{24}$/, 'invalid product id'),

      amount: z
        .number()
        .int()
        .min(1, 'amount must be at least 1'),
    })
  ).min(1, 'cart cannot be empty'),
});


const supportSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, 'name must be at least 3 characters')
    .max(50, 'name cannot exceed 50 characters'),

  email: z
    .string()
    .trim()
    .email('please provide a valid email'),

  message: z
    .string()
    .trim()
    .min(10, 'message must be at least 10 characters')
    .max(2000, 'message cannot exceed 2000 characters'),
});

const stripePaymentSchema = z.object({
  item: z.array(
    z.object({
      orderId: z.string().regex(
        /^[0-9a-fA-F]{24}$/,
        'invalid order id'
      )
    })
  ).min(1, 'please provide information')
});

const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, 'password must be at least 8 characters')
    .regex(/[A-Z]/, 'password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'password must contain at least one number')
    .regex(
      /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/,
      'password must contain at least one special character'
    ),
});

module.exports={
    registerSchema,
    loginSchema,
    createProductSchema,
    createOrderSchema, 
    resetPasswordSchema,
    addToCartSchema,
    supportSchema,
    stripePaymentSchema
}
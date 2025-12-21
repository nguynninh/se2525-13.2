import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';

export const registerCartOpenApi = (registry: OpenAPIRegistry) => {
    // Register Cart schemas
    registry.registerComponent('schemas', 'CartItemImage', {
        type: 'object',
        properties: {
            id: { type: 'string', format: 'uuid', description: 'Image ID' },
            image_url: { type: 'string', description: 'Image URL' },
            is_main: { type: 'boolean', description: 'Whether this is the main image' },
        },
    });

    registry.registerComponent('schemas', 'CartItemProduct', {
        type: 'object',
        properties: {
            id: { type: 'string', format: 'uuid', description: 'Product ID' },
            name: { type: 'string', description: 'Product name' },
            slug: { type: 'string', description: 'Product slug' },
            sku: { type: 'string', nullable: true, description: 'Product SKU' },
            description: { type: 'string', nullable: true, description: 'Product description' },
            price: { type: 'number', description: 'Product price' },
            quantity: { type: 'integer', description: 'Product stock quantity' },
            status: { type: 'string', description: 'Product status' },
            images: { type: 'array', items: { $ref: '#/components/schemas/CartItemImage' }, description: 'Product images' },
        },
    });

    registry.registerComponent('schemas', 'CartItem', {
        type: 'object',
        properties: {
            id: { type: 'string', format: 'uuid', description: 'Cart item ID' },
            cart_id: { type: 'string', format: 'uuid', description: 'Cart ID' },
            product_id: { type: 'string', format: 'uuid', description: 'Product ID' },
            quantity: { type: 'integer', description: 'Item quantity' },
            unit_price: { type: 'number', description: 'Unit price' },
            total_price: { type: 'number', description: 'Total price for this item' },
            product: { $ref: '#/components/schemas/CartItemProduct', description: 'Product details' },
            created_at: { type: 'string', format: 'date-time', description: 'Creation date' },
            updated_at: { type: 'string', format: 'date-time', description: 'Last update date' },
        },
    });

    registry.registerComponent('schemas', 'CartShop', {
        type: 'object',
        properties: {
            id: { type: 'string', format: 'uuid', description: 'Shop ID' },
            name: { type: 'string', description: 'Shop name' },
            slug: { type: 'string', description: 'Shop slug' },
            description: { type: 'string', nullable: true, description: 'Shop description' },
            logo_url: { type: 'string', nullable: true, description: 'Shop logo URL' },
            status: { type: 'string', enum: ['active', 'suspended', 'closed'], description: 'Shop status' },
        },
    });

    registry.registerComponent('schemas', 'Cart', {
        type: 'object',
        properties: {
            id: { type: 'string', format: 'uuid', description: 'Cart ID' },
            user_id: { type: 'string', format: 'uuid', description: 'User ID' },
            shop_id: { type: 'string', format: 'uuid', nullable: true, description: 'Shop ID (null if cart is empty)' },
            total_items: { type: 'integer', description: 'Total number of items in cart' },
            total_price: { type: 'number', description: 'Total price of all items' },
            cart_items: { type: 'array', items: { $ref: '#/components/schemas/CartItem' }, description: 'Cart items' },
            shop: { $ref: '#/components/schemas/CartShop', nullable: true, description: 'Shop details (null if cart is empty)' },
            created_at: { type: 'string', format: 'date-time', description: 'Creation date' },
            updated_at: { type: 'string', format: 'date-time', description: 'Last update date' },
        },
    });

    registry.registerComponent('schemas', 'CartSummary', {
        type: 'object',
        properties: {
            total_items: { type: 'integer', description: 'Total number of items in cart' },
            total_price: { type: 'number', description: 'Total price of all items' },
            items_count: { type: 'integer', description: 'Number of different items in cart' },
        },
    });

    registry.registerComponent('schemas', 'AddToCartRequest', {
        type: 'object',
        required: ['product_id', 'quantity'],
        properties: {
            product_id: { type: 'string', format: 'uuid', description: 'Product ID to add to cart' },
            quantity: { type: 'integer', minimum: 1, description: 'Quantity to add' },
        },
    });

    registry.registerComponent('schemas', 'UpdateCartItemRequest', {
        type: 'object',
        required: ['quantity'],
        properties: {
            quantity: { type: 'integer', minimum: 1, description: 'New quantity' },
        },
    });

    registry.registerComponent('schemas', 'CartItemResponse', { allOf: [{ $ref: '#/components/schemas/CartItem' }] });
    registry.registerComponent('schemas', 'CartResponse', { allOf: [{ $ref: '#/components/schemas/Cart' }] });
    registry.registerComponent('schemas', 'CartSummaryResponse', { allOf: [{ $ref: '#/components/schemas/CartSummary' }] });

    // GET /api/v1/cart - Get user cart
    registry.registerPath({
        method: 'get',
        path: '/api/v1/cart',
        tags: ['Cart'],
        summary: 'Get user cart',
        description: 'Retrieve current user cart with all items and shop information',
        security: [{ bearerAuth: [] }],
        responses: {
            200: {
                description: 'Cart retrieved successfully',
                content: {
                    'application/json': {
                        schema: { type: 'object', properties: { success: { type: 'boolean' }, message: { type: 'string' }, data: { $ref: '#/components/schemas/CartResponse' } } }
                    },
                },
            },
            401: { description: 'Unauthorized' },
            404: { description: 'Cart not found' },
        },
    });

    // DELETE /api/v1/cart - Clear cart
    registry.registerPath({
        method: 'delete',
        path: '/api/v1/cart',
        tags: ['Cart'],
        summary: 'Clear cart',
        description: 'Remove all items from user cart and reset shop association',
        security: [{ bearerAuth: [] }],
        responses: {
            200: {
                description: 'Cart cleared successfully',
                content: {
                    'application/json': {
                        schema: { type: 'object', properties: { success: { type: 'boolean' }, message: { type: 'string' } } }
                    },
                },
            },
            401: { description: 'Unauthorized' },
            404: { description: 'Cart not found' },
        },
    });

    // POST /api/v1/cart/add - Add item to cart
    registry.registerPath({
        method: 'post',
        path: '/api/v1/cart/add',
        tags: ['Cart'],
        summary: 'Add item to cart',
        description: 'Add a product to user cart. Cart will be assigned to product shop if empty.',
        security: [{ bearerAuth: [] }],
        request: {
            body: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/AddToCartRequest' }
                    },
                },
            },
        },
        responses: {
            201: {
                description: 'Item added to cart successfully',
                content: {
                    'application/json': {
                        schema: { type: 'object', properties: { success: { type: 'boolean' }, message: { type: 'string' }, data: { $ref: '#/components/schemas/CartItemResponse' } } }
                    },
                },
            },
            400: {
                description: 'Bad request - Product not available, insufficient stock, or shop mismatch',
                content: {
                    'application/json': {
                        schema: { type: 'object', properties: { success: { type: 'boolean' }, message: { type: 'string' }, error: { type: 'string' } } }
                    },
                },
            },
            401: { description: 'Unauthorized' },
            404: { description: 'Product not found' },
        },
    });

    // PUT /api/v1/cart/items/{id} - Update cart item
    registry.registerPath({
        method: 'put',
        path: '/api/v1/cart/items/{id}',
        tags: ['Cart'],
        summary: 'Update cart item',
        description: 'Update quantity of an item in cart',
        security: [{ bearerAuth: [] }],
        parameters: [{
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
            description: 'Cart item ID'
        }],
        request: {
            body: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/UpdateCartItemRequest' }
                    },
                },
            },
        },
        responses: {
            200: {
                description: 'Cart item updated successfully',
                content: {
                    'application/json': {
                        schema: { type: 'object', properties: { success: { type: 'boolean' }, message: { type: 'string' }, data: { $ref: '#/components/schemas/CartItemResponse' } } }
                    },
                },
            },
            400: {
                description: 'Bad request - Invalid quantity or insufficient stock',
            },
            401: { description: 'Unauthorized' },
            404: { description: 'Cart item not found' },
        },
    });

    // DELETE /api/v1/cart/items/{id} - Remove cart item
    registry.registerPath({
        method: 'delete',
        path: '/api/v1/cart/items/{id}',
        tags: ['Cart'],
        summary: 'Remove cart item',
        description: 'Remove an item from cart. If this was the last item, shop association will be cleared.',
        security: [{ bearerAuth: [] }],
        parameters: [{
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
            description: 'Cart item ID'
        }],
        responses: {
            200: {
                description: 'Cart item removed successfully',
                content: {
                    'application/json': {
                        schema: { type: 'object', properties: { success: { type: 'boolean' }, message: { type: 'string' } } }
                    },
                },
            },
            401: { description: 'Unauthorized' },
            404: { description: 'Cart item not found' },
        },
    });

    // GET /api/v1/cart/summary - Get cart summary
    registry.registerPath({
        method: 'get',
        path: '/api/v1/cart/summary',
        tags: ['Cart'],
        summary: 'Get cart summary',
        description: 'Get a summary of cart without detailed item information',
        security: [{ bearerAuth: [] }],
        responses: {
            200: {
                description: 'Cart summary retrieved successfully',
                content: {
                    'application/json': {
                        schema: { type: 'object', properties: { success: { type: 'boolean' }, message: { type: 'string' }, data: { $ref: '#/components/schemas/CartSummaryResponse' } } }
                    },
                },
            },
            401: { description: 'Unauthorized' },
        },
    });
};

import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';

export const registerCartOpenApi = (registry: OpenAPIRegistry) => {
    // Register Cart schemas
    registry.registerComponent('schemas', 'CartItemImage', {
        type: 'object',
        properties: {
            id: { type: 'string', format: 'uuid', description: 'ID ảnh' },
            image_url: { type: 'string', description: 'Đường dẫn ảnh' },
            is_main: { type: 'boolean', description: 'Ảnh chính hay không' },
        },
    });

    registry.registerComponent('schemas', 'CartItemProduct', {
        type: 'object',
        properties: {
            id: { type: 'string', format: 'uuid', description: 'ID sản phẩm' },
            name: { type: 'string', description: 'Tên sản phẩm' },
            slug: { type: 'string', description: 'Slug sản phẩm' },
            sku: { type: 'string', nullable: true, description: 'Mã SKU' },
            description: { type: 'string', nullable: true, description: 'Mô tả sản phẩm' },
            price: { type: 'number', description: 'Giá' },
            quantity: { type: 'integer', description: 'Tồn kho' },
            status: { type: 'string', description: 'Trạng thái sản phẩm' },
            images: { type: 'array', items: { $ref: '#/components/schemas/CartItemImage' }, description: 'Danh sách ảnh' },
        },
    });

    registry.registerComponent('schemas', 'CartItem', {
        type: 'object',
        properties: {
            id: { type: 'string', format: 'uuid', description: 'ID item' },
            cart_id: { type: 'string', format: 'uuid', description: 'ID giỏ' },
            product_id: { type: 'string', format: 'uuid', description: 'ID sản phẩm' },
            quantity: { type: 'integer', description: 'Số lượng' },
            unit_price: { type: 'number', description: 'Đơn giá' },
            total_price: { type: 'number', description: 'Thành tiền' },
            product: { $ref: '#/components/schemas/CartItemProduct', description: 'Thông tin sản phẩm' },
            created_at: { type: 'string', format: 'date-time', description: 'Ngày tạo' },
            updated_at: { type: 'string', format: 'date-time', description: 'Ngày cập nhật' },
        },
    });

    registry.registerComponent('schemas', 'CartShop', {
        type: 'object',
        properties: {
            id: { type: 'string', format: 'uuid', description: 'ID shop' },
            name: { type: 'string', description: 'Tên shop' },
            slug: { type: 'string', description: 'Slug shop' },
            description: { type: 'string', nullable: true, description: 'Mô tả shop' },
            logo_url: { type: 'string', nullable: true, description: 'Logo shop' },
            status: { type: 'string', enum: ['active', 'suspended', 'closed'], description: 'Trạng thái shop' },
        },
    });

    registry.registerComponent('schemas', 'Cart', {
        type: 'object',
        properties: {
            id: { type: 'string', format: 'uuid', description: 'ID giỏ hàng' },
            user_id: { type: 'string', format: 'uuid', description: 'ID người dùng' },
            shop_id: { type: 'string', format: 'uuid', nullable: true, description: 'ID shop (null nếu giỏ trống)' },
            total_items: { type: 'integer', description: 'Tổng số item' },
            total_price: { type: 'number', description: 'Tổng tiền' },
            cart_items: { type: 'array', items: { $ref: '#/components/schemas/CartItem' }, description: 'Danh sách item' },
            shop: { $ref: '#/components/schemas/CartShop', nullable: true, description: 'Thông tin shop (null nếu giỏ trống)' },
            created_at: { type: 'string', format: 'date-time', description: 'Ngày tạo' },
            updated_at: { type: 'string', format: 'date-time', description: 'Ngày cập nhật' },
        },
    });

    registry.registerComponent('schemas', 'CartSummary', {
        type: 'object',
        properties: {
            total_items: { type: 'integer', description: 'Tổng số item' },
            total_price: { type: 'number', description: 'Tổng tiền' },
            items_count: { type: 'integer', description: 'Số dòng hàng' },
        },
    });

    registry.registerComponent('schemas', 'AddToCartRequest', {
        type: 'object',
        required: ['product_id', 'quantity'],
        properties: {
            product_id: { type: 'string', format: 'uuid', description: 'ID sản phẩm cần thêm' },
            quantity: { type: 'integer', minimum: 1, description: 'Số lượng cần thêm' },
        },
    });

    registry.registerComponent('schemas', 'UpdateCartItemRequest', {
        type: 'object',
        required: ['quantity'],
        properties: {
            quantity: { type: 'integer', minimum: 1, description: 'Số lượng mới' },
        },
    });

    registry.registerComponent('schemas', 'CartItemResponse', { allOf: [{ $ref: '#/components/schemas/CartItem' }] });
    registry.registerComponent('schemas', 'CartResponse', { allOf: [{ $ref: '#/components/schemas/Cart' }] });
    registry.registerComponent('schemas', 'CartSummaryResponse', { allOf: [{ $ref: '#/components/schemas/CartSummary' }] });

    // GET /api/v1/cart - Get user cart
    registry.registerPath({
        method: 'get',
        path: '/api/cart',
        tags: ['Cart - Customer'],
        summary: 'Lấy giỏ hàng của tôi',
        description: 'Lấy giỏ hàng hiện tại của người dùng cùng thông tin shop và sản phẩm',
        security: [{ BearerAuth: [] }],
        responses: {
            200: {
                description: 'Lấy giỏ hàng thành công',
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
        path: '/api/cart',
        tags: ['Cart - Customer'],
        summary: 'Xóa toàn bộ giỏ hàng',
        description: 'Xóa tất cả item trong giỏ và bỏ liên kết shop',
        security: [{ BearerAuth: [] }],
        responses: {
            200: {
                description: 'Xóa giỏ hàng thành công',
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

    // POST /api/cart - Add item to cart
    registry.registerPath({
        method: 'post',
        path: '/api/cart',
        tags: ['Cart - Customer'],
        summary: 'Thêm sản phẩm vào giỏ',
        description: 'Thêm sản phẩm vào giỏ. Nếu giỏ trống sẽ gán shop của sản phẩm.',
        security: [{ BearerAuth: [] }],
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
                description: 'Thêm sản phẩm thành công',
                content: {
                    'application/json': {
                        schema: { type: 'object', properties: { success: { type: 'boolean' }, message: { type: 'string' }, data: { $ref: '#/components/schemas/CartItemResponse' } } }
                    },
                },
            },
            400: {
                description: 'Lỗi: sản phẩm không khả dụng / hết hàng / khác shop',
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

    // PUT /api/cart/{id} - Update cart item
    registry.registerPath({
        method: 'put',
        path: '/api/cart/{id}',
        tags: ['Cart - Customer'],
        summary: 'Cập nhật item trong giỏ',
        description: 'Cập nhật số lượng 1 item trong giỏ',
        security: [{ BearerAuth: [] }],
        parameters: [{
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
            description: 'ID cart item'
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
                description: 'Cập nhật item thành công',
                content: {
                    'application/json': {
                        schema: { type: 'object', properties: { success: { type: 'boolean' }, message: { type: 'string' }, data: { $ref: '#/components/schemas/CartItemResponse' } } }
                    },
                },
            },
            400: {
                description: 'Sai dữ liệu hoặc hết hàng',
            },
            401: { description: 'Unauthorized' },
            404: { description: 'Cart item not found' },
        },
    });

    // PATCH /api/cart/{id}/increase - Increase quantity
    registry.registerPath({
        method: 'patch',
        path: '/api/cart/{id}/increase',
        tags: ['Cart - Customer'],
        summary: 'Tăng số lượng item',
        description: 'Tăng số lượng 1 đơn vị cho item trong giỏ',
        security: [{ BearerAuth: [] }],
        parameters: [{
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
            description: 'ID cart item'
        }],
        responses: {
            200: {
                description: 'Tăng số lượng thành công',
            },
            400: { description: 'Sai dữ liệu hoặc hết hàng' },
            401: { description: 'Unauthorized' },
            404: { description: 'Cart item not found' },
        },
    });

    // PATCH /api/cart/{id}/decrease - Decrease quantity
    registry.registerPath({
        method: 'patch',
        path: '/api/cart/{id}/decrease',
        tags: ['Cart - Customer'],
        summary: 'Giảm số lượng item',
        description: 'Giảm số lượng 1 đơn vị cho item trong giỏ',
        security: [{ BearerAuth: [] }],
        parameters: [{
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
            description: 'ID cart item'
        }],
        responses: {
            200: {
                description: 'Giảm số lượng thành công',
            },
            400: { description: 'Sai dữ liệu hoặc hết hàng' },
            401: { description: 'Unauthorized' },
            404: { description: 'Cart item not found' },
        },
    });

    // DELETE /api/cart/{id} - Remove cart item
    registry.registerPath({
        method: 'delete',
        path: '/api/cart/{id}',
        tags: ['Cart'],
        summary: 'Xóa item khỏi giỏ',
        description: 'Xóa 1 item khỏi giỏ. Nếu là item cuối, giỏ sẽ bỏ liên kết shop.',
        security: [{ BearerAuth: [] }],
        parameters: [{
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
            description: 'ID cart item'
        }],
        responses: {
            200: {
                description: 'Xóa item thành công',
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

    // GET /api/cart/summary - Get cart summary
    registry.registerPath({
        method: 'get',
        path: '/api/cart/summary',
        tags: ['Cart'],
        summary: 'Xem tóm tắt giỏ hàng',
        description: 'Lấy tóm tắt giỏ (không kèm chi tiết item)',
        security: [{ BearerAuth: [] }],
        responses: {
            200: {
                description: 'Lấy tóm tắt thành công',
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

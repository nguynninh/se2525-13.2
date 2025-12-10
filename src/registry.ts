import { OpenAPIRegistry, OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import { registerUserOpenApi } from './module/user/user.openapi';
import { registerAuthOpenApi } from './module/auth/auth.openapi';
import { registerSellerApplicationOpenApi } from './module/sellerApplication/sellerApplication.openapi';
import { registerLocationOpenApi } from './module/location/location.openapi';

const registry = new OpenAPIRegistry();

registry.registerComponent('securitySchemes', 'BearerAuth', {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
});

registerAuthOpenApi(registry);
registerUserOpenApi(registry);
registerSellerApplicationOpenApi(registry);
registerLocationOpenApi(registry);

const generator = new OpenApiGeneratorV3(registry.definitions);

export const openApiDocument = generator.generateDocument({
    openapi: '3.0.0',
    info: {
        title: 'Tiki Mobile Backend API',
        version: '1.0.0',
    },
    servers: [
        {
            url: 'http://localhost:3001',
            description: 'API SWAGGER',
        },
    ],
});

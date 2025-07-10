import { applyDecorators } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { AuthResponseDto } from '../dto/auth-response.dto';

// Login endpoint decorators
export const ApiLogin = () =>
  applyDecorators(
    ApiOperation({ 
      summary: 'Initiate Google OAuth login',
      description: 'This endpoint redirects to Google OAuth consent screen. For API clients, use the /auth/login-url endpoint instead.'
    }),
    ApiResponse({
      status: 302,
      description: 'Redirects to Google OAuth consent screen (HTML response)',
      headers: {
        'Location': {
          description: 'Google OAuth URL',
          schema: { type: 'string' }
        }
      }
    })
  );

// Login URL endpoint decorators
export const ApiLoginUrl = () =>
  applyDecorators(
    ApiOperation({ 
      summary: 'Get Google OAuth login URL',
      description: 'Returns the Google OAuth URL for client-side redirect'
    }),
    ApiResponse({
      status: 200,
      description: 'Google OAuth URL',
      schema: {
        type: 'object',
        properties: {
          url: {
            type: 'string',
            description: 'Google OAuth consent screen URL',
            example: 'https://accounts.google.com/o/oauth2/v2/auth?client_id=...'
          }
        }
      }
    })
  );

// Callback endpoint decorators
export const ApiCallback = () =>
  applyDecorators(
    ApiOperation({ summary: 'Handle Google OAuth callback' }),
    ApiQuery({
      name: 'code',
      description: 'Authorization code from Google OAuth',
      type: String,
    }),
    ApiResponse({
      status: 200,
      description: 'Authentication successful',
      type: AuthResponseDto,
    }),
    ApiResponse({
      status: 400,
      description: 'Invalid authorization code',
    }),
    ApiResponse({
      status: 401,
      description: 'Authentication failed',
    })
  );

// Get current user profile decorators
export const ApiGetCurrentUser = () =>
  applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({ summary: 'Get current user profile' }),
    ApiResponse({
      status: 200,
      description: 'Current user profile information',
      schema: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          email: { type: 'string' },
          firstName: { type: 'string', nullable: true },
          lastName: { type: 'string', nullable: true },
          picture: { type: 'string', nullable: true },
          role: { type: 'string' },
          provider: { type: 'string', nullable: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Invalid or missing token',
    }),
    ApiResponse({
      status: 404,
      description: 'User not found',
    })
  );

// Promote to admin decorators
export const ApiPromoteToAdmin = () =>
  applyDecorators(
    ApiBearerAuth('JWT-auth'),
    ApiOperation({ 
      summary: 'Promote current user to admin role',
      description: 'Promotes the authenticated user to admin role. Requires re-authentication to get updated token with admin privileges.'
    }),
    ApiResponse({
      status: 200,
      description: 'User successfully promoted to admin',
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            description: 'Success message with re-authentication instructions',
            example: 'Successfully promoted to admin. Please login again to get the updated token with admin privileges.'
          },
          requiresReauth: {
            type: 'boolean',
            description: 'Indicates that re-authentication is required',
            example: true
          }
        }
      }
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Invalid or missing token',
    }),
    ApiResponse({
      status: 404,
      description: 'User not found',
    })
  ); 
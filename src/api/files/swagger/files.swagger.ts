import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { UploadFileDto } from '../dto/upload-file.dto';

// Upload file decorators
export const ApiUploadFile = () =>
  applyDecorators(
    ApiOperation({ summary: 'Upload a file' }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      description: 'File upload - Supports images, audio, video, and common documents',
      schema: {
        type: 'object',
        properties: {
          file: {
            type: 'string',
            format: 'binary',
            description: 'File to upload (images: image/*, audio: audio/*, video: video/*, documents: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, RTF)'
          },
          description: {
            type: 'string',
            description: 'Optional description for the file'
          }
        }
      }
    }),
    ApiResponse({
      status: 201,
      description: 'File uploaded successfully',
      type: UploadFileDto,
    }),
    ApiResponse({
      status: 400,
      description: 'Invalid file type or validation error',
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Invalid or missing token',
    })
  );

// Get user files decorators
export const ApiGetUserFiles = () =>
  applyDecorators(
    ApiOperation({ summary: 'Get user\'s uploaded files' }),
    ApiResponse({
      status: 200,
      description: 'List of user\'s files',
      type: [UploadFileDto],
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Invalid or missing token',
    })
  );

// Get all files decorators (Admin only)
export const ApiGetAllFiles = () =>
  applyDecorators(
    ApiOperation({ summary: 'Get all files (Admin only)' }),
    ApiResponse({
      status: 200,
      description: 'List of all files',
      type: [UploadFileDto],
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized - Invalid or missing token',
    }),
    ApiResponse({
      status: 403,
      description: 'Forbidden - Admin role required',
    })
  );

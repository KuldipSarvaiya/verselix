import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UploadFileDto } from './dto/upload-file.dto';
import * as path from 'path';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class FilesService {
  constructor(private prisma: PrismaService) { }

  async uploadFile(
    file: Express.Multer.File,
    userId: string,
  ): Promise<UploadFileDto> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const isAllowedFileType = (mimeType: string): boolean => {
      const allowedDocuments = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'text/plain',
        'text/rtf',
      ];
      if (
        mimeType.startsWith('image/') ||
        mimeType.startsWith('audio/') ||
        mimeType.startsWith('video/') ||
        allowedDocuments.includes(mimeType)
      ) return true;

      return false
    };

    if (!isAllowedFileType(file.mimetype)) {
      throw new BadRequestException(`File type ${file.mimetype} is not allowed. Supported types: images (image/*), audio (audio/*), video (video/*), and common documents (PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, RTF).`);
    }

    // Save file data to database
    const fileRecord = await this.prisma.file.create({
      data: {
        userId,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            picture: true,
            role: true,
            provider: true,
          },
        },
      },
    });

    // Upload to Supabase Storage with proper file name and MIME type
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!);

    // Create a proper file path with original name
    const fileExtension = path.extname(file.originalname);
    const supabaseFilePath = `myfolder/${fileRecord.id}${fileExtension}`;

    const { data, error } = await supabase.storage
      .from(process.env.SUPABASE_BUCKET_NAME!)
      .upload(supabaseFilePath, file.buffer, {
        contentType: file.mimetype,
        upsert: true
      });

    if (error) {
      console.log('Supabase upload error:', error);
      throw new BadRequestException('Failed to upload file to Supabase storage');
    }

    console.log('File uploaded to Supabase:', data);

    return {
      id: fileRecord.id,
      userId: fileRecord.userId,
      originalName: fileRecord.originalName,
      mimeType: fileRecord.mimeType,
      size: fileRecord.size,
      uploadTime: fileRecord.uploadTime,
      createdAt: fileRecord.createdAt,
      updatedAt: fileRecord.updatedAt,
      user: fileRecord.user,
    };
  }

  async findUserFiles(userId: string): Promise<UploadFileDto[]> {
    const files = await this.prisma.file.findMany({
      where: { userId },
      orderBy: { uploadTime: 'desc' },
    });

    return files.map(file => ({
      id: file.id,
      userId: file.userId,
      originalName: file.originalName,
      mimeType: file.mimeType,
      size: file.size,
      uploadTime: file.uploadTime,
      createdAt: file.createdAt,
      updatedAt: file.updatedAt
    }));
  }

  async findAllFiles(): Promise<UploadFileDto[]> {
    const files = await this.prisma.file.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            picture: true,
            role: true,
            provider: true,
          },
        },
      },
      orderBy: { uploadTime: 'desc' },
    });

    return files.map(file => ({
      id: file.id,
      userId: file.userId,
      originalName: file.originalName,
      mimeType: file.mimeType,
      size: file.size,
      uploadTime: file.uploadTime,
      createdAt: file.createdAt,
      updatedAt: file.updatedAt,
      user: file.user,
    }));
  }
}

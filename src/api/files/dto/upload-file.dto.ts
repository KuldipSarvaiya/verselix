import { IsString, IsNotEmpty, IsNumber, IsDateString, IsUUID, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserInfoDto {
  @ApiProperty({
    description: 'User ID',
    example: 'clx1234567890abcdef'
  })
  @IsUUID('4', { message: 'User ID must be a valid UUID' })
  @IsNotEmpty({ message: 'User ID is required' })
  id: string;

  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com'
  })
  @IsString({ message: 'Email must be a string' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    description: 'User first name',
    example: 'John',
    nullable: true
  })
  @IsOptional()
  @IsString({ message: 'First name must be a string' })
  firstName: string | null;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
    nullable: true
  })
  @IsOptional()
  @IsString({ message: 'Last name must be a string' })
  lastName: string | null;

  @ApiProperty({
    description: 'User profile picture URL',
    example: 'https://example.com/avatar.jpg',
    nullable: true
  })
  @IsOptional()
  @IsString({ message: 'Picture must be a string' })
  picture: string | null;

  @ApiProperty({
    description: 'User role',
    example: 'USER',
    enum: ['USER', 'ADMIN']
  })
  @IsString({ message: 'Role must be a string' })
  @IsNotEmpty({ message: 'Role is required' })
  role: string;

  @ApiProperty({
    description: 'Authentication provider',
    example: 'google',
    nullable: true
  })
  @IsOptional()
  @IsString({ message: 'Provider must be a string' })
  provider: string | null;
}

export class UploadFileDto {
  @ApiProperty({
    description: 'Unique identifier for the file',
    example: 'clx1234567890abcdef'
  })
  @IsUUID('4', { message: 'File ID must be a valid UUID' })
  @IsNotEmpty({ message: 'File ID is required' })
  id: string;

  @ApiProperty({
    description: 'ID of the user who uploaded the file',
    example: 'clx1234567890abcdef'
  })
  @IsUUID('4', { message: 'User ID must be a valid UUID' })
  @IsNotEmpty({ message: 'User ID is required' })
  userId: string;

  @ApiProperty({
    description: 'Original filename of the uploaded file',
    example: 'document.pdf'
  })
  @IsString({ message: 'Original name must be a string' })
  @IsNotEmpty({ message: 'Original name is required' })
  originalName: string;

  @ApiProperty({
    description: 'MIME type of the file',
    example: 'application/pdf'
  })
  @IsString({ message: 'MIME type must be a string' })
  @IsNotEmpty({ message: 'MIME type is required' })
  mimeType: string;

  @ApiProperty({
    description: 'Size of the file in bytes',
    example: 1024000
  })
  @IsNumber({}, { message: 'File size must be a number' })
  @IsNotEmpty({ message: 'File size is required' })
  size: number;

  @ApiProperty({
    description: 'Timestamp when the file was uploaded',
    example: '2025-07-10T17:00:00.000Z'
  })
  @IsDateString({}, { message: 'Upload time must be a valid date string' })
  @IsNotEmpty({ message: 'Upload time is required' })
  uploadTime: Date;

  @ApiProperty({
    description: 'Timestamp when the file record was created',
    example: '2025-07-10T17:00:00.000Z'
  })
  @IsDateString({}, { message: 'Created at must be a valid date string' })
  @IsNotEmpty({ message: 'Created at is required' })
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp when the file record was last updated',
    example: '2025-07-10T17:00:00.000Z'
  })
  @IsDateString({}, { message: 'Updated at must be a valid date string' })
  @IsNotEmpty({ message: 'Updated at is required' })
  updatedAt: Date;

  @ApiProperty({
    description: 'User information who uploaded the file',
    type: UserInfoDto
  })
  @IsOptional()
  user?: UserInfoDto;
} 
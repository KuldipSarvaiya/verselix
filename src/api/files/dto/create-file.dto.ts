import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateFileDto {
  @ApiProperty({
    description: 'The file to upload',
    type: 'string',
    format: 'binary'
  })
  file: Express.Multer.File;

  @ApiProperty({
    description: 'Optional description for the file',
    example: 'My important document',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;
} 
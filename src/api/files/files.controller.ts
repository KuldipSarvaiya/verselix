import {
  Controller,
  Post,
  Get,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { FilesService } from './files.service';
import { GetUserId, JwtAuthGuard, Roles, RolesGuard } from '../auth';
import {
  ApiUploadFile,
  ApiGetUserFiles,
  ApiGetAllFiles,
} from './swagger/files.swagger';

@ApiTags('files')
@ApiBearerAuth('JWT-auth')
@Controller('files')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FilesController {
  constructor(private readonly filesService: FilesService) { }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiUploadFile()
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), // 10MB
          new FileTypeValidator({
            fileType: '.(jpg|jpeg|png|gif|bmp|webp|svg|pdf|doc|docx|xls|xlsx|ppt|pptx|txt|rtf|mp3|wav|aac|flac|ogg|mp4|avi|mov|wmv|mkv|webm|flv|3gp)'
          }),
        ],
      }),
    )
    file: Express.Multer.File,
    @GetUserId() userId: string,
  ) {
    return this.filesService.uploadFile(file, userId);
  }

  @Get('me')
  @ApiGetUserFiles()
  async findUserFiles(@GetUserId() userId: string) {
    return this.filesService.findUserFiles(userId);
  }

  @Get('all')
  @Roles('ADMIN')
  @ApiGetAllFiles()
  async findAllFiles() {
    return this.filesService.findAllFiles();
  }
}

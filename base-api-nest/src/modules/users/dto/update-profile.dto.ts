import { IsString, IsOptional } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  full_name?: string;

  @IsString()
  @IsOptional()
  gender?: string;

  @IsString()
  @IsOptional()
  avatar_url?: string;

  @IsString()
  @IsOptional()
  bio?: string; // ✅ Đón dữ liệu tiểu sử

  @IsString()
  @IsOptional()
  phone?: string; // ✅ Đón số điện thoại trực tiếp từ Form Settings
}
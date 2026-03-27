import { IsOptional, IsString, IsUrl, IsNumber } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ example: 'Jane Doe', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'Adventurous driver loving road trips.', required: false })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiProperty({ example: 'https://example.com/photo.jpg', required: false })
  @IsOptional()
  @IsString()
  photo?: string;

  @ApiProperty({ example: 'San Francisco', required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ example: 37.7749, required: false })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiProperty({ example: -122.4194, required: false })
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @ApiProperty({ example: 50, description: 'Search radius in km', required: false })
  @IsOptional()
  @IsNumber()
  radius?: number;

  @ApiProperty({ example: 'Tesla Model 3', required: false })
  @IsOptional()
  @IsString()
  vehicleModel?: string;

  @ApiProperty({ example: 'Midnight Silver', required: false })
  @IsOptional()
  @IsString()
  vehicleColor?: string;

  @ApiProperty({ example: 'CA123456', required: false })
  @IsOptional()
  @IsString()
  vehiclePlate?: string;

  @ApiProperty({ example: 'en', description: 'Preferred language code (en, fr, ar)', required: false })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiProperty({ example: 'ExponentPushToken[xxx]', required: false })
  @IsOptional()
  @IsString()
  pushToken?: string;

  @ApiProperty({ example: null, required: false })
  @IsOptional()
  @IsString()
  refreshToken?: string | null;
}

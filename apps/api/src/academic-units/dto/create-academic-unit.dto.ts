import {
  IsString,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class CreateAcademicUnitDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  abbreviation?: string;

  @IsString()
  @IsNotEmpty()
  typeId: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  universityId: string;
}
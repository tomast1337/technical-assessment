import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsObject,
  IsString,
  Validate,
  ValidateNested,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import 'reflect-metadata';

@ValidatorConstraint({ name: 'isFirstAndLastSame', async: false })
class IsFirstAndLastSameConstraint implements ValidatorConstraintInterface {
  validate(coordinates: [number, number][], _args: ValidationArguments) {
    if (!Array.isArray(coordinates) || coordinates.length < 4) {
      return false;
    }

    const first = coordinates[0];
    const last = coordinates[coordinates.length - 1];
    return first[0] === last[0] && first[1] === last[1];
  }

  defaultMessage(_args: ValidationArguments) {
    return 'The last item in the coordinates array should be the same as the first';
  }
}

class GeometryDto {
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => Array)
  @Validate(IsFirstAndLastSameConstraint)
  coordinates: [number, number][][];
}

export class RegionDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsObject()
  @ValidateNested()
  @Type(() => GeometryDto)
  geometry: GeometryDto;
}

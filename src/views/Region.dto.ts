import 'reflect-metadata';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsString,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isFirstAndLastSame', async: false })
class IsFirstAndLastSameConstraint implements ValidatorConstraintInterface {
  validate(coordinates: [number, number][], _args: ValidationArguments) {
    if (!Array.isArray(coordinates) || coordinates.length < 3) {
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

export class RegionDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @ArrayMinSize(3)
  @Validate(IsFirstAndLastSameConstraint)
  coordinates: [number, number][];
}

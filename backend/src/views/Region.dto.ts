<<<<<<< HEAD
import { ArrayMinSize, IsArray, IsNotEmpty, IsString } from 'class-validator';
import 'reflect-metadata';
=======
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
>>>>>>> 39916c9 (Moved the backend to the backend folder)

export class RegionDto {
  @IsString()
  @IsNotEmpty()
  name: string;

<<<<<<< HEAD
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsArray()
  @ArrayMinSize(1)
  coordinates: [number, number][][];
=======
  @IsArray()
  @ArrayMinSize(3)
  @Validate(IsFirstAndLastSameConstraint)
  coordinates: [number, number][];
>>>>>>> 39916c9 (Moved the backend to the backend folder)
}

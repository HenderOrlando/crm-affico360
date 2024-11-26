import { CreateAnyDto } from '@common/common/models/create-any.dto';
import { IsDate, IsNotEmpty } from 'class-validator';

export class TimeLiveDto extends CreateAnyDto {
  @IsDate()
  @IsNotEmpty()
  from: Date;

  @IsDate()
  @IsNotEmpty()
  to: Date;
}

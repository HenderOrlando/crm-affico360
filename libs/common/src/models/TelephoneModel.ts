import { CategoryInterface } from '@category/category/entities/category.interface';

interface TelephoneModel {
  phoneName: string;
  countryName: string;
  phoneNumber: string;
  category: CategoryInterface;
}

export default TelephoneModel;

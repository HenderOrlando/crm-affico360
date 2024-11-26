import { CategoryInterface } from '@category/category/entities/category.interface';
import CountryCodeAfficoEnum from '@common/common/enums/country.code.affico.enum';
import AddressModel from './AddressModel';
import CityModel from './CityModel';
import ColonyModel from './ColonyModel';
import GeopointModel from './GeopointModel';
import StreetModel from './StreetModel';
import ZipCodeModel from './ZipCodeModel';

interface LocationModel {
  name: string;
  description: string;
  category: CategoryInterface;
  colony: ColonyModel;
  city: CityModel;
  country: CountryCodeAfficoEnum;
  address: AddressModel;
  street: StreetModel;
  zipcode: ZipCodeModel;
  // The geoposition of location
  geopoint: GeopointModel;
}

export default LocationModel;

import ResourcesEnum from '../enums/ResourceEnum';

interface CategoryModel {
  id: string;
  name: string;
  description: string;
  resources: Array<ResourcesEnum>;
}

export default CategoryModel;

import LocationModel from './LocationModel';

interface JobModel {
  name: string;
  description: string;
  company: string;
  location: LocationModel;
  activity: string;
  salary: number;
}

export default JobModel;

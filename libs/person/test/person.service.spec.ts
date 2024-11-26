import { PersonServiceMongooseService } from '@person/person/person-service-mongoose.service';
import { PersonDocument } from '@person/person/entities/mongoose/person.schema';
import { PersonCreateDto } from '@person/person/dto/person.create.dto';
import { PersonUpdateDto } from '@person/person/dto/person.update.dto';
import { Test, TestingModule } from '@nestjs/testing';
import DocIdTypeEnum from '@common/common/enums/DocIdTypeEnum';

describe('PersonService', () => {
  let service: PersonServiceMongooseService;
  let person: PersonDocument;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PersonServiceMongooseService],
    }).compile();

    service = module.get<PersonServiceMongooseService>(
      PersonServiceMongooseService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  /* it('should be create', () => {
    const personDto: PersonCreateDto = {
      description: '',
      country: '',
      email: '',
      emails: [],
      location: undefined,
      phoneNumber: '',
      telephones: [],
      user: undefined,
      firstName: 'mexico',
      lastName: '123456',
      numDocId: '',
      typeDocId: DocIdTypeEnum.CEDULA_CIUDADANIA,
      affiliates: [],
      leads: [],
    };
    expect(
      service.create(personDto).then((createdPerson) => {
        person = createdPerson;
      }),
    ).toHaveProperty('firstname', person.name);
  });

  it('should be update', () => {
    const personDto: PersonUpdateDto = {
      id: person.id,
      firstName: 'colombia',
      lastName: '987654321',
    };
    expect(
      service.update(personDto.id, personDto).then((updatedPerson) => {
        person = updatedPerson;
      }),
    ).toHaveProperty('firstName', personDto.firstName);
  });

  it('should be update', () => {
    expect(service.remove(person.id)).toReturn();
  }); */
});

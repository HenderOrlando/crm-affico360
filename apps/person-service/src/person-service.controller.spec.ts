import { PersonCreateDto } from '@person/person/dto/person.create.dto';
import { PersonUpdateDto } from '@person/person/dto/person.update.dto';
import { PersonServiceController } from './person-service.controller';
import { PersonServiceService } from './person-service.service';
import { Test, TestingModule } from '@nestjs/testing';
import DocIdTypeEnum from '@common/common/enums/DocIdTypeEnum';

describe('PersonServiceController', () => {
  let person;
  let personServiceController: PersonServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PersonServiceController],
      providers: [PersonServiceService],
    }).compile();

    personServiceController = app.get<PersonServiceController>(
      PersonServiceController,
    );
  });

  describe('root', () => {
    it('should be create', () => {
      const personDto: PersonCreateDto = {
        country: '',
        description: '',
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
        personServiceController.createOne(personDto).then((createdPerson) => {
          person = createdPerson;
        }),
      ).toHaveProperty('personname', person.personname);
    });

    it('should be update', () => {
      const personDto: PersonUpdateDto = {
        id: person.id,
        firstName: 'colombia',
        lastName: '654321',
      };
      expect(
        personServiceController.updateOne(personDto).then((updatedPerson) => {
          person = updatedPerson;
        }),
      ).toHaveProperty('name', personDto.firstName);
    });

    it('should be delete', () => {
      expect(personServiceController.deleteOneById(person.id)).toReturn();
    });
  });
});

import { QuerySearchAnyDto } from '@common/common/models/query_search-any.dto';
import { PersonCreateDto } from '@person/person/dto/person.create.dto';
import { PersonUpdateDto } from '@person/person/dto/person.update.dto';
import { PersonServiceMongooseService } from '@person/person';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class PersonServiceService {
  constructor(
    @Inject(PersonServiceMongooseService)
    private lib: PersonServiceMongooseService,
  ) {}

  async getOne(id: string) {
    return this.lib.findOne(id);
  }

  async getAll(query: QuerySearchAnyDto) {
    return this.lib.findAll(query);
  }

  async newPerson(person: PersonCreateDto) {
    return this.lib.create(person);
  }

  async newManyPerson(createPersonsDto: PersonCreateDto[]) {
    return this.lib.createMany(createPersonsDto);
  }

  async updatePerson(person: PersonUpdateDto) {
    return this.lib.update(person.id.toString(), person);
  }

  async updateManyPersons(persons: PersonUpdateDto[]) {
    return this.lib.updateMany(
      persons.map((person) => person.id.toString()),
      persons,
    );
  }

  async deletePerson(id: string) {
    return this.lib.remove(id);
  }

  async deleteManyPersons(ids: string[]) {
    return this.lib.removeMany(ids);
  }

  async download() {
    // TODO[hender] Not implemented download
    return Promise.resolve(undefined);
  }
}

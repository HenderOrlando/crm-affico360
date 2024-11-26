import { Test, TestingModule } from '@nestjs/testing';
import { databaseProviders } from './database-providers.service';

describe('DatabaseProvider', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [...databaseProviders],
    }).compile();
  });

  it('should be defined MongoDB', () => {
    const provider = module.get('MONGODB_CONNECTION');
    expect(provider).toBeDefined();
  });

  it('should be defined Dynamo', () => {
    const provider = module.get('DYNAMO_CONNECTION');
    expect(provider).toBeDefined();
  });
});

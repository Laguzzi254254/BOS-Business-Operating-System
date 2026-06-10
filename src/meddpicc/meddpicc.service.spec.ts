import { Test, TestingModule } from '@nestjs/testing';
import { MeddpiccService } from './meddpicc.service';

describe('MeddpiccService', () => {
  let service: MeddpiccService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MeddpiccService],
    }).compile();

    service = module.get<MeddpiccService>(MeddpiccService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

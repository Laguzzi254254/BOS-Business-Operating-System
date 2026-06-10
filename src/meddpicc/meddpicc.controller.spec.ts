import { Test, TestingModule } from '@nestjs/testing';
import { MeddpiccController } from './meddpicc.controller';

describe('MeddpiccController', () => {
  let controller: MeddpiccController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MeddpiccController],
    }).compile();

    controller = module.get<MeddpiccController>(MeddpiccController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

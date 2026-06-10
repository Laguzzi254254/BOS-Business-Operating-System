import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

import { CreateMeddpiccDto } from './dto/create-meddpicc.dto';
import { UpdateMeddpiccDto } from './dto/update-meddpicc.dto';

import { calculateOQS } from '../shared/utils/oqs.util';
import { getStageScore } from '../shared/utils/stage-score.util';
import { getSpinScore } from '../shared/utils/spin-score.util';
import {
  getForecastBand,
} from '../shared/utils/forecast.util';

@Injectable()
export class MeddpiccService {

constructor(
private readonly prisma: PrismaService,
) {}

private calculateScore(data: any): number {


let score = 0;

if (data.metrics) score += 12.5;
if (data.economic_buyer) score += 12.5;
if (data.decision_criteria) score += 12.5;
if (data.decision_process) score += 12.5;
if (data.paper_process) score += 12.5;
if (data.identified_pain) score += 12.5;
if (data.champion) score += 12.5;
if (data.competition) score += 12.5;

return Math.round(score);


}

private async recalculateOQS(
opportunityId: string,
meddpiccScore: number,
) {


const opportunity =
  await this.prisma.opportunities.findUnique({

    where: {
      id: opportunityId,
    },

  });

if (!opportunity) {
  return;
}

const spin =
  await this.prisma.spin_records.findUnique({

    where: {
      opportunity_id: opportunityId,
    },

  });

const stageScore =
  getStageScore(
    opportunity.stage ?? '',
  );

const spinScore =
  getSpinScore(spin);

const oqs =
  calculateOQS({

    meddpiccScore,
    stageScore,
    spinScore,

  });

const forecastBand =
  getForecastBand(oqs);
  
  console.log('MEDDPICC Score:', meddpiccScore);
console.log('Stage Score:', stageScore);
console.log('Spin Score:', spinScore);
console.log('Calculated OQS:', oqs);

const updated =
 await this.prisma.opportunities.update({

  where: {
    id: opportunityId,
  },

  data: {

    oqs_score: oqs,

    forecast_band:
      forecastBand,

  },

});


}

async create(
dto: CreateMeddpiccDto,
) {


const score =
  this.calculateScore(dto);

const record =
  await this.prisma.meddpicc_records.create({

    data: {

      opportunity_id: dto.opportunity_id,

      metrics: dto.metrics,

      economic_buyer: dto.economic_buyer,

      decision_criteria: dto.decision_criteria,

      decision_process: dto.decision_process,

      paper_process: dto.paper_process,

      identified_pain: dto.identified_pain,

      champion: dto.champion,

      competition: dto.competition,

      score,

    },

  });

await this.recalculateOQS(
  dto.opportunity_id,
  score,
);

return record;


}

async findAll() {


return this.prisma.meddpicc_records.findMany({

  orderBy: {
    created_at: 'desc',
  },

});


}

async findOne(
opportunityId: string,
) {


return this.prisma.meddpicc_records.findUnique({

  where: {
    opportunity_id: opportunityId,
  },

});


}

async update(
opportunityId: string,
dto: UpdateMeddpiccDto,
) {


const existing =
  await this.prisma.meddpicc_records.findUnique({

    where: {
      opportunity_id: opportunityId,
    },

  });

if (!existing) {
  throw new Error(
    'MEDDPICC record not found',
  );
}

const merged = {
  ...existing,
  ...dto,
};

const score =
  this.calculateScore(merged);

const record =
  await this.prisma.meddpicc_records.update({

    where: {
      opportunity_id: opportunityId,
    },

    data: {
      ...dto,
      score,
    },

  });

await this.recalculateOQS(
  opportunityId,
  score,
);

return record;


}

async remove(
opportunityId: string,
) {


return this.prisma.meddpicc_records.delete({

  where: {
    opportunity_id: opportunityId,
  },

});


}

}

import { BadRequestException } from '@nestjs/common';
import { EligibilityService } from './eligibility.service';

describe('EligibilityService', () => {
  const programme = {
    findMany: jest.fn(),
    findUnique: jest.fn(),
  };

  const programmesService = {
    findByCode: jest.fn(),
  };

  let service: EligibilityService;

  beforeEach(() => {
    jest.clearAllMocks();

    service = new EligibilityService(
      { programme } as any,
      programmesService as any,
    );
  });

  it('rejects a programme that does not belong to the selected university', async () => {
    const input = {
      programmeId: 'prog-1',
      universityId: 'uni-2',
      oLevelSubjects: [
        { subjectId: 's1', grade: 'A' },
        { subjectId: 's2', grade: 'B' },
        { subjectId: 's3', grade: 'C' },
        { subjectId: 's4', grade: 'D' },
      ],
      aLevelSubjects: [
        { subjectId: 'a1', grade: 'A' },
        { subjectId: 'a2', grade: 'B' },
      ],
      level: 'UNDERGRADUATE',
    };

    programme.findMany.mockResolvedValue([]);

    await expect(service.checkEligibility(input as any)).rejects.toBeInstanceOf(BadRequestException);
  });
});

import { NotFoundException } from '@nestjs/common';
import { CompareService } from './compare.service';

describe('CompareService', () => {
  const programme = {
    findMany: jest.fn(),
  };

  let service: CompareService;

  beforeEach(() => {
    jest.clearAllMocks();
    programme.findMany.mockResolvedValue([
      { id: 'p1', name: 'A', degree: { name: 'BSc' }, level: 'UNDERGRADUATE', duration: 4, department: { academicUnit: { name: 'Science' }, name: 'CS' }, tuition: [], requirements: [], careers: [] },
      { id: 'p2', name: 'B', degree: { name: 'BSc' }, level: 'UNDERGRADUATE', duration: 4, department: { academicUnit: { name: 'Science' }, name: 'IT' }, tuition: [], requirements: [], careers: [] },
    ]);

    service = new CompareService({
      programme,
    } as any);
  });

  it('deduplicates repeated programme IDs before comparison', async () => {
    await expect(service.compare(['p1', 'p1', 'p2'])).resolves.toHaveLength(2);
  });

  it('rejects requests with fewer than two unique programme IDs', async () => {
    await expect(service.compare(['p1', 'p1'])).rejects.toBeInstanceOf(NotFoundException);
  });
});

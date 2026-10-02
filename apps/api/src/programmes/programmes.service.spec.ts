import { ProgrammesService } from './programmes.service';

describe('ProgrammesService', () => {
  const programme = {
    findMany: jest.fn(),
    count: jest.fn(),
  };

  let service: ProgrammesService;

  beforeEach(() => {
    jest.clearAllMocks();
    programme.findMany.mockResolvedValue([]);
    programme.count.mockResolvedValue(0);

    service = new ProgrammesService({
      programme,
    } as any);
  });

  it('defaults public programme search to active programmes only', async () => {
    await service.search({ page: 1, limit: 20 });

    const where = programme.findMany.mock.calls[0][0].where;
    expect(where.isActive).toBe(true);
  });

  it('combines university and faculty filters without overwriting each other', async () => {
    await service.search({
      universityId: 'uni-1',
      facultyId: 'fac-1',
      page: 1,
      limit: 20,
    });

    const where = programme.findMany.mock.calls[0][0].where;

    expect(where.AND).toEqual(
      expect.arrayContaining([
        {
          department: {
            academicUnit: {
              universityId: 'uni-1',
            },
          },
        },
        {
          department: {
            academicUnitId: 'fac-1',
          },
        },
      ]),
    );
  });
});

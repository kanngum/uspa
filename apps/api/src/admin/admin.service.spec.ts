import { AdminService } from './admin.service';

describe('AdminService', () => {
  let service: AdminService;
  const programme = {
    findUnique: jest.fn(),
    update: jest.fn(),
  };
  const career = {
    upsert: jest.fn(),
  };
  const keyword = {
    upsert: jest.fn(),
  };
  const programmeCareer = {
    upsert: jest.fn(),
  };
  const programmeKeyword = {
    upsert: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    career.upsert.mockResolvedValue({
      id: 'career-1',
      name: 'Engineer',
    });
    keyword.upsert.mockResolvedValue({
      id: 'keyword-1',
      word: 'engineering',
    });
    programmeCareer.upsert.mockResolvedValue({});
    programmeKeyword.upsert.mockResolvedValue({});

    service = new AdminService({
      programme,
      career,
      keyword,
      programmeCareer,
      programmeKeyword,
    } as any);
  });

  it('clears the featured order when a programme is no longer featured', async () => {
    const existing = {
      id: 'p1',
      code: 'CS101',
      isFeatured: true,
      featuredOrder: 2,
    };

    programme.findUnique.mockResolvedValue(existing);
    programme.update.mockImplementation(({ data }) => Promise.resolve(data));

    await service.updateProgramme('p1', { isFeatured: false });

    expect(programme.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          isFeatured: false,
          featuredOrder: null,
        }),
      }),
    );
  });

  it('flags incomplete catalogue records during review resolution', async () => {
    const existing = {
      id: 'p1',
      code: 'CS101',
      applicationDeadline: null,
      applicationStatus: 'Open',
      sourceCode: 'CS',
      entryRequirements: null,
      tuition: [],
      requirements: [],
      careers: [],
      keywords: [],
    };

    programme.findUnique.mockResolvedValue(existing);
    programme.update.mockImplementation(({ data }) => Promise.resolve(data));

    await service.resolveCatalogueReview('p1', {
      sourceCode: 'CS',
      entryRequirements: 'Math and English',
      careerNames: ['Engineer'],
      keywordNames: ['software'],
    });

    expect(programme.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          needsReview: true,
          reviewNotes: expect.stringContaining('Missing application deadline'),
        }),
      }),
    );
    expect(programme.update.mock.calls[0][0].data.reviewNotes).toContain(
      'Missing tuition fee',
    );
    expect(career.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { name: 'Engineer' },
      }),
    );
    expect(keyword.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { word: 'software' },
      }),
    );
  });
});

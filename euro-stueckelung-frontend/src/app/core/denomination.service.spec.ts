import { DenominationService, LocalDenominationService, RemoteDenominationService } from './denomination.service';
import { Breakdown, EuroDenomination } from './money';

describe('DenominationService', () => {
  let local: jasmine.SpyObj<LocalDenominationService>;
  let remote: jasmine.SpyObj<RemoteDenominationService>;
  let service: DenominationService;

  const makeBreakdown = (total: number, denomination: EuroDenomination, count: number): Breakdown => ({
    items: [{ denomination, count }],
    totalInCents: total,
  });

  beforeEach(() => {
    local = jasmine.createSpyObj<LocalDenominationService>('LocalDenominationService', ['denominate']);
    remote = jasmine.createSpyObj<RemoteDenominationService>('RemoteDenominationService', ['denominate']);
    service = new DenominationService(local, remote);
  });

  it('uses local strategy for frontend mode', async () => {
    const breakdown = makeBreakdown(100, 100, 1);
    local.denominate.and.resolveTo(breakdown);

    const result = await service.denominate(100);

    expect(local.denominate).toHaveBeenCalledWith(100);
    expect(result.breakdown).toEqual(breakdown);
    expect(result.diff).toEqual([{ denomination: 100, delta: 1 }]);
    expect(service.breakdown()).toEqual(breakdown);
    expect(service.error()).toBeNull();
  });

  it('keeps previous breakdown for diff calculation', async () => {
    const first = makeBreakdown(200, 200, 1);
    const second = makeBreakdown(100, 100, 1);
    local.denominate.and.resolveTo(first);

    await service.denominate(200);

    local.denominate.and.resolveTo(second);
    const result = await service.denominate(100);

    expect(result.diff).toEqual([
      { denomination: 200, delta: -1 },
      { denomination: 100, delta: 1 },
    ]);
  });

  it('uses remote strategy when mode is backend', async () => {
    service.setMode('backend');
    remote.denominate.and.rejectWith(new Error('Backend unavailable'));

    await expectAsync(service.denominate(100)).toBeRejectedWithError('Backend unavailable');

    expect(local.denominate).not.toHaveBeenCalled();
    expect(remote.denominate).toHaveBeenCalledWith(100);
    expect(service.error()).toBe('Backend unavailable');
  });
});

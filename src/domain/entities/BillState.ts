export enum BillStateEnum {
  Minted = 'Minted',
  InVault = 'InVault',
  Circulating = 'Circulating',
  Burned = 'Burned',
  Lost = 'Lost'
}

export class BillState {
  constructor(public readonly current: BillStateEnum) {}

  public transitionTo(newState: BillStateEnum): BillState {
    const validTransitions: Record<BillStateEnum, BillStateEnum[]> = {
      [BillStateEnum.Minted]: [BillStateEnum.InVault, BillStateEnum.Circulating],
      [BillStateEnum.InVault]: [BillStateEnum.Circulating, BillStateEnum.Burned],
      [BillStateEnum.Circulating]: [BillStateEnum.InVault, BillStateEnum.Lost, BillStateEnum.Burned],
      [BillStateEnum.Burned]: [],
      [BillStateEnum.Lost]: [BillStateEnum.Circulating, BillStateEnum.InVault]
    };

    if (!validTransitions[this.current].includes(newState)) {
      throw new Error(`Invalid state transition from ${this.current} to ${newState}`);
    }

    return new BillState(newState);
  }
}

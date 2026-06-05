import { BillSerialNumber } from './BillSerialNumber';
import { BillDenomination } from './BillDenomination';
import { BillDesign } from './BillDesign';
import { BillMaterial } from './BillMaterial';
import { BillState, BillStateEnum } from './BillState';

export class TrumpBill {
  constructor(
    public readonly id: string,
    public readonly serialNumber: BillSerialNumber,
    public readonly denomination: BillDenomination,
    public readonly design: BillDesign,
    public readonly material: BillMaterial,
    private _state: BillState
  ) {}

  get state(): BillState {
    return this._state;
  }

  public transitionState(newState: BillStateEnum): void {
    this._state = this._state.transitionTo(newState);
  }

  public static mint(
    id: string,
    serial: string,
    design: BillDesign,
    material: BillMaterial
  ): TrumpBill {
    return new TrumpBill(
      id,
      new BillSerialNumber(serial),
      new BillDenomination(),
      design,
      material,
      new BillState(BillStateEnum.Minted)
    );
  }
}

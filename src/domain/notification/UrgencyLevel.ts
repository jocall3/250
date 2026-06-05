export enum UrgencyLevelValue {
  INFO = 'INFO',
  WARNING = 'WARNING',
  CRITICAL = 'CRITICAL',
  PRESIDENTIAL = 'PRESIDENTIAL'
}

export class UrgencyLevel {
  private constructor(private readonly value: UrgencyLevelValue) {}

  public static info(): UrgencyLevel {
    return new UrgencyLevel(UrgencyLevelValue.INFO);
  }

  public static warning(): UrgencyLevel {
    return new UrgencyLevel(UrgencyLevelValue.WARNING);
  }

  public static critical(): UrgencyLevel {
    return new UrgencyLevel(UrgencyLevelValue.CRITICAL);
  }

  public static presidential(): UrgencyLevel {
    return new UrgencyLevel(UrgencyLevelValue.PRESIDENTIAL);
  }

  public static fromString(value: string): UrgencyLevel {
    const upper = value.toUpperCase();
    if (Object.values(UrgencyLevelValue).includes(upper as UrgencyLevelValue)) {
      return new UrgencyLevel(upper as UrgencyLevelValue);
    }
    throw new Error(`Invalid UrgencyLevel: ${value}`);
  }

  public getValue(): UrgencyLevelValue {
    return this.value;
  }

  public equals(other: UrgencyLevel): boolean {
    return this.value === other.value;
  }

  public isHigherPriorityThan(other: UrgencyLevel): boolean {
    const priorityMap: Record<UrgencyLevelValue, number> = {
      [UrgencyLevelValue.INFO]: 1,
      [UrgencyLevelValue.WARNING]: 2,
      [UrgencyLevelValue.CRITICAL]: 3,
      [UrgencyLevelValue.PRESIDENTIAL]: 4
    };
    return priorityMap[this.value] > priorityMap[other.value];
  }
}
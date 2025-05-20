type SpeedUnit = "KILOMETERS_PER_HOUR" | "MILES_PER_HOUR" | "METERS_PER_SECOND";

export class SpeedConverter {
  // Conversion factors relative to 1 kilometer per hour (KPH)
  private static conversionFactors = {
    KILOMETERS_PER_HOUR: 1,
    MILES_PER_HOUR: 0.621371,
    METERS_PER_SECOND: 0.277778,
  };

  /**
   * Converts a speed value from one unit to another.
   * @param value The speed value to convert.
   * @param from The unit of the input value.
   * @param to The unit to convert the value to.
   * @returns The converted speed value.
   */
  static convert(value: number, from: SpeedUnit, to: SpeedUnit): number {
    if (from === to) return value; // No conversion needed

    const fromFactor = this.conversionFactors[from];
    const toFactor = this.conversionFactors[to];

    // Convert value to KILOMETERS_PER_HOUR first, then to the target unit
    const valueInKph = value / fromFactor;
    return valueInKph * toFactor;
  }
}

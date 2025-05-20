import { getChangedFields } from "./getChangedFields";

describe("getChangedFields", () => {
  it("should return changed fields for primitive values", () => {
    const oldObj = {
      realtime: {
        throttle: 0,
        brake: 0.5,
      },
    };

    const newObj = {
      realtime: {
        throttle: 0.1,
        brake: 0.5,
      },
    };

    const fields = ["realtime.throttle", "realtime.brake"];

    const result = getChangedFields(fields, oldObj, newObj);

    expect(result).toEqual([["realtime.throttle", 0.1]]);
  });

  it("should return changed fields for nested objects", () => {
    const oldObj = {
      sessionInfo: {
        currentTime: 12319595719,
      },
    };

    const newObj = {
      sessionInfo: {
        currentTime: 12319595720,
      },
    };

    const fields = ["sessionInfo.currentTime"];

    const result = getChangedFields(fields, oldObj, newObj);

    expect(result).toEqual([["sessionInfo.currentTime", 12319595720]]);
  });

  it("should return changed fields for arrays", () => {
    const oldObj = {
      sessionInfo: {
        drivers: [
          { id: 1, name: "Jack", team: "Alpha" },
          { id: 2, name: "John", team: "Beta" },
        ],
      },
    };

    const newObj = {
      sessionInfo: {
        drivers: [
          { id: 1, name: "Jack", team: "Alpha" },
          { id: 2, name: "John", team: "Gamma" },
        ],
      },
    };

    const fields = ["sessionInfo.drivers[].team"];

    const result = getChangedFields(fields, oldObj, newObj);

    expect(result).toEqual([
      ["sessionInfo.drivers[].team", ["Alpha", "Gamma"]],
    ]);
  });

  it("should return an empty array if no fields have changed", () => {
    const oldObj = {
      realtime: {
        throttle: 0,
        brake: 0.5,
      },
    };

    const newObj = {
      realtime: {
        throttle: 0,
        brake: 0.5,
      },
    };

    const fields = ["realtime.throttle", "realtime.brake"];

    const result = getChangedFields(fields, oldObj, newObj);

    expect(result).toEqual([]);
  });

  it("should handle missing fields gracefully", () => {
    const oldObj = {
      realtime: {
        throttle: 0,
      },
    };

    const newObj = {
      realtime: {
        throttle: 0.1,
      },
    };

    const fields = ["realtime.throttle", "realtime.brake"];

    const result = getChangedFields(fields, oldObj, newObj);

    expect(result).toEqual([["realtime.throttle", 0.1]]);
  });

  it("should handle null values correctly", () => {
    const oldObj = {
      realtime: {
        throttle: null,
        brake: 0.5,
      },
    };

    const newObj = {
      realtime: {
        throttle: 0.1,
        brake: null,
      },
    };

    const fields = ["realtime.throttle", "realtime.brake"];

    const result = getChangedFields(fields, oldObj, newObj);

    expect(result).toEqual([
      ["realtime.throttle", 0.1],
      ["realtime.brake", null],
    ]);
  });

  it("should handle undefined values correctly", () => {
    const oldObj = {
      realtime: {
        throttle: undefined,
        brake: 0.5,
      },
    };

    const newObj = {
      realtime: {
        throttle: 0.1,
        brake: undefined,
      },
    };

    const fields = ["realtime.throttle", "realtime.brake"];

    const result = getChangedFields(fields, oldObj, newObj);

    expect(result).toEqual([
      ["realtime.throttle", 0.1],
      ["realtime.brake", undefined],
    ]);
  });

  it("should handle boolean values correctly", () => {
    const oldObj = {
      settings: {
        isEnabled: false,
        isVisible: true,
      },
    };

    const newObj = {
      settings: {
        isEnabled: true,
        isVisible: true,
      },
    };

    const fields = ["settings.isEnabled", "settings.isVisible"];

    const result = getChangedFields(fields, oldObj, newObj);

    expect(result).toEqual([["settings.isEnabled", true]]);
  });

  it("should handle number values correctly", () => {
    const oldObj = {
      stats: {
        speed: 100,
        rpm: 5000,
      },
    };

    const newObj = {
      stats: {
        speed: 120,
        rpm: 5000,
      },
    };

    const fields = ["stats.speed", "stats.rpm"];

    const result = getChangedFields(fields, oldObj, newObj);

    expect(result).toEqual([["stats.speed", 120]]);
  });

  it("should return changed fields when objects are not equal", () => {
    const oldObj = {
      realtime: {
        throttle: 0,
        brake: 0,
        steeringAngle: 0,
      },
    };

    const newObj = {
      realtime: {
        throttle: 0.5,
        brake: 0,
        steeringAngle: -15,
      },
    };

    const fields = ["realtime"];

    const result = getChangedFields(fields, oldObj, newObj);

    expect(result).toEqual([
      [
        "realtime",
        {
          throttle: 0.5,
          brake: 0,
          steeringAngle: -15,
        },
      ],
    ]);
  });

  it("should return empty array when objects are equal", () => {
    const oldObj = {
      realtime: {
        throttle: 0.5,
        brake: 0,
        steeringAngle: -15,
      },
    };

    const newObjWithSameFieldsAndValues = {
      realtime: {
        throttle: 0.5,
        brake: 0,
        steeringAngle: -15,
      },
    };

    const fields = ["realtime"];

    const result = getChangedFields(
      fields,
      oldObj,
      newObjWithSameFieldsAndValues,
    );

    expect(result).toEqual([]);
  });

  it("should handle a mix of null, undefined, and primitive values", () => {
    const oldObj = {
      data: {
        value1: null,
        value2: undefined,
        value3: 42,
      },
    };

    const newObj = {
      data: {
        value1: "newValue",
        value2: 0,
        value3: 42,
      },
    };

    const fields = ["data.value1", "data.value2", "data.value3"];

    const result = getChangedFields(fields, oldObj, newObj);

    expect(result).toEqual([
      ["data.value1", "newValue"],
      ["data.value2", 0],
    ]);
  });
});

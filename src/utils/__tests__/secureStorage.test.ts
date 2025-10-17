import { describe, it, expect } from "vitest";
import { secureStorage, setUserData, getUserData, setProjectData, getProjectData, setAppSetting, getAppSetting } from "../secureStorage";

describe("secureStorage", () => {
  it("should be importable", () => {
    // This test verifies that the secureStorage module can be imported without errors
    expect(true).toBe(true);
  });

  it("should have the expected interface", () => {
    // This test verifies that the secureStorage object has the expected methods
    expect(secureStorage).toBeDefined();
    expect(typeof secureStorage.setItem).toBe("function");
    expect(typeof secureStorage.getItem).toBe("function");
    expect(typeof secureStorage.removeItem).toBe("function");
    expect(typeof secureStorage.clear).toBe("function");
    expect(typeof secureStorage.setSecureItem).toBe("function");
    expect(typeof secureStorage.getSecureItem).toBe("function");
  });

  it("should have convenience functions", () => {
    // This test verifies that the convenience functions are exported
    expect(typeof setUserData).toBe("function");
    expect(typeof getUserData).toBe("function");
    expect(typeof setProjectData).toBe("function");
    expect(typeof getProjectData).toBe("function");
    expect(typeof setAppSetting).toBe("function");
    expect(typeof getAppSetting).toBe("function");
  });
});

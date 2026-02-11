import { formatTimestamp, truncateText, formatFileSize, highlightMentions, linkifyUrls, getMessagePreview } from "../utils/formatters";

describe("formatTimestamp", () => {
  it("should return 'just now' for recent timestamps", () => {
    const now = new Date();
    expect(formatTimestamp(now)).toBe("just now");
  });

  it("should return minutes ago for recent messages", () => {
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000);
    expect(formatTimestamp(fiveMinAgo)).toBe("5m ago");
  });

  it("should return hours ago within same day", () => {
    const threeHoursAgo = new Date(Date.now() - 3 * 3600 * 1000);
    expect(formatTimestamp(threeHoursAgo)).toBe("3h ago");
  });
});

describe("truncateText", () => {
  it("should not truncate short text", () => {
    expect(truncateText("hello", 10)).toBe("hello");
  });

  it("should truncate long text with ellipsis", () => {
    expect(truncateText("this is a long message", 10)).toBe("this is...");
  });

  it("should handle exact length", () => {
    expect(truncateText("hello", 5)).toBe("hello");
  });
});

describe("formatFileSize", () => {
  it("should format bytes", () => {
    expect(formatFileSize(0)).toBe("0 B");
    expect(formatFileSize(500)).toBe("500.0 B");
  });

  it("should format kilobytes", () => {
    expect(formatFileSize(1024)).toBe("1.0 KB");
    expect(formatFileSize(2048)).toBe("2.0 KB");
  });

  it("should format megabytes", () => {
    expect(formatFileSize(1048576)).toBe("1.0 MB");
  });
});

describe("highlightMentions", () => {
  it("should wrap mentions in span tags", () => {
    const result = highlightMentions("Hello @john!");
    expect(result).toContain("@john");
    expect(result).toContain("mention");
  });
});

describe("linkifyUrls", () => {
  it("should convert URLs to anchor tags", () => {
    const result = linkifyUrls("Visit https://example.com today");
    expect(result).toContain("<a href=");
    expect(result).toContain("https://example.com");
  });
});

describe("getMessagePreview", () => {
  it("should strip HTML tags", () => {
    const result = getMessagePreview("<b>Hello</b> world");
    expect(result).toBe("Hello world");
  });

  it("should truncate long previews", () => {
    const long = "a".repeat(100);
    const result = getMessagePreview(long, 50);
    expect(result.length).toBeLessThanOrEqual(50);
  });
});
/**
 * Performance monitoring utility
 */
export class ArchbasePerformanceMonitor {
  private static instance: ArchbasePerformanceMonitor;
  private marks: Map<string, number> = new Map();
  private measures: Map<string, number[]> = new Map();

  private constructor() {}

  static getInstance(): ArchbasePerformanceMonitor {
    if (!ArchbasePerformanceMonitor.instance) {
      ArchbasePerformanceMonitor.instance = new ArchbasePerformanceMonitor();
    }
    return ArchbasePerformanceMonitor.instance;
  }

  /**
   * Start measuring performance
   */
  start(label: string): void {
    this.marks.set(label, performance.now());
  }

  /**
   * End measurement and return duration
   */
  end(label: string): number | null {
    const startTime = this.marks.get(label);
    if (!startTime) {
      console.warn(`No start mark found for label: ${label}`);
      return null;
    }

    const duration = performance.now() - startTime;
    this.marks.delete(label);

    // Store measurement
    if (!this.measures.has(label)) {
      this.measures.set(label, []);
    }
    this.measures.get(label)!.push(duration);

    return duration;
  }

  /**
   * Get statistics for a label
   */
  getStats(label: string): {
    count: number;
    total: number;
    average: number;
    min: number;
    max: number;
    median: number;
  } | null {
    const measurements = this.measures.get(label);
    if (!measurements || measurements.length === 0) {
      return null;
    }

    const sorted = [...measurements].sort((a, b) => a - b);
    const count = measurements.length;
    const total = measurements.reduce((sum, val) => sum + val, 0);
    const average = total / count;
    const min = sorted[0] || 0;
    const max = sorted[count - 1] || 0;
    const median = count % 2 === 0
      ? ((sorted[count / 2 - 1] || 0) + (sorted[count / 2] || 0)) / 2
      : sorted[Math.floor(count / 2)] || 0;

    return { count, total, average, min, max, median };
  }

  /**
   * Clear all measurements
   */
  clear(label?: string): void {
    if (label) {
      this.measures.delete(label);
      this.marks.delete(label);
    } else {
      this.measures.clear();
      this.marks.clear();
    }
  }

  /**
   * Get all statistics
   */
  getAllStats(): Map<string, ReturnType<typeof this.getStats>> {
    const results = new Map();
    for (const [label] of this.measures) {
      const stats = this.getStats(label);
      if (stats) {
        results.set(label, stats);
      }
    }
    return results;
  }

  /**
   * Print performance report to console
   */
  report(): void {
    console.group('🚀 Performance Report');
    const allStats = this.getAllStats();
    
    for (const [label, stats] of allStats) {
      if (stats) {
        console.log(`%c${label}`, 'font-weight: bold');
        console.table({
          'Calls': stats.count,
          'Total (ms)': stats.total.toFixed(2),
          'Average (ms)': stats.average.toFixed(2),
          'Min (ms)': stats.min.toFixed(2),
          'Max (ms)': stats.max.toFixed(2),
          'Median (ms)': stats.median.toFixed(2)
        });
      }
    }
    console.groupEnd();
  }
}

export const performanceMonitor = ArchbasePerformanceMonitor.getInstance();
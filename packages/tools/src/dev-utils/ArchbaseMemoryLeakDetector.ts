import { emitDebugInfo } from '../debug/ArchbaseDebugPanel';

interface MemorySnapshot {
  id: string;
  timestamp: number;
  heapUsed: number;
  heapTotal: number;
  external: number;
  jsHeapSizeLimit: number;
  totalJSHeapSize: number;
  usedJSHeapSize: number;
}

interface LeakSuspicion {
  type: 'memory-growth' | 'heap-limit' | 'external-growth';
  severity: 'low' | 'medium' | 'high';
  message: string;
  trend: number[];
  recommendation: string;
}

/**
 * Memory leak detection utility for development
 */
export class ArchbaseMemoryLeakDetector {
  private static instance: ArchbaseMemoryLeakDetector;
  private snapshots: MemorySnapshot[] = [];
  private intervalId: number | null = null;
  private isMonitoring = false;
  private readonly maxSnapshots = 100;
  private readonly growthThreshold = 1.5; // 50% growth threshold
  private readonly criticalThreshold = 0.9; // 90% of heap limit

  private constructor() {}

  static getInstance(): ArchbaseMemoryLeakDetector {
    if (!ArchbaseMemoryLeakDetector.instance) {
      ArchbaseMemoryLeakDetector.instance = new ArchbaseMemoryLeakDetector();
    }
    return ArchbaseMemoryLeakDetector.instance;
  }

  /**
   * Start monitoring memory usage
   */
  startMonitoring(intervalMs = 5000): void {
    if (this.isMonitoring) return;

    this.isMonitoring = true;
    this.takeSnapshot();

    this.intervalId = window.setInterval(() => {
      this.takeSnapshot();
      this.analyzeMemoryPatterns();
    }, intervalMs);

    emitDebugInfo({
      type: 'performance',
      message: 'Memory leak detection started',
      data: { interval: intervalMs }
    });
  }

  /**
   * Stop monitoring
   */
  stopMonitoring(): void {
    if (!this.isMonitoring) return;

    this.isMonitoring = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    emitDebugInfo({
      type: 'performance',
      message: 'Memory leak detection stopped',
      data: { totalSnapshots: this.snapshots.length }
    });
  }

  /**
   * Take a memory snapshot
   */
  takeSnapshot(): MemorySnapshot | null {
    if (!this.isMemoryAPIAvailable()) {
      console.warn('Memory API not available in this browser');
      return null;
    }

    const memory = (performance as any).memory;
    const processMemory = (process as any)?.memoryUsage?.() || {};

    const snapshot: MemorySnapshot = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      heapUsed: processMemory.heapUsed || 0,
      heapTotal: processMemory.heapTotal || 0,
      external: processMemory.external || 0,
      jsHeapSizeLimit: memory?.jsHeapSizeLimit || 0,
      totalJSHeapSize: memory?.totalJSHeapSize || 0,
      usedJSHeapSize: memory?.usedJSHeapSize || 0
    };

    this.snapshots.push(snapshot);
    
    // Keep only recent snapshots
    if (this.snapshots.length > this.maxSnapshots) {
      this.snapshots.shift();
    }

    return snapshot;
  }

  /**
   * Analyze memory patterns for potential leaks
   */
  analyzeMemoryPatterns(): LeakSuspicion[] {
    if (this.snapshots.length < 5) return [];

    const suspicions: LeakSuspicion[] = [];
    const recent = this.snapshots.slice(-10);
    
    // Check for consistent memory growth
    const memoryGrowthSuspicion = this.checkMemoryGrowth(recent);
    if (memoryGrowthSuspicion) {
      suspicions.push(memoryGrowthSuspicion);
    }

    // Check for approaching heap limit
    const heapLimitSuspicion = this.checkHeapLimit(recent);
    if (heapLimitSuspicion) {
      suspicions.push(heapLimitSuspicion);
    }

    // Check for external memory growth
    const externalGrowthSuspicion = this.checkExternalGrowth(recent);
    if (externalGrowthSuspicion) {
      suspicions.push(externalGrowthSuspicion);
    }

    // Emit high-severity suspicions
    suspicions
      .filter(s => s.severity === 'high')
      .forEach(suspicion => {
        emitDebugInfo({
          type: 'performance',
          message: `Memory leak suspected: ${suspicion.message}`,
          data: suspicion
        });
      });

    return suspicions;
  }

  private checkMemoryGrowth(snapshots: MemorySnapshot[]): LeakSuspicion | null {
    const usedHeapSizes = snapshots.map(s => s.usedJSHeapSize || s.heapUsed);
    const firstValue = usedHeapSizes[0];
    const lastValue = usedHeapSizes[usedHeapSizes.length - 1];
    
    if (!firstValue || !lastValue || firstValue === 0 || lastValue === 0) return null;
    
    const growthRatio = lastValue / firstValue;
    
    if (growthRatio > this.growthThreshold) {
      const severity = growthRatio > 2 ? 'high' : growthRatio > 1.75 ? 'medium' : 'low';
      
      return {
        type: 'memory-growth',
        severity,
        message: `Memory usage increased by ${((growthRatio - 1) * 100).toFixed(1)}%`,
        trend: usedHeapSizes,
        recommendation: 'Check for memory leaks in event listeners, timers, or retained DOM references'
      };
    }
    
    return null;
  }

  private checkHeapLimit(snapshots: MemorySnapshot[]): LeakSuspicion | null {
    const latest = snapshots[snapshots.length - 1];
    
    if (!latest || latest.jsHeapSizeLimit === 0 || latest.usedJSHeapSize === 0) return null;
    
    const usageRatio = latest.usedJSHeapSize / latest.jsHeapSizeLimit;
    
    if (usageRatio > this.criticalThreshold) {
      return {
        type: 'heap-limit',
        severity: 'high',
        message: `Heap usage at ${(usageRatio * 100).toFixed(1)}% of limit`,
        trend: snapshots.map(s => s.usedJSHeapSize),
        recommendation: 'Consider force garbage collection or reducing memory usage'
      };
    }
    
    return null;
  }

  private checkExternalGrowth(snapshots: MemorySnapshot[]): LeakSuspicion | null {
    const externalMemory = snapshots.map(s => s.external).filter(v => v > 0);
    
    if (externalMemory.length < 2) return null;
    
    const firstValue = externalMemory[0];
    const lastValue = externalMemory[externalMemory.length - 1];
    if (!firstValue || !lastValue) return null;
    const growthRatio = lastValue / firstValue;
    
    if (growthRatio > this.growthThreshold) {
      return {
        type: 'external-growth',
        severity: growthRatio > 2 ? 'high' : 'medium',
        message: `External memory usage increased by ${((growthRatio - 1) * 100).toFixed(1)}%`,
        trend: externalMemory,
        recommendation: 'Check for growing buffers, file handles, or external resources'
      };
    }
    
    return null;
  }

  /**
   * Force garbage collection (Chrome DevTools only)
   */
  forceGarbageCollection(): boolean {
    if (typeof (window as any).gc === 'function') {
      (window as any).gc();
      this.takeSnapshot();
      emitDebugInfo({
        type: 'performance',
        message: 'Garbage collection forced',
        data: { timestamp: Date.now() }
      });
      return true;
    }
    return false;
  }

  /**
   * Get memory usage statistics
   */
  getMemoryStats(): {
    current: MemorySnapshot | null;
    peak: MemorySnapshot | null;
    average: number;
    growth: number;
    suspicions: LeakSuspicion[];
  } {
    if (this.snapshots.length === 0) {
      return {
        current: null,
        peak: null,
        average: 0,
        growth: 0,
        suspicions: []
      };
    }

    const current = this.snapshots[this.snapshots.length - 1] || null;
    const peak = this.snapshots.reduce((max, snapshot) => 
      (snapshot.usedJSHeapSize || snapshot.heapUsed) > (max?.usedJSHeapSize || max?.heapUsed || 0) 
        ? snapshot 
        : max
    ) || null;

    const memoryValues = this.snapshots.map(s => s.usedJSHeapSize || s.heapUsed);
    const average = memoryValues.reduce((sum, val) => sum + val, 0) / memoryValues.length;
    
    const firstValue = memoryValues[0] || 0;
    const lastValue = memoryValues[memoryValues.length - 1] || 0;
    const growth = firstValue > 0 ? ((lastValue - firstValue) / firstValue) * 100 : 0;

    return {
      current,
      peak,
      average,
      growth,
      suspicions: this.analyzeMemoryPatterns()
    };
  }

  /**
   * Get all snapshots
   */
  getSnapshots(): MemorySnapshot[] {
    return [...this.snapshots];
  }

  /**
   * Clear all snapshots
   */
  clearSnapshots(): void {
    this.snapshots = [];
  }

  /**
   * Export memory data
   */
  exportData(): string {
    const stats = this.getMemoryStats();
    return JSON.stringify({
      snapshots: this.snapshots,
      stats,
      exportedAt: new Date().toISOString()
    }, null, 2);
  }

  private isMemoryAPIAvailable(): boolean {
    return typeof performance !== 'undefined' && 
           ((performance as any).memory || (typeof process !== 'undefined' && process.memoryUsage));
  }

  /**
   * Check if monitoring is active
   */
  isActive(): boolean {
    return this.isMonitoring;
  }
}

export const memoryLeakDetector = ArchbaseMemoryLeakDetector.getInstance();
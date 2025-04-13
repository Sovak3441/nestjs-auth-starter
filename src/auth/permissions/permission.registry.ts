export class PermissionRegistry {
  private static registry = new Map<string, string[]>(); // module → permissions[]

  static register(module: string, permissions: string[]) {
    const normalized = permissions.map(p => `${module.toUpperCase()}_${p.toUpperCase()}`);
    const existing = this.registry.get(module) || [];
    this.registry.set(module, [...new Set([...existing, ...normalized])]);
  }

  static getAll(): string[] {
    return Array.from(this.registry.values()).flat();
  }

  static getByModule(): Record<string, string[]> {
    return Object.fromEntries(this.registry.entries());
  }

  static clear(): void {
    this.registry.clear();
  }
}

// Simple implementación del patrón Composite para representar componentes de servicio
export interface ServiceComponent {
  getName(): string;
  getCost(): number; // costo mensual en USD
  add?(component: ServiceComponent): void;
  remove?(component: ServiceComponent): void;
}

export class ServiceLeaf implements ServiceComponent {
  constructor(private readonly name: string, private readonly cost: number) {}

  getName(): string {
    return this.name;
  }

  getCost(): number {
    return this.cost;
  }
}

export class ServiceComposite implements ServiceComponent {
  private readonly children: ServiceComponent[] = [];

  constructor(private readonly name: string) {}

  getName(): string {
    return this.name;
  }

  add(component: ServiceComponent): void {
    this.children.push(component);
  }

  remove(component: ServiceComponent): void {
    const idx = this.children.indexOf(component);
    if (idx >= 0) this.children.splice(idx, 1);
  }

  getCost(): number {
    return this.children.reduce((sum, c) => sum + c.getCost(), 0);
  }

  getChildren(): ServiceComponent[] {
    return [...this.children];
  }
}

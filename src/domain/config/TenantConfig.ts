export class TenantConfig {
  constructor(public readonly tenantId: string, public readonly branding: Record<string, string>, public readonly features: string[]) {}
}
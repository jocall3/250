export class NotificationTemplate {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly subjectTemplate: string,
    public readonly bodyTemplate: string,
    public readonly requiredVariables: string[]
  ) {}

  public render(variables: Record<string, string>): { subject: string; body: string } {
    this.validateVariables(variables);
    
    let subject = this.subjectTemplate;
    let body = this.bodyTemplate;

    for (const [key, val] of Object.entries(variables)) {
      subject = subject.replace(new RegExp(`{{${key}}}`, 'g'), val);
      body = body.replace(new RegExp(`{{${key}}}`, 'g'), val);
    }

    return { subject, body };
  }

  private validateVariables(variables: Record<string, string>): void {
    const missing = this.requiredVariables.filter(v => !(v in variables));
    if (missing.length > 0) {
      throw new Error(`Missing required template variables: ${missing.join(', ')}`);
    }
  }
}
import { Request, Response, NextFunction } from 'express';

export class WafMiddleware {
  private static readonly SQL_INJECTION_PATTERNS = [
    /\b(union|select|insert|update|delete|drop|alter|truncate)\b/i,
    /exec\s*\(|sp_executesql/i,
    /['"]\s*(or|and)\s+['"]?\d+['"]?\s*=\s*['"]?\d+/i,
    /--|#|\/\*/
  ];

  private static readonly XSS_PATTERNS = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript\s*:/i,
    /onerror\s*=|onload\s*=|onclick\s*=/i,
    /<iframe|<object|<embed|<applet/i
  ];

  private static readonly LFI_RFI_PATTERNS = [
    /\.\.\/\.\./,
    /etc\/passwd/i,
    /boot\.ini/i,
    /https?:\/\/[^\s/$.?#].[^\s]*/i
  ];

  private static readonly COMMAND_INJECTION_PATTERNS = [
    /;\s*(cat|ls|pwd|whoami|id|netstat|ping|curl|wget)\b/i,
    /\|\s*(cat|ls|pwd|whoami|id|netstat|ping|curl|wget)\b/i,
    /&\s*(cat|ls|pwd|whoami|id|netstat|ping|curl|wget)\b/i
  ];

  public static handle(req: Request, res: Response, next: NextFunction): void {
    const inputs = [
      JSON.stringify(req.query),
      JSON.stringify(req.body),
      JSON.stringify(req.headers),
      decodeURIComponent(req.url)
    ];

    for (const input of inputs) {
      if (!input) continue;

      for (const pattern of WafMiddleware.SQL_INJECTION_PATTERNS) {
        if (pattern.test(input)) {
          res.status(403).json({ error: 'Request blocked by WAF: SQL Injection detected.' });
          return;
        }
      }

      for (const pattern of WafMiddleware.XSS_PATTERNS) {
        if (pattern.test(input)) {
          res.status(403).json({ error: 'Request blocked by WAF: Cross-Site Scripting detected.' });
          return;
        }
      }

      for (const pattern of WafMiddleware.LFI_RFI_PATTERNS) {
        if (pattern.test(input)) {
          res.status(403).json({ error: 'Request blocked by WAF: File Inclusion attempt detected.' });
          return;
        }
      }

      for (const pattern of WafMiddleware.COMMAND_INJECTION_PATTERNS) {
        if (pattern.test(input)) {
          res.status(403).json({ error: 'Request blocked by WAF: Command Injection detected.' });
          return;
        }
      }
    }

    next();
  }
}
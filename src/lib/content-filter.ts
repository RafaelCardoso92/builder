// Content filter to prevent PII and identifying information in bad payer reports
// This helps protect privacy and prevent defamation claims

const PHONE_PATTERNS = [
  /\b07\d{3}\s?\d{6}\b/gi,           // UK mobile
  /\b0[1-9]\d{2,4}\s?\d{6}\b/gi,     // UK landline
  /\+44\s?\d{10,11}\b/gi,            // International UK
];

const EMAIL_PATTERN = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/gi;

// Full postcodes (we only allow the first part like "SW1")
const FULL_POSTCODE_PATTERN = /\b[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}\b/gi;

const SOCIAL_MEDIA_PATTERNS = [
  /@[A-Za-z0-9_]{1,30}/g,            // @ handles
  /facebook\.com\/[A-Za-z0-9.]+/gi,
  /twitter\.com\/[A-Za-z0-9_]+/gi,
  /instagram\.com\/[A-Za-z0-9_.]+/gi,
  /linkedin\.com\/in\/[A-Za-z0-9-]+/gi,
];

// Vehicle registration
const VEHICLE_REG_PATTERN = /\b[A-Z]{2}\d{2}\s?[A-Z]{3}\b/gi;

// Street addresses
const ADDRESS_PATTERNS = [
  /\b\d+[A-Za-z]?\s+[A-Za-z]+\s+(street|st|road|rd|avenue|ave|lane|ln|drive|dr|close|cl|way|court|ct|place|pl|crescent|cres)\b/gi,
  /\bflat\s+\d+[A-Za-z]?\b/gi,
  /\bunit\s+\d+[A-Za-z]?\b/gi,
];

// Names with titles
const TITLED_NAME_PATTERN = /\b(mr|mrs|ms|miss|dr|prof)\.?\s+[A-Z][a-z]+(\s+[A-Z][a-z]+)?\b/gi;

export interface FilterResult {
  isValid: boolean;
  issues: FilterIssue[];
}

export interface FilterIssue {
  field: string;
  type: string;
  message: string;
  matches?: string[];
}

function findMatches(text: string, patterns: RegExp[]): string[] {
  const matches: string[] = [];
  for (const pattern of patterns) {
    const found = text.match(pattern);
    if (found) {
      matches.push(...found);
    }
  }
  return [...new Set(matches)];
}

function checkText(text: string, fieldName: string): FilterIssue[] {
  const issues: FilterIssue[] = [];

  // Phone numbers
  const phoneMatches = findMatches(text, PHONE_PATTERNS);
  if (phoneMatches.length > 0) {
    issues.push({
      field: fieldName,
      type: 'PHONE_NUMBER',
      message: 'Phone numbers are not allowed',
      matches: phoneMatches,
    });
  }

  // Email addresses
  const emailMatches = text.match(EMAIL_PATTERN);
  if (emailMatches) {
    issues.push({
      field: fieldName,
      type: 'EMAIL',
      message: 'Email addresses are not allowed',
      matches: emailMatches,
    });
  }

  // Full postcodes
  const postcodeMatches = text.match(FULL_POSTCODE_PATTERN);
  if (postcodeMatches) {
    issues.push({
      field: fieldName,
      type: 'FULL_POSTCODE',
      message: 'Full postcodes are not allowed. Only use the first part (e.g., "SW1" instead of "SW1A 1AA")',
      matches: postcodeMatches,
    });
  }

  // Social media
  const socialMatches = findMatches(text, SOCIAL_MEDIA_PATTERNS);
  if (socialMatches.length > 0) {
    issues.push({
      field: fieldName,
      type: 'SOCIAL_MEDIA',
      message: 'Social media handles and links are not allowed',
      matches: socialMatches,
    });
  }

  // Vehicle registration
  const vehicleMatches = text.match(VEHICLE_REG_PATTERN);
  if (vehicleMatches) {
    issues.push({
      field: fieldName,
      type: 'VEHICLE_REG',
      message: 'Vehicle registration numbers are not allowed',
      matches: vehicleMatches,
    });
  }

  // Street addresses
  const addressMatches = findMatches(text, ADDRESS_PATTERNS);
  if (addressMatches.length > 0) {
    issues.push({
      field: fieldName,
      type: 'ADDRESS',
      message: 'Specific street addresses are not allowed',
      matches: addressMatches,
    });
  }

  // Titled names
  const nameMatches = text.match(TITLED_NAME_PATTERN);
  if (nameMatches) {
    issues.push({
      field: fieldName,
      type: 'PERSONAL_NAME',
      message: 'Personal names with titles (Mr, Mrs, etc.) are not allowed',
      matches: nameMatches,
    });
  }

  return issues;
}

export function filterReportContent(data: {
  workDescription: string;
  locationArea: string;
  communicationSummary?: string;
}): FilterResult {
  const issues: FilterIssue[] = [];

  issues.push(...checkText(data.workDescription, 'workDescription'));
  issues.push(...checkText(data.locationArea, 'locationArea'));

  if (data.communicationSummary) {
    issues.push(...checkText(data.communicationSummary, 'communicationSummary'));
  }

  return {
    isValid: issues.length === 0,
    issues,
  };
}

export function generateFilterErrorMessage(issues: FilterIssue[]): string {
  const grouped = issues.reduce((acc, issue) => {
    if (!acc[issue.field]) {
      acc[issue.field] = [];
    }
    acc[issue.field].push(issue.message);
    return acc;
  }, {} as Record<string, string[]>);

  const fieldLabels: Record<string, string> = {
    workDescription: 'Work description',
    locationArea: 'Location area',
    communicationSummary: 'Communication summary',
  };

  const parts = Object.entries(grouped).map(([field, messages]) => {
    const label = fieldLabels[field] || field;
    return `${label}: ${messages.join('; ')}`;
  });

  return `Your report contains identifying information that must be removed:\n${parts.join('\n')}`;
}
